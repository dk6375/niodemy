import Link from 'next/link'
import { Newspaper, Plus, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'GK Management — Console' }

export default async function ConsoleGkPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('current_events')
    .select('id, slug, title, category, event_date, gk_relevance, status')
    .order('event_date', { ascending: false })
    .limit(50)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">GK & Current Affairs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Publish current affairs, tag to concepts/exams.</p>
        </div>
      </div>

      {events && events.length > 0 ? (
        <div className="space-y-2">
          {events.map((e: any) => (
            <Card key={e.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Newspaper className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold">{e.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">{e.category}</Badge>
                    <span>{new Date(e.event_date).toLocaleDateString()}</span>
                    {e.gk_relevance === 'high' && <Badge variant="default" className="text-xs">High GK</Badge>}
                  </div>
                </div>
              </div>
              <Badge variant={e.status === 'published' ? 'default' : 'secondary'} className="text-xs capitalize">{e.status}</Badge>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Newspaper className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No GK articles yet.</p>
        </Card>
      )}
    </div>
  )
}
