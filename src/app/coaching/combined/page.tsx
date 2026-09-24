import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Sparkles, Target, CheckCircle2,
  Layers, TrendingUp, BookOpen,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  getAvailableExams,
  generateSyllabusMergeCombinedCourse,
} from '@/lib/combined-course/syllabus-merge'
import { getUserEnrollments } from '@/lib/combined-course/depth-merge'
import { CombinedCourseGenerator } from '@/components/learn/combined-course-generator'

export const metadata = { title: 'Combined Course — Coaching' }

export default async function CombinedCoursePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const exams = await getAvailableExams()

  // If logged in, get their enrolled exams + generate combined course
  let enrollments: any[] = []
  let combinedCourse = null
  if (user) {
    enrollments = await getUserEnrollments(user.id)
    const examIds = enrollments
      .filter((e: any) => e.segment === 'coaching' && e.target_type === 'exam')
      .map((e: any) => e.target_id)
    if (examIds.length > 0) {
      combinedCourse = await generateSyllabusMergeCombinedCourse(user.id, examIds)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/coaching"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Coaching
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Combined Course Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select multiple exams → get ONE combined course. The killer feature.
        </p>
      </div>

      {/* Exam Selector (works even without login — for demo) */}
      <Card className="mb-6 p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Step 1: Select Exams</h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          {user
            ? 'Select 2+ exams below and click Generate. We\'ll merge their syllabi into one combined course.'
            : 'Login to enroll in exams and generate your combined course. Or browse the demo below.'}
        </p>
        <CombinedCourseGenerator
          exams={exams.map((e: any) => ({ id: e.id, name: e.name, slug: e.slug, category: e.category, conducting_body: e.conducting_body }))}
          initialEnrolledIds={enrollments
            .filter((e: any) => e.segment === 'coaching')
            .map((e: any) => e.target_id)}
        />
      </Card>

      {/* Combined Course Result */}
      {combinedCourse ? (
        <div className="space-y-6">
          {/* Header */}
          <Card className="border-primary/30 bg-primary/5 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Syllabus-Merge Combined Course</h2>
                  <Badge variant="default">{combinedCourse.mode}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {combinedCourse.total_concepts} concepts merged from{' '}
                  {combinedCourse.exams.length} exams.{' '}
                  <span className="font-medium text-foreground">
                    {combinedCourse.overlap_stats.overlap_percent}% common concepts
                  </span>{' '}
                  — you don&apos;t need {combinedCourse.exams.length} separate courses!
                </p>

                {/* Overlap Stats — The Pitch */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-xl font-bold text-primary">
                      {combinedCourse.overlap_stats.total}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Concepts</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-xl font-bold text-emerald-500">
                      {combinedCourse.overlap_stats.common_to_all}
                    </p>
                    <p className="text-xs text-muted-foreground">In All Exams</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-xl font-bold text-amber-500">
                      {combinedCourse.overlap_stats.common_to_some}
                    </p>
                    <p className="text-xs text-muted-foreground">In Some Exams</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-xl font-bold text-muted-foreground">
                      {combinedCourse.overlap_stats.unique}
                    </p>
                    <p className="text-xs text-muted-foreground">Unique</p>
                  </div>
                </div>

                {/* Per-exam breakdown */}
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Per Exam Breakdown:</p>
                  <div className="flex flex-wrap gap-2">
                    {combinedCourse.overlap_stats.per_exam.map((pe: any) => (
                      <Badge key={pe.exam_id} variant="outline" className="text-xs">
                        {pe.exam_name}: {pe.total} total ({pe.unique} unique)
                      </Badge>
                    ))}
                  </div>
                </div>
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

          {/* Concepts */}
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
                          {c.in_exams_count > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              <Layers className="mr-1 h-3 w-3" />
                              {c.in_exams_count} exams
                            </Badge>
                          )}
                          {c.in_exams_count === combinedCourse.exams.length && (
                            <Badge variant="default" className="text-xs">
                              Common to all
                            </Badge>
                          )}
                        </div>
                        {c.summary && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {c.summary}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <Badge variant="outline" className="text-xs">Depth L{c.target_depth}</Badge>
                          <Badge variant="outline" className="text-xs">{c.importance}</Badge>
                          {c.exam_subjects.map((es, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {es.exam_name}: {es.subject}
                            </Badge>
                          ))}
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
                            <BookOpen className="h-4 w-4" />
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
          <h3 className="text-base font-semibold">No combined course yet</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            {user
              ? 'Select 2+ exams above and click "Generate Combined Course" to see the magic.'
              : 'Login and enroll in 2+ exams to generate your combined course.'}
          </p>
          {!user && (
            <Button asChild className="mt-4">
              <Link href="/login">Login to Start</Link>
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}
