import { createClient } from '@/lib/supabase/server'

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap() {
  const supabase = await createClient()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const now = new Date()

  // Static routes
  const staticRoutes = [
    { url: '', priority: 1.0, changeFrequency: 'daily' as const },
    { url: '/school', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/senior', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/coaching', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/coaching/combined', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/gk', priority: 0.8, changeFrequency: 'daily' as const },
    { url: '/atlas', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/concepts', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/qna', priority: 0.7, changeFrequency: 'daily' as const },
    { url: '/login', priority: 0.5, changeFrequency: 'monthly' as const },
    { url: '/signup', priority: 0.5, changeFrequency: 'monthly' as const },
  ]

  const urls: any[] = staticRoutes.map((r) => ({
    url: `${baseUrl}${r.url}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  // Dynamic: concepts
  const { data: concepts } = await supabase
    .from('concepts')
    .select('slug, updated_at')
    .eq('status', 'published')

  for (const c of concepts || []) {
    urls.push({
      url: `${baseUrl}/concept/${c.slug}`,
      lastModified: new Date(c.updated_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  // Dynamic: exams
  const { data: exams } = await supabase
    .from('exams')
    .select('slug')
    .eq('status', 'active')

  for (const e of exams || []) {
    urls.push({
      url: `${baseUrl}/coaching/exam/${e.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  // Dynamic: atlas books
  const { data: books } = await supabase
    .from('books')
    .select('slug, created_at')

  for (const b of books || []) {
    urls.push({
      url: `${baseUrl}/atlas/book/${b.slug}`,
      lastModified: new Date(b.created_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  // Dynamic: atlas chapters
  const { data: chapters } = await supabase
    .from('book_chapters')
    .select('slug, books!inner(slug)')

  for (const ch of chapters || []) {
    const c = ch as any
    if (c.books?.slug) {
      urls.push({
        url: `${baseUrl}/atlas/book/${c.books.slug}/${c.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  // Dynamic: school classes
  for (let level = 6; level <= 12; level++) {
    urls.push({
      url: `${baseUrl}/school/class/${level}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  return urls
}
