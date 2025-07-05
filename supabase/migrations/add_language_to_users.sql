-- Add language column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS language VARCHAR(2) DEFAULT 'es';

-- Update existing users to have Spanish as default language
UPDATE users 
SET language = 'es' 
WHERE language IS NULL; 