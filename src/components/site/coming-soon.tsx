import { Construction } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ComingSoon({
  segment,
  description,
}: {
  segment: string
  description: string
}) {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Card className="max-w-lg p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Construction className="h-7 w-7 text-primary" />
        </div>
        <Badge variant="secondary" className="mb-3">
          Coming Soon
        </Badge>
        <h1 className="text-2xl font-bold">{segment}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </Card>
    </div>
  )
}
