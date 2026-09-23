import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateDepthMergeCombinedCourse } from '@/lib/combined-course/depth-merge'

/**
 * POST /api/combined-course
 * Body: { curriculum_ids: string[] }
 * Generates a depth-merge combined course for the current user.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { curriculum_ids } = body

  if (!Array.isArray(curriculum_ids) || curriculum_ids.length === 0) {
    return NextResponse.json({ error: 'curriculum_ids array required' }, { status: 400 })
  }

  const result = await generateDepthMergeCombinedCourse(user.id, curriculum_ids)

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
