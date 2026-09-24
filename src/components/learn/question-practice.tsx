'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Question {
  id: string
  type: string
  body: string
  options_json: any
  correct_answer: string | null
  explanation: string | null
  difficulty: number
  source?: string | null
  source_ref?: string | null
}

export function QuestionPractice({ question }: { question: Question }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const options = Array.isArray(question.options_json) ? question.options_json : []
  const isCorrect = selected === question.correct_answer

  const handleCheck = () => {
    if (selected) setShowAnswer(true)
  }

  const handleReset = () => {
    setSelected(null)
    setShowAnswer(false)
    setShowExplanation(false)
  }

  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-relaxed sm:text-base">
          {question.body}
        </p>
        <Badge variant="secondary" className="shrink-0 text-xs">
          D{question.difficulty}
        </Badge>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {options.map((opt: any) => {
          const key = opt.key
          const isSelected = selected === key
          const isAnswerCorrect = showAnswer && key === question.correct_answer
          const isAnswerWrong = showAnswer && isSelected && key !== question.correct_answer

          return (
            <button
              key={key}
              onClick={() => !showAnswer && setSelected(key)}
              disabled={showAnswer}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all',
                !showAnswer && 'hover:border-primary hover:bg-accent',
                showAnswer && isAnswerCorrect && 'border-primary bg-primary/5',
                showAnswer && isAnswerWrong && 'border-destructive bg-destructive/5',
                !showAnswer && isSelected && 'border-primary bg-primary/5'
              )}
            >
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                  showAnswer && isAnswerCorrect && 'border-primary bg-primary text-primary-foreground',
                  showAnswer && isAnswerWrong && 'border-destructive bg-destructive text-destructive-foreground',
                  !showAnswer && isSelected && 'border-primary bg-primary text-primary-foreground',
                  !showAnswer && !isSelected && 'border-border'
                )}
              >
                {showAnswer && isAnswerCorrect && <CheckCircle2 className="h-4 w-4" />}
                {showAnswer && isAnswerWrong && <XCircle className="h-4 w-4" />}
                {!showAnswer && key}
                {showAnswer && !isAnswerCorrect && !isAnswerWrong && key}
              </span>
              <span className="flex-1">{opt.text}</span>
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        {!showAnswer ? (
          <Button
            onClick={handleCheck}
            disabled={!selected}
            size="sm"
          >
            Check Answer
          </Button>
        ) : (
          <>
            <Button onClick={handleReset} variant="outline" size="sm">
              Try Again
            </Button>
            {question.explanation && (
              <Button
                onClick={() => setShowExplanation(!showExplanation)}
                variant="ghost"
                size="sm"
              >
                <Lightbulb className="mr-1.5 h-3.5 w-3.5" />
                {showExplanation ? 'Hide' : 'Show'} Explanation
              </Button>
            )}
          </>
        )}
      </div>

      {/* Result */}
      {showAnswer && (
        <div
          className={cn(
            'mt-3 rounded-lg p-3 text-sm',
            isCorrect
              ? 'bg-primary/10 text-primary'
              : 'bg-destructive/10 text-destructive'
          )}
        >
          {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          {question.source_ref && (
            <span className="ml-2 text-xs opacity-70">({question.source_ref})</span>
          )}
        </div>
      )}

      {/* Explanation */}
      {showExplanation && question.explanation && (
        <div className="mt-2 rounded-lg border bg-muted/30 p-3 text-sm">
          <p className="mb-1 font-semibold text-primary">Explanation</p>
          <p className="text-muted-foreground">{question.explanation}</p>
        </div>
      )}
    </Card>
  )
}
