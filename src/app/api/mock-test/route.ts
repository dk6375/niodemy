import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/console/rbac'

/**
 * GET /api/mock-test?exam_id=xxx&count=10&adaptive=true
 * Generates a mock test (fixed or adaptive)
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const user = await getAuthUser()

  const { searchParams } = new URL(request.url)
  const examId = searchParams.get('exam_id')
  const count = parseInt(searchParams.get('count') || '10')
  const adaptive = searchParams.get('adaptive') === 'true'

  if (!examId) {
    return NextResponse.json({ error: 'exam_id required' }, { status: 400 })
  }

  // Get exam concepts
  const { data: examConcepts } = await supabase
    .from('exam_concepts')
    .select('concept_id, depth_required, importance')
    .eq('exam_id', examId)

  const conceptIds = (examConcepts || []).map((ec: any) => ec.concept_id)
  if (conceptIds.length === 0) {
    return NextResponse.json({ error: 'No concepts for this exam' }, { status: 404 })
  }

  // If adaptive and user logged in, adjust difficulty based on mastery
  let targetDifficulty = 2 // default medium
  if (adaptive && user) {
    const { data: progress } = await supabase
      .from('progress')
      .select('mastery')
      .eq('user_id', user.id)
      .in('concept_id', conceptIds)

    const avgMastery = progress && progress.length > 0
      ? progress.reduce((sum: number, p: any) => sum + p.mastery, 0) / progress.length
      : 0

    // Adaptive: if mastery high → harder questions; if low → easier
    if (avgMastery >= 70) targetDifficulty = 4 // advanced
    else if (avgMastery >= 40) targetDifficulty = 3 // conceptual
    else targetDifficulty = 2 // exam facts

    // Fetch questions at target difficulty ±1
    const { data: questions } = await supabase
      .from('questions')
      .select(`
        id, body, options_json, correct_answer, explanation, difficulty,
        type, subject, concept_id,
        concepts!inner(slug, title)
      `)
      .eq('status', 'published')
      .eq('type', 'mcq')
      .in('concept_id', conceptIds)
      .gte('difficulty', Math.max(1, targetDifficulty - 1))
      .lte('difficulty', Math.min(5, targetDifficulty + 1))
      .limit(count)

    return NextResponse.json({
      questions: questions || [],
      count: questions?.length || 0,
      adaptive: true,
      targetDifficulty,
      avgMastery: Math.round(avgMastery),
      conceptCount: conceptIds.length,
    })
  }

  // Non-adaptive: random questions
  const { data: questions } = await supabase
    .from('questions')
    .select(`
      id, body, options_json, correct_answer, explanation, difficulty,
      type, subject, concept_id,
      concepts!inner(slug, title)
    `)
    .eq('status', 'published')
    .eq('type', 'mcq')
    .in('concept_id', conceptIds)
    .limit(count)

  return NextResponse.json({
    questions: questions || [],
    count: questions?.length || 0,
    adaptive: false,
    conceptCount: conceptIds.length,
  })
}

/**
 * POST /api/mock-test
 * Submit mock test results — record attempts + update progress
 */
export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { results, examId } = body // results: [{ questionId, userAnswer, isCorrect, timeTaken }]

  if (!Array.isArray(results) || results.length === 0) {
    return NextResponse.json({ error: 'results array required' }, { status: 400 })
  }

  const supabase = await createClient()

  // Record each attempt
  const attempts = results.map((r: any) => ({
    user_id: user.id,
    question_id: r.questionId,
    user_answer: r.userAnswer,
    is_correct: r.isCorrect,
    time_taken: r.timeTaken || null,
  }))

  const { error: attemptsError } = await supabase
    .from('attempts')
    .insert(attempts)

  // Update progress for each concept
  const conceptStats: Record<string, { correct: number; total: number }> = {}
  for (const r of results) {
    if (!r.conceptId) continue
    if (!conceptStats[r.conceptId]) conceptStats[r.conceptId] = { correct: 0, total: 0 }
    conceptStats[r.conceptId].total++
    if (r.isCorrect) conceptStats[r.conceptId].correct++
  }

  // Upsert progress for each concept
  for (const [conceptId, stats] of Object.entries(conceptStats)) {
    const accuracy = (stats.correct / stats.total) * 100
    // Get existing progress
    const { data: existing } = await supabase
      .from('progress')
      .select('mastery, attempts_count, correct_count, status')
      .eq('user_id', user.id)
      .eq('concept_id', conceptId)
      .single()

    const newAttempts = (existing?.attempts_count || 0) + stats.total
    const newCorrect = (existing?.correct_count || 0) + stats.correct
    const newMastery = Math.min(100, Math.round((newCorrect / newAttempts) * 100))
    const newStatus = newMastery >= 80 ? 'mastered' : newMastery >= 50 ? 'understood' : newMastery >= 20 ? 'learning' : 'not_started'

    await supabase
      .from('progress')
      .upsert({
        user_id: user.id,
        concept_id: conceptId,
        mastery: newMastery,
        status: newStatus,
        attempts_count: newAttempts,
        correct_count: newCorrect,
        last_reviewed: new Date().toISOString(),
      })
  }

  // Compute summary
  const totalCorrect = results.filter((r: any) => r.isCorrect).length
  const totalQuestions = results.length
  const accuracy = Math.round((totalCorrect / totalQuestions) * 100)
  const totalTime = results.reduce((sum: number, r: any) => sum + (r.timeTaken || 0), 0)

  return NextResponse.json({
    summary: {
      totalQuestions,
      correct: totalCorrect,
      wrong: totalQuestions - totalCorrect,
      accuracy,
      totalTime,
      avgTimePerQuestion: Math.round(totalTime / totalQuestions),
    },
    conceptsUpdated: Object.keys(conceptStats).length,
  })
}
