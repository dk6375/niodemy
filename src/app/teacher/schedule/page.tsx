import { Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const metadata = { title: 'My Schedule — Teacher' }

export default function MySchedulePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Schedule</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upcoming live classes, pending doubts, and today&apos;s tasks.
        </p>
      </div>

      <Card className="p-12 text-center">
        <Calendar className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
        <h3 className="text-base font-semibold">No upcoming events</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Your live classes and doubt deadlines will appear here.
        </p>
      </Card>
    </div>
  )
}
