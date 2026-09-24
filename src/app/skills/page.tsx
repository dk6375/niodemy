import Link from 'next/link'
import { Lightbulb, ArrowRight, Clock, BookOpen, Zap, PlayCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getSkillTracks } from '@/lib/queries/skills'

export const metadata = {
  title: 'Skills — Learn Anything, Anytime',
  description: 'W3Schools-style tutorials. Python, Excel, Digital Marketing, and more. Free to browse.',
}

const levelColors: Record<string, string> = {
  beginner: 'text-emerald-500 bg-emerald-500/10',
  intermediate: 'text-amber-500 bg-amber-500/10',
  advanced: 'text-rose-500 bg-rose-500/10',
  'all-levels': 'text-blue-500 bg-blue-500/10',
}

export default async function SkillsPage() {
  const tracks = await getSkillTracks()

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <Lightbulb className="h-3.5 w-3.5" />
          W3Schools-Style Tutorials · Free to Browse
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">Skills</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Learn a new skill anytime. Python, Excel, Digital Marketing, and more.
          Browse tutorials free — no login required.
        </p>
      </div>

      {/* Tracks */}
      <h2 className="mb-4 text-lg font-semibold">Skill Tracks ({tracks.length})</h2>
      {tracks.length === 0 ? (
        <Card className="p-12 text-center">
          <Lightbulb className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No skill tracks available yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t: any) => (
            <Link key={t.id} href={`/skills/track/${t.slug}`}>
              <Card className="group h-full p-5 transition-all hover:shadow-lg hover:border-primary/30">
                <div className="mb-3 flex items-start justify-between">
                  <div className="text-3xl">{t.icon || '📚'}</div>
                  <Badge className={`text-xs ${levelColors[t.level] || 'bg-muted'}`}>
                    {t.level}
                  </Badge>
                </div>
                <h3 className="font-semibold">{t.name}</h3>
                {t.description && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {t.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {t.total_modules} modules
                  </span>
                  {t.estimated_hours && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {t.estimated_hours}h
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Start learning
                  <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Features */}
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: PlayCircle, title: 'Interactive Examples', desc: '"Try it yourself" code examples' },
          { icon: Zap, title: 'Hands-on Exercises', desc: 'Practice after each tutorial' },
          { icon: BookOpen, title: 'Roadmaps', desc: 'Structured learning paths' },
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
