import { supabase } from '../lib/supabase'
import type { Cancion, NuevaCancion, ActualizarCancion, Categoria } from '../types/database.types'

export const cancionesService = {
  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER TODAS LAS CANCIONES
  // ═══════════════════════════════════════════════════════════════════════════
  async getAll(filters?: {
    search?: string
    categoria?: number
    activa?: boolean
  }) {
    let query = supabase
      .from('canciones')
      .select(`
        *,
        categoria:categorias(*)
      `)
      .order('nombre', { ascending: true })
    
    if (filters?.activa !== undefined) {
      query = query.eq('activa', filters.activa)
    }
    
    if (filters?.categoria) {
      query = query.eq('categoria_id', filters.categoria)
    }
    
    if (filters?.search) {
      query = query.or(`nombre.ilike.%${filters.search}%,autor.ilike.%${filters.search}%`)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER CANCIÓN POR ID
  // ═══════════════════════════════════════════════════════════════════════════
  async getById(id: string) {
    const { data, error } = await supabase
      .from('canciones')
      .select(`
        *,
        categoria:categorias(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CREAR CANCIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  async create(cancion: NuevaCancion) {
    const { data, error } = await supabase
      .from('canciones')
      .insert(cancion)
      .select(`
        *,
        categoria:categorias(*)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTUALIZAR CANCIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  async update(id: string, updates: ActualizarCancion) {
    const { data, error } = await supabase
      .from('canciones')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        categoria:categorias(*)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ELIMINAR CANCIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  async delete(id: string) {
    const { error } = await supabase
      .from('canciones')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER CATEGORÍAS
  // ═══════════════════════════════════════════════════════════════════════════
  async getCategorias(): Promise<Categoria[]> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nombre')
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER ÚLTIMAS CANCIONES
  // ═══════════════════════════════════════════════════════════════════════════
  async getRecent(limit = 5) {
    const { data, error } = await supabase
      .from('canciones')
      .select(`
        *,
        categoria:categorias(*)
      `)
      .eq('activa', true)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER CANCIONES MÁS USADAS
  // ═══════════════════════════════════════════════════════════════════════════
  async getMostUsed(limit = 10) {
    const { data, error } = await supabase
      .from('canciones')
      .select(`
        *,
        categoria:categorias(*)
      `)
      .eq('activa', true)
      .order('veces_usada', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTAR CANCIONES
  // ═══════════════════════════════════════════════════════════════════════════
  async count() {
    const { count, error } = await supabase
      .from('canciones')
      .select('*', { count: 'exact', head: true })
      .eq('activa', true)
    
    if (error) throw error
    return count || 0
  },
}
