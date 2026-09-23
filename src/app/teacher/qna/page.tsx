import { MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const metadata = { title: 'QNA — Teacher' }

export default function TeacherQnaPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">QNA Responses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Respond to QNA forum questions in your subject.
        </p>
      </div>

      <Card className="p-12 text-center">
        <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
        <h3 className="text-base font-semibold">No QNA questions yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          QNA forum questions tagged to your subjects will appear here.
        </p>
      </Card>
    </div>
  )
}
