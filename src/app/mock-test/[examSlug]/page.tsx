import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { MockTestRunner } from '@/components/graph/mock-test-runner'

export async function generateMetadata({ params }: { params: Promise<{ examSlug: string }> }) {
  const { examSlug } = await params
  const supabase = await createClient()
  const { data: exam } = await supabase.from('exams').select('name').eq('slug', examSlug).single()
  return { title: `Mock Test — ${exam?.name || 'Exam'}` }
}

export default async function MockTestPage({
  params,
}: {
  params: Promise<{ examSlug: string }>
}) {
  const { examSlug } = await params
  const supabase = await createClient()

  const { data: exam } = await supabase
    .from('exams')
    .select('id, name, slug')
    .eq('slug', examSlug)
    .eq('status', 'active')
    .single()

  if (!exam) notFound()

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link href={`/coaching/exam/${exam.slug}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to {exam.name}
      </Link>
      <MockTestRunner examId={exam.id} examName={exam.name} />
    </div>
  )
}
