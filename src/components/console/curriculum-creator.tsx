'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

export function CurriculumCreator() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [classes, setClasses] = useState<any[]>([])
  const [classId, setClassId] = useState('')
  const [subject, setSubject] = useState('')
  const [academicYear, setAcademicYear] = useState('2025-26')

  useEffect(() => {
    fetch('/api/console/curriculum/classes').then(r => r.json()).then(d => setClasses(d.classes || [])).catch(() => {})
  }, [])

  const handleSave = async () => {
    if (!classId || !subject) { toast.error('Class and subject required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/console/curriculum', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_id: classId, subject, academic_year: academicYear, status: 'active' })
      })
      if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Failed'); return }
      toast.success('Curriculum created!')
      router.push('/console/curriculum')
      router.refresh()
    } catch { toast.error('Network error') } finally { setSaving(false) }
  }

  return (
    <Card className="max-w-2xl p-5 space-y-4">
      <div className="space-y-2">
        <Label>Class *</Label>
        <Select value={classId} onValueChange={setClassId}>
          <SelectTrigger><SelectValue placeholder="Select class..." /></SelectTrigger>
          <SelectContent>
            {classes.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name} ({c.boards?.name})</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Subject *</Label><Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Science, Mathematics..." /></div>
      <div className="space-y-2"><Label>Academic Year</Label><Input value={academicYear} onChange={e => setAcademicYear(e.target.value)} /></div>
      <Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Create Curriculum</Button>
    </Card>
  )
}
