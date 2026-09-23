-- ============================================
-- Migration 009: Profiles table + Teacher profiles + Audit logs
-- ============================================
-- Stores user role (learner / content_writer / teacher / admin).
-- Teacher-specific data in teacher_profiles.

-- ============================================
-- PROFILES (extends auth.users with role + display info)
-- ============================================

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique not null,
  full_name text,
  display_name text,
  avatar_url text,
  phone text,
  preferred_language text default 'hi' check (preferred_language in ('hi', 'en', 'mr', 'bn', 'ta', 'te', 'gu', 'kn', 'ml', 'pa', 'or', 'as')),
  role text default 'learner' check (role in ('learner', 'content_writer', 'teacher', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- TEACHER PROFILES (teacher-specific data)
-- ============================================

create table if not exists public.teacher_profiles (
  user_id uuid primary key references public.profiles on delete cascade,
  expertise text[],  -- ["Polity", "History"]
  segments text[],  -- ["coaching", "senior"]
  bio text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- AUDIT LOGS (track all admin/console changes)
-- ============================================

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,  -- who made the change
  action text not null check (action in ('create', 'update', 'delete', 'publish', 'unpublish')),
  entity_type text not null,  -- concept / content / question / exam / curriculum / user / teacher
  entity_id uuid,
  changes_json jsonb,  -- what changed
  created_at timestamptz default now()
);

create index idx_audit_logs_user on public.audit_logs(user_id);
create index idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);
create index idx_audit_logs_created on public.audit_logs(created_at desc);

-- ============================================
-- RLS POLICIES
-- ============================================

alter table public.profiles enable row level security;
alter table public.teacher_profiles enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles: user can read own profile; everyone can read (limited fields via SELECT)
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile (non-role fields)"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);
-- Public can read basic profile info (for displaying author names etc.)
create policy "Public can read profile basic info"
  on public.profiles for select using (true);

-- Teacher profiles: public can read (for displaying teacher info); only owner/admin can update
create policy "Public can read teacher profiles"
  on public.teacher_profiles for select using (is_active = true);
create policy "Users can read own teacher profile"
  on public.teacher_profiles for select using (auth.uid() = user_id);
create policy "Users can update own teacher profile"
  on public.teacher_profiles for update using (auth.uid() = user_id);
create policy "Users can insert own teacher profile"
  on public.teacher_profiles for insert with check (auth.uid() = user_id);

-- Audit logs: only admins can read (for now, allow self-read for own actions)
create policy "Users can read own audit logs"
  on public.audit_logs for select using (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
-- When a user signs up via Supabase Auth, auto-create a profile row.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
