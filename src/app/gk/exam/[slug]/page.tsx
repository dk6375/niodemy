import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowRight, Calendar, GraduationCap, Sparkles,
  FileQuestion, MessageSquare, Target, BookOpen,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getExamBySlug } from '@/lib/combined-course/syllabus-merge'
import { getEventsForExam } from '@/lib/queries/gk'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const exam = await getExamBySlug(slug)
  if (!exam) return { title: 'Exam GK Not Found' }
  return {
    title: `${exam.name} — GK & Current Affairs`,
    description: `Exam-centric GK for ${exam.name}. Same events, depth personalized for your exam.`,
  }
}

const relevanceColors: Record<string, string> = {
  high: 'bg-primary text-primary-foreground',
  medium: 'bg-amber-500/20 text-amber-600',
  low: 'bg-muted text-muted-foreground',
}

const categoryLabels: Record<string, string> = {
  polity: 'Polity', economy: 'Economy', science: 'Science & Tech', sports: 'Sports',
  international: 'International', national: 'National', awards: 'Awards',
  appointments: 'Appointments', schemes: 'Government Schemes', defense: 'Defense',
  environment: 'Environment', technology: 'Technology',
}

export default async function ExamGkPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const exam = await getExamBySlug(slug)

  if (!exam) {
    notFound()
  }

  const events = await getEventsForExam(exam.id, 30)

  // Group by category
  const grouped: Record<string, any[]> = {}
  for (const e of events) {
    const cat = e.category
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(e)
  }

  const highRelevance = events.filter((e: any) => e.relevance === 'high').length
  const mediumRelevance = events.filter((e: any) => e.relevance === 'medium').length
  const lowRelevance = events.filter((e: any) => e.relevance === 'low').length

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/gk"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All GK
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{exam.conducting_body}</Badge>
          <Badge variant="default">Exam-Centric GK</Badge>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{exam.name} — GK</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Current affairs filtered and personalized for <span className="font-medium">{exam.name}</span> aspirants.
          Same events, different depth — read what matters most for your exam.
        </p>
      </div>

      {/* Relevance breakdown */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{highRelevance}</p>
          <p className="text-xs text-muted-foreground">High Relevance</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{mediumRelevance}</p>
          <p className="text-xs text-muted-foreground">Medium</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-muted-foreground">{lowRelevance}</p>
          <p className="text-xs text-muted-foreground">Low</p>
        </Card>
      </div>

      {/* Practice access — on demand */}
      <Card className="mb-6 border-primary/30 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Practice on Demand</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Read articles above, then test yourself when ready. All practice is personalized for {exam.name}.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/coaching/exam/${exam.slug}`}>
                  <FileQuestion className="mr-1.5 h-3.5 w-3.5" />
                  MCQs
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/qna">
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                  QNA
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/my/chat">
                  <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
                  AI Tutor
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Events by category */}
      {Object.keys(grouped).length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No exam-specific GK yet. Browse <Link href="/gk" className="text-primary">all GK</Link>.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, catEvents]) => (
            <div key={category}>
              <h2 className="mb-3 text-lg font-semibold">
                {categoryLabels[category] || category}
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  ({catEvents.length})
                </span>
              </h2>
              <div className="space-y-2">
                {catEvents.map((e: any) => (
                  <Link key={e.id} href={`/gk/article/${e.slug}`}>
                    <Card className="group flex items-center justify-between p-4 transition-all hover:shadow-md hover:border-primary/30">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${relevanceColors[e.relevance]}`}>
                            {e.relevance}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(e.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="font-semibold">{e.title}</h3>
                        {e.summary && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {e.summary}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 sm:block" />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
