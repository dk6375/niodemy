import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, CheckCircle2, Clock, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export const metadata = { title: 'Progress — My Dashboard' }

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/my/progress')

  const { data: progress } = await supabase
    .from('progress')
    .select(`
      mastery, status, last_reviewed,
      concepts!inner(id, slug, title, subject)
    `)
    .eq('user_id', user.id)
    .order('last_reviewed', { ascending: false })

  const mastered = progress?.filter((p: any) => p.mastery >= 80).length || 0
  const learning = progress?.filter((p: any) => p.status === 'learning' || p.status === 'understood').length || 0
  const needsRevision = progress?.filter((p: any) => p.status === 'needs_revision').length || 0
  const avgMastery = progress && progress.length > 0
    ? Math.round(progress.reduce((sum: number, p: any) => sum + p.mastery, 0) / progress.length)
    : 0

  // Group by subject
  const grouped: Record<string, any[]> = {}
  for (const p of progress || []) {
    const subj = (p as any).concepts?.subject || 'General'
    if (!grouped[subj]) grouped[subj] = []
    grouped[subj].push(p)
  }

  const statusColors: Record<string, string> = {
    mastered: 'text-emerald-500',
    practiced: 'text-purple-500',
    understood: 'text-blue-500',
    learning: 'text-amber-500',
    needs_revision: 'text-rose-500',
    not_started: 'text-muted-foreground',
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link href="/my" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <h1 className="mb-6 text-2xl font-bold">My Progress</h1>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4">
          <CheckCircle2 className="mb-1 h-5 w-5 text-emerald-500" />
          <p className="text-2xl font-bold">{mastered}</p>
          <p className="text-xs text-muted-foreground">Mastered</p>
        </Card>
        <Card className="p-4">
          <Clock className="mb-1 h-5 w-5 text-amber-500" />
          <p className="text-2xl font-bold">{learning}</p>
          <p className="text-xs text-muted-foreground">In Progress</p>
        </Card>
        <Card className="p-4">
          <TrendingUp className="mb-1 h-5 w-5 text-rose-500" />
          <p className="text-2xl font-bold">{needsRevision}</p>
          <p className="text-xs text-muted-foreground">Needs Revision</p>
        </Card>
        <Card className="p-4">
          <BookOpen className="mb-1 h-5 w-5 text-primary" />
          <p className="text-2xl font-bold">{progress?.length || 0}</p>
          <p className="text-xs text-muted-foreground">Total Concepts</p>
        </Card>
      </div>

      {/* Avg mastery */}
      <Card className="mb-8 p-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium">Overall Average Mastery</span>
          <span className="font-bold">{avgMastery}%</span>
        </div>
        <Progress value={avgMastery} className="h-3" />
      </Card>

      {/* By subject */}
      {Object.keys(grouped).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(grouped).map(([subject, items]) => (
            <div key={subject}>
              <h2 className="mb-3 text-base font-semibold">{subject} ({items.length})</h2>
              <div className="space-y-2">
                {items.map((p: any) => (
                  <Link key={p.concepts.id} href={`/concept/${p.concepts.slug}`}>
                    <Card className="flex items-center justify-between p-3 transition-all hover:shadow-md">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.concepts.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Last reviewed: {p.last_reviewed ? new Date(p.last_reviewed).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20">
                          <Progress value={p.mastery} className="h-1.5" />
                        </div>
                        <Badge variant="outline" className={`text-xs capitalize ${statusColors[p.status] || ''}`}>
                          {p.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No progress yet. Start learning concepts to track progress.</p>
        </Card>
      )}
    </div>
  )
}
