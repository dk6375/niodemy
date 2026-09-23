-- ============================================
-- Migration 003: Questions Schema (MCQs, PYQs, Collections)
-- ============================================
-- Questions: MCQs, PYQs, numerical, long-form, etc.
-- Collections: dynamic groupings (GK pages, quizzes, mock tests, chapter sets)

create schema if not exists questions;

-- Questions: the universal question bank
create table if not exists questions.questions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('mcq', 'numerical', 'truefalse', 'short', 'long', 'assertion_reason', 'match', 'fill_blank')),
  body text not null,  -- question text (Markdown)
  body_json jsonb,  -- structured question (for match, assertion-reason, etc.)
  options_json jsonb,  -- [{ key: "A", text: "..." }, ...]
  correct_answer jsonb,  -- "A" or ["A","C"] or "text"
  explanation text,  -- Markdown explanation
  concept_id uuid references knowledge.concepts on delete set null,
  subject text,  -- Biology / Polity / etc. (denormalized for fast filtering)
  difficulty int default 2 check (difficulty between 1 and 5),
  exam_format text default 'any' check (exam_format in ('board', 'competitive', 'both', 'any')),
  time_recommended int,  -- recommended solve time in seconds (for speed drills)
  marks int,  -- marks for this question
  source text check (source in ('pyq', 'custom', 'book', 'generated')),
  source_ref text,  -- "SSC CGL 2023 Shift 1" or "NCERT Class 10 Ex 1.1 Q2" or "CBSE Board 2023 Q5"
  exam_id uuid,  -- references exams.exams (set when exams schema created)
  board_ref text,  -- "CBSE Class 12 2023" for board PYQs
  exam_year int,
  gk_relevance text default 'none' check (gk_relevance in ('none', 'general', 'high')),
  status text default 'draft' check (status in ('draft', 'review', 'published')),
  created_at timestamptz default now()
);

create index if not exists idx_questions_concept on questions.questions(concept_id);
create index if not exists idx_questions_subject on questions.questions(subject);
create index if not exists idx_questions_status on questions.questions(status);
create index if not exists idx_questions_type on questions.questions(type);
create index if not exists idx_questions_difficulty on questions.questions(difficulty);
create index if not exists idx_questions_gk on questions.questions(gk_relevance);

-- Collections: dynamic groupings (GK pages, quizzes, mock tests, chapter sets)
create table if not exists questions.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text not null check (type in ('gk', 'exam_set', 'chapter_set', 'mock_test', 'quiz', 'speed_drill', 'pyq_set')),
  description text,
  segment text,  -- school / senior / coaching / gk / etc.
  context_type text,  -- exam / class / subject / chapter
  context_id uuid,  -- polymorphic
  seo_json jsonb,  -- { title, description, h1, intro_content, faq_content }
  status text default 'published' check (status in ('draft', 'published')),
  created_at timestamptz default now()
);

create index if not exists idx_collections_slug on questions.collections(slug);
create index if not exists idx_collections_type on questions.collections(type);

-- Collection items: many-to-many between collections and questions
create table if not exists questions.collection_items (
  collection_id uuid references questions.collections on delete cascade,
  question_id uuid references questions.questions on delete cascade,
  order_index int default 0,
  primary key (collection_id, question_id)
);

create index if not exists idx_collection_items_collection on questions.collection_items(collection_id);
create index if not exists idx_collection_items_question on questions.collection_items(question_id);

-- Enable RLS
alter table questions.questions enable row level security;
alter table questions.collections enable row level security;
alter table questions.collection_items enable row level security;

-- RLS: published questions readable by everyone
drop policy if exists "Public can read published questions" on questions.questions;
create policy "Public can read published questions"
  on questions.questions for select
  using (status = 'published');

drop policy if exists "Public can read published collections" on questions.collections;
create policy "Public can read published collections"
  on questions.collections for select
  using (status = 'published');

drop policy if exists "Public can read collection items" on questions.collection_items;
create policy "Public can read collection items"
  on questions.collection_items for select
  using (true);
