# Configuración de Supabase Storage para Subida de Imágenes

## 📋 Resumen de Configuración Necesaria

Para que el servicio de subida de imágenes funcione correctamente, necesitas configurar:

1. **Bucket de Storage** llamado `avatars`
2. **Políticas de Acceso** (Row Level Security)
3. **Variables de Entorno** (ya configuradas)

---

## 🗄️ 1. Crear Bucket de Storage

### Opción A: Desde la Consola de Supabase

1. Ve a [tu proyecto Supabase](https://supabase.com/dashboard)
2. Navega a **Storage** en el menú lateral
3. Haz clic en **"New bucket"**
4. Configura el bucket:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Marcado
   - **File size limit**: `5242880` (5MB)
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`

### Opción B: Automático (con el servicio)

El servicio incluye un método `createAvatarsBucket()` que puede crear el bucket automáticamente, pero las políticas deben configurarse manualmente.

---

## 🔐 2. Configurar Políticas de Acceso (RLS)

Las políticas son **CRÍTICAS** para que el storage funcione. Ve a **Authentication > Policies** en la consola de Supabase y ejecuta estos SQL:

### Política 1: Acceso Público de Lectura
```sql
-- Permitir lectura pública de archivos en el bucket avatars
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

### Política 2: Usuarios Autenticados Pueden Subir
```sql
-- Permitir a usuarios autenticados subir archivos a su carpeta
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Política 3: Usuarios Pueden Actualizar sus Archivos
```sql
-- Permitir a usuarios actualizar sus propios archivos
CREATE POLICY "Users can update avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Política 4: Usuarios Pueden Eliminar sus Archivos
```sql
-- Permitir a usuarios eliminar sus propios archivos
CREATE POLICY "Users can delete avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 🌍 3. Variables de Entorno (Verificar)

Asegúrate que estas variables existan en tu `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🧪 4. Verificar Configuración

### Script de Prueba
Puedes usar este script para verificar que todo funciona:

```javascript
import { supabase } from './src/lib/supabase'

async function testStorage() {
  try {
    // 1. Verificar bucket existe
    const { data: buckets } = await supabase.storage.listBuckets()
    const avatarsExists = buckets?.some(b => b.name === 'avatars')
    console.log('Bucket avatars existe:', avatarsExists)

    // 2. Probar subida
    const testFile = new Blob(['test'], { type: 'text/plain' })
    const fileName = `test-${Date.now()}.txt`
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, testFile)
    
    console.log('Error de subida:', uploadError)

    // 3. Limpiar
    if (!uploadError) {
      await supabase.storage.from('avatars').remove([fileName])
    }
  } catch (error) {
    console.error('Error en prueba:', error)
  }
}

testStorage()
```

---

## 🚨 5. Problemas Comunes y Soluciones

### Error: "Bucket not found"
**Causa**: El bucket `avatars` no existe
**Solución**: Crea el bucket desde la consola de Supabase

### Error: "Permission denied"
**Causa**: Faltan políticas de RLS
**Solución**: Ejecuta las políticas SQL mencionadas arriba

### Error: "File too large"
**Causa**: Archivo excede el límite del bucket
**Solución**: Aumenta el límite o reduce el tamaño del archivo

### Error: "Invalid MIME type"
**Causa**: Tipo de archivo no permitido
**Solución**: Verifica los MIME types permitidos en la configuración del bucket

---

## 🔧 6. Configuración Adicional (Opcional)

### Transformaciones de Imagen
Puedes habilitar transformaciones automáticas:

```sql
-- Habilitar transformaciones
INSERT INTO storage.transformations (name, enabled) 
VALUES ('avatar-resize', true);
```

### CDN para Mejor Performance
Considera usar un CDN para las imágenes en producción.

---

## ✅ 7. Checklist Final

- [ ] Bucket `avatars` creado
- [ ] Bucket configurado como público
- [ ] Límite de tamaño: 5MB
- [ ] MIME types permitidos configurados
- [ ] Políticas RLS aplicadas
- [ ] Variables de entorno verificadas
- [ ] Prueba de subida exitosa

---

## 📞 8. Soporte

Si tienes problemas:

1. **Revisa la consola de Supabase** para errores específicos
2. **Verifica las políticas RLS** en Authentication > Policies
3. **Usa el script de prueba** para diagnosticar
4. **Revisa las variables de entorno** en tu proyecto

---

## 🎯 9. Próximos Pasos

Una vez configurado:

1. **Prueba la subida** en la página de configuración
2. **Verifica que las imágenes** se guarden correctamente
3. **Confirma que las URLs públicas** funcionen
4. **Monitorea el uso** del storage en el dashboard de Supabase

¡Con esta configuración, tu servicio de subida de imágenes funcionará perfectamente! 🚀
