import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Exams — Console' }

export default async function ExamsPage() {
  const supabase = await createClient()
  const { data: exams } = await supabase
    .from('exams')
    .select(`
      id, slug, name, category, conducting_body, status,
      exam_concepts(exam_id)
    `)
    .order('category')
    .order('name')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Exams</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage competitive exams, syllabus, patterns, eligibility.
        </p>
      </div>

      {exams && exams.length > 0 ? (
        <div className="space-y-2">
          {exams.map((e: any) => (
            <Link key={e.id} href={`/coaching/exam/${e.slug}`}>
              <Card className="flex items-center justify-between p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold">{e.name}</p>
                    <p className="text-xs text-muted-foreground">{e.conducting_body}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs capitalize">{e.category}</Badge>
                  <Badge variant="outline" className="text-xs">
                    {e.exam_concepts?.length || 0} concepts
                  </Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <GraduationCap className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No exams yet.</p>
        </Card>
      )}
    </div>
  )
}
