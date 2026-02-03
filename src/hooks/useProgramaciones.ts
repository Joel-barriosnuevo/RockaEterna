import { useState, useEffect, useCallback } from 'react'
import { programacionesService } from '../services/programaciones.service'
import type { Programacion, TipoServicio, NuevaProgramacion, ActualizarProgramacion } from '../types/database.types'

// ═══════════════════════════════════════════════════════════════════════════
// HOOK: useProgramaciones
// ═══════════════════════════════════════════════════════════════════════════
export function useProgramaciones(filters?: {
  estado?: string
  desde?: string
  hasta?: string
  tipo?: number
}) {
  const [programaciones, setProgramaciones] = useState<Programacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProgramaciones = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await programacionesService.getAll(filters)
      setProgramaciones(data as Programacion[])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'))
    } finally {
      setLoading(false)
    }
  }, [filters?.estado, filters?.desde, filters?.hasta, filters?.tipo])

  useEffect(() => {
    fetchProgramaciones()
  }, [fetchProgramaciones])

  const createProgramacion = async (programacion: NuevaProgramacion) => {
    const newProg = await programacionesService.create(programacion)
    setProgramaciones(prev => [...prev, newProg as Programacion])
    return newProg
  }

  const updateProgramacion = async (id: string, updates: ActualizarProgramacion) => {
    const updated = await programacionesService.update(id, updates)
    setProgramaciones(prev => prev.map(p => p.id === id ? updated as Programacion : p))
    return updated
  }

  const deleteProgramacion = async (id: string) => {
    await programacionesService.delete(id)
    setProgramaciones(prev => prev.filter(p => p.id !== id))
  }

  const updateEstado = async (id: string, estado: string) => {
    const updated = await programacionesService.updateEstado(id, estado)
    setProgramaciones(prev => prev.map(p => p.id === id ? updated as Programacion : p))
    return updated
  }

  return {
    programaciones,
    loading,
    error,
    refetch: fetchProgramaciones,
    createProgramacion,
    updateProgramacion,
    deleteProgramacion,
    updateEstado,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK: useProximasProgramaciones
// ═══════════════════════════════════════════════════════════════════════════
export function useProximasProgramaciones(limit = 5) {
  const [programaciones, setProgramaciones] = useState<Programacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await programacionesService.getProximas(limit)
        setProgramaciones(data as Programacion[])
      } catch (err) {
        console.error('Error cargando próximas programaciones:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [limit])

  return { programaciones, loading }
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK: useTiposServicio
// ═══════════════════════════════════════════════════════════════════════════
export function useTiposServicio() {
  const [tipos, setTipos] = useState<TipoServicio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await programacionesService.getTiposServicio()
        setTipos(data)
      } catch (err) {
        console.error('Error cargando tipos de servicio:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { tipos, loading }
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK: useProgramacion (individual con detalles)
// ═══════════════════════════════════════════════════════════════════════════
export function useProgramacion(id: string | undefined) {
  const [programacion, setProgramacion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProgramacion = useCallback(async () => {
    if (!id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await programacionesService.getById(id)
      setProgramacion(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProgramacion()
  }, [fetchProgramacion])

  // Métodos para modificar la programación
  const addCancion = async (cancionId: string, orden: number, tonoUsado?: string) => {
    if (!id) return
    await programacionesService.addCancion(id, cancionId, orden, tonoUsado)
    await fetchProgramacion()
  }

  const removeCancion = async (cancionId: string) => {
    if (!id) return
    await programacionesService.removeCancion(id, cancionId)
    await fetchProgramacion()
  }

  const addMiembro = async (miembroId: string, rolId?: number) => {
    if (!id) return
    await programacionesService.addMiembro(id, miembroId, rolId)
    await fetchProgramacion()
  }

  const removeMiembro = async (miembroId: string) => {
    if (!id) return
    await programacionesService.removeMiembro(id, miembroId)
    await fetchProgramacion()
  }

  const confirmarMiembro = async (miembroId: string, confirmado: boolean) => {
    if (!id) return
    await programacionesService.confirmarMiembro(id, miembroId, confirmado)
    await fetchProgramacion()
  }

  return {
    programacion,
    loading,
    error,
    refetch: fetchProgramacion,
    addCancion,
    removeCancion,
    addMiembro,
    removeMiembro,
    confirmarMiembro,
  }
}
