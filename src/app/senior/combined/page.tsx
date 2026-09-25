import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Sparkles, CheckCircle2, BookOpen, FileText,
  Clock, Layers, TrendingUp, Zap, Award,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getUserEnrollments } from '@/lib/combined-course/depth-merge'
import { generateHybridMergeCombinedCourse } from '@/lib/combined-course/hybrid-merge'

export const metadata = { title: 'Senior Hybrid Combined Course' }

export default async function SeniorCombinedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/senior/combined')
  }

  const enrollments = await getUserEnrollments(user.id)

  // Find senior board enrollment (curriculum)
  const seniorBoardEnrollments = enrollments.filter(
    (e: any) => e.segment === 'senior' && e.target_type === 'class'
  )

  // Find senior exam enrollment (NEET/JEE)
  const seniorExamEnrollments = enrollments.filter(
    (e: any) => e.segment === 'senior' && e.target_type === 'exam'
  )

  // Also include coaching-segment entrance exam enrollments
  const entranceExamEnrollments = enrollments.filter(
    (e: any) => e.target_type === 'exam'
  )

  let combinedCourse = null
  if (seniorBoardEnrollments.length > 0) {
    const curriculumId = seniorBoardEnrollments[0].target_id
    const examIds = entranceExamEnrollments.map((e: any) => e.target_id)
    combinedCourse = await generateHybridMergeCombinedCourse(user.id, curriculumId, examIds)
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/senior"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Senior
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Hybrid Combined Course</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ONE course for board + entrance. Board QNA + Entrance MCQ + Speed drills + PYQs.
        </p>
      </div>

      {combinedCourse ? (
        <div className="space-y-6">
          {/* Header */}
          <Card className="border-primary/30 bg-primary/5 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Hybrid-Merge Combined Course</h2>
                  <Badge variant="default">{combinedCourse.mode}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {combinedCourse.total_concepts} concepts merged from board + entrance.
                  <span className="font-medium text-foreground">
                    {' '}{combinedCourse.overlap_stats.overlap_percent}% common
                  </span>{' '}
                  — same NCERT taught at entrance depth.
                </p>

                {/* Overlap stats */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-xl font-bold text-primary">{combinedCourse.overlap_stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-xl font-bold text-emerald-500">{combinedCourse.overlap_stats.common}</p>
                    <p className="text-xs text-muted-foreground">Common</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-xl font-bold text-blue-500">{combinedCourse.overlap_stats.board_only}</p>
                    <p className="text-xs text-muted-foreground">Board Only</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-xl font-bold text-amber-500">{combinedCourse.overlap_stats.entrance_only}</p>
                    <p className="text-xs text-muted-foreground">Entrance Only</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Practice Layers */}
          <Card className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Practice Layers (Hybrid Dimensions)</h3>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              This combined course includes ALL practice formats:
              board QNA + entrance MCQ + speed drills + PYQs.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="rounded-lg border p-3 text-center">
                <FileText className="mx-auto mb-1 h-4 w-4 text-blue-500" />
                <p className="text-lg font-bold">{combinedCourse.practice_layers.board_qna}</p>
                <p className="text-xs text-muted-foreground">Board QNA</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <CheckCircle2 className="mx-auto mb-1 h-4 w-4 text-emerald-500" />
                <p className="text-lg font-bold">{combinedCourse.practice_layers.entrance_mcq}</p>
                <p className="text-xs text-muted-foreground">Entrance MCQ</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <Award className="mx-auto mb-1 h-4 w-4 text-purple-500" />
                <p className="text-lg font-bold">{combinedCourse.practice_layers.board_pyqs}</p>
                <p className="text-xs text-muted-foreground">Board PYQs</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <Award className="mx-auto mb-1 h-4 w-4 text-amber-500" />
                <p className="text-lg font-bold">{combinedCourse.practice_layers.entrance_pyqs}</p>
                <p className="text-xs text-muted-foreground">Entrance PYQs</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <Zap className="mx-auto mb-1 h-4 w-4 text-rose-500" />
                <p className="text-lg font-bold">{combinedCourse.practice_layers.speed_drills}</p>
                <p className="text-xs text-muted-foreground">Speed Drills</p>
              </div>
            </div>
          </Card>

          {/* Hybrid Daily Plan */}
          <Card className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Hybrid Daily Plan (~90 min/day)</h3>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Balanced across all dimensions — concept learning + board practice + entrance practice + speed + revision.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5">
                <span className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Learn new concepts (entrance depth)
                </span>
                <Badge variant="secondary">{combinedCourse.daily_plan.learn_new} concepts</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5">
                <span className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Board QNA practice (long-form)
                </span>
                <Badge variant="secondary">{combinedCourse.daily_plan.board_practice} QNA</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5">
                <span className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Entrance MCQ practice (timed)
                </span>
                <Badge variant="secondary">{combinedCourse.daily_plan.entrance_practice} MCQs</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5">
                <span className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-rose-500" />
                  Speed drill (rapid MCQs)
                </span>
                <Badge variant="secondary">{combinedCourse.daily_plan.speed_drill} Qs</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5">
                <span className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                  Revision (spaced repetition)
                </span>
                <Badge variant="secondary">{combinedCourse.daily_plan.revision} items</Badge>
              </div>
            </div>
          </Card>

          {/* Progress */}
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

          {/* Concepts list */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              Combined Course Concepts ({combinedCourse.concepts.length})
            </h3>
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
                              Board + Entrance
                            </Badge>
                          )}
                          {c.sources.length === 1 && c.sources[0] === 'entrance' && (
                            <Badge variant="outline" className="text-xs">Entrance only</Badge>
                          )}
                          {c.sources.length === 1 && c.sources[0] === 'board' && (
                            <Badge variant="outline" className="text-xs">Board only</Badge>
                          )}
                        </div>
                        {c.summary && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{c.summary}</p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <Badge variant="default" className="text-xs">Depth L{c.target_depth}</Badge>
                          {c.board_depth !== null && (
                            <Badge variant="outline" className="text-xs">Board L{c.board_depth}</Badge>
                          )}
                          {c.entrance_depth !== null && (
                            <Badge variant="outline" className="text-xs">Entrance L{c.entrance_depth}</Badge>
                          )}
                          <Badge variant="outline" className="text-xs">{c.importance}</Badge>
                          {c.chapter_name && (
                            <span className="text-xs text-muted-foreground">{c.chapter_name}</span>
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
          <Sparkles className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-base font-semibold">No hybrid course yet</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Enroll in a Class 11/12 board subject + an entrance exam (NEET/JEE)
            to generate your hybrid combined course.
          </p>
          <Button asChild className="mt-4">
            <Link href="/senior">
              Browse Senior Segment
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </Card>
      )}
    </div>
  )
}
