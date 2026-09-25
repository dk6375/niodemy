import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, FileText, Clock, AlertCircle, BookOpen, GraduationCap, Globe, ExternalLink, ArrowRight, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: exam } = await supabase
    .from('exams')
    .select('name, slug, description')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()
  if (!exam) return { title: 'Exam Not Found' }
  return {
    title: `${exam.name} — Pattern, Syllabus, PYQs`,
    description: exam.description,
  }
}

export default async function SeniorExamPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: exam } = await supabase
    .from('exams')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!exam) {
    notFound()
  }

  // Get exam concepts (syllabus)
  const { data: examConcepts } = await supabase
    .from('exam_concepts')
    .select(`
      concept_id, depth_required, importance, subject,
      concepts!inner(slug, title, summary)
    `)
    .eq('exam_id', exam.id)

  // Group by subject
  const grouped: Record<string, any[]> = {}
  for (const ec of examConcepts || []) {
    const subj = (ec as any).subject || 'General'
    if (!grouped[subj]) grouped[subj] = []
    grouped[subj].push(ec)
  }

  const pattern = exam.pattern_json || {}
  const eligibility = exam.eligibility_json || {}

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/senior"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Senior Home
      </Link>

      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Entrance Exam</Badge>
          <Badge variant="outline">{exam.conducting_body}</Badge>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{exam.name}</h1>
        {exam.description && (
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">{exam.description}</p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Pattern */}
          <Card className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Exam Pattern</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {pattern.total_questions && (
                <div className="rounded-lg border bg-muted/30 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total Questions</p>
                  <p className="text-lg font-bold">{pattern.total_questions}</p>
                </div>
              )}
              {pattern.questions_to_attempt && (
                <div className="rounded-lg border bg-muted/30 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Attempt</p>
                  <p className="text-lg font-bold">{pattern.questions_to_attempt}</p>
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
            </div>
            {pattern.marking && (
              <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
                <span className="font-medium">Marking:</span> {pattern.marking}
              </div>
            )}
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

          {/* Syllabus */}
          <Card className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Syllabus ({examConcepts?.length || 0} concepts)</h2>
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
                            <Badge variant={ec.importance === 'high' ? 'default' : 'secondary'} className="text-xs">
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
        <div className="space-y-4">
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
              {eligibility.min_marks && (
                <div>
                  <dt className="text-xs text-muted-foreground">Min Marks</dt>
                  <dd>{eligibility.min_marks}</dd>
                </div>
              )}
              {eligibility.attempts && (
                <div>
                  <dt className="text-xs text-muted-foreground">Attempts</dt>
                  <dd>{eligibility.attempts}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Quick Info</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Mode: {pattern.mode || 'CBT'}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Negative: {pattern.negative_marking ? `-${pattern.negative_marking}` : 'No'}</span>
              </div>
            </div>
            {exam.official_url && (
              <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                <a href={exam.official_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  Official Website
                </a>
              </Button>
            )}
          </Card>

          {/* Hybrid-merge CTA */}
          <Card className="border-primary/30 bg-primary/5 p-5">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Combine with Board</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Enroll in Class 12 board subject + this exam → get ONE hybrid course.
            </p>
            <Button asChild size="sm" className="mt-3 w-full">
              <Link href="/my/goals">
                Generate Hybrid Course
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
