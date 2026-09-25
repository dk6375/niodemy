import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  MessageSquare, Video, Users, BookOpen, Calendar, User,
  LayoutDashboard, LogOut,
} from 'lucide-react'
import { getAuthUser, canAccessTeacherDashboard } from '@/lib/console/rbac'

export const metadata = {
  title: 'Teacher Dashboard — Niodemy',
  description: 'Teachers\' workspace: doubts, live classes, students.',
}

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthUser()

  if (!user) {
    redirect('/login?redirect=/teacher')
  }

  if (!canAccessTeacherDashboard(user)) {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <LogOut className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="text-xl font-bold">Teacher Access Required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This area is for teachers only. Your role:{' '}
            <span className="font-medium">{user.role}</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Contact admin to get teacher access.
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

  const navItems = [
    { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
    { name: 'Doubt Queue', href: '/teacher/doubts', icon: MessageSquare },
    { name: 'QNA Queue', href: '/teacher/qna-queue', icon: MessageSquare },
    { name: 'Live Classes', href: '/teacher/live', icon: Video },
    { name: 'My Students', href: '/teacher/students', icon: Users },
    { name: 'My Content', href: '/teacher/content', icon: BookOpen },
    { name: 'My Schedule', href: '/teacher/schedule', icon: Calendar },
    { name: 'My Profile', href: '/teacher/profile', icon: User },
  ]

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r bg-card lg:block">
        <div className="flex h-full flex-col">
          {/* User info */}
          <div className="border-b p-4">
            <p className="text-xs font-medium text-muted-foreground">Teacher</p>
            <p className="truncate text-sm font-semibold">
              {user.full_name || user.email}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <BookOpen className="h-4 w-4" />
              Back to Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden bg-muted/20">
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
