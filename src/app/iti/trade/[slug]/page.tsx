import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, Wrench, BookOpen, Beaker, ShieldCheck, Award,
  ChevronRight, Briefcase, Clock,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getItiTradeBySlug, getItiModules } from '@/lib/queries/iti'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const trade = await getItiTradeBySlug(slug)
  if (!trade) return { title: 'Trade Not Found' }
  return {
    title: trade.seo_json?.title || `ITI ${trade.name} — Modules & Notes`,
    description: trade.seo_json?.description || trade.description,
  }
}

const moduleTypeIcons: Record<string, any> = {
  theory: BookOpen,
  practical: Beaker,
  workshop: Wrench,
  safety: ShieldCheck,
  project: Award,
}

const moduleTypeColors: Record<string, string> = {
  theory: 'text-blue-500 bg-blue-500/10',
  practical: 'text-emerald-500 bg-emerald-500/10',
  workshop: 'text-amber-500 bg-amber-500/10',
  safety: 'text-red-500 bg-red-500/10',
  project: 'text-purple-500 bg-purple-500/10',
}

export default async function ItiTradePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const trade = await getItiTradeBySlug(slug)

  if (!trade) {
    notFound()
  }

  const modules = await getItiModules(trade.id)

  // Group by semester
  const grouped: Record<number, any[]> = {}
  for (const m of modules) {
    if (!grouped[m.semester_number]) grouped[m.semester_number] = []
    grouped[m.semester_number].push(m)
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/iti"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Trades
      </Link>

      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">ITI Trade</Badge>
          {trade.code && <Badge variant="outline">{trade.code}</Badge>}
          <Badge variant="outline">{trade.duration_years} {trade.duration_years === 1 ? 'year' : 'years'}</Badge>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{trade.name}</h1>
        {trade.description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {trade.description}
          </p>
        )}
      </div>

      {/* Career opportunities */}
      {trade.career_opportunities && (
        <Card className="mb-6 border-primary/30 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <Briefcase className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h3 className="text-sm font-semibold">Career Opportunities</h3>
              <p className="mt-1 text-sm text-muted-foreground">{trade.career_opportunities}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Modules by semester */}
      <h2 className="mb-4 text-lg font-semibold">Modules ({modules.length})</h2>
      {Object.keys(grouped).length === 0 ? (
        <Card className="p-12 text-center">
          <Wrench className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No modules added yet.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([sem, mods]) => (
              <div key={sem}>
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="text-base font-semibold">Semester {sem}</h3>
                  <Badge variant="outline" className="text-xs">{mods.length} modules</Badge>
                </div>
                <div className="space-y-2">
                  {mods.map((m: any) => {
                    const Icon = moduleTypeIcons[m.module_type] || BookOpen
                    const colorClass = moduleTypeColors[m.module_type] || 'text-muted-foreground bg-muted'
                    return (
                      <Card key={m.id} className="flex items-center justify-between p-4 transition-all hover:shadow-md">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colorClass}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Module {m.module_number}</p>
                            <p className="font-semibold">{m.title}</p>
                            {m.description && (
                              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                                {m.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs capitalize">{m.module_type}</Badge>
                          {m.duration_hours && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {m.duration_hours}h
                            </span>
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
    </div>
  )
}
