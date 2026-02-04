import { supabase } from '../lib/supabase'

// Tipos para el servicio de imágenes
export interface UploadOptions {
  bucket?: string
  folder?: string
  maxSize?: number // en bytes
  allowedTypes?: string[]
}

export interface UploadResult {
  url: string
  path: string
  size: number
  contentType: string
}

export interface ImageValidationError {
  code: 'INVALID_TYPE' | 'FILE_TOO_LARGE' | 'UPLOAD_FAILED'
  message: string
}

// Configuración por defecto
const DEFAULT_OPTIONS: Required<UploadOptions> = {
  bucket: 'avatars',
  folder: 'avatars',
  maxSize: 2 * 1024 * 1024, // 2MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}

/**
 * Servicio para manejar la subida de imágenes a Supabase Storage
 */
export class ImagesService {
  /**
   * Valida un archivo antes de subirlo
   */
  private validateFile(file: File, options: UploadOptions): ImageValidationError | null {
    const opts = { ...DEFAULT_OPTIONS, ...options }

    // Validar tipo de archivo
    if (!opts.allowedTypes.includes(file.type)) {
      return {
        code: 'INVALID_TYPE',
        message: `Tipo de archivo no permitido. Se permiten: ${opts.allowedTypes.join(', ')}`
      }
    }

    // Validar tamaño
    if (file.size > opts.maxSize) {
      const maxSizeMB = Math.round(opts.maxSize / (1024 * 1024) * 10) / 10
      return {
        code: 'FILE_TOO_LARGE',
        message: `El archivo es demasiado grande. Máximo permitido: ${maxSizeMB}MB`
      }
    }

    return null
  }

  /**
   * Genera un nombre de archivo único
   */
  private generateFileName(file: File, userId?: string): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop()
    const prefix = userId ? `${userId}-` : ''
    
    return `${prefix}${timestamp}-${randomString}.${extension}`
  }

  /**
   * Genera la ruta completa del archivo
   */
  private generatePath(folder: string, fileName: string, bucket: string): string {
    // Simplemente concatenar folder y fileName
    // Supabase Storage maneja el bucket automáticamente
    return `${folder}/${fileName}`
  }

  /**
   * Sube una imagen a Supabase Storage
   */
  async uploadImage(
    file: File, 
    userId?: string, 
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const opts = { ...DEFAULT_OPTIONS, ...options }

    // Validar archivo
    const validationError = this.validateFile(file, opts)
    if (validationError) {
      throw new Error(validationError.message)
    }

    try {
      // Generar nombre y ruta únicos
      const fileName = this.generateFileName(file, userId)
      const filePath = this.generatePath(opts.folder, fileName, opts.bucket)

      // Subir archivo a Supabase Storage con owner_id
      const { data, error } = await supabase.storage
        .from(opts.bucket)
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600', // 1 hora de caché
          upsert: false, // No sobreescribir archivos existentes
          metadata: {
            owner_id: userId,
            size: file.size,
            contentType: file.type
          }
        })

      if (error) {
        console.error('Error al subir imagen:', error)
        throw new Error('Error al subir la imagen. Por favor, inténtalo de nuevo.')
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(opts.bucket)
        .getPublicUrl(filePath)

      return {
        url: publicUrl,
        path: filePath,
        size: file.size,
        contentType: file.type
      }
    } catch (error) {
      console.error('Error en uploadImage:', error)
      throw error
    }
  }

  /**
   * Elimina una imagen de Supabase Storage
   */
  async deleteImage(url: string, bucket: string = DEFAULT_OPTIONS.bucket): Promise<void> {
    try {
      // Extraer el path de la URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(url)

      // El path está en data.publicUrl, necesitamos extraerlo
      const path = url.split('/').pop()
      
      if (!path) {
        throw new Error('No se pudo determinar la ruta del archivo')
      }

      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) {
        console.error('Error al eliminar imagen:', error)
        throw new Error('Error al eliminar la imagen')
      }
    } catch (error) {
      console.error('Error en deleteImage:', error)
      throw error
    }
  }

  /**
   * Obtiene la URL pública de una imagen
   */
  getPublicUrl(path: string, bucket: string = DEFAULT_OPTIONS.bucket): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  }

  /**
   * Verifica si un archivo existe en el storage
   */
  async fileExists(path: string, bucket: string = DEFAULT_OPTIONS.bucket): Promise<boolean> {
    try {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)
      
      // Intentar acceder a la URL para verificar si existe
      const response = await fetch(data.publicUrl, { method: 'HEAD' })
      return response.ok
    } catch (error) {
      return false
    }
  }
}

// Exportar instancia única del servicio
export const imagesService = new ImagesService()
