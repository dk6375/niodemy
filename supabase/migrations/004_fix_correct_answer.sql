-- ============================================
-- Migration 004: Fix correct_answer column type
-- ============================================
-- Change correct_answer from jsonb to text for simpler inserts.
-- Application layer parses: single key "A", comma-separated "A,C", or text answer.

alter table questions.questions
  alter column correct_answer type text using correct_answer::text;

-- Also change options_json stays jsonb (structured), but body_json stays jsonb (structured).
-- correct_answer as text is simpler and sufficient.
