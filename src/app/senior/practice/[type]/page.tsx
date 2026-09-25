import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Zap, FileText, BookOpen, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SpeedDrill } from '@/components/senior/speed-drill'
import { BoardQnaPractice } from '@/components/senior/board-qna-practice'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  const labels: Record<string, string> = {
    'board-qna': 'Board QNA Practice',
    'neet-mcq': 'NEET MCQ Practice',
    'speed-drill': 'Speed Drill',
    'pyq': 'Previous Year Questions',
  }
  return { title: `${labels[type] || 'Practice'} — Senior` }
}

const validTypes = ['board-qna', 'neet-mcq', 'speed-drill', 'pyq']

export default async function SeniorPracticePage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params
  if (!validTypes.includes(type)) notFound()

  const supabase = await createClient()
  const { data: examConcepts } = await supabase
    .from('exam_concepts')
    .select('concept_id')
    .in('exam_id', (await supabase.from('exams').select('id').eq('category', 'entrance').eq('status', 'active')).data?.map((e: any) => e.id) || [])
    .limit(20)
  const conceptIds = (examConcepts || []).map((ec: any) => ec.concept_id)

  const typeConfig: Record<string, any> = {
    'speed-drill': { icon: Zap, title: 'Speed Drill', desc: 'Timed MCQs for entrance exam stamina. 10 questions, auto-timer, accuracy + speed tracking.' },
    'board-qna': { icon: FileText, title: 'Board QNA Practice', desc: 'Long-form and short-form questions for board exam prep. Model answers with key points.' },
    'neet-mcq': { icon: BookOpen, title: 'NEET MCQ Practice', desc: 'NEET-style MCQs with explanations. Previous year questions included.' },
    'pyq': { icon: Award, title: 'Previous Year Questions', desc: 'PYQs from NEET, JEE, and CBSE Board. With detailed solutions.' },
  }

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link href="/senior" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Senior Home
      </Link>

      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">{config.title}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{config.desc}</p>
      </div>

      {/* Practice component */}
      {type === 'speed-drill' && <SpeedDrill conceptIds={conceptIds} />}
      {type === 'board-qna' && <BoardQnaPractice conceptIds={conceptIds} />}
      {type === 'neet-mcq' && <SpeedDrill conceptIds={conceptIds} />}
      {type === 'pyq' && <BoardQnaPractice conceptIds={conceptIds} />}

      {/* Links to other practice types */}
      <h2 className="mb-3 mt-8 text-base font-semibold">Other Practice Types</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(typeConfig).filter(([t]) => t !== type).map(([t, c]) => {
          const OtherIcon = c.icon
          return (
            <Link key={t} href={`/senior/practice/${t}`}>
              <Card className="p-4 text-center transition-all hover:shadow-md hover:border-primary/30">
                <OtherIcon className="mx-auto mb-2 h-5 w-5 text-primary" />
                <p className="text-xs font-medium">{c.title}</p>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
