import Link from 'next/link'
import { MessageSquare, Plus, ArrowRight, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'QNA Forum' }

export default async function QnaPage() {
  const supabase = await createClient()

  // Get all QNA rooms with their first message + reply count
  const { data: rooms } = await supabase
    .from('chat_rooms')
    .select(`
      id, title, created_at,
      chat_messages(count)
    `)
    .eq('type', 'qna')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">QNA Forum</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask questions, help others, earn best-answer badges.
          </p>
        </div>
        <Button asChild>
          <Link href="/qna/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Ask Question
          </Link>
        </Button>
      </div>

      {rooms && rooms.length > 0 ? (
        <div className="space-y-2">
          {rooms.map((r: any) => {
            const replyCount = (r.chat_messages?.[0]?.count || 0) - 1
            return (
              <Link key={r.id} href={`/qna/${r.id}`}>
                <Card className="flex items-center justify-between p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold">{r.title || 'Untitled question'}</p>
                      <p className="text-xs text-muted-foreground">
                        Asked {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {replyCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                      </Badge>
                    )}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-base font-semibold">No questions yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Be the first to ask a question!
          </p>
        </Card>
      )}
    </div>
  )
}
