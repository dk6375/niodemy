import Link from 'next/link'
import { Target, CheckCircle2, ArrowRight, FileText, Users, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getAvailableExams } from '@/lib/combined-course/syllabus-merge'

export const metadata = {
  title: 'Coaching — Competitive Exam Preparation',
  description: 'SSC, RRB, Police, Banking, UPSC. Multi-exam combined course — RRB + SSC + Police in one path.',
}

export default async function CoachingPage() {
  const exams = await getAvailableExams()

  // Group by category
  const grouped: Record<string, typeof exams> = {}
  for (const e of exams) {
    const cat = (e as any).category || 'other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(e)
  }

  const categoryLabels: Record<string, string> = {
    railway: 'Railway Exams',
    police: 'Police Exams',
    ssc: 'SSC Exams',
    banking: 'Banking Exams',
    upsc: 'UPSC Exams',
    defence: 'Defence Exams',
    teaching: 'Teaching Exams',
    state_psc: 'State PSC',
    entrance: 'Entrance Exams',
    other: 'Other Exams',
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="default" className="mb-3">
          MVP — Live
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">Coaching</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          After 12th competitive exam preparation. SSC, RRB, Police, Banking, UPSC & more.
        </p>
      </div>

      {/* Combined Course Pitch */}
      <Card className="mx-auto mt-8 max-w-2xl border-primary/30 bg-primary/5 p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Combined Course Engine</h2>
            <p className="text-sm text-muted-foreground">Our killer feature</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Select multiple exams (e.g., RRB Group D + SSC GD + MP Police) and get{' '}
          <span className="font-medium text-foreground">ONE combined course</span> —
          not three separate ones. The system unions all syllabi, dedupes common
          concepts, and creates an optimized learning path.
        </p>
        <div className="mt-4 space-y-2">
          {[
            'Syllabus-merge: RRB + SSC + Police → one combined course',
            "Don't teach me twice: mastered concepts skip across exams",
            'Exam-date-aware daily plan auto-rewiring (coming soon)',
            'AI tutor, doubt chat & spaced repetition (coming soon)',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
        <Button asChild className="mt-6 w-full">
          <Link href="/coaching/combined">
            See Combined Course Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </Card>

      {/* Exam Directory */}
      <div className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">Browse Exams ({exams.length})</h2>

        {exams.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-sm text-muted-foreground">
              No exams available yet. Exams will appear here once added via console.
            </p>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([category, examList]) => (
              <div key={category}>
                <h3 className="mb-3 text-lg font-semibold">
                  {categoryLabels[category] || category}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {examList.map((exam: any) => {
                    const pattern = exam.pattern_json || {}
                    return (
                      <Link key={exam.id} href={`/coaching/exam/${exam.slug}`}>
                        <Card className="h-full p-4 transition-all hover:shadow-md hover:border-primary/30">
                          <h4 className="font-semibold">{exam.name}</h4>
                          <p className="text-xs text-muted-foreground">{exam.conducting_body}</p>
                          {exam.description && (
                            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                              {exam.description}
                            </p>
                          )}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {pattern.total_questions && (
                              <Badge variant="secondary" className="text-xs">
                                <FileText className="mr-1 h-3 w-3" />
                                {pattern.total_questions} Qs
                              </Badge>
                            )}
                            {pattern.duration_minutes && (
                              <Badge variant="secondary" className="text-xs">
                                {pattern.duration_minutes} min
                              </Badge>
                            )}
                            {pattern.negative_marking ? (
                              <Badge variant="outline" className="text-xs">
                                -{pattern.negative_marking} NM
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">No NM</Badge>
                            )}
                          </div>
                          <div className="mt-3 flex items-center text-xs font-medium text-primary">
                            View syllabus
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </div>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: Users, title: 'Multi-Exam Combined', desc: 'Prepare for RRB + SSC + Police together, not separately.' },
          { icon: Award, title: 'PYQ Practice', desc: 'Previous year questions with detailed explanations.' },
          { icon: Target, title: 'Exam-Centric GK', desc: 'GK filtered & personalized to your target exam level.' },
        ].map((f) => {
          const Icon = f.icon
          return (
            <Card key={f.title} className="p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
