-- Partner listing cover images (stored in partner-images Storage bucket).
-- Run in Supabase SQL Editor (or via supabase db push).

alter table public.gyms
  add column if not exists image_path text;

alter table public.clubs
  add column if not exists image_path text;

alter table public.coaches
  add column if not exists image_path text;

comment on column public.gyms.image_path is
  'Storage path in partner-images bucket, e.g. gyms/{id}/cover.jpg';

comment on column public.clubs.image_path is
  'Storage path in partner-images bucket, e.g. clubs/{id}/cover.jpg';

comment on column public.coaches.image_path is
  'Storage path in partner-images bucket, e.g. coaches/{id}/cover.jpg';

-- ---------------------------------------------------------------------------
-- Storage RLS for partner-images (bucket must exist; public read via bucket setting)
-- ---------------------------------------------------------------------------

create or replace function public.user_owns_partner_image(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(
      (
        select true
        from public.gyms g
        where (string_to_array(object_name, '/'))[1] = 'gyms'
          and (string_to_array(object_name, '/'))[2] = g.id::text
          and g.owner_id = auth.uid()
      ),
      (
        select true
        from public.clubs c
        where (string_to_array(object_name, '/'))[1] = 'clubs'
          and (string_to_array(object_name, '/'))[2] = c.id::text
          and c.owner_id = auth.uid()
      ),
      (
        select true
        from public.coaches c
        where (string_to_array(object_name, '/'))[1] = 'coaches'
          and (string_to_array(object_name, '/'))[2] = c.id::text
          and c.owner_id = auth.uid()
      ),
      false
    );
$$;

drop policy if exists "partner_images_public_read" on storage.objects;
create policy "partner_images_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'partner-images');

drop policy if exists "partner_images_insert_own" on storage.objects;
create policy "partner_images_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'partner-images'
    and public.user_owns_partner_image(name)
    and name ~ '^(gyms|clubs|coaches)/[0-9a-f-]{36}/cover\.jpg$'
  );

drop policy if exists "partner_images_update_own" on storage.objects;
create policy "partner_images_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'partner-images'
    and public.user_owns_partner_image(name)
  )
  with check (
    bucket_id = 'partner-images'
    and public.user_owns_partner_image(name)
    and name ~ '^(gyms|clubs|coaches)/[0-9a-f-]{36}/cover\.jpg$'
  );

drop policy if exists "partner_images_delete_own" on storage.objects;
create policy "partner_images_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'partner-images'
    and public.user_owns_partner_image(name)
  );
