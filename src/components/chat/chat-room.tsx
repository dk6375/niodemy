'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Send, Pin, CheckCircle2, ThumbsUp, Bot, User as UserIcon,
  GraduationCap, Loader2, MessageCircle, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Message {
  id: string
  room_id: string
  user_id: string | null
  sender_type: 'user' | 'teacher' | 'ai' | 'system'
  sender_name: string | null
  body: string
  reply_to: string | null
  is_pinned: boolean
  is_best_answer: boolean
  upvotes: number
  created_at: string
}

interface ChatRoomProps {
  mode: 'chapter_doubt' | 'live_class' | 'ai_tutor' | 'qna'
  roomId: string
  contextType?: string
  contextId?: string
  title?: string
  className?: string
}

const senderConfig = {
  user: { icon: UserIcon, color: 'text-muted-foreground', label: 'Student' },
  teacher: { icon: GraduationCap, color: 'text-primary', label: 'Teacher' },
  ai: { icon: Bot, color: 'text-emerald-500', label: 'AI Assistant' },
  system: { icon: Sparkles, color: 'text-amber-500', label: 'System' },
}

export function ChatRoom({
  mode, roomId, contextType, contextId, title, className,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [online, setOnline] = useState(0)
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)
  const supabase = createClient()

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user)
    })
  }, [supabase])

  // Load existing messages
  useEffect(() => {
    async function loadMessages() {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100)

      setMessages(data || [])
      setLoading(false)
    }
    loadMessages()
  }, [roomId, supabase])

  // Socket.io connection (skip for AI tutor — uses HTTP)
  useEffect(() => {
    if (mode === 'ai_tutor') return

    // In dev: connect directly to chat-service port (3001)
    // In prod: use gateway with XTransformPort query param
    const isDev = process.env.NODE_ENV === 'development'
    const socketUrl = isDev
      ? 'http://localhost:3001'
      : ''
    const socket = isDev
      ? io(socketUrl, { transports: ['websocket', 'polling'] })
      : io('/?XTransformPort=3001', { transports: ['websocket', 'polling'] })
    socketRef.current = socket

    socket.on('connect', () => {
      if (currentUser) {
        socket.emit('join_room', {
          roomId,
          userId: currentUser.id,
          userName: currentUser.email?.split('@')[0] || 'Anonymous',
        })
      }
    })

    socket.on('new_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg])
      setTypingUser(null)
    })

    socket.on('presence', ({ online: count }) => setOnline(count))

    socket.on('typing', ({ userName, isTyping }) => {
      setTypingUser(isTyping ? userName : null)
    })

    socket.on('message_upvoted', ({ messageId, upvotes }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, upvotes } : m))
      )
    })

    socket.on('message_pinned', ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, is_pinned: true } : m))
      )
    })

    socket.on('best_answer_marked', ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, is_best_answer: true } : m))
      )
    })

    // Re-join if user loads after socket connects
    if (currentUser && socket.connected) {
      socket.emit('join_room', {
        roomId,
        userId: currentUser.id,
        userName: currentUser.email?.split('@')[0] || 'Anonymous',
      })
    }

    return () => {
      socket.disconnect()
    }
  }, [roomId, currentUser, mode])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !currentUser) return

    const body = input.trim()
    setInput('')
    setSending(true)

    try {
      if (mode === 'ai_tutor') {
        // AI tutor: REST call to /api/chat/ai-tutor
        const userMsg: Message = {
          id: crypto.randomUUID(),
          room_id: roomId,
          user_id: currentUser.id,
          sender_type: 'user',
          sender_name: currentUser.email?.split('@')[0] || 'You',
          body,
          reply_to: null,
          is_pinned: false,
          is_best_answer: false,
          upvotes: 0,
          created_at: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, userMsg])

        const res = await fetch('/api/chat/ai-tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, message: body, contextType, contextId }),
        })

        if (res.ok) {
          const { message: aiMsg } = await res.json()
          setMessages((prev) => [...prev, aiMsg])
        } else {
          toast.error('AI response failed')
        }
      } else {
        // Real-time via Socket.io
        socketRef.current?.emit('send_message', {
          roomId,
          userId: currentUser.id,
          userName: currentUser.email?.split('@')[0] || 'Anonymous',
          senderType: 'user',
          body,
          replyTo: replyTo?.id,
        })
        setReplyTo(null)
      }
    } catch (e) {
      toast.error('Failed to send')
    } finally {
      setSending(false)
    }
  }

  const handleTyping = useCallback((isTyping: boolean) => {
    if (mode === 'ai_tutor') return
    socketRef.current?.emit('typing', {
      roomId,
      userName: currentUser?.email?.split('@')[0] || 'Anonymous',
      isTyping,
    })
  }, [roomId, currentUser, mode])

  const handleUpvote = (msgId: string) => {
    if (mode === 'ai_tutor') return
    socketRef.current?.emit('upvote', { messageId: msgId, roomId })
  }

  const headerLabels = {
    chapter_doubt: 'Doubt Chat',
    live_class: 'Live Class Chat',
    ai_tutor: 'AI Tutor',
    qna: 'QNA Forum',
  }

  return (
    <Card className={cn('flex flex-col overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-muted/30 p-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">{headerLabels[mode]}</h3>
          {title && <span className="text-xs text-muted-foreground">· {title}</span>}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {mode !== 'ai_tutor' && (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {online} online
            </span>
          )}
          {mode === 'ai_tutor' && (
            <Badge variant="secondary" className="gap-1">
              <Bot className="h-3 w-3" /> AI
            </Badge>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-3" style={{ maxHeight: '400px' }}>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            {mode === 'ai_tutor'
              ? 'Ask me anything about your studies! I know your progress and can help with doubts.'
              : 'No messages yet. Start the conversation!'}
          </div>
        ) : (
          messages.map((msg) => {
            const config = senderConfig[msg.sender_type]
            const Icon = config.icon
            const isOwn = msg.user_id === currentUser?.id
            const isReply = msg.reply_to
            const repliedTo = isReply ? messages.find((m) => m.id === isReply) : null

            return (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-2',
                  isOwn && msg.sender_type === 'user' && 'flex-row-reverse'
                )}
              >
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className={cn('bg-muted', config.color)}>
                    <Icon className="h-3.5 w-3.5" />
                  </AvatarFallback>
                </Avatar>
                <div className={cn('flex-1', isOwn && msg.sender_type === 'user' && 'items-end flex flex-col')}>
                  <div className="mb-0.5 flex items-center gap-1.5 text-xs">
                    <span className="font-medium">{msg.sender_name || config.label}</span>
                    {msg.sender_type === 'teacher' && <Badge variant="default" className="text-xs py-0">Teacher</Badge>}
                    {msg.sender_type === 'ai' && <Badge variant="secondary" className="text-xs py-0">AI</Badge>}
                    <span className="text-muted-foreground">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.is_pinned && <Pin className="h-3 w-3 text-amber-500" />}
                    {msg.is_best_answer && (
                      <Badge className="gap-1 bg-emerald-500 text-xs py-0">
                        <CheckCircle2 className="h-3 w-3" /> Best Answer
                      </Badge>
                    )}
                  </div>
                  {repliedTo && (
                    <div className="mb-1 border-l-2 border-muted pl-2 text-xs text-muted-foreground">
                      <span className="font-medium">{repliedTo.sender_name}:</span>{' '}
                      {repliedTo.body.substring(0, 50)}{repliedTo.body.length > 50 ? '...' : ''}
                    </div>
                  )}
                  <div className={cn(
                    'inline-block rounded-lg px-3 py-2 text-sm',
                    msg.sender_type === 'user' && isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted',
                    msg.sender_type === 'ai' && 'bg-emerald-500/10 border border-emerald-500/20',
                    msg.sender_type === 'teacher' && 'bg-primary/10 border border-primary/20',
                  )}>
                    {msg.body}
                  </div>
                  {/* Actions */}
                  {mode !== 'ai_tutor' && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <button
                        onClick={() => handleUpvote(msg.id)}
                        className="flex items-center gap-0.5 hover:text-primary"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        {msg.upvotes > 0 && <span>{msg.upvotes}</span>}
                      </button>
                      <button
                        onClick={() => setReplyTo(msg)}
                        className="hover:text-primary"
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
        {typingUser && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex gap-0.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
            </span>
            {typingUser} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply preview */}
      {replyTo && (
        <div className="border-t bg-muted/20 px-3 py-1.5 text-xs">
          <span className="text-muted-foreground">Replying to </span>
          <span className="font-medium">{replyTo.sender_name}:</span>{' '}
          {replyTo.body.substring(0, 60)}{replyTo.body.length > 60 ? '...' : ''}
          <button
            onClick={() => setReplyTo(null)}
            className="ml-2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input */}
      <div className="border-t p-3">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            onKeyUp={() => handleTyping(input.length > 0)}
            placeholder={
              mode === 'ai_tutor'
                ? 'Ask your AI tutor...'
                : 'Type your message...'
            }
            rows={1}
            className="min-h-[40px] resize-none text-sm"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || sending || !currentUser}
            size="icon"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        {!currentUser && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Login to join the chat.
          </p>
        )}
      </div>
    </Card>
  )
}
