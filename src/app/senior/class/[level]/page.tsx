import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, ChevronRight, Sparkles, GraduationCap, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params
  return {
    title: `Senior — Class ${level} + NEET/JEE`,
    description: `Class ${level} board + entrance exam preparation. Hybrid-merge combined course.`,
  }
}

const subjectIcons: Record<string, any> = {
  'Physics': BookOpen,
  'Chemistry': BookOpen,
  'Biology': BookOpen,
  'Mathematics': BookOpen,
}

export default async function SeniorClassPage({
  params,
}: {
  params: Promise<{ level: string }>
}) {
  const { level } = await params
  const levelNum = parseInt(level)
  const supabase = await createClient()

  const { data: classData } = await supabase
    .from('classes')
    .select(`
      id, name, level,
      boards!inner(name, slug)
    `)
    .eq('segment', 'senior')
    .eq('level', levelNum)
    .single()

  if (!classData) {
    notFound()
  }

  const { data: curriculums } = await supabase
    .from('curriculums')
    .select('id, subject, academic_year, status')
    .eq('class_id', classData.id)
    .eq('status', 'active')
    .order('subject')

  // Get entrance exams
  const { data: entranceExams } = await supabase
    .from('exams')
    .select('id, slug, name, conducting_body')
    .eq('status', 'active')
    .eq('category', 'entrance')

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/senior"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Senior Home
      </Link>

      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{classData.boards.name}</Badge>
          <Badge variant="outline">Science Stream</Badge>
          <Badge variant="outline">2025-26</Badge>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{classData.name} — Senior</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse subjects below. Each subject contains chapters and concepts.
          Combine with entrance exam (NEET/JEE) for hybrid-merge course.
        </p>
      </div>

      {/* Board Subjects */}
      <h2 className="mb-4 text-lg font-semibold">Board Subjects ({curriculums?.length || 0})</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {curriculums?.map((curr: any) => {
          const Icon = subjectIcons[curr.subject] || BookOpen
          return (
            <Link key={curr.id} href={`/school/curriculum/${curr.id}`}>
              <Card className="group h-full p-4 transition-all hover:shadow-md hover:border-primary/30">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold">{curr.subject}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{curr.academic_year}</p>
                <div className="mt-2 flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  View chapters
                  <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Entrance exams for this class */}
      <h2 className="mb-4 mt-8 text-lg font-semibold">Combine with Entrance Exam</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {entranceExams?.map((exam: any) => (
          <Link key={exam.id} href={`/senior/exam/${exam.slug}`}>
            <Card className="group flex items-center justify-between p-5 transition-all hover:shadow-md hover:border-primary/30">
              <div>
                <h3 className="font-semibold">{exam.name}</h3>
                <p className="text-xs text-muted-foreground">{exam.conducting_body}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Card>
          </Link>
        ))}
      </div>

      {/* Hybrid-merge CTA */}
      <Card className="mt-8 border-primary/30 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Want a Hybrid Combined Course?</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Enroll in a board subject + entrance exam to get ONE combined course
              with board QNA + entrance MCQ + speed drills + dual PYQs.
            </p>
            <Link
              href="/my/goals"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary"
            >
              Go to My Goals
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
