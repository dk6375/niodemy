'use client'

import { ChatRoom } from '@/components/chat/chat-room'
import { Bot, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function AITutorChat({ roomId, userId }: { roomId: string; userId: string }) {
  return (
    <div className="space-y-4">
      {/* AI capabilities banner */}
      <Card className="border-primary/30 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">What can your AI Tutor do?</h3>
            <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
              <li>• Explain concepts in simple language (Hindi/English mix)</li>
              <li>• Knows your enrolled goals and progress</li>
              <li>• If you&apos;re on a concept page, AI knows the concept context</li>
              <li>• Ask doubts, request examples, get study tips</li>
            </ul>
          </div>
        </div>
      </Card>

      <ChatRoom
        mode="ai_tutor"
        roomId={roomId}
        contextType="user"
        contextId={userId}
        title="Personal AI Tutor"
      />
    </div>
  )
}
