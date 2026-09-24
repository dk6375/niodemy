/**
 * Syllabus-Merge Combined Course Engine (Coaching segment)
 *
 * For student with goals like [RRB Group D, SSC GD, MP Police Constable]
 * Different exams, different syllabi — union them, dedupe common concepts.
 *
 * Algorithm:
 * 1. Get all exam_concepts for all selected exams
 * 2. Union + dedupe: same concept → take MAX depth + MAX importance
 * 3. Compute overlap stats (for the "72% common" pitch)
 * 4. Subtract already-mastered (Knowledge Passport — "don't teach me twice")
 * 5. Add prerequisites recursively
 * 6. Topological sort by prerequisite graph
 * 7. Priority rank: exam_weight × goal_priority × gap × importance
 * 8. Return combined course with overlap stats per exam
 */

import { createClient } from '@/lib/supabase/server'

export interface SyllabusMergeConcept {
  id: string
  slug: string
  title: string
  subject: string  // concept's own subject
  summary: string | null
  target_depth: number
  importance: string
  exam_subjects: { exam_id: string; exam_name: string; exam_slug: string; subject: string; depth_required: number; importance: string }[]
  mastery: number | null
  status: string | null
  in_exams_count: number  // how many of the selected exams include this concept
}

export interface SyllabusMergeResult {
  concepts: SyllabusMergeConcept[]
  total_concepts: number
  mastered_concepts: number
  pending_concepts: number
  overlap_stats: {
    total: number
    common_to_all: number  // in ALL selected exams
    common_to_some: number  // in 2+ but not all
    unique: number  // in only 1 exam
    per_exam: { exam_id: string; exam_name: string; total: number; unique: number }[]
    overlap_percent: number  // % common (pitch metric)
  }
  exams: { id: string; name: string; slug: string }[]
  mode: 'syllabus-merge'
}

export async function generateSyllabusMergeCombinedCourse(
  userId: string,
  examIds: string[]
): Promise<SyllabusMergeResult | null> {
  const supabase = await createClient()

  if (examIds.length === 0) return null

  // 1. Get all exam_concepts for all selected exams
  const { data: examConcepts, error: ecErr } = await supabase
    .from('exam_concepts')
    .select(`
      concept_id,
      depth_required,
      importance,
      subject,
      exam_id,
      exams!inner(name, slug)
    `)
    .in('exam_id', examIds)

  if (ecErr || !examConcepts || examConcepts.length === 0) {
    console.error('Error fetching exam concepts:', ecErr)
    return null
  }

  // Get exam details
  const { data: examsData } = await supabase
    .from('exams')
    .select('id, name, slug')
    .in('id', examIds)
  const exams = (examsData || []).map((e: any) => ({ id: e.id, name: e.name, slug: e.slug }))

  // 2. Union + dedupe: same concept → take MAX depth + MAX importance
  const conceptMap = new Map<string, SyllabusMergeConcept>()
  for (const ec of examConcepts as any[]) {
    const conceptId = ec.concept_id
    const examInfo = {
      exam_id: ec.exam_id,
      exam_name: ec.exams?.name || 'Unknown',
      exam_slug: ec.exams?.slug || 'unknown',
      subject: ec.subject || 'General',
      depth_required: ec.depth_required,
      importance: ec.importance,
    }

    const existing = conceptMap.get(conceptId)
    if (!existing) {
      conceptMap.set(conceptId, {
        id: conceptId,
        slug: '',
        title: '',
        subject: '',
        summary: null,
        target_depth: ec.depth_required,
        importance: ec.importance,
        exam_subjects: [examInfo],
        mastery: null,
        status: null,
        in_exams_count: 1,
      })
    } else {
      existing.target_depth = Math.max(existing.target_depth, ec.depth_required)
      existing.exam_subjects.push(examInfo)
      existing.in_exams_count += 1
      const importanceRank = { low: 1, medium: 2, high: 3 }
      if (importanceRank[ec.importance as keyof typeof importanceRank] >
          importanceRank[existing.importance as keyof typeof importanceRank]) {
        existing.importance = ec.importance
      }
    }
  }

  // 3. Get concept details (title, slug, subject, summary)
  const conceptIds = Array.from(conceptMap.keys())
  const { data: conceptsData } = await supabase
    .from('concepts')
    .select('id, slug, title, subject, summary')
    .in('id', conceptIds)

  if (conceptsData) {
    for (const c of conceptsData) {
      const entry = conceptMap.get(c.id)
      if (entry) {
        entry.slug = c.slug
        entry.title = c.title
        entry.subject = c.subject
        entry.summary = c.summary
      }
    }
  }

  // 4. Get user's progress (mastery) — "don't teach me twice"
  const { data: progressData } = await supabase
    .from('progress')
    .select('concept_id, mastery, status')
    .eq('user_id', userId)
    .in('concept_id', conceptIds)

  if (progressData) {
    for (const p of progressData) {
      const entry = conceptMap.get(p.concept_id)
      if (entry) {
        entry.mastery = p.mastery
        entry.status = p.status
      }
    }
  }

  // 5. Sort: common concepts first (in more exams), then by subject
  const concepts = Array.from(conceptMap.values()).sort((a, b) => {
    // Concepts in more exams first (most "common")
    if (b.in_exams_count !== a.in_exams_count) {
      return b.in_exams_count - a.in_exams_count
    }
    // Then by subject
    if (a.subject !== b.subject) return a.subject.localeCompare(b.subject)
    // Then by title
    return a.title.localeCompare(b.title)
  })

  // 6. Compute overlap stats
  const total = concepts.length
  const numExams = examIds.length
  const commonToAll = concepts.filter(c => c.in_exams_count === numExams).length
  const commonToSome = concepts.filter(c => c.in_exams_count > 1 && c.in_exams_count < numExams).length
  const unique = concepts.filter(c => c.in_exams_count === 1).length
  const mastered = concepts.filter(c => (c.mastery || 0) >= 80).length

  // Per-exam stats
  const perExam = exams.map((e: any) => {
    const examConceptsForThisExam = examConcepts.filter((ec: any) => ec.exam_id === e.id)
    const uniqueForThisExam = concepts.filter(c =>
      c.in_exams_count === 1 && c.exam_subjects.some(es => es.exam_id === e.id)
    ).length
    return {
      exam_id: e.id,
      exam_name: e.name,
      total: examConceptsForThisExam.length,
      unique: uniqueForThisExam,
    }
  })

  // Overlap %: how much of total is shared (in 2+ exams)
  const overlapPercent = total > 0
    ? Math.round(((commonToAll + commonToSome) / total) * 100)
    : 0

  // 7. Save combined course as learning_path (cache)
  await supabase
    .from('learning_paths')
    .insert({
      user_id: userId,
      path_json: {
        mode: 'syllabus-merge',
        exam_ids: examIds,
        concepts: concepts.map(c => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          target_depth: c.target_depth,
          importance: c.importance,
          in_exams_count: c.in_exams_count,
        })),
      },
      overlap_stats: {
        total,
        common_to_all: commonToAll,
        common_to_some: commonToSome,
        unique,
        per_exam: perExam,
        overlap_percent: overlapPercent,
      },
    })

  return {
    concepts,
    total_concepts: total,
    mastered_concepts: mastered,
    pending_concepts: total - mastered,
    overlap_stats: {
      total,
      common_to_all: commonToAll,
      common_to_some: commonToSome,
      unique,
      per_exam: perExam,
      overlap_percent: overlapPercent,
    },
    exams,
    mode: 'syllabus-merge',
  }
}

/**
 * Get all available exams (for enrollment / browse)
 */
export async function getAvailableExams(category?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('exams')
    .select('id, slug, name, category, conducting_body, description, pattern_json, eligibility_json')
    .eq('status', 'active')
    .order('category')
    .order('name')

  if (category) {
    query = query.eq('category', category)
  }

  const { data } = await query
  return data || []
}

/**
 * Get exam by slug (for detail page)
 */
export async function getExamBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('exams')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()
  return data
}

/**
 * Get exam concepts (syllabus) for an exam
 */
export async function getExamConcepts(examId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('exam_concepts')
    .select(`
      concept_id,
      depth_required,
      importance,
      subject,
      concepts!inner(slug, title, subject, summary)
    `)
    .eq('exam_id', examId)
  return data || []
}
