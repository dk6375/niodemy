import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, canAccessTeacherDashboard } from '@/lib/console/rbac'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/teacher/profile
 * Create teacher profile.
 */
export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!canAccessTeacherDashboard(user)) {
    return NextResponse.json({ error: 'Teacher access required' }, { status: 403 })
  }

  const body = await request.json()
  const supabase = await createClient()

  // Ensure user role is teacher (or admin already)
  if (user!.role === 'learner' || user!.role === 'content_writer') {
    await supabase
      .from('profiles')
      .update({ role: 'teacher' })
      .eq('id', user!.id)
  }

  const { data, error } = await supabase
    .from('teacher_profiles')
    .insert({
      user_id: user!.id,
      expertise: body.expertise,
      segments: body.segments,
      bio: body.bio,
      is_active: body.is_active ?? true,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: data })
}

/**
 * PUT /api/teacher/profile
 * Update teacher profile.
 */
export async function PUT(request: NextRequest) {
  const user = await getAuthUser()
  if (!canAccessTeacherDashboard(user)) {
    return NextResponse.json({ error: 'Teacher access required' }, { status: 403 })
  }

  const body = await request.json()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('teacher_profiles')
    .update({
      expertise: body.expertise,
      segments: body.segments,
      bio: body.bio,
      is_active: body.is_active,
    })
    .eq('user_id', user!.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: data })
}
