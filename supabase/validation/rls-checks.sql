-- Supabase RLS validation checks for the persistence foundation PR.
--
-- Replace the placeholder UUIDs before running:
--   <founder-user-id>
--   <other-user-id>
--
-- Run after applying the persistence migration in a local or preview database.
-- These checks emulate anonymous and authenticated requests by setting the
-- database role plus the request JWT claim used by auth.uid().

begin;

-- Anonymous users must not read founder data.
set local role anon;
reset "request.jwt.claim.sub";

select count(*) from public.objectives;
select count(*) from public.days;
select count(*) from public.daily_objectives;
select count(*) from public.closed_day_score_snapshots;

rollback;

begin;

-- Founder can create owned rows.
set local role authenticated;
set local "request.jwt.claim.sub" = '<founder-user-id>';

insert into public.objectives (
  user_id,
  name,
  type,
  is_active,
  default_target_value,
  default_unit
)
values (
  '<founder-user-id>',
  'Validation objective',
  'numeric',
  true,
  5,
  'km'
);

rollback;

begin;

-- Founder cannot write another user's user_id.
set local role authenticated;
set local "request.jwt.claim.sub" = '<founder-user-id>';

insert into public.objectives (
  user_id,
  name,
  type,
  is_active
)
values (
  '<other-user-id>',
  'Should fail',
  'binary',
  true
);

rollback;

begin;

-- Another authenticated user cannot read founder rows.
set local role authenticated;
set local "request.jwt.claim.sub" = '<other-user-id>';

select * from public.objectives where user_id = '<founder-user-id>';
select * from public.days where user_id = '<founder-user-id>';
select * from public.daily_objectives where user_id = '<founder-user-id>';
select * from public.closed_day_score_snapshots where user_id = '<founder-user-id>';

rollback;

begin;

-- Another authenticated user cannot update founder rows or reassign ownership.
set local role authenticated;
set local "request.jwt.claim.sub" = '<other-user-id>';

update public.objectives
set user_id = '<other-user-id>'
where user_id = '<founder-user-id>';

update public.days
set user_id = '<other-user-id>'
where user_id = '<founder-user-id>';

rollback;
