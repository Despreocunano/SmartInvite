-- Trigger simple solo para debug
CREATE OR REPLACE FUNCTION simple_debug_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo hacer logs, sin llamar a HTTP
  RAISE LOG '=== TRIGGER EJECUTADO ===';
  RAISE LOG 'Operación: %', TG_OP;
  RAISE LOG 'Tabla: %', TG_TABLE_NAME;
  RAISE LOG 'Nuevo registro ID: %', NEW.id;
  
  -- No hacer nada más, solo verificar que se ejecuta
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger simple
DROP TRIGGER IF EXISTS simple_debug_landing_pages ON landing_pages;
CREATE TRIGGER simple_debug_landing_pages
  AFTER INSERT OR UPDATE ON landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION simple_debug_trigger(); 