-- ============================================
-- Migration 012: GK Schema (Current Affairs)
-- ============================================
-- Content-first model: articles/notes published first.
-- Then MCQ/Quiz/QNA/MockTest accessible on demand.
-- Each event tagged to concepts (knowledge graph) + exams (exam-centric).

-- ============================================
-- CURRENT EVENTS (articles/notes — content-first)
-- ============================================

create table if not exists public.current_events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  body_md text not null,  -- Markdown body (content-first)
  summary text,
  category text not null check (category in ('polity', 'economy', 'science', 'sports', 'international', 'national', 'awards', 'appointments', 'schemes', 'defense', 'environment', 'technology')),
  event_date date not null,
  source_url text,
  source_name text,
  gk_relevance text default 'general' check (gk_relevance in ('none', 'general', 'high')),
  seo_json jsonb,
  status text default 'published' check (status in ('draft', 'published')),
  author_id uuid,
  created_at timestamptz default now()
);

create index idx_current_events_category on public.current_events(category);
create index idx_current_events_date on public.current_events(event_date desc);
create index idx_current_events_status on public.current_events(status);
create index idx_current_events_relevance on public.current_events(gk_relevance);
create index idx_current_events_slug on public.current_events(slug);

-- ============================================
-- EVENT-CONCEPT MAPPING (link events to knowledge graph)
-- ============================================

create table if not exists public.event_concepts (
  event_id uuid references public.current_events on delete cascade,
  concept_id uuid references public.concepts on delete cascade,
  primary key (event_id, concept_id)
);

create index idx_event_concepts_event on public.event_concepts(event_id);
create index idx_event_concepts_concept on public.event_concepts(concept_id);

-- ============================================
-- EVENT-EXAM MAPPING (exam-centric personalization)
-- ============================================
-- Same event, different relevance for different exams.
-- RRB student sees basic GK, UPSC student sees deep GK.

create table if not exists public.event_exams (
  event_id uuid references public.current_events on delete cascade,
  exam_id uuid references public.exams on delete cascade,
  relevance text default 'general' check (relevance in ('low', 'medium', 'high')),
  primary key (event_id, exam_id)
);

create index idx_event_exams_event on public.event_exams(event_id);
create index idx_event_exams_exam on public.event_exams(exam_id);

-- ============================================
-- RLS POLICIES
-- ============================================

alter table public.current_events enable row level security;
alter table public.event_concepts enable row level security;
alter table public.event_exams enable row level security;

create policy "Public can read published events"
  on public.current_events for select using (status = 'published');
create policy "Public can read event concepts"
  on public.event_concepts for select using (true);
create policy "Public can read event exams"
  on public.event_exams for select using (true);
