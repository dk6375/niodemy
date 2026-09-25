/**
 * Exam Readiness Score
 *
 * Computes a 0-100 readiness score for an exam based on:
 * 1. Mastery of concepts needed for the exam
 * 2. Time remaining until exam date
 * 3. Practice attempts and accuracy
 *
 * Formula:
 * readiness = (masteryScore × 0.5) + (timeScore × 0.2) + (practiceScore × 0.3)
 *
 * - masteryScore: avg mastery of exam concepts
 * - timeScore: based on days left (more time = better, but capped)
 * - practiceScore: based on attempt count and accuracy
 */

import { createClient } from '@/lib/supabase/server'

export interface ExamReadinessResult {
  examId: string
  examName: string
  examDate: Date | null
  daysLeft: number | null
  readinessScore: number // 0-100
  masteryScore: number // 0-100
  timeScore: number // 0-100
  practiceScore: number // 0-100
  totalConcepts: number
  masteredConcepts: number
  totalAttempts: number
  correctAttempts: number
  accuracy: number
  status: 'not-started' | 'early' | 'on-track' | 'needs-focus' | 'urgent' | 'ready'
  message: string
}

export async function computeExamReadiness(
  userId: string,
  examId: string
): Promise<ExamReadinessResult | null> {
  const supabase = await createClient()

  // Get exam details
  const { data: exam } = await supabase
    .from('exams')
    .select('id, name, slug')
    .eq('id', examId)
    .single()

  if (!exam) return null

  // Get exam concepts (syllabus)
  const { data: examConcepts } = await supabase
    .from('exam_concepts')
    .select('concept_id')
    .eq('exam_id', examId)

  const conceptIds = (examConcepts || []).map((ec: any) => ec.concept_id)
  const totalConcepts = conceptIds.length

  if (totalConcepts === 0) {
    return {
      examId: exam.id,
      examName: exam.name,
      examDate: null,
      daysLeft: null,
      readinessScore: 0,
      masteryScore: 0,
      timeScore: 50,
      practiceScore: 0,
      totalConcepts: 0,
      masteredConcepts: 0,
      totalAttempts: 0,
      correctAttempts: 0,
      accuracy: 0,
      status: 'not-started',
      message: 'No syllabus mapped for this exam yet.',
    }
  }

  // Get user's progress for these concepts
  const { data: progressData } = await supabase
    .from('progress')
    .select('mastery, attempts_count, correct_count, status')
    .eq('user_id', userId)
    .in('concept_id', conceptIds)

  // Calculate mastery score
  const masteredConcepts = (progressData || []).filter((p: any) => p.mastery >= 80).length
  const masterySum = (progressData || []).reduce((sum: number, p: any) => sum + (p.mastery || 0), 0)
  const masteryScore = totalConcepts > 0 ? Math.round(masterySum / totalConcepts) : 0

  // Calculate practice score
  const totalAttempts = (progressData || []).reduce((sum: number, p: any) => sum + (p.attempts_count || 0), 0)
  const correctAttempts = (progressData || []).reduce((sum: number, p: any) => sum + (p.correct_count || 0), 0)
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0
  // Practice score: weight by both quantity and quality
  const attemptCoverage = Math.min(100, (totalAttempts / (totalConcepts * 5)) * 100) // 5 attempts per concept = 100%
  const practiceScore = Math.round((attemptCoverage * 0.5) + (accuracy * 0.5))

  // Get exam cycle (latest) for date
  const { data: cycle } = await supabase
    .from('exam_cycles')
    .select('exam_date')
    .eq('exam_id', examId)
    .order('year', { ascending: false })
    .limit(1)
    .single()

  const examDate = cycle?.exam_date ? new Date(cycle.exam_date) : null
  const now = new Date()
  const daysLeft = examDate ? Math.round((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null

  // Calculate time score
  let timeScore = 50
  if (daysLeft !== null) {
    if (daysLeft < 0) {
      timeScore = 0 // exam passed
    } else if (daysLeft <= 7) {
      timeScore = Math.max(20, 100 - (7 - daysLeft) * 10) // urgent but not zero
    } else if (daysLeft <= 30) {
      timeScore = 80 // focused period
    } else if (daysLeft <= 90) {
      timeScore = 70 // good time
    } else if (daysLeft <= 180) {
      timeScore = 60 // early days
    } else {
      timeScore = 50 // very early
    }
  }

  // Calculate overall readiness
  const readinessScore = Math.round(
    (masteryScore * 0.5) + (timeScore * 0.2) + (practiceScore * 0.3)
  )

  // Determine status
  let status: ExamReadinessResult['status']
  let message: string

  if (totalAttempts === 0 && masteredConcepts === 0) {
    status = 'not-started'
    message = 'Start learning to track your readiness.'
  } else if (readinessScore >= 80) {
    status = 'ready'
    message = 'You are exam-ready! Keep revising.'
  } else if (daysLeft !== null && daysLeft <= 30 && readinessScore < 50) {
    status = 'urgent'
    message = 'Urgent! Focus on weak areas and practice more.'
  } else if (readinessScore >= 60) {
    status = 'on-track'
    message = 'On track. Keep practicing consistently.'
  } else if (readinessScore >= 30) {
    status = 'needs-focus'
    message = 'Needs more focus. Study regularly.'
  } else {
    status = 'early'
    message = 'Early stage. Start with basics.'
  }

  return {
    examId: exam.id,
    examName: exam.name,
    examDate,
    daysLeft,
    readinessScore,
    masteryScore,
    timeScore,
    practiceScore,
    totalConcepts,
    masteredConcepts,
    totalAttempts,
    correctAttempts,
    accuracy,
    status,
    message,
  }
}
