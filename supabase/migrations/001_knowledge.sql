-- ============================================
-- Migration 001: Knowledge Schema (Concepts)
-- ============================================
-- The universal knowledge graph. Concepts are atomic units, NOT tied to any class/exam.
-- Class/exam mappings live in education.curriculum_concepts and exams.exam_concepts.

create schema if not exists knowledge;

-- Concepts: atomic knowledge units (e.g., Photosynthesis, Fundamental Rights)
create table if not exists knowledge.concepts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subject text not null,  -- Biology / Polity / Mathematics / etc.
  domain text,  -- Science / Social Science / etc.
  summary text,
  content_json jsonb,  -- structured content (definition, key_facts, components, etc.)
  depth_layers jsonb,  -- { L1: "...", L2: "...", L3: "...", L4: "..." }
  common_misconceptions jsonb,
  status text default 'draft' check (status in ('draft', 'review', 'published', 'deprecated')),
  seo_json jsonb,  -- { title, description, canonical_url, indexable, og_image }
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_concepts_subject on knowledge.concepts(subject);
create index if not exists idx_concepts_status on knowledge.concepts(status);
create index if not exists idx_concepts_slug on knowledge.concepts(slug);

-- Concept prerequisites (directed graph)
create table if not exists knowledge.concept_prerequisites (
  concept_id uuid references knowledge.concepts on delete cascade,
  prerequisite_id uuid references knowledge.concepts on delete cascade,
  primary key (concept_id, prerequisite_id)
);

-- Concept translations (Hindi, English, regional)
create table if not exists knowledge.concept_translations (
  concept_id uuid references knowledge.concepts on delete cascade,
  language text not null check (language in ('hi', 'en', 'mr', 'bn', 'ta', 'te', 'gu', 'kn', 'ml', 'pa', 'or', 'as')),
  title text,
  summary text,
  content_json jsonb,
  primary key (concept_id, language)
);

-- Enable RLS
alter table knowledge.concepts enable row level security;
alter table knowledge.concept_prerequisites enable row level security;
alter table knowledge.concept_translations enable row level security;

-- RLS Policies: published concepts readable by everyone (including anon)
drop policy if exists "Public can read published concepts" on knowledge.concepts;
create policy "Public can read published concepts"
  on knowledge.concepts for select
  using (status = 'published');

drop policy if exists "Public can read concept prerequisites" on knowledge.concept_prerequisites;
create policy "Public can read concept prerequisites"
  on knowledge.concept_prerequisites for select
  using (true);

drop policy if exists "Public can read concept translations" on knowledge.concept_translations;
create policy "Public can read concept translations"
  on knowledge.concept_translations for select
  using (true);

-- Update timestamp trigger
create or replace function knowledge.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_concepts_updated_at on knowledge.concepts;
create trigger trg_concepts_updated_at
  before update on knowledge.concepts
  for each row execute function knowledge.update_updated_at();
