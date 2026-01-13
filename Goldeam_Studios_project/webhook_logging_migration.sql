-- Create a table to log webhook errors for debugging
CREATE TABLE IF NOT EXISTS public.webhook_errors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text,
  error_message text,
  payload jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS (Optional, but good practice)
ALTER TABLE public.webhook_errors ENABLE ROW LEVEL SECURITY;

-- Allow admins to view errors
create policy "Admins view webhook errors"
  on webhook_errors
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super_admin')
    )
  );
