import { supabase } from '../lib/supabase'

/**
 * Servicio para configurar y administrar buckets de Supabase Storage
 */
export class StorageService {
  /**
   * Crea el bucket 'avatars' si no existe
   */
  async createAvatarsBucket(): Promise<void> {
    try {
      // Verificar si el bucket ya existe
      const { data: buckets } = await supabase.storage.listBuckets()
      const avatarsExists = buckets?.some(bucket => bucket.name === 'avatars')

      if (!avatarsExists) {
        // Crear el bucket
        const { error } = await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        })

        if (error) {
          console.error('Error al crear bucket avatars:', error)
          throw new Error('No se pudo crear el bucket de avatares')
        }

        // Configurar políticas de acceso público
        await this.setupAvatarsPolicies()
        
        console.log('Bucket avatars creado exitosamente')
      }
    } catch (error) {
      console.error('Error en createAvatarsBucket:', error)
      throw error
    }
  }

  /**
   * Configura las políticas de acceso para el bucket avatars
   */
  private async setupAvatarsPolicies(): Promise<void> {
    // Nota: Las políticas de Row Level Security (RLS) deben configurarse
    // directamente en la consola de Supabase. Esta función es solo para referencia.
    
    // SQL que debe ejecutarse en la consola de Supabase:
    /*
    -- Permitir lectura pública de archivos en el bucket avatars
    CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

    -- Permitir a usuarios autenticados subir archivos a su carpeta
    CREATE POLICY "Users can upload avatars" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'avatars' AND 
      auth.role() = 'authenticated' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );

    -- Permitir a usuarios actualizar sus propios archivos
    CREATE POLICY "Users can update avatars" ON storage.objects
    FOR UPDATE USING (
      bucket_id = 'avatars' AND 
      auth.role() = 'authenticated' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );

    -- Permitir a usuarios eliminar sus propios archivos
    CREATE POLICY "Users can delete avatars" ON storage.objects
    FOR DELETE USING (
      bucket_id = 'avatars' AND 
      auth.role() = 'authenticated' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
    */
    
    console.log('Las políticas de RLS deben configurarse manualmente en la consola de Supabase')
  }

  /**
   * Verifica si el bucket avatars está configurado correctamente
   */
  async checkAvatarsBucket(): Promise<{ exists: boolean; configured: boolean }> {
    try {
      // Verificar si el bucket existe
      const { data: buckets } = await supabase.storage.listBuckets()
      const avatarsExists = buckets?.some(bucket => bucket.name === 'avatars')

      if (!avatarsExists) {
        return { exists: false, configured: false }
      }

      // Intentar subir un archivo de prueba para verificar configuración
      const testFile = new Blob(['test'], { type: 'text/plain' })
      const testFileName = `test-${Date.now()}.txt`
      
      try {
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(testFileName, testFile, { upsert: true })

        if (uploadError) {
          return { exists: true, configured: false }
        }

        // Limpiar archivo de prueba
        await supabase.storage.from('avatars').remove([testFileName])
        
        return { exists: true, configured: true }
      } catch (testError) {
        return { exists: true, configured: false }
      }
    } catch (error) {
      console.error('Error al verificar bucket avatars:', error)
      return { exists: false, configured: false }
    }
  }
}

export const storageService = new StorageService()
