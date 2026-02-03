import { supabase } from '../lib/supabase'
import type { Programacion, NuevaProgramacion, ActualizarProgramacion, TipoServicio } from '../types/database.types'

export const programacionesService = {
  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER TODAS LAS PROGRAMACIONES
  // ═══════════════════════════════════════════════════════════════════════════
  async getAll(filters?: {
    estado?: string
    desde?: string
    hasta?: string
    tipo?: number
  }) {
    let query = supabase
      .from('programaciones')
      .select(`
        *,
        tipo_servicio:tipos_servicio(*),
        programacion_miembros(
          id,
          confirmado,
          miembro:miembros(*),
          rol:roles(*)
        ),
        programacion_canciones(
          id,
          orden,
          tono_usado,
          cancion:canciones(*)
        )
      `)
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true })
    
    if (filters?.estado) {
      query = query.eq('estado', filters.estado)
    }
    
    if (filters?.tipo) {
      query = query.eq('tipo_id', filters.tipo)
    }
    
    if (filters?.desde) {
      query = query.gte('fecha', filters.desde)
    }
    
    if (filters?.hasta) {
      query = query.lte('fecha', filters.hasta)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER PRÓXIMAS PROGRAMACIONES
  // ═══════════════════════════════════════════════════════════════════════════
  async getProximas(limit = 5) {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('programaciones')
      .select(`
        *,
        tipo_servicio:tipos_servicio(*),
        programacion_miembros(count),
        programacion_canciones(count)
      `)
      .gte('fecha', today)
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER PROGRAMACIÓN POR ID
  // ═══════════════════════════════════════════════════════════════════════════
  async getById(id: string) {
    const { data, error } = await supabase
      .from('programaciones')
      .select(`
        *,
        tipo_servicio:tipos_servicio(*),
        programacion_miembros(
          id,
          confirmado,
          notas,
          miembro:miembros(*),
          rol:roles(*)
        ),
        programacion_canciones(
          id,
          orden,
          tono_usado,
          notas,
          cancion:canciones(*, categoria:categorias(*))
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CREAR PROGRAMACIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  async create(programacion: NuevaProgramacion) {
    const { data, error } = await supabase
      .from('programaciones')
      .insert(programacion)
      .select(`
        *,
        tipo_servicio:tipos_servicio(*)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTUALIZAR PROGRAMACIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  async update(id: string, updates: ActualizarProgramacion) {
    const { data, error } = await supabase
      .from('programaciones')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        tipo_servicio:tipos_servicio(*)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ELIMINAR PROGRAMACIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  async delete(id: string) {
    const { error } = await supabase
      .from('programaciones')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AGREGAR CANCIÓN A PROGRAMACIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  async addCancion(programacionId: string, cancionId: string, orden: number, tonoUsado?: string) {
    const { data, error } = await supabase
      .from('programacion_canciones')
      .insert({
        programacion_id: programacionId,
        cancion_id: cancionId,
        orden,
        tono_usado: tonoUsado,
      })
      .select(`
        *,
        cancion:canciones(*)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // QUITAR CANCIÓN DE PROGRAMACIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  async removeCancion(programacionId: string, cancionId: string) {
    const { error } = await supabase
      .from('programacion_canciones')
      .delete()
      .eq('programacion_id', programacionId)
      .eq('cancion_id', cancionId)
    
    if (error) throw error
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ASIGNAR MIEMBRO A PROGRAMACIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  async addMiembro(programacionId: string, miembroId: string, rolId?: number) {
    const { data, error } = await supabase
      .from('programacion_miembros')
      .insert({
        programacion_id: programacionId,
        miembro_id: miembroId,
        rol_id: rolId,
      })
      .select(`
        *,
        miembro:miembros(*),
        rol:roles(*)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // QUITAR MIEMBRO DE PROGRAMACIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  async removeMiembro(programacionId: string, miembroId: string) {
    const { error } = await supabase
      .from('programacion_miembros')
      .delete()
      .eq('programacion_id', programacionId)
      .eq('miembro_id', miembroId)
    
    if (error) throw error
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONFIRMAR ASISTENCIA
  // ═══════════════════════════════════════════════════════════════════════════
  async confirmarMiembro(programacionId: string, miembroId: string, confirmado: boolean) {
    const { data, error } = await supabase
      .from('programacion_miembros')
      .update({ confirmado })
      .eq('programacion_id', programacionId)
      .eq('miembro_id', miembroId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER TIPOS DE SERVICIO
  // ═══════════════════════════════════════════════════════════════════════════
  async getTiposServicio(): Promise<TipoServicio[]> {
    const { data, error } = await supabase
      .from('tipos_servicio')
      .select('*')
      .order('nombre')
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CAMBIAR ESTADO
  // ═══════════════════════════════════════════════════════════════════════════
  async updateEstado(id: string, estado: string) {
    const { data, error } = await supabase
      .from('programaciones')
      .update({ estado })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTAR PROGRAMACIONES
  // ═══════════════════════════════════════════════════════════════════════════
  async count(futuras = false) {
    let query = supabase
      .from('programaciones')
      .select('*', { count: 'exact', head: true })
    
    if (futuras) {
      const today = new Date().toISOString().split('T')[0]
      query = query.gte('fecha', today)
    }
    
    const { count, error } = await query
    if (error) throw error
    return count || 0
  },
}
