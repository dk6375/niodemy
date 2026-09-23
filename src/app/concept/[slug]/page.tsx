import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, HelpCircle, FileText, ChevronRight } from 'lucide-react'
import { getConceptBySlug, getContentForConcept, getQuestionsForConcept } from '@/lib/queries/concepts'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { QuestionPractice } from '@/components/learn/question-practice'
import ReactMarkdown from 'react-markdown'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const concept = await getConceptBySlug(slug)
  if (!concept) return { title: 'Concept Not Found' }
  return {
    title: concept.title,
    description: concept.summary || `Learn ${concept.title} on Niodemy`,
  }
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const concept = await getConceptBySlug(slug)

  if (!concept) {
    notFound()
  }

  const [content, questions] = await Promise.all([
    getContentForConcept(concept.id),
    getQuestionsForConcept(concept.id),
  ])

  const keyFacts = concept.content_json?.key_facts || []
  const components = concept.content_json?.components || []
  const depthLayers = concept.depth_layers || {}

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{concept.subject}</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground">{concept.title}</span>
      </div>

      <Link
        href="/concepts"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Concepts
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{concept.subject}</Badge>
          {concept.domain && <Badge variant="outline">{concept.domain}</Badge>}
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {concept.title}
        </h1>
        {concept.summary && (
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {concept.summary}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Definition */}
          {concept.content_json?.definition && (
            <Card className="border-l-4 border-l-primary p-5 sm:p-6">
              <h2 className="mb-2 text-lg font-semibold">Definition</h2>
              <p className="text-sm leading-relaxed sm:text-base">
                {concept.content_json.definition}
              </p>
            </Card>
          )}

          {/* Key Facts */}
          {keyFacts.length > 0 && (
            <Card className="p-5 sm:p-6">
              <h2 className="mb-3 text-lg font-semibold">Key Facts</h2>
              <ul className="space-y-2">
                {keyFacts.map((fact: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Components */}
          {components.length > 0 && (
            <Card className="p-5 sm:p-6">
              <h2 className="mb-3 text-lg font-semibold">Components</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {components.map((comp: any, i: number) => (
                  <div key={i} className="rounded-lg border bg-muted/30 p-3">
                    <p className="text-sm font-medium">{comp.name}</p>
                    {comp.desc && (
                      <p className="mt-1 text-xs text-muted-foreground">{comp.desc}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Lesson content */}
          {content.length > 0 && (
            <Card className="p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Lesson</h2>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {content.map((c) => (
                  <ReactMarkdown key={c.id}>{c.body_md || ''}</ReactMarkdown>
                ))}
              </div>
            </Card>
          )}

          {/* Practice Questions */}
          {questions.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">
                  Practice Questions ({questions.length})
                </h2>
              </div>
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div key={q.id}>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Q{i + 1}
                    </p>
                    <QuestionPractice question={q} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No questions state */}
          {questions.length === 0 && (
            <Card className="p-8 text-center">
              <HelpCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No practice questions yet for this concept.
              </p>
            </Card>
          )}
        </div>

        {/* Sidebar — Depth Layers */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Depth Layers</h3>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Same concept taught at different depths for different goals.
            </p>
            <div className="space-y-3">
              {Object.entries(depthLayers).map(([level, text]: [string, any]) => (
                <div key={level} className="rounded-lg border p-3">
                  <Badge variant="secondary" className="mb-1.5 text-xs">
                    {level}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-4">
              <p className="mb-2 text-xs font-semibold">Depth Guide</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li><span className="font-medium">L1:</span> Basic awareness</li>
                <li><span className="font-medium">L2:</span> Exam facts</li>
                <li><span className="font-medium">L3:</span> Conceptual</li>
                <li><span className="font-medium">L4:</span> Advanced</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <Card className="mt-8 bg-primary p-6 text-primary-foreground">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Want structured learning?</h3>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Create a free account to track progress, get combined courses & AI tutor.
            </p>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href="/signup">Sign Up Free</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
