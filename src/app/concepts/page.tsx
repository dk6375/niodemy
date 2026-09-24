import Link from 'next/link'
import { BookOpen, ChevronRight, Search } from 'lucide-react'
import { getPublishedConcepts } from '@/lib/queries/concepts'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export const metadata = {
  title: 'Browse Concepts — Free Knowledge',
  description: 'Browse all concepts on Niodemy. Free to read, no login required. W3Schools-style open access.',
}

export default async function ConceptsPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>
}) {
  const { subject } = await searchParams
  const concepts = await getPublishedConcepts(subject)

  // Group by subject
  const grouped: Record<string, typeof concepts> = {}
  for (const c of concepts) {
    if (!grouped[c.subject]) grouped[c.subject] = []
    grouped[c.subject].push(c)
  }

  const subjects = Object.keys(grouped).sort()

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold sm:text-3xl">Browse Concepts</h1>
        </div>
        <p className="text-sm text-muted-foreground sm:text-base">
          All concepts are <span className="font-medium text-foreground">free to read</span> — no login required. W3Schools-style open access.
        </p>
      </div>

      {/* Search bar (decorative for now) */}
      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search concepts... (coming soon)"
            className="pl-9"
            disabled
          />
        </div>
      </div>

      {/* Subject filter */}
      {subjects.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Link href="/concepts">
            <Badge
              variant={!subject ? 'default' : 'secondary'}
              className="cursor-pointer px-3 py-1"
            >
              All ({concepts.length})
            </Badge>
          </Link>
          {subjects.map((s) => (
            <Link key={s} href={`/concepts?subject=${encodeURIComponent(s)}`}>
              <Badge
                variant={subject === s ? 'default' : 'secondary'}
                className="cursor-pointer px-3 py-1"
              >
                {s} ({grouped[s].length})
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Concepts grouped by subject */}
      <div className="space-y-8">
        {subjects.map((subj) => (
          <div key={subj}>
            <h2 className="mb-3 text-lg font-semibold">{subj}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(grouped[subj] || []).map((c) => (
                <Link key={c.id} href={`/concept/${c.slug}`}>
                  <Card className="h-full p-4 transition-all hover:shadow-md hover:border-primary/30">
                    <h3 className="text-sm font-semibold">{c.title}</h3>
                    {c.summary && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {c.summary}
                      </p>
                    )}
                    <div className="mt-3 flex items-center text-xs font-medium text-primary">
                      Read concept
                      <ChevronRight className="ml-0.5 h-3 w-3" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {concepts.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-base font-semibold">No concepts yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Concepts will appear here once published via the console.
          </p>
        </Card>
      )}
    </div>
  )
}
