import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/search?q=query
 * Unified search across: concepts, content, questions, GK events, Atlas books.
 * Returns results grouped by type.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({
      concepts: [],
      content: [],
      questions: [],
      events: [],
      books: [],
      total: 0,
    })
  }

  const supabase = await createClient()
  const query = q.toLowerCase()

  // Search in parallel across all entity types
  const [concepts, content, questions, events, books] = await Promise.all([
    // Concepts
    supabase
      .from('concepts')
      .select('id, slug, title, subject, summary')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,subject.ilike.%${query}%`)
      .limit(5),

    // Content assets
    supabase
      .from('content_assets')
      .select('id, slug, title, type, segment, concepts(slug, title)')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,body_md.ilike.%${query}%`)
      .limit(5),

    // Questions
    supabase
      .from('questions')
      .select('id, body, subject, difficulty, type, concepts(slug, title)')
      .eq('status', 'published')
      .or(`body.ilike.%${query}%,subject.ilike.%${query}%`)
      .limit(5),

    // GK current events
    supabase
      .from('current_events')
      .select('id, slug, title, summary, category, event_date')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,body_md.ilike.%${query}%`)
      .limit(5),

    // Atlas books
    supabase
      .from('books')
      .select('id, slug, title, subject, class_ref, board_ref')
      .eq('status', 'active')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,subject.ilike.%${query}%`)
      .limit(5),
  ])

  const result = {
    concepts: concepts.data || [],
    content: content.data || [],
    questions: questions.data || [],
    events: events.data || [],
    books: books.data || [],
    total:
      (concepts.data?.length || 0) +
      (content.data?.length || 0) +
      (questions.data?.length || 0) +
      (events.data?.length || 0) +
      (books.data?.length || 0),
  }

  return NextResponse.json(result)
}
