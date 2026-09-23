import { BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Curriculum — Console' }

export default async function CurriculumPage() {
  const supabase = await createClient()
  const { data: curriculums } = await supabase
    .from('curriculums')
    .select(`
      id, subject, academic_year, status,
      classes!inner(name, level, segment, boards!inner(name, slug))
    `)
    .order('academic_year', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Curriculum</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage boards, classes, subjects, and concept mappings.
        </p>
      </div>

      {curriculums && curriculums.length > 0 ? (
        <div className="space-y-2">
          {curriculums.map((c: any) => (
            <Card key={c.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{c.classes?.name} — {c.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {c.classes?.boards?.name} · {c.academic_year}
                </p>
              </div>
              <span className="text-xs text-muted-foreground capitalize">{c.status}</span>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No curriculums yet.</p>
        </Card>
      )}
    </div>
  )
}
