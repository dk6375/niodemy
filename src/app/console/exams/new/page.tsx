import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ExamCreator } from '@/components/console/exam-creator'

export const metadata = { title: 'New Exam — Console' }

export default function NewExamPage() {
  return (
    <div>
      <Link href="/console/exams" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Exams
      </Link>
      <h1 className="mb-6 text-2xl font-bold">New Exam</h1>
      <ExamCreator />
    </div>
  )
}
