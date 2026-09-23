import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ContentEditor } from '@/components/console/content-editor'

export const metadata = { title: 'Edit Content — Console' }

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: content }, { data: concepts }] = await Promise.all([
    supabase.from('content_assets').select('*').eq('id', id).single(),
    supabase.from('concepts').select('id, title, slug').order('title'),
  ])

  if (!content) {
    notFound()
  }

  return (
    <div>
      <Link
        href="/console/content"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Content
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Edit Content</h1>
      <ContentEditor content={content} concepts={concepts || []} />
    </div>
  )
}
