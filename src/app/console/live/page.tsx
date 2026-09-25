import Link from 'next/link'
import { Video, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Live Classes — Console' }

export default async function ConsoleLivePage() {
  const supabase = await createClient()
  const { data: classes } = await supabase
    .from('live_classes')
    .select('id, slug, title, teacher_name, scheduled_at, status, segment')
    .order('scheduled_at', { ascending: false })
    .limit(50)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Live Classes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Schedule and manage live classes.</p>
        </div>
      </div>

      {classes && classes.length > 0 ? (
        <div className="space-y-2">
          {classes.map((c: any) => (
            <Link key={c.id} href={`/live/${c.id}`}>
              <Card className="flex items-center justify-between p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Video className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.teacher_name} · {new Date(c.scheduled_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {c.segment && <Badge variant="outline" className="text-xs capitalize">{c.segment}</Badge>}
                  <Badge variant={c.status === 'live' ? 'default' : 'secondary'} className="text-xs capitalize">{c.status}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Video className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No live classes scheduled.</p>
        </Card>
      )}
    </div>
  )
}
