import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateDepthMergeCombinedCourse } from '@/lib/combined-course/depth-merge'
import { generateSyllabusMergeCombinedCourse } from '@/lib/combined-course/syllabus-merge'

/**
 * POST /api/combined-course
 * Body: { mode: 'depth-merge' | 'syllabus-merge', curriculum_ids?: string[], exam_ids?: string[] }
 * Generates a combined course for the current user.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { mode, curriculum_ids, exam_ids } = body

  if (!mode) {
    return NextResponse.json({ error: 'mode required (depth-merge or syllabus-merge)' }, { status: 400 })
  }

  let result = null

  if (mode === 'depth-merge') {
    if (!Array.isArray(curriculum_ids) || curriculum_ids.length === 0) {
      return NextResponse.json({ error: 'curriculum_ids array required for depth-merge' }, { status: 400 })
    }
    result = await generateDepthMergeCombinedCourse(user.id, curriculum_ids)
  } else if (mode === 'syllabus-merge') {
    if (!Array.isArray(exam_ids) || exam_ids.length === 0) {
      return NextResponse.json({ error: 'exam_ids array required for syllabus-merge' }, { status: 400 })
    }
    result = await generateSyllabusMergeCombinedCourse(user.id, exam_ids)
  } else {
    return NextResponse.json({ error: 'Invalid mode. Use depth-merge or syllabus-merge.' }, { status: 400 })
  }

  if (!result) {
    return NextResponse.json({ error: 'Failed to generate combined course' }, { status: 500 })
  }

  return NextResponse.json(result)
}

/**
 * GET /api/combined-course
 * Returns the user's current active learning path (cached combined course).
 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data } = await supabase
    .from('learning_paths')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('generated_at', { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json({ path: data })
}
