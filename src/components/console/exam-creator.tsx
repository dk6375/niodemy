'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

const categories = ['ssc', 'railway', 'police', 'banking', 'upsc', 'defence', 'teaching', 'state_psc', 'entrance', 'other']

export function ExamCreator() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('ssc')
  const [conductingBody, setConductingBody] = useState('')
  const [description, setDescription] = useState('')
  const [officialUrl, setOfficialUrl] = useState('')

  const handleSave = async () => {
    if (!name || !slug) { toast.error('Name and slug required'); return }
    setSaving(true)
    try {
      const payload = {
        name, slug, category,
        conducting_body: conductingBody || null,
        description: description || null,
        official_url: officialUrl || null,
        status: 'active',
      }
      const res = await fetch('/api/console/exams', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Failed'); return }
      toast.success('Exam created!')
      router.push('/console/exams')
      router.refresh()
    } catch { toast.error('Network error') } finally { setSaving(false) }
  }

  return (
    <Card className="max-w-2xl p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Name *</Label><Input value={name} onChange={e => { setName(e.target.value); if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) }} /></div>
        <div className="space-y-2"><Label>Slug *</Label><Input value={slug} onChange={e => setSlug(e.target.value)} /></div>
      </div>
      <div className="space-y-2"><Label>Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-2"><Label>Conducting Body</Label><Input value={conductingBody} onChange={e => setConductingBody(e.target.value)} placeholder="SSC, NTA..." /></div>
      <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} /></div>
      <div className="space-y-2"><Label>Official URL</Label><Input value={officialUrl} onChange={e => setOfficialUrl(e.target.value)} placeholder="https://..." /></div>
      <Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Create Exam</Button>
    </Card>
  )
}
