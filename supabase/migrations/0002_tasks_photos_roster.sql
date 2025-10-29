-- Tasks
do $$ begin
  create type task_status as enum ('open','done');
exception when duplicate_object then null; end $$;

do $$ begin
  create type photo_mode as enum ('none','required','random');
exception when duplicate_object then null; end $$;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  assignee_id uuid,
  due_at timestamptz,
  status task_status not null default 'open',
  photo_mode photo_mode not null default 'none',
  review text,
  completed_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.task_items (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  label text not null,
  required boolean not null default false,
  checked_by uuid,
  checked_at timestamptz
);

-- Task photos
create table if not exists public.task_photos (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null,
  url text not null,
  created_at timestamptz not null default now()
);

-- Check-ins & wheel
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_at timestamptz not null default now()
);

create table if not exists public.wheel_spins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  task_id uuid,
  reward_points int not null default 0,
  created_at timestamptz not null default now()
);

-- Roster
create table if not exists public.roster_shifts (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  role text not null,
  user_id uuid not null,
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  unique (date, role, user_id, start_time, end_time)
);

-- Storage bucket (create via Dashboard UI)
-- Policies
alter table public.tasks enable row level security;
alter table public.task_items enable row level security;
alter table public.task_photos enable row level security;
alter table public.checkins enable row level security;
alter table public.wheel_spins enable row level security;
alter table public.roster_shifts enable row level security;

-- Basic read/write own policies (adjust for roles as needed)
create policy if not exists "tasks_read_all" on public.tasks for select to authenticated using (true);
create policy if not exists "tasks_insert"   on public.tasks for insert to authenticated with check (true);
create policy if not exists "tasks_update"   on public.tasks for update to authenticated using (true);

create policy if not exists "task_items_read" on public.task_items for select to authenticated using (true);
create policy if not exists "task_items_write" on public.task_items for insert to authenticated with check (true);
create policy if not exists "task_items_update" on public.task_items for update to authenticated using (true);

create policy if not exists "task_photos_read" on public.task_photos for select to authenticated using (true);
create policy if not exists "task_photos_write" on public.task_photos for insert to authenticated with check (auth.uid() = user_id);

create policy if not exists "checkins_rw" on public.checkins for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "wheel_spins_rw" on public.wheel_spins for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "roster_read" on public.roster_shifts for select to authenticated using (true);
create policy if not exists "roster_write" on public.roster_shifts for insert to authenticated with check (true);
create policy if not exists "roster_update" on public.roster_shifts for update to authenticated using (true);
