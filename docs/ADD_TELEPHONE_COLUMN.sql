-- ═══════════════════════════════════════════════════════════════════════════
-- AGREGAR COLUMNA TELÉFONO A LA TABLA USUARIOS
-- Ejecutar en la consola SQL de Supabase
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Agregar la columna teléfono a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN telefono TEXT;

-- 2. Opcional: Agregar comentario a la columna
COMMENT ON COLUMN usuarios.telefono IS 'Número de teléfono del usuario';

-- 3. Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Opcional: Actualizar usuarios existentes con teléfono de auth.users si existe
-- UPDATE usuarios u 
-- SET telefono = (
--   SELECT raw_user_meta_data->>'telefono' 
--   FROM auth.users a 
--   WHERE a.id = u.id 
--   AND raw_user_meta_data->>'telefono' IS NOT NULL
-- )
-- WHERE EXISTS (
--   SELECT 1 
--   FROM auth.users a 
--   WHERE a.id = usuarios.id 
--   AND raw_user_meta_data->>'telefono' IS NOT NULL
-- );

-- ═══════════════════════════════════════════════════════════════════════════
-- LISTO! La columna teléfono ahora existe en la tabla usuarios
-- ═══════════════════════════════════════════════════════════════════════════
