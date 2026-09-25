import { createClient } from '@/lib/supabase/server'

/** Get all skill tracks */
export async function getSkillTracks() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('skill_tracks')
    .select('id, slug, name, short_name, description, icon, level, total_modules, estimated_hours, tags')
    .eq('status', 'active')
    .order('name')
  return data || []
}

/** Get skill track by slug */
export async function getSkillTrackBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('skill_tracks')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()
  return data
}

/** Get modules for a skill track */
export async function getSkillModules(trackId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('skill_modules')
    .select('id, module_number, title, slug, description, is_interactive, estimated_minutes')
    .eq('track_id', trackId)
    .order('module_number')
  return data || []
}

/** Get skill module by track slug + module slug */
export async function getSkillModule(trackSlug: string, moduleSlug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('skill_modules')
    .select(`
      id, module_number, title, slug, description, body_md, is_interactive, example_code, estimated_minutes,
      skill_tracks!inner(id, slug, name, short_name)
    `)
    .eq('slug', moduleSlug)
    .eq('skill_tracks.slug', trackSlug)
    .single()
  return data
}
