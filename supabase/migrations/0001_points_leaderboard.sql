do $$ begin
  create type point_event as enum ('task_completed','admin_very_good','admin_ready','admin_not_ready','reopen','wheel_reward');
exception when duplicate_object then null; end $$;

create table if not exists public.points_log (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null,
  task_id       uuid,
  event         point_event not null,
  delta         integer not null,
  meta          jsonb default '{}'::jsonb,
  created_at    timestamptz not null default now()
);
create index if not exists idx_points_log_user_id on public.points_log(user_id);
create index if not exists idx_points_log_created_at on public.points_log(created_at);

alter table public.points_log enable row level security;
create policy if not exists read_own_points on public.points_log for select to authenticated using (auth.uid() = user_id);
create policy if not exists user_insert_own_points on public.points_log for insert to authenticated with check (auth.uid() = user_id);

create or replace function public.get_leaderboard(period text)
returns table (user_id uuid, points integer, last_scored_at timestamptz)
language sql stable as $$
  with range as (
    select case
      when period = 'day'   then date_trunc('day',   now())
      when period = 'week'  then date_trunc('week',  now())
      when period = 'month' then date_trunc('month', now())
      else null
    end as since
  )
  select pl.user_id, sum(pl.delta)::int as points, max(pl.created_at) as last_scored_at
  from public.points_log pl cross join range r
  where r.since is null or pl.created_at >= r.since
  group by pl.user_id
  order by points desc, last_scored_at desc;
$$;
