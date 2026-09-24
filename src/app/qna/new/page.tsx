'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NewQuestionPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Login required')
        router.push('/login?redirect=/qna/new')
        return
      }

      // Create QNA room
      const res = await fetch('/api/chat/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'qna',
          contextType: 'none',
          title: title.trim(),
        }),
      })

      if (!res.ok) {
        toast.error('Failed to create question')
        return
      }

      const { roomId } = await res.json()

      // Post first message (the question body)
      if (body.trim()) {
        await supabase.from('chat_messages').insert({
          room_id: roomId,
          user_id: user.id,
          sender_type: 'user',
          sender_name: user.email?.split('@')[0] || 'Anonymous',
          body: body.trim(),
        })
      }

      toast.success('Question posted!')
      router.push(`/qna/${roomId}`)
    } catch (e) {
      toast.error('Network error')
    } finally {
      setSubmitting(false)
    }
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
        <h1 className="text-2xl font-bold">Ask a Question</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Get help from teachers and the community.
        </p>
      </div>

      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Question Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., How to solve quadratic equations?"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Details (optional)</Label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Add more details about your question..."
              rows={5}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <Button type="submit" disabled={submitting || !title.trim()}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Question
          </Button>
        </form>
      </Card>
    </div>
  )
}
