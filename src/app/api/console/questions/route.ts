import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser, canAccessConsole } from '@/lib/console/rbac'

/**
 * POST /api/console/questions
 * Create new question. Requires content_writer or admin role.
 */
export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!canAccessConsole(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('questions')
    .insert(body)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from('audit_logs').insert({
    user_id: user!.id,
    action: 'create',
    entity_type: 'question',
    entity_id: data.id,
    changes_json: body,
  })

  return NextResponse.json({ question: data })
}

/**
 * PUT /api/console/questions?id=xxx
 */
export async function PUT(request: NextRequest) {
  const user = await getAuthUser()
  if (!canAccessConsole(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const body = await request.json()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('questions')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('audit_logs').insert({
    user_id: user!.id,
    action: 'update',
    entity_type: 'question',
    entity_id: id,
    changes_json: body,
  })

  return NextResponse.json({ question: data })
}

/**
 * DELETE /api/console/questions?id=xxx
 */
export async function DELETE(request: NextRequest) {
  const user = await getAuthUser()
  if (!canAccessConsole(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const supabase = await createClient()
  const { error } = await supabase.from('questions').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('audit_logs').insert({
    user_id: user!.id,
    action: 'delete',
    entity_type: 'question',
    entity_id: id,
  })

  return NextResponse.json({ success: true })
}
