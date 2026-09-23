-- ============================================
-- Migration 010: Chat Schema (Unified Chat System)
-- ============================================
-- ONE schema for all chat contexts: chapter doubt, live class, AI tutor, QNA.
-- chat_rooms: room metadata (type, context)
-- chat_messages: messages (sender_type: user/teacher/ai/system)

-- ============================================
-- CHAT ROOMS
-- ============================================

create table if not exists public.chat_rooms (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('chapter_doubt', 'live_class', 'ai_tutor', 'qna')),
  context_type text,  -- concept / content / live_class / none
  context_id uuid,  -- concept_id / content_id / live_class_id (polymorphic)
  title text,
  created_by uuid,  -- who created the room (optional)
  created_at timestamptz default now()
);

create index idx_chat_rooms_type on public.chat_rooms(type);
create index idx_chat_rooms_context on public.chat_rooms(context_type, context_id);

-- ============================================
-- CHAT MESSAGES
-- ============================================

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.chat_rooms on delete cascade,
  user_id uuid,  -- null if AI/system
  sender_type text not null check (sender_type in ('user', 'teacher', 'ai', 'system')),
  sender_name text,  -- denormalized for fast display
  body text not null,
  reply_to uuid references public.chat_messages on delete set null,  -- threaded replies
  is_pinned boolean default false,
  is_best_answer boolean default false,
  upvotes int default 0,
  ai_metadata jsonb,  -- { model, prompt, thinking } for AI messages
  created_at timestamptz default now()
);

create index idx_chat_messages_room on public.chat_messages(room_id);
create index idx_chat_messages_created on public.chat_messages(created_at);
create index idx_chat_messages_reply on public.chat_messages(reply_to);
create index idx_chat_messages_best on public.chat_messages(is_best_answer) where is_best_answer = true;

-- ============================================
-- MESSAGE REACTIONS (emoji)
-- ============================================

create table if not exists public.chat_reactions (
  message_id uuid references public.chat_messages on delete cascade,
  user_id uuid,
  reaction text not null,  -- emoji or type
  created_at timestamptz default now(),
  primary key (message_id, user_id, reaction)
);

create index idx_chat_reactions_message on public.chat_reactions(message_id);

-- ============================================
-- RLS POLICIES
-- ============================================

alter table public.chat_rooms enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_reactions enable row level security;

-- Chat rooms: public read (anyone in a room can see it)
create policy "Public can read chat rooms"
  on public.chat_rooms for select using (true);
create policy "Authenticated can create chat rooms"
  on public.chat_rooms for insert with check (auth.uid() is not null);

-- Chat messages: public read (anyone can browse doubts), authenticated can post
create policy "Public can read chat messages"
  on public.chat_messages for select using (true);
create policy "Authenticated can post messages"
  on public.chat_messages for insert with check (auth.uid() is not null or sender_type in ('ai', 'system'));
create policy "Users can update own messages"
  on public.chat_messages for update using (auth.uid() = user_id);
create policy "Teachers/admins can pin/best-answer"
  on public.chat_messages for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('teacher', 'admin')
    )
  );
create policy "Users can delete own messages"
  on public.chat_messages for delete using (auth.uid() = user_id);

-- Reactions: authenticated can add/remove own reactions
create policy "Authenticated can read reactions"
  on public.chat_reactions for select using (true);
create policy "Authenticated can add reactions"
  on public.chat_reactions for insert with check (auth.uid() = user_id);
create policy "Users can delete own reactions"
  on public.chat_reactions for delete using (auth.uid() = user_id);

-- ============================================
-- HELPER: Get or create room for a context
-- ============================================
create or replace function public.get_or_create_room(
  p_type text,
  p_context_type text default null,
  p_context_id uuid default null,
  p_title text default null
) returns uuid as $$
declare
  v_room_id uuid;
begin
  select id into v_room_id
  from public.chat_rooms
  where type = p_type
    and ((p_context_type is null and context_type is null) or context_type = p_context_type)
    and ((p_context_id is null and context_id is null) or context_id = p_context_id)
  limit 1;

  if v_room_id is null then
    insert into public.chat_rooms (type, context_type, context_id, title)
    values (p_type, p_context_type, p_context_id, p_title)
    returning id into v_room_id;
  end if;

  return v_room_id;
end;
$$ language plpgsql security definer;
