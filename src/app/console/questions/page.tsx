import { FileQuestion, Plus } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Questions — Console' }

export default async function QuestionsPage() {
  const supabase = await createClient()
  const { data: questions } = await supabase
    .from('questions')
    .select('id, type, body, subject, difficulty, status, source, source_ref, concepts(slug, title)')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Question Bank</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage MCQs, PYQs.
          </p>
        </div>
        <Button asChild>
          <Link href="/console/questions/new">
            <Plus className="mr-1.5 h-4 w-4" />
            New Question
          </Link>
        </Button>
      </div>

      {questions && questions.length > 0 ? (
        <div className="space-y-2">
          {questions.map((q: any) => (
            <Card key={q.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{q.body}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
                    <Badge variant="outline" className="capitalize">{q.type}</Badge>
                    <Badge variant="outline">D{q.difficulty}</Badge>
                    {q.subject && <Badge variant="secondary" className="text-xs">{q.subject}</Badge>}
                    {q.source_ref && <span className="text-muted-foreground">{q.source_ref}</span>}
                  </div>
                </div>
                <Badge variant={q.status === 'published' ? 'default' : 'secondary'} className="text-xs capitalize">
                  {q.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <FileQuestion className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No questions yet.</p>
        </Card>
      )}
    </div>
  )
}
