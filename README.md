# Dar-Connect

Dar-Connect is a React + Supabase starter for rental and sale listings (bilingual AR/EN).

Setup
- Copy `.env.example` to `.env` and fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Install: `npm install`
- Run: `npm run dev`

Project structure
- `src/components` UI pieces
- `src/pages` App pages
- `src/services/supabaseClient.js` Supabase client

Supabase schema (SQL) — create tables and storage buckets

-- Table: properties
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  type text,
  state text,
  status text,
  price numeric,
  rooms int,
  location jsonb,
  images text[],
  owner_name text,
  owner_contact text
);

-- Table: visits
create table public.visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  property_id uuid references public.properties(id),
  date timestamptz,
  status text,
  id_card_url text
);

Storage buckets:
- `documents` (for ID card uploads and ownership docs)
- `property-images` (for images)

Row Level Security (RLS) — examples

-- Enable RLS on visits and policies so users only see their visits:
alter table public.visits enable row level security;

create policy "visits_owner_only" on public.visits
  for select using ( auth.uid() = user_id );

create policy "visits_insert" on public.visits
  for insert with check ( auth.uid() = user_id );

-- Properties management: only admin can manage properties. Use a simple admin email check in RLS or use a `roles` table.
alter table public.properties enable row level security;

-- Example policy allowing only service_role or admin user (replace email check as desired):
create policy "admin_manage" on public.properties
  for all using ( current_setting('request.jwt.claims','true')::json->>'email' = 'admin@example.com' ) with check ( current_setting('request.jwt.claims','true')::json->>'email' = 'admin@example.com' );

Notes
- This repo is scaffolded for Vercel + Supabase. Add proper RLS and policies in Supabase dashboard.
- Frontend expects buckets `documents` and `property-images` to be created and have public access or signed URL usage.
