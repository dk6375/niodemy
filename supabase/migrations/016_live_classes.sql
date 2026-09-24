-- ============================================
-- Migration 016: Live Classes Schema
-- ============================================
-- For Session 14: Live classes with YouTube streaming + group chat

-- ============================================
-- LIVE CLASSES
-- ============================================

create table if not exists public.live_classes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  teacher_id uuid references public.profiles on delete set null,
  teacher_name text,  -- denormalized for display
  youtube_video_id text,  -- YouTube live stream ID or video ID
  youtube_url text,
  scheduled_at timestamptz,
  duration_minutes int default 60,
  status text default 'scheduled' check (status in ('scheduled', 'live', 'ended', 'cancelled')),
  segment text,  -- school / senior / coaching / etc.
  subject text,
  chat_room_id uuid,  -- link to chat_rooms table
  is_featured boolean default false,
  created_at timestamptz default now()
);

create index idx_live_classes_status on public.live_classes(status);
create index idx_live_classes_scheduled on public.live_classes(scheduled_at);
create index idx_live_classes_slug on public.live_classes(slug);

-- ============================================
-- RLS POLICIES
-- ============================================

alter table public.live_classes enable row level security;

create policy "Public can read live classes"
  on public.live_classes for select using (true);
create policy "Teachers can create live classes"
  on public.live_classes for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('teacher', 'admin')
    )
  );
create policy "Teachers/admins can update live classes"
  on public.live_classes for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('teacher', 'admin')
    )
  );
create policy "Teachers/admins can delete live classes"
  on public.live_classes for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('teacher', 'admin')
    )
  );
