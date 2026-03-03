-- Solo-first MVP schema for tasks, habits, goals, notes, studio layout, sync events,
-- and idempotency tracking.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.set_idempotency_last_seen_at()
returns trigger
language plpgsql
as $$
begin
  new.last_seen_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  timezone text not null default 'UTC',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint projects_title_not_blank check (btrim(title) <> '')
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  details text not null default '',
  status text not null default 'inbox' check (status in ('inbox', 'todo', 'doing', 'done')),
  priority smallint not null default 0 check (priority between 0 and 3),
  due_at timestamptz,
  completed_at timestamptz,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  constraint tasks_title_not_blank check (btrim(title) <> '')
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  name text not null,
  cadence text not null default 'daily' check (cadence in ('daily', 'weekly', 'custom')),
  target_count integer not null default 1 check (target_count > 0),
  streak_count integer not null default 0 check (streak_count >= 0),
  last_completed_on date,
  days_of_week integer[] not null default '{}'::integer[],
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  constraint habits_name_not_blank check (btrim(name) <> ''),
  constraint habits_days_of_week_valid check (
    days_of_week <@ array[0, 1, 2, 3, 4, 5, 6]::integer[]
  )
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  log_date date not null,
  outcome text not null default 'done',
  quantity numeric(10, 2),
  note text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  constraint habit_logs_unique_day unique (habit_id, log_date)
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text not null default '',
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'archived')),
  target_value numeric(12, 2),
  current_value numeric(12, 2) not null default 0,
  unit text not null default '',
  due_at timestamptz,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  constraint goals_title_not_blank check (btrim(title) <> '')
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null default '',
  content text not null default '',
  pinned boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.task_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.studio_canvas_layout (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  canvas_id text not null default 'default',
  entity_type text not null check (entity_type in ('task', 'habit', 'goal', 'note')),
  entity_id uuid not null,
  x double precision not null default 0,
  y double precision not null default 0,
  width double precision not null default 280 check (width > 0),
  height double precision not null default 160 check (height > 0),
  z_index integer not null default 0,
  collapsed boolean not null default false,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  constraint studio_pointer_meta_no_embedded_content check (
    not (meta ?| array['title', 'content', 'description', 'body', 'text', 'payload'])
  ),
  constraint studio_canvas_layout_pointer_unique unique (user_id, canvas_id, entity_type, entity_id)
);

create table if not exists public.sync_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  idempotency_key text not null,
  entity_table text not null check (
    entity_table in ('tasks', 'habits', 'goals', 'notes', 'studio_canvas_layout')
  ),
  entity_id uuid not null,
  operation text not null check (operation in ('upsert', 'delete')),
  payload jsonb not null default '{}'::jsonb,
  client_timestamp timestamptz not null default timezone('utc', now()),
  server_received_at timestamptz not null default timezone('utc', now()),
  replay_status text not null default 'pending' check (
    replay_status in ('pending', 'applied', 'duplicate', 'failed')
  ),
  replay_error text,
  applied_at timestamptz,
  constraint sync_events_user_idempotency_unique unique (user_id, idempotency_key)
);

create table if not exists public.sync_idempotency_keys (
  user_id uuid not null references auth.users(id) on delete cascade,
  idempotency_key text not null,
  event_id uuid references public.sync_events(id) on delete set null,
  request_hash text not null,
  first_seen_at timestamptz not null default timezone('utc', now()),
  last_seen_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, idempotency_key)
);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists habits_set_updated_at on public.habits;
create trigger habits_set_updated_at
before update on public.habits
for each row execute function public.set_updated_at();

drop trigger if exists goals_set_updated_at on public.goals;
create trigger goals_set_updated_at
before update on public.goals
for each row execute function public.set_updated_at();

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

drop trigger if exists studio_canvas_layout_set_updated_at on public.studio_canvas_layout;
create trigger studio_canvas_layout_set_updated_at
before update on public.studio_canvas_layout
for each row execute function public.set_updated_at();

drop trigger if exists sync_idempotency_keys_set_last_seen_at on public.sync_idempotency_keys;
create trigger sync_idempotency_keys_set_last_seen_at
before update on public.sync_idempotency_keys
for each row execute function public.set_idempotency_last_seen_at();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.goals enable row level security;
alter table public.notes enable row level security;
alter table public.task_events enable row level security;
alter table public.studio_canvas_layout enable row level security;
alter table public.sync_events enable row level security;
alter table public.sync_idempotency_keys enable row level security;

alter table public.profiles force row level security;
alter table public.projects force row level security;
alter table public.tasks force row level security;
alter table public.habits force row level security;
alter table public.habit_logs force row level security;
alter table public.goals force row level security;
alter table public.notes force row level security;
alter table public.task_events force row level security;
alter table public.studio_canvas_layout force row level security;
alter table public.sync_events force row level security;
alter table public.sync_idempotency_keys force row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
for select using (auth.uid() = id);
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
for insert with check (auth.uid() = id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists profiles_delete_own on public.profiles;
create policy profiles_delete_own on public.profiles
for delete using (auth.uid() = id);

drop policy if exists projects_select_own on public.projects;
create policy projects_select_own on public.projects
for select using (auth.uid() = user_id);
drop policy if exists projects_insert_own on public.projects;
create policy projects_insert_own on public.projects
for insert with check (auth.uid() = user_id);
drop policy if exists projects_update_own on public.projects;
create policy projects_update_own on public.projects
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists projects_delete_own on public.projects;
create policy projects_delete_own on public.projects
for delete using (auth.uid() = user_id);

drop policy if exists tasks_select_own on public.tasks;
create policy tasks_select_own on public.tasks
for select using (auth.uid() = user_id);
drop policy if exists tasks_insert_own on public.tasks;
create policy tasks_insert_own on public.tasks
for insert with check (auth.uid() = user_id);
drop policy if exists tasks_update_own on public.tasks;
create policy tasks_update_own on public.tasks
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists tasks_delete_own on public.tasks;
create policy tasks_delete_own on public.tasks
for delete using (auth.uid() = user_id);

drop policy if exists habits_select_own on public.habits;
create policy habits_select_own on public.habits
for select using (auth.uid() = user_id);
drop policy if exists habits_insert_own on public.habits;
create policy habits_insert_own on public.habits
for insert with check (auth.uid() = user_id);
drop policy if exists habits_update_own on public.habits;
create policy habits_update_own on public.habits
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists habits_delete_own on public.habits;
create policy habits_delete_own on public.habits
for delete using (auth.uid() = user_id);

drop policy if exists habit_logs_select_own on public.habit_logs;
create policy habit_logs_select_own on public.habit_logs
for select using (auth.uid() = user_id);
drop policy if exists habit_logs_insert_own on public.habit_logs;
create policy habit_logs_insert_own on public.habit_logs
for insert with check (auth.uid() = user_id);
drop policy if exists habit_logs_update_own on public.habit_logs;
create policy habit_logs_update_own on public.habit_logs
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists habit_logs_delete_own on public.habit_logs;
create policy habit_logs_delete_own on public.habit_logs
for delete using (auth.uid() = user_id);

drop policy if exists goals_select_own on public.goals;
create policy goals_select_own on public.goals
for select using (auth.uid() = user_id);
drop policy if exists goals_insert_own on public.goals;
create policy goals_insert_own on public.goals
for insert with check (auth.uid() = user_id);
drop policy if exists goals_update_own on public.goals;
create policy goals_update_own on public.goals
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists goals_delete_own on public.goals;
create policy goals_delete_own on public.goals
for delete using (auth.uid() = user_id);

drop policy if exists notes_select_own on public.notes;
create policy notes_select_own on public.notes
for select using (auth.uid() = user_id);
drop policy if exists notes_insert_own on public.notes;
create policy notes_insert_own on public.notes
for insert with check (auth.uid() = user_id);
drop policy if exists notes_update_own on public.notes;
create policy notes_update_own on public.notes
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists notes_delete_own on public.notes;
create policy notes_delete_own on public.notes
for delete using (auth.uid() = user_id);

drop policy if exists task_events_select_own on public.task_events;
create policy task_events_select_own on public.task_events
for select using (auth.uid() = user_id);
drop policy if exists task_events_insert_own on public.task_events;
create policy task_events_insert_own on public.task_events
for insert with check (auth.uid() = user_id);
drop policy if exists task_events_update_own on public.task_events;
create policy task_events_update_own on public.task_events
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists task_events_delete_own on public.task_events;
create policy task_events_delete_own on public.task_events
for delete using (auth.uid() = user_id);

drop policy if exists studio_canvas_layout_select_own on public.studio_canvas_layout;
create policy studio_canvas_layout_select_own on public.studio_canvas_layout
for select using (auth.uid() = user_id);
drop policy if exists studio_canvas_layout_insert_own on public.studio_canvas_layout;
create policy studio_canvas_layout_insert_own on public.studio_canvas_layout
for insert with check (auth.uid() = user_id);
drop policy if exists studio_canvas_layout_update_own on public.studio_canvas_layout;
create policy studio_canvas_layout_update_own on public.studio_canvas_layout
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists studio_canvas_layout_delete_own on public.studio_canvas_layout;
create policy studio_canvas_layout_delete_own on public.studio_canvas_layout
for delete using (auth.uid() = user_id);

drop policy if exists sync_events_select_own on public.sync_events;
create policy sync_events_select_own on public.sync_events
for select using (auth.uid() = user_id);
drop policy if exists sync_events_insert_own on public.sync_events;
create policy sync_events_insert_own on public.sync_events
for insert with check (auth.uid() = user_id);
drop policy if exists sync_events_update_own on public.sync_events;
create policy sync_events_update_own on public.sync_events
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists sync_events_delete_own on public.sync_events;
create policy sync_events_delete_own on public.sync_events
for delete using (auth.uid() = user_id);

drop policy if exists sync_idempotency_keys_select_own on public.sync_idempotency_keys;
create policy sync_idempotency_keys_select_own on public.sync_idempotency_keys
for select using (auth.uid() = user_id);
drop policy if exists sync_idempotency_keys_insert_own on public.sync_idempotency_keys;
create policy sync_idempotency_keys_insert_own on public.sync_idempotency_keys
for insert with check (auth.uid() = user_id);
drop policy if exists sync_idempotency_keys_update_own on public.sync_idempotency_keys;
create policy sync_idempotency_keys_update_own on public.sync_idempotency_keys
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists sync_idempotency_keys_delete_own on public.sync_idempotency_keys;
create policy sync_idempotency_keys_delete_own on public.sync_idempotency_keys
for delete using (auth.uid() = user_id);

create index if not exists idx_tasks_user_updated_at
on public.tasks (user_id, updated_at desc)
where deleted_at is null;
create index if not exists idx_tasks_user_status_due_at
on public.tasks (user_id, status, due_at)
where deleted_at is null;
create index if not exists idx_tasks_project_id
on public.tasks (project_id);

create index if not exists idx_habits_user_updated_at
on public.habits (user_id, updated_at desc)
where deleted_at is null;
create index if not exists idx_habits_user_cadence
on public.habits (user_id, cadence)
where deleted_at is null;
create index if not exists idx_habits_project_id
on public.habits (project_id);
create index if not exists idx_habit_logs_user_log_date
on public.habit_logs (user_id, log_date desc);
create index if not exists idx_habit_logs_habit_date
on public.habit_logs (habit_id, log_date desc);

create index if not exists idx_goals_user_status_due_at
on public.goals (user_id, status, due_at)
where deleted_at is null;
create index if not exists idx_goals_user_updated_at
on public.goals (user_id, updated_at desc)
where deleted_at is null;
create index if not exists idx_goals_project_id
on public.goals (project_id);

create index if not exists idx_notes_user_updated_at
on public.notes (user_id, updated_at desc)
where deleted_at is null;
create index if not exists idx_notes_user_pinned
on public.notes (user_id, pinned, updated_at desc)
where deleted_at is null;
create index if not exists idx_notes_project_id
on public.notes (project_id);
create index if not exists idx_projects_user_updated_at
on public.projects (user_id, updated_at desc);
create index if not exists idx_task_events_user_created_at
on public.task_events (user_id, created_at desc);
create index if not exists idx_task_events_task_created_at
on public.task_events (task_id, created_at desc);

create index if not exists idx_studio_canvas_layout_user_canvas_z
on public.studio_canvas_layout (user_id, canvas_id, z_index);
create index if not exists idx_studio_canvas_layout_entity_lookup
on public.studio_canvas_layout (user_id, entity_type, entity_id);

create index if not exists idx_sync_events_user_received_at
on public.sync_events (user_id, server_received_at desc);
create index if not exists idx_sync_events_user_replay_status
on public.sync_events (user_id, replay_status, server_received_at desc);

create index if not exists idx_sync_idempotency_user_last_seen
on public.sync_idempotency_keys (user_id, last_seen_at desc);
