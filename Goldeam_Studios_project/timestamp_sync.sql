-- Create a simple SQL function to return the current database timestamp.
CREATE OR REPLACE FUNCTION public.get_server_time()
RETURNS timestamp with time zone
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN now();
END;
$$;
