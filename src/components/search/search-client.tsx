'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search, BookOpen, FileText, HelpCircle, Newspaper, Library,
  Loader2, ArrowRight, Sparkles,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchResults {
  concepts: any[]
  content: any[]
  questions: any[]
  events: any[]
  books: any[]
  total: number
}

const typeConfig = {
  concepts: { label: 'Concepts', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10', route: (item: any) => `/concept/${item.slug}` },
  content: { label: 'Content', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10', route: (item: any) => `/concept/${item.concepts?.slug || ''}` },
  questions: { label: 'Questions', icon: HelpCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', route: (item: any) => `/concept/${item.concepts?.slug || ''}` },
  events: { label: 'GK & Current Affairs', icon: Newspaper, color: 'text-amber-500', bg: 'bg-amber-500/10', route: (item: any) => `/gk/article/${item.slug}` },
  books: { label: 'Atlas Books', icon: Library, color: 'text-cyan-500', bg: 'bg-cyan-500/10', route: (item: any) => `/atlas/book/${item.slug}` },
}

export function SearchClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 2) {
      setResults(null)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data)
      }
    } catch (e) {
      console.error('Search error:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  // Run search on mount if query present
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      performSearch(q)
    }
  }, [searchParams, performSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      performSearch(query)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Search bar */}
      <div className="mb-6">
        <h1 className="mb-4 text-2xl font-bold sm:text-3xl">Search</h1>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search concepts, questions, GK, books..."
              className="pl-9"
              autoFocus
            />
          </div>
          <Button type="submit" disabled={loading || !query.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </form>
        {results && results.total > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            Found <span className="font-medium text-foreground">{results.total}</span> results for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !results ? (
        <Card className="p-12 text-center">
          <Search className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-base font-semibold">Search across the platform</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Find concepts, lessons, questions, GK articles, and book solutions.
          </p>
          <div className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2">
            {[
              'photosynthesis',
              'pythagoras',
              'fundamental rights',
              'chandrayaan',
              'NCERT Class 10',
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion)
                  router.push(`/search?q=${encodeURIComponent(suggestion)}`)
                  performSearch(suggestion)
                }}
                className="rounded-full border px-3 py-1 text-xs hover:bg-accent"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </Card>
      ) : results.total === 0 ? (
        <Card className="p-12 text-center">
          <Search className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-base font-semibold">No results found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try different keywords or check spelling.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {(Object.keys(typeConfig) as Array<keyof typeof typeConfig>).map((type) => {
            const items = results[type]
            if (!items || items.length === 0) return null
            const config = typeConfig[type]
            const Icon = config.icon

            return (
              <div key={type}>
                <div className="mb-3 flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bg} ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-semibold">{config.label}</h2>
                  <Badge variant="outline" className="text-xs">{items.length}</Badge>
                </div>
                <div className="space-y-2">
                  {items.map((item: any) => (
                    <Link key={item.id} href={config.route(item)}>
                      <Card className="group flex items-center justify-between p-4 transition-all hover:shadow-md hover:border-primary/30">
                        <div className="flex-1">
                          <p className="font-semibold">
                            {item.title || item.body?.substring(0, 80) + (item.body?.length > 80 ? '...' : '')}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                            {item.subject && <Badge variant="secondary" className="text-xs">{item.subject}</Badge>}
                            {item.category && <Badge variant="secondary" className="text-xs">{item.category}</Badge>}
                            {item.type && <Badge variant="outline" className="text-xs capitalize">{item.type}</Badge>}
                            {item.class_ref && <Badge variant="outline" className="text-xs">{item.class_ref}</Badge>}
                            {item.difficulty && <Badge variant="outline" className="text-xs">D{item.difficulty}</Badge>}
                            {item.event_date && (
                              <span>{new Date(item.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            )}
                            {item.summary && (
                              <span className="line-clamp-1">· {item.summary}</span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 sm:block" />
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
