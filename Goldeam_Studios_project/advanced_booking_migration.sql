-- 1. Blocked Dates Table
create table if not exists public.blocked_dates (
  id uuid default gen_random_uuid() primary key,
  blocked_date date not null unique,
  reason text,
  created_at timestamp with time zone default now()
);

-- 2. Global Blocked Slots Table (Per Studio)
create table if not exists public.blocked_slots (
  id uuid default gen_random_uuid() primary key,
  studio_id uuid references public.studios(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  slot_time time not null,
  reason text,
  created_at timestamp with time zone default now(),
  unique(studio_id, day_of_week, slot_time)
);

-- 3. Email Templates Table
create table if not exists public.email_templates (
  id uuid default gen_random_uuid() primary key,
  name text not null unique, -- e.g., 'booking_confirmation', 'reminder', 'admin_notification'
  subject text not null,
  html_content text not null,
  variables jsonb default '[]'::jsonb, -- List of expected variables for UI help
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4. Email Logs Table
create table if not exists public.email_logs (
  id uuid default gen_random_uuid() primary key,
  recipient text not null,
  template_id uuid references public.email_templates(id),
  appointment_id uuid references public.appointments(id),
  status text check (status in ('sent', 'failed', 'pending')),
  error_message text,
  created_at timestamp with time zone default now()
);

-- 5. Update Appointments Table
alter table public.appointments 
  drop constraint if exists appointments_status_check;

alter table public.appointments 
  add constraint appointments_status_check 
  check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'));

do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='appointments' and column_name='admin_notes') then
    alter table public.appointments add column admin_notes text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='appointments' and column_name='metadata') then
    alter table public.appointments add column metadata jsonb default '{}'::jsonb;
  end if;
end $$;

-- 6. RLS for new tables
alter table public.blocked_dates enable row level security;
alter table public.blocked_slots enable row level security;
alter table public.email_templates enable row level security;
alter table public.email_logs enable row level security;

create policy "Public can view blocked dates" on public.blocked_dates for select to public using (true);
create policy "Public can view blocked slots" on public.blocked_slots for select to public using (true);

create policy "Admins manage blocked dates" on public.blocked_dates for all to authenticated using (true);
create policy "Admins manage blocked slots" on public.blocked_slots for all to authenticated using (true);
create policy "Admins manage email templates" on public.email_templates for all to authenticated using (true);
create policy "Admins view email logs" on public.email_logs for select to authenticated using (true);

-- 7. Enhanced Availability RPC
create or replace function public.get_available_slots(p_studio_id uuid, p_date date, p_duration int)
returns table(slot_time time) as $$
declare
  v_start_time time;
  v_end_time time;
  v_is_closed boolean;
  v_day int;
begin
  -- 1. Check if the date itself is blocked globally
  if exists (select 1 from public.blocked_dates where blocked_date = p_date) then
    return;
  end if;

  v_day := extract(dow from p_date);
  
  -- 2. Get working hours
  select start_time, end_time, is_closed 
  into v_start_time, v_end_time, v_is_closed
  from public.studio_working_hours
  where studio_id = p_studio_id and day_of_week = v_day;
  
  if v_is_closed or v_start_time is null then
    return;
  end if;

  -- 3. Generate possible slots and filter by existing bookings AND global blocked slots
  return query
  with possible_slots as (
    select (v_start_time + (n || ' hours')::interval)::time as s_time
    from generate_series(0, extract(hour from (v_end_time - v_start_time))::int - p_duration) n
  )
  select s_time 
  from possible_slots
  where 
    -- Not an existing booking overlap
    not exists (
      select 1 from public.appointments
      where studio_id = p_studio_id
      and status not in ('cancelled')
      and booking_range && tsrange(
        (p_date + s_time)::timestamp,
        (p_date + (s_time + (p_duration || ' hours')::interval))::timestamp,
        '[)'
      )
    )
    -- AND Not a globally blocked slot within the requested range
    and not exists (
      select 1 from public.blocked_slots bs
      where bs.studio_id = p_studio_id
      and bs.day_of_week = v_day
      and bs.slot_time >= s_time
      and bs.slot_time < (s_time + (p_duration || ' hours')::interval)::time
    );
end;
$$ language plpgsql stable;
