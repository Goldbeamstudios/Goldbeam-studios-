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

-- Backfill for the user currently encountering errors (62682f9d-32d6-4d1c-b3f2-2960d6323a8c)
insert into public.profiles (id, email, role)
values ('62682f9d-32d6-4d1c-b3f2-2960d6323a8c', 'admin@goldbeam.com', 'super_admin')
on conflict (id) do nothing;

-- Create appointments table for Square API integration
create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  square_booking_id text unique,
  customer_id uuid references auth.users null,
  customer_name text not null,
  customer_email text not null,
  plan_type text not null check (plan_type in ('audio', 'audio_video', 'general')),
  studio text not null check (studio in ('A', 'B')),
  theme text,
  duration_hours int not null,
  addons jsonb default '[]'::jsonb,
  total_price decimal(10, 2) not null,
  booking_date date not null,
  start_time time not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on appointments
alter table public.appointments enable row level security;

-- Policies for appointments
create policy "Users can view their own appointments."
  on appointments for select
  using ( auth.uid() = customer_id );

create policy "Users can insert their own appointments."
  on appointments for insert
  with check ( auth.uid() = customer_id );

-- Admin can view/edit all appointments
create policy "Admins can manage all appointments."
  on appointments
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super_admin')
    )
  );

