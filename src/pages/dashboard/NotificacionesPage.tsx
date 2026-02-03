"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Bell, Calendar, Music, User, Check, Trash2, BellOff, CheckCheck } from 'lucide-react'

interface Notificacion {
  id: number
  tipo: "programacion" | "cancion" | "equipo"
  titulo: string
  descripcion: string
  fecha: string
  leida: boolean
}

export default function NotificacionesPage() {
  const [activeTab, setActiveTab] = useState("todas")
  const [notifications, setNotifications] = useState<Notificacion[]>([
    { id: 1, tipo: "programacion", titulo: "Nueva programación asignada", descripcion: "Has sido asignado como Voz Líder para el servicio del domingo 21 de abril.", fecha: "2025-04-15T10:30:00", leida: false },
    { id: 2, tipo: "cancion", titulo: "Nueva canción agregada", descripcion: "Se ha agregado la canción 'Tu Amor No Se Rinde' al repertorio.", fecha: "2025-04-14T15:45:00", leida: false },
    { id: 3, tipo: "equipo", titulo: "Nuevo miembro en el equipo", descripcion: "Lucía Fernández se ha unido al equipo como Guitarrista.", fecha: "2025-04-12T09:15:00", leida: true },
    { id: 4, tipo: "programacion", titulo: "Cambio en programación", descripcion: "La programación del miércoles 17 de abril ha sido modificada.", fecha: "2025-04-10T14:20:00", leida: true },
    { id: 5, tipo: "cancion", titulo: "Canción actualizada", descripcion: "Se han actualizado los acordes de la canción 'Grande y Fuerte'.", fecha: "2025-04-08T11:05:00", leida: true },
  ])

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, leida: true } : n)))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, leida: true })))
  }

  const deleteAllRead = () => {
    setNotifications(notifications.filter((n) => !n.leida))
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "todas") return true
    if (activeTab === "noLeidas") return !n.leida
    return n.tipo === activeTab
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return `Hoy, ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`
    if (diffDays === 1) return `Ayer, ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })
  }

  const getNotificationStyles = (tipo: string) => {
    switch (tipo) {
      case "programacion":
        return { icon: Calendar, color: "text-cuadrangular-cyan", bg: "bg-cuadrangular-cyan/10" }
      case "cancion":
        return { icon: Music, color: "text-cuadrangular-red", bg: "bg-cuadrangular-red/10" }
      case "equipo":
        return { icon: User, color: "text-cuadrangular-yellow", bg: "bg-cuadrangular-yellow/10" }
      default:
        return { icon: Bell, color: "text-cuadrangular-purple", bg: "bg-cuadrangular-purple/10" }
    }
  }

  const unreadCount = notifications.filter((n) => !n.leida).length

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cuadrangular-purple/10 flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-cuadrangular-purple" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-cuadrangular-red text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            Notificaciones
          </h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount} notificaciones sin leer
          </p>
        </div>
        
        <div className="flex gap-2 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <Button 
            variant="outline" 
            onClick={markAllAsRead} 
            disabled={unreadCount === 0}
            className="border-border/50 hover:bg-cuadrangular-cyan/10"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Marcar todas leídas
          </Button>
          <Button 
            variant="outline" 
            onClick={deleteAllRead}
            disabled={notifications.every((n) => !n.leida)}
            className="border-border/50 hover:bg-cuadrangular-red/10 hover:text-cuadrangular-red"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar leídas
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          CONTENIDO
          ═══════════════════════════════════════════════════════════════════ */}
      <Card className="border-border/50 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-display">Centro de Notificaciones</CardTitle>
          <CardDescription>Mantente al día con las actualizaciones del ministerio</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted/50 mb-6 flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="todas" className="data-[state=active]:bg-card">Todas</TabsTrigger>
              <TabsTrigger value="noLeidas" className="data-[state=active]:bg-card">
                No leídas
                {unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-cuadrangular-red/20 text-cuadrangular-red rounded-full">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="programacion" className="data-[state=active]:bg-card">Programaciones</TabsTrigger>
              <TabsTrigger value="cancion" className="data-[state=active]:bg-card">Canciones</TabsTrigger>
              <TabsTrigger value="equipo" className="data-[state=active]:bg-card">Equipo</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-3 mt-0">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <BellOff className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-lg font-medium">No hay notificaciones</p>
                  <p className="text-sm">Estás al día con todo</p>
                </div>
              ) : (
                filteredNotifications.map((notif, index) => {
                  const styles = getNotificationStyles(notif.tipo)
                  const IconComponent = styles.icon
                  
                  return (
                    <div
                      key={notif.id}
                      className={`group p-4 rounded-xl border transition-all duration-300 animate-fade-in-up ${
                        notif.leida 
                          ? "border-border/50 bg-transparent" 
                          : "border-cuadrangular-purple/30 bg-cuadrangular-purple/5"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl ${styles.bg} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className={`w-5 h-5 ${styles.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold">{notif.titulo}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{notif.descripcion}</p>
                              <p className="text-xs text-muted-foreground mt-2">{formatDate(notif.fecha)}</p>
                            </div>
                            <Badge 
                              variant="secondary" 
                              className={notif.leida 
                                ? "bg-muted text-muted-foreground border-0" 
                                : "bg-cuadrangular-purple/10 text-cuadrangular-purple border-0"
                              }
                            >
                              {notif.leida ? "Leída" : "Nueva"}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2 mt-3">
                            {!notif.leida && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => markAsRead(notif.id)}
                                className="text-cuadrangular-cyan hover:bg-cuadrangular-cyan/10"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Marcar leída
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteNotification(notif.id)}
                              className="text-muted-foreground hover:text-cuadrangular-red hover:bg-cuadrangular-red/10"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
