import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser, canAccessConsole } from '@/lib/console/rbac'

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!canAccessConsole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const body = await request.json()
  const supabase = await createClient()

  const { data, error } = await supabase.from('concepts').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('audit_logs').insert({ user_id: user!.id, action: 'create', entity_type: 'concept', entity_id: data.id, changes_json: body })
  return NextResponse.json({ concept: data })
}
