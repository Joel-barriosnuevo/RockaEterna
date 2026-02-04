import { useState, useEffect } from 'react'
import { storageService } from '../services/storage.service'

export interface UseStorageSetupReturn {
  isConfigured: boolean
  isChecking: boolean
  error: string | null
  setupStorage: () => Promise<void>
}

/**
 * Hook para verificar y configurar el storage de Supabase
 * Útil para asegurar que los buckets necesarios existan antes de usar el servicio de imágenes
 */
export function useStorageSetup(): UseStorageSetupReturn {
  const [isConfigured, setIsConfigured] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setupStorage = async () => {
    setIsChecking(true)
    setError(null)
    
    try {
      // Verificar y crear bucket de avatares
      const { exists, configured } = await storageService.checkAvatarsBucket()
      
      if (!exists) {
        console.log('Creando bucket de avatares...')
        await storageService.createAvatarsBucket()
      } else if (!configured) {
        console.warn('El bucket avatars existe pero no está configurado correctamente')
        setError('El bucket de avatares necesita configuración manual en la consola de Supabase')
      } else {
        console.log('Bucket de avatares configurado correctamente')
      }
      
      setIsConfigured(exists && configured)
    } catch (err) {
      console.error('Error al configurar storage:', err)
      setError('Error al configurar el almacenamiento de imágenes')
      setIsConfigured(false)
    } finally {
      setIsChecking(false)
    }
  }

  // Verificar configuración al montar el componente
  useEffect(() => {
    setupStorage()
  }, [])

  return {
    isConfigured,
    isChecking,
    error,
    setupStorage
  }
}
