create table public.objectives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  type text not null check (type in ('binary', 'numeric')),
  is_active boolean not null default true,
  default_target_value double precision,
  default_unit text,
  default_weight double precision,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (id, user_id),
  constraint objectives_default_weight_positive_check check (
    default_weight is null or default_weight > 0
  ),
  constraint objectives_numeric_defaults_check check (
    (
      type = 'binary'
      and default_target_value is null
      and default_unit is null
    )
    or (
      type = 'numeric'
      and default_target_value is not null
      and default_target_value > 0
      and default_unit is not null
      and char_length(trim(default_unit)) > 0
    )
  )
);

create table public.days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  state text not null check (
    state in ('unconfigured', 'draft', 'active', 'closed', 'excluded')
  ),
  closed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, date),
  unique (id, user_id),
  constraint days_closed_at_matches_state_check check (
    (
      state = 'closed'
      and closed_at is not null
    )
    or (
      state <> 'closed'
      and closed_at is null
    )
  )
);

create table public.daily_objectives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  day_id uuid not null,
  objective_id uuid not null,
  name_snapshot text not null check (char_length(trim(name_snapshot)) > 0),
  type text not null check (type in ('binary', 'numeric')),
  kind text not null check (kind in ('base', 'bonus')),
  weight double precision not null check (weight > 0),
  target_value double precision,
  current_value double precision,
  unit text,
  is_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (day_id, objective_id),
  constraint daily_objectives_day_owner_fk
    foreign key (day_id, user_id)
    references public.days (id, user_id)
    on delete cascade,
  constraint daily_objectives_objective_owner_fk
    foreign key (objective_id, user_id)
    references public.objectives (id, user_id)
    on delete restrict,
  constraint daily_objectives_numeric_fields_check check (
    (
      type = 'binary'
      and target_value is null
      and current_value is null
      and unit is null
    )
    or (
      type = 'numeric'
      and target_value is not null
      and target_value > 0
      and current_value is not null
      and current_value >= 0
      and unit is not null
      and char_length(trim(unit)) > 0
    )
  )
);

create table public.closed_day_score_snapshots (
  day_id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  final_score double precision not null check (
    final_score >= 0 and final_score <= 100
  ),
  base_score double precision not null check (base_score >= 0),
  bonus_score double precision not null check (bonus_score >= 0),
  calculated_at timestamptz not null default timezone('utc', now()),
  unique (day_id, user_id),
  constraint closed_day_score_snapshots_day_owner_fk
    foreign key (day_id, user_id)
    references public.days (id, user_id)
    on delete cascade
);

create index objectives_user_id_idx on public.objectives (user_id);
create index objectives_user_id_is_active_idx on public.objectives (user_id, is_active);
create index days_user_id_idx on public.days (user_id);
create index days_user_id_date_idx on public.days (user_id, date);
create index daily_objectives_user_id_idx on public.daily_objectives (user_id);
create index daily_objectives_day_id_idx on public.daily_objectives (day_id);
create index closed_day_score_snapshots_user_id_idx on public.closed_day_score_snapshots (user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger objectives_set_updated_at
before update on public.objectives
for each row
execute function public.set_updated_at();

create trigger days_set_updated_at
before update on public.days
for each row
execute function public.set_updated_at();

create trigger daily_objectives_set_updated_at
before update on public.daily_objectives
for each row
execute function public.set_updated_at();

alter table public.objectives enable row level security;
alter table public.objectives force row level security;
alter table public.days enable row level security;
alter table public.days force row level security;
alter table public.daily_objectives enable row level security;
alter table public.daily_objectives force row level security;
alter table public.closed_day_score_snapshots enable row level security;
alter table public.closed_day_score_snapshots force row level security;

create policy "objectives_select_own"
on public.objectives
for select
using (auth.uid() = user_id);

create policy "objectives_insert_own"
on public.objectives
for insert
with check (auth.uid() = user_id);

create policy "objectives_update_own"
on public.objectives
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "objectives_delete_own"
on public.objectives
for delete
using (auth.uid() = user_id);

create policy "days_select_own"
on public.days
for select
using (auth.uid() = user_id);

create policy "days_insert_own"
on public.days
for insert
with check (auth.uid() = user_id);

create policy "days_update_own"
on public.days
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "days_delete_own"
on public.days
for delete
using (auth.uid() = user_id);

create policy "daily_objectives_select_own"
on public.daily_objectives
for select
using (auth.uid() = user_id);

create policy "daily_objectives_insert_own"
on public.daily_objectives
for insert
with check (auth.uid() = user_id);

create policy "daily_objectives_update_own"
on public.daily_objectives
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "daily_objectives_delete_own"
on public.daily_objectives
for delete
using (auth.uid() = user_id);

create policy "closed_day_score_snapshots_select_own"
on public.closed_day_score_snapshots
for select
using (auth.uid() = user_id);

create policy "closed_day_score_snapshots_insert_own"
on public.closed_day_score_snapshots
for insert
with check (auth.uid() = user_id);

create policy "closed_day_score_snapshots_update_own"
on public.closed_day_score_snapshots
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "closed_day_score_snapshots_delete_own"
on public.closed_day_score_snapshots
for delete
using (auth.uid() = user_id);
