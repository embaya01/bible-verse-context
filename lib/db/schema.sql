-- Run this in the Supabase SQL editor to create the MVP cache table.

create table if not exists public.chapter_context (
  id              uuid primary key default gen_random_uuid(),
  book            text not null,
  chapter         int  not null,
  payload         jsonb not null,
  model           text not null,
  prompt_version  int  not null,
  generated_at    timestamptz not null default now(),
  unique (book, chapter, prompt_version)
);

create index if not exists chapter_context_lookup
  on public.chapter_context (book, chapter, prompt_version);

-- Lock the table down: only the service role (server-side) reads or writes.
alter table public.chapter_context enable row level security;
-- No policies are added on purpose. The service role bypasses RLS; anon/authenticated cannot touch this table directly.
