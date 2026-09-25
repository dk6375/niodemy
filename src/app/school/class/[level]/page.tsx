import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, FlaskConical, Calculator, Globe, Sparkles, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getClassByLevel, getCurriculumsForClass } from '@/lib/queries/education'

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params
  const levelNum = parseInt(level)
  const classData = await getClassByLevel(levelNum)
  if (!classData) return { title: 'Class Not Found' }
  return {
    title: `${classData.name} — ${classData.boards.name}`,
    description: `${classData.boards.name} ${classData.name} subjects, chapters and concepts.`,
  }
}

const subjectIcons: Record<string, any> = {
  'Science': FlaskConical,
  'Mathematics': Calculator,
  'Social Science': Globe,
  'NEET Foundation Science': Sparkles,
}

const subjectColors: Record<string, string> = {
  'Science': 'text-blue-500 bg-blue-500/10',
  'Mathematics': 'text-emerald-500 bg-emerald-500/10',
  'Social Science': 'text-amber-500 bg-amber-500/10',
  'NEET Foundation Science': 'text-purple-500 bg-purple-500/10',
}

export default async function ClassPage({
  params,
}: {
  params: Promise<{ level: string }>
}) {
  const { level } = await params
  const levelNum = parseInt(level)
  const classData = await getClassByLevel(levelNum)

  if (!classData) {
    notFound()
  }

  const curriculums = await getCurriculumsForClass(classData.id)

  // Group by subject (NEET Foundation shows separately)
  const board = classData.boards

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/school"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Classes
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{board.name}</Badge>
          <Badge variant="outline">Academic Year 2025-26</Badge>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{classData.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse subjects below. Each subject contains chapters and concepts.
        </p>
      </div>

      {/* Subjects */}
      <h2 className="mb-4 text-lg font-semibold">Subjects ({curriculums.length})</h2>

      {curriculums.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No subjects available yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {curriculums.map((curr: any) => {
            const Icon = subjectIcons[curr.subject] || BookOpen
            const colorClass = subjectColors[curr.subject] || 'text-muted-foreground bg-muted'
            const isFoundation = curr.subject.includes('NEET') || curr.subject.includes('Foundation')

            return (
              <Link
                key={curr.id}
                href={`/school/curriculum/${curr.id}`}
              >
                <Card className="group h-full p-5 transition-all hover:shadow-lg hover:border-primary/30">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {isFoundation && (
                      <Badge variant="default" className="text-xs">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Foundation
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-3 font-semibold">{curr.subject}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {curr.academic_year}
                  </p>
                  <div className="mt-3 flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    View chapters
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {/* Combined course CTA */}
      {curriculums.length >= 2 && (
        <Card className="mt-8 border-primary/30 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Want a combined course?</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Enroll in 2+ subjects and get ONE combined course with depth-merge.
                Same NCERT, taught at the depth of your most demanding goal.
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
      )}
    </div>
  )
}
