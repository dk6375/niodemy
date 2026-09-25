import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDegreeBySlug, getSemestersForDegree } from '@/lib/queries/college'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const degree = await getDegreeBySlug(slug)
  if (!degree) return { title: 'Degree Not Found' }
  return {
    title: degree.seo_json?.title || `${degree.name} — Semester-wise Material`,
    description: degree.seo_json?.description || degree.description,
  }
}

export default async function DegreePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const degree = await getDegreeBySlug(slug)

  if (!degree) {
    notFound()
  }

  const semesters = await getSemestersForDegree(degree.id)

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/college"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Degrees
      </Link>

      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="capitalize">{degree.level}</Badge>
          <Badge variant="outline">{degree.field}</Badge>
          <Badge variant="outline">{degree.duration_years} years</Badge>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{degree.name}</h1>
        {degree.description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {degree.description}
          </p>
        )}
      </div>

      {/* Semesters */}
      <h2 className="mb-4 text-lg font-semibold">Semesters ({semesters.length})</h2>
      <div className="space-y-2">
        {semesters.map((s: any) => (
          <Link key={s.id} href={`/college/degree/${degree.slug}/semester/${s.semester_number}`}>
            <Card className="group flex items-center justify-between p-4 transition-all hover:shadow-md hover:border-primary/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="text-sm font-bold">{s.semester_number}</span>
                </div>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-xs text-muted-foreground">Year {s.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
