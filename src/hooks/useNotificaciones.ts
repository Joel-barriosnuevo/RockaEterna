import { useState, useEffect, useCallback } from 'react'
import { notificacionesService } from '../services/notificaciones.service'
import { useAuth } from '../contexts/AuthContext'
import type { Notificacion } from '../types/database.types'

// ═══════════════════════════════════════════════════════════════════════════
// HOOK: useNotificaciones
// ═══════════════════════════════════════════════════════════════════════════
export function useNotificaciones(filters?: {
  leida?: boolean
  tipo?: string
  limit?: number
}) {
  const { user } = useAuth()
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotificaciones = useCallback(async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await notificacionesService.getAll(filters)
      setNotificaciones(data)
      
      // Actualizar contador de no leídas
      const count = await notificacionesService.countUnread()
      setUnreadCount(count)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'))
    } finally {
      setLoading(false)
    }
  }, [user, filters?.leida, filters?.tipo, filters?.limit])

  useEffect(() => {
    fetchNotificaciones()
  }, [fetchNotificaciones])

  // Suscribirse a nuevas notificaciones en tiempo real
  useEffect(() => {
    if (!user) return

    const subscription = notificacionesService.subscribeToNew(user.id, (newNotif) => {
      setNotificaciones(prev => [newNotif, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const markAsRead = async (id: string) => {
    await notificacionesService.markAsRead(id)
    setNotificaciones(prev => 
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    if (!user) return
    await notificacionesService.markAllAsRead(user.id)
    setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })))
    setUnreadCount(0)
  }

  const deleteNotificacion = async (id: string) => {
    const notif = notificaciones.find(n => n.id === id)
    await notificacionesService.delete(id)
    setNotificaciones(prev => prev.filter(n => n.id !== id))
    if (notif && !notif.leida) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const deleteRead = async () => {
    if (!user) return
    await notificacionesService.deleteRead(user.id)
    setNotificaciones(prev => prev.filter(n => !n.leida))
  }

  return {
    notificaciones,
    loading,
    error,
    unreadCount,
    refetch: fetchNotificaciones,
    markAsRead,
    markAllAsRead,
    deleteNotificacion,
    deleteRead,
  }
}
