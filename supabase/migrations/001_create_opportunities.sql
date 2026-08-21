create extension if not exists pgcrypto;

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),

  source_id text not null,
  external_id text not null,

  url text not null,
  title text,
  text text not null,
  text_hash text not null,
  author text,

  source_created_at timestamptz,
  fetched_at timestamptz not null default now(),

  requested_service text not null,

  buying_intent text not null,
  service_match text not null,

  score integer not null default 0,
  classification text not null default 'LOW_PRIORITY',

  contactability text not null default 'UNKNOWN',
  verification_status text not null default 'UNVERIFIED',

  duplicate boolean not null default false,
  duplicate_of_id uuid
    references public.opportunities(id),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint opportunities_source_external_unique
    unique (source_id, external_id),

  constraint opportunities_score_range
    check (score >= 0 and score <= 100)
);

create index if not exists opportunities_score_idx
on public.opportunities(score desc);

create index if not exists opportunities_source_idx
on public.opportunities(source_id);

create index if not exists opportunities_classification_idx
on public.opportunities(classification);

create index if not exists opportunities_created_idx
on public.opportunities(source_created_at desc);

create index if not exists opportunities_text_hash_idx
on public.opportunities(text_hash);