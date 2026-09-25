import Link from 'next/link'
import { Home, Search, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata = { title: 'Page Not Found' }

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <Card className="max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <GraduationCap className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-primary">404</h1>
        <p className="mt-2 text-lg font-semibold">Page Not Found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-1.5 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/search">
              <Search className="mr-1.5 h-4 w-4" />
              Search
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
