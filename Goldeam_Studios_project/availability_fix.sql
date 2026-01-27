-- FIX: Availability Sync for Anonymous Customers
-- This update ensures the availability check can "see" booked slots even when a non-admin user is browsing.

create or replace function public.get_available_slots(p_studio_id uuid, p_date date, p_duration int)
returns table(slot_time time) 
language plpgsql
security definer -- Crucial: Allows function to check appointments regardless of RLS
stable
as $$
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
  select ps.s_time 
  from possible_slots ps
  where 
    -- Not an existing booking overlap
    not exists (
      select 1 from public.appointments a
      where a.studio_id = p_studio_id
      and a.status not in ('cancelled')
      and a.booking_range && tsrange(
        (p_date + ps.s_time)::timestamp,
        (p_date + (ps.s_time + (p_duration || ' hours')::interval))::timestamp,
        '[)'
      )
    )
    -- AND Not a globally blocked slot within the requested range
    and not exists (
      select 1 from public.blocked_slots bs
      where bs.studio_id = p_studio_id
      and bs.day_of_week = v_day
      and bs.slot_time >= ps.s_time
      and bs.slot_time < (ps.s_time + (p_duration || ' hours')::interval)::time
    );
end;
$$;
