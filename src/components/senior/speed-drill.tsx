'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Zap, Clock, CheckCircle2, XCircle, RotateCcw, Loader2 } from 'lucide-react'

interface Question {
  id: string
  body: string
  options_json: any
  correct_answer: string
  explanation?: string
  time_recommended?: number
  difficulty?: number
}

export function SpeedDrill({ conceptIds }: { conceptIds?: string[] }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [attempts, setAttempts] = useState<{ correct: boolean; time: number }[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const supabase = createClient()

  const loadQuestions = async () => {
    setLoading(true)
    let query = supabase
      .from('questions')
      .select('id, body, options_json, correct_answer, explanation, time_recommended, difficulty')
      .eq('status', 'published')
      .eq('type', 'mcq')
      .eq('exam_format', 'competitive')

    if (conceptIds && conceptIds.length > 0) {
      query = query.in('concept_id', conceptIds)
    }

    const { data } = await query.limit(10)
    setQuestions(data || [])
    setLoading(false)
  }

  const startDrill = async () => {
    await loadQuestions()
    setStarted(true)
    setFinished(false)
    setCurrentIdx(0)
    setScore(0)
    setAttempts([])
    setSelected(null)
    setShowResult(false)
  }

  const handleSubmit = (timedOut = false) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setShowResult(true)

    const q = questions[currentIdx]
    const time = Math.round((Date.now() - startTimeRef.current) / 1000)
    const isCorrect = !timedOut && selected === q?.correct_answer

    setAttempts(prev => [...prev, { correct: isCorrect, time }])
    if (isCorrect) setScore(prev => prev + 1)
  }

  // Timer
  useEffect(() => {
    if (!started || finished) return
    const q = questions[currentIdx]
    if (!q) return

    const timeLimit = q.time_recommended || 60
    startTimeRef.current = Date.now()

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setShowResult(true)
          const time = Math.round((Date.now() - startTimeRef.current) / 1000)
          setAttempts(p => [...p, { correct: false, time }])
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentIdx, started, questions])

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      setFinished(true)
    }
  }

  if (!started) {
    return (
      <Card className="p-8 text-center">
        <Zap className="mx-auto mb-3 h-10 w-10 text-rose-500" />
        <h3 className="text-lg font-semibold">Speed Drill</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          10 timed MCQs. Test your speed + accuracy for entrance exams.
        </p>
        <Button onClick={startDrill} disabled={loading} className="mt-4">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
          Start Speed Drill
        </Button>
      </Card>
    )
  }

  if (finished) {
    const totalTime = attempts.reduce((sum, a) => sum + a.time, 0)
    const avgTime = attempts.length > 0 ? Math.round(totalTime / attempts.length) : 0
    const accuracy = attempts.length > 0 ? Math.round((score / attempts.length) * 100) : 0
    return (
      <Card className="p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-500" />
        <h3 className="text-lg font-semibold">Drill Complete!</h3>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div><p className="text-2xl font-bold text-emerald-500">{score}</p><p className="text-xs text-muted-foreground">Correct</p></div>
          <div><p className="text-2xl font-bold text-rose-500">{attempts.length - score}</p><p className="text-xs text-muted-foreground">Wrong</p></div>
          <div><p className="text-2xl font-bold text-blue-500">{accuracy}%</p><p className="text-xs text-muted-foreground">Accuracy</p></div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Average time per question: {avgTime}s</p>
        <Button onClick={startDrill} variant="outline" className="mt-4">
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </Card>
    )
  }

  const q = questions[currentIdx]
  if (!q) return <Card className="p-8 text-center"><p className="text-sm text-muted-foreground">No questions available.</p></Card>

  return (
    <Card className="p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Badge variant="secondary">Q{currentIdx + 1} / {questions.length}</Badge>
        <Badge variant={timeLeft <= 10 ? 'default' : 'outline'} className="gap-1">
          <Clock className="h-3 w-3" />
          {timeLeft}s
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full transition-all ${timeLeft <= 10 ? 'bg-rose-500' : 'bg-primary'}`}
          style={{ width: `${(timeLeft / (q.time_recommended || 60)) * 100}%` }}
        />
      </div>

      {/* Question */}
      <p className="mb-4 text-sm font-medium leading-relaxed">{q.body}</p>

      {/* Options */}
      <div className="space-y-2">
        {(q.options_json || []).map((opt: any) => {
          const isSelected = selected === opt.key
          const isCorrect = showResult && opt.key === q.correct_answer
          const isWrong = showResult && isSelected && opt.key !== q.correct_answer
          return (
            <button
              key={opt.key}
              onClick={() => !showResult && setSelected(opt.key)}
              disabled={showResult}
              className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all ${
                isCorrect ? 'border-primary bg-primary/5' : isWrong ? 'border-destructive bg-destructive/5' : isSelected ? 'border-primary' : 'hover:bg-accent'
              } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                isCorrect ? 'border-primary bg-primary text-primary-foreground' : isWrong ? 'border-destructive bg-destructive text-destructive-foreground' : 'border-border'
              }`}>
                {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : isWrong ? <XCircle className="h-4 w-4" /> : opt.key}
              </span>
              <span>{opt.text}</span>
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        {!showResult ? (
          <Button onClick={() => handleSubmit(false)} disabled={!selected} size="sm">
            Submit
          </Button>
        ) : (
          <Button onClick={nextQuestion} size="sm">
            {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish'}
          </Button>
        )}
      </div>

      {/* Explanation */}
      {showResult && q.explanation && (
        <div className="mt-3 rounded-lg border bg-muted/30 p-3 text-xs">
          <p className="mb-1 font-semibold text-primary">Explanation</p>
          <p className="text-muted-foreground">{q.explanation}</p>
        </div>
      )}
    </Card>
  )
}
