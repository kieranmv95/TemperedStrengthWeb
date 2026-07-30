-- Optional free-text contact for competition entries (phone, email, Instagram, etc.).
-- Admin-only; not exposed via the live-competition mobile API.
-- Run in Supabase SQL Editor (or via supabase db push).

alter table public.competition_entry
  add column if not exists contact text;

comment on column public.competition_entry.contact is
  'Optional free-text contact method (phone, email, Instagram handle, etc.). Admin-only.';
