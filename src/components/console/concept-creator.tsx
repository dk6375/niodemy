'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

export function ConceptCreator() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [domain, setDomain] = useState('')
  const [summary, setSummary] = useState('')
  const [depthL1, setDepthL1] = useState('')
  const [depthL2, setDepthL2] = useState('')
  const [depthL3, setDepthL3] = useState('')
  const [depthL4, setDepthL4] = useState('')
  const [definition, setDefinition] = useState('')

  const handleSave = async (publish = false) => {
    if (!title || !slug || !subject) { toast.error('Title, slug, subject required'); return }
    setSaving(true)
    try {
      const payload = {
        slug, title, subject,
        domain: domain || null,
        summary: summary || null,
        content_json: definition ? { definition } : null,
        depth_layers: { L1: depthL1, L2: depthL2, L3: depthL3, L4: depthL4 },
        status: publish ? 'published' : 'draft',
      }
      const res = await fetch('/api/console/concepts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Failed'); return }
      toast.success(publish ? 'Concept published!' : 'Concept saved!')
      router.push('/console/concepts')
      router.refresh()
    } catch { toast.error('Network error') } finally { setSaving(false) }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Card className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Title *</Label><Input value={title} onChange={e => { setTitle(e.target.value); if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) }} /></div>
            <div className="space-y-2"><Label>Slug *</Label><Input value={slug} onChange={e => setSlug(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Subject *</Label><Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Biology, Physics..." /></div>
            <div className="space-y-2"><Label>Domain</Label><Input value={domain} onChange={e => setDomain(e.target.value)} placeholder="Science, Math..." /></div>
          </div>
          <div className="space-y-2"><Label>Summary</Label><Textarea value={summary} onChange={e => setSummary(e.target.value)} rows={2} /></div>
          <div className="space-y-2"><Label>Definition</Label><Textarea value={definition} onChange={e => setDefinition(e.target.value)} rows={2} /></div>
        </Card>
        <Card className="p-5 space-y-3">
          <Label>Depth Layers</Label>
          {[
            { label: 'L1 (Basic)', val: depthL1, set: setDepthL1 },
            { label: 'L2 (Exam Facts)', val: depthL2, set: setDepthL2 },
            { label: 'L3 (Conceptual)', val: depthL3, set: setDepthL3 },
            { label: 'L4 (Advanced)', val: depthL4, set: setDepthL4 },
          ].map((d, i) => (
            <div key={i} className="space-y-1">
              <Label className="text-xs">{d.label}</Label>
              <Textarea value={d.val} onChange={e => d.set(e.target.value)} rows={2} className="text-sm" />
            </div>
          ))}
        </Card>
      </div>
      <div>
        <Card className="p-5 space-y-2">
          <h3 className="mb-3 text-sm font-semibold">Actions</h3>
          <Button onClick={() => handleSave(false)} disabled={saving} variant="outline" className="w-full">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save Draft</Button>
          <Button onClick={() => handleSave(true)} disabled={saving} className="w-full">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Publish</Button>
        </Card>
      </div>
    </div>
  )
}
