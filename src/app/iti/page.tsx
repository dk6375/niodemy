import Link from 'next/link'
import { Wrench, ArrowRight, Briefcase, BookOpen, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getItiTrades } from '@/lib/queries/iti'

export const metadata = {
  title: 'ITI — Trades & Vocational Training',
  description: 'ITI trades: Electrician, Fitter, COPA, Welder. Module-wise notes, workshop guides, safety protocols.',
}

export default async function ItiPage() {
  const trades = await getItiTrades()

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <Wrench className="h-3.5 w-3.5" />
          Vocational Training
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">ITI</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Industrial Training Institute trades — Electrician, Fitter, COPA, and more.
          Module-wise notes, workshop practicals, and safety protocols.
        </p>
      </div>

      {/* Trades */}
      <h2 className="mb-4 text-lg font-semibold">Trades ({trades.length})</h2>
      {trades.length === 0 ? (
        <Card className="p-12 text-center">
          <Wrench className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No trades available yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trades.map((t: any) => (
            <Link key={t.id} href={`/iti/trade/${t.slug}`}>
              <Card className="group h-full p-5 transition-all hover:shadow-lg hover:border-primary/30">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-xs">{t.duration_years} {t.duration_years === 1 ? 'year' : 'years'}</Badge>
                </div>
                <h3 className="font-semibold">{t.name}</h3>
                {t.code && <p className="text-xs text-muted-foreground">Code: {t.code}</p>}
                {t.description && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {t.description}
                  </p>
                )}
                <div className="mt-3 flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  View modules
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
          { icon: BookOpen, title: 'Module-wise Notes', desc: 'Theory for every trade module' },
          { icon: ShieldCheck, title: 'Safety Protocols', desc: 'Workshop safety, PPE, first aid' },
          { icon: Briefcase, title: 'Career Paths', desc: 'Job roles and apprenticeship info' },
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
