-- ═══════════════════════════════════════════════════════════════════════════
-- CONFIGURACIÓN RÁPIDA DE SUPABASE STORAGE
-- Copia y pega estos comandos en la consola SQL de Supabase
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Crear bucket de avatars (si no existe)
-- NOTA: Esto debe hacerse desde la UI de Storage, no por SQL
-- Ve a: Storage > New bucket > Name: "avatars" > Public: true

-- 2. Políticas de acceso (ejecutar en orden)
-- =============================================

-- Política 1: Acceso público de lectura
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Política 2: Usuarios autenticados pueden subir
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política 3: Usuarios pueden actualizar sus archivos
CREATE POLICY "Users can update avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política 4: Usuarios pueden eliminar sus archivos
CREATE POLICY "Users can delete avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Verificar configuración
-- =========================

-- Verificar bucket existe
SELECT * FROM storage.buckets WHERE name = 'avatars';

-- Verificar políticas aplicadas
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- 4. Prueba rápida (opcional)
-- ==========================

-- Para probar, puedes ejecutar esto después de configurar todo:
-- NOTA: Reemplaza 'your-user-id' con un ID de usuario real

-- INSERT INTO storage.objects (bucket_id, name, owner_id)
-- VALUES ('avatars', 'your-user-id/test.txt', 'your-user-id');

-- ═══════════════════════════════════════════════════════════════════════════
-- LISTO! Ahora tu servicio de subida de imágenes debería funcionar
-- ═══════════════════════════════════════════════════════════════════════════
