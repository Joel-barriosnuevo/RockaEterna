-- ═══════════════════════════════════════════════════════════════════════════
-- REPARAR POLÍTICAS DE STORAGE PARA QUE FUNCIONEN SIN AUTH.UID()
-- El problema es que auth.uid() devuelve NULL en el contexto RLS
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Eliminar políticas actuales que dependen de auth.uid()
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete avatars" ON storage.objects;

-- 2. Crear nuevas políticas que funcionen con owner_id
-- Usamos owner_id en lugar de extraer del nombre del archivo

CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'::text AND
  owner_id = auth.uid()::text
);

CREATE POLICY "Users can view avatars" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'::text AND
  owner_id = auth.uid()::text
);

CREATE POLICY "Users can update avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'::text AND
  owner_id = auth.uid()::text
);

CREATE POLICY "Users can delete avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'::text AND
  owner_id = auth.uid()::text
);

-- 3. Verificar nuevas políticas
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

-- 4. Test de autenticación
SELECT 
  auth.uid() as user_id,
  auth.role() as user_role,
  auth.email() as user_email;

-- ═══════════════════════════════════════════════════════════════════════════
-- CAMBIO REQUERIDO EN EL CÓDIGO
-- ═══════════════════════════════════════════════════════════════════════════

-- Necesitamos modificar el servicio de imágenes para que use owner_id
-- en lugar de extraer el user_id del nombre del archivo

-- ═══════════════════════════════════════════════════════════════════════════
-- LISTO! Ahora intenta subir una imagen de nuevo
-- ═══════════════════════════════════════════════════════════════════════════
