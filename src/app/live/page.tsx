import Link from 'next/link'
import { Video, Calendar, Clock, User, ArrowRight, PlayCircle, Radio } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getUpcomingLiveClasses, getPastLiveClasses } from '@/lib/queries/live'

export const metadata = {
  title: 'Live Classes — Upcoming & Past Sessions',
  description: 'Live and recorded classes across all segments. YouTube streaming + group chat.',
}

const segmentColors: Record<string, string> = {
  school: 'text-blue-500 bg-blue-500/10',
  senior: 'text-emerald-500 bg-emerald-500/10',
  coaching: 'text-amber-500 bg-amber-500/10',
  college: 'text-purple-500 bg-purple-500/10',
  iti: 'text-rose-500 bg-rose-500/10',
  skills: 'text-cyan-500 bg-cyan-500/10',
}

export default async function LivePage() {
  const upcoming = await getUpcomingLiveClasses(20)
  const past = await getPastLiveClasses(10)

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <Radio className="h-3.5 w-3.5" />
          YouTube Live + Group Chat
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">Live Classes</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Attend live classes across all segments. YouTube streaming + real-time
          group chat with teachers and students.
        </p>
      </div>

      {/* Upcoming */}
      <h2 className="mb-4 text-lg font-semibold">Upcoming Classes ({upcoming.length})</h2>
      {upcoming.length === 0 ? (
        <Card className="mb-8 p-12 text-center">
          <Video className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No upcoming classes scheduled.</p>
        </Card>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {upcoming.map((c: any) => {
            const colorClass = segmentColors[c.segment] || 'text-muted-foreground bg-muted'
            const isLive = c.status === 'live'
            return (
              <Link key={c.id} href={`/live/${c.id}`}>
                <Card className={`group h-full p-5 transition-all hover:shadow-lg ${isLive ? 'border-primary/50 ring-1 ring-primary/30' : 'hover:border-primary/30'}`}>
                  <div className="mb-3 flex items-start justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClass}`}>
                      <Video className="h-5 w-5" />
                    </div>
                    {isLive ? (
                      <Badge className="gap-1 bg-red-500">
                        <Radio className="h-3 w-3 animate-pulse" />
                        LIVE NOW
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Scheduled</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold">{c.title}</h3>
                  {c.description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {c.description}
                    </p>
                  )}
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      {c.teacher_name}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {new Date(c.scheduled_at).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {c.duration_minutes} min · {c.subject}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    {isLive ? 'Join now' : 'Set reminder'}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {/* Past recordings */}
      {past.length > 0 && (
        <>
          <h2 className="mb-4 text-lg font-semibold">Past Recordings ({past.length})</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {past.map((c: any) => (
              <Link key={c.id} href={`/live/${c.id}`}>
                <Card className="group flex items-center justify-between p-4 transition-all hover:shadow-md hover:border-primary/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <PlayCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{c.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.teacher_name} · {new Date(c.scheduled_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">Recording</Badge>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
