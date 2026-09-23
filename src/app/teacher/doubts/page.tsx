import { MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const metadata = { title: 'Doubt Queue — Teacher' }

export default function DoubtQueuePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Doubt Queue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Student doubts awaiting your response. (Chat system coming in Session 6.)
        </p>
      </div>

      <Card className="p-12 text-center">
        <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
        <h3 className="text-base font-semibold">No doubts yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Student doubts from chapter chat will appear here. Live class group chat also accessible.
        </p>
      </Card>
    </div>
  )
}
