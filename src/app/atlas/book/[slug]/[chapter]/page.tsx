import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ChevronRight, BookOpen, FileText, Lightbulb, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getChapterBySlug, getChapterSolutions } from '@/lib/queries/atlas'
import ReactMarkdown from 'react-markdown'

export async function generateMetadata({ params }: { params: Promise<{ slug: string; chapter: string }> }) {
  const { slug, chapter } = await params
  const ch = await getChapterBySlug(slug, chapter)
  if (!ch) return { title: 'Chapter Not Found' }
  return {
    title: ch.seo_json?.title || `${ch.books.title} — ${ch.title} Solutions`,
    description: ch.seo_json?.description || ch.summary,
  }
}

export default async function ChapterSolutionsPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>
}) {
  const { slug, chapter } = await params
  const chapterData = await getChapterBySlug(slug, chapter)

  if (!chapterData) {
    notFound()
  }

  const solutions = await getChapterSolutions(chapterData.id)
  const book = (chapterData as any).books

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    name: `${book.title} — Chapter ${chapterData.chapter_number}: ${chapterData.title}`,
    description: chapterData.summary || `Solutions for ${chapterData.title}`,
    isPartOf: {
      '@type': 'Book',
      name: book.title,
      author: { '@type': 'Organization', name: 'NCERT' },
    },
    mainEntity: solutions.map((s: any) => ({
      '@type': 'Question',
      name: s.question_text.substring(0, 100),
      text: s.question_text,
      acceptedAnswer: {
        '@type': 'Answer',
        text: s.solution_text,
      },
    })),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Atlas', item: '/atlas' },
      { '@type': 'ListItem', position: 2, name: book.title, item: `/atlas/book/${book.slug}` },
      { '@type': 'ListItem', position: 3, name: chapterData.title },
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
        <Link href="/atlas" className="hover:text-foreground">Atlas</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/atlas/book/${book.slug}`} className="hover:text-foreground">{book.title}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground">{chapterData.title}</span>
      </div>

      <Link
        href={`/atlas/book/${book.slug}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {book.title}
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Chapter {chapterData.chapter_number}</Badge>
          <Badge variant="outline">{book.subject}</Badge>
          <Badge variant="outline">{book.class_ref}</Badge>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{chapterData.title}</h1>
        {chapterData.summary && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {chapterData.summary}
          </p>
        )}
      </div>

      {/* Solutions */}
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Solutions ({solutions.length})</h2>
      </div>

      {solutions.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No solutions yet for this chapter.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {solutions.map((s: any, i: number) => (
            <Card key={s.id} className="p-5 sm:p-6">
              {/* Question */}
              <div className="mb-3 flex items-start gap-2">
                <Badge variant="default" className="shrink-0">Q{s.question_number}</Badge>
                {s.marks && (
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {s.marks} {s.marks === 1 ? 'mark' : 'marks'}
                  </Badge>
                )}
                {s.difficulty && (
                  <Badge variant="outline" className="shrink-0 text-xs">D{s.difficulty}</Badge>
                )}
              </div>
              <div className="prose prose-sm max-w-none mb-4 dark:prose-invert">
                <p className="font-medium">{s.question_text}</p>
              </div>

              {/* Solution */}
              <div className="rounded-lg border-l-4 border-l-primary bg-muted/30 p-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Lightbulb className="h-3.5 w-3.5" />
                  SOLUTION
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{s.solution_text}</ReactMarkdown>
                </div>
              </div>

              {/* Concept link */}
              {s.concepts && (
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Related concept:</span>
                  <Link
                    href={`/concept/${s.concepts.slug}`}
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    {s.concepts.title}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* CTA */}
      <Card className="mt-8 bg-primary/5 p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold">Want to learn the concept behind these solutions?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Enroll in {book.class_ref} {book.subject} for structured learning + AI tutor.
            </p>
          </div>
          <Link
            href="/my/goals"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            View Courses
          </Link>
        </div>
      </Card>
    </div>
  )
}
