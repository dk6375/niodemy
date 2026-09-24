import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, ChevronRight, Layers } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getCurriculumById, getCurriculumConceptsGrouped } from '@/lib/queries/education'
import { EnrollButton } from '@/components/learn/enroll-button'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const curr = await getCurriculumById(id)
  if (!curr) return { title: 'Subject Not Found' }
  return {
    title: `${curr.classes.name} ${curr.subject} — ${curr.classes.boards.name}`,
    description: `${curr.classes.boards.name} ${curr.classes.name} ${curr.subject} chapters and concepts.`,
  }
}

export default async function CurriculumPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const curriculum = await getCurriculumById(id)

  if (!curriculum) {
    notFound()
  }

  const grouped = await getCurriculumConceptsGrouped(id)
  const classData = curriculum.classes
  const board = classData.boards
  const totalConcepts = Object.values(grouped).reduce((sum: number, ch: any) => sum + ch.length, 0)

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href={`/school/class/${classData.level}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {classData.name}
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{board.name}</Badge>
          <Badge variant="outline">{classData.name}</Badge>
          <Badge variant="outline">{curriculum.academic_year}</Badge>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{curriculum.subject}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {Object.keys(grouped).length} chapters · {totalConcepts} concepts
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main: Chapters + Concepts */}
        <div className="lg:col-span-2 space-y-6">
          {Object.keys(grouped).length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No chapters mapped yet for this subject.
              </p>
            </Card>
          ) : (
            Object.entries(grouped).map(([chapter, concepts]) => (
              <div key={chapter}>
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h2 className="text-lg font-semibold">{chapter}</h2>
                  <Badge variant="outline" className="text-xs">
                    {concepts.length} {concepts.length === 1 ? 'concept' : 'concepts'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {concepts.map((cc: any, i: number) => (
                    <Link
                      key={cc.concepts.id}
                      href={`/concept/${cc.concepts.slug}`}
                    >
                      <Card className="flex items-center justify-between p-4 transition-all hover:shadow-md hover:border-primary/30">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              {i + 1}.
                            </span>
                            <h3 className="font-semibold">{cc.concepts.title}</h3>
                          </div>
                          {cc.concepts.summary && (
                            <p className="mt-1 pl-5 text-xs text-muted-foreground line-clamp-2">
                              {cc.concepts.summary}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <Layers className="mr-1 h-3 w-3" />
                            L{cc.depth_required}
                          </Badge>
                          <Badge
                            variant={cc.importance === 'high' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {cc.importance}
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar: Enroll */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Enroll in this Subject</h3>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Enroll to track progress, get combined course (if 2+ subjects),
              and access AI tutor.
            </p>
            <EnrollButton
              segment="school"
              targetType="class"
              targetId={curriculum.id}
              targetName={`${classData.name} ${curriculum.subject}`}
            />

            {curriculum.subject.includes('NEET') || curriculum.subject.includes('Foundation') ? (
              <div className="mt-4 border-t pt-4">
                <p className="text-xs font-medium text-primary">Foundation Course</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  NCERT taught at deeper depth (L3+). Allen Kota model online.
                </p>
              </div>
            ) : null}

            <div className="mt-4 border-t pt-4">
              <p className="mb-2 text-xs font-semibold">Depth Levels</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li><span className="font-medium">L1:</span> Basic awareness</li>
                <li><span className="font-medium">L2:</span> Exam facts</li>
                <li><span className="font-medium">L3:</span> Conceptual</li>
                <li><span className="font-medium">L4:</span> Advanced</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
