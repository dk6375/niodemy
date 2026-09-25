-- ============================================
-- Migration 014: ITI Schema (Trades, Modules, Tools)
-- ============================================
-- For Session 12: ITI segment — trade-based vocational learning

-- ============================================
-- TRADES (Electrician, Fitter, Welder, COPA, etc.)
-- ============================================

create table if not exists public.iti_trades (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,  -- "Electrician"
  code text,  -- "ELE" / NCO code
  duration_years int default 2,  -- 1 or 2 years
  nco_code text,  -- National Classification of Occupations code
  description text,
  career_opportunities text,  -- job roles after completion
  seo_json jsonb,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now()
);

create index idx_iti_trades_slug on public.iti_trades(slug);

-- ============================================
-- ITI MODULES (per trade, per semester)
-- ============================================

create table if not exists public.iti_modules (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid references public.iti_trades on delete cascade,
  semester_number int not null,  -- 1, 2, 3, 4
  module_number int not null,
  title text not null,
  slug text not null,
  description text,
  module_type text default 'theory' check (module_type in ('theory', 'practical', 'workshop', 'safety', 'project')),
  duration_hours int,  -- total hours for this module
  concept_ids uuid[],  -- linked concepts
  created_at timestamptz default now(),
  unique (trade_id, semester_number, module_number)
);

create index idx_iti_modules_trade on public.iti_modules(trade_id);

-- ============================================
-- RLS POLICIES
-- ============================================

alter table public.iti_trades enable row level security;
alter table public.iti_modules enable row level security;

create policy "Public can read active trades"
  on public.iti_trades for select using (status = 'active');
create policy "Public can read ITI modules"
  on public.iti_modules for select using (true);
