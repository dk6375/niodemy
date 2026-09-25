/**
 * Personalized Daily Plan Engine
 *
 * Generates a daily learning plan for the user:
 * 1. Revision items (spaced repetition — concepts due for review)
 * 2. New concepts to learn (from combined course path)
 * 3. Practice questions (from weak areas)
 *
 * Allocates time based on available time per day (default 60 min):
 * - 30% revision
 * - 40% new learning
 * - 30% practice
 */

import { createClient } from '@/lib/supabase/server'
import { isDueForReview } from './spaced-repetition'

export interface DailyPlanItem {
  type: 'revision' | 'new-learning' | 'practice'
  conceptId: string
  conceptSlug: string
  conceptTitle: string
  subject: string
  mastery: number
  status: string
  nextReviewDate: string | null
  reason: string
}

export interface DailyPlan {
  revision: DailyPlanItem[]
  newLearning: DailyPlanItem[]
  practice: DailyPlanItem[]
  totalItems: number
  estimatedMinutes: number
  summary: string
}

export async function generateDailyPlan(
  userId: string,
  availableMinutes: number = 60
): Promise<DailyPlan | null> {
  const supabase = await createClient()

  // 1. Get all progress for user (for revision)
  const { data: allProgress } = await supabase
    .from('progress')
    .select(`
      concept_id, mastery, status, attempts_count, next_review_date,
      concepts!inner(id, slug, title, subject)
    `)
    .eq('user_id', userId)

  if (!allProgress) return null

  // 2. Revision items: concepts due for review (next_review_date <= today)
  const revisionItems: DailyPlanItem[] = []
  const practiceCandidates: DailyPlanItem[] = []

  for (const p of allProgress) {
    const pr = p as any
    const concept = pr.concepts
    if (!concept) continue

    const item: DailyPlanItem = {
      type: 'revision',
      conceptId: concept.id,
      conceptSlug: concept.slug,
      conceptTitle: concept.title,
      subject: concept.subject,
      mastery: pr.mastery,
      status: pr.status,
      nextReviewDate: pr.next_review_date,
      reason: '',
    }

    if (isDueForReview(pr.next_review_date) || pr.status === 'needs_revision') {
      item.reason = pr.status === 'needs_revision' ? 'Needs revision' : 'Due for review today'
      revisionItems.push(item)
    }

    // Practice candidates: low mastery or needs_revision
    if (pr.mastery < 70 && pr.mastery > 0) {
      item.type = 'practice'
      item.reason = `Mastery at ${pr.mastery}% — practice to improve`
      practiceCandidates.push(item)
    }
  }

  // Sort revision by urgency (oldest review date first)
  revisionItems.sort((a, b) => {
    if (!a.nextReviewDate) return 1
    if (!b.nextReviewDate) return -1
    return new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime()
  })

  // 3. New learning: get user's learning path (combined course)
  const { data: learningPath } = await supabase
    .from('learning_paths')
    .select('path_json')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('generated_at', { ascending: false })
    .limit(1)
    .single()

  const newLearningItems: DailyPlanItem[] = []
  if (learningPath?.path_json) {
    const pathData = learningPath.path_json as any
    const pathConcepts = pathData.concepts || []

    // Find concepts not yet started (not in progress)
    const startedIds = new Set(allProgress.map((p: any) => p.concept_id))

    for (const pc of pathConcepts) {
      if (!startedIds.has(pc.id)) {
        newLearningItems.push({
          type: 'new-learning',
          conceptId: pc.id,
          conceptSlug: pc.slug,
          conceptTitle: pc.title,
          subject: pc.subject || '',
          mastery: 0,
          status: 'not_started',
          nextReviewDate: null,
          reason: 'New concept in your combined course',
        })
      }
    }
  }

  // If no learning path, suggest from enrolled exam concepts
  if (newLearningItems.length === 0) {
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('target_id')
      .eq('user_id', userId)
      .eq('target_type', 'exam')
      .eq('status', 'active')

    if (enrollments && enrollments.length > 0) {
      const examIds = enrollments.map((e: any) => e.target_id)
      const { data: examConcepts } = await supabase
        .from('exam_concepts')
        .select('concept_id, concepts!inner(id, slug, title, subject)')
        .in('exam_id', examIds)
        .limit(20)

      const startedIds = new Set(allProgress.map((p: any) => p.concept_id))
      for (const ec of examConcepts || []) {
        const concept = (ec as any).concepts
        if (concept && !startedIds.has(concept.id)) {
          newLearningItems.push({
            type: 'new-learning',
            conceptId: concept.id,
            conceptSlug: concept.slug,
            conceptTitle: concept.title,
            subject: concept.subject,
            mastery: 0,
            status: 'not_started',
            nextReviewDate: null,
            reason: 'New concept from your exam syllabus',
          })
        }
      }
    }
  }

  // 4. Allocate items based on available time
  // Revision: ~3 min per item, New learning: ~10 min per item, Practice: ~5 min per item
  const revisionTime = Math.round(availableMinutes * 0.3)
  const newTime = Math.round(availableMinutes * 0.4)
  const practiceTime = Math.round(availableMinutes * 0.3)

  const revisionCount = Math.min(revisionItems.length, Math.floor(revisionTime / 3))
  const newCount = Math.min(newLearningItems.length, Math.floor(newTime / 10))
  const practiceCount = Math.min(practiceCandidates.length, Math.floor(practiceTime / 5))

  const finalRevision = revisionItems.slice(0, revisionCount)
  const finalNew = newLearningItems.slice(0, newCount)
  const finalPractice = practiceCandidates.slice(0, practiceCount)

  const totalItems = finalRevision.length + finalNew.length + finalPractice.length
  const estimatedMinutes =
    finalRevision.length * 3 + finalNew.length * 10 + finalPractice.length * 5

  // Generate summary
  let summary = ''
  if (totalItems === 0) {
    summary = 'No tasks for today. Browse concepts or enroll in a goal to get started!'
  } else {
    const parts: string[] = []
    if (finalRevision.length > 0) parts.push(`${finalRevision.length} revision`)
    if (finalNew.length > 0) parts.push(`${finalNew.length} new to learn`)
    if (finalPractice.length > 0) parts.push(`${finalPractice.length} practice`)
    summary = `Today's plan: ${parts.join(', ')} — ~${estimatedMinutes} min`
  }

  return {
    revision: finalRevision,
    newLearning: finalNew,
    practice: finalPractice,
    totalItems,
    estimatedMinutes,
    summary,
  }
}
