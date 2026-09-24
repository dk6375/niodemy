import Link from 'next/link'
import { BookOpen, ArrowRight, GraduationCap, FlaskConical, Building2, Wrench, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { getBooks } from '@/lib/queries/atlas'

export const metadata = {
  title: 'Atlas — Books Solutions',
  description: 'Free NCERT and textbook solutions. School, Senior, College, ITI — all in one place.',
}

const segmentInfo: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  school: { label: 'School (Class 6-10)', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  senior: { label: 'Senior (Class 11-12)', icon: FlaskConical, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  college: { label: 'College / University', icon: Building2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  iti: { label: 'ITI / Vocational', icon: Wrench, color: 'text-amber-500', bg: 'bg-amber-500/10' },
}

export default async function AtlasPage() {
  const books = await getBooks()

  // Group by segment
  const grouped: Record<string, typeof books> = {}
  for (const b of books) {
    const seg = (b as any).segment
    if (!grouped[seg]) grouped[seg] = []
    grouped[seg].push(b)
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <Badge variant="secondary" className="mb-3">Free Reference · SEO-friendly</Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">Atlas — Books Solutions</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Free textbook solutions for all segments. NCERT, state boards, college, ITI.
          No login required. W3Schools-style open access.
        </p>
      </div>

      {/* Search (decorative) */}
      <div className="mb-8 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search books, chapters, solutions... (coming soon)"
            className="pl-9"
            disabled
          />
        </div>
      </div>

      {/* Segments */}
      {Object.keys(grouped).length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No books available yet.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([segment, segBooks]) => {
            const info = segmentInfo[segment] || { label: segment, icon: BookOpen, color: 'text-muted-foreground', bg: 'bg-muted' }
            const Icon = info.icon
            return (
              <div key={segment}>
                <div className="mb-3 flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${info.bg} ${info.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-semibold">{info.label}</h2>
                  <Badge variant="outline" className="text-xs">
                    {segBooks.length} {segBooks.length === 1 ? 'book' : 'books'}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {segBooks.map((b: any) => (
                    <Link key={b.id} href={`/atlas/book/${b.slug}`}>
                      <Card className="group h-full p-4 transition-all hover:shadow-md hover:border-primary/30">
                        <h3 className="font-semibold">{b.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {b.author} · {b.class_ref} · {b.board_ref}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {b.description}
                        </p>
                        <div className="mt-3 flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          View chapters
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
