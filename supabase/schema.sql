create extension if not exists "pgcrypto";

create table if not exists public.homebrew_kill_teams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  name text not null,
  killteam_id text,
  faction_id text,
  archetypes text default '',
  description text default '',
  faction_rule_name text default 'Faction rules',
  faction_rule text default '',
  special_issue_ammunition text default '',
  ploys jsonb not null default '[]'::jsonb,
  roster_note text default '',
  image_url text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table if not exists public.homebrew_operatives (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.homebrew_kill_teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  op_type_id text,
  name text not null,
  category text not null default 'po',
  card_type text not null default 'custom',
  role text default '',
  points integer default 0,
  apl integer default 2,
  move text default '6"',
  save text default '4+',
  wounds integer default 8,
  keywords text default '',
  weapons jsonb not null default '[]'::jsonb,
  abilities text default '',
  notes text default '',
  level integer default 1,
  ability_scores jsonb not null default '{"strength":10,"dexterity":10,"constitution":10,"intelligence":10,"wisdom":10,"charisma":10}'::jsonb,
  image_url text default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.homebrew_kill_teams enable row level security;
alter table public.homebrew_operatives enable row level security;

drop policy if exists "own_teams_select" on public.homebrew_kill_teams;
drop policy if exists "own_teams_insert" on public.homebrew_kill_teams;
drop policy if exists "own_teams_update" on public.homebrew_kill_teams;
drop policy if exists "own_teams_delete" on public.homebrew_kill_teams;

create policy "own_teams_select"
  on public.homebrew_kill_teams for select
  using (auth.uid() = user_id);

create policy "own_teams_insert"
  on public.homebrew_kill_teams for insert
  with check (auth.uid() = user_id);

create policy "own_teams_update"
  on public.homebrew_kill_teams for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own_teams_delete"
  on public.homebrew_kill_teams for delete
  using (auth.uid() = user_id);

drop policy if exists "own_ops_select" on public.homebrew_operatives;
drop policy if exists "own_ops_insert" on public.homebrew_operatives;
drop policy if exists "own_ops_update" on public.homebrew_operatives;
drop policy if exists "own_ops_delete" on public.homebrew_operatives;

create policy "own_ops_select"
  on public.homebrew_operatives for select
  using (auth.uid() = user_id);

create policy "own_ops_insert"
  on public.homebrew_operatives for insert
  with check (auth.uid() = user_id);

create policy "own_ops_update"
  on public.homebrew_operatives for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own_ops_delete"
  on public.homebrew_operatives for delete
  using (auth.uid() = user_id);

-- Homebrew team banner images (run once in Supabase SQL editor if upgrading an existing project)
alter table public.homebrew_kill_teams add column if not exists image_url text default '';

alter table public.homebrew_operatives add column if not exists level integer default 1;
alter table public.homebrew_operatives add column if not exists ability_scores jsonb default '{"strength":10,"dexterity":10,"constitution":10,"intelligence":10,"wisdom":10,"charisma":10}'::jsonb;
alter table public.homebrew_operatives add column if not exists image_url text default '';

-- Allow operatives without a kill team assignment (assign later from the registry editor)
alter table public.homebrew_operatives alter column team_id drop not null;

-- Blackshield campaign character profile (party roster)
alter table public.homebrew_operatives add column if not exists is_blackshield boolean not null default false;
alter table public.homebrew_operatives add column if not exists former_chapter text default '';
alter table public.homebrew_operatives add column if not exists home_planet text default '';
alter table public.homebrew_operatives add column if not exists backstory text default '';

insert into storage.buckets (id, name, public)
values ('homebrew-team-images', 'homebrew-team-images', true)
on conflict (id) do nothing;

drop policy if exists "homebrew_images_public_read" on storage.objects;
drop policy if exists "homebrew_images_own_insert" on storage.objects;
drop policy if exists "homebrew_images_own_update" on storage.objects;
drop policy if exists "homebrew_images_own_delete" on storage.objects;

create policy "homebrew_images_public_read"
  on storage.objects for select
  using (bucket_id = 'homebrew-team-images');

create policy "homebrew_images_own_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'homebrew-team-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "homebrew_images_own_update"
  on storage.objects for update
  using (
    bucket_id = 'homebrew-team-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "homebrew_images_own_delete"
  on storage.objects for delete
  using (
    bucket_id = 'homebrew-team-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

