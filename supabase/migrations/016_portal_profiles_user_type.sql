-- Portal admin via portal_profiles.user_type (NULL | 'ADMIN').
-- Replaces PORTAL_ADMIN_EMAILS env allowlist.
-- Run in Supabase SQL Editor if not already configured.

alter table public.portal_profiles
  add column if not exists user_type text;

alter table public.portal_profiles
  drop constraint if exists portal_profiles_user_type_check;

alter table public.portal_profiles
  add constraint portal_profiles_user_type_check
  check (user_type is null or user_type = 'ADMIN');

comment on column public.portal_profiles.user_type is
  'Portal role. NULL for partners; ADMIN for portal admins. Set only via service role / SQL.';

-- Authenticated users may only update display_name (not user_type).
revoke update on table public.portal_profiles from authenticated;
grant update (display_name) on table public.portal_profiles to authenticated;

-- Block client inserts that self-assign ADMIN.
drop policy if exists "portal_profiles_insert_own" on public.portal_profiles;
create policy "portal_profiles_insert_own"
on public.portal_profiles for insert
to authenticated
with check (id = auth.uid() and user_type is null);
