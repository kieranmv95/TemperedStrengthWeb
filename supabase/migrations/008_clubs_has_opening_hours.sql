-- Clubs: optional opening hours (some clubs have no fixed schedule).
-- Run in Supabase SQL Editor.

alter table public.clubs
  add column if not exists has_opening_hours boolean not null default true;

comment on column public.clubs.has_opening_hours is
  'When false, opening_hours is ignored and omitted from the public app API.';
