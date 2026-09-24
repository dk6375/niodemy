-- ============================================
-- Migration 015: Skills Schema (Tracks, Tutorials, Exercises)
-- ============================================
-- For Session 13: Skills segment — W3Schools-style tutorials

-- ============================================
-- SKILL TRACKS (roadmaps: "Become a Web Developer")
-- ============================================

create table if not exists public.skill_tracks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,  -- "Web Development", "Python Programming", "Excel Mastery"
  short_name text,
  description text,
  icon text,  -- emoji or icon name
  level text default 'beginner' check (level in ('beginner', 'intermediate', 'advanced', 'all-levels')),
  total_modules int default 0,
  estimated_hours int,
  tags text[],  -- ["programming", "web", "frontend"]
  seo_json jsonb,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now()
);

create index idx_skill_tracks_slug on public.skill_tracks(slug);

-- ============================================
-- SKILL MODULES (tutorials within a track)
-- ============================================

create table if not exists public.skill_modules (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references public.skill_tracks on delete cascade,
  module_number int not null,
  title text not null,
  slug text not null,
  description text,
  body_md text,  -- Markdown tutorial body
  is_interactive boolean default false,  -- "Try it yourself" examples
  example_code text,  -- for interactive examples
  estimated_minutes int,
  concept_ids uuid[],  -- linked concepts
  created_at timestamptz default now(),
  unique (track_id, module_number)
);

create index idx_skill_modules_track on public.skill_modules(track_id);

-- ============================================
-- RLS POLICIES
-- ============================================

alter table public.skill_tracks enable row level security;
alter table public.skill_modules enable row level security;

create policy "Public can read active skill tracks"
  on public.skill_tracks for select using (status = 'active');
create policy "Public can read skill modules"
  on public.skill_modules for select using (true);
