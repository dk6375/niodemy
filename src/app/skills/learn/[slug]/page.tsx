import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowRight, Clock, ChevronRight, PlayCircle,
  BookOpen, ChevronLeft,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import { getSkillModule, getSkillModules } from '@/lib/queries/skills'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const mod = await getSkillModule('', slug)
  if (!mod) return { title: 'Tutorial Not Found' }
  return {
    title: `${mod.title} — ${mod.skill_tracks?.name}`,
    description: mod.description,
  }
}

export default async function SkillModulePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Get module (need to find by slug, track_slug will be inferred from result)
  const supabase = (await import('@/lib/supabase/server')).createClient
  const client = await supabase()
  const { data: module } = await client
    .from('skill_modules')
    .select(`
      id, module_number, title, slug, description, body_md, is_interactive, example_code, estimated_minutes,
      skill_tracks!inner(id, slug, name, short_name)
    `)
    .eq('slug', slug)
    .single()

  if (!module) {
    notFound()
  }

  const track = (module as any).skill_tracks
  const allModules = await getSkillModules(track.id)

  const currentIdx = allModules.findIndex((m: any) => m.id === module.id)
  const prevModule = currentIdx > 0 ? allModules[currentIdx - 1] : null
  const nextModule = currentIdx < allModules.length - 1 ? allModules[currentIdx + 1] : null

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/skills" className="hover:text-foreground">Skills</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/skills/track/${track.slug}`} className="hover:text-foreground">
          {track.short_name || track.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground">{module.title}</span>
      </div>

      <Link
        href={`/skills/track/${track.slug}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Modules
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Module {module.module_number}</Badge>
          {module.is_interactive && (
            <Badge variant="default" className="gap-1">
              <PlayCircle className="h-3 w-3" />
              Interactive
            </Badge>
          )}
          {module.estimated_minutes && (
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {module.estimated_minutes} min
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{module.title}</h1>
        {module.description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {module.description}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main content */}
        <div className="lg:col-span-3">
          <Card className="p-5 sm:p-8">
            <div className="prose prose-sm max-w-none dark:prose-invert sm:prose-base">
              <ReactMarkdown>{module.body_md || ''}</ReactMarkdown>
            </div>
          </Card>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            {prevModule ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/skills/learn/${prevModule.slug}`}>
                  <ChevronLeft className="mr-1.5 h-4 w-4" />
                  Previous: {prevModule.title}
                </Link>
              </Button>
            ) : (
              <div />
            )}
            {nextModule ? (
              <Button asChild size="sm">
                <Link href={`/skills/learn/${nextModule.slug}`}>
                  Next: {nextModule.title}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Module List</h3>
            </div>
            <div className="space-y-1">
              {allModules.map((m: any) => (
                <Link
                  key={m.id}
                  href={`/skills/learn/${m.slug}`}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-accent ${
                    m.id === module.id ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-[10px]">
                    {m.module_number}
                  </span>
                  <span className="line-clamp-1">{m.title}</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
