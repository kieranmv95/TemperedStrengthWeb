-- Fix: allow Supabase dashboard (postgres / SQL editor) and service role to approve/reject.
-- Table Editor does not set role = service_role, so the original trigger blocked manual approvals.

create or replace function public.enforce_portal_entity_status_change()
returns trigger
language plpgsql
as $$
declare
  jwt_role text := coalesce(current_setting('request.jwt.claim.role', true), '');
  session_role text := coalesce(current_setting('role', true), '');
begin
  if session_role = 'service_role'
     or jwt_role = 'service_role'
     or coalesce(current_setting('is_superuser', true), '') = 'on'
     or current_user in ('postgres', 'supabase_admin')
  then
    return new;
  end if;

  if new.status is distinct from old.status then
    if new.status in ('approved', 'rejected') then
      raise exception 'Only an administrator can approve or reject entities';
    end if;

    if old.status = 'approved' and new.status is distinct from old.status then
      raise exception 'Cannot change status of an approved entity';
    end if;
  end if;

  return new;
end;
$$;
