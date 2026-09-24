import { Layers, Plus } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Concepts — Console' }

export default async function ConceptsPage() {
  const supabase = await createClient()
  const { data: concepts } = await supabase
    .from('concepts')
    .select('id, slug, title, subject, domain, status, summary')
    .order('subject')
    .order('title')

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Concepts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the knowledge graph — atomic knowledge units.
          </p>
        </div>
      </div>

      {concepts && concepts.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {concepts.map((c: any) => (
            <Card key={c.id} className="p-4">
              <h3 className="font-semibold">{c.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                <Badge variant="secondary">{c.subject}</Badge>
                {c.domain && <Badge variant="outline">{c.domain}</Badge>}
              </div>
              {c.summary && (
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{c.summary}</p>
              )}
              <Link
                href={`/concept/${c.slug}`}
                className="mt-2 inline-block text-xs font-medium text-primary"
              >
                View public page →
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Layers className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No concepts yet.</p>
        </Card>
      )}
    </div>
  )
}
