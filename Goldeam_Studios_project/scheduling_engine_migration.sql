-- 1. Enable btree_gist extension (required for EXCLUDE constraints on UUID/Text)
create extension if not exists btree_gist;

-- 2. Create Studios Table if it doesn't exist
create table if not exists public.studios (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Insert default studios if they don't exist
insert into public.studios (name, description) values
('A', 'Large & Professional Space'),
('B', 'Compact & Intimate Space')
on conflict (name) do nothing;

-- 3. Create Studio Working Hours Table if it doesn't exist
create table if not exists public.studio_working_hours (
  id uuid default gen_random_uuid() primary key,
  studio_id uuid references public.studios(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6), -- 0 = Sunday, 6 = Saturday
  start_time time not null,
  end_time time not null,
  is_closed boolean default false,
  check (start_time < end_time),
  unique(studio_id, day_of_week)
);

-- Insert default working hours (9 AM - 9 PM for all days)
insert into public.studio_working_hours (studio_id, day_of_week, start_time, end_time)
select id, d, '09:00:00', '21:00:00'
from public.studios, generate_series(0, 6) as d
on conflict do nothing;

-- 4. Safe Migration of Appointments Table
-- Add studio_id column if it doesn't exist
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='appointments' and column_name='studio_id') then
    alter table public.appointments add column studio_id uuid references public.studios(id);
  end if;
  
  -- Add booking_range column if it doesn't exist
  if not exists (select 1 from information_schema.columns where table_name='appointments' and column_name='booking_range') then
    alter table public.appointments add column booking_range tsrange;
  end if;
end $$;

-- 5. Data Backfill: Link existing 'studio' text ('A', 'B') to studio_id
update public.appointments a
set studio_id = s.id
from public.studios s
where a.studio = s.name 
and a.studio_id is null;

-- 6. Trigger to automatically update booking_range
create or replace function public.update_booking_range()
returns trigger as $$
begin
  new.booking_range := tsrange(
    (new.booking_date + new.start_time)::timestamp,
    (new.booking_date + (new.start_time + (new.duration_hours || ' hours')::interval))::timestamp,
    '[)'
  );
  return new;
end;
$$ language plpgsql;

drop trigger if exists tr_update_booking_range on public.appointments;
create trigger tr_update_booking_range
before insert or update of booking_date, start_time, duration_hours
on public.appointments
for each row execute procedure public.update_booking_range();

-- Backfill ranges for existing bookings
update public.appointments set updated_at = now() where booking_range is null;

-- 7. Overlap Constraint (EXCLUDE)
-- We use DO block to check if it exists before adding
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'appointments_exclude_overlap') then
    alter table public.appointments 
    add constraint appointments_exclude_overlap 
    exclude using gist (studio_id with =, booking_range with &&) 
    where (status != 'cancelled');
  end if;
end $$;

-- 8. RLS and Permissions
alter table public.studios enable row level security;
alter table public.studio_working_hours enable row level security;

-- Drop existing to avoid conflicts
drop policy if exists "Public can view studios" on public.studios;
drop policy if exists "Public can view working hours" on public.studio_working_hours;
drop policy if exists "Admins can manage studios" on public.studios;
drop policy if exists "Admins can manage working hours" on public.studio_working_hours;

create policy "Public can view studios" on public.studios for select to public using (true);
create policy "Public can view working hours" on public.studio_working_hours for select to public using (true);
create policy "Admins can manage studios" on public.studios for all to authenticated using (true);
create policy "Admins can manage working hours" on public.studio_working_hours for all to authenticated using (true);

-- 9. Availability RPC Function
create or replace function public.get_available_slots(p_studio_id uuid, p_date date, p_duration int)
returns table(slot_time time) as $$
declare
  v_start_time time;
  v_end_time time;
  v_is_closed boolean;
  v_day int;
begin
  v_day := extract(dow from p_date);
  
  -- Get working hours
  select start_time, end_time, is_closed 
  into v_start_time, v_end_time, v_is_closed
  from public.studio_working_hours
  where studio_id = p_studio_id and day_of_week = v_day;
  
  if v_is_closed or v_start_time is null then
    return;
  end if;

  -- Generate possible slots (hourly increments)
  return query
  with possible_slots as (
    select (v_start_time + (n || ' hours')::interval)::time as s_time
    from generate_series(0, extract(hour from (v_end_time - v_start_time))::int - p_duration) n
  )
  select s_time 
  from possible_slots
  where not exists (
    select 1 from public.appointments
    where studio_id = p_studio_id
    and status != 'cancelled'
    and booking_range && tsrange(
      (p_date + s_time)::timestamp,
      (p_date + (s_time + (p_duration || ' hours')::interval))::timestamp,
      '[)'
    )
  );
end;
$$ language plpgsql stable;
