/**
 * Spaced Repetition Engine (SM-2 algorithm adapted)
 *
 * Schedules the next review date for each concept based on:
 * - Current mastery level
 * - Number of previous reviews
 * - Quality of last attempt (correct/incorrect)
 *
 * The forgetting curve: we need to review concepts before they're forgotten.
 * Higher mastery → longer interval. Low mastery → review sooner.
 */

// SM-2 style interval calculation
// Interval grows exponentially as mastery increases

export interface SpacedRepetitionResult {
  nextReviewDate: Date
  intervalDays: number
  easeFactor: number
  message: string
}

/**
 * Calculate the next review date for a concept.
 *
 * @param mastery Current mastery (0-100)
 * @param attemptsCount How many times reviewed
 * @param wasCorrect Whether the last practice attempt was correct
 * @returns SpacedRepetitionResult with next review date and interval
 */
export function calculateNextReview(
  mastery: number,
  attemptsCount: number,
  wasCorrect: boolean
): SpacedRepetitionResult {
  // Ease factor (SM-2 uses 1.3-2.5 range, starts at 2.5)
  let easeFactor = 2.5

  // Adjust ease factor based on performance
  if (!wasCorrect) {
    easeFactor = Math.max(1.3, easeFactor - 0.2)
  } else if (mastery >= 80) {
    easeFactor = Math.min(2.8, easeFactor + 0.1)
  }

  // Calculate interval in days
  let intervalDays: number

  if (attemptsCount === 0) {
    // First time: review tomorrow
    intervalDays = 1
  } else if (attemptsCount === 1) {
    // Second time: 3 days
    intervalDays = 3
  } else if (mastery >= 90) {
    // High mastery: review in 14 days
    intervalDays = Math.round(14 * easeFactor)
  } else if (mastery >= 70) {
    // Good mastery: review in 7 days
    intervalDays = Math.round(7 * easeFactor)
  } else if (mastery >= 40) {
    // Learning: review in 3 days
    intervalDays = Math.round(3 * easeFactor)
  } else {
    // Low mastery: review tomorrow
    intervalDays = 1
  }

  // If last attempt was wrong, force sooner review
  if (!wasCorrect) {
    intervalDays = Math.max(1, Math.round(intervalDays * 0.5))
  }

  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays)

  // Generate message
  let message: string
  if (intervalDays === 1) {
    message = 'Review tomorrow — needs reinforcement'
  } else if (intervalDays <= 3) {
    message = `Review in ${intervalDays} days — still learning`
  } else if (intervalDays <= 7) {
    message = `Review in ${intervalDays} days — good progress`
  } else {
    message = `Review in ${intervalDays} days — well mastered`
  }

  return {
    nextReviewDate,
    intervalDays,
    easeFactor,
    message,
  }
}

/**
 * Get concepts due for review today.
 * Returns concepts where next_review_date <= today.
 */
export function isDueForReview(nextReviewDate: string | null): boolean {
  if (!nextReviewDate) return false
  const reviewDate = new Date(nextReviewDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return reviewDate <= today
}

/**
 * Get review urgency level for UI display.
 */
export function getReviewUrgency(nextReviewDate: string | null): 'overdue' | 'due' | 'soon' | 'future' | 'none' {
  if (!nextReviewDate) return 'none'
  const reviewDate = new Date(nextReviewDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.round((reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'overdue'
  if (diffDays === 0) return 'due'
  if (diffDays <= 2) return 'soon'
  return 'future'
}
