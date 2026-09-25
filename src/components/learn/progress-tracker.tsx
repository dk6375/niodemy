'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, Circle, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ProgressTrackerProps {
  conceptId: string
  userId: string
  initialMastery?: number | null
  initialStatus?: string | null
}

const statuses = [
  { value: 'not_started', label: 'Not Started', icon: Circle, color: 'text-muted-foreground' },
  { value: 'learning', label: 'Learning', icon: Circle, color: 'text-amber-500' },
  { value: 'understood', label: 'Understood', icon: Circle, color: 'text-blue-500' },
  { value: 'practiced', label: 'Practiced', icon: Circle, color: 'text-purple-500' },
  { value: 'mastered', label: 'Mastered', icon: CheckCircle2, color: 'text-emerald-500' },
  { value: 'needs_revision', label: 'Needs Revision', icon: RotateCcw, color: 'text-rose-500' },
]

const masteryByStatus: Record<string, number> = {
  not_started: 0,
  learning: 20,
  understood: 50,
  practiced: 70,
  mastered: 100,
  needs_revision: 30,
}

export function ProgressTracker({ conceptId, userId, initialMastery, initialStatus }: ProgressTrackerProps) {
  const [mastery, setMastery] = useState(initialMastery ?? 0)
  const [status, setStatus] = useState(initialStatus || 'not_started')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const updateProgress = async (newStatus: string) => {
    setSaving(true)
    const newMastery = masteryByStatus[newStatus] || 0
    try {
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: userId,
          concept_id: conceptId,
          mastery: newMastery,
          status: newStatus,
          last_reviewed: new Date().toISOString(),
        })

      if (error) {
        toast.error('Failed to update progress')
        return
      }

      setStatus(newStatus)
      setMastery(newMastery)
      toast.success(`Marked as: ${statuses.find(s => s.value === newStatus)?.label}`)
      router.refresh()
    } catch (e) {
      toast.error('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Your progress:</span>
        {saving && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {statuses.map((s) => {
          const Icon = s.icon
          const isActive = status === s.value
          return (
            <button
              key={s.value}
              onClick={() => updateProgress(s.value)}
              disabled={saving}
              className={cn(
                'flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              )}
            >
              <Icon className={cn('h-3 w-3', !isActive && s.color)} />
              {s.label}
            </button>
          )
        })}
      </div>
      {mastery > 0 && (
        <p className="text-xs text-muted-foreground">Mastery: {mastery}%</p>
      )}
    </div>
  )
}
