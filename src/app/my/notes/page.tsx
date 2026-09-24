import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, StickyNote } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const metadata = { title: 'Notes — My Dashboard' }

export default async function NotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/my/notes')

  const { data: notes } = await supabase
    .from('notes')
    .select(`
      id, body, created_at, updated_at,
      content_assets!inner(id, title, slug)
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link href="/my" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <h1 className="mb-6 text-2xl font-bold">My Notes ({notes?.length || 0})</h1>

      {notes && notes.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {notes.map((n: any) => (
            <Card key={n.id} className="p-4">
              <Link href={`/concept/${n.content_assets.slug}`} className="mb-2 block text-xs font-medium text-primary">
                {n.content_assets.title}
              </Link>
              <p className="text-sm whitespace-pre-wrap">{n.body}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Updated {new Date(n.updated_at).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <StickyNote className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No notes yet. Take notes while reading content.</p>
        </Card>
      )}
    </div>
  )
}
