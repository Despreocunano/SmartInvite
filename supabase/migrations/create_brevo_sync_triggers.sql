-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to call Brevo sync endpoint
CREATE OR REPLACE FUNCTION sync_to_brevo()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function
  PERFORM net.http_post(
    url := 'https://ubpbfnuzcbqtahmxbuft.supabase.co/functions/v1/sync-brevo',
    headers := '{"Content-Type": "application/json", "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicGJmbnV6Y2JxdGFobXhidWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MzI5OTYsImV4cCI6MjA2MDUwODk5Nn0.6mgiOTyNY5ZiaLbryCJ5NPpgRH8cBNjPUnyLDgYfVrM"}'::jsonb,
    body := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'record', to_jsonb(NEW),
      'old_record', to_jsonb(OLD)
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for users table
CREATE TRIGGER users_brevo_sync_insert
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION sync_to_brevo();

CREATE TRIGGER users_brevo_sync_update
  AFTER UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION sync_to_brevo();

-- Create triggers for landing_pages table
CREATE TRIGGER landing_pages_brevo_sync_insert
  AFTER INSERT ON landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION sync_to_brevo();

CREATE TRIGGER landing_pages_brevo_sync_update
  AFTER UPDATE ON landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION sync_to_brevo(); 