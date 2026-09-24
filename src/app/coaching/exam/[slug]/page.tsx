import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowRight, FileText, Clock, AlertCircle,
  GraduationCap, Users, Globe, ExternalLink, BookOpen, Target,
} from 'lucide-react'
import { getExamBySlug, getExamConcepts } from '@/lib/combined-course/syllabus-merge'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const exam = await getExamBySlug(slug)
  if (!exam) return { title: 'Exam Not Found' }
  return {
    title: `${exam.name} — Syllabus, Pattern, Eligibility`,
    description: exam.description || `Complete details for ${exam.name}.`,
  }
}

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const exam = await getExamBySlug(slug)

  if (!exam) {
    notFound()
  }

  const examConcepts = await getExamConcepts(exam.id)
  const pattern = exam.pattern_json || {}
  const eligibility = exam.eligibility_json || {}

  // Group concepts by subject
  const grouped: Record<string, any[]> = {}
  for (const ec of examConcepts as any[]) {
    const subj = ec.subject || 'General'
    if (!grouped[subj]) grouped[subj] = []
    grouped[subj].push(ec)
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/coaching"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Exams
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{exam.category}</Badge>
          {exam.conducting_body && (
            <Badge variant="outline">{exam.conducting_body}</Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{exam.name}</h1>
        {exam.description && (
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {exam.description}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Exam Pattern */}
          <Card className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Exam Pattern</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {pattern.total_questions && (
                <div className="rounded-lg border bg-muted/30 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Questions</p>
                  <p className="text-lg font-bold">{pattern.total_questions}</p>
                </div>
              )}
              {pattern.total_marks && (
                <div className="rounded-lg border bg-muted/30 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Marks</p>
                  <p className="text-lg font-bold">{pattern.total_marks}</p>
                </div>
              )}
              {pattern.duration_minutes && (
                <div className="rounded-lg border bg-muted/30 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-lg font-bold">{pattern.duration_minutes} min</p>
                </div>
              )}
              <div className="rounded-lg border bg-muted/30 p-3 text-center">
                <p className="text-xs text-muted-foreground">Negative</p>
                <p className="text-lg font-bold">
                  {pattern.negative_marking ? `-${pattern.negative_marking}` : 'No'}
                </p>
              </div>
            </div>
            {pattern.sections && Array.isArray(pattern.sections) && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Sections</p>
                <div className="flex flex-wrap gap-2">
                  {pattern.sections.map((s: string, i: number) => (
                    <Badge key={i} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Syllabus (Concepts) */}
          <Card className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Syllabus ({examConcepts.length} concepts)</h2>
            </div>

            {Object.keys(grouped).length === 0 ? (
              <p className="text-sm text-muted-foreground">No syllabus data yet.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(grouped).map(([subject, concepts]) => (
                  <div key={subject}>
                    <h3 className="mb-2 text-sm font-semibold">{subject}</h3>
                    <div className="space-y-1.5">
                      {concepts.map((ec: any) => (
                        <Link
                          key={ec.concept_id}
                          href={`/concept/${ec.concepts?.slug}`}
                          className="flex items-center justify-between rounded-lg border p-2.5 transition-colors hover:border-primary/30 hover:bg-accent"
                        >
                          <span className="text-sm">{ec.concepts?.title}</span>
                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="text-xs">L{ec.depth_required}</Badge>
                            <Badge
                              variant={ec.importance === 'high' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {ec.importance}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Eligibility */}
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Eligibility</h3>
            </div>
            <dl className="space-y-2 text-sm">
              {eligibility.min_education && (
                <div>
                  <dt className="text-xs text-muted-foreground">Education</dt>
                  <dd>{eligibility.min_education}</dd>
                </div>
              )}
              {eligibility.max_age && (
                <div>
                  <dt className="text-xs text-muted-foreground">Max Age</dt>
                  <dd>{eligibility.max_age} years</dd>
                </div>
              )}
              {eligibility.age_relaxation && (
                <div>
                  <dt className="text-xs text-muted-foreground">Age Relaxation</dt>
                  <dd className="text-xs">{eligibility.age_relaxation}</dd>
                </div>
              )}
              {eligibility.nationality && (
                <div>
                  <dt className="text-xs text-muted-foreground">Nationality</dt>
                  <dd>{eligibility.nationality}</dd>
                </div>
              )}
            </dl>
          </Card>

          {/* Quick Info */}
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Quick Info</h3>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Languages: {exam.languages?.join(', ') || 'hi, en'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Mode: {pattern.mode || 'CBT'}</span>
              </div>
            </dl>
            {exam.official_url && (
              <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                <a href={exam.official_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  Official Website
                </a>
              </Button>
            )}
          </Card>

          {/* Combined Course CTA */}
          <Card className="border-primary/30 bg-primary/5 p-5">
            <div className="mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Preparing for multiple exams?</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Combine this exam with others (RRB + SSC + Police) into ONE course.
              No duplicate learning.
            </p>
            <Button asChild size="sm" className="mt-3 w-full">
              <Link href="/coaching/combined">
                Generate Combined Course
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
