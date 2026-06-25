-- portal_profiles: RLS + auto-create row on signup
-- Run in Supabase SQL Editor if not already configured.

alter table public.portal_profiles enable row level security;

drop policy if exists "portal_profiles_select_own" on public.portal_profiles;
drop policy if exists "portal_profiles_insert_own" on public.portal_profiles;
drop policy if exists "portal_profiles_update_own" on public.portal_profiles;

create policy "portal_profiles_select_own"
on public.portal_profiles for select
to authenticated
using (id = auth.uid());

create policy "portal_profiles_insert_own"
on public.portal_profiles for insert
to authenticated
with check (id = auth.uid());

create policy "portal_profiles_update_own"
on public.portal_profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create or replace function public.handle_new_portal_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.portal_profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_portal_user();

-- Backfill profiles for existing auth users
insert into public.portal_profiles (id)
select id from auth.users
on conflict (id) do nothing;
