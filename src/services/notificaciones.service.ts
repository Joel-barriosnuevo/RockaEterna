import { supabase } from '../lib/supabase'
import type { Notificacion, NuevaNotificacion } from '../types/database.types'

export const notificacionesService = {
  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER TODAS LAS NOTIFICACIONES DEL USUARIO
  // ═══════════════════════════════════════════════════════════════════════════
  async getAll(filters?: {
    leida?: boolean
    tipo?: string
    limit?: number
  }) {
    let query = supabase
      .from('notificaciones')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (filters?.leida !== undefined) {
      query = query.eq('leida', filters.leida)
    }
    
    if (filters?.tipo) {
      query = query.eq('tipo', filters.tipo)
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER NOTIFICACIONES NO LEÍDAS
  // ═══════════════════════════════════════════════════════════════════════════
  async getUnread() {
    return this.getAll({ leida: false })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTAR NO LEÍDAS
  // ═══════════════════════════════════════════════════════════════════════════
  async countUnread() {
    const { count, error } = await supabase
      .from('notificaciones')
      .select('*', { count: 'exact', head: true })
      .eq('leida', false)
    
    if (error) throw error
    return count || 0
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MARCAR COMO LEÍDA
  // ═══════════════════════════════════════════════════════════════════════════
  async markAsRead(id: string) {
    const { data, error } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MARCAR TODAS COMO LEÍDAS
  // ═══════════════════════════════════════════════════════════════════════════
  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('usuario_id', userId)
      .eq('leida', false)
    
    if (error) throw error
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ELIMINAR NOTIFICACIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  async delete(id: string) {
    const { error } = await supabase
      .from('notificaciones')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ELIMINAR NOTIFICACIONES LEÍDAS
  // ═══════════════════════════════════════════════════════════════════════════
  async deleteRead(userId: string) {
    const { error } = await supabase
      .from('notificaciones')
      .delete()
      .eq('usuario_id', userId)
      .eq('leida', true)
    
    if (error) throw error
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CREAR NOTIFICACIÓN (usado internamente o por admin)
  // ═══════════════════════════════════════════════════════════════════════════
  async create(notificacion: NuevaNotificacion) {
    const { data, error } = await supabase
      .from('notificaciones')
      .insert(notificacion)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SUSCRIBIRSE A NUEVAS NOTIFICACIONES (Realtime)
  // ═══════════════════════════════════════════════════════════════════════════
  subscribeToNew(userId: string, callback: (notificacion: Notificacion) => void) {
    return supabase
      .channel(`notificaciones:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notificaciones',
          filter: `usuario_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as Notificacion)
        }
      )
      .subscribe()
  },
}
