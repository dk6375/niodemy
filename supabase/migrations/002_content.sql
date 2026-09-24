-- ============================================
-- Migration 002: Content Schema (Lessons, Media, Versions)
-- ============================================
-- Content assets: lessons, tutorials, articles, notes, slides.
-- Linked to concepts via concept_id.

create schema if not exists content;

-- Content assets: any piece of educational content
create table if not exists content.content_assets (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('lesson', 'tutorial', 'note', 'slide', 'diagram', 'article', 'example', 'exercise')),
  title text not null,
  slug text unique not null,
  body_md text,  -- Markdown body
  content_json jsonb,  -- structured content (for non-prose content)
  concept_id uuid references knowledge.concepts on delete set null,
  segment text not null check (segment in ('school', 'senior', 'coaching', 'college', 'iti', 'skills', 'gk', 'atlas')),
  context_type text,  -- class / exam / trade / skill_track / book / curriculum
  context_id uuid,  -- polymorphic reference (class_id / exam_id / trade_id / etc.)
  author_id uuid,  -- references auth.users (set via RLS / console)
  status text default 'draft' check (status in ('draft', 'review', 'published', 'deprecated')),
  seo_json jsonb,  -- { title, description, canonical_url, indexable, og_image }
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_content_concept on content.content_assets(concept_id);
create index if not exists idx_content_segment on content.content_assets(segment);
create index if not exists idx_content_status on content.content_assets(status);
create index if not exists idx_content_slug on content.content_assets(slug);
create index if not exists idx_content_context on content.content_assets(context_type, context_id);

-- Content versions: full version history for rollback
create table if not exists content.content_versions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references content.content_assets on delete cascade,
  version int not null,
  body_md text,
  content_json jsonb,
  author_id uuid,
  change_note text,
  created_at timestamptz default now(),
  unique (content_id, version)
);

create index if not exists idx_versions_content on content.content_versions(content_id);

-- Media: videos, images, PDFs, PPTs (stored in Supabase Storage)
create table if not exists content.media (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('video', 'image', 'pdf', 'ppt', 'audio', 'diagram')),
  url text not null,
  title text,
  description text,
  duration int,  -- for video/audio (seconds)
  concept_id uuid references knowledge.concepts on delete set null,
  content_id uuid references content.content_assets on delete cascade,
  storage_path text,
  created_at timestamptz default now()
);

create index if not exists idx_media_concept on content.media(concept_id);
create index if not exists idx_media_content on content.media(content_id);

-- Enable RLS
alter table content.content_assets enable row level security;
alter table content.content_versions enable row level security;
alter table content.media enable row level security;

-- RLS: published content readable by everyone
drop policy if exists "Public can read published content" on content.content_assets;
create policy "Public can read published content"
  on content.content_assets for select
  using (status = 'published');

drop policy if exists "Public can read content versions" on content.content_versions;
create policy "Public can read content versions"
  on content.content_versions for select
  using (true);

drop policy if exists "Public can read media" on content.media;
create policy "Public can read media"
  on content.media for select
  using (true);

-- Update timestamp trigger
create or replace function content.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_content_updated_at on content.content_assets;
create trigger trg_content_updated_at
  before update on content.content_assets
  for each row execute function content.update_updated_at();
