/**
 * Hybrid-Merge Combined Course Engine (Senior segment)
 *
 * For student with goals like [Class 12 CBSE Biology, NEET]
 * Same NCERT syllabus, but NEET needs deeper depth + speed + PYQs
 * Board needs detailed QNA. Merge ALL practice dimensions.
 *
 * Algorithm:
 * 1. Get curriculum concepts (board syllabus) + entrance exam concepts
 * 2. Union by concept, depth = MAX(board_depth, entrance_depth)
 * 3. Assemble practice layers:
 *    a) Board QNA questions (long-form, short-form)
 *    b) Entrance MCQ questions (single correct, multiple correct)
 *    c) Board PYQs + Entrance PYQs
 *    d) Speed drill sets (timed MCQs)
 * 4. Subtract already-mastered (Knowledge Passport)
 * 5. Sort by chapter order + priority
 * 6. Compute hybrid daily plan balancing all dimensions
 */

import { createClient } from '@/lib/supabase/server'

export interface HybridConcept {
  id: string
  slug: string
  title: string
  subject: string
  summary: string | null
  target_depth: number  // max(board_depth, entrance_depth)
  board_depth: number | null
  entrance_depth: number | null
  importance: string
  chapter_name: string | null
  order_index: number
  sources: string[]  // ['board', 'entrance']
  mastery: number | null
  status: string | null
}

export interface HybridPracticeLayer {
  board_qna: number  // count of board QNA questions
  entrance_mcq: number  // count of entrance MCQs
  board_pyqs: number
  entrance_pyqs: number
  speed_drills: number  // available timed questions
}

export interface HybridMergeResult {
  concepts: HybridConcept[]
  practice_layers: HybridPracticeLayer
  total_concepts: number
  mastered_concepts: number
  pending_concepts: number
  overlap_stats: {
    total: number
    common: number  // in both board + entrance
    board_only: number
    entrance_only: number
    overlap_percent: number
  }
  daily_plan: {
    learn_new: number  // concepts to learn per day
    board_practice: number  // board QNA per day
    entrance_practice: number  // entrance MCQ per day
    speed_drill: number  // speed drills per day
    revision: number  // revision items per day
  }
  mode: 'hybrid-merge'
}

export async function generateHybridMergeCombinedCourse(
  userId: string,
  curriculumId: string,
  examIds: string[]
): Promise<HybridMergeResult | null> {
  const supabase = await createClient()

  if (!curriculumId) return null

  // 1. Get board curriculum concepts
  const { data: boardConcepts } = await supabase
    .from('curriculum_concepts')
    .select('concept_id, depth_required, importance, chapter_name, order_index')
    .eq('curriculum_id', curriculumId)

  // 2. Get entrance exam concepts
  let entranceConcepts: any[] = []
  if (examIds.length > 0) {
    const { data } = await supabase
      .from('exam_concepts')
      .select('concept_id, depth_required, importance, subject, exam_id')
      .in('exam_id', examIds)
    entranceConcepts = data || []
  }

  if (!boardConcepts || boardConcepts.length === 0) {
    return null
  }

  // 3. Union: merge board + entrance concepts, depth = MAX
  const conceptMap = new Map<string, HybridConcept>()

  for (const bc of boardConcepts) {
    conceptMap.set(bc.concept_id, {
      id: bc.concept_id,
      slug: '',
      title: '',
      subject: '',
      summary: null,
      target_depth: bc.depth_required,
      board_depth: bc.depth_required,
      entrance_depth: null,
      importance: bc.importance,
      chapter_name: bc.chapter_name,
      order_index: bc.order_index,
      sources: ['board'],
      mastery: null,
      status: null,
    })
  }

  for (const ec of entranceConcepts) {
    const existing = conceptMap.get(ec.concept_id)
    if (existing) {
      existing.entrance_depth = ec.depth_required
      existing.target_depth = Math.max(existing.target_depth, ec.depth_required)
      existing.sources.push('entrance')
      const importanceRank = { low: 1, medium: 2, high: 3 }
      if (importanceRank[ec.importance as keyof typeof importanceRank] >
          importanceRank[existing.importance as keyof typeof importanceRank]) {
        existing.importance = ec.importance
      }
    } else {
      conceptMap.set(ec.concept_id, {
        id: ec.concept_id,
        slug: '',
        title: '',
        subject: ec.subject || '',
        summary: null,
        target_depth: ec.depth_required,
        board_depth: null,
        entrance_depth: ec.depth_required,
        importance: ec.importance,
        chapter_name: 'Entrance Additional',
        order_index: 999,
        sources: ['entrance'],
        mastery: null,
        status: null,
      })
    }
  }

  // 4. Get concept details
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

  // 5. Get user's progress
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

  // 6. Sort: common first, then by chapter order
  const concepts = Array.from(conceptMap.values()).sort((a, b) => {
    const aCommon = a.sources.length > 1 ? 0 : 1
    const bCommon = b.sources.length > 1 ? 0 : 1
    if (aCommon !== bCommon) return aCommon - bCommon
    if (a.chapter_name !== b.chapter_name) {
      return (a.chapter_name || '').localeCompare(b.chapter_name || '')
    }
    return a.order_index - b.order_index
  })

  // 7. Compute overlap stats
  const total = concepts.length
  const common = concepts.filter(c => c.sources.length > 1).length
  const boardOnly = concepts.filter(c => c.sources.length === 1 && c.sources[0] === 'board').length
  const entranceOnly = concepts.filter(c => c.sources.length === 1 && c.sources[0] === 'entrance').length
  const mastered = concepts.filter(c => (c.mastery || 0) >= 80).length
  const overlapPercent = total > 0 ? Math.round((common / total) * 100) : 0

  // 8. Assemble practice layers
  // Get all questions linked to these concepts
  const { data: questionsData } = await supabase
    .from('questions')
    .select('id, type, exam_format, source, time_recommended, concept_id')
    .in('concept_id', conceptIds)
    .eq('status', 'published')

  const practice_layers: HybridPracticeLayer = {
    board_qna: 0,
    entrance_mcq: 0,
    board_pyqs: 0,
    entrance_pyqs: 0,
    speed_drills: 0,
  }

  for (const q of questionsData || []) {
    if (q.exam_format === 'board') {
      practice_layers.board_qna++
      if (q.source === 'pyq') practice_layers.board_pyqs++
    } else if (q.exam_format === 'competitive') {
      practice_layers.entrance_mcq++
      if (q.source === 'pyq') practice_layers.entrance_pyqs++
      if (q.time_recommended && q.time_recommended <= 60) {
        practice_layers.speed_drills++
      }
    }
  }

  // 9. Compute hybrid daily plan (balanced across dimensions)
  // Assuming 90 min/day for senior hybrid prep
  const daily_plan = {
    learn_new: 2,  // 2 new concepts (30 min)
    board_practice: Math.min(practice_layers.board_qna, 2),  // 1-2 board QNA (20 min)
    entrance_practice: Math.min(practice_layers.entrance_mcq, 5),  // 5 entrance MCQs (15 min)
    speed_drill: Math.min(practice_layers.speed_drills, 10),  // 10 rapid MCQs (10 min)
    revision: 2,  // 2 revision items (15 min)
  }

  // 10. Save combined course as learning_path
  await supabase
    .from('learning_paths')
    .insert({
      user_id: userId,
      path_json: {
        mode: 'hybrid-merge',
        curriculum_id: curriculumId,
        exam_ids: examIds,
        concepts: concepts.map(c => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          target_depth: c.target_depth,
          board_depth: c.board_depth,
          entrance_depth: c.entrance_depth,
          sources: c.sources,
        })),
        practice_layers,
        daily_plan,
      },
      overlap_stats: {
        total,
        common,
        board_only: boardOnly,
        entrance_only: entranceOnly,
        overlap_percent: overlapPercent,
      },
    })

  return {
    concepts,
    practice_layers,
    total_concepts: total,
    mastered_concepts: mastered,
    pending_concepts: total - mastered,
    overlap_stats: {
      total,
      common,
      board_only: boardOnly,
      entrance_only: entranceOnly,
      overlap_percent: overlapPercent,
    },
    daily_plan,
    mode: 'hybrid-merge',
  }
}
