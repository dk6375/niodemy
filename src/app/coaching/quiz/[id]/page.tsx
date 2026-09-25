import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileQuestion, CheckCircle2, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { QuestionPractice } from '@/components/learn/question-practice'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return { title: `Quiz — Niodemy` }
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Get collection (quiz) by id
  const { data: collection } = await supabase
    .from('collections')
    .select('id, name, slug, type, description, seo_json')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (!collection) notFound()

  // Get questions in this collection
  const { data: items } = await supabase
    .from('collection_items')
    .select(`
      question_id,
      questions!inner(id, type, body, options_json, correct_answer, explanation, difficulty, subject, source, source_ref)
    `)
    .eq('collection_id', id)
    .order('order_index')

  const questions = (items || []).map((item: any) => item.questions).filter(Boolean)

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link href="/coaching" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Coaching
      </Link>

      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="capitalize">{collection.type}</Badge>
          <Badge variant="outline">{questions.length} questions</Badge>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{collection.name}</h1>
        {collection.description && (
          <p className="mt-2 text-sm text-muted-foreground">{collection.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((q: any, i: number) => (
          <div key={q.id}>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Q{i + 1}</p>
            <QuestionPractice question={q} />
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <Card className="p-12 text-center">
          <FileQuestion className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No questions in this quiz yet.</p>
        </Card>
      )}
    </div>
  )
}
