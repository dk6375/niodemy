import { createClient } from '@/lib/supabase/server'

/** Get all current events (optionally filtered by category), most recent first */
export async function getCurrentEvents(category?: string, limit = 20) {
  const supabase = await createClient()
  let query = supabase
    .from('current_events')
    .select('id, slug, title, summary, category, event_date, source_name, gk_relevance')
    .eq('status', 'published')
    .order('event_date', { ascending: false })
    .limit(limit)

  if (category) {
    query = query.eq('category', category)
  }

  const { data } = await query
  return data || []
}

/** Get event by slug (full content) */
export async function getEventBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('current_events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return data
}

/** Get events for a specific exam (exam-centric) */
export async function getEventsForExam(examId: string, limit = 15) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('event_exams')
    .select(`
      relevance,
      current_events!inner(id, slug, title, summary, category, event_date, source_name)
    `)
    .eq('exam_id', examId)
    .limit(limit)
  // Sort client-side by event_date desc
  return (data || [])
    .map((e: any) => ({ ...e.current_events, relevance: e.relevance }))
    .sort((a: any, b: any) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
}

/** Get categories with counts */
export async function getCategoriesWithCounts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('current_events')
    .select('category')
    .eq('status', 'published')

  const counts: Record<string, number> = {}
  for (const e of data || []) {
    counts[e.category] = (counts[e.category] || 0) + 1
  }
  return counts
}

/** Get concepts linked to an event */
export async function getEventConcepts(eventId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('event_concepts')
    .select(`
      concepts!inner(id, slug, title, subject)
    `)
    .eq('event_id', eventId)
  return (data || []).map((ec: any) => ec.concepts)
}

/** Get exams linked to an event */
export async function getEventExams(eventId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('event_exams')
    .select(`
      relevance,
      exams!inner(id, slug, name, category)
    `)
    .eq('event_id', eventId)
  return (data || []).map((e: any) => ({ ...e.exams, relevance: e.relevance }))
}
