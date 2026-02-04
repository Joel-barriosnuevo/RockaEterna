-- ═══════════════════════════════════════════════════════════════════════════
-- ARREGLAR POLÍTICA FALTANTE DE STORAGE
-- Agregar la política SELECT que falta para ver avatares
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Agregar la política SELECT que falta
CREATE POLICY "Users can view avatars" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. Verificar que ahora tengamos las 4 políticas completas
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
ORDER BY cmd;

-- 3. Verificar estado de RLS (versión compatible)
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'storage' 
  AND tablename = 'objects';

-- 4. Verificar bucket
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE name = 'avatars';

-- ═══════════════════════════════════════════════════════════════════════════
-- RESULTADO ESPERADO
-- ═══════════════════════════════════════════════════════════════════════════

-- Deberías ver 4 políticas:
-- 1. Users can upload avatars (INSERT)
-- 2. Users can view avatars (SELECT) ← ESTA ES LA QUE FALTABA
-- 3. Users can update avatars (UPDATE)
-- 4. Users can delete avatars (DELETE)

-- ═══════════════════════════════════════════════════════════════════════════
-- LISTO! Ahora intenta subir una imagen de nuevo
-- ═══════════════════════════════════════════════════════════════════════════
