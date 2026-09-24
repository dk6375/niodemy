import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser, canAccessConsole } from '@/lib/console/rbac'

/**
 * POST /api/console/content
 * Create new content asset. Requires content_writer or admin role.
 */
export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!canAccessConsole(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('content_assets')
    .insert({
      ...body,
      author_id: user!.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log to audit
  await supabase.from('audit_logs').insert({
    user_id: user!.id,
    action: 'create',
    entity_type: 'content',
    entity_id: data.id,
    changes_json: body,
  })

  return NextResponse.json({ content: data })
}

/**
 * PUT /api/console/content?id=xxx
 * Update existing content asset.
 */
export async function PUT(request: NextRequest) {
  const user = await getAuthUser()
  if (!canAccessConsole(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }

  const body = await request.json()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('content_assets')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from('audit_logs').insert({
    user_id: user!.id,
    action: body.status === 'published' ? 'publish' : 'update',
    entity_type: 'content',
    entity_id: id,
    changes_json: body,
  })

  return NextResponse.json({ content: data })
}

/**
 * DELETE /api/console/content?id=xxx
 */
export async function DELETE(request: NextRequest) {
  const user = await getAuthUser()
  if (!canAccessConsole(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('content_assets')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from('audit_logs').insert({
    user_id: user!.id,
    action: 'delete',
    entity_type: 'content',
    entity_id: id,
  })

  return NextResponse.json({ success: true })
}
