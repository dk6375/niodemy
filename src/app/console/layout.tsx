import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen, FileQuestion, GraduationCap, Users,
  BarChart3, Settings, ScrollText, FileText, Layers,
  LayoutDashboard, LogOut,
} from 'lucide-react'
import { getAuthUser, canAccessConsole } from '@/lib/console/rbac'
import { ConsoleSidebar } from '@/components/console/sidebar'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Console — Niodemy Admin',
  description: 'Internal company management dashboard.',
}

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthUser()

  if (!user) {
    redirect('/login?redirect=/console')
  }

  if (!canAccessConsole(user)) {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <LogOut className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You don&apos;t have access to the Console. This area is restricted to
            content writers and admins.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your role: <span className="font-medium">{user.role}</span>
          </p>
          <Link
            href="/my"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Get counts for sidebar badges
  const supabase = await createClient()
  const [
    { count: contentCount },
    { count: questionCount },
    { count: examCount },
    { count: conceptCount },
    { count: userCount },
  ] = await Promise.all([
    supabase.from('content_assets').select('*', { count: 'exact', head: true }),
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase.from('exams').select('*', { count: 'exact', head: true }),
    supabase.from('concepts').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <ConsoleSidebar
        counts={{
          content: contentCount || 0,
          questions: questionCount || 0,
          exams: examCount || 0,
          concepts: conceptCount || 0,
          users: userCount || 0,
        }}
        role={user.role || 'learner'}
        userName={user.full_name || user.email}
      />
      {/* Main content */}
      <main className="flex-1 overflow-x-hidden bg-muted/20">
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
