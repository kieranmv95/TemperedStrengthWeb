-- Partner listings: optional public contact email and phone.
-- Run in Supabase SQL Editor (or via supabase db push).

alter table public.gyms
  add column if not exists email text,
  add column if not exists phone text;

alter table public.clubs
  add column if not exists email text,
  add column if not exists phone text;

alter table public.coaches
  add column if not exists email text,
  add column if not exists phone text;

comment on column public.gyms.email is 'Optional public contact email.';
comment on column public.gyms.phone is 'Optional public contact phone number.';
comment on column public.clubs.email is 'Optional public contact email.';
comment on column public.clubs.phone is 'Optional public contact phone number.';
comment on column public.coaches.email is 'Optional public contact email.';
comment on column public.coaches.phone is 'Optional public contact phone number.';
