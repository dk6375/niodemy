import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { ChatRoom } from '@/components/chat/chat-room'

export const metadata = { title: 'QNA Thread' }

export default async function QnaThreadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: room } = await supabase
    .from('chat_rooms')
    .select('id, title, type, context_type, context_id, created_at')
    .eq('id', id)
    .eq('type', 'qna')
    .single()

  if (!room) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/qna"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Questions
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{room.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Asked {new Date(room.created_at).toLocaleString()}
        </p>
      </div>

      <ChatRoom
        mode="qna"
        roomId={room.id}
        title={room.title || undefined}
      />
    </div>
  )
}
