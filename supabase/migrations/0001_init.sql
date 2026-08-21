-- BuyerFinder AI — initial schema
-- Run via `supabase db push` or paste into the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ── sources ──────────────────────────────────────────────────────
create table if not exists sources (
  id text primary key,
  display_name text not null,
  enabled boolean not null default true,
  last_health_check_at timestamptz,
  last_health_ok boolean,
  created_at timestamptz not null default now()
);

-- ── search_runs ──────────────────────────────────────────────────
create table if not exists search_runs (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references sources(id),
  query text not null,
  triggered_by text not null default 'manual',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  candidates_found integer not null default 0,
  qualified_count integer not null default 0,
  rejected_count integer not null default 0,
  errors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_search_runs_source on search_runs(source_id);
create index if not exists idx_search_runs_started_at on search_runs(started_at desc);

-- ── opportunities ────────────────────────────────────────────────
create table if not exists opportunities (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references sources(id),
  search_run_id uuid references search_runs(id),

  external_id text not null,
  original_url text not null,
  text_hash text not null,

  buyer_classification text not null check (buyer_classification in ('CLEAN','NOISY','UNCLEAR')),
  buyer_intent text not null check (buyer_intent in ('VERY_HIGH','HIGH','MEDIUM','LOW','UNCLEAR')),

  buyer_name text not null default 'Not provided',
  buyer_place text not null default 'Not provided',
  buyer_whatsapp text not null default 'Not provided',
  buyer_phone text not null default 'Not provided',
  buyer_email text not null default 'Not provided',
  buyer_location text not null default 'Not provided',
  buyer_business text not null default 'Not provided',

  budget text not null default 'Not provided',
  service text not null default 'Unclear',
  opportunity_summary text not null default 'Unclear',
  why text not null default '',
  buying_signal_quote text not null default 'Not provided',

  freshness_level text not null check (freshness_level in ('FRESH','RECENT','STALE','UNCLEAR')),
  freshness_days_old integer,

  score_buying_intent integer not null,
  score_service_match integer not null,
  score_budget_evidence integer not null,
  score_urgency_freshness integer not null,
  score_contactability integer not null,
  score_business_value integer not null,
  score_total integer not null check (score_total between 0 and 100),
  score_label text not null check (score_label in ('HOT','HIGH','MEDIUM','LOW','REJECT')),

  icebreaker text,

  duplicate_of_id uuid references opportunities(id),

  posted_at timestamptz,
  detected_at timestamptz not null default now(),
  processed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_opportunities_source_external
  on opportunities(source_id, external_id);
create index if not exists idx_opportunities_text_hash on opportunities(text_hash);
create index if not exists idx_opportunities_score on opportunities(score_total desc);
create index if not exists idx_opportunities_label on opportunities(score_label);
create index if not exists idx_opportunities_detected_at on opportunities(detected_at desc);

-- ── rejected_leads ───────────────────────────────────────────────
create table if not exists rejected_leads (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references sources(id),
  search_run_id uuid references search_runs(id),

  external_id text not null,
  original_url text not null,
  title text,
  extracted_text text not null,
  text_hash text not null,

  buyer_classification text not null check (buyer_classification in ('CLEAN','NOISY','UNCLEAR')),
  score_total integer not null check (score_total between 0 and 100),
  rejection_reason text not null,

  detected_at timestamptz not null default now(),
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_rejected_source_external
  on rejected_leads(source_id, external_id);
create index if not exists idx_rejected_text_hash on rejected_leads(text_hash);

-- ── users ────────────────────────────────────────────────────────
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- ── saved_opportunities ──────────────────────────────────────────
create table if not exists saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  unique(user_id, opportunity_id)
);

create index if not exists idx_saved_opps_user on saved_opportunities(user_id);

-- ── updated_at trigger for opportunities ────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_opportunities_updated_at on opportunities;
create trigger trg_opportunities_updated_at
  before update on opportunities
  for each row execute function set_updated_at();

-- ── Row Level Security ───────────────────────────────────────────
alter table opportunities enable row level security;
alter table rejected_leads enable row level security;
alter table sources enable row level security;
alter table search_runs enable row level security;
alter table users enable row level security;
alter table saved_opportunities enable row level security;

create policy "authenticated users can read opportunities"
  on opportunities for select
  to authenticated
  using (true);

create policy "authenticated users can read rejected leads"
  on rejected_leads for select
  to authenticated
  using (true);

create policy "authenticated users can read sources"
  on sources for select
  to authenticated
  using (true);

create policy "authenticated users can read search runs"
  on search_runs for select
  to authenticated
  using (true);

create policy "users can read their own row"
  on users for select
  to authenticated
  using (id = auth.uid());

create policy "users can read their own saved opportunities"
  on saved_opportunities for select
  to authenticated
  using (user_id = auth.uid());

create policy "users can insert their own saved opportunities"
  on saved_opportunities for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "users can delete their own saved opportunities"
  on saved_opportunities for delete
  to authenticated
  using (user_id = auth.uid());

-- Seed the Phase-1 source.
insert into sources (id, display_name)
values ('reddit', 'Reddit')
on conflict (id) do nothing;
