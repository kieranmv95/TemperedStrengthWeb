-- Coaches: specialties (text array) and approximate service radius.
-- Run in Supabase SQL Editor.

alter table public.coaches
  add column if not exists specialties text[] not null default '{}';

alter table public.coaches
  add column if not exists radius_served_km numeric(6, 1);

comment on column public.coaches.specialties is
  'Coach specialties, e.g. powerlifting, nutrition coaching.';

comment on column public.coaches.radius_served_km is
  'Approximate service radius in kilometres from their base address.';
