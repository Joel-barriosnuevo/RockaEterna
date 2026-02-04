import { useState, useCallback } from 'react'
import { imagesService, type UploadOptions, type UploadResult } from '../services/images.service'

export interface UseImageUploadOptions extends UploadOptions {
  onSuccess?: (result: UploadResult) => void
  onError?: (error: Error) => void
}

export interface UseImageUploadReturn {
  uploadFile: (file: File, userId?: string) => Promise<UploadResult | null>
  isUploading: boolean
  error: string | null
  progress: number
  clearError: () => void
  reset: () => void
}

/**
 * Hook personalizado para manejar la subida de imágenes
 * Proporciona estado y funciones para subir archivos con feedback al usuario
 */
export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Resetear todos los estados
  const reset = useCallback(() => {
    setIsUploading(false)
    setError(null)
    setProgress(0)
  }, [])

  // Subir archivo
  const uploadFile = useCallback(async (
    file: File, 
    userId?: string
  ): Promise<UploadResult | null> => {
    // Limpiar estados previos
    clearError()
    setIsUploading(true)
    setProgress(0)

    try {
      // Simular progreso (Supabase no proporciona progreso nativo)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Subir archivo
      const result = await imagesService.uploadImage(file, userId, options)

      // Completar progreso
      clearInterval(progressInterval)
      setProgress(100)

      // Llamar callback de éxito
      if (options.onSuccess) {
        options.onSuccess(result)
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al subir la imagen'
      setError(errorMessage)

      // Llamar callback de error
      if (options.onError) {
        options.onError(err instanceof Error ? err : new Error(errorMessage))
      }

      return null
    } finally {
      setIsUploading(false)
      // Resetear progreso después de un breve tiempo
      setTimeout(() => setProgress(0), 1000)
    }
  }, [options])

  return {
    uploadFile,
    isUploading,
    error,
    progress,
    clearError,
    reset
  }
}

/**
 * Hook simplificado para subida de avatares
 * Con configuración predefinida para avatares de usuario
 */
export function useAvatarUpload(userId?: string) {
  const uploadOptions: UseImageUploadOptions = {
    bucket: 'avatars',
    folder: userId || 'temp', // Usar el userId como carpeta o 'temp' si no hay userId
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    onSuccess: (result) => {
      console.log('Avatar subido exitosamente:', result.url)
    },
    onError: (error) => {
      console.error('Error al subir avatar:', error.message)
    }
  }

  const { uploadFile, isUploading, error, progress, clearError, reset } = useImageUpload(uploadOptions)

  // Wrapper que incluye el userId automáticamente
  const uploadAvatar = useCallback(async (file: File) => {
    return await uploadFile(file, userId)
  }, [uploadFile, userId])

  return {
    uploadFile: uploadAvatar,
    isUploading,
    error,
    progress,
    clearError,
    reset
  }
}
