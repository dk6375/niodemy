/**
 * Niodemy Chat Service — Socket.io mini-service
 * Port: 3001
 *
 * Handles real-time chat for all contexts:
 * - chapter_doubt: per-concept doubt chat
 * - live_class: live class group chat
 * - ai_tutor: (request-response via HTTP, not socket)
 * - qna: QNA forum (async, persisted)
 *
 * Gateway pattern: frontend connects via io("/?XTransformPort=3001")
 */

import { createServer } from 'http'
import { Server } from 'socket.io'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const PORT = 3001

// Load .env.local from project root
const envContent = readFileSync(resolve(process.cwd(), '../../.env.local'), 'utf-8')
for (const line of envContent.split('\n')) {
  const match = line.match(/^([A-Z_]+)=(.+)$/)
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2]
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  path: '/',
})

// Track online users per room: { [roomId]: Set<socketId> }
const roomUsers = new Map<string, Set<string>>()

io.on('connection', (socket) => {
  console.log(`[chat] connected: ${socket.id}`)

  // Join a chat room
  socket.on('join_room', ({ roomId, userId, userName }) => {
    socket.join(roomId)
    socket.data.roomId = roomId
    socket.data.userId = userId
    socket.data.userName = userName

    // Track presence
    if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Set())
    roomUsers.get(roomId)!.add(socket.id)

    // Broadcast presence
    io.to(roomId).emit('presence', {
      online: roomUsers.get(roomId)!.size,
    })

    console.log(`[chat] ${userName} joined room ${roomId}`)
  })

  // Send a message (persist + broadcast)
  socket.on('send_message', async (payload) => {
    const { roomId, userId, userName, senderType, body, replyTo } = payload

    try {
      // Persist to Supabase
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          user_id: userId,
          sender_type: senderType || 'user',
          sender_name: userName,
          body,
          reply_to: replyTo || null,
        })
        .select()
        .single()

      if (error) {
        console.error('[chat] insert error:', error.message)
        socket.emit('error_message', { error: error.message })
        return
      }

      // Broadcast to all in room
      io.to(roomId).emit('new_message', data)
    } catch (e: any) {
      console.error('[chat] send_message error:', e.message)
    }
  })

  // Typing indicator
  socket.on('typing', ({ roomId, userName, isTyping }) => {
    socket.to(roomId).emit('typing', { userName, isTyping })
  })

  // Upvote a message
  socket.on('upvote', async ({ messageId, roomId }) => {
    try {
      // Increment upvote count
      const { data: msg } = await supabase
        .from('chat_messages')
        .select('upvotes')
        .eq('id', messageId)
        .single()

      if (msg) {
        await supabase
          .from('chat_messages')
          .update({ upvotes: (msg.upvotes || 0) + 1 })
          .eq('id', messageId)

        io.to(roomId).emit('message_upvoted', { messageId, upvotes: (msg.upvotes || 0) + 1 })
      }
    } catch (e: any) {
      console.error('[chat] upvote error:', e.message)
    }
  })

  // Pin a message (teacher/admin only)
  socket.on('pin_message', async ({ messageId, roomId }) => {
    try {
      await supabase
        .from('chat_messages')
        .update({ is_pinned: true })
        .eq('id', messageId)

      io.to(roomId).emit('message_pinned', { messageId })
    } catch (e: any) {
      console.error('[chat] pin error:', e.message)
    }
  })

  // Mark best answer (teacher/admin)
  socket.on('best_answer', async ({ messageId, roomId }) => {
    try {
      await supabase
        .from('chat_messages')
        .update({ is_best_answer: true })
        .eq('id', messageId)

      io.to(roomId).emit('best_answer_marked', { messageId })
    } catch (e: any) {
      console.error('[chat] best_answer error:', e.message)
    }
  })

  // Disconnect
  socket.on('disconnect', () => {
    const roomId = socket.data.roomId
    if (roomId && roomUsers.has(roomId)) {
      roomUsers.get(roomId)!.delete(socket.id)
      if (roomUsers.get(roomId)!.size === 0) {
        roomUsers.delete(roomId)
      } else {
        io.to(roomId).emit('presence', {
          online: roomUsers.get(roomId)!.size,
        })
      }
    }
    console.log(`[chat] disconnected: ${socket.id}`)
  })
})

httpServer.listen(PORT, () => {
  console.log(`✓ Niodemy Chat Service running on port ${PORT}`)
})
