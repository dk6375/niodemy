-- ============================================
-- Migration 007: Learning Schema (Enrollments, Paths, Progress)
-- ============================================
-- Tracks learner goals, combined course paths, mastery, attempts.

-- ============================================
-- ENROLLMENTS (learner's goals — class, exam, trade, skill track)
-- ============================================

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,  -- references auth.users
  segment text not null check (segment in ('school', 'senior', 'coaching', 'college', 'iti', 'skills')),
  target_type text not null check (target_type in ('class', 'exam', 'trade', 'skill_track')),
  target_id uuid not null,  -- polymorphic: class_id / exam_id / trade_id / skill_track_id
  target_name text,  -- denormalized for display (e.g., "Class 8 CBSE Science", "RRB Group D")
  status text default 'active' check (status in ('active', 'paused', 'completed', 'abandoned')),
  priority int default 1 check (priority between 1 and 5),  -- for multi-goal weighting
  enrolled_at timestamptz default now(),
  unique (user_id, segment, target_type, target_id)
);

create index idx_enrollments_user on public.enrollments(user_id);
create index idx_enrollments_status on public.enrollments(status);

-- ============================================
-- LEARNING PATHS (combined course output — cached)
-- ============================================

create table if not exists public.learning_paths (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  path_json jsonb not null,  -- { concepts: [{id, depth, priority, order}], mode: 'depth-merge' | 'syllabus-merge' | 'hybrid-merge' }
  overlap_stats jsonb,  -- { common: 72, ssc_specific: 16, rrb_specific: 7, mp_specific: 5 }
  version int default 1,
  status text default 'active' check (status in ('active', 'archived')),
  generated_at timestamptz default now(),
  recomputed_at timestamptz
);

create index idx_learning_paths_user on public.learning_paths(user_id);

-- ============================================
-- PROGRESS (per user per concept mastery)
-- ============================================
-- This is the "Knowledge Passport" — mastery carries across goals.

create table if not exists public.progress (
  user_id uuid not null,
  concept_id uuid references public.concepts on delete cascade,
  mastery int default 0 check (mastery between 0 and 100),
  status text default 'not_started' check (status in ('not_started', 'learning', 'understood', 'practiced', 'mastered', 'needs_revision')),
  attempts_count int default 0,
  correct_count int default 0,
  last_reviewed timestamptz,
  next_review_date timestamptz,  -- spaced repetition
  primary key (user_id, concept_id)
);

create index idx_progress_user on public.progress(user_id);
create index idx_progress_concept on public.progress(concept_id);
create index idx_progress_status on public.progress(status);

-- ============================================
-- ATTEMPTS (question attempts — for analytics)
-- ============================================

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  question_id uuid references public.questions on delete cascade,
  user_answer text,  -- selected option key or text answer
  is_correct boolean,
  time_taken int,  -- seconds
  created_at timestamptz default now()
);

create index idx_attempts_user on public.attempts(user_id);
create index idx_attempts_question on public.attempts(question_id);

-- ============================================
-- BOOKMARKS (saved content)
-- ============================================

create table if not exists public.bookmarks (
  user_id uuid not null,
  content_id uuid references public.content_assets on delete cascade,
  note text,
  created_at timestamptz default now(),
  primary key (user_id, content_id)
);

create index idx_bookmarks_user on public.bookmarks(user_id);

-- ============================================
-- NOTES (personal notes on content)
-- ============================================

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  content_id uuid references public.content_assets on delete cascade,
  body text,  -- user's personal note on this content
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_notes_user on public.notes(user_id);
create index idx_notes_content on public.notes(content_id);

-- ============================================
-- RLS POLICIES
-- ============================================

alter table public.enrollments enable row level security;
alter table public.learning_paths enable row level security;
alter table public.progress enable row level security;
alter table public.attempts enable row level security;
alter table public.bookmarks enable row level security;
alter table public.notes enable row level security;

-- Enrollments: owner can CRUD
create policy "Users can read own enrollments"
  on public.enrollments for select using (auth.uid() = user_id);
create policy "Users can insert own enrollments"
  on public.enrollments for insert with check (auth.uid() = user_id);
create policy "Users can update own enrollments"
  on public.enrollments for update using (auth.uid() = user_id);
create policy "Users can delete own enrollments"
  on public.enrollments for delete using (auth.uid() = user_id);

-- Learning paths: owner can CRUD
create policy "Users can read own learning paths"
  on public.learning_paths for select using (auth.uid() = user_id);
create policy "Users can insert own learning paths"
  on public.learning_paths for insert with check (auth.uid() = user_id);
create policy "Users can update own learning paths"
  on public.learning_paths for update using (auth.uid() = user_id);
create policy "Users can delete own learning paths"
  on public.learning_paths for delete using (auth.uid() = user_id);

-- Progress: owner can CRUD
create policy "Users can read own progress"
  on public.progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress"
  on public.progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress"
  on public.progress for update using (auth.uid() = user_id);
create policy "Users can delete own progress"
  on public.progress for delete using (auth.uid() = user_id);

-- Attempts: owner can CRUD
create policy "Users can read own attempts"
  on public.attempts for select using (auth.uid() = user_id);
create policy "Users can insert own attempts"
  on public.attempts for insert with check (auth.uid() = user_id);

-- Bookmarks: owner can CRUD
create policy "Users can read own bookmarks"
  on public.bookmarks for select using (auth.uid() = user_id);
create policy "Users can insert own bookmarks"
  on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "Users can update own bookmarks"
  on public.bookmarks for update using (auth.uid() = user_id);
create policy "Users can delete own bookmarks"
  on public.bookmarks for delete using (auth.uid() = user_id);

-- Notes: owner can CRUD
create policy "Users can read own notes"
  on public.notes for select using (auth.uid() = user_id);
create policy "Users can insert own notes"
  on public.notes for insert with check (auth.uid() = user_id);
create policy "Users can update own notes"
  on public.notes for update using (auth.uid() = user_id);
create policy "Users can delete own notes"
  on public.notes for delete using (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

create trigger trg_notes_updated_at
  before update on public.notes
  for each row execute function public.update_updated_at();
