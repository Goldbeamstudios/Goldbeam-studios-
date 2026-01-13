-- Enable btree_gist extension for EXCLUDE constraints on non-gist types (like UUID/Text)
create extension if not exists btree_gist;

-- Create the posts table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  content text not null, -- Markdown content
  excerpt text,
  image_url text, -- Header image URL
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.posts enable row level security;

-- Create policy to allow public read access to all posts
create policy "Public can view all posts" 
on public.posts 
for select 
to public 
using (true);

-- Create policy to allow only authenticated users (admins) to insert, update, delete
create policy "Admins can insert posts" 
on public.posts 
for insert 
to authenticated 
with check (true);

create policy "Admins can update posts" 
on public.posts 
for update 
to authenticated 
using (true);

create policy "Admins can delete posts" 
on public.posts 
for delete 
to authenticated 
using (true);


-- Create a storage bucket for blog images if it doesn't exist
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Allow public access to view images in the bucket
-- Allow public access to view images in the bucket
drop policy if exists "Public Access to Blog Images" on storage.objects;
create policy "Public Access to Blog Images"
on storage.objects for select
using ( bucket_id = 'blog-images' );

-- Allow authenticated users to upload images
drop policy if exists "Admin Upload to Blog Images" on storage.objects;
create policy "Admin Upload to Blog Images"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'blog-images' );

drop policy if exists "Admin Update Blog Images" on storage.objects;
create policy "Admin Update Blog Images"
on storage.objects for update
to authenticated
using ( bucket_id = 'blog-images' );

drop policy if exists "Admin Delete Blog Images" on storage.objects;
create policy "Admin Delete Blog Images"
on storage.objects for delete
to authenticated
using ( bucket_id = 'blog-images' );

-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  email text,
  role text default 'user'::text check (role in ('user', 'admin', 'super_admin'))
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Function to handle new user entries
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email, 'user');
  return new;
end;
$$;

-- Trigger to call handle_new_user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Manually backfill profile for the existing user if missing
insert into public.profiles (id, email, role)
values ('09beee35-535d-43ef-8783-4a8f60ec1f73', 'user@example.com', 'admin')
on conflict (id) do nothing;

insert into public.profiles (id, email, role)
values ('62682f9d-32d6-4d1c-b3f2-2960d6323a8c', 'admin@goldbeam.com', 'super_admin')
on conflict (id) do nothing;

-- Studios Table
create table public.studios (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Insert default studios
insert into public.studios (name, description) values
('A', 'Large & Professional Space'),
('B', 'Compact & Intimate Space')
on conflict (name) do nothing;

-- Studio Working Hours Table
create table public.studio_working_hours (
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

-- Blocked Dates Table
create table public.blocked_dates (
  id uuid default gen_random_uuid() primary key,
  blocked_date date not null unique,
  reason text,
  created_at timestamp with time zone default now()
);

-- Blocked Slots Table (Per Studio)
create table public.blocked_slots (
  id uuid default gen_random_uuid() primary key,
  studio_id uuid references public.studios(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  slot_time time not null,
  reason text,
  created_at timestamp with time zone default now(),
  unique(studio_id, day_of_week, slot_time)
);

-- Email Templates Table
create table public.email_templates (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  subject text not null,
  html_content text not null,
  variables jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Email Logs Table
create table public.email_logs (
  id uuid default gen_random_uuid() primary key,
  recipient text not null,
  template_id uuid references public.email_templates(id),
  appointment_id uuid references public.appointments(id),
  status text check (status in ('sent', 'failed', 'pending')),
  error_message text,
  created_at timestamp with time zone default now()
);

-- Create appointments table
create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  square_booking_id text UNIQUE, 
  customer_id uuid references auth.users null,
  customer_name text not null,
  customer_email text not null,
  plan_type text not null check (plan_type in ('audio', 'audio_video', 'general')),
  studio text not null, -- Kept for compatibility
  studio_id uuid references public.studios(id),
  theme text,
  duration_hours int not null,
  addons jsonb default '[]'::jsonb,
  total_price decimal(10, 2) not null,
  booking_date date not null,
  start_time time not null,
  booking_range tsrange, -- The core for overlap prevention
  status text default 'pending' check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  admin_notes text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- Prevent overlapping bookings
  exclude using gist (studio_id with =, booking_range with &&) 
  where (status != 'cancelled')
);

-- Function to update booking_range
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

create trigger tr_update_booking_range
before insert or update of booking_date, start_time, duration_hours
on public.appointments
for each row execute procedure public.update_booking_range();

-- Enable RLS
alter table public.appointments enable row level security;
alter table public.studios enable row level security;
alter table public.studio_working_hours enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.blocked_slots enable row level security;
alter table public.email_templates enable row level security;
alter table public.email_logs enable row level security;

-- Policies
create policy "Public can view studios" on public.studios for select to public using (true);
create policy "Public can view working hours" on public.studio_working_hours for select to public using (true);
create policy "Public can view blocked dates" on public.blocked_dates for select to public using (true);
create policy "Public can view blocked slots" on public.blocked_slots for select to public using (true);

create policy "Admins can manage studios" on public.studios for all to authenticated using (true);
create policy "Admins can manage working hours" on public.studio_working_hours for all to authenticated using (true);
create policy "Admins manage blocked dates" on public.blocked_dates for all to authenticated using (true);
create policy "Admins manage blocked slots" on public.blocked_slots for all to authenticated using (true);
create policy "Admins manage email templates" on public.email_templates for all to authenticated using (true);
create policy "Admins view email logs" on public.email_logs for select to authenticated using (true);

create policy "Admins can manage all appointments"
  on appointments
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super_admin')
    )
  );

-- Enhanced Availability Function (RPC)
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

