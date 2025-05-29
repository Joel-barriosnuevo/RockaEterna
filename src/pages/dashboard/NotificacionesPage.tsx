"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Bell, Calendar, Music, User, Check, Trash, BellOff } from 'lucide-react'

interface Notificacion {
  id: number
  tipo: string
  titulo: string
  descripcion: string
  fecha: string
  leida: boolean
}

export default function NotificacionesPage() {
  const [activeTab, setActiveTab] = useState("todas")
  const [notifications, setNotifications] = useState<Notificacion[]>([
    {
      id: 1,
      tipo: "programacion",
      titulo: "Nueva programación asignada",
      descripcion: "Has sido asignado como Voz Líder para el servicio del domingo 21 de abril.",
      fecha: "2025-04-15T10:30:00",
      leida: false,
    },
    {
      id: 2,
      tipo: "cancion",
      titulo: "Nueva canción agregada",
      descripcion: "Se ha agregado la canción 'Tu Amor No Se Rinde' al repertorio.",
      fecha: "2025-04-14T15:45:00",
      leida: false,
    },
    {
      id: 3,
      tipo: "equipo",
      titulo: "Nuevo miembro en el equipo",
      descripcion: "Lucía Fernández se ha unido al equipo como Guitarrista.",
      fecha: "2025-04-12T09:15:00",
      leida: true,
    },
    {
      id: 4,
      tipo: "programacion",
      titulo: "Cambio en programación",
      descripcion: "La programación del miércoles 17 de abril ha sido modificada.",
      fecha: "2025-04-10T14:20:00",
      leida: true,
    },
    {
      id: 5,
      tipo: "cancion",
      titulo: "Canción actualizada",
      descripcion: "Se han actualizado los acordes de la canción 'Grande y Fuerte'.",
      fecha: "2025-04-08T11:05:00",
      leida: true,
    },
  ])

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) => (notif.id === id ? { ...notif, leida: true } : notif))
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, leida: true })))
  }

  const deleteAllRead = () => {
    setNotifications(notifications.filter((notif) => !notif.leida))
  }

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "todas") return true
    if (activeTab === "noLeidas") return !notif.leida
    if (activeTab === "programacion") return notif.tipo === "programacion"
    if (activeTab === "cancion") return notif.tipo === "cancion"
    if (activeTab === "equipo") return notif.tipo === "equipo"
    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Hoy, ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays === 1) {
      return `Ayer, ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case "programacion":
        return <Calendar className="h-5 w-5 text-primary" />
      case "cancion":
        return <Music className="h-5 w-5 text-secondary" />
      case "equipo":
        return <User className="h-5 w-5 text-accent" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notificaciones</h2>
          <p className="text-muted-foreground">Mantente al día con las actualizaciones del ministerio</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={!notifications.some((n) => !n.leida)}>
            <Check className="mr-2 h-4 w-4" /> Marcar todas como leídas
          </Button>
          <Button variant="outline" onClick={deleteAllRead} disabled={!notifications.some((n) => n.leida)}>
            <Trash className="mr-2 h-4 w-4" /> Eliminar leídas
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Centro de Notificaciones</CardTitle>
          <CardDescription>
            {notifications.filter((n) => !n.leida).length} notificaciones sin leer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="noLeidas">No leídas</TabsTrigger>
              <TabsTrigger value="programacion">Programaciones</TabsTrigger>
              <TabsTrigger value="cancion">Canciones</TabsTrigger>
              <TabsTrigger value="equipo">Equipo</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <BellOff className="h-12 w-12 mb-2" />
                  <p>No hay notificaciones</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      notif.leida ? "bg-background" : "bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-background p-2 border">
                        {getNotificationIcon(notif.tipo)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">{notif.titulo}</h3>
                          <Badge variant={notif.leida ? "outline" : "default"} className="ml-2">
                            {notif.leida ? "Leída" : "Nueva"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{notif.descripcion}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(notif.fecha)}</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      {!notif.leida && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notif.id)}>
                          <Check className="mr-2 h-4 w-4" /> Marcar como leída
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => deleteNotification(notif.id)}>
                        <Trash className="mr-2 h-4 w-4" /> Eliminar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
