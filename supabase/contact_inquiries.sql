-- Portfolio contact form — run in Supabase SQL Editor (safe to re-run)

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) >= 1),
  email text not null check (position('@' in email) > 1),
  message text not null check (char_length(trim(message)) >= 10),
  form_theme text,
  color_mode text,
  created_at timestamptz not null default now()
);

create index if not exists contact_inquiries_created_at_idx
  on public.contact_inquiries (created_at desc);

alter table public.contact_inquiries enable row level security;

drop policy if exists "contact_inquiries_anon_insert" on public.contact_inquiries;

create policy "contact_inquiries_anon_insert"
  on public.contact_inquiries
  for insert
  to anon, authenticated
  with check (true);

-- Inserts use returning: 'minimal' in the client so anon does not need SELECT.
