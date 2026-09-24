-- ============================================
-- Migration 013: College Schema (Degree, Semester, Subjects)
-- ============================================
-- For Session 11: College segment — university/degree/semester structure

-- ============================================
-- DEGREES (B.Tech, BSc, BA, BCom, BCA, etc.)
-- ============================================

create table if not exists public.degrees (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,  -- "B.Tech Computer Science"
  short_name text,  -- "B.Tech CSE"
  level text not null check (level in ('undergraduate', 'postgraduate', 'diploma')),
  duration_years int default 3,  -- 3 or 4 years
  total_semesters int default 6,  -- typically 6 or 8
  field text,  -- "Engineering", "Science", "Arts", "Commerce", "Management"
  description text,
  seo_json jsonb,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now()
);

create index idx_degrees_level on public.degrees(level);
create index idx_degrees_slug on public.degrees(slug);

-- ============================================
-- SEMESTERS (per degree)
-- ============================================

create table if not exists public.semesters (
  id uuid primary key default gen_random_uuid(),
  degree_id uuid references public.degrees on delete cascade,
  semester_number int not null,  -- 1, 2, 3, ...
  year int not null,  -- 1, 2, 3, 4
  title text,  -- "Semester 1 — First Year"
  unique (degree_id, semester_number)
);

create index idx_semesters_degree on public.semesters(degree_id);

-- ============================================
-- SEMESTER SUBJECTS (subjects in each semester)
-- ============================================

create table if not exists public.semester_subjects (
  id uuid primary key default gen_random_uuid(),
  semester_id uuid references public.semesters on delete cascade,
  subject_code text,  -- "CS101", "MA201"
  subject_name text not null,
  credits int default 4,
  subject_type text default 'core' check (subject_type in ('core', 'elective', 'lab', 'project', 'seminar')),
  concept_ids uuid[],  -- linked concepts from knowledge graph
  description text,
  created_at timestamptz default now()
);

create index idx_semester_subjects_semester on public.semester_subjects(semester_id);

-- ============================================
-- RLS POLICIES
-- ============================================

alter table public.degrees enable row level security;
alter table public.semesters enable row level security;
alter table public.semester_subjects enable row level security;

create policy "Public can read active degrees"
  on public.degrees for select using (status = 'active');
create policy "Public can read semesters"
  on public.semesters for select using (true);
create policy "Public can read semester subjects"
  on public.semester_subjects for select using (true);
