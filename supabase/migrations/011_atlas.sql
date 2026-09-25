-- ============================================
-- Migration 011: Atlas Schema (Books Solutions)
-- ============================================
-- Books, chapters, and chapter-wise solutions for ALL segments:
-- School (Class 6-10), Senior (Class 11-12), College, ITI.
-- Each solution links to concept (knowledge graph) + related questions.

-- ============================================
-- BOOKS
-- ============================================

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  author text,
  publisher text,
  edition text,
  segment text not null check (segment in ('school', 'senior', 'college', 'iti', 'skills')),
  subject text not null,  -- Science / Mathematics / etc.
  class_ref text,  -- "Class 8" / "Class 12" / "B.Tech Sem 3" / "ITI Electrician"
  board_ref text,  -- CBSE / ICSE / State Board / University
  isbn text,
  cover_url text,
  description text,
  status text default 'active' check (status in ('active', 'inactive')),
  seo_json jsonb,
  created_at timestamptz default now()
);

create index idx_books_segment on public.books(segment);
create index idx_books_subject on public.books(subject);
create index idx_books_class on public.books(class_ref);
create index idx_books_slug on public.books(slug);

-- ============================================
-- BOOK CHAPTERS
-- ============================================

create table if not exists public.book_chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references public.books on delete cascade,
  chapter_number int not null,
  title text not null,
  slug text not null,
  summary text,
  seo_json jsonb,
  created_at timestamptz default now(),
  unique (book_id, chapter_number),
  unique (book_id, slug)
);

create index idx_chapters_book on public.book_chapters(book_id);
create index idx_chapters_slug on public.book_chapters(slug);

-- ============================================
-- BOOK SOLUTIONS (exercise questions + solutions)
-- ============================================

create table if not exists public.book_solutions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references public.book_chapters on delete cascade,
  question_number text not null,  -- "1", "2a", "3.1", etc.
  question_text text not null,
  question_json jsonb,  -- structured (for match, multiple parts, etc.)
  solution_text text not null,  -- Markdown + LaTeX
  solution_json jsonb,  -- structured solution (steps)
  concept_id uuid references public.concepts on delete set null,  -- which concept this tests
  difficulty int default 2 check (difficulty between 1 and 5),
  marks int,  -- marks for this question
  related_question_ids uuid[],  -- related questions from questions table
  status text default 'published' check (status in ('draft', 'published')),
  seo_json jsonb,
  created_at timestamptz default now()
);

create index idx_solutions_chapter on public.book_solutions(chapter_id);
create index idx_solutions_concept on public.book_solutions(concept_id);
create index idx_solutions_status on public.book_solutions(status);

-- ============================================
-- RLS POLICIES
-- ============================================

alter table public.books enable row level security;
alter table public.book_chapters enable row level security;
alter table public.book_solutions enable row level security;

create policy "Public can read active books"
  on public.books for select using (status = 'active');
create policy "Public can read book chapters"
  on public.book_chapters for select using (true);
create policy "Public can read published solutions"
  on public.book_solutions for select using (status = 'published');
