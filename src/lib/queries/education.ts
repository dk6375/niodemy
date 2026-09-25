import { createClient } from '@/lib/supabase/server'

/** Get all classes for school segment (Class 6-10) */
export async function getSchoolClasses() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('classes')
    .select(`
      id, name, level, segment,
      boards!inner(name, slug)
    `)
    .eq('segment', 'school')
    .order('level')
  return data || []
}

/** Get class by level (e.g., 8 → Class 8) */
export async function getClassByLevel(level: number) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('classes')
    .select(`
      id, name, level, segment,
      boards!inner(name, slug, full_name)
    `)
    .eq('segment', 'school')
    .eq('level', level)
    .single()
  return data
}

/** Get curriculums (subjects) for a class */
export async function getCurriculumsForClass(classId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('curriculums')
    .select(`
      id, subject, academic_year, status
    `)
    .eq('class_id', classId)
    .eq('status', 'active')
    .order('subject')
  return data || []
}

/** Get curriculum concepts grouped by chapter */
export async function getCurriculumConceptsGrouped(curriculumId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('curriculum_concepts')
    .select(`
      depth_required, importance, chapter_name, order_index,
      concepts!inner(id, slug, title, subject, summary)
    `)
    .eq('curriculum_id', curriculumId)
    .order('chapter_name')
    .order('order_index')

  // Group by chapter
  const grouped: Record<string, any[]> = {}
  for (const cc of data || []) {
    const chapter = (cc as any).chapter_name || 'General'
    if (!grouped[chapter]) grouped[chapter] = []
    grouped[chapter].push(cc)
  }
  return grouped
}

/** Get curriculum by ID */
export async function getCurriculumById(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('curriculums')
    .select(`
      id, subject, academic_year, status,
      classes!inner(name, level, segment, boards!inner(name, slug, full_name))
    `)
    .eq('id', id)
    .single()
  return data
}
