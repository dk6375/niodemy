'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface QuestionEditorProps {
  concepts: { id: string; title: string; subject: string }[]
  exams: { id: string; name: string }[]
}

const questionTypes = [
  { value: 'mcq', label: 'MCQ (Single Correct)' },
  { value: 'numerical', label: 'Numerical' },
  { value: 'truefalse', label: 'True/False' },
  { value: 'short', label: 'Short Answer' },
  { value: 'long', label: 'Long Answer' },
  { value: 'assertion_reason', label: 'Assertion-Reason' },
  { value: 'match', label: 'Match the Following' },
]

const examFormats = [
  { value: 'any', label: 'Any (General)' },
  { value: 'board', label: 'Board Exam' },
  { value: 'competitive', label: 'Competitive' },
  { value: 'both', label: 'Both Board + Competitive' },
]

export function QuestionEditor({ concepts, exams }: QuestionEditorProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [type, setType] = useState('mcq')
  const [body, setBody] = useState('')
  const [subject, setSubject] = useState('')
  const [difficulty, setDifficulty] = useState('2')
  const [examFormat, setExamFormat] = useState('any')
  const [conceptId, setConceptId] = useState('')
  const [examId, setExamId] = useState('')
  const [source, setSource] = useState('custom')
  const [sourceRef, setSourceRef] = useState('')
  const [boardRef, setBoardRef] = useState('')
  const [explanation, setExplanation] = useState('')
  const [gkRelevance, setGkRelevance] = useState('none')

  // Options for MCQ
  const [options, setOptions] = useState([
    { key: 'A', text: '' },
    { key: 'B', text: '' },
    { key: 'C', text: '' },
    { key: 'D', text: '' },
  ])
  const [correctAnswer, setCorrectAnswer] = useState('A')

  const updateOption = (idx: number, text: string) => {
    const updated = [...options]
    updated[idx].text = text
    setOptions(updated)
  }

  const addOption = () => {
    const nextKey = String.fromCharCode(65 + options.length)
    setOptions([...options, { key: nextKey, text: '' }])
  }

  const removeOption = (idx: number) => {
    if (options.length <= 2) return
    setOptions(options.filter((_, i) => i !== idx))
  }

  const handleSave = async (publish = false) => {
    if (!body.trim()) {
      toast.error('Question body is required')
      return
    }

    setSaving(true)
    try {
      const payload: any = {
        type,
        body: body.trim(),
        subject: subject || null,
        difficulty: parseInt(difficulty),
        exam_format: examFormat,
        concept_id: conceptId || null,
        exam_id: examId || null,
        source,
        source_ref: sourceRef || null,
        board_ref: boardRef || null,
        explanation: explanation || null,
        gk_relevance: gkRelevance,
        status: publish ? 'published' : 'draft',
      }

      // Add options for MCQ type
      if (type === 'mcq' || type === 'truefalse') {
        payload.options_json = options.map(o => ({ key: o.key, text: o.text }))
        payload.correct_answer = correctAnswer
      } else if (type === 'numerical') {
        payload.correct_answer = correctAnswer // numerical value
      } else {
        payload.correct_answer = correctAnswer // text answer
      }

      const res = await fetch('/api/console/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to save')
        return
      }

      toast.success(publish ? 'Question published!' : 'Question saved as draft!')
      router.push('/console/questions')
      router.refresh()
    } catch (e) {
      toast.error('Network error')
    } finally {
      setSaving(false)
    }
  }

  const isMcqType = type === 'mcq' || type === 'truefalse'

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {/* Question body */}
        <Card className="p-5">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {questionTypes.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Exam Format</Label>
                <Select value={examFormat} onValueChange={setExamFormat}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {examFormats.map(f => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Question Body *</Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter the question..."
                rows={3}
              />
            </div>

            {/* Options for MCQ */}
            {isMcqType && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Options</Label>
                  <Button onClick={addOption} size="sm" variant="outline" type="button">
                    <Plus className="mr-1 h-3 w-3" />
                    Add Option
                  </Button>
                </div>
                <div className="space-y-2">
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <button
                        onClick={() => setCorrectAnswer(opt.key)}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                          correctAnswer === opt.key
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border'
                        }`}
                        type="button"
                      >
                        {opt.key}
                      </button>
                      <Input
                        value={opt.text}
                        onChange={(e) => updateOption(idx, e.target.value)}
                        placeholder={`Option ${opt.key}`}
                        className="flex-1"
                      />
                      {options.length > 2 && (
                        <Button onClick={() => removeOption(idx)} size="icon" variant="ghost" type="button">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Click the letter circle to mark the correct answer. Currently: <span className="font-medium text-primary">{correctAnswer}</span>
                </p>
              </div>
            )}

            {/* Numerical/Text answer */}
            {!isMcqType && (
              <div className="space-y-2">
                <Label>Correct Answer</Label>
                <Input
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  placeholder={type === 'numerical' ? 'e.g., 42' : 'Correct answer text'}
                />
              </div>
            )}

            {/* Explanation */}
            <div className="space-y-2">
              <Label>Explanation (optional)</Label>
              <Textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain the correct answer..."
                rows={3}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Metadata</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Biology, Physics"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Difficulty (1-5)</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(d => (
                    <SelectItem key={d} value={String(d)}>D{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Linked Concept</Label>
              <Select value={conceptId} onValueChange={setConceptId}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Select concept..." /></SelectTrigger>
                <SelectContent>
                  {concepts.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Linked Exam (if PYQ)</Label>
              <Select value={examId} onValueChange={setExamId}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Select exam..." /></SelectTrigger>
                <SelectContent>
                  {exams.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Source</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Source Type</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="pyq">PYQ (Previous Year)</SelectItem>
                  <SelectItem value="book">Book</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {source === 'pyq' && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs">Source Reference</Label>
                  <Input
                    value={sourceRef}
                    onChange={(e) => setSourceRef(e.target.value)}
                    placeholder="e.g., NEET 2023"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Board Reference (if board PYQ)</Label>
                  <Input
                    value={boardRef}
                    onChange={(e) => setBoardRef(e.target.value)}
                    placeholder="e.g., CBSE Class 12 2023"
                    className="text-sm"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label className="text-xs">GK Relevance</Label>
              <Select value={gkRelevance} onValueChange={setGkRelevance}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Actions</h3>
          <div className="space-y-2">
            <Button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="w-full"
              variant="outline"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="w-full"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Publish
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
