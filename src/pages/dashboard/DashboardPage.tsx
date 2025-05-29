"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Music, Calendar, Users, ArrowRight, Clock, Mic, Guitar, ChevronRight } from "lucide-react"

interface Programacion {
  id: number
  fecha: string
  dia: string
  hora: string
  tipo: string
  rol: string
}

interface Cancion {
  id: number
  nombre: string
  categoria: string
  autor: string
  fechaAgregada: string
}

interface Miembro {
  id: number
  nombre: string
  rol: string
  imagen: string
  iniciales: string
}

interface Estadistica {
  title: string
  value: string
  icon: React.ReactNode
  description: string
}

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Buenos días")
    else if (hour < 18) setGreeting("Buenas tardes")
    else setGreeting("Buenas noches")

    // Simulación de carga de datos
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Datos de ejemplo
  const proximasProgramaciones: Programacion[] = [
    {
      id: 1,
      fecha: "2025-04-17",
      dia: "Domingo",
      hora: "9:00 AM",
      tipo: "Servicio Principal",
      rol: "Voz Líder",
    },
    {
      id: 2,
      fecha: "2025-04-21",
      dia: "Miércoles",
      hora: "7:00 PM",
      tipo: "Servicio de Oración",
      rol: "Guitarra",
    },
  ]

  const ultimasCanciones: Cancion[] = [
    {
      id: 1,
      nombre: "Grande y Fuerte",
      categoria: "Alabanza",
      autor: "Miel San Marcos",
      fechaAgregada: "2025-04-10",
    },
    {
      id: 2,
      nombre: "Dios Incomparable",
      categoria: "Adoración",
      autor: "Generación 12",
      fechaAgregada: "2025-04-08",
    },
    {
      id: 3,
      nombre: "Tu Amor No Se Rinde",
      categoria: "Adoración",
      autor: "Hillsong",
      fechaAgregada: "2025-04-05",
    },
  ]

  const miembrosEquipo: Miembro[] = [
    {
      id: 1,
      nombre: "Carlos Pérez",
      rol: "Voz Líder",
      imagen: "",
      iniciales: "CP",
    },
    {
      id: 2,
      nombre: "María Rodríguez",
      rol: "Piano",
      imagen: "",
      iniciales: "MR",
    },
    {
      id: 3,
      nombre: "Juan Gómez",
      rol: "Batería",
      imagen: "",
      iniciales: "JG",
    },
    {
      id: 4,
      nombre: "Ana Martínez",
      rol: "Coros",
      imagen: "",
      iniciales: "AM",
    },
  ]

  const estadisticas: Estadistica[] = [
    {
      title: "Canciones",
      value: "124",
      icon: <Music className="h-4 w-4 text-muted-foreground" />,
      description: "Total en repertorio",
    },
    {
      title: "Programaciones",
      value: "38",
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
      description: "En los últimos 3 meses",
    },
    {
      title: "Miembros",
      value: "12",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: "Activos en el equipo",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{greeting}, Admin</h2>
          <p className="text-muted-foreground">Aquí tienes un resumen de la actividad reciente del ministerio.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link to="/dashboard/programaciones/nueva">
              Nueva Programación <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {estadisticas.map((stat, index) => (
          <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="programaciones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="programaciones">Próximas Programaciones</TabsTrigger>
          <TabsTrigger value="canciones">Últimas Canciones</TabsTrigger>
          <TabsTrigger value="equipo">Equipo</TabsTrigger>
        </TabsList>

        <TabsContent value="programaciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Programaciones</CardTitle>
              <CardDescription>Tus próximas asignaciones en los servicios</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-md" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {proximasProgramaciones.map((prog) => (
                    <div
                      key={prog.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                          {prog.rol.includes("Voz") ? <Mic className="h-5 w-5" /> : <Guitar className="h-5 w-5" />}
                        </div>
                        <div>
                          <h4 className="font-medium">{prog.tipo}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(prog.fecha).toLocaleDateString("es-ES", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              })}
                            </span>
                            <Clock className="h-3 w-3 ml-2" />
                            <span>{prog.hora}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="canciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Últimas Canciones Agregadas</CardTitle>
              <CardDescription>Las más recientes en tu repertorio</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-md" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {ultimasCanciones.map((cancion) => (
                    <div
                      key={cancion.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary/10 text-secondary">
                          <Music className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{cancion.nombre}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{cancion.categoria}</span>
                            <span className="text-primary">{cancion.autor}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipo Actual</CardTitle>
              <CardDescription>Los miembros activos en el ministerio</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-md" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {miembrosEquipo.map((miembro) => (
                    <div
                      key={miembro.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={miembro.imagen} alt={miembro.nombre} />
                          <AvatarFallback>{miembro.iniciales}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{miembro.nombre}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {miembro.rol}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          Ver Perfil
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
