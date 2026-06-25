-- Gyms: optional focus areas (training types offered), e.g. CrossFit, Hyrox.
-- Run in Supabase SQL Editor.

alter table public.gyms
  add column if not exists focus_areas text[] not null default '{}';

comment on column public.gyms.focus_areas is
  'Training focus areas offered at the gym, e.g. CrossFit, Olympic lifting, Hyrox.';
