import { useState, useEffect, useCallback } from 'react'
import { cancionesService } from '../services/canciones.service'
import type { Cancion, Categoria, NuevaCancion, ActualizarCancion } from '../types/database.types'

// ═══════════════════════════════════════════════════════════════════════════
// HOOK: useCanciones
// ═══════════════════════════════════════════════════════════════════════════
export function useCanciones(filters?: {
  search?: string
  categoria?: number
  activa?: boolean
}) {
  const [canciones, setCanciones] = useState<Cancion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCanciones = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await cancionesService.getAll(filters)
      setCanciones(data as Cancion[])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'))
    } finally {
      setLoading(false)
    }
  }, [filters?.search, filters?.categoria, filters?.activa])

  useEffect(() => {
    fetchCanciones()
  }, [fetchCanciones])

  const createCancion = async (cancion: NuevaCancion) => {
    const newCancion = await cancionesService.create(cancion)
    setCanciones(prev => [newCancion as Cancion, ...prev])
    return newCancion
  }

  const updateCancion = async (id: string, updates: ActualizarCancion) => {
    const updated = await cancionesService.update(id, updates)
    setCanciones(prev => prev.map(c => c.id === id ? updated as Cancion : c))
    return updated
  }

  const deleteCancion = async (id: string) => {
    await cancionesService.delete(id)
    setCanciones(prev => prev.filter(c => c.id !== id))
  }

  return {
    canciones,
    loading,
    error,
    refetch: fetchCanciones,
    createCancion,
    updateCancion,
    deleteCancion,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK: useCategorias
// ═══════════════════════════════════════════════════════════════════════════
export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await cancionesService.getCategorias()
        setCategorias(data)
      } catch (err) {
        console.error('Error cargando categorías:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { categorias, loading }
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK: useCancion (individual)
// ═══════════════════════════════════════════════════════════════════════════
export function useCancion(id: string | undefined) {
  const [cancion, setCancion] = useState<Cancion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetch = async () => {
      try {
        setLoading(true)
        const data = await cancionesService.getById(id)
        setCancion(data as Cancion)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error desconocido'))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  return { cancion, loading, error }
}
