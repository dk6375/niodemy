import { createClient } from '@/lib/supabase/server'

/** Get upcoming/scheduled live classes */
export async function getUpcomingLiveClasses(limit = 20) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('live_classes')
    .select('id, slug, title, description, teacher_name, scheduled_at, duration_minutes, status, segment, subject, is_featured')
    .in('status', ['scheduled', 'live'])
    .order('scheduled_at', { ascending: true })
    .limit(limit)
  return data || []
}

/** Get past/ended live classes */
export async function getPastLiveClasses(limit = 20) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('live_classes')
    .select('id, slug, title, description, teacher_name, scheduled_at, duration_minutes, status, segment, subject')
    .eq('status', 'ended')
    .order('scheduled_at', { ascending: false })
    .limit(limit)
  return data || []
}

/** Get live class by ID or slug (full detail) */
export async function getLiveClassBySlug(slugOrId: string) {
  const supabase = await createClient()
  // Try by id first (UUID), then by slug
  const { data } = await supabase
    .from('live_classes')
    .select('*')
    .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
    .single()
  return data
}
