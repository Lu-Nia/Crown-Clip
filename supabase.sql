create extension if not exists pgcrypto;
create extension if not exists btree_gist;

drop table if exists public.bookings cascade;
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  service_id text not null,
  service_name text not null,
  barber_id text not null,
  booking_date date not null,
  time time not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  notes text default '',
  status text not null default 'confirmed' check (status in ('confirmed','cancelled')),
  created_at timestamptz not null default now(),
  check (end_at > start_at)
);

-- Prevents overlapping appointments for the same barber, including different service durations.
alter table public.bookings add constraint bookings_no_overlaps
exclude using gist (
  barber_id with =,
  tstzrange(start_at, end_at, '[)') with &&
) where (status = 'confirmed');

create index bookings_date_barber_idx on public.bookings (booking_date, barber_id);
alter table public.bookings enable row level security;
