-- Promo codes for app Pro redemptions + email audit log.
-- Run in Supabase SQL Editor.

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  max_redemptions integer not null check (max_redemptions > 0),
  remaining_redemptions integer not null check (remaining_redemptions >= 0),
  days_granted integer not null check (days_granted > 0),
  password_hash text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (remaining_redemptions <= max_redemptions)
);

comment on table public.promo_codes is
  'Admin-managed promo codes for granting time-limited Pro access in the app.';

comment on column public.promo_codes.code is
  'Uppercase code string entered by users in the app.';

comment on column public.promo_codes.password_hash is
  'Optional scrypt hash. Null means no password required.';

create table if not exists public.promo_code_redemptions (
  id uuid primary key default gen_random_uuid(),
  promo_code_id uuid not null references public.promo_codes (id) on delete restrict,
  email text not null,
  redeemed_at timestamptz not null default now(),
  days_granted integer not null check (days_granted > 0),
  unique (promo_code_id, email)
);

comment on table public.promo_code_redemptions is
  'Audit log of promo code redemptions by email.';

create index if not exists promo_code_redemptions_email_idx
  on public.promo_code_redemptions (email);

create index if not exists promo_code_redemptions_promo_code_id_idx
  on public.promo_code_redemptions (promo_code_id);

alter table public.promo_codes enable row level security;
alter table public.promo_code_redemptions enable row level security;

-- Service role only — no client policies.

create or replace function public.redeem_promo_code(
  p_promo_code_id uuid,
  p_email text,
  p_days_granted integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.promo_code_redemptions (promo_code_id, email, days_granted)
  values (p_promo_code_id, lower(trim(p_email)), p_days_granted);

  update public.promo_codes
  set
    remaining_redemptions = remaining_redemptions - 1,
    updated_at = now()
  where id = p_promo_code_id
    and is_active = true
    and remaining_redemptions > 0;

  if not found then
    raise exception 'exhausted';
  end if;
exception
  when unique_violation then
    raise exception 'already_redeemed';
end;
$$;

comment on function public.redeem_promo_code(uuid, text, integer) is
  'Atomically records a redemption and decrements remaining_redemptions.';
