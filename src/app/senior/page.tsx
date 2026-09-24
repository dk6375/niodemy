import Link from 'next/link'
import { FlaskConical, Atom, Calculator, Microscope, GraduationCap, ArrowRight, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Senior — Class 11–12 + NEET/JEE',
  description: 'Class 11–12 board + NEET/JEE preparation. Hybrid-merge combined course — board QNA + entrance MCQ + speed drills + PYQs.',
}

export default async function SeniorPage() {
  const supabase = await createClient()

  // Get senior exams (NEET, JEE)
  const { data: exams } = await supabase
    .from('exams')
    .select('id, slug, name, category, conducting_body, description, pattern_json')
    .eq('status', 'active')
    .eq('category', 'entrance')
    .order('name')

  // Get senior classes (11, 12)
  const { data: classes } = await supabase
    .from('classes')
    .select(`
      id, name, level,
      boards!inner(name, slug)
    `)
    .eq('segment', 'senior')
    .order('level')

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <Badge variant="default" className="mb-3 gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Hybrid-Merge Combined Course
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">Senior</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Class 11–12 board + NEET/JEE preparation in ONE course.
          Board QNA + Entrance MCQ + Speed drills + PYQs — all dimensions covered.
        </p>
      </div>

      {/* Classes */}
      <h2 className="mb-4 text-lg font-semibold">Select Your Class</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {classes?.map((c: any) => (
          <Link key={c.id} href={`/senior/class/${c.level}`}>
            <Card className="group flex items-center justify-between p-5 transition-all hover:shadow-lg hover:border-primary/30">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.boards?.name} · Science Stream</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Card>
          </Link>
        ))}
      </div>

      {/* Entrance exams */}
      <h2 className="mb-4 mt-8 text-lg font-semibold">Entrance Exam Preparation</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {exams?.map((exam: any) => {
          const pattern = exam.pattern_json || {}
          return (
            <Link key={exam.id} href={`/senior/exam/${exam.slug}`}>
              <Card className="group h-full p-5 transition-all hover:shadow-lg hover:border-primary/30">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold">{exam.name}</h3>
                  <Badge variant="secondary">Entrance</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{exam.conducting_body}</p>
                {exam.description && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {exam.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {pattern.total_questions && (
                    <Badge variant="outline" className="text-xs">{pattern.total_questions} Qs</Badge>
                  )}
                  {pattern.total_marks && (
                    <Badge variant="outline" className="text-xs">{pattern.total_marks} marks</Badge>
                  )}
                  {pattern.duration_minutes && (
                    <Badge variant="outline" className="text-xs">{pattern.duration_minutes} min</Badge>
                  )}
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Hybrid-merge pitch */}
      <Card className="mt-8 border-primary/30 bg-primary/5 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Hybrid-Merge Combined Course</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enroll in Class 12 board (e.g., Biology) + entrance exam (e.g., NEET) →
              get ONE combined course with:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><span className="font-medium">Concepts at NEET depth (L4)</span> — same NCERT, deeper understanding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><span className="font-medium">Board QNA practice</span> — long-form, short-form for board exam</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><span className="font-medium">Entrance MCQ practice</span> — timed for NEET/JEE</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><span className="font-medium">Dual PYQs</span> — both board + entrance previous years</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><span className="font-medium">Speed drills</span> — timed MCQ sessions for entrance stamina</span>
              </li>
            </ul>
            <Button asChild size="sm" className="mt-4">
              <Link href="/my/goals">
                Generate Combined Course
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
