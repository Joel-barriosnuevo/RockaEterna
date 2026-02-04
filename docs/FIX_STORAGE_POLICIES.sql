-- ═══════════════════════════════════════════════════════════════════════════
-- REPARAR POLÍTICAS DE SUPABASE STORAGE PARA AVATARES
-- Ejecutar en la consola SQL de Supabase para arreglar el error RLS
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Eliminar políticas existentes (si existen)
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete avatars" ON storage.objects;

-- Esperar un momento para que se eliminen completamente
DO $$ BEGIN PERFORM pg_sleep(0.1); END $$;

-- 2. Crear bucket de avatares si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', false)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas RLS para el bucket de avatares
-- ============================================

-- Política 1: Usuarios autenticados pueden subir avatares a su carpeta
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política 2: Usuarios autenticados pueden ver sus propios avatares
CREATE POLICY "Users can view avatars" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política 3: Usuarios autenticados pueden actualizar sus avatares
CREATE POLICY "Users can update avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política 4: Usuarios autenticados pueden eliminar sus avatares
CREATE POLICY "Users can delete avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Verificar configuración
-- ========================

-- Verificar bucket existe
SELECT id, name, public FROM storage.buckets WHERE name = 'avatars';

-- Verificar políticas aplicadas
SELECT 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%avatars%';

-- 5. Prueba de conexión (opcional)
-- ============================
-- Para verificar que todo funciona, puedes ejecutar:
-- SELECT auth.uid(); -- Esto debería mostrar tu ID de usuario actual

-- ═══════════════════════════════════════════════════════════════════════════
-- LISTO! Ahora las imágenes deberían poder subirse correctamente
-- ═══════════════════════════════════════════════════════════════════════════

-- 6. Solución de problemas adicionales
-- ==================================

-- Si sigues teniendo problemas, verifica:

-- A. Que el usuario esté autenticado
-- SELECT auth.uid(), auth.role();

-- B. Que el bucket exista y tenga el nombre correcto
-- SELECT * FROM storage.buckets;

-- C. Que las políticas se hayan aplicado correctamente
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- D. Prueba manual de subida (después de ejecutar este script)
-- NOTA: Reemplaza 'test-file.jpg' con una imagen real y 'your-user-id' con auth.uid()

-- INSERT INTO storage.objects (bucket_id, name, owner_id, metadata)
-- VALUES ('avatars', 'your-user-id/test-file.jpg', 'your-user-id', '{"size": 1024}');
