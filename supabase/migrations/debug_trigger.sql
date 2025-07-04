-- Trigger de debug para verificar que se ejecute
CREATE OR REPLACE FUNCTION debug_brevo_sync()
RETURNS TRIGGER AS $$
BEGIN
  -- Log para debug
  RAISE LOG 'Trigger ejecutado: % en tabla %', TG_OP, TG_TABLE_NAME;
  RAISE LOG 'Nuevo registro: %', to_jsonb(NEW);
  IF TG_OP = 'UPDATE' THEN
    RAISE LOG 'Registro anterior: %', to_jsonb(OLD);
  END IF;
  
  -- Llamar a la función original
  RETURN sync_to_brevo();
END;
$$ LANGUAGE plpgsql;

-- Reemplazar el trigger existente con el de debug
DROP TRIGGER IF EXISTS landing_pages_brevo_sync_insert ON landing_pages;
CREATE TRIGGER landing_pages_brevo_sync_insert
  AFTER INSERT ON landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION debug_brevo_sync();

DROP TRIGGER IF EXISTS landing_pages_brevo_sync_update ON landing_pages;
CREATE TRIGGER landing_pages_brevo_sync_update
  AFTER UPDATE ON landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION debug_brevo_sync(); 