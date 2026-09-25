import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Radio, Calendar, Clock, User, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getLiveClassBySlug } from '@/lib/queries/live'
import { ChapterDoubtChat } from '@/components/chat/chapter-doubt-chat'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const liveClass = await getLiveClassBySlug(id)
  if (!liveClass) return { title: 'Live Class Not Found' }
  return {
    title: liveClass.title,
    description: liveClass.description || `Live class by ${liveClass.teacher_name}`,
  }
}

export default async function LiveClassPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const liveClass = await getLiveClassBySlug(id)

  if (!liveClass) {
    notFound()
  }

  const isLive = liveClass.status === 'live'
  const isEnded = liveClass.status === 'ended'
  const youtubeId = liveClass.youtube_video_id

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/live"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Live Classes
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main: Video + Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* YouTube embed */}
          <Card className="overflow-hidden p-0">
            <div className="aspect-video w-full bg-black">
              {youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}${isLive ? '?autoplay=1' : ''}`}
                  title={liveClass.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-white">
                  No video available
                </div>
              )}
            </div>
          </Card>

          {/* Title & info */}
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {isLive && (
                <Badge className="gap-1 bg-red-500">
                  <Radio className="h-3 w-3 animate-pulse" />
                  LIVE NOW
                </Badge>
              )}
              {isEnded && <Badge variant="secondary">Recording Available</Badge>}
              {!isLive && !isEnded && <Badge variant="outline">Scheduled</Badge>}
              {liveClass.segment && <Badge variant="secondary" className="capitalize">{liveClass.segment}</Badge>}
              {liveClass.subject && <Badge variant="outline">{liveClass.subject}</Badge>}
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">{liveClass.title}</h1>
            {liveClass.description && (
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {liveClass.description}
              </p>
            )}
          </div>

          {/* Class details */}
          <Card className="p-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  Teacher
                </p>
                <p className="mt-0.5 text-sm font-medium">{liveClass.teacher_name || 'N/A'}</p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Scheduled
                </p>
                <p className="mt-0.5 text-sm font-medium">
                  {new Date(liveClass.scheduled_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short'
                  })}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Duration
                </p>
                <p className="mt-0.5 text-sm font-medium">{liveClass.duration_minutes} min</p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  Status
                </p>
                <p className="mt-0.5 text-sm font-medium capitalize">{liveClass.status}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar: Live chat */}
        <div className="lg:col-span-1">
          <LiveClassChat
            classId={liveClass.id}
            title={liveClass.title}
          />
        </div>
      </div>
    </div>
  )
}

// Wrapper for chat (uses ChatRoom with live_class mode)
function LiveClassChat({ classId, title }: { classId: string; title: string }) {
  return (
    <div className="sticky top-20">
      <ChapterDoubtChat conceptId={classId} conceptTitle={`Live: ${title}`} />
    </div>
  )
}
