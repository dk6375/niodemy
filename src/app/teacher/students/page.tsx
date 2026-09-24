import { Users } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const metadata = { title: 'My Students — Teacher' }

export default function MyStudentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Students</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Students enrolled in your subjects — progress overview and weak areas.
        </p>
      </div>

      <Card className="p-12 text-center">
        <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
        <h3 className="text-base font-semibold">No students yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Students enrolled in your subjects will appear here with their progress.
        </p>
      </Card>
    </div>
  )
}
