import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/enroll
 * Body: { segment, target_type, target_id, target_name }
 * Enrolls the current user in a goal.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { segment, target_type, target_id, target_name } = body

  if (!segment || !target_type || !target_id) {
    return NextResponse.json(
      { error: 'Missing required fields: segment, target_type, target_id' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      user_id: user.id,
      segment,
      target_type,
      target_id,
      target_name,
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Already enrolled' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ enrollment: data })
}

/**
 * DELETE /api/enroll?segment=school&target_type=class&target_id=xxx
 * Unenrolls the current user from a goal.
 */
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const segment = searchParams.get('segment')
  const target_type = searchParams.get('target_type')
  const target_id = searchParams.get('target_id')

  if (!segment || !target_type || !target_id) {
    return NextResponse.json({ error: 'Missing query params' }, { status: 400 })
  }

  const { error } = await supabase
    .from('enrollments')
    .delete()
    .eq('user_id', user.id)
    .eq('segment', segment)
    .eq('target_type', target_type)
    .eq('target_id', target_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
