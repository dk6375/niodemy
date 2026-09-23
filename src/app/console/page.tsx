import Link from 'next/link'
import {
  BookOpen, FileQuestion, GraduationCap, Users,
  Layers, TrendingUp, FileText, CheckCircle2,
  Clock, ArrowRight,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Console Dashboard' }

export default async function ConsoleHome() {
  const supabase = await createClient()

  const [
    { count: contentCount },
    { count: publishedContent },
    { count: draftContent },
    { count: questionCount },
    { count: examCount },
    { count: conceptCount },
    { count: userCount },
    { count: teacherCount },
  ] = await Promise.all([
    supabase.from('content_assets').select('*', { count: 'exact', head: true }),
    supabase.from('content_assets').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('content_assets').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase.from('exams').select('*', { count: 'exact', head: true }),
    supabase.from('concepts').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('teacher_profiles').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Content', value: contentCount || 0, icon: BookOpen, href: '/console/content', color: 'text-blue-500' },
    { label: 'Questions', value: questionCount || 0, icon: FileQuestion, href: '/console/questions', color: 'text-emerald-500' },
    { label: 'Concepts', value: conceptCount || 0, icon: Layers, href: '/console/concepts', color: 'text-purple-500' },
    { label: 'Exams', value: examCount || 0, icon: GraduationCap, href: '/console/exams', color: 'text-amber-500' },
    { label: 'Teachers', value: teacherCount || 0, icon: Users, href: '/console/teachers', color: 'text-rose-500' },
    { label: 'Users', value: userCount || 0, icon: Users, href: '/console/users', color: 'text-cyan-500' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Console Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Internal company management. Content production, exam management, analytics.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="p-4 transition-all hover:shadow-md">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Content status overview */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold">Published Content</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-500">{publishedContent || 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">Live on the platform</p>
        </Card>
        <Card className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold">Draft Content</h3>
          </div>
          <p className="text-3xl font-bold text-amber-500">{draftContent || 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">Awaiting review/publish</p>
        </Card>
        <Card className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-semibold">Total Content</h3>
          </div>
          <p className="text-3xl font-bold">{contentCount || 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">All assets</p>
        </Card>
      </div>

      {/* Quick actions */}
      <h2 className="mb-3 mt-8 text-lg font-semibold">Quick Actions</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/console/content">
          <Card className="flex items-center justify-between p-4 transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Create Content</p>
                <p className="text-xs text-muted-foreground">Lessons, tutorials</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Card>
        </Link>
        <Link href="/console/questions">
          <Card className="flex items-center justify-between p-4 transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <FileQuestion className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Add Question</p>
                <p className="text-xs text-muted-foreground">MCQs, PYQs</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Card>
        </Link>
        <Link href="/console/exams">
          <Card className="flex items-center justify-between p-4 transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Manage Exams</p>
                <p className="text-xs text-muted-foreground">Syllabus, patterns</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Card>
        </Link>
      </div>
    </div>
  )
}
