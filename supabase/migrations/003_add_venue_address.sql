-- Structured venue address for gyms and clubs (map pin / geocoding later).
-- Run in Supabase SQL Editor.

alter table public.gyms
  add column if not exists address jsonb not null default '{}'::jsonb;

alter table public.clubs
  add column if not exists address jsonb not null default '{}'::jsonb;

comment on column public.gyms.address is
  'Structured address: line1, line2, city, county, postcode, country, latitude, longitude';

comment on column public.clubs.address is
  'Structured address: line1, line2, city, county, postcode, country, latitude, longitude';
