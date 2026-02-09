-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public to insert messages
CREATE POLICY "Enable insert for everyone" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- Allow only authenticated users (admins) to view messages
CREATE POLICY "Enable select for authenticated users only" ON public.contact_messages
    FOR SELECT TO authenticated USING (true);
