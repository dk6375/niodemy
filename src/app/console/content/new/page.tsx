import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ContentEditor } from '@/components/console/content-editor'

export const metadata = { title: 'New Content — Console' }

export default async function NewContentPage() {
  const supabase = await createClient()
  const { data: concepts } = await supabase
    .from('concepts')
    .select('id, title, slug')
    .order('title')

  return (
    <div>
      <Link
        href="/console/content"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Content
      </Link>
      <h1 className="mb-6 text-2xl font-bold">New Content</h1>
      <ContentEditor concepts={concepts || []} />
    </div>
  )
}
