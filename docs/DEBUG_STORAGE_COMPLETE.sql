-- ═══════════════════════════════════════════════════════════════════════════
-- DIAGNÓSTICO COMPLETO DE SUPABASE STORAGE
-- Para encontrar la causa real del error RLS
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Verificar usuario actual (muy importante)
SELECT 
  auth.uid() as user_id,
  auth.role() as user_role,
  auth.email() as user_email;

-- 2. Verificar bucket avatars
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE name = 'avatars';

-- 3. Verificar TODAS las políticas de storage.objects
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
ORDER BY policyname;

-- 4. Verificar estado de RLS
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'storage' 
  AND tablename = 'objects';

-- 5. Verificar si hay objetos en el bucket
SELECT 
  id,
  name,
  bucket_id,
  owner_id,
  created_at,
  metadata
FROM storage.objects 
WHERE bucket_id = 'avatars'
ORDER BY created_at DESC
LIMIT 5;

-- 6. Test de ruta de carpeta (crítico para las políticas)
SELECT 
  auth.uid() as user_id,
  'avatars/' || auth.uid() || '/test.jpg' as expected_path,
  (storage.foldername('avatars/' || auth.uid() || '/test.jpg'))[1] as folder_part;

-- ═══════════════════════════════════════════════════════════════════════════
-- ANÁLISIS DE RESULTADOS
-- ═══════════════════════════════════════════════════════════════════════════

-- Si auth.uid() es NULL:
-- → El usuario no está autenticado correctamente

-- Si el bucket 'avatars' no existe:
-- → Necesitas crear el bucket

-- Si las políticas existen pero no funcionan:
-- → Puede ser un problema con la función storage.foldername()

-- Si la ruta de carpeta no funciona:
-- → Las políticas están mal escritas

-- ═══════════════════════════════════════════════════════════════════════════
-- PRUEBA MANUAL (opcional)
-- ═══════════════════════════════════════════════════════════════════════════

-- Para probar manualmente la política de subida:
-- Reemplaza 'your-user-id' con el resultado de auth.uid() de arriba

-- INSERT INTO storage.objects (bucket_id, name, owner_id)
-- VALUES ('avatars', 'your-user-id/test.txt', 'your-user-id');

-- ═══════════════════════════════════════════════════════════════════════════
-- LISTO! Ejecuta esto y dime qué resultados obtienes
-- ═══════════════════════════════════════════════════════════════════════════
