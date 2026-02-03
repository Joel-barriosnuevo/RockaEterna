import { supabase } from '../lib/supabase'
import type { Miembro, NuevoMiembro, ActualizarMiembro, Rol } from '../types/database.types'

export const miembrosService = {
  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER TODOS LOS MIEMBROS
  // ═══════════════════════════════════════════════════════════════════════════
  async getAll(filters?: {
    search?: string
    activo?: boolean
    rol?: number
  }) {
    let query = supabase
      .from('miembros')
      .select(`
        *,
        rol:roles!miembros_rol_principal_id_fkey(*),
        todos_los_roles:miembro_roles(
          rol_id,
          es_principal,
          rol:roles(id, nombre)
        )
      `)
      .order('nombre', { ascending: true })
    
    if (filters?.activo !== undefined) {
      query = query.eq('activo', filters.activo)
    }
    
    if (filters?.rol) {
      query = query.eq('rol_principal_id', filters.rol)
    }
    
    if (filters?.search) {
      query = query.or(`nombre.ilike.%${filters.search}%,apellido.ilike.%${filters.search}%`)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER MIEMBRO POR ID
  // ═══════════════════════════════════════════════════════════════════════════
  async getById(id: string) {
    const { data, error } = await supabase
      .from('miembros')
      .select(`
        *,
        rol:roles!miembros_rol_principal_id_fkey(*),
        roles_secundarios:miembro_roles(
          rol:roles(*)
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CREAR MIEMBRO
  // ═══════════════════════════════════════════════════════════════════════════
  async create(miembro: NuevoMiembro) {
    const { data, error } = await supabase
      .from('miembros')
      .insert(miembro)
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTUALIZAR MIEMBRO
  // ═══════════════════════════════════════════════════════════════════════════
  async update(id: string, updates: ActualizarMiembro) {
    const { data, error } = await supabase
      .from('miembros')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ELIMINAR MIEMBRO
  // ═══════════════════════════════════════════════════════════════════════════
  async delete(id: string) {
    const { error } = await supabase
      .from('miembros')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CAMBIAR ESTADO (ACTIVAR/DESACTIVAR)
  // ═══════════════════════════════════════════════════════════════════════════
  async toggleActivo(id: string, activo: boolean) {
    const { data, error } = await supabase
      .from('miembros')
      .update({ activo })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER ROLES
  // ═══════════════════════════════════════════════════════════════════════════
  async getRoles(): Promise<Rol[]> {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('orden')
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTAR MIEMBROS
  // ═══════════════════════════════════════════════════════════════════════════
  async count(activo?: boolean) {
    let query = supabase
      .from('miembros')
      .select('*', { count: 'exact', head: true })
    
    if (activo !== undefined) {
      query = query.eq('activo', activo)
    }
    
    const { count, error } = await query
    if (error) throw error
    return count || 0
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER MIEMBROS ACTIVOS
  // ═══════════════════════════════════════════════════════════════════════════
  async getActivos() {
    return this.getAll({ activo: true })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER ROLES DE UN MIEMBRO
  // ═══════════════════════════════════════════════════════════════════════════
  async getMiembroRoles(miembroId: string) {
    const { data, error } = await supabase
      .from('miembro_roles')
      .select(`
        rol_id,
        es_principal,
        rol:roles(*)
      `)
      .eq('miembro_id', miembroId)
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ASIGNAR ROLES A UN MIEMBRO
  // ═══════════════════════════════════════════════════════════════════════════
  async setMiembroRoles(miembroId: string, rolesIds: number[], rolPrincipalId?: number) {
    // Primero eliminar todos los roles actuales
    const { error: deleteError } = await supabase
      .from('miembro_roles')
      .delete()
      .eq('miembro_id', miembroId)
    
    if (deleteError) throw deleteError
    
    // Si no hay roles, terminar
    if (rolesIds.length === 0) return
    
    // Insertar los nuevos roles
    const inserts = rolesIds.map(rolId => ({
      miembro_id: miembroId,
      rol_id: rolId,
      es_principal: rolId === rolPrincipalId
    }))
    
    const { error: insertError } = await supabase
      .from('miembro_roles')
      .insert(inserts)
    
    if (insertError) throw insertError
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AÑADIR ROL A UN MIEMBRO
  // ═══════════════════════════════════════════════════════════════════════════
  async addRolToMiembro(miembroId: string, rolId: number, esPrincipal: boolean = false) {
    const { error } = await supabase
      .from('miembro_roles')
      .insert({
        miembro_id: miembroId,
        rol_id: rolId,
        es_principal: esPrincipal
      })
    
    if (error) throw error
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // QUITAR ROL DE UN MIEMBRO
  // ═══════════════════════════════════════════════════════════════════════════
  async removeRolFromMiembro(miembroId: string, rolId: number) {
    const { error } = await supabase
      .from('miembro_roles')
      .delete()
      .eq('miembro_id', miembroId)
      .eq('rol_id', rolId)
    
    if (error) throw error
  },
}
