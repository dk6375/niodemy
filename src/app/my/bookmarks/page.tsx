import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Bookmark, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'Bookmarks — My Dashboard' }

export default async function BookmarksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/my/bookmarks')

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select(`
      created_at, note,
      content_assets!inner(id, title, slug, type, segment)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link href="/my" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Bookmarks ({bookmarks?.length || 0})</h1>

      {bookmarks && bookmarks.length > 0 ? (
        <div className="space-y-2">
          {bookmarks.map((b: any) => (
            <Link key={`${b.content_assets.id}-${b.created_at}`} href={`/concept/${b.content_assets.slug}`}>
              <Card className="flex items-center gap-3 p-4 transition-all hover:shadow-md">
                <Bookmark className="h-5 w-5 shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="font-semibold">{b.content_assets.title}</p>
                  <div className="mt-1 flex gap-1.5">
                    <Badge variant="secondary" className="text-xs capitalize">{b.content_assets.type}</Badge>
                    <Badge variant="outline" className="text-xs">{b.content_assets.segment}</Badge>
                  </div>
                  {b.note && <p className="mt-1 text-xs text-muted-foreground">{b.note}</p>}
                </div>
                <span className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</span>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Bookmark className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No bookmarks yet. Save content while browsing.</p>
        </Card>
      )}
    </div>
  )
}
