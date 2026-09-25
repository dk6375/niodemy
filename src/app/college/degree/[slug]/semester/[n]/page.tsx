import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, FileText, Beaker, Award, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getSemesterByDegree, getSemesterSubjects } from '@/lib/queries/college'

export async function generateMetadata({ params }: { params: Promise<{ slug: string; n: string }> }) {
  const { slug, n } = await params
  const sem = await getSemesterByDegree(slug, parseInt(n))
  if (!sem) return { title: 'Semester Not Found' }
  return {
    title: `${sem.degrees.short_name} Semester ${sem.semester_number} — Subjects`,
    description: `Subjects for ${sem.degrees.name} Semester ${sem.semester_number}.`,
  }
}

const subjectTypeIcons: Record<string, any> = {
  core: BookOpen,
  elective: FileText,
  lab: Beaker,
  project: Award,
  seminar: FileText,
}

const subjectTypeColors: Record<string, string> = {
  core: 'text-blue-500 bg-blue-500/10',
  elective: 'text-purple-500 bg-purple-500/10',
  lab: 'text-emerald-500 bg-emerald-500/10',
  project: 'text-amber-500 bg-amber-500/10',
  seminar: 'text-cyan-500 bg-cyan-500/10',
}

export default async function SemesterPage({
  params,
}: {
  params: Promise<{ slug: string; n: string }>
}) {
  const { slug, n } = await params
  const semester = await getSemesterByDegree(slug, parseInt(n))

  if (!semester) {
    notFound()
  }

  const subjects = await getSemesterSubjects(semester.id)
  const degree = (semester as any).degrees

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/college" className="hover:text-foreground">College</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/college/degree/${degree.slug}`} className="hover:text-foreground">
          {degree.short_name || degree.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Semester {semester.semester_number}</span>
      </div>

      <Link
        href={`/college/degree/${degree.slug}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Semesters
      </Link>

      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{degree.short_name}</Badge>
          <Badge variant="outline">Year {semester.year}</Badge>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{semester.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {subjects.length} subjects · {subjects.reduce((sum: number, s: any) => sum + (s.credits || 0), 0)} credits
        </p>
      </div>

      {/* Subjects */}
      <h2 className="mb-4 text-lg font-semibold">Subjects ({subjects.length})</h2>
      {subjects.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No subjects added yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s: any) => {
            const Icon = subjectTypeIcons[s.subject_type] || BookOpen
            const colorClass = subjectTypeColors[s.subject_type] || 'text-muted-foreground bg-muted'
            return (
              <Card key={s.id} className="p-4 transition-all hover:shadow-md">
                <div className="mb-3 flex items-start justify-between">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-xs">{s.credits} cr</Badge>
                </div>
                <p className="text-xs font-medium text-muted-foreground">{s.subject_code}</p>
                <h3 className="font-semibold">{s.subject_name}</h3>
                {s.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {s.description}
                  </p>
                )}
                <Badge variant="secondary" className="mt-2 text-xs capitalize">{s.subject_type}</Badge>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
