import { Target, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function CoachingPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="default" className="mb-3">
          MVP — Coming Next
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">Coaching</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          After 12th competitive exam preparation. SSC, RRB, Police, Banking,
          UPSC & more.
        </p>
      </div>

      <Card className="mx-auto mt-8 max-w-2xl p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Combined Course Engine</h2>
            <p className="text-sm text-muted-foreground">
              Our killer feature
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Select multiple exams (e.g., RRB Group D + SSC GD + MP Police) and
          get ONE combined course — not three separate ones. The system unions
          all syllabi, dedupes common concepts, and creates an optimized
          learning path.
        </p>
        <div className="mt-4 space-y-2">
          {[
            'Syllabus-merge: RRB + SSC + Police → one combined course',
            'Don\'t teach me twice: mastered concepts skip across exams',
            'Exam-date-aware daily plan auto-rewiring',
            'AI tutor, doubt chat & spaced repetition',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
        <Button asChild className="mt-6 w-full">
          <Link href="/coaching/combined">
            See Combined Course Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Full coaching segment with exam directory, syllabus mapping &
        combined course will be built in Phase 2.
      </p>
    </div>
  )
}
