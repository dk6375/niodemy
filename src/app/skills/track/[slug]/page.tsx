import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock, BookOpen, PlayCircle, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getSkillTrackBySlug, getSkillModules } from '@/lib/queries/skills'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const track = await getSkillTrackBySlug(slug)
  if (!track) return { title: 'Track Not Found' }
  return {
    title: track.seo_json?.title || `${track.name} — Free Tutorial`,
    description: track.seo_json?.description || track.description,
  }
}

export default async function SkillTrackPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const track = await getSkillTrackBySlug(slug)

  if (!track) {
    notFound()
  }

  const modules = await getSkillModules(track.id)

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/skills"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Skills
      </Link>

      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-3xl">{track.icon}</span>
          <Badge variant="secondary" className="capitalize">{track.level}</Badge>
          <Badge variant="outline">{modules.length} modules</Badge>
          {track.estimated_hours && (
            <Badge variant="outline">{track.estimated_hours}h total</Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{track.name}</h1>
        {track.description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {track.description}
          </p>
        )}
      </div>

      {/* Modules */}
      <h2 className="mb-4 text-lg font-semibold">Modules</h2>
      {modules.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No modules yet.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {modules.map((m: any) => (
            <Link key={m.id} href={`/skills/learn/${m.slug}`}>
              <Card className="group flex items-center justify-between p-4 transition-all hover:shadow-md hover:border-primary/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-sm font-bold">{m.module_number}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{m.title}</p>
                    {m.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{m.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {m.is_interactive && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <PlayCircle className="h-3 w-3" />
                      Interactive
                    </Badge>
                  )}
                  {m.estimated_minutes && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {m.estimated_minutes}m
                    </span>
                  )}
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
