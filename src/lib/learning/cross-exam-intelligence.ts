/**
 * Cross-Exam Intelligence
 *
 * Shows the student: "You mastered Fundamental Rights for SSC,
 * it's also needed for UPSC at L4. You're 50% there!"
 *
 * Finds concepts that are:
 * - Mastered for one exam
 * - Also mapped to another exam (at different depth)
 *
 * This creates a motivational "don't teach me twice" insight.
 */

import { createClient } from '@/lib/supabase/server'

export interface CrossExamInsight {
  conceptId: string
  conceptSlug: string
  conceptTitle: string
  subject: string
  currentMastery: number
  sourceExam: { id: string; name: string; slug: string; depth: number }
  targetExam: { id: string; name: string; slug: string; depth: number }
  needsMoreDepth: boolean
  depthDifference: number
  message: string
}

export async function getCrossExamInsights(userId: string): Promise<CrossExamInsight[]> {
  const supabase = await createClient()

  // Get user's mastered concepts (mastery >= 60)
  const { data: masteredProgress } = await supabase
    .from('progress')
    .select(`
      concept_id, mastery,
      concepts!inner(id, slug, title, subject)
    `)
    .eq('user_id', userId)
    .gte('mastery', 60)

  if (!masteredProgress || masteredProgress.length === 0) {
    return []
  }

  const insights: CrossExamInsight[] = []

  // For each mastered concept, check if it's mapped to other exams
  for (const p of masteredProgress) {
    const pr = p as any
    const concept = pr.concepts

    // Get all exams that have this concept
    const { data: examMappings } = await supabase
      .from('exam_concepts')
      .select(`
        depth_required, importance,
        exams!inner(id, name, slug, status)
      `)
      .eq('concept_id', pr.concept_id)
      .eq('exams.status', 'active')

    if (!examMappings || examMappings.length < 2) continue

    // Check which exams the user is enrolled in
    const examIds = (examMappings as any).map((em: any) => em.exams.id)
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('target_id')
      .eq('user_id', userId)
      .eq('target_type', 'exam')
      .eq('status', 'active')
      .in('target_id', examIds)

    const enrolledExamIds = new Set((enrollments || []).map((e: any) => e.target_id))

    // Find exams that have this concept but user is NOT enrolled in
    for (const em of examMappings as any[]) {
      const exam = em.exams
      if (enrolledExamIds.has(exam.id)) continue // skip enrolled

      // Find source exam (enrolled one with this concept)
      const sourceMapping = (examMappings as any[]).find(
        (m) => enrolledExamIds.has(m.exams.id)
      )

      if (!sourceMapping) continue

      const sourceExam = sourceMapping.exams
      const sourceDepth = sourceMapping.depth_required
      const targetDepth = em.depth_required
      const needsMoreDepth = targetDepth > sourceDepth
      const depthDifference = targetDepth - sourceDepth

      // Build message
      let message: string
      if (!needsMoreDepth) {
        message = `"${concept.title}" mastered for ${sourceExam.name} — also needed for ${exam.name} at same depth. You're ready!`
      } else if (depthDifference === 1) {
        message = `"${concept.title}" mastered for ${sourceExam.name} at L${sourceDepth} — also needed for ${exam.name} at L${targetDepth}. You're 75% there!`
      } else {
        message = `"${concept.title}" mastered for ${sourceExam.name} at L${sourceDepth} — also needed for ${exam.name} at L${targetDepth}. You're 50% there!`
      }

      insights.push({
        conceptId: concept.id,
        conceptSlug: concept.slug,
        conceptTitle: concept.title,
        subject: concept.subject,
        currentMastery: pr.mastery,
        sourceExam: { id: sourceExam.id, name: sourceExam.name, slug: sourceExam.slug, depth: sourceDepth },
        targetExam: { id: exam.id, name: exam.name, slug: exam.slug, depth: targetDepth },
        needsMoreDepth,
        depthDifference,
        message,
      })
    }
  }

  // Deduplicate (keep one insight per concept+targetExam pair)
  const seen = new Set<string>()
  const unique = insights.filter((i) => {
    const key = `${i.conceptId}-${i.targetExam.id}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return unique.slice(0, 5) // Top 5 insights
}
