-- Dedicated optional map marker for partner listings.
-- Stored separately from address jsonb: { "latitude": number, "longitude": number }
-- Run in Supabase SQL Editor (or via supabase db push).

alter table public.gyms
  add column if not exists map_marker jsonb;

alter table public.clubs
  add column if not exists map_marker jsonb;

alter table public.coaches
  add column if not exists map_marker jsonb;

comment on column public.gyms.map_marker is
  'Optional exact map pin: { "latitude": number, "longitude": number }. App falls back to address postcode centre when null.';

comment on column public.clubs.map_marker is
  'Optional exact map pin: { "latitude": number, "longitude": number }. App falls back to address postcode centre when null.';

comment on column public.coaches.map_marker is
  'Optional exact map pin: { "latitude": number, "longitude": number }. App falls back to address postcode centre when null.';

-- Migrate any legacy pin coordinates stored inside address jsonb.
update public.gyms
set map_marker = jsonb_build_object(
  'latitude', (address->>'map_latitude')::double precision,
  'longitude', (address->>'map_longitude')::double precision
)
where map_marker is null
  and address ? 'map_latitude'
  and address ? 'map_longitude'
  and (address->>'map_latitude') ~ '^-?[0-9]+(\.[0-9]+)?$'
  and (address->>'map_longitude') ~ '^-?[0-9]+(\.[0-9]+)?$';

update public.clubs
set map_marker = jsonb_build_object(
  'latitude', (address->>'map_latitude')::double precision,
  'longitude', (address->>'map_longitude')::double precision
)
where map_marker is null
  and address ? 'map_latitude'
  and address ? 'map_longitude'
  and (address->>'map_latitude') ~ '^-?[0-9]+(\.[0-9]+)?$'
  and (address->>'map_longitude') ~ '^-?[0-9]+(\.[0-9]+)?$';

update public.coaches
set map_marker = jsonb_build_object(
  'latitude', (address->>'map_latitude')::double precision,
  'longitude', (address->>'map_longitude')::double precision
)
where map_marker is null
  and address ? 'map_latitude'
  and address ? 'map_longitude'
  and (address->>'map_latitude') ~ '^-?[0-9]+(\.[0-9]+)?$'
  and (address->>'map_longitude') ~ '^-?[0-9]+(\.[0-9]+)?$';

update public.gyms
set address = address - 'map_latitude' - 'map_longitude'
where address ? 'map_latitude' or address ? 'map_longitude';

update public.clubs
set address = address - 'map_latitude' - 'map_longitude'
where address ? 'map_latitude' or address ? 'map_longitude';

update public.coaches
set address = address - 'map_latitude' - 'map_longitude'
where address ? 'map_latitude' or address ? 'map_longitude';

comment on column public.gyms.address is
  'Structured address: line1, line2, city, county, postcode, country, latitude, longitude (postcode fallback)';

comment on column public.clubs.address is
  'Structured address: line1, line2, city, county, postcode, country, latitude, longitude (postcode fallback)';

comment on column public.coaches.address is
  'Structured address: line1, line2, city, county, postcode, country, latitude, longitude (postcode fallback)';
