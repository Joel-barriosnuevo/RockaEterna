-- ═══════════════════════════════════════════════════════════════════════════
-- TRIGGER PARA CREAR PERFIL DE USUARIO CON TELÉFONO
-- Se ejecuta cuando un nuevo usuario se registra en auth.users
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Función que crea el perfil del usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en la tabla usuarios con todos los datos del registro
  INSERT INTO public.usuarios (id, email, nombre, apellido, telefono, is_admin, activo, tema)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'apellido', 'Sin apellido'),
    COALESCE(NEW.raw_user_meta_data->>'telefono', NULL),
    false, -- Por defecto no es admin
    true,  -- Por defecto está activo
    'system' -- Tema por defecto
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Eliminar el trigger si ya existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Crear el trigger que se ejecuta después de insertar un nuevo usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Opcional: Función para actualizar usuarios existentes que no tienen teléfono
CREATE OR REPLACE FUNCTION public.update_user_phone_from_auth()
RETURNS void AS $$
BEGIN
  UPDATE public.usuarios u
  SET telefono = a.raw_user_meta_data->>'telefono'
  FROM auth.users a
  WHERE a.id = u.id
    AND a.raw_user_meta_data->>'telefono' IS NOT NULL
    AND (u.telefono IS NULL OR u.telefono = '');
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN
-- ═══════════════════════════════════════════════════════════════════════════

-- Verificar que el trigger existe
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  tgfoid::regproc as function_name
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Verificar que la función existe
SELECT 
  proname as function_name,
  prosrc as source_code
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- ═══════════════════════════════════════════════════════════════════════════
-- ACTUALIZAR USUARIOS EXISTENTES (Opcional)
-- ═══════════════════════════════════════════════════════════════════════════

-- Para actualizar usuarios existentes que no tienen teléfono:
-- SELECT public.update_user_phone_from_auth();

-- ═══════════════════════════════════════════════════════════════════════════
-- LISTO! Ahora los nuevos usuarios se crearán con teléfono en la tabla usuarios
-- ═══════════════════════════════════════════════════════════════════════════
