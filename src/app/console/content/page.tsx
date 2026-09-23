import Link from 'next/link'
import { BookOpen, Plus, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Content — Console' }

export default async function ContentListPage() {
  const supabase = await createClient()
  const { data: content } = await supabase
    .from('content_assets')
    .select(`
      id, type, title, slug, segment, status, updated_at,
      concepts(slug, title)
    `)
    .order('updated_at', { ascending: false })

  const statusVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default' as const
      case 'draft': return 'secondary' as const
      case 'review': return 'outline' as const
      case 'deprecated': return 'outline' as const
      default: return 'secondary' as const
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage lessons, tutorials, articles.
          </p>
        </div>
        <Button asChild>
          <Link href="/console/content/new">
            <Plus className="mr-1.5 h-4 w-4" />
            New Content
          </Link>
        </Button>
      </div>

      {/* Search (decorative) */}
      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search content..."
          className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm"
          disabled
        />
      </div>

      {/* Content list */}
      {content && content.length > 0 ? (
        <div className="space-y-2">
          {content.map((c: any) => (
            <Link
              key={c.id}
              href={`/console/content/${c.id}`}
              className="block"
            >
              <Card className="flex items-center justify-between p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{c.title}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs capitalize">{c.type}</Badge>
                      <Badge variant="outline" className="text-xs">{c.segment}</Badge>
                      {c.concepts && (
                        <span className="truncate">→ {c.concepts.title}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant(c.status)} className="text-xs capitalize">
                    {c.status}
                  </Badge>
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {new Date(c.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-base font-semibold">No content yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first lesson or tutorial.
          </p>
          <Button asChild className="mt-4">
            <Link href="/console/content/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Create Content
            </Link>
          </Button>
        </Card>
      )}
    </div>
  )
}
