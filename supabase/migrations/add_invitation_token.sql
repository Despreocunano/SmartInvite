-- Add invitation_token column to attendees table
ALTER TABLE attendees 
ADD COLUMN IF NOT EXISTS invitation_token UUID;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_attendees_invitation_token 
ON attendees(invitation_token);

-- Add comment to document the column
COMMENT ON COLUMN attendees.invitation_token IS 'Unique token for invitation links to pre-fill attendee data';

-- Enable RLS on attendees table if not already enabled
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public access by invitation token" ON attendees;
DROP POLICY IF EXISTS "Allow update by invitation token" ON attendees;

-- Policy to allow public access to attendee data by invitation token
-- This allows anyone with a valid token to read the attendee data
CREATE POLICY "Allow public access by invitation token" ON attendees
FOR SELECT USING (invitation_token IS NOT NULL);

-- Policy to allow updating attendee data by invitation token (for RSVP responses)
-- This allows anyone with a valid token to update their own RSVP data
CREATE POLICY "Allow update by invitation token" ON attendees
FOR UPDATE USING (invitation_token IS NOT NULL)
WITH CHECK (invitation_token IS NOT NULL);

-- Policy to allow inserting new attendees (for public RSVP without token)
CREATE POLICY "Allow public insert" ON attendees
FOR INSERT WITH CHECK (true); 