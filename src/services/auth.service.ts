import { supabase } from '../lib/supabase'
import type { Usuario } from '../types/database.types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  nombre: string
  apellido: string
}

export const authService = {
  // ═══════════════════════════════════════════════════════════════════════════
  // LOGIN
  // ═══════════════════════════════════════════════════════════════════════════
  async login({ email, password }: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // REGISTRO
  // ═══════════════════════════════════════════════════════════════════════════
  async register({ email, password, nombre, apellido }: RegisterData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          apellido,
        },
      },
    })
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LOGOUT
  // ═══════════════════════════════════════════════════════════════════════════
  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER SESIÓN ACTUAL
  // ═══════════════════════════════════════════════════════════════════════════
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER USUARIO ACTUAL
  // ═══════════════════════════════════════════════════════════════════════════
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER PERFIL DEL USUARIO
  // ═══════════════════════════════════════════════════════════════════════════
  async getUserProfile(userId: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // No encontrado
      throw error
    }
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTUALIZAR PERFIL
  // ═══════════════════════════════════════════════════════════════════════════
  async updateProfile(userId: string, updates: Partial<Usuario>) {
    const { data, error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CAMBIAR CONTRASEÑA
  // ═══════════════════════════════════════════════════════════════════════════
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    
    if (error) throw error
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RECUPERAR CONTRASEÑA
  // ═══════════════════════════════════════════════════════════════════════════
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    
    if (error) throw error
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SUSCRIBIRSE A CAMBIOS DE AUTH
  // ═══════════════════════════════════════════════════════════════════════════
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENER TODOS LOS USUARIOS
  // ═══════════════════════════════════════════════════════════════════════════
  async getAllUsuarios(): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nombre', { ascending: true })
    
    if (error) throw error
    return data || []
  },
}
