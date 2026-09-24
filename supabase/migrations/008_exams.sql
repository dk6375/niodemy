-- ============================================
-- Migration 008: Exams Schema (Competitive Exams)
-- ============================================
-- For Coaching segment. Exam = permanent identity, exam_cycles = yearly instance.
-- exam_concepts maps which concepts (at which depth) are needed for each exam.
-- This enables syllabus-merge combined course (RRB + SSC + Police → one combined course).

-- ============================================
-- EXAMS (permanent identity)
-- ============================================

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('ssc', 'railway', 'police', 'banking', 'upsc', 'defence', 'teaching', 'state_psc', 'entrance', 'other')),
  conducting_body text,  -- "Staff Selection Commission", "Railway Recruitment Board"
  description text,
  pattern_json jsonb,  -- { sections: [...], total_marks, duration, negative_marking, mode }
  eligibility_json jsonb,  -- { min_education, max_age, age_relaxation, ... }
  languages text[] default '{hi,en}',
  official_url text,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now()
);

create index idx_exams_category on public.exams(category);
create index idx_exams_status on public.exams(status);

-- ============================================
-- EXAM CYCLES (yearly instances — SSC CGL 2026, RRB Group D 2025)
-- ============================================

create table if not exists public.exam_cycles (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references public.exams on delete cascade,
  cycle_name text not null,  -- "SSC CGL 2026"
  year int not null,
  notification_date date,
  application_start_date date,
  application_end_date date,
  exam_date date,
  result_date date,
  pattern_json jsonb,  -- overrides exam.pattern_json if changed this cycle
  vacancies int,
  status text default 'upcoming' check (status in ('upcoming', 'application_open', 'exam_held', 'result_out')),
  unique (exam_id, year)
);

create index idx_exam_cycles_exam on public.exam_cycles(exam_id);
create index idx_exam_cycles_status on public.exam_cycles(status);

-- ============================================
-- EXAM CONCEPTS (which concepts at which depth for each exam)
-- ============================================
-- This is the mapping that enables syllabus-merge combined course.
-- Example: RRB Group D needs Fundamental Rights at L2.
--          SSC GD needs Fundamental Rights at L2 (same).
--          UPSC needs Fundamental Rights at L4.
-- Combined course = union of all concepts, depth = max per concept.

create table if not exists public.exam_concepts (
  exam_id uuid references public.exams on delete cascade,
  concept_id uuid references public.concepts on delete cascade,
  depth_required int default 1 check (depth_required between 1 and 4),
  importance text default 'medium' check (importance in ('low', 'medium', 'high')),
  subject text,  -- which subject this falls under in this exam (e.g., "General Awareness", "Mathematics")
  primary key (exam_id, concept_id)
);

create index idx_exam_concepts_exam on public.exam_concepts(exam_id);
create index idx_exam_concepts_concept on public.exam_concepts(concept_id);

-- ============================================
-- RELATED EXAMS (similar/feeder/backup/parallel/progression)
-- ============================================

create table if not exists public.related_exams (
  exam_id_1 uuid references public.exams on delete cascade,
  exam_id_2 uuid references public.exams on delete cascade,
  relation_type text not null check (relation_type in ('similar', 'feeder', 'backup', 'parallel', 'progression')),
  primary key (exam_id_1, exam_id_2)
);

-- ============================================
-- RLS POLICIES
-- ============================================

alter table public.exams enable row level security;
alter table public.exam_cycles enable row level security;
alter table public.exam_concepts enable row level security;
alter table public.related_exams enable row level security;

create policy "Public can read active exams"
  on public.exams for select using (status = 'active');
create policy "Public can read exam cycles"
  on public.exam_cycles for select using (true);
create policy "Public can read exam concepts"
  on public.exam_concepts for select using (true);
create policy "Public can read related exams"
  on public.related_exams for select using (true);
