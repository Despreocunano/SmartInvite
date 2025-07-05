-- Add currency column to payments table
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'clp';

-- Update existing payments to have CLP as default currency
UPDATE payments 
SET currency = 'clp' 
WHERE currency IS NULL; 