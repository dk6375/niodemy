-- ============================================
-- Migration 006: Education Schema (Boards, Classes, Curriculums)
-- ============================================
-- Maps knowledge concepts to board/class curriculum at specific depth levels.
-- This enables combined course (depth-merge) for School segment.

-- ============================================
-- BOARDS (CBSE, ICSE, MP Board, etc.)
-- ============================================

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,  -- CBSE / ICSE / MP Board
  slug text unique not null,
  full_name text,  -- "Central Board of Secondary Education"
  created_at timestamptz default now()
);

-- ============================================
-- CLASSES (Class 6 to 12)
-- ============================================

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references public.boards on delete cascade,
  name text not null,  -- "Class 8"
  level int not null check (level between 1 and 12),  -- 6, 7, 8, 9, 10, 11, 12
  segment text not null check (segment in ('school', 'senior')) default 'school',  -- 6-10 = school, 11-12 = senior
  unique (board_id, name)
);

create index idx_classes_board on public.classes(board_id);
create index idx_classes_segment on public.classes(segment);

-- ============================================
-- CURRICULUMS (Board + Class + Subject + Academic Year)
-- ============================================

create table if not exists public.curriculums (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references public.boards on delete cascade,
  class_id uuid references public.classes on delete cascade,
  subject text not null,  -- Science / Mathematics / etc.
  academic_year text,  -- 2025-26
  status text default 'active' check (status in ('active', 'archived')),
  created_at timestamptz default now(),
  unique (board_id, class_id, subject, academic_year)
);

create index idx_curriculums_class on public.curriculums(class_id);
create index idx_curriculums_subject on public.curriculums(subject);

-- ============================================
-- CURRICULUM CONCEPTS (which concepts at which depth in which curriculum)
-- ============================================
-- This is the mapping that enables depth-merge combined course.
-- Example: Class 8 CBSE Science has Photosynthesis at L2.
--          Class 8 NEET Foundation has Photosynthesis at L3.
-- Combined course = max(L2, L3) = L3.

create table if not exists public.curriculum_concepts (
  curriculum_id uuid references public.curriculums on delete cascade,
  concept_id uuid references public.concepts on delete cascade,
  depth_required int default 1 check (depth_required between 1 and 4),  -- L1-L4
  importance text default 'medium' check (importance in ('low', 'medium', 'high')),
  chapter_name text,  -- which chapter this concept belongs to
  order_index int default 0,  -- order within the curriculum
  primary key (curriculum_id, concept_id)
);

create index idx_curr_concepts_curriculum on public.curriculum_concepts(curriculum_id);
create index idx_curr_concepts_concept on public.curriculum_concepts(concept_id);

-- ============================================
-- RLS POLICIES
-- ============================================

alter table public.boards enable row level security;
alter table public.classes enable row level security;
alter table public.curriculums enable row level security;
alter table public.curriculum_concepts enable row level security;

create policy "Public can read boards"
  on public.boards for select using (true);
create policy "Public can read classes"
  on public.classes for select using (true);
create policy "Public can read curriculums"
  on public.curriculums for select using (status = 'active');
create policy "Public can read curriculum_concepts"
  on public.curriculum_concepts for select using (true);
