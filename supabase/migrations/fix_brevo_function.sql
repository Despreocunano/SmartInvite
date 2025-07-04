-- Eliminar función anterior si existe
DROP FUNCTION IF EXISTS sync_to_brevo() CASCADE;

-- Crear función corregida
CREATE OR REPLACE FUNCTION sync_to_brevo()
RETURNS TRIGGER AS $$
BEGIN
  -- Log para debug
  RAISE LOG 'sync_to_brevo ejecutado: % en tabla %', TG_OP, TG_TABLE_NAME;
  
  -- Verificar que pg_net esté disponible
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
    RAISE LOG 'pg_net no está habilitado';
    RETURN NEW;
  END IF;
  
  -- Intentar hacer la llamada HTTP
  BEGIN
    PERFORM net.http_post(
      url := 'https://ubpbfnuzcbqtahmxbuft.supabase.co/functions/v1/sync-brevo',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicGJmbnV6Y2JxdGFobXhidWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"}'::jsonb,
      body := jsonb_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'record', to_jsonb(NEW),
        'old_record', to_jsonb(OLD)
      )
    );
    RAISE LOG 'Llamada HTTP exitosa';
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error en llamada HTTP: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers
DROP TRIGGER IF EXISTS landing_pages_brevo_sync_insert ON landing_pages;
CREATE TRIGGER landing_pages_brevo_sync_insert
  AFTER INSERT ON landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION sync_to_brevo();

DROP TRIGGER IF EXISTS landing_pages_brevo_sync_update ON landing_pages;
CREATE TRIGGER landing_pages_brevo_sync_update
  AFTER UPDATE ON landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION sync_to_brevo();

DROP TRIGGER IF EXISTS users_brevo_sync_insert ON users;
CREATE TRIGGER users_brevo_sync_insert
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION sync_to_brevo();

DROP TRIGGER IF EXISTS users_brevo_sync_update ON users;
CREATE TRIGGER users_brevo_sync_update
  AFTER UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION sync_to_brevo(); 