import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCurrentEvents, getCategoriesWithCounts } from '@/lib/queries/gk'

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  return {
    title: `GK — ${category.charAt(0).toUpperCase() + category.slice(1)} Current Affairs`,
    description: `Latest ${category} current affairs and news. Free to read.`,
  }
}

const categoryLabels: Record<string, string> = {
  polity: 'Polity',
  economy: 'Economy',
  science: 'Science & Technology',
  sports: 'Sports',
  international: 'International',
  national: 'National',
  awards: 'Awards',
  appointments: 'Appointments',
  schemes: 'Government Schemes',
  defense: 'Defense',
  environment: 'Environment',
  technology: 'Technology',
}

const categoryColors: Record<string, string> = {
  polity: 'text-blue-500 bg-blue-500/10',
  economy: 'text-emerald-500 bg-emerald-500/10',
  science: 'text-purple-500 bg-purple-500/10',
  sports: 'text-rose-500 bg-rose-500/10',
  international: 'text-amber-500 bg-amber-500/10',
  national: 'text-cyan-500 bg-cyan-500/10',
  awards: 'text-yellow-500 bg-yellow-500/10',
  appointments: 'text-indigo-500 bg-indigo-500/10',
  schemes: 'text-pink-500 bg-pink-500/10',
  defense: 'text-red-500 bg-red-500/10',
  environment: 'text-green-500 bg-green-500/10',
  technology: 'text-teal-500 bg-teal-500/10',
}

export default async function GkCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const events = await getCurrentEvents(category, 50)
  const categoryCounts = await getCategoriesWithCounts()

  const label = categoryLabels[category]
  const colorClass = categoryColors[category] || 'text-muted-foreground bg-muted'

  if (!label) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/gk"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All GK
      </Link>

      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <span className={`rounded px-2 py-0.5 text-xs font-medium ${colorClass}`}>{label}</span>
          <Badge variant="outline">{events.length} articles</Badge>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{label} — Current Affairs</h1>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/gk">
          <Badge variant="secondary" className="cursor-pointer px-3 py-1">All</Badge>
        </Link>
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <Link key={cat} href={`/gk/${cat}`}>
            <Badge
              variant={cat === category ? 'default' : 'secondary'}
              className="cursor-pointer px-3 py-1"
            >
              {categoryLabels[cat] || cat} ({count})
            </Badge>
          </Link>
        ))}
      </div>

      {/* Events */}
      {events.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-sm text-muted-foreground">No articles in this category yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {events.map((e: any) => (
            <Link key={e.id} href={`/gk/article/${e.slug}`}>
              <Card className="group flex flex-col gap-3 p-4 transition-all hover:shadow-md hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(e.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {e.gk_relevance === 'high' && <Badge variant="default" className="text-xs">High</Badge>}
                  </div>
                  <h3 className="font-semibold">{e.title}</h3>
                  {e.summary && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{e.summary}</p>
                  )}
                </div>
                <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 sm:block" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
