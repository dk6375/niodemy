import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Atlas Management — Console' }

export default async function ConsoleAtlasPage() {
  const supabase = await createClient()
  const { data: books } = await supabase
    .from('books')
    .select('id, slug, title, segment, subject, class_ref, status')
    .order('segment')
    .order('title')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Atlas — Books Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage books, chapters, and solutions.</p>
      </div>

      {books && books.length > 0 ? (
        <div className="space-y-2">
          {books.map((b: any) => (
            <Link key={b.id} href={`/atlas/book/${b.slug}`}>
              <Card className="flex items-center justify-between p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold">{b.title}</p>
                    <div className="flex gap-1.5 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-xs capitalize">{b.segment}</Badge>
                      <Badge variant="outline" className="text-xs">{b.subject}</Badge>
                      {b.class_ref && <span>{b.class_ref}</span>}
                    </div>
                  </div>
                </div>
                <Badge variant={b.status === 'active' ? 'default' : 'secondary'} className="text-xs capitalize">{b.status}</Badge>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No books yet.</p>
        </Card>
      )}
    </div>
  )
}
