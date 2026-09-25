import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/console/rbac'

/**
 * GET /api/streak
 * Returns the user's current streak, longest streak, and today's status.
 */
export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient()

  // Get all progress entries with last_reviewed dates
  const { data: progress } = await supabase
    .from('progress')
    .select('last_reviewed')
    .not('last_reviewed', 'is', null)
    .eq('user_id', user.id)

  // Get all attempts (for activity tracking)
  const { data: attempts } = await supabase
    .from('attempts')
    .select('created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Build a set of active dates
  const activeDates = new Set<string>()

  for (const p of progress || []) {
    const d = new Date((p as any).last_reviewed)
    activeDates.add(d.toDateString())
  }

  for (const a of attempts || []) {
    const d = new Date((a as any).created_at)
    activeDates.add(d.toDateString())
  }

  // Calculate current streak
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let currentStreak = 0
  let checkDate = new Date(today)

  // Check if active today
  const activeToday = activeDates.has(today.toDateString())

  if (activeToday) {
    currentStreak = 1
    checkDate.setDate(checkDate.getDate() - 1)
    while (activeDates.has(checkDate.toDateString())) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    }
  } else {
    // Check yesterday (streak not yet broken)
    checkDate.setDate(checkDate.getDate() - 1)
    if (activeDates.has(checkDate.toDateString())) {
      currentStreak = 1
      checkDate.setDate(checkDate.getDate() - 1)
      while (activeDates.has(checkDate.toDateString())) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      }
    }
  }

  // Calculate longest streak (simplified — from sorted dates)
  const sortedDates = Array.from(activeDates).sort()
  let longestStreak = 0
  let tempStreak = 0
  let prevDate: Date | null = null

  for (const dateStr of sortedDates) {
    const d = new Date(dateStr)
    d.setHours(0, 0, 0, 0)
    if (prevDate) {
      const diff = Math.round((d.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diff === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    } else {
      tempStreak = 1
    }
    prevDate = d
  }
  longestStreak = Math.max(longestStreak, tempStreak)

  // Total active days
  const totalActiveDays = activeDates.size

  return NextResponse.json({
    currentStreak,
    longestStreak,
    activeToday,
    totalActiveDays,
  })
}
