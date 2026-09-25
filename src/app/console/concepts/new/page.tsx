import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ConceptCreator } from '@/components/console/concept-creator'

export const metadata = { title: 'New Concept — Console' }

export default function NewConceptPage() {
  return (
    <div>
      <Link href="/console/concepts" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Concepts
      </Link>
      <h1 className="mb-6 text-2xl font-bold">New Concept</h1>
      <ConceptCreator />
    </div>
  )
}
