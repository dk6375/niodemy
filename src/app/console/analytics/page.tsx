import { BarChart3, TrendingUp, BookOpen, Users, FileQuestion, GraduationCap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Analytics — Console' }

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: totalContent },
    { count: totalQuestions },
    { count: totalExams },
    { count: totalConcepts },
    { count: enrollments },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('content_assets').select('*', { count: 'exact', head: true }),
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase.from('exams').select('*', { count: 'exact', head: true }),
    supabase.from('concepts').select('*', { count: 'exact', head: true }),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Total Users', value: totalUsers || 0, icon: Users, color: 'text-cyan-500' },
    { label: 'Active Enrollments', value: enrollments || 0, icon: GraduationCap, color: 'text-emerald-500' },
    { label: 'Content Assets', value: totalContent || 0, icon: BookOpen, color: 'text-blue-500' },
    { label: 'Questions', value: totalQuestions || 0, icon: FileQuestion, color: 'text-purple-500' },
    { label: 'Exams', value: totalExams || 0, icon: GraduationCap, color: 'text-amber-500' },
    { label: 'Concepts', value: totalConcepts || 0, icon: TrendingUp, color: 'text-rose-500' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform overview. (More detailed analytics coming soon.)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-4">
              <Icon className={`h-5 w-5 ${stat.color}`} />
              <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          )
        })}
      </div>

      <Card className="mt-8 p-8 text-center">
        <BarChart3 className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
        <h3 className="text-base font-semibold">Detailed Analytics Coming Soon</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Charts for content performance, user engagement, learning outcomes, and more.
        </p>
      </Card>
    </div>
  )
}
