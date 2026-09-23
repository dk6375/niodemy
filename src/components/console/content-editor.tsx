'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Loader2, Save, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface ContentEditorProps {
  content?: any
  concepts: { id: string; title: string; slug: string }[]
}

const contentTypes = [
  { value: 'lesson', label: 'Lesson' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'note', label: 'Note' },
  { value: 'article', label: 'Article' },
  { value: 'example', label: 'Example' },
  { value: 'exercise', label: 'Exercise' },
]

const segments = [
  { value: 'school', label: 'School (Class 6-10)' },
  { value: 'senior', label: 'Senior (Class 11-12)' },
  { value: 'coaching', label: 'Coaching' },
  { value: 'college', label: 'College' },
  { value: 'iti', label: 'ITI' },
  { value: 'skills', label: 'Skills' },
  { value: 'gk', label: 'GK' },
  { value: 'atlas', label: 'Atlas' },
]

const statuses = ['draft', 'review', 'published', 'deprecated']

export function ContentEditor({ content, concepts }: ContentEditorProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const [title, setTitle] = useState(content?.title || '')
  const [slug, setSlug] = useState(content?.slug || '')
  const [type, setType] = useState(content?.type || 'lesson')
  const [segment, setSegment] = useState(content?.segment || 'school')
  const [status, setStatus] = useState(content?.status || 'draft')
  const [conceptId, setConceptId] = useState(content?.concept_id || '')
  const [bodyMd, setBodyMd] = useState(content?.body_md || '')
  const [seoTitle, setSeoTitle] = useState(content?.seo_json?.title || '')
  const [seoDescription, setSeoDescription] = useState(content?.seo_json?.description || '')

  const handleSave = async (publish = false) => {
    if (!title || !slug) {
      toast.error('Title and slug are required')
      return
    }

    setSaving(true)
    try {
      const finalStatus = publish ? 'published' : status
      const payload = {
        title,
        slug,
        type,
        segment,
        status: finalStatus,
        concept_id: conceptId || null,
        body_md: bodyMd,
        seo_json: {
          title: seoTitle || title,
          description: seoDescription,
          indexable: true,
        },
      }

      const url = content
        ? `/api/console/content?id=${content.id}`
        : '/api/console/content'
      const method = content ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to save')
        return
      }

      toast.success(content ? 'Content updated!' : 'Content created!')
      router.refresh()
      router.push('/console/content')
    } catch (e) {
      toast.error('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main editor */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="p-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (!content) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
                  }
                }}
                placeholder="e.g., Photosynthesis — Complete Lesson"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="photosynthesis-complete-lesson"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="segment">Segment</Label>
                <Select value={segment} onValueChange={setSegment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="concept">Linked Concept (optional)</Label>
              <Select value={conceptId} onValueChange={setConceptId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a concept..." />
                </SelectTrigger>
                <SelectContent>
                  {concepts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Body editor */}
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <Label>Content Body (Markdown)</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
          {showPreview ? (
            <div className="prose prose-sm min-h-[300px] max-w-none rounded-md border bg-muted/20 p-4 dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm">{bodyMd}</pre>
            </div>
          ) : (
            <Textarea
              value={bodyMd}
              onChange={(e) => setBodyMd(e.target.value)}
              placeholder="# Heading&#10;&#10;Write your content in Markdown..."
              className="min-h-[300px] font-mono text-sm"
            />
          )}
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        {/* SEO */}
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">SEO Settings</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="seoTitle" className="text-xs">Meta Title</Label>
              <Input
                id="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="SEO title (defaults to content title)"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription" className="text-xs">Meta Description</Label>
              <Textarea
                id="seoDescription"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="SEO description for search engines"
                className="text-sm"
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Actions</h3>
          <div className="space-y-2">
            <Button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="w-full"
              variant="outline"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save as {status}
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="w-full"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Publish
            </Button>
          </div>
          {content && (
            <p className="mt-3 text-xs text-muted-foreground">
              Last updated: {new Date(content.updated_at).toLocaleString()}
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}
