import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Sparkles, Target, BookOpen, CheckCircle2,
  Clock, Layers, ArrowRight, TrendingUp,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getUserEnrollments, generateDepthMergeCombinedCourse } from '@/lib/combined-course/depth-merge'

export const metadata = { title: 'My Combined Course' }

export default async function MyPathPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const enrollments = await getUserEnrollments(user.id)

  // For School segment enrollments, gather curriculum_ids
  const curriculumIds = enrollments
    .filter((e: any) => e.segment === 'school' && e.target_type === 'class')
    .map((e: any) => e.target_id)

  let combinedCourse = null
  if (curriculumIds.length > 0) {
    combinedCourse = await generateDepthMergeCombinedCourse(user.id, curriculumIds)
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/my"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">My Combined Course</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One optimized learning path for all your goals.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <Card className="p-12 text-center">
          <Target className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-base font-semibold">No goals yet</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Enroll in at least one goal to generate a combined course.
          </p>
          <Button asChild className="mt-4">
            <Link href="/my/goals">Browse Goals</Link>
          </Button>
        </Card>
      ) : combinedCourse ? (
        <div className="space-y-6">
          {/* Combined Course Header */}
          <Card className="border-primary/30 bg-primary/5 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Depth-Merge Combined Course</h2>
                  <Badge variant="default">{combinedCourse.mode}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {combinedCourse.total_concepts} concepts merged from {enrollments.length} goals.
                  Same NCERT, taught at the depth of your most demanding goal.
                </p>

                {/* Overlap Stats */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-xl font-bold text-primary">{combinedCourse.overlap_stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-xl font-bold text-emerald-500">{combinedCourse.overlap_stats.common}</p>
                    <p className="text-xs text-muted-foreground">Common</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-xl font-bold text-amber-500">{combinedCourse.overlap_stats.unique}</p>
                    <p className="text-xs text-muted-foreground">Unique</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Progress Summary */}
          <Card className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Combined Progress</h3>
            </div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">
                {combinedCourse.mastered_concepts} / {combinedCourse.total_concepts} mastered
              </span>
              <span className="font-medium">
                {combinedCourse.total_concepts > 0
                  ? Math.round((combinedCourse.mastered_concepts / combinedCourse.total_concepts) * 100)
                  : 0}%
              </span>
            </div>
            <Progress
              value={combinedCourse.total_concepts > 0
                ? (combinedCourse.mastered_concepts / combinedCourse.total_concepts) * 100
                : 0}
              className="h-2"
            />
          </Card>

          {/* Combined Course Concepts */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Course Concepts ({combinedCourse.concepts.length})</h3>
            <div className="space-y-3">
              {combinedCourse.concepts.map((c, i) => (
                <Link key={c.id} href={`/concept/${c.slug}`}>
                  <Card className="p-4 transition-all hover:shadow-md hover:border-primary/30">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
                          <h4 className="font-semibold">{c.title}</h4>
                          {c.sources.length > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              <Layers className="mr-1 h-3 w-3" />
                              {c.sources.length} goals
                            </Badge>
                          )}
                        </div>
                        {c.summary && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {c.summary}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          <Badge variant="outline">Depth L{c.target_depth}</Badge>
                          <Badge variant="outline">{c.importance}</Badge>
                          {c.chapter_name && (
                            <span className="text-muted-foreground">{c.chapter_name}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {c.mastery !== null && c.mastery >= 80 ? (
                          <div className="flex items-center gap-1 text-primary">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-xs font-medium">{c.mastery}%</span>
                          </div>
                        ) : c.mastery !== null ? (
                          <div className="flex items-center gap-1 text-amber-500">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs font-medium">{c.mastery}%</span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs">Not started</Badge>
                        )}
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-base font-semibold">No combined course yet</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Your enrollments don&apos;t support combined course generation yet.
            Enroll in School segment goals (same class) to get a depth-merge combined course.
          </p>
          <Button asChild className="mt-4">
            <Link href="/my/goals">Browse School Goals</Link>
          </Button>
        </Card>
      )}
    </div>
  )
}
