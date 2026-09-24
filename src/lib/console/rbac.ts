/**
 * Role-Based Access Control (RBAC) helpers.
 * Roles: learner, content_writer, teacher, admin
 *
 * Console (/console): accessible by content_writer + admin
 * Teacher Dashboard (/teacher): accessible by teacher + admin
 */

import { createClient } from '@/lib/supabase/server'

export type Role = 'learner' | 'content_writer' | 'teacher' | 'admin'

export interface AuthUser {
  id: string
  email: string
  role: Role | null
  full_name: string | null
}

/** Get current authenticated user with role from profiles table */
export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Check if profiles table exists; if not, default to learner
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email || '',
    role: (profile?.role as Role) || 'learner',
    full_name: profile?.full_name || user.user_metadata?.full_name || null,
  }
}

/** Check if user can access Console (content_writer or admin) */
export function canAccessConsole(user: AuthUser | null): boolean {
  if (!user) return false
  return user.role === 'content_writer' || user.role === 'admin'
}

/** Check if user can access Teacher Dashboard (teacher or admin) */
export function canAccessTeacherDashboard(user: AuthUser | null): boolean {
  if (!user) return false
  return user.role === 'teacher' || user.role === 'admin'
}

/** Check if user is admin */
export function isAdmin(user: AuthUser | null): boolean {
  if (!user) return false
  return user.role === 'admin'
}
