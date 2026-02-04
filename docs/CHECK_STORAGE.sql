-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICAR ESTADO DE SUPABASE STORAGE
-- Ejecutar para diagnosticar problemas con las políticas RLS
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Verificar si el bucket avatars existe
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE name = 'avatars';

-- 2. Verificar políticas actuales para storage.objects
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
  AND policyname LIKE '%avatars%'
ORDER BY policyname;

-- 3. Verificar estado de RLS en la tabla storage.objects
SELECT 
  tablename,
  rowsecurity,
  forcerlspolicy
FROM pg_tables 
WHERE schemaname = 'storage' 
  AND tablename = 'objects';

-- 4. Verificar usuario actual y rol
SELECT 
  auth.uid() as user_id,
  auth.role() as user_role,
  auth.email() as user_email;

-- 5. Verificar si hay algún objeto en el bucket avatares
SELECT 
  id,
  name,
  bucket_id,
  owner_id,
  created_at,
  updated_at,
  metadata
FROM storage.objects 
WHERE bucket_id = 'avatars'
ORDER BY created_at DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- DIAGNÓSTICO
-- ═══════════════════════════════════════════════════════════════════════════

-- Si NO ves el bucket 'avatars' en la primera consulta:
-- → Necesitas crear el bucket manualmente en la consola de Supabase

-- Si NO ves políticas en la segunda consulta:
-- → Las políticas no existen, necesitas ejecutar el script de creación

-- Si ves PERO las políticas no funcionan:
-- → Las políticas pueden estar mal configuradas, necesitas reemplazarlas

-- ═══════════════════════════════════════════════════════════════════════════
-- ACCIONES RECOMENDADAS
-- ═══════════════════════════════════════════════════════════════════════════

-- Si necesitas eliminar y recrear las políticas, ejecuta:

-- DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can view avatars" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can update avatars" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can delete avatars" ON storage.objects;

-- Luego ejecuta las políticas CREATE POLICY correspondientes

-- ═══════════════════════════════════════════════════════════════════════════
-- LISTO! Revisa los resultados de las consultas para diagnosticar el problema
-- ═══════════════════════════════════════════════════════════════════════════
