'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChatRoom } from '@/components/chat/chat-room'
import { Loader2, MessageCircle } from 'lucide-react'

interface ChapterDoubtChatProps {
  conceptId: string
  conceptTitle: string
}

export function ChapterDoubtChat({ conceptId, conceptTitle }: ChapterDoubtChatProps) {
  const [roomId, setRoomId] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchRoom() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return // Don't fetch room if not logged in

      try {
        const res = await fetch(
          `/api/chat/room?type=chapter_doubt&contextType=concept&contextId=${conceptId}&title=${encodeURIComponent(conceptTitle)}`,
          { method: 'GET' }
        )
        if (res.ok) {
          const { roomId } = await res.json()
          setRoomId(roomId)
        } else {
          setError(true)
        }
      } catch {
        setError(true)
      }
    }
    fetchRoom()
  }, [conceptId, conceptTitle, supabase])

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Doubt Chat</h2>
      </div>
      {roomId ? (
        <ChatRoom
          mode="chapter_doubt"
          roomId={roomId}
          contextType="concept"
          contextId={conceptId}
          title={conceptTitle}
        />
      ) : error ? (
        <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
          Chat unavailable. Please login to join the doubt chat.
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-lg border">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
