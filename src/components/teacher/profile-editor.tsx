'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader2, Save, X, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileEditorProps {
  userId: string
  initialProfile?: any
  fullName: string
}

const segmentOptions = ['school', 'senior', 'coaching', 'college', 'iti', 'skills']

export function ProfileEditor({ userId, initialProfile, fullName }: ProfileEditorProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [expertise, setExpertise] = useState<string[]>(initialProfile?.expertise || [])
  const [segments, setSegments] = useState<string[]>(initialProfile?.segments || [])
  const [bio, setBio] = useState(initialProfile?.bio || '')
  const [isActive, setIsActive] = useState(initialProfile?.is_active ?? true)
  const [newExpertise, setNewExpertise] = useState('')

  const addExpertise = () => {
    if (newExpertise.trim() && !expertise.includes(newExpertise.trim())) {
      setExpertise([...expertise, newExpertise.trim()])
      setNewExpertise('')
    }
  }

  const removeExpertise = (item: string) => {
    setExpertise(expertise.filter((e) => e !== item))
  }

  const toggleSegment = (seg: string) => {
    if (segments.includes(seg)) {
      setSegments(segments.filter((s) => s !== seg))
    } else {
      setSegments([...segments, seg])
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        user_id: userId,
        expertise,
        segments,
        bio,
        is_active: isActive,
      }

      const res = await fetch('/api/teacher/profile', {
        method: initialProfile ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        toast.error('Failed to save profile')
        return
      }

      toast.success('Profile saved!')
      router.refresh()
    } catch (e) {
      toast.error('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Card className="p-5">
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Name</Label>
              <p className="mt-1 text-sm font-medium">{fullName}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expertise">Expertise (Subjects)</Label>
              <div className="flex flex-wrap gap-1.5">
                {expertise.map((e) => (
                  <Badge key={e} variant="secondary" className="gap-1">
                    {e}
                    <button onClick={() => removeExpertise(e)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addExpertise()
                    }
                  }}
                  placeholder="e.g., Polity, History"
                  className="text-sm"
                />
                <Button onClick={addExpertise} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Segments</Label>
              <div className="flex flex-wrap gap-1.5">
                {segmentOptions.map((seg) => (
                  <button
                    key={seg}
                    onClick={() => toggleSegment(seg)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                      segments.includes(seg)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    {seg}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell students about yourself..."
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="active" className="text-sm">Active (accepting students)</Label>
            </div>
          </div>
        </Card>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Profile
        </Button>
      </div>
    </div>
  )
}
