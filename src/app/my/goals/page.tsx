import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAvailableCurriculums, getUserEnrollments } from '@/lib/combined-course/depth-merge'
import { Target, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EnrollButton } from '@/components/learn/enroll-button'

export const metadata = { title: 'My Goals' }

export default async function MyGoalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const enrollments = await getUserEnrollments(user.id)
  const curriculums = await getAvailableCurriculums()

  // Group curriculums by class
  const grouped: Record<string, any[]> = {}
  for (const c of curriculums as any[]) {
    const className = c.classes?.name || 'Unknown'
    if (!grouped[className]) grouped[className] = []
    grouped[className].push(c)
  }

  const enrolledIds = new Set(enrollments.map((e: any) => e.target_id))

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/my"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">My Goals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enroll in goals to get combined courses & personalized learning paths.
        </p>
      </div>

      {/* Combined Course Info */}
      {enrollments.length >= 2 && (
        <Card className="mb-6 border-primary/30 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
            <div className="flex-1">
              <h3 className="text-base font-semibold">Combined Course Ready!</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You have {enrollments.length} goals. Generate a combined course
                to learn them all in one optimized path.
              </p>
              <Button asChild size="sm" className="mt-3">
                <Link href="/my/path">View Combined Course</Link>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Available Curriculums */}
      <h2 className="mb-4 text-lg font-semibold">Available Goals (School)</h2>

      {Object.keys(grouped).length === 0 ? (
        <Card className="p-8 text-center">
          <Target className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No curriculums available yet. Curriculums will appear here once added via console.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([className, currs]) => (
            <div key={className}>
              <h3 className="mb-3 text-base font-semibold">{className}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {currs.map((c: any) => {
                  const isEnrolled = enrolledIds.has(c.id)
                  return (
                    <Card key={c.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-semibold">{c.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {c.classes?.boards?.name} · {c.academic_year}
                          </p>
                          {c.subject.includes('NEET') || c.subject.includes('Foundation') ? (
                            <Badge variant="default" className="mt-2 text-xs">
                              Foundation Course
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              School Course
                            </Badge>
                          )}
                        </div>
                        {isEnrolled ? (
                          <div className="flex flex-col items-center gap-1">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            <span className="text-xs text-muted-foreground">Enrolled</span>
                          </div>
                        ) : (
                          <EnrollButton
                            segment="school"
                            targetType="class"
                            targetId={c.id}
                            targetName={`${className} ${c.subject}`}
                          />
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Current Enrollments */}
      {enrollments.length > 0 && (
        <>
          <h2 className="mb-4 mt-8 text-lg font-semibold">
            Current Enrollments ({enrollments.length})
          </h2>
          <div className="space-y-3">
            {enrollments.map((e: any) => (
              <Card key={e.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{e.target_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.segment} · Priority {e.priority} · Enrolled {new Date(e.enrolled_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">{e.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
