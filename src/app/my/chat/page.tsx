import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/console/rbac'
import { AITutorChat } from '@/components/chat/ai-tutor-chat'

export const metadata = { title: 'AI Tutor — My Dashboard' }

export default async function AITutorPage() {
  const user = await getAuthUser()
  if (!user) {
    redirect('/login?redirect=/my/chat')
  }

  const supabase = await createClient()

  // Get or create AI tutor room for this user
  const { data: roomId } = await supabase.rpc('get_or_create_room', {
    p_type: 'ai_tutor',
    p_context_type: 'user',
    p_context_id: user.id,
    p_title: `AI Tutor — ${user.email}`,
  })

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">AI Tutor</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your personal AI assistant. Knows your goals and progress. Ask anything.
        </p>
      </div>

      <AITutorChat roomId={roomId} userId={user.id} />
    </div>
  )
}
