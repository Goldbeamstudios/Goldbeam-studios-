-- Migration: Add customer_phone to appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Verify the column was added
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='appointments' AND column_name='customer_phone') THEN
        RAISE EXCEPTION 'Column customer_phone was not created';
    END IF;
END $$;
