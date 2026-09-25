import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CurriculumCreator } from '@/components/console/curriculum-creator'

export const metadata = { title: 'New Curriculum — Console' }

export default function NewCurriculumPage() {
  return (
    <div>
      <Link href="/console/curriculum" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Curriculum
      </Link>
      <h1 className="mb-6 text-2xl font-bold">New Curriculum</h1>
      <CurriculumCreator />
    </div>
  )
}
