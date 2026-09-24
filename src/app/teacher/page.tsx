import Link from 'next/link'
import {
  MessageSquare, Video, Users, Calendar, ArrowRight,
  Clock, CheckCircle2, AlertCircle,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getAuthUser } from '@/lib/console/rbac'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Teacher Dashboard' }

export default async function TeacherHome() {
  const user = await getAuthUser()
  const supabase = await createClient()

  // Get teacher profile
  const { data: teacherProfile } = await supabase
    .from('teacher_profiles')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  const stats = [
    { label: 'Pending Doubts', value: 0, icon: MessageSquare, color: 'text-amber-500', href: '/teacher/doubts' },
    { label: 'Upcoming Classes', value: 0, icon: Video, color: 'text-blue-500', href: '/teacher/live' },
    { label: 'My Students', value: 0, icon: Users, color: 'text-emerald-500', href: '/teacher/students' },
    { label: 'This Week', value: 0, icon: Calendar, color: 'text-purple-500', href: '/teacher/schedule' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Welcome, {user!.full_name || user!.email.split('@')[0]}!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Teacher Dashboard. Your workspace for doubts, live classes, and students.
        </p>
      </div>

      {/* Teacher profile status */}
      {!teacherProfile && (
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Complete Your Teacher Profile</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Add your expertise, bio, and availability so students can find you.
              </p>
              <Link
                href="/teacher/profile"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary"
              >
                Set up profile
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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

      {/* Today's tasks */}
      <h2 className="mb-3 mt-8 text-lg font-semibold">Today&apos;s Tasks</h2>
      <Card className="p-8 text-center">
        <Clock className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Your tasks will appear here once chat system is live (Session 6).
        </p>
      </Card>

      {/* Quick access */}
      <h2 className="mb-3 mt-8 text-lg font-semibold">Quick Access</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Doubt Queue', desc: 'Student doubts awaiting response', href: '/teacher/doubts', icon: MessageSquare },
          { label: 'Live Classes', desc: 'Schedule & host live classes', href: '/teacher/live', icon: Video },
          { label: 'My Students', desc: 'View student progress', href: '/teacher/students', icon: Users },
          { label: 'My Schedule', desc: 'Upcoming classes & tasks', href: '/teacher/schedule', icon: Calendar },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Card className="h-full p-4 transition-all hover:shadow-md">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold">{item.label}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
