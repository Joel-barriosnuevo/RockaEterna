import { useState, useEffect, useCallback } from 'react'
import { miembrosService } from '../services/miembros.service'
import type { Miembro, Rol, NuevoMiembro, ActualizarMiembro } from '../types/database.types'

// ═══════════════════════════════════════════════════════════════════════════
// HOOK: useMiembros
// ═══════════════════════════════════════════════════════════════════════════
export function useMiembros(filters?: {
  search?: string
  activo?: boolean
  rol?: number
}) {
  const [miembros, setMiembros] = useState<Miembro[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMiembros = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await miembrosService.getAll(filters)
      setMiembros(data as Miembro[])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'))
    } finally {
      setLoading(false)
    }
  }, [filters?.search, filters?.activo, filters?.rol])

  useEffect(() => {
    fetchMiembros()
  }, [fetchMiembros])

  const createMiembro = async (miembro: NuevoMiembro) => {
    const newMiembro = await miembrosService.create(miembro)
    setMiembros(prev => [newMiembro as Miembro, ...prev])
    return newMiembro
  }

  const updateMiembro = async (id: string, updates: ActualizarMiembro) => {
    const updated = await miembrosService.update(id, updates)
    setMiembros(prev => prev.map(m => m.id === id ? updated as Miembro : m))
    return updated
  }

  const deleteMiembro = async (id: string) => {
    await miembrosService.delete(id)
    setMiembros(prev => prev.filter(m => m.id !== id))
  }

  const toggleActivo = async (id: string, activo: boolean) => {
    const updated = await miembrosService.toggleActivo(id, activo)
    setMiembros(prev => prev.map(m => m.id === id ? updated as Miembro : m))
    return updated
  }

  return {
    miembros,
    loading,
    error,
    refetch: fetchMiembros,
    createMiembro,
    updateMiembro,
    deleteMiembro,
    toggleActivo,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK: useRoles
// ═══════════════════════════════════════════════════════════════════════════
export function useRoles() {
  const [roles, setRoles] = useState<Rol[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await miembrosService.getRoles()
        setRoles(data)
      } catch (err) {
        console.error('Error cargando roles:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { roles, loading }
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK: useMiembro (individual)
// ═══════════════════════════════════════════════════════════════════════════
export function useMiembro(id: string | undefined) {
  const [miembro, setMiembro] = useState<Miembro | null>(null)
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
        const data = await miembrosService.getById(id)
        setMiembro(data as Miembro)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error desconocido'))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  return { miembro, loading, error }
}
