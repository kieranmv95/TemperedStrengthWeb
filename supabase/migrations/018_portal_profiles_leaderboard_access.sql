-- Add LEADERBOARD_ACCESS portal role for event staff.
-- They can log into the portal, open Admin, and manage live competition
-- entries. They cannot edit competition details, partner review, or promo codes.
-- Set via service role / SQL only, e.g.:
--   update public.portal_profiles
--   set user_type = 'LEADERBOARD_ACCESS'
--   where id = '<auth user uuid>';

alter table public.portal_profiles
  drop constraint if exists portal_profiles_user_type_check;

alter table public.portal_profiles
  add constraint portal_profiles_user_type_check
  check (
    user_type is null
    or user_type in ('ADMIN', 'LEADERBOARD_ACCESS')
  );

comment on column public.portal_profiles.user_type is
  'Portal role. NULL for partners; ADMIN for portal admins; LEADERBOARD_ACCESS for event staff who can manage competition entries. Set only via service role / SQL.';
