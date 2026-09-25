import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, ChevronRight, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getBookBySlug, getBookChapters } from '@/lib/queries/atlas'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) return { title: 'Book Not Found' }
  return {
    title: book.seo_json?.title || `${book.title} — Solutions`,
    description: book.seo_json?.description || book.description,
  }
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const book = await getBookBySlug(slug)

  if (!book) {
    notFound()
  }

  const chapters = await getBookChapters(book.id)

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/atlas"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Books
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="capitalize">{book.segment}</Badge>
          <Badge variant="outline">{book.subject}</Badge>
          <Badge variant="outline">{book.class_ref}</Badge>
          <Badge variant="outline">{book.board_ref}</Badge>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{book.title}</h1>
        {book.author && (
          <p className="mt-1 text-sm text-muted-foreground">by {book.author}</p>
        )}
        {book.description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {book.description}
          </p>
        )}
      </div>

      {/* Chapters */}
      <h2 className="mb-4 text-lg font-semibold">Chapters ({chapters.length})</h2>

      {chapters.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No chapters available yet.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {chapters.map((ch: any) => (
            <Link key={ch.id} href={`/atlas/book/${book.slug}/${ch.slug}`}>
              <Card className="flex items-center justify-between p-4 transition-all hover:shadow-md hover:border-primary/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-sm font-bold">{ch.chapter_number}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{ch.title}</p>
                    {ch.summary && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{ch.summary}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* CTA */}
      <Card className="mt-8 bg-primary p-6 text-primary-foreground">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Want structured learning?</h3>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Create a free account to track progress, get combined courses & AI tutor.
            </p>
          </div>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary-foreground px-4 text-sm font-medium text-primary"
          >
            Sign Up Free
          </Link>
        </div>
      </Card>
    </div>
  )
}
