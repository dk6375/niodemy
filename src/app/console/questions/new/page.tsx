import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { QuestionEditor } from '@/components/console/question-editor'

export const metadata = { title: 'New Question — Console' }

export default async function NewQuestionPage() {
  const supabase = await createClient()

  const [{ data: concepts }, { data: exams }] = await Promise.all([
    supabase.from('concepts').select('id, title, subject').order('title'),
    supabase.from('exams').select('id, name').eq('status', 'active').order('name'),
  ])

  return (
    <div>
      <Link
        href="/console/questions"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Questions
      </Link>
      <h1 className="mb-6 text-2xl font-bold">New Question</h1>
      <QuestionEditor concepts={concepts || []} exams={exams || []} />
    </div>
  )
}
