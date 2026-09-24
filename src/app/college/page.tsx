import Link from 'next/link'
import { Building2, ArrowRight, GraduationCap, BookOpen, Briefcase } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDegrees } from '@/lib/queries/college'

export const metadata = {
  title: 'College — Degree Programs',
  description: 'Semester-wise study material for B.Tech, BSc, B.Com and more. Notes, solutions, PYQs.',
}

export default async function CollegePage() {
  const degrees = await getDegrees()

  // Group by level
  const grouped: Record<string, typeof degrees> = {}
  for (const d of degrees) {
    const level = (d as any).level
    if (!grouped[level]) grouped[level] = []
    grouped[level].push(d)
  }

  const levelLabels: Record<string, string> = {
    undergraduate: 'Undergraduate Programs',
    postgraduate: 'Postgraduate Programs',
    diploma: 'Diploma Programs',
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <Building2 className="h-3.5 w-3.5" />
          Degree Programs
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">College</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Semester-wise study material for B.Tech, BSc, B.Com and more.
          Notes, solutions, PYQs — all free to browse.
        </p>
      </div>

      {/* Degrees */}
      {Object.keys(grouped).length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No degree programs available yet.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([level, degs]) => (
            <div key={level}>
              <h2 className="mb-4 text-lg font-semibold">{levelLabels[level] || level}</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {degs.map((d: any) => (
                  <Link key={d.id} href={`/college/degree/${d.slug}`}>
                    <Card className="group h-full p-5 transition-all hover:shadow-lg hover:border-primary/30">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="text-xs">{d.duration_years} years</Badge>
                      </div>
                      <h3 className="font-semibold">{d.name}</h3>
                      {d.short_name && (
                        <p className="text-xs text-muted-foreground">{d.short_name} · {d.field}</p>
                      )}
                      {d.description && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {d.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        View {d.total_semesters} semesters
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Features */}
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: BookOpen, title: 'Semester Notes', desc: 'Chapter-wise notes for all subjects' },
          { icon: Briefcase, title: 'Placement Prep', desc: 'Aptitude, coding, interview preparation' },
          { icon: GraduationCap, title: 'PYQs', desc: 'Previous year question papers with solutions' },
        ].map((f) => {
          const Icon = f.icon
          return (
            <Card key={f.title} className="p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
