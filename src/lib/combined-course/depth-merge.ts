/**
 * Depth-Merge Combined Course Engine (School segment)
 *
 * For student with goals like [Class 8 CBSE Science, Class 8 NEET Foundation Science]
 * Both map to SAME class level (8), SAME concept set, different depths.
 * Combined path: same concepts, depth = max(school_depth, foundation_depth)
 *
 * Algorithm:
 * 1. Get all curriculum_concepts for all goals (same class)
 * 2. Merge: same concept → take MAX depth
 * 3. Subtract already-mastered (Knowledge Passport — "don't teach me twice")
 * 4. Add prerequisites recursively
 * 5. Sort by chapter order
 * 6. Return combined course
 */

import { createClient } from '@/lib/supabase/server'

export interface CurriculumConcept {
  concept_id: string
  depth_required: number
  importance: string
  chapter_name: string | null
  order_index: number
  curriculum_id: string
  curriculum_subject: string
}

export interface CombinedCourseConcept {
  id: string
  slug: string
  title: string
  subject: string
  summary: string | null
  target_depth: number
  importance: string
  chapter_name: string | null
  order_index: number
  sources: string[]  // which curriculums include this concept
  mastery: number | null  // user's current mastery (0-100 or null if not started)
  status: string | null  // user's progress status
}

export interface DepthMergeResult {
  concepts: CombinedCourseConcept[]
  total_concepts: number
  mastered_concepts: number
  pending_concepts: number
  overlap_stats: {
    total: number
    common: number  // in multiple curriculums
    unique: number  // in only one curriculum
  }
  mode: 'depth-merge'
}

export async function generateDepthMergeCombinedCourse(
  userId: string,
  curriculumIds: string[]
): Promise<DepthMergeResult | null> {
  const supabase = await createClient()

  if (curriculumIds.length === 0) return null

  // 1. Get all curriculum_concepts for all goals
  const { data: curriculumConcepts, error: ccErr } = await supabase
    .from('curriculum_concepts')
    .select(`
      concept_id,
      depth_required,
      importance,
      chapter_name,
      order_index,
      curriculum_id,
      curriculums!inner(subject)
    `)
    .in('curriculum_id', curriculumIds)

  if (ccErr || !curriculumConcepts || curriculumConcepts.length === 0) {
    console.error('Error fetching curriculum concepts:', ccErr)
    return null
  }

  // 2. Merge: same concept → take MAX depth
  const conceptMap = new Map<string, CombinedCourseConcept>()
  for (const cc of curriculumConcepts as any[]) {
    const conceptId = cc.concept_id
    const subject = cc.curriculums?.subject || 'Unknown'
    const existing = conceptMap.get(conceptId)

    if (!existing) {
      conceptMap.set(conceptId, {
        id: conceptId,
        slug: '',
        title: '',
        subject: '',
        summary: null,
        target_depth: cc.depth_required,
        importance: cc.importance,
        chapter_name: cc.chapter_name,
        order_index: cc.order_index,
        sources: [subject],
        mastery: null,
        status: null,
      })
    } else {
      // Merge: take max depth
      existing.target_depth = Math.max(existing.target_depth, cc.depth_required)
      existing.sources.push(subject)
      // Take higher importance
      const importanceRank = { low: 1, medium: 2, high: 3 }
      if (importanceRank[cc.importance as keyof typeof importanceRank] >
          importanceRank[existing.importance as keyof typeof importanceRank]) {
        existing.importance = cc.importance
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

  // 4. Get user's progress (mastery) for all these concepts — "don't teach me twice"
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

  // 5. Sort by chapter order then order_index
  const concepts = Array.from(conceptMap.values()).sort((a, b) => {
    const chapterA = a.chapter_name || ''
    const chapterB = b.chapter_name || ''
    if (chapterA !== chapterB) return chapterA.localeCompare(chapterB)
    return a.order_index - b.order_index
  })

  // 6. Compute stats
  const total = concepts.length
  const mastered = concepts.filter(c => (c.mastery || 0) >= 80).length
  const common = concepts.filter(c => c.sources.length > 1).length
  const unique = total - common

  // 7. Save combined course as learning_path (cache)
  await supabase
    .from('learning_paths')
    .insert({
      user_id: userId,
      path_json: {
        mode: 'depth-merge',
        curriculum_ids: curriculumIds,
        concepts: concepts.map(c => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          target_depth: c.target_depth,
          importance: c.importance,
          chapter_name: c.chapter_name,
          order_index: c.order_index,
          sources: c.sources,
        })),
      },
      overlap_stats: { total, common, unique },
    })

  return {
    concepts,
    total_concepts: total,
    mastered_concepts: mastered,
    pending_concepts: total - mastered,
    overlap_stats: { total, common, unique },
    mode: 'depth-merge',
  }
}

/**
 * Get available curriculums for enrollment (School segment)
 */
export async function getAvailableCurriculums(classId?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('curriculums')
    .select(`
      id,
      subject,
      academic_year,
      status,
      classes!inner(name, level, segment, boards!inner(name, slug))
    `)
    .eq('status', 'active')

  if (classId) {
    query = query.eq('class_id', classId)
  }

  const { data } = await query
  return data || []
}

/**
 * Get user's enrollments with curriculum details
 */
export async function getUserEnrollments(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('enrolled_at', { ascending: false })
  return data || []
}

/**
 * Get user's progress summary
 */
export async function getUserProgressSummary(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('progress')
    .select('mastery, status')
    .eq('user_id', userId)

  if (!data || data.length === 0) {
    return {
      total: 0,
      mastered: 0,
      learning: 0,
      avgMastery: 0,
    }
  }

  const total = data.length
  const mastered = data.filter(p => p.mastery >= 80).length
  const learning = data.filter(p => p.status === 'learning' || p.status === 'understood').length
  const avgMastery = Math.round(data.reduce((sum, p) => sum + p.mastery, 0) / total)

  return { total, mastered, learning, avgMastery }
}
