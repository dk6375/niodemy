import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/console/rbac'
import { calculateNextReview } from '@/lib/learning/spaced-repetition'

/**
 * POST /api/progress
 * Update user's progress on a concept (mastery, status, spaced repetition).
 * Body: { conceptId, status, wasCorrect }
 */
export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { conceptId, status, wasCorrect } = body

  if (!conceptId || !status) {
    return NextResponse.json({ error: 'conceptId and status required' }, { status: 400 })
  }

  const supabase = await createClient()

  // Get existing progress
  const { data: existing } = await supabase
    .from('progress')
    .select('mastery, attempts_count, correct_count, status, next_review_date')
    .eq('user_id', user.id)
    .eq('concept_id', conceptId)
    .single()

  const masteryByStatus: Record<string, number> = {
    not_started: 0, learning: 20, understood: 50,
    practiced: 70, mastered: 100, needs_revision: 30,
  }

  const newMastery = masteryByStatus[status] ?? 0
  const newAttempts = (existing?.attempts_count || 0) + 1
  const newCorrect = (existing?.correct_count || 0) + (wasCorrect ? 1 : 0)

  // Calculate next review date using spaced repetition
  const sr = calculateNextReview(
    newMastery,
    newAttempts,
    wasCorrect ?? false
  )

  const { data, error } = await supabase
    .from('progress')
    .upsert({
      user_id: user.id,
      concept_id: conceptId,
      mastery: newMastery,
      status,
      attempts_count: newAttempts,
      correct_count: newCorrect,
      last_reviewed: new Date().toISOString(),
      next_review_date: sr.nextReviewDate.toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    progress: data,
    spacedRepetition: {
      nextReviewDate: sr.nextReviewDate,
      intervalDays: sr.intervalDays,
      message: sr.message,
    },
  })
}

/**
 * GET /api/progress?conceptId=xxx
 * Get user's progress for a concept.
 */
export async function GET(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const conceptId = searchParams.get('conceptId')

  const supabase = await createClient()

  if (conceptId) {
    const { data } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('concept_id', conceptId)
      .single()
    return NextResponse.json({ progress: data })
  }

  // Get all progress for user
  const { data } = await supabase
    .from('progress')
    .select(`
      mastery, status, last_reviewed, next_review_date, attempts_count, correct_count,
      concepts!inner(id, slug, title, subject)
    `)
    .eq('user_id', user.id)
    .order('last_reviewed', { ascending: false })

  return NextResponse.json({ progress: data || [] })
}
