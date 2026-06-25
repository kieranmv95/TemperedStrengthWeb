-- Allow portal owners to delete their own gym / club / coach listings.
-- Run in Supabase SQL Editor if delete appears to do nothing (RLS blocking).

drop policy if exists "gyms_delete_own" on public.gyms;
create policy "gyms_delete_own"
  on public.gyms for delete to authenticated
  using (auth.uid() = owner_id);

drop policy if exists "clubs_delete_own" on public.clubs;
create policy "clubs_delete_own"
  on public.clubs for delete to authenticated
  using (auth.uid() = owner_id);

drop policy if exists "coaches_delete_own" on public.coaches;
create policy "coaches_delete_own"
  on public.coaches for delete to authenticated
  using (auth.uid() = owner_id);
