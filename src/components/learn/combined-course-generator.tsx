'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, CheckCircle2, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface Exam {
  id: string
  name: string
  slug: string
  category: string
  conducting_body: string | null
}

interface CombinedCourseGeneratorProps {
  exams: Exam[]
  initialEnrolledIds?: string[]
}

export function CombinedCourseGenerator({
  exams,
  initialEnrolledIds = [],
}: CombinedCourseGeneratorProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialEnrolledIds))
  const [generating, setGenerating] = useState(false)
  const [enrolling, setEnrolling] = useState<string | null>(null)
  const router = useRouter()

  // Group exams by category
  const grouped: Record<string, Exam[]> = {}
  for (const e of exams) {
    const cat = e.category || 'other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(e)
  }

  const categoryLabels: Record<string, string> = {
    railway: 'Railway',
    police: 'Police',
    ssc: 'SSC',
    banking: 'Banking',
    upsc: 'UPSC',
    defence: 'Defence',
    teaching: 'Teaching',
    state_psc: 'State PSC',
    entrance: 'Entrance',
    other: 'Other',
  }

  const toggleExam = async (exam: Exam) => {
    const newSelected = new Set(selected)
    if (newSelected.has(exam.id)) {
      newSelected.delete(exam.id)
      // Unenroll
      setEnrolling(exam.id)
      try {
        await fetch(`/api/enroll?segment=coaching&target_type=exam&target_id=${exam.id}`, {
          method: 'DELETE',
        })
        toast.success(`Removed ${exam.name}`)
      } catch (e) {
        toast.error('Failed to remove')
      } finally {
        setEnrolling(null)
      }
    } else {
      newSelected.add(exam.id)
      // Enroll
      setEnrolling(exam.id)
      try {
        const res = await fetch('/api/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            segment: 'coaching',
            target_type: 'exam',
            target_id: exam.id,
            target_name: exam.name,
          }),
        })
        if (res.ok) {
          toast.success(`Added ${exam.name}`)
        } else {
          const data = await res.json()
          if (res.status === 409) {
            toast.info('Already enrolled')
          } else {
            toast.error(data.error || 'Failed to add')
            newSelected.delete(exam.id)
          }
        }
      } catch (e) {
        toast.error('Network error')
        newSelected.delete(exam.id)
      } finally {
        setEnrolling(null)
      }
    }
    setSelected(newSelected)
  }

  const handleGenerate = async () => {
    if (selected.size < 2) {
      toast.error('Select at least 2 exams to generate combined course')
      return
    }

    setGenerating(true)
    try {
      const res = await fetch('/api/combined-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'syllabus-merge',
          exam_ids: Array.from(selected),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to generate combined course')
        return
      }

      toast.success('Combined course generated!')
      router.refresh()
    } catch (e) {
      toast.error('Network error')
    } finally {
      setGenerating(false)
    }
  }

  if (exams.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No exams available yet.
      </p>
    )
  }

  return (
    <div>
      <div className="space-y-4">
        {Object.entries(grouped).map(([category, examList]) => (
          <div key={category}>
            <h3 className="mb-2 text-sm font-semibold">
              {categoryLabels[category] || category}
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {examList.map((exam) => {
                const isSelected = selected.has(exam.id)
                const isLoading = enrolling === exam.id
                return (
                  <button
                    key={exam.id}
                    onClick={() => toggleExam(exam)}
                    disabled={isLoading}
                    className={`flex items-start justify-between gap-2 rounded-lg border p-3 text-left text-sm transition-all disabled:opacity-50 ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/30 hover:bg-accent'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{exam.name}</p>
                      {exam.conducting_body && (
                        <p className="text-xs text-muted-foreground">{exam.conducting_body}</p>
                      )}
                    </div>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : isSelected ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Generate button */}
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {selected.size} exam{selected.size !== 1 ? 's' : ''} selected
          {selected.size < 2 && ' (select at least 2)'}
        </p>
        <Button
          onClick={handleGenerate}
          disabled={selected.size < 2 || generating}
          className="w-full sm:w-auto"
        >
          {generating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Combined Course
        </Button>
      </div>
    </div>
  )
}
