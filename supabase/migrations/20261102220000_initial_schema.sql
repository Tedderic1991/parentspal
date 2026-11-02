create table public.venues (
  id text primary key,
  name text not null,
  area text not null,
  price_cents integer not null check (price_cents >= 0),
  icon text not null,
  min_age integer not null check (min_age between 0 and 17),
  max_age integer not null check (max_age between min_age and 17),
  description text not null,
  pass_window text not null,
  surcharge_cents integer not null default 0 check (surcharge_cents >= 0),
  walk_in boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now()
);

create table public.passes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  purchased_at timestamptz not null default now(),
  adults integer not null check (adults between 0 and 8),
  child_ages integer[] not null default '{}',
  gift boolean not null default false,
  total_cents integer not null check (total_cents >= 0),
  currency text not null default 'CAD' check (currency = 'CAD'),
  status text not null default 'active' check (status in ('active', 'refunded')),
  unique (id, owner_id),
  check (cardinality(child_ages) <= 8),
  check (0 <= all(child_ages) and 17 >= all(child_ages)),
  check (array_position(child_ages, null) is null),
  check (adults + cardinality(child_ages) > 0)
);

create table public.pass_admissions (
  pass_id uuid not null references public.passes(id) on delete cascade,
  venue_id text not null references public.venues(id),
  quantity integer not null check (quantity between 1 and 99),
  redeemed integer not null default 0 check (redeemed >= 0 and redeemed <= quantity),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  primary key (pass_id, venue_id)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  pass_id uuid not null,
  owner_id uuid not null,
  venue_id text not null,
  visit_date date not null,
  slot text not null,
  surcharge_cents integer not null default 0 check (surcharge_cents >= 0),
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  foreign key (pass_id, owner_id) references public.passes(id, owner_id) on delete cascade,
  foreign key (pass_id, venue_id) references public.pass_admissions(pass_id, venue_id) on delete cascade
);

create index passes_owner_id_idx on public.passes(owner_id);
create index bookings_owner_id_idx on public.bookings(owner_id);
create index bookings_admission_idx on public.bookings(pass_id, venue_id);
create index pass_admissions_venue_id_idx on public.pass_admissions(venue_id);

alter table public.venues enable row level security;
alter table public.profiles enable row level security;
alter table public.passes enable row level security;
alter table public.pass_admissions enable row level security;
alter table public.bookings enable row level security;

revoke all on public.venues, public.profiles, public.passes,
  public.pass_admissions, public.bookings from anon, authenticated;
grant select on public.venues to anon, authenticated;
grant select on public.profiles, public.passes, public.pass_admissions,
  public.bookings to authenticated;
grant all on public.venues, public.profiles, public.passes,
  public.pass_admissions, public.bookings to service_role;

create policy "Published venues are public" on public.venues
  for select to anon, authenticated using (published = true);

create policy "Owners can read their profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy "Owners can read their passes" on public.passes
  for select to authenticated using ((select auth.uid()) = owner_id);

create policy "Owners can read their admissions" on public.pass_admissions
  for select to authenticated using (
    exists (
      select 1 from public.passes
      where passes.id = pass_admissions.pass_id
        and passes.owner_id = (select auth.uid())
    )
  );

create policy "Owners can read their bookings" on public.bookings
  for select to authenticated using ((select auth.uid()) = owner_id);

-- Purchases, pricing, and redemption must go through a trusted backend transaction.
-- Client writes remain denied until authenticated, payment-verified APIs exist.
