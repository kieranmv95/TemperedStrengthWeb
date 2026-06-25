-- Clubs & coaches: option to hide location from the public app.
-- Run in Supabase SQL Editor.

alter table public.clubs
  add column if not exists hide_location boolean not null default false;

alter table public.coaches
  add column if not exists hide_location boolean not null default false;

comment on column public.clubs.hide_location is
  'When true, address and coordinates are hidden from the public app API.';

comment on column public.coaches.hide_location is
  'When true, address and coordinates are hidden from the public app API.';
