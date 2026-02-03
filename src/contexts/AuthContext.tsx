import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { authService } from '../services/auth.service'
import type { Usuario } from '../types/database.types'

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════════════
interface AuthContextType {
  user: User | null
  profile: Usuario | null
  session: Session | null
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, nombre: string, apellido: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Usuario>) => Promise<void>
  refreshProfile: () => Promise<void>
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXTO
// ═══════════════════════════════════════════════════════════════════════════
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Usuario | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Cargar perfil del usuario
  const loadProfile = useCallback(async (userId: string) => {
    try {
      const userProfile = await authService.getUserProfile(userId)
      setProfile(userProfile)
    } catch (error) {
      console.error('Error cargando perfil:', error)
      setProfile(null)
    }
  }, [])

  // Inicializar autenticación
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error obteniendo sesión:', error)
        }
        
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            loadProfile(session.user.id)
          }
          
          setInitialized(true)
        }
      } catch (error) {
        console.error('Error inicializando auth:', error)
        if (mounted) {
          setInitialized(true)
        }
      }
    }

    initAuth()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            loadProfile(session.user.id)
          } else {
            setProfile(null)
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [loadProfile])

  // ═══════════════════════════════════════════════════════════════════════════
  // MÉTODOS DE AUTENTICACIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    
    if (data.user) {
      setUser(data.user)
      setSession(data.session)
      loadProfile(data.user.id).catch(console.error)
    }
  }

  const signUp = async (email: string, password: string, nombre: string, apellido: string) => {
    setLoading(true)
    try {
      await authService.register({ email, password, nombre, apellido })
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    // Limpiar estado local inmediatamente
    setUser(null)
    setProfile(null)
    setSession(null)
    
    // Limpiar localStorage de Supabase
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key)
      }
    })
    
    // Intentar signOut de Supabase (sin esperar)
    supabase.auth.signOut().catch(console.error)
  }

  const updateProfile = async (updates: Partial<Usuario>) => {
    if (!user) throw new Error('No hay usuario autenticado')
    
    const updatedProfile = await authService.updateProfile(user.id, updates)
    setProfile(updatedProfile)
  }

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const value = {
    user,
    profile,
    session,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
