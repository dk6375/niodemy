import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/console/rbac'

/**
 * POST /api/chat/room
 * Body: { type, contextType?, contextId?, title? }
 * Returns roomId (get-or-create pattern via RPC)
 */
export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { type, contextType, contextId, title } = body

  if (!type) {
    return NextResponse.json({ error: 'type required' }, { status: 400 })
  }

  const supabase = await createClient()

  // Use RPC get_or_create_room
  const { data: roomId, error } = await supabase
    .rpc('get_or_create_room', {
      p_type: type,
      p_context_type: contextType || null,
      p_context_id: contextId || null,
      p_title: title || null,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ roomId })
}

/**
 * GET /api/chat/room?type=chapter_doubt&contextType=concept&contextId=xxx
 * Returns roomId for a given context (creates if not exists)
 */
export async function GET(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const contextType = searchParams.get('contextType')
  const contextId = searchParams.get('contextId')
  const title = searchParams.get('title')

  if (!type) {
    return NextResponse.json({ error: 'type required' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: roomId, error } = await supabase
    .rpc('get_or_create_room', {
      p_type: type,
      p_context_type: contextType || null,
      p_context_id: contextId || null,
      p_title: title || null,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ roomId })
}
