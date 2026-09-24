'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Plus } from 'lucide-react'

interface EnrollButtonProps {
  segment: string
  targetType: string
  targetId: string
  targetName: string
}

export function EnrollButton({ segment, targetType, targetId, targetName }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleEnroll = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segment,
          target_type: targetType,
          target_id: targetId,
          target_name: targetName,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          toast.error('Already enrolled')
        } else {
          toast.error(data.error || 'Failed to enroll')
        }
      } else {
        toast.success(`Enrolled in ${targetName}!`)
        router.refresh()
      }
    } catch (e) {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleEnroll}
      disabled={loading}
      size="sm"
      variant="outline"
    >
      {loading ? (
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
      ) : (
        <Plus className="mr-1.5 h-3.5 w-3.5" />
      )}
      Enroll
    </Button>
  )
}
