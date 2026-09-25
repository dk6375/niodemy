/**
 * AI Doubt Auto-Reply
 *
 * When a student asks a doubt in chapter doubt chat:
 * 1. If a teacher is online → notify teacher, wait for response
 * 2. If no teacher responds within 30s → AI responds automatically
 * 3. AI response is marked as "AI-generated" (transparency)
 * 4. Teacher can later review and add to/correct AI response
 *
 * This is the lib/ai/doubt-response.ts file from the plan.
 */

import { createClient } from '@/lib/supabase/server'
import ZAI from 'z-ai-web-dev-sdk'

interface DoubtResponse {
  reply: string
  isAi: boolean
}

/**
 * Generate AI response for a student doubt in a chapter context.
 * Context-aware: knows concept details for accurate responses.
 */
export async function generateDoubtResponse(
  doubt: string,
  conceptId?: string
): Promise<string> {
  const supabase = await createClient()

  // Build context from concept if available
  let systemContext = ''
  if (conceptId) {
    const { data: concept } = await supabase
      .from('concepts')
      .select('title, subject, summary, content_json, depth_layers')
      .eq('id', conceptId)
      .single()

    if (concept) {
      systemContext = `\n\nThe student is studying: ${concept.title} (${concept.subject}).
Concept summary: ${concept.summary || 'N/A'}
Key facts: ${JSON.stringify(concept.content_json?.key_facts || [])}
Please tailor your answer to this concept context.`
    }
  }

  try {
    const zai = await ZAI.create()
    const response = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are Niodemy's AI Doubt Assistant. A student has asked a doubt in a chapter chat. Help them understand clearly. Be concise, encouraging, and explain in simple language (mix Hindi/English if the student does). If you don't know something, say so honestly.${systemContext}`,
        },
        { role: 'user', content: doubt },
      ],
      thinking: { type: 'disabled' },
    })

    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
  } catch (e: any) {
    console.error('AI doubt response error:', e)
    return 'Sorry, I am unable to respond right now. Please try again or ask a teacher.'
  }
}

/**
 * Auto-respond to a doubt if no teacher has replied within timeout.
 * Called by Socket.io service when a new doubt message is received.
 */
export async function autoRespondToDoubt(
  roomId: string,
  doubt: string,
  conceptId?: string
): Promise<void> {
  // Wait 30 seconds for teacher to respond
  await new Promise(resolve => setTimeout(resolve, 30000))

  const supabase = await createClient()

  // Check if a teacher/admin has already responded
  const { data: responses } = await supabase
    .from('chat_messages')
    .select('sender_type')
    .eq('room_id', roomId)
    .eq('sender_type', 'teacher')
    .limit(1)

  if (responses && responses.length > 0) {
    // Teacher already responded, skip AI auto-reply
    return
  }

  // Generate AI response
  const aiReply = await generateDoubtResponse(doubt, conceptId)

  // Insert AI response as a message
  await supabase.from('chat_messages').insert({
    room_id: roomId,
    user_id: null,
    sender_type: 'ai',
    sender_name: 'AI Assistant',
    body: aiReply,
    ai_metadata: {
      model: 'z-ai-doubt',
      auto_reply: true,
      original_doubt: doubt,
    },
  })
}
