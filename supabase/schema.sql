-- ============================================================
-- Rival Crowdfunding — Supabase schema
-- Run this in the Supabase SQL Editor on a fresh project.
-- Derived from src/types/database.types.ts + the API routes.
-- ============================================================

create extension if not exists "pgcrypto";

-- ── site_settings ───────────────────────────────────────────
-- Single-row table holding the numbers the landing-page progress bar
-- shows. Both are edited by hand from /admin (they are not derived from
-- the donations table, so the team can publish a figure that includes
-- offline/cash contributions).
-- The `check (id = 1)` keeps it a singleton: there can only ever be one row.
create table if not exists public.site_settings (
  id             smallint primary key default 1 check (id = 1),
  current_amount numeric not null default 0        check (current_amount >= 0),
  goal_amount    numeric not null default 50000000 check (goal_amount > 0),
  updated_at     timestamptz not null default now()
);

-- Seed the one row with the values that used to be hard-coded in src/app/page.tsx.
insert into public.site_settings (id, current_amount, goal_amount)
values (1, 3100000, 50000000)
on conflict (id) do nothing;

-- ── campaigns ───────────────────────────────────────────────
create table if not exists public.campaigns (
  id             uuid primary key default gen_random_uuid(),
  creator_id     uuid not null references auth.users (id) on delete cascade,
  title          text not null,
  description    text,
  goal_amount    numeric not null check (goal_amount > 0),
  current_amount numeric default 0,
  end_date       timestamptz,
  status         text default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_at     timestamptz default now()
);

create index if not exists campaigns_status_created_at_idx
  on public.campaigns (status, created_at desc);

-- ── donation_packages ───────────────────────────────────────
create table if not exists public.donation_packages (
  id          uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns (id) on delete cascade,
  name        text not null,
  amount      numeric not null check (amount > 0),
  description text,
  created_at  timestamptz default now()
);

create index if not exists donation_packages_campaign_id_idx
  on public.donation_packages (campaign_id);

-- ── donations ───────────────────────────────────────────────
-- Payment flow is manual: the donor scans the static QRIS code, uploads a
-- transfer proof, and an admin flips payment_status after verifying it.
create table if not exists public.donations (
  id              uuid primary key default gen_random_uuid(),
  campaign_id     uuid references public.campaigns (id) on delete set null,
  package_id      uuid references public.donation_packages (id) on delete set null,
  donor_name      text not null,
  donor_email     text not null,
  donor_phone     text not null,
  donor_address   text not null,
  donor_gender    text check (donor_gender in ('male', 'female', 'other')),
  amount          numeric not null check (amount >= 5000),
  payment_status  text default 'pending' check (payment_status in ('pending', 'success', 'failed')),
  invoice_number  text not null unique,   -- DON-XXXX-XXXX, also the storage folder name
  created_at      timestamptz default now()
);

create index if not exists donations_campaign_id_idx on public.donations (campaign_id);
create index if not exists donations_created_at_idx  on public.donations (created_at desc);

-- ── keep campaigns.current_amount in sync (optional) ────────
create or replace function public.sync_campaign_current_amount()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.campaigns c
  set current_amount = (
    select coalesce(sum(d.amount), 0)
    from public.donations d
    where d.campaign_id = c.id
      and d.payment_status = 'success'
  )
  where c.id = coalesce(new.campaign_id, old.campaign_id);
  return null;
end;
$$;

drop trigger if exists donations_sync_campaign_amount on public.donations;
create trigger donations_sync_campaign_amount
  after insert or update or delete on public.donations
  for each row execute function public.sync_campaign_current_amount();

-- ============================================================
-- Row Level Security
-- These policies match what the code does TODAY (server routes
-- use the anon key + user cookies, not the service role).
-- See the note at the bottom before going to production.
-- ============================================================

alter table public.campaigns         enable row level security;
alter table public.donation_packages enable row level security;
alter table public.donations         enable row level security;
alter table public.site_settings     enable row level security;

-- Site settings: world-readable (the landing page renders them), but no
-- INSERT/UPDATE/DELETE policy — writes go through /api/settings, which uses
-- the service role key and therefore bypasses RLS.
drop policy if exists "site settings readable by anyone" on public.site_settings;
create policy "site settings readable by anyone"
  on public.site_settings for select using (true);

-- Campaigns & packages: public read, owner-only write
drop policy if exists "campaigns readable by anyone" on public.campaigns;
create policy "campaigns readable by anyone"
  on public.campaigns for select using (true);

drop policy if exists "campaigns writable by creator" on public.campaigns;
create policy "campaigns writable by creator"
  on public.campaigns for all
  using (auth.uid() = creator_id)
  with check (auth.uid() = creator_id);

drop policy if exists "packages readable by anyone" on public.donation_packages;
create policy "packages readable by anyone"
  on public.donation_packages for select using (true);

drop policy if exists "packages writable by campaign owner" on public.donation_packages;
create policy "packages writable by campaign owner"
  on public.donation_packages for all
  using (
    exists (
      select 1 from public.campaigns c
      where c.id = donation_packages.campaign_id and c.creator_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.campaigns c
      where c.id = donation_packages.campaign_id and c.creator_id = auth.uid()
    )
  );

-- Donations: anyone can create one (public donation form)
drop policy if exists "anyone can create a donation" on public.donations;
create policy "anyone can create a donation"
  on public.donations for insert with check (true);

-- Required by /api/donations/status (polling) and /admin (listing).
-- WARNING: this exposes donor PII to anyone with the anon key. Read the note below.
drop policy if exists "donations readable" on public.donations;
create policy "donations readable"
  on public.donations for select using (true);

-- No UPDATE policy on purpose: nothing in the app updates a donation.
-- Confirming a payment is done from the Supabase dashboard (or any
-- service-role client), both of which bypass RLS.

-- ============================================================
-- Storage: transfer proofs (src/app/api/donations/proof/route.ts)
-- Bucket must be PRIVATE — the route hands out signed URLs.
-- Files are stored at <invoice_number>/<timestamp>-<uuid>.<ext>
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'transfer-proofs',
  'transfer-proofs',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'application/pdf']
)
on conflict (id) do nothing;

-- No storage policies needed: that route uses SUPABASE_SERVICE_ROLE_KEY,
-- which bypasses RLS. Do not make this bucket public.

-- ============================================================
-- SECURITY NOTE
-- "donations readable" is wide open because /admin and
-- /api/donations/status both query Supabase with the anon key.
-- Anyone holding NEXT_PUBLIC_SUPABASE_ANON_KEY (it ships to the browser)
-- can then read every donor's name, email, phone and address.
--
-- To harden: have /admin and /api/donations/status use a service-role
-- client (same helper as proof/route.ts), gate /admin behind an auth
-- check, then replace the policy above with:
--
--   create policy "donations readable by campaign owner"
--     on public.donations for select using (
--       exists (select 1 from public.campaigns c
--               where c.id = donations.campaign_id and c.creator_id = auth.uid())
--     );
-- ============================================================
