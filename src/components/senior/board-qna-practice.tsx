'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react'

interface Question {
  id: string
  body: string
  correct_answer: string
  explanation?: string
  marks?: number
  board_ref?: string
}

export function BoardQnaPractice({ conceptIds }: { conceptIds?: string[] }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadQuestions = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('questions')
      .select('id, body, correct_answer, explanation, marks, board_ref')
      .eq('status', 'published')
      .in('type', ['long', 'short'])
      .eq('exam_format', 'board')

    if (conceptIds && conceptIds.length > 0) {
      query = query.in('concept_id', conceptIds)
    }

    const { data } = await query.limit(10)
    setQuestions(data || [])
    setLoading(false)
  }, [conceptIds, supabase])

  useEffect(() => {
    let active = true
    async function fetch() {
      setLoading(true)
      let query = supabase
        .from('questions')
        .select('id, body, correct_answer, explanation, marks, board_ref')
        .eq('status', 'published')
        .in('type', ['long', 'short'])
        .eq('exam_format', 'board')

      if (conceptIds && conceptIds.length > 0) {
        query = query.in('concept_id', conceptIds)
      }

      const { data } = await query.limit(10)
      if (active) {
        setQuestions(data || [])
        setLoading(false)
      }
    }
    fetch()
    return () => { active = false }
  }, [conceptIds, supabase])

  const nextQuestion = () => {
    setShowAnswer(false)
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
    } else {
      setCurrentIdx(0)
      // Reload by re-triggering effect (simple approach: just cycle through)
    }
  }

  if (loading) {
    return (
      <Card className="flex h-48 items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  if (questions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">No board QNA questions available yet.</p>
      </Card>
    )
  }

  const q = questions[currentIdx]

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <Badge variant="secondary">Q{currentIdx + 1} / {questions.length}</Badge>
        <div className="flex gap-1.5">
          {q.marks && <Badge variant="outline" className="text-xs">{q.marks} marks</Badge>}
          {q.board_ref && <Badge variant="outline" className="text-xs">{q.board_ref}</Badge>}
        </div>
      </div>

      {/* Question */}
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-500" />
          <span className="text-xs font-medium text-muted-foreground">QUESTION</span>
        </div>
        <p className="text-sm font-medium leading-relaxed">{q.body}</p>
      </div>

      {/* Answer (hidden until revealed) */}
      {!showAnswer ? (
        <Button onClick={() => setShowAnswer(true)} variant="outline" size="sm" className="w-full">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Show Model Answer
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="rounded-lg border-l-4 border-l-primary bg-muted/30 p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary">MODEL ANSWER</span>
            </div>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm">
              {q.correct_answer}
            </div>
          </div>

          {q.explanation && (
            <div className="rounded-lg border bg-muted/20 p-3 text-xs">
              <p className="mb-1 font-semibold">Key Points</p>
              <p className="text-muted-foreground">{q.explanation}</p>
            </div>
          )}

          <Button onClick={nextQuestion} size="sm" className="w-full">
            Next Question
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  )
}
