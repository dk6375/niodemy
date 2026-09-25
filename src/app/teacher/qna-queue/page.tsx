import Link from 'next/link'
import { ArrowLeft, MessageSquare, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/console/rbac'

export const metadata = { title: 'QNA Queue — Teacher' }

export default async function TeacherQnaQueuePage() {
  const user = await getAuthUser()
  if (!user) return null

  const supabase = await createClient()

  // Get QNA rooms (questions without best answer)
  const { data: rooms } = await supabase
    .from('chat_rooms')
    .select(`
      id, title, created_at,
      chat_messages(count)
    `)
    .eq('type', 'qna')
    .order('created_at', { ascending: false })
    .limit(30)

  // Filter unanswered (no best_answer marked)
  const processed = (rooms || []).map((r: any) => ({
    ...r,
    replyCount: (r.chat_messages?.[0]?.count || 0) - 1,
  }))

  return (
    <div>
      <Link href="/teacher" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Teacher Dashboard
      </Link>
      <h1 className="mb-6 text-2xl font-bold">QNA Queue</h1>

      {processed.length > 0 ? (
        <div className="space-y-2">
          {processed.map((r: any) => (
            <Link key={r.id} href={`/qna/${r.id}`}>
              <Card className="group flex items-center justify-between p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{r.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.replyCount > 0 ? `${r.replyCount} replies` : 'No replies yet'} · {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No QNA questions yet.</p>
        </Card>
      )}
    </div>
  )
}
