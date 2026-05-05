-- =====================================
-- EXTENSION
-- =====================================
create extension if not exists "pgcrypto";

-- =====================================
-- TABLE A: PROFILES (Users)
-- =====================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  id_card_url text,
  role text default 'user' check (role in ('user','admin')),
  created_at timestamp default now()
);

-- =====================================
-- TABLE B: PROPERTIES (Real estate)
-- =====================================
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  title text,
  description text,
  type text check (type in ('apartment','villa','studio')),
  wilaya text,
  status text check (status in ('rent','sale')),
  price numeric,
  area numeric,
  rooms integer,
  address text,
  location jsonb,
  images text[],
  property_docs text[],
  created_at timestamp default now()
);

-- =====================================
-- TABLE C: VISITS (Reservations)
-- =====================================
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  property_id uuid references public.properties(id) on delete cascade,
  visit_date date,
  visit_time time,
  status text default 'pending' check (status in ('pending','accepted','rejected')),
  id_card_url text,
  created_at timestamp default now()
);

-- =====================================
-- INDEXES
-- =====================================
create index if not exists idx_properties_owner on public.properties(owner_id);
create index if not exists idx_visits_user on public.visits(user_id);
create index if not exists idx_visits_property on public.visits(property_id);

-- =====================================
-- RLS ENABLE
-- =====================================
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.visits enable row level security;

-- =====================================
-- PROFILES POLICIES
-- =====================================

create policy "User view own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "User update own profile"
on public.profiles
for update
using (auth.uid() = id);

create policy "Profiles visible by uid" on public.profiles
for select using (true);

-- =====================================
-- PROPERTIES POLICIES
-- =====================================

create policy "Anyone view properties"
on public.properties
for select
using (true);

create policy "Owner can insert property"
on public.properties
for insert
with check (auth.uid() = owner_id);

create policy "Owner can update property"
on public.properties
for update
using (auth.uid() = owner_id);

create policy "Owner can delete property"
on public.properties
for delete
using (auth.uid() = owner_id);

-- =====================================
-- VISITS POLICIES
-- =====================================

create policy "User view own visits"
on public.visits
for select
using (auth.uid() = user_id);

create policy "User create visit"
on public.visits
for insert
with check (auth.uid() = user_id);

create policy "User update own visits"
on public.visits
for update
using (auth.uid() = user_id);

-- =====================================
-- ADMIN POLICIES
-- =====================================

create policy "Admin view all"
on public.properties
for select
using (auth.jwt() ->> 'role' = 'admin');

-- =====================================
-- DONE
-- =====================================
