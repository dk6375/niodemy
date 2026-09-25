import { createClient } from '@/lib/supabase/server'

/** Get all books, optionally filtered by segment */
export async function getBooks(segment?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('books')
    .select('id, slug, title, author, publisher, segment, subject, class_ref, board_ref, cover_url, description')
    .eq('status', 'active')
    .order('segment')
    .order('subject')
    .order('title')

  if (segment) {
    query = query.eq('segment', segment)
  }

  const { data } = await query
  return data || []
}

/** Get book by slug */
export async function getBookBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('books')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()
  return data
}

/** Get chapters for a book */
export async function getBookChapters(bookId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('book_chapters')
    .select('id, chapter_number, title, slug, summary')
    .eq('book_id', bookId)
    .order('chapter_number')
  return data || []
}

/** Get chapter by slug + book slug (for /atlas/book/[slug]/[chapter]) */
export async function getChapterBySlug(bookSlug: string, chapterSlug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('book_chapters')
    .select(`
      id, chapter_number, title, slug, summary, seo_json,
      books!inner(id, slug, title, subject, class_ref, board_ref, segment)
    `)
    .eq('slug', chapterSlug)
    .eq('books.slug', bookSlug)
    .single()
  return data
}

/** Get solutions for a chapter */
export async function getChapterSolutions(chapterId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('book_solutions')
    .select(`
      id, question_number, question_text, solution_text, difficulty, marks,
      concept_id, concepts!inner(slug, title)
    `)
    .eq('chapter_id', chapterId)
    .eq('status', 'published')
    .order('question_number')
  return data || []
}

/** Get available segments with book counts */
export async function getAtlasSegmentsWithCounts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('books')
    .select('segment')
    .eq('status', 'active')

  const counts: Record<string, number> = {}
  for (const b of data || []) {
    counts[b.segment] = (counts[b.segment] || 0) + 1
  }
  return counts
}
