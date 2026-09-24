import Link from 'next/link'
import { GraduationCap, ArrowRight, BookOpen, Target, Award, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getSchoolClasses } from '@/lib/queries/education'

export const metadata = {
  title: 'School — Class 6 to 10',
  description: 'CBSE Class 6-10: Science, Math, Social Science + NEET/JEE Foundation, Olympiads, Scholarships.',
}

export default async function SchoolPage() {
  const classes = await getSchoolClasses()

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <Badge variant="secondary" className="mb-3">Class 6–10 · CBSE</Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">School</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Board exams, NEET/JEE Foundation, Olympiads & Scholarships.
          Combined course optional — same NCERT taught deeper for foundation goals.
        </p>
      </div>

      {/* Class selector */}
      <h2 className="mb-4 text-lg font-semibold">Select Your Class</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {classes.map((c: any) => (
          <Link key={c.id} href={`/school/class/${c.level}`}>
            <Card className="group h-full p-5 text-center transition-all hover:shadow-lg hover:border-primary/30">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <span className="text-lg font-bold">{c.level}</span>
              </div>
              <p className="text-sm font-semibold">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.boards?.name}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Goal options */}
      <h2 className="mb-4 mt-10 text-lg font-semibold">What do you want to prepare for?</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: BookOpen, title: 'School Exam', desc: 'Board exam preparation', color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { icon: Sparkles, title: 'NEET/JEE Foundation', desc: 'NCERT taught deeper (depth-merge)', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { icon: Award, title: 'Scholarships', desc: 'NTSE, NMMS, KVPY (syllabus-merge)', color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { icon: Target, title: 'Olympiads', desc: 'NSO, IMO, IEO preparation', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((goal) => {
          const Icon = goal.icon
          return (
            <Card key={goal.title} className="p-4">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${goal.bg} ${goal.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold">{goal.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{goal.desc}</p>
            </Card>
          )
        })}
      </div>

      {/* Combined course pitch */}
      <Card className="mt-10 border-primary/30 bg-primary/5 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Combined Course (Optional)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Preparing for multiple goals? Enroll in 2+ curriculums (e.g., Class 8 Science + NEET Foundation)
              and get ONE combined course — no duplicate learning.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/my/goals">
                View My Goals
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
