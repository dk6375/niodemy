import { Video } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const metadata = { title: 'Live Classes — Teacher' }

export default function LiveClassesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Live Classes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Schedule and host live classes with YouTube streaming + group chat.
        </p>
      </div>

      <Card className="p-12 text-center">
        <Video className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
        <h3 className="text-base font-semibold">No live classes scheduled</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Schedule a live class — students will join via /live/[id] page.
        </p>
      </Card>
    </div>
  )
}
