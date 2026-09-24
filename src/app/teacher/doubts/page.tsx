import Link from 'next/link'
import { MessageSquare, ArrowRight, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'Doubt Queue — Teacher' }

export default async function TeacherDoubtsPage() {
  const supabase = await createClient()

  // Get all chapter_doubt rooms with their latest messages + reply counts
  const { data: rooms } = await supabase
    .from('chat_rooms')
    .select(`
      id, title, context_type, context_id, created_at,
      chat_messages(count)
    `)
    .eq('type', 'chapter_doubt')
    .order('created_at', { ascending: false })
    .limit(50)

  // Group by answered/unanswered
  const processed = (rooms || []).map((r: any) => ({
    ...r,
    messageCount: r.chat_messages?.[0]?.count || 0,
  }))

  const unanswered = processed.filter((r: any) => r.messageCount === 0)
  const answered = processed.filter((r: any) => r.messageCount > 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Doubt Queue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Student doubts from chapter pages. Click to respond.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total Doubt Rooms</p>
          <p className="text-2xl font-bold">{processed.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Unanswered</p>
          <p className="text-2xl font-bold text-amber-500">{unanswered.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Answered</p>
          <p className="text-2xl font-bold text-emerald-500">{answered.length}</p>
        </Card>
      </div>

      {/* Unanswered first */}
      {unanswered.length > 0 && (
        <>
          <h2 className="mb-3 text-base font-semibold text-amber-500">
            Awaiting Response ({unanswered.length})
          </h2>
          <div className="mb-6 space-y-2">
            {unanswered.map((r: any) => (
              <Link key={r.id} href={`/qna/${r.id}`}>
                <Card className="flex items-center justify-between border-amber-500/30 bg-amber-500/5 p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold">{r.title || 'Untitled doubt'}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.context_type} · {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Answered */}
      {answered.length > 0 && (
        <>
          <h2 className="mb-3 text-base font-semibold">Answered ({answered.length})</h2>
          <div className="space-y-2">
            {answered.map((r: any) => (
              <Link key={r.id} href={`/qna/${r.id}`}>
                <Card className="flex items-center justify-between p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold">{r.title || 'Untitled doubt'}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.messageCount} messages · {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      {processed.length === 0 && (
        <Card className="p-12 text-center">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-base font-semibold">No doubts yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Student doubts from chapter pages will appear here.
          </p>
        </Card>
      )}
    </div>
  )
}
