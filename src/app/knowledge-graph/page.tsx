import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Layers, GitBranch, BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Knowledge Graph — Explore Concepts',
  description: 'Visual map of concepts and their connections. Explore by subject.',
}

export default async function KnowledgeGraphPage() {
  const supabase = await createClient()

  // Get all concepts grouped by subject
  const { data: concepts } = await supabase
    .from('concepts')
    .select('id, slug, title, subject, domain, summary')
    .eq('status', 'published')
    .order('subject')
    .order('title')

  // Get prerequisite relationships
  const { data: prereqs } = await supabase
    .from('concept_prerequisites')
    .select(`
      concept_id, prerequisite_id,
      c1:concepts!concept_id(slug, title, subject),
      c2:concepts!prerequisite_id(slug, title, subject)
    `)

  // Group concepts by subject
  const grouped: Record<string, any[]> = {}
  for (const c of concepts || []) {
    const subj = (c as any).subject || 'General'
    if (!grouped[subj]) grouped[subj] = []
    grouped[subj].push(c)
  }

  const subjectColors: Record<string, string> = {
    Biology: 'text-emerald-500 bg-emerald-500/10',
    Physics: 'text-blue-500 bg-blue-500/10',
    Chemistry: 'text-purple-500 bg-purple-500/10',
    Mathematics: 'text-amber-500 bg-amber-500/10',
    Polity: 'text-rose-500 bg-rose-500/10',
    History: 'text-orange-500 bg-orange-500/10',
    Geography: 'text-teal-500 bg-teal-500/10',
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <GitBranch className="h-3.5 w-3.5" />
          Knowledge Graph
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">Concept Map</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Explore {concepts?.length || 0} concepts across {Object.keys(grouped).length} subjects.
          Each concept links to prerequisites and related topics.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <BookOpen className="mx-auto mb-1 h-5 w-5 text-primary" />
          <p className="text-2xl font-bold">{concepts?.length || 0}</p>
          <p className="text-xs text-muted-foreground">Concepts</p>
        </Card>
        <Card className="p-4 text-center">
          <Layers className="mx-auto mb-1 h-5 w-5 text-blue-500" />
          <p className="text-2xl font-bold">{Object.keys(grouped).length}</p>
          <p className="text-xs text-muted-foreground">Subjects</p>
        </Card>
        <Card className="p-4 text-center">
          <GitBranch className="mx-auto mb-1 h-5 w-5 text-purple-500" />
          <p className="text-2xl font-bold">{prereqs?.length || 0}</p>
          <p className="text-xs text-muted-foreground">Connections</p>
        </Card>
      </div>

      {/* By Subject */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([subject, subjConcepts]) => (
          <div key={subject}>
            <div className="mb-3 flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${subjectColors[subject] || 'bg-muted text-muted-foreground'}`}>
                <BookOpen className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold">{subject}</h2>
              <Badge variant="outline" className="text-xs">{subjConcepts.length}</Badge>
            </div>

            {/* Concept nodes */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subjConcepts.map((c: any) => {
                // Find prerequisites for this concept
                const conceptPrereqs = (prereqs || []).filter((p: any) => p.concept_id === c.id)
                const conceptDependents = (prereqs || []).filter((p: any) => p.prerequisite_id === c.id)

                return (
                  <Link key={c.id} href={`/concept/${c.slug}`}>
                    <Card className="group h-full p-4 transition-all hover:shadow-lg hover:border-primary/30">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-semibold">{c.title}</h3>
                        {conceptPrereqs.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <GitBranch className="mr-1 h-3 w-3" />
                            {conceptPrereqs.length}
                          </Badge>
                        )}
                      </div>
                      {c.summary && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{c.summary}</p>
                      )}
                      {c.domain && (
                        <Badge variant="secondary" className="mt-2 text-xs">{c.domain}</Badge>
                      )}
                      <div className="mt-3 flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        View concept
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
