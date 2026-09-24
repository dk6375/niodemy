import { createClient } from '@/lib/supabase/server'

/** Get all degrees */
export async function getDegrees() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('degrees')
    .select('id, slug, name, short_name, level, duration_years, total_semesters, field, description')
    .eq('status', 'active')
    .order('level')
    .order('name')
  return data || []
}

/** Get degree by slug */
export async function getDegreeBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('degrees')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()
  return data
}

/** Get semesters for a degree */
export async function getSemestersForDegree(degreeId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('semesters')
    .select('id, semester_number, year, title')
    .eq('degree_id', degreeId)
    .order('semester_number')
  return data || []
}

/** Get subjects for a semester */
export async function getSemesterSubjects(semesterId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('semester_subjects')
    .select('id, subject_code, subject_name, credits, subject_type, description')
    .eq('semester_id', semesterId)
    .order('subject_code')
  return data || []
}

/** Get semester by degree slug + semester number */
export async function getSemesterByDegree(slug: string, semesterNumber: number) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('semesters')
    .select(`
      id, semester_number, year, title,
      degrees!inner(id, slug, name, short_name, level, duration_years)
    `)
    .eq('degrees.slug', slug)
    .eq('semester_number', semesterNumber)
    .single()
  return data
}
