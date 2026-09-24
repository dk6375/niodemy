import { Suspense } from 'react'
import { SearchClient } from '@/components/search/search-client'

export const metadata = {
  title: 'Search — Niodemy',
  description: 'Search across concepts, content, questions, GK, and book solutions.',
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" /></div>}>
      <SearchClient />
    </Suspense>
  )
}
