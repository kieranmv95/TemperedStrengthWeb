-- Coaches: migrate legacy text location to address jsonb, then drop location column.
-- Run in Supabase SQL Editor after address column exists on coaches.

-- Copy plain-text location into address.line1 where address is empty
update public.coaches
set address = jsonb_build_object(
  'line1', location,
  'line2', null,
  'city', '',
  'county', null,
  'postcode', '',
  'country', 'GB',
  'latitude', null,
  'longitude', null
)
where coalesce(location, '') <> ''
  and (address = '{}'::jsonb or address is null);

alter table public.coaches
  drop column if exists location;

comment on column public.coaches.address is
  'Structured address: line1, line2, city, county, postcode, country, latitude, longitude';
