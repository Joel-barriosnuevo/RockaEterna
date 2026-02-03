"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { 
  Music, 
  Calendar, 
  Users, 
  ArrowRight, 
  Clock, 
  Mic, 
  Guitar, 
  ChevronRight,
  TrendingUp,
  Sparkles,
  Play
} from "lucide-react"

interface Programacion {
  id: number
  fecha: string
  hora: string
  tipo: string
  rol: string
}

interface Cancion {
  id: number
  nombre: string
  categoria: string
  autor: string
}

interface Miembro {
  id: number
  nombre: string
  rol: string
  iniciales: string
  color: string
}

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Buenos días")
    else if (hour < 18) setGreeting("Buenas tardes")
    else setGreeting("Buenas noches")

    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const proximasProgramaciones: Programacion[] = [
    { id: 1, fecha: "2025-04-17", hora: "9:00 AM", tipo: "Servicio Principal", rol: "Voz Líder" },
    { id: 2, fecha: "2025-04-21", hora: "7:00 PM", tipo: "Servicio de Oración", rol: "Guitarra" },
  ]

  const ultimasCanciones: Cancion[] = [
    { id: 1, nombre: "Grande y Fuerte", categoria: "Alabanza", autor: "Miel San Marcos" },
    { id: 2, nombre: "Dios Incomparable", categoria: "Adoración", autor: "Generación 12" },
    { id: 3, nombre: "Tu Amor No Se Rinde", categoria: "Adoración", autor: "Hillsong" },
  ]

  const miembrosEquipo: Miembro[] = [
    { id: 1, nombre: "Carlos Pérez", rol: "Voz Líder", iniciales: "CP", color: "from-cuadrangular-red to-cuadrangular-purple" },
    { id: 2, nombre: "María Rodríguez", rol: "Piano", iniciales: "MR", color: "from-cuadrangular-cyan to-cuadrangular-purple" },
    { id: 3, nombre: "Juan Gómez", rol: "Batería", iniciales: "JG", color: "from-cuadrangular-yellow to-cuadrangular-red" },
    { id: 4, nombre: "Ana Martínez", rol: "Coros", iniciales: "AM", color: "from-cuadrangular-purple to-cuadrangular-cyan" },
  ]

  const estadisticas = [
    { 
      title: "Canciones", 
      value: "124", 
      change: "+12", 
      icon: Music,
      color: "cuadrangular-red",
      gradient: "from-cuadrangular-red/20 to-cuadrangular-red/5"
    },
    { 
      title: "Programaciones", 
      value: "38", 
      change: "+5", 
      icon: Calendar,
      color: "cuadrangular-cyan",
      gradient: "from-cuadrangular-cyan/20 to-cuadrangular-cyan/5"
    },
    { 
      title: "Miembros", 
      value: "12", 
      change: "+2", 
      icon: Users,
      color: "cuadrangular-purple",
      gradient: "from-cuadrangular-purple/20 to-cuadrangular-purple/5"
    },
  ]

  return (
    <div className="space-y-8">
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-cuadrangular-yellow" />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold">
            {greeting}, <span className="text-cuadrangular-purple">Admin</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Aquí tienes un resumen de la actividad del ministerio
          </p>
        </div>
        
        <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <Button asChild variant="outline" className="border-cuadrangular-cyan/30 hover:bg-cuadrangular-cyan/10">
            <Link to="/dashboard/repertorio">
              <Music className="w-4 h-4 mr-2" />
              Ver Repertorio
            </Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-cuadrangular-red to-cuadrangular-purple hover:opacity-90 text-white shadow-glow-purple">
            <Link to="/dashboard/programaciones/nueva">
              <Play className="w-4 h-4 mr-2" />
              Nueva Programación
            </Link>
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          ESTADÍSTICAS
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid gap-4 md:grid-cols-3">
        {estadisticas.map((stat, index) => (
          <Card 
            key={index} 
            className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.gradient} animate-fade-in-up`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-4xl font-display font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className={`w-4 h-4 text-${stat.color}`} />
                    <span className={`text-sm font-medium text-${stat.color}`}>{stat.change}</span>
                    <span className="text-xs text-muted-foreground">este mes</span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          CONTENIDO PRINCIPAL CON TABS
          ═══════════════════════════════════════════════════════════════════ */}
      <Tabs defaultValue="programaciones" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger 
            value="programaciones" 
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Programaciones
          </TabsTrigger>
          <TabsTrigger 
            value="canciones"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <Music className="w-4 h-4 mr-2" />
            Canciones
          </TabsTrigger>
          <TabsTrigger 
            value="equipo"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <Users className="w-4 h-4 mr-2" />
            Equipo
          </TabsTrigger>
        </TabsList>

        {/* Tab: Programaciones */}
        <TabsContent value="programaciones" className="animate-fade-in">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-display">Próximas Programaciones</CardTitle>
                  <CardDescription>Tus próximas asignaciones en los servicios</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-cuadrangular-purple">
                  <Link to="/dashboard/programaciones">
                    Ver todas <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-24 bg-muted/50 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {proximasProgramaciones.map((prog) => (
                    <div
                      key={prog.id}
                      className="group flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-cuadrangular-purple/30 hover:bg-gradient-to-r hover:from-cuadrangular-purple/5 hover:to-transparent transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          prog.rol.includes("Voz") 
                            ? "bg-cuadrangular-red/10 text-cuadrangular-red" 
                            : "bg-cuadrangular-cyan/10 text-cuadrangular-cyan"
                        }`}>
                          {prog.rol.includes("Voz") ? <Mic className="w-6 h-6" /> : <Guitar className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="font-semibold">{prog.tipo}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(prog.fecha).toLocaleDateString("es-ES", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {prog.hora}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-cuadrangular-purple/10 text-cuadrangular-purple border-0">
                          {prog.rol}
                        </Badge>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Canciones */}
        <TabsContent value="canciones" className="animate-fade-in">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-display">Últimas Canciones</CardTitle>
                  <CardDescription>Las más recientes en el repertorio</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-cuadrangular-cyan">
                  <Link to="/dashboard/repertorio">
                    Ver todas <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-muted/50 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {ultimasCanciones.map((cancion, index) => (
                    <div
                      key={cancion.id}
                      className="group flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-cuadrangular-cyan/30 hover:bg-gradient-to-r hover:from-cuadrangular-cyan/5 hover:to-transparent transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cuadrangular-red/20 to-cuadrangular-purple/20 flex items-center justify-center">
                          <Music className="w-6 h-6 text-cuadrangular-purple" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{cancion.nombre}</h4>
                          <p className="text-sm text-muted-foreground">
                            {cancion.autor} • <span className="text-cuadrangular-cyan">{cancion.categoria}</span>
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Equipo */}
        <TabsContent value="equipo" className="animate-fade-in">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-display">Equipo de Alabanza</CardTitle>
                  <CardDescription>Los miembros activos en el ministerio</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-cuadrangular-yellow">
                  <Link to="/dashboard/equipo">
                    Ver todos <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 bg-muted/50 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {miembrosEquipo.map((miembro) => (
                    <div
                      key={miembro.id}
                      className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-cuadrangular-yellow/30 hover:bg-gradient-to-r hover:from-cuadrangular-yellow/5 hover:to-transparent transition-all duration-300"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" />
                        <AvatarFallback className={`bg-gradient-to-br ${miembro.color} text-white font-semibold`}>
                          {miembro.iniciales}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{miembro.nombre}</h4>
                        <Badge variant="secondary" className="mt-1 bg-muted text-muted-foreground border-0">
                          {miembro.rol}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
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
