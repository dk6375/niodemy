import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Target, BookOpen, TrendingUp, Bookmark,
  MessageSquare, Sparkles, ArrowRight, CheckCircle2, Clock,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  getUserEnrollments,
  getUserProgressSummary,
} from '@/lib/combined-course/depth-merge'
import { Progress } from '@/components/ui/progress'

export const metadata = {
  title: 'My Dashboard',
  description: 'Your learning dashboard — goals, progress, combined courses.',
}

export default async function MyDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const enrollments = await getUserEnrollments(user.id)
  const summary = await getUserProgressSummary(user.id)

  // Group enrollments by segment (cross-segment view)
  const segmentGroups: Record<string, any[]> = {}
  for (const e of enrollments) {
    const seg = (e as any).segment
    if (!segmentGroups[seg]) segmentGroups[seg] = []
    segmentGroups[seg].push(e)
  }

  const segmentLabels: Record<string, string> = {
    school: 'School (Class 6–10)',
    senior: 'Senior (Class 11–12)',
    coaching: 'Coaching',
    college: 'College',
    iti: 'ITI',
    skills: 'Skills',
  }

  const stats = [
    { label: 'Active Goals', value: enrollments.length, icon: Target },
    { label: 'Concepts Mastered', value: summary.mastered, icon: CheckCircle2 },
    { label: 'In Progress', value: summary.learning, icon: Clock },
    { label: 'Avg Mastery', value: `${summary.avgMastery}%`, icon: TrendingUp },
  ]

  const quickLinks = [
    { label: 'My Goals', href: '/my/goals', icon: Target, desc: 'Manage your learning goals' },
    { label: 'My Path', href: '/my/path', icon: BookOpen, desc: 'Current combined course' },
    { label: 'AI Tutor', href: '/my/chat', icon: MessageSquare, desc: 'Ask your personal AI tutor' },
    { label: 'Search', href: '/search', icon: Sparkles, desc: 'Find anything across platform' },
  ]

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Welcome back{user.email ? `, ${user.email.split('@')[0]}` : ''}!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your learning journey, all in one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Quick Links */}
      <h2 className="mb-4 mt-8 text-lg font-semibold">Quick Access</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link key={link.href} href={link.href}>
              <Card className="h-full p-4 transition-all hover:shadow-md">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold">{link.label}</h3>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Active Goals — grouped by segment */}
      <h2 className="mb-4 mt-8 text-lg font-semibold">Active Goals ({enrollments.length})</h2>
      {enrollments.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(segmentGroups).map(([segment, segEnrollments]) => (
            <div key={segment}>
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">{segmentLabels[segment] || segment}</Badge>
                <span className="text-xs text-muted-foreground">{segEnrollments.length} {segEnrollments.length === 1 ? 'goal' : 'goals'}</span>
              </div>
              <div className="space-y-2">
                {segEnrollments.map((e: any) => (
                  <Card key={e.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Target className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{e.target_name || e.target_id}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.target_type} · Priority {e.priority} · Enrolled {new Date(e.enrolled_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={e.status === 'active' ? 'default' : 'secondary'} className="text-xs capitalize">{e.status}</Badge>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <LayoutDashboard className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-base font-semibold">Start your learning journey</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            You haven&apos;t enrolled in any goals yet. Browse segments and enroll
            to get a combined course & personalized plan.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/concepts">
                <BookOpen className="mr-1.5 h-4 w-4" />
                Browse Concepts
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/my/goals">
                Add Goals
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Combined Course CTA */}
      {enrollments.length >= 2 && (
        <Card className="mt-6 border-primary/30 bg-primary/5 p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
            <div className="flex-1">
              <h3 className="text-base font-semibold">Combined Course Available!</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You have {enrollments.length} goals. Generate a combined course
                to learn all of them in one optimized path — no duplication.
              </p>
              <Button asChild size="sm" className="mt-3">
                <Link href="/my/path">
                  Generate Combined Course
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Progress Overview (if any progress exists) */}
      {summary.total > 0 && (
        <Card className="mt-6 p-6">
          <h3 className="mb-3 text-base font-semibold">Overall Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Mastery</span>
                <span className="font-medium">{summary.avgMastery}%</span>
              </div>
              <Progress value={summary.avgMastery} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div>
                <p className="text-2xl font-bold text-primary">{summary.mastered}</p>
                <p className="text-xs text-muted-foreground">Mastered</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-500">{summary.learning}</p>
                <p className="text-xs text-muted-foreground">Learning</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-muted-foreground">{summary.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
