import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { authService } from '../services/auth.service'
import type { Usuario } from '../types/database.types'
import { useDeviceDetection } from '../hooks/useDeviceDetection'

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
  signUp: (email: string, password: string, nombre: string, apellido: string, telefono?: string) => Promise<void>
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
      
      if (!userProfile) {
        // Si no existe en la tabla usuarios, hacer logout
        console.warn('Usuario no encontrado en la tabla usuarios, cerrando sesión')
        await supabase.auth.signOut()
        setProfile(null)
        return
      }
      
      // Verificar que el usuario esté activo
      if (userProfile.activo === false) {
        console.warn('Usuario desactivado, cerrando sesión')
        await supabase.auth.signOut()
        setProfile(null)
        return
      }
      
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
    setLoading(true)
    try {
      // 1. Autenticar con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      if (data.user) {
        // 2. Verificar que el usuario exista en la tabla usuarios
        const userProfile = await authService.getUserProfile(data.user.id)
        
        if (!userProfile) {
          // Si no existe en la tabla usuarios, hacer logout y lanzar error
          await supabase.auth.signOut()
          throw new Error('Usuario no encontrado en el sistema. Por favor, contacta al administrador.')
        }
        
        // 3. Verificar que el usuario esté activo (si tiene el campo activo)
        if (userProfile.activo === false) {
          await supabase.auth.signOut()
          throw new Error('Tu cuenta ha sido desactivada. Por favor, contacta al administrador.')
        }
        
        // 4. Si todo está bien, actualizar estado
        setUser(data.user)
        setSession(data.session)
        setProfile(userProfile)
      }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, nombre: string, apellido: string, telefono?: string) => {
    setLoading(true)
    try {
      await authService.register({ email, password, nombre, apellido, telefono })
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    // Limpiar estado local inmediatamente
    setUser(null)
    setProfile(null)
    setSession(null)
    
    try {
      // 1. Limpiar localStorage completamente
      if (typeof window !== 'undefined') {
        // Limpiar localStorage de Supabase
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key)
          }
        })
        
        // Limpiar sessionStorage
        const sessionKeys = Object.keys(sessionStorage)
        sessionKeys.forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            sessionStorage.removeItem(key)
          }
        })
        
        // 2. Limpiar cookies relacionadas con Supabase
        document.cookie.split(';').forEach(cookie => {
          const cookieName = cookie.trim().split('=')[0]
          if (cookieName.includes('supabase') || cookieName.includes('sb-')) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
          }
        })
        
        // 3. Forzar recarga de la página para limpiar memoria
        if ('caches' in window) {
          // Limpiar caché de la aplicación
          const cacheNames = await caches.keys()
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          )
        }
        
        // 4. Limpiar cualquier dato persistente en IndexedDB
        if ('indexedDB' in window) {
          try {
            const databases = await indexedDB.databases()
            await Promise.all(
              databases.map(db => indexedDB.deleteDatabase(db.name!))
            )
          } catch (error) {
            console.warn('Error limpiando IndexedDB:', error)
          }
        }
      }
      
      // 5. Hacer logout de Supabase
      await supabase.auth.signOut()
      
      // 6. Forzar recarga completa en móviles
      if (typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // En dispositivos móviles, forzar una recarga completa
        setTimeout(() => {
          window.location.href = '/login'
        }, 100)
      }
      
    } catch (error) {
      console.error('Error durante el logout:', error)
      // Forzar redirección incluso si hay error
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
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
