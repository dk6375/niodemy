import Link from 'next/link'
import { Newspaper, ArrowRight, Calendar, Tag, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getCurrentEvents, getCategoriesWithCounts } from '@/lib/queries/gk'

export const metadata = {
  title: 'GK & Current Affairs — Daily Feed',
  description: 'Content-first current affairs. Exam-centric, personalized. Read articles free, then practice on demand.',
}

const categoryLabels: Record<string, string> = {
  polity: 'Polity',
  economy: 'Economy',
  science: 'Science & Tech',
  sports: 'Sports',
  international: 'International',
  national: 'National',
  awards: 'Awards',
  appointments: 'Appointments',
  schemes: 'Government Schemes',
  defense: 'Defense',
  environment: 'Environment',
  technology: 'Technology',
}

const categoryColors: Record<string, string> = {
  polity: 'text-blue-500 bg-blue-500/10',
  economy: 'text-emerald-500 bg-emerald-500/10',
  science: 'text-purple-500 bg-purple-500/10',
  sports: 'text-rose-500 bg-rose-500/10',
  international: 'text-amber-500 bg-amber-500/10',
  national: 'text-cyan-500 bg-cyan-500/10',
  awards: 'text-yellow-500 bg-yellow-500/10',
  appointments: 'text-indigo-500 bg-indigo-500/10',
  schemes: 'text-pink-500 bg-pink-500/10',
  defense: 'text-red-500 bg-red-500/10',
  environment: 'text-green-500 bg-green-500/10',
  technology: 'text-teal-500 bg-teal-500/10',
}

export default async function GkPage() {
  const events = await getCurrentEvents(undefined, 20)
  const categoryCounts = await getCategoriesWithCounts()

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Content-First · Exam-Centric
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">GK & Current Affairs</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Read articles first, then practice on demand (MCQ / Quiz / QNA / MockTest).
          Exam-centric — same event, different depth for your exam.
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/gk">
          <Badge variant="default" className="cursor-pointer px-3 py-1">
            All ({events.length})
          </Badge>
        </Link>
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <Link key={cat} href={`/gk/${cat}`}>
            <Badge variant="secondary" className="cursor-pointer px-3 py-1">
              {categoryLabels[cat] || cat} ({count})
            </Badge>
          </Link>
        ))}
      </div>

      {/* Events list */}
      <div className="space-y-3">
        {events.map((e: any) => {
          const colorClass = categoryColors[e.category] || 'text-muted-foreground bg-muted'
          return (
            <Link key={e.id} href={`/gk/article/${e.slug}`}>
              <Card className="group flex flex-col gap-3 p-4 transition-all hover:shadow-md hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${colorClass}`}>
                      {categoryLabels[e.category] || e.category}
                    </span>
                    {e.gk_relevance === 'high' && (
                      <Badge variant="default" className="text-xs">High relevance</Badge>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(e.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-semibold">{e.title}</h3>
                  {e.summary && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {e.summary}
                    </p>
                  )}
                  {e.source_name && (
                    <p className="mt-1 text-xs text-muted-foreground">Source: {e.source_name}</p>
                  )}
                </div>
                <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 sm:block" />
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Exam-centric CTA */}
      <Card className="mt-8 border-primary/30 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <Newspaper className="mt-0.5 h-5 w-5 text-primary" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Exam-Centric GK</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Preparing for a specific exam? Browse GK personalized to your exam level.
              RRB basics, SSC medium, UPSC deep — same events, different depth.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/gk/exam/rrb-group-d">RRB Group D GK</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/gk/exam/ssc-gd">SSC GD GK</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/gk/exam/mp-police-constable">MP Police GK</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
