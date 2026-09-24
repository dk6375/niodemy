import { createClient } from '@/lib/supabase/server'

export interface Concept {
  id: string
  slug: string
  title: string
  subject: string
  domain: string | null
  summary: string | null
  content_json: any
  depth_layers: any
  status: string
}

export interface ContentAsset {
  id: string
  type: string
  title: string
  slug: string
  body_md: string | null
  concept_id: string | null
  segment: string
  status: string
}

export interface Question {
  id: string
  type: string
  body: string
  body_json: any
  options_json: any
  correct_answer: string | null
  explanation: string | null
  concept_id: string | null
  subject: string | null
  difficulty: number
  exam_format: string
  source: string | null
  source_ref: string | null
}

/** Get a published concept by slug */
export async function getConceptBySlug(slug: string): Promise<Concept | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('concepts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return data as Concept | null
}

/** Get all published concepts (optionally filtered by subject) */
export async function getPublishedConcepts(subject?: string): Promise<Concept[]> {
  const supabase = await createClient()
  let query = supabase
    .from('concepts')
    .select('*')
    .eq('status', 'published')
    .order('subject')
    .order('title')

  if (subject) {
    query = query.eq('subject', subject)
  }

  const { data } = await query
  return (data ?? []) as Concept[]
}

/** Get content assets for a concept */
export async function getContentForConcept(conceptId: string): Promise<ContentAsset[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('content_assets')
    .select('*')
    .eq('concept_id', conceptId)
    .eq('status', 'published')
    .order('created_at')
  return (data ?? []) as ContentAsset[]
}

/** Get questions for a concept */
export async function getQuestionsForConcept(conceptId: string): Promise<Question[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('questions')
    .select('*')
    .eq('concept_id', conceptId)
    .eq('status', 'published')
    .order('difficulty')
  return (data ?? []) as Question[]
}

/** Get all distinct subjects (for browse) */
export async function getSubjects(): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('concepts')
    .select('subject')
    .eq('status', 'published')
    .order('subject')

  const subjects = [...new Set((data ?? []).map((c: any) => c.subject))]
  return subjects
}
