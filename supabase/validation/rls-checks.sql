\set ON_ERROR_STOP on

-- Executable RLS validation for the persistence foundation migration.
--
-- This script assumes:
-- 1. the local bootstrap in supabase/validation/local-bootstrap.sql already ran;
-- 2. the persistence migration has already been applied.
--
-- It uses fixed UUIDs so the script is self-contained and repeatable.

\set founder_user_id '11111111-1111-1111-1111-111111111111'
\set other_user_id '22222222-2222-2222-2222-222222222222'
\set founder_objective_id '33333333-3333-3333-3333-333333333333'
\set founder_day_id '44444444-4444-4444-4444-444444444444'
\set founder_daily_objective_id '55555555-5555-5555-5555-555555555555'
\set other_objective_id '66666666-6666-6666-6666-666666666666'
\set forbidden_objective_id '77777777-7777-7777-7777-777777777777'

begin;

truncate table
  public.closed_day_score_snapshots,
  public.daily_objectives,
  public.days,
  public.objectives,
  auth.users;

insert into auth.users (id, email)
values
  (:'founder_user_id', 'founder@example.com'),
  (:'other_user_id', 'other@example.com');

\echo [expected-pass] anonymous access sees no founder data
set local role anon;
select set_config('request.jwt.claim.sub', '', true);

do $$
declare
  visible_count integer;
begin
  select count(*) into visible_count from public.objectives;
  if visible_count <> 0 then
    raise exception 'Anonymous users should not see objective rows. Saw % row(s).', visible_count;
  end if;

  select count(*) into visible_count from public.days;
  if visible_count <> 0 then
    raise exception 'Anonymous users should not see day rows. Saw % row(s).', visible_count;
  end if;

  select count(*) into visible_count from public.daily_objectives;
  if visible_count <> 0 then
    raise exception 'Anonymous users should not see daily objective rows. Saw % row(s).', visible_count;
  end if;

  select count(*) into visible_count from public.closed_day_score_snapshots;
  if visible_count <> 0 then
    raise exception 'Anonymous users should not see snapshot rows. Saw % row(s).', visible_count;
  end if;
end;
$$;
reset role;

\echo [expected-pass] founder can create and read owned persistence rows
set local role authenticated;
select set_config('request.jwt.claim.sub', :'founder_user_id', true);

insert into public.objectives (
  id,
  user_id,
  name,
  type,
  is_active,
  default_target_value,
  default_unit,
  default_weight
)
values (
  :'founder_objective_id',
  :'founder_user_id',
  'Validation objective',
  'numeric',
  true,
  5,
  'km',
  100
);

insert into public.days (
  id,
  user_id,
  date,
  state,
  closed_at
)
values (
  :'founder_day_id',
  :'founder_user_id',
  date '2026-06-30',
  'closed',
  timezone('utc', now())
);

insert into public.daily_objectives (
  id,
  user_id,
  day_id,
  objective_id,
  name_snapshot,
  type,
  kind,
  weight,
  target_value,
  current_value,
  unit,
  is_completed
)
values (
  :'founder_daily_objective_id',
  :'founder_user_id',
  :'founder_day_id',
  :'founder_objective_id',
  'Validation objective',
  'numeric',
  'base',
  100,
  5,
  5,
  'km',
  true
);

insert into public.closed_day_score_snapshots (
  day_id,
  user_id,
  final_score,
  base_score,
  bonus_score
)
values (
  :'founder_day_id',
  :'founder_user_id',
  100,
  100,
  0
);

do $$
declare
  visible_count integer;
begin
  select count(*)
  into visible_count
  from public.objectives
  where id = '33333333-3333-3333-3333-333333333333';
  if visible_count <> 1 then
    raise exception 'Founder should see exactly one owned objective. Saw % row(s).', visible_count;
  end if;

  select count(*)
  into visible_count
  from public.days
  where id = '44444444-4444-4444-4444-444444444444';
  if visible_count <> 1 then
    raise exception 'Founder should see exactly one owned day. Saw % row(s).', visible_count;
  end if;

  select count(*)
  into visible_count
  from public.daily_objectives
  where id = '55555555-5555-5555-5555-555555555555';
  if visible_count <> 1 then
    raise exception 'Founder should see exactly one owned daily objective. Saw % row(s).', visible_count;
  end if;

  select count(*)
  into visible_count
  from public.closed_day_score_snapshots
  where day_id = '44444444-4444-4444-4444-444444444444';
  if visible_count <> 1 then
    raise exception 'Founder should see exactly one owned score snapshot. Saw % row(s).', visible_count;
  end if;
end;
$$;
reset role;

\echo [expected-fail] founder cannot assign another user user_id during insert
set local role authenticated;
select set_config('request.jwt.claim.sub', :'founder_user_id', true);

do $$
begin
  begin
    insert into public.objectives (
      id,
      user_id,
      name,
      type,
      is_active
    )
    values (
      '77777777-7777-7777-7777-777777777777',
      '22222222-2222-2222-2222-222222222222',
      'Should fail',
      'binary',
      true
    );

    raise exception 'Expected insert with another user_id to fail.';
  exception
    when insufficient_privilege then
      null;
  end;
end;
$$;
reset role;

\echo [expected-pass] another authenticated user cannot see founder data
set local role authenticated;
select set_config('request.jwt.claim.sub', :'other_user_id', true);

do $$
declare
  visible_count integer;
begin
  select count(*)
  into visible_count
  from public.objectives
  where user_id = '11111111-1111-1111-1111-111111111111';
  if visible_count <> 0 then
    raise exception 'Other authenticated users must not see founder objectives. Saw % row(s).', visible_count;
  end if;

  select count(*)
  into visible_count
  from public.days
  where user_id = '11111111-1111-1111-1111-111111111111';
  if visible_count <> 0 then
    raise exception 'Other authenticated users must not see founder days. Saw % row(s).', visible_count;
  end if;

  select count(*)
  into visible_count
  from public.daily_objectives
  where user_id = '11111111-1111-1111-1111-111111111111';
  if visible_count <> 0 then
    raise exception 'Other authenticated users must not see founder daily objectives. Saw % row(s).', visible_count;
  end if;

  select count(*)
  into visible_count
  from public.closed_day_score_snapshots
  where user_id = '11111111-1111-1111-1111-111111111111';
  if visible_count <> 0 then
    raise exception 'Other authenticated users must not see founder snapshots. Saw % row(s).', visible_count;
  end if;
end;
$$;

\echo [expected-fail] another authenticated user cannot write founder user_id
do $$
begin
  begin
    insert into public.objectives (
      id,
      user_id,
      name,
      type,
      is_active
    )
    values (
      '77777777-7777-7777-7777-777777777777',
      '11111111-1111-1111-1111-111111111111',
      'Should fail',
      'binary',
      true
    );

    raise exception 'Expected cross-user insert to fail.';
  exception
    when insufficient_privilege then
      null;
  end;
end;
$$;

\echo [expected-pass] another authenticated user cannot update founder rows
do $$
declare
  updated_rows integer;
begin
  update public.objectives
  set name = 'Should not update founder row'
  where id = '33333333-3333-3333-3333-333333333333';

  get diagnostics updated_rows = row_count;

  if updated_rows <> 0 then
    raise exception 'Other authenticated users should not update founder objectives. Updated % row(s).', updated_rows;
  end if;
end;
$$;

\echo [expected-pass] another authenticated user can create own data
insert into public.objectives (
  id,
  user_id,
  name,
  type,
  is_active
)
values (
  :'other_objective_id',
  :'other_user_id',
  'Other objective',
  'binary',
  true
);

\echo [expected-fail] another authenticated user cannot reassign own row to founder user_id
do $$
begin
  begin
    update public.objectives
    set user_id = '11111111-1111-1111-1111-111111111111'
    where id = '66666666-6666-6666-6666-666666666666';

    raise exception 'Expected user_id reassignment to fail.';
  exception
    when insufficient_privilege then
      null;
  end;
end;
$$;
reset role;

rollback;
