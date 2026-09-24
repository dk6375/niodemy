-- ============================================
-- Migration 005: Move all tables to public schema
-- ============================================
-- Supabase PostgREST exposes only 'public' schema by default.
-- Moving tables from knowledge/content/questions schemas to public for API access.
-- Tables keep clean names (no prefix needed since names are unique).

-- Drop old schema-qualified tables (cascade drops everything in those schemas)
drop schema if exists knowledge cascade;
drop schema if exists content cascade;
drop schema if exists questions cascade;

-- Clean up any partial public schema tables from failed runs
drop table if exists public.collection_items cascade;
drop table if exists public.collections cascade;
drop table if exists public.questions cascade;
drop table if exists public.media cascade;
drop table if exists public.content_versions cascade;
drop table if exists public.content_assets cascade;
drop table if exists public.concept_translations cascade;
drop table if exists public.concept_prerequisites cascade;
drop table if exists public.concepts cascade;
drop function if exists public.update_updated_at() cascade;

-- ============================================
-- CONCEPTS (public.concepts)
-- ============================================

create table public.concepts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subject text not null,
  domain text,
  summary text,
  content_json jsonb,
  depth_layers jsonb,
  common_misconceptions jsonb,
  status text default 'draft' check (status in ('draft', 'review', 'published', 'deprecated')),
  seo_json jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_concepts_subject on public.concepts(subject);
create index idx_concepts_status on public.concepts(status);
create index idx_concepts_slug on public.concepts(slug);

create table public.concept_prerequisites (
  concept_id uuid references public.concepts on delete cascade,
  prerequisite_id uuid references public.concepts on delete cascade,
  primary key (concept_id, prerequisite_id)
);

create table public.concept_translations (
  concept_id uuid references public.concepts on delete cascade,
  language text not null check (language in ('hi', 'en', 'mr', 'bn', 'ta', 'te', 'gu', 'kn', 'ml', 'pa', 'or', 'as')),
  title text,
  summary text,
  content_json jsonb,
  primary key (concept_id, language)
);

-- ============================================
-- CONTENT (public.content_assets)
-- ============================================

create table public.content_assets (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('lesson', 'tutorial', 'note', 'slide', 'diagram', 'article', 'example', 'exercise')),
  title text not null,
  slug text unique not null,
  body_md text,
  content_json jsonb,
  concept_id uuid references public.concepts on delete set null,
  segment text not null check (segment in ('school', 'senior', 'coaching', 'college', 'iti', 'skills', 'gk', 'atlas')),
  context_type text,
  context_id uuid,
  author_id uuid,
  status text default 'draft' check (status in ('draft', 'review', 'published', 'deprecated')),
  seo_json jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_content_concept on public.content_assets(concept_id);
create index idx_content_segment on public.content_assets(segment);
create index idx_content_status on public.content_assets(status);
create index idx_content_slug on public.content_assets(slug);

create table public.content_versions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references public.content_assets on delete cascade,
  version int not null,
  body_md text,
  content_json jsonb,
  author_id uuid,
  change_note text,
  created_at timestamptz default now(),
  unique (content_id, version)
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('video', 'image', 'pdf', 'ppt', 'audio', 'diagram')),
  url text not null,
  title text,
  description text,
  duration int,
  concept_id uuid references public.concepts on delete set null,
  content_id uuid references public.content_assets on delete cascade,
  storage_path text,
  created_at timestamptz default now()
);

-- ============================================
-- QUESTIONS (public.questions)
-- ============================================

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('mcq', 'numerical', 'truefalse', 'short', 'long', 'assertion_reason', 'match', 'fill_blank')),
  body text not null,
  body_json jsonb,
  options_json jsonb,
  correct_answer text,  -- single key "A", comma-separated "A,C", or text answer
  explanation text,
  concept_id uuid references public.concepts on delete set null,
  subject text,
  difficulty int default 2 check (difficulty between 1 and 5),
  exam_format text default 'any' check (exam_format in ('board', 'competitive', 'both', 'any')),
  time_recommended int,
  marks int,
  source text check (source in ('pyq', 'custom', 'book', 'generated')),
  source_ref text,
  exam_id uuid,
  board_ref text,
  exam_year int,
  gk_relevance text default 'none' check (gk_relevance in ('none', 'general', 'high')),
  status text default 'draft' check (status in ('draft', 'review', 'published')),
  created_at timestamptz default now()
);

create index idx_questions_concept on public.questions(concept_id);
create index idx_questions_subject on public.questions(subject);
create index idx_questions_status on public.questions(status);
create index idx_questions_type on public.questions(type);
create index idx_questions_difficulty on public.questions(difficulty);
create index idx_questions_gk on public.questions(gk_relevance);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text not null check (type in ('gk', 'exam_set', 'chapter_set', 'mock_test', 'quiz', 'speed_drill', 'pyq_set')),
  description text,
  segment text,
  context_type text,
  context_id uuid,
  seo_json jsonb,
  status text default 'published' check (status in ('draft', 'published')),
  created_at timestamptz default now()
);

create index idx_collections_slug on public.collections(slug);
create index idx_collections_type on public.collections(type);

create table public.collection_items (
  collection_id uuid references public.collections on delete cascade,
  question_id uuid references public.questions on delete cascade,
  order_index int default 0,
  primary key (collection_id, question_id)
);

-- ============================================
-- RLS POLICIES
-- ============================================

alter table public.concepts enable row level security;
alter table public.concept_prerequisites enable row level security;
alter table public.concept_translations enable row level security;
alter table public.content_assets enable row level security;
alter table public.content_versions enable row level security;
alter table public.media enable row level security;
alter table public.questions enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;

create policy "Public can read published concepts"
  on public.concepts for select using (status = 'published');
create policy "Public can read concept prerequisites"
  on public.concept_prerequisites for select using (true);
create policy "Public can read concept translations"
  on public.concept_translations for select using (true);

create policy "Public can read published content"
  on public.content_assets for select using (status = 'published');
create policy "Public can read content versions"
  on public.content_versions for select using (true);
create policy "Public can read media"
  on public.media for select using (true);

create policy "Public can read published questions"
  on public.questions for select using (status = 'published');
create policy "Public can read published collections"
  on public.collections for select using (status = 'published');
create policy "Public can read collection items"
  on public.collection_items for select using (true);

-- ============================================
-- TRIGGERS
-- ============================================

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_concepts_updated_at
  before update on public.concepts
  for each row execute function public.update_updated_at();

create trigger trg_content_updated_at
  before update on public.content_assets
  for each row execute function public.update_updated_at();
