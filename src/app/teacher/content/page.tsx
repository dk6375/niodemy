import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/console/rbac'

export const metadata = { title: 'My Content — Teacher' }

export default async function TeacherContentPage() {
  const user = await getAuthUser()
  if (!user) return null

  const supabase = await createClient()
  const { data: content } = await supabase
    .from('content_assets')
    .select('id, title, slug, type, segment, status, updated_at')
    .eq('author_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <div>
      <Link href="/teacher" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Teacher Dashboard
      </Link>
      <h1 className="mb-6 text-2xl font-bold">My Content</h1>

      {content && content.length > 0 ? (
        <div className="space-y-2">
          {content.map((c: any) => (
            <Card key={c.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.type} · {c.segment}</p>
                </div>
              </div>
              <Badge variant={c.status === 'published' ? 'default' : 'secondary'} className="text-xs capitalize">{c.status}</Badge>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No content authored by you yet.</p>
        </Card>
      )}
    </div>
  )
}
