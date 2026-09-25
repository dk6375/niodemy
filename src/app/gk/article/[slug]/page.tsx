import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowRight, Calendar, ExternalLink, BookOpen,
  GraduationCap, Tag, Lightbulb, ChevronRight,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import { getEventBySlug, getEventConcepts, getEventExams } from '@/lib/queries/gk'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: 'Article Not Found' }
  return {
    title: event.seo_json?.title || event.title,
    description: event.seo_json?.description || event.summary,
  }
}

const categoryLabels: Record<string, string> = {
  polity: 'Polity', economy: 'Economy', science: 'Science & Tech', sports: 'Sports',
  international: 'International', national: 'National', awards: 'Awards',
  appointments: 'Appointments', schemes: 'Government Schemes', defense: 'Defense',
  environment: 'Environment', technology: 'Technology',
}

const relevanceColors: Record<string, string> = {
  high: 'bg-primary text-primary-foreground',
  medium: 'bg-amber-500/20 text-amber-600',
  low: 'bg-muted text-muted-foreground',
}

export default async function GkArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const concepts = await getEventConcepts(event.id)
  const exams = await getEventExams(event.id)

  // JSON-LD for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: event.title,
    description: event.summary,
    datePublished: new Date(event.event_date).toISOString(),
    dateModified: new Date(event.created_at).toISOString(),
    author: { '@type': 'Organization', name: 'Niodemy' },
    publisher: { '@type': 'Organization', name: 'Niodemy' },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'GK', item: '/gk' },
      { '@type': 'ListItem', position: 2, name: categoryLabels[event.category] || event.category, item: `/gk/${event.category}` },
      { '@type': 'ListItem', position: 3, name: event.title },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/gk" className="hover:text-foreground">GK</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/gk/${event.category}`} className="hover:text-foreground">
          {categoryLabels[event.category] || event.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground">{event.title}</span>
      </div>

      <Link
        href={`/gk/${event.category}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {categoryLabels[event.category] || event.category}
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{categoryLabels[event.category] || event.category}</Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          {event.gk_relevance === 'high' && (
            <Badge variant="default">High GK Relevance</Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{event.title}</h1>
        {event.summary && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {event.summary}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main content */}
        <div className="lg:col-span-3">
          <Card className="p-5 sm:p-8">
            <div className="prose prose-sm max-w-none dark:prose-invert sm:prose-base">
              <ReactMarkdown>{event.body_md}</ReactMarkdown>
            </div>
          </Card>

          {/* Source */}
          {event.source_name && (
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Source:</span>
              <span className="font-medium">{event.source_name}</span>
              {event.source_url && (
                <a
                  href={event.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Official link
                </a>
              )}
            </div>
          )}

          {/* Related concepts */}
          {concepts.length > 0 && (
            <Card className="mt-6 p-5">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Related Concepts</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {concepts.map((c: any) => (
                  <Link key={c.id} href={`/concept/${c.slug}`}>
                    <Badge variant="secondary" className="cursor-pointer gap-1">
                      <Tag className="h-3 w-3" />
                      {c.title}
                    </Badge>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Exam relevance */}
          {exams.length > 0 && (
            <Card className="mt-4 p-5">
              <div className="mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Exam Relevance</h3>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                This article is relevant for the following exams (click to see exam-specific GK):
              </p>
              <div className="flex flex-wrap gap-2">
                {exams.map((e: any) => (
                  <Link key={e.id} href={`/gk/exam/${e.slug}`}>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${relevanceColors[e.relevance]}`}>
                      <GraduationCap className="h-3 w-3" />
                      {e.name}
                      <span className="opacity-70">({e.relevance})</span>
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Practice This Topic</h3>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Test your knowledge with practice questions on current affairs.
            </p>
            <div className="space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link href="/qna/new">Ask QNA</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link href="/my/chat">Ask AI Tutor</Link>
              </Button>
            </div>

            <div className="mt-4 border-t pt-4">
              <p className="mb-2 text-xs font-semibold">Depth Guide</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li><span className="font-medium">High:</span> Likely in all exams</li>
                <li><span className="font-medium">Medium:</span> Sometimes asked</li>
                <li><span className="font-medium">Low:</span> Rare or specific exam</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
