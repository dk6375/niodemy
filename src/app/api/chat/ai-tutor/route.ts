import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/console/rbac'
import ZAI from 'z-ai-web-dev-sdk'

/**
 * POST /api/chat/ai-tutor
 * Body: { roomId, message, contextType?, contextId? }
 *
 * AI tutor response using z-ai-web-dev-sdk.
 * Context-aware: if contextId is a concept, fetches concept details for context.
 */
export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { roomId, message, contextType, contextId } = body

  if (!roomId || !message) {
    return NextResponse.json({ error: 'roomId and message required' }, { status: 400 })
  }

  const supabase = await createClient()

  // Build context-aware system prompt
  let systemContext = ''
  if (contextType === 'concept' && contextId) {
    const { data: concept } = await supabase
      .from('concepts')
      .select('title, subject, summary, content_json, depth_layers')
      .eq('id', contextId)
      .single()

    if (concept) {
      systemContext = `\n\nYou are helping a student learn: ${concept.title} (${concept.subject}).
Concept summary: ${concept.summary || 'N/A'}
Key facts: ${JSON.stringify(concept.content_json?.key_facts || [])}
Depth layers: ${JSON.stringify(concept.depth_layers || {})}
Tailor your answer to this concept.`
    }
  }

  // Fetch user's progress for personalization
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('target_name, segment')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(5)

  const goalsContext = enrollments && enrollments.length > 0
    ? `\n\nStudent's active goals: ${enrollments.map((e: any) => e.target_name).join(', ')}.`
    : ''

  try {
    const zai = await ZAI.create()
    const response = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are Niodemy's AI Tutor — a helpful, encouraging educational assistant for Indian students. You explain concepts clearly in simple language (mix Hindi/English if the student does). Be concise but thorough. If you don't know something, say so.${systemContext}${goalsContext}`,
        },
        { role: 'user', content: message },
      ],
      thinking: { type: 'disabled' },
    })

    const aiResponse = response.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    // Persist AI message
    const { data: aiMsg, error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        user_id: null,
        sender_type: 'ai',
        sender_name: 'AI Tutor',
        body: aiResponse,
        ai_metadata: {
          model: 'z-ai',
          context: contextType || 'general',
        },
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: aiMsg })
  } catch (e: any) {
    console.error('AI tutor error:', e)
    return NextResponse.json(
      { error: 'AI service error: ' + e.message },
      { status: 500 }
    )
  }
}
