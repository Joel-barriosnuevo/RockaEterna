"use client"

import { useState, useEffect, useMemo } from "react"
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
  Sparkles,
  Play,
  Loader2
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useCanciones, useMiembros, useProgramaciones } from "../../hooks"

// Colores para avatares
const AVATAR_COLORS = [
  "from-cuadrangular-red to-cuadrangular-purple",
  "from-cuadrangular-cyan to-cuadrangular-purple",
  "from-cuadrangular-yellow to-cuadrangular-red",
  "from-cuadrangular-purple to-cuadrangular-cyan",
  "from-cuadrangular-red to-cuadrangular-cyan",
  "from-cuadrangular-yellow to-cuadrangular-purple",
]

export default function DashboardPage() {
  const { profile } = useAuth()
  const isAdmin = profile?.is_admin ?? false
  const userName = profile?.nombre || "Usuario"
  
  const [greeting, setGreeting] = useState("")

  // Cargar datos reales de Supabase
  const { canciones, loading: loadingCanciones } = useCanciones()
  const { miembros, loading: loadingMiembros } = useMiembros()
  const { programaciones, loading: loadingProgramaciones } = useProgramaciones()

  const loading = loadingCanciones || loadingMiembros || loadingProgramaciones

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Buenos días")
    else if (hour < 18) setGreeting("Buenas tardes")
    else setGreeting("Buenas noches")
  }, [])

  // Próximas programaciones (futuras, ordenadas por fecha)
  const proximasProgramaciones = useMemo(() => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    
    return programaciones
      .filter(prog => new Date(prog.fecha) >= hoy)
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .slice(0, 3)
      .map(prog => ({
        id: prog.id,
        fecha: prog.fecha,
        hora: prog.hora || "9:00 AM",
        tipo: (prog as any).tipo_servicio?.nombre || "Servicio",
        miembrosCount: (prog as any).programacion_miembros?.length || 0
      }))
  }, [programaciones])

  // Últimas canciones (las más recientes)
  const ultimasCanciones = useMemo(() => {
    return [...canciones]
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 3)
      .map(cancion => ({
        id: cancion.id,
        nombre: cancion.nombre,
        categoria: (cancion as any).categoria?.nombre || "Sin categoría",
        autor: cancion.autor || "Desconocido"
      }))
  }, [canciones])

  // Miembros activos del equipo
  const miembrosEquipo = useMemo(() => {
    return miembros
      .filter(m => m.activo)
      .slice(0, 4)
      .map((miembro, index) => ({
        id: miembro.id,
        nombre: `${miembro.nombre} ${miembro.apellido}`,
        rol: (miembro as any).rol?.nombre || "Sin rol",
        iniciales: `${miembro.nombre.charAt(0)}${miembro.apellido.charAt(0)}`,
        color: AVATAR_COLORS[index % AVATAR_COLORS.length]
      }))
  }, [miembros])

  // Estadísticas reales
  const estadisticas = useMemo(() => [
    { 
      title: "Canciones", 
      value: canciones.length.toString(), 
      icon: Music,
      color: "cuadrangular-red",
      gradient: "from-cuadrangular-red/20 to-cuadrangular-red/5"
    },
    { 
      title: "Programaciones", 
      value: programaciones.length.toString(), 
      icon: Calendar,
      color: "cuadrangular-cyan",
      gradient: "from-cuadrangular-cyan/20 to-cuadrangular-cyan/5"
    },
    { 
      title: "Miembros", 
      value: miembros.filter(m => m.activo).length.toString(), 
      icon: Users,
      color: "cuadrangular-purple",
      gradient: "from-cuadrangular-purple/20 to-cuadrangular-purple/5"
    },
  ], [canciones.length, programaciones.length, miembros])

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
            {greeting}, <span className="text-cuadrangular-purple">{userName}</span>
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
          {isAdmin && (
            <Button asChild className="bg-gradient-to-r from-cuadrangular-red to-cuadrangular-purple hover:opacity-90 text-white shadow-glow-purple">
              <Link to="/dashboard/programaciones/nueva">
                <Play className="w-4 h-4 mr-2" />
                Nueva Programación
              </Link>
            </Button>
          )}
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
                  <p className="text-4xl font-display font-bold mt-2">
                    {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : stat.value}
                  </p>
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
                  <CardDescription>Los próximos servicios programados</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-cuadrangular-purple">
                  <Link to="/dashboard/programaciones">
                    Ver todas <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingProgramaciones ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-cuadrangular-purple" />
                </div>
              ) : proximasProgramaciones.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mb-2 opacity-30" />
                  <p>No hay programaciones próximas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {proximasProgramaciones.map((prog) => (
                    <Link
                      key={prog.id}
                      to={`/dashboard/programaciones/${prog.id}`}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl border border-border/50 hover:border-cuadrangular-purple/30 hover:bg-gradient-to-r hover:from-cuadrangular-purple/5 hover:to-transparent transition-all duration-300 gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-cuadrangular-cyan/10 text-cuadrangular-cyan shrink-0">
                          <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base truncate">{prog.tipo}</h4>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              {new Date(prog.fecha).toLocaleDateString("es-ES", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              {prog.hora}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 pl-13 sm:pl-0">
                        <Badge variant="secondary" className="bg-cuadrangular-purple/10 text-cuadrangular-purple border-0 text-xs">
                          {prog.miembrosCount} miembros
                        </Badge>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </Link>
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
              {loadingCanciones ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-cuadrangular-cyan" />
                </div>
              ) : ultimasCanciones.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Music className="w-12 h-12 mb-2 opacity-30" />
                  <p>No hay canciones en el repertorio</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ultimasCanciones.map((cancion) => (
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
              {loadingMiembros ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-cuadrangular-yellow" />
                </div>
              ) : miembrosEquipo.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mb-2 opacity-30" />
                  <p>No hay miembros en el equipo</p>
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
