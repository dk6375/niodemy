'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/client'
import {
  Loader2, Clock, CheckCircle2, XCircle, ChevronRight,
  Trophy, Zap, RotateCcw, Play,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface MockQuestion {
  id: string
  body: string
  options_json: any
  correct_answer: string
  explanation?: string
  difficulty: number
  subject: string
  concepts?: any
}

export function MockTestRunner({ examId, examName }: { examId: string; examName: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [phase, setPhase] = useState<'setup' | 'test' | 'results'>('setup')
  const [questions, setQuestions] = useState<MockQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [timings, setTimings] = useState<Record<string, number>>({})

  const [adaptive, setAdaptive] = useState(true)
  const [questionCount, setQuestionCount] = useState(10)

  const startTest = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const url = `/api/mock-test?exam_id=${examId}&count=${questionCount}&adaptive=${adaptive}`
      const res = await fetch(url)
      if (!res.ok) {
        toast.error('Failed to load questions')
        return
      }
      const data = await res.json()
      setQuestions(data.questions || [])
      setPhase('test')
      setCurrentIdx(0)
      setAnswers({})
      setTimings({})
      setQuestionStartTime(Date.now())
      // Time per question: 60s for MCQ
      setTimeLeft(60)
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  // Timer
  useEffect(() => {
    if (phase !== 'test') return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto-advance on timeout
          handleNext(true)
          return 60
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [phase, currentIdx])

  const selectAnswer = (questionId: string, key: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: key }))
  }

  const handleNext = (timedOut = false) => {
    const q = questions[currentIdx]
    if (!q) return

    // Record timing
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000)
    setTimings(prev => ({ ...prev, [q.id]: timeTaken }))

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1)
      setQuestionStartTime(Date.now())
      setTimeLeft(60)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Login required')
        return
      }

      const testResults = questions.map(q => ({
        questionId: q.id,
        conceptId: q.concepts?.id || null,
        userAnswer: answers[q.id] || '',
        isCorrect: answers[q.id] === q.correct_answer,
        timeTaken: timings[q.id] || 60,
      }))

      const res = await fetch('/api/mock-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: testResults, examId }),
      })

      if (!res.ok) {
        toast.error('Failed to submit')
        return
      }

      const data = await res.json()
      setResults(data.summary)
      setPhase('results')
    } catch {
      toast.error('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  const restart = () => {
    setPhase('setup')
    setQuestions([])
    setAnswers({})
    setResults(null)
  }

  // === SETUP PHASE ===
  if (phase === 'setup') {
    return (
      <Card className="p-8 text-center">
        <Trophy className="mx-auto mb-3 h-12 w-12 text-primary" />
        <h2 className="text-xl font-bold">Mock Test — {examName}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Test your knowledge with a mock test. Questions are pulled from exam syllabus.
        </p>

        <div className="mt-6 space-y-4 text-left">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Adaptive Difficulty</p>
              <p className="text-xs text-muted-foreground">Adjusts based on your mastery</p>
            </div>
            <button
              onClick={() => setAdaptive(!adaptive)}
              className={cn('relative h-6 w-11 rounded-full transition-colors', adaptive ? 'bg-primary' : 'bg-muted')}
            >
              <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform', adaptive ? 'translate-x-5' : 'translate-x-0.5')} />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Number of Questions</p>
              <p className="text-xs text-muted-foreground">10-30 questions</p>
            </div>
            <div className="flex gap-1">
              {[10, 20, 30].map(n => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className={cn('rounded-md border px-3 py-1 text-sm font-medium', questionCount === n ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent')}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={startTest} disabled={loading} className="mt-6 w-full" size="lg">
          {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Play className="mr-2 h-5 w-5" />}
          Start Mock Test
        </Button>
      </Card>
    )
  }

  // === RESULTS PHASE ===
  if (phase === 'results' && results) {
    return (
      <Card className="p-8 text-center">
        <Trophy className="mx-auto mb-3 h-12 w-12 text-primary" />
        <h2 className="text-xl font-bold">Test Complete!</h2>

        <div className="mx-auto mt-6 max-w-xs">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Accuracy</span>
            <span className="font-bold text-2xl">{results.accuracy}%</span>
          </div>
          <Progress value={results.accuracy} className="h-3" />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-lg border p-4">
            <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-emerald-500" />
            <p className="text-2xl font-bold text-emerald-500">{results.correct}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </div>
          <div className="rounded-lg border p-4">
            <XCircle className="mx-auto mb-1 h-5 w-5 text-rose-500" />
            <p className="text-2xl font-bold text-rose-500">{results.wrong}</p>
            <p className="text-xs text-muted-foreground">Wrong</p>
          </div>
          <div className="rounded-lg border p-4">
            <Clock className="mx-auto mb-1 h-5 w-5 text-blue-500" />
            <p className="text-2xl font-bold text-blue-500">{results.avgTimePerQuestion}s</p>
            <p className="text-xs text-muted-foreground">Avg/Q</p>
          </div>
        </div>

        <Button onClick={restart} variant="outline" className="mt-6">
          <RotateCcw className="mr-2 h-4 w-4" />
          Take Another Test
        </Button>
      </Card>
    )
  }

  // === TEST PHASE ===
  const q = questions[currentIdx]
  if (!q) return <Card className="p-8 text-center"><p>No questions available.</p></Card>

  return (
    <Card className="p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Badge variant="secondary">Q{currentIdx + 1} / {questions.length}</Badge>
        <div className="flex gap-2">
          {adaptive && <Badge variant="default" className="gap-1"><Zap className="h-3 w-3" />Adaptive D{q.difficulty}</Badge>}
          <Badge variant={timeLeft <= 10 ? 'destructive' : 'outline'} className="gap-1">
            <Clock className="h-3 w-3" />{timeLeft}s
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <Progress value={(currentIdx / questions.length) * 100} className="mb-4 h-1.5" />

      {/* Question */}
      <p className="mb-4 text-sm font-medium leading-relaxed sm:text-base">{q.body}</p>

      {/* Options */}
      <div className="space-y-2">
        {(q.options_json || []).map((opt: any) => (
          <button
            key={opt.key}
            onClick={() => selectAnswer(q.id, opt.key)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all',
              answers[q.id] === opt.key ? 'border-primary bg-primary/5' : 'hover:bg-accent'
            )}
          >
            <span className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
              answers[q.id] === opt.key ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
            )}>
              {opt.key}
            </span>
            <span>{opt.text}</span>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{Object.keys(answers).length} answered</span>
        <Button onClick={() => handleNext(false)} disabled={submitting}>
          {currentIdx < questions.length - 1 ? (
            <>Next <ChevronRight className="ml-1 h-4 w-4" /></>
          ) : submitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : 'Submit Test'}
        </Button>
      </div>
    </Card>
  )
}
