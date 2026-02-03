"use client"

import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Calendar } from "../../components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { CalendarIcon, Plus, Filter, ChevronRight, Users, Clock, List, CalendarDays, Share2, MessageCircle, Mail, Loader2 } from 'lucide-react'
import { useAuth } from "../../contexts/AuthContext"
import { useProgramaciones } from "../../hooks"
import { compartirWhatsApp, compartirEmail, generarMensajeSimple, generarMensajeProgramacion } from "../../lib/share"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

export default function ProgramacionesPage() {
  const { profile } = useAuth()
  const isAdmin = profile?.is_admin ?? false
  
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState("lista")
  const [filterMonth, setFilterMonth] = useState<string>("all")

  // Cargar programaciones desde Supabase
  const { programaciones: programacionesData, loading } = useProgramaciones()

  // Transformar datos de Supabase al formato que necesita la UI
  const programaciones = useMemo(() => {
    return programacionesData.map(prog => {
      // Extraer miembros con sus roles
      const miembros = (prog as any).programacion_miembros?.map((pm: any) => ({
        nombre: pm.miembro?.nombre || "",
        apellido: pm.miembro?.apellido || "",
        rol: pm.rol?.nombre || "Sin rol"
      })) || []

      return {
        id: prog.id,
        fecha: prog.fecha,
        hora: prog.hora || "9:00 AM",
        tipo: (prog as any).tipo_servicio?.nombre || "Servicio",
        estado: prog.estado as "Confirmado" | "Pendiente" | "Borrador",
        miembrosCount: miembros.length,
        miembros
      }
    })
  }, [programacionesData])

  // Tipo para las programaciones transformadas
  type ProgramacionUI = typeof programaciones[0]

  // Función para compartir programación
  const handleCompartirWhatsApp = (prog: ProgramacionUI) => {
    if (prog.miembros.length === 0) {
      alert("Esta programación no tiene miembros asignados")
      return
    }
    const mensaje = generarMensajeSimple(new Date(prog.fecha), prog.miembros)
    compartirWhatsApp(mensaje)
  }

  const handleCompartirEmail = (prog: ProgramacionUI) => {
    if (prog.miembros.length === 0) {
      alert("Esta programación no tiene miembros asignados")
      return
    }
    const mensaje = generarMensajeSimple(new Date(prog.fecha), prog.miembros)
    const fechaFormateada = new Date(prog.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
    compartirEmail(`Programación - ${fechaFormateada}`, mensaje)
  }

  // Compartir TODAS las programaciones
  const programacionesConMiembros = programaciones.filter(p => p.miembros.length > 0)
  
  const handleCompartirTodasWhatsApp = () => {
    if (programacionesConMiembros.length === 0) {
      alert("No hay programaciones con miembros asignados")
      return
    }
    const datos = programacionesConMiembros.map(p => ({
      fecha: new Date(p.fecha),
      miembros: p.miembros
    }))
    const mensaje = generarMensajeProgramacion(datos)
    compartirWhatsApp(mensaje)
  }

  const handleCompartirTodasEmail = () => {
    if (programacionesConMiembros.length === 0) {
      alert("No hay programaciones con miembros asignados")
      return
    }
    const datos = programacionesConMiembros.map(p => ({
      fecha: new Date(p.fecha),
      miembros: p.miembros
    }))
    const mensaje = generarMensajeProgramacion(datos)
    compartirEmail("Programaciones del Equipo de Alabanza", mensaje)
  }

  const filteredProgramaciones = programaciones.filter((prog) => {
    if (filterMonth === "all") return true
    const month = new Date(prog.fecha).getMonth() + 1
    return month.toString() === filterMonth
  })

  const getEstadoStyles = (estado: string) => {
    switch (estado) {
      case "Confirmado":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-0"
      case "Pendiente":
        return "bg-cuadrangular-yellow/10 text-cuadrangular-yellow border-0"
      default:
        return "bg-muted text-muted-foreground border-0"
    }
  }

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cuadrangular-cyan/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-cuadrangular-cyan" />
            </div>
            Programaciones
          </h1>
          <p className="text-muted-foreground mt-1">
            {filteredProgramaciones.length} programaciones encontradas
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Botón compartir todas */}
          {programacionesConMiembros.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border/50 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir Todas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCompartirTodasWhatsApp} className="cursor-pointer">
                  <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                  WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCompartirTodasEmail} className="cursor-pointer">
                  <Mail className="w-4 h-4 mr-2 text-blue-500" />
                  Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isAdmin && (
            <Button asChild className="bg-gradient-to-r from-cuadrangular-cyan to-cuadrangular-purple hover:opacity-90 text-white shadow-glow-cyan animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <Link to="/dashboard/programaciones/nueva">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Programación
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          CONTENIDO
          ═══════════════════════════════════════════════════════════════════ */}
      <Card className="border-border/50 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <CardContent className="p-6">
          <Tabs defaultValue="lista" value={view} onValueChange={setView} className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="lista" className="data-[state=active]:bg-card">
                  <List className="w-4 h-4 mr-2" />
                  Lista
                </TabsTrigger>
                <TabsTrigger value="calendario" className="data-[state=active]:bg-card">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Calendario
                </TabsTrigger>
              </TabsList>

              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-48 border-border/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por mes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los meses</SelectItem>
                  <SelectItem value="4">Abril</SelectItem>
                  <SelectItem value="5">Mayo</SelectItem>
                  <SelectItem value="6">Junio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vista Lista */}
            <TabsContent value="lista" className="space-y-4 mt-0">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-cuadrangular-cyan" />
                </div>
              ) : filteredProgramaciones.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <CalendarIcon className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-lg font-medium">No hay programaciones</p>
                  <p className="text-sm">Crea una nueva programación para comenzar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProgramaciones.map((prog, index) => (
                    <div
                      key={prog.id}
                      className="group flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-cuadrangular-cyan/30 hover:bg-gradient-to-r hover:from-cuadrangular-cyan/5 hover:to-transparent transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Fecha visual */}
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cuadrangular-cyan/20 to-cuadrangular-purple/20 flex flex-col items-center justify-center">
                          <span className="text-xs text-muted-foreground uppercase">
                            {new Date(prog.fecha).toLocaleDateString("es-ES", { month: "short" })}
                          </span>
                          <span className="text-xl font-bold text-cuadrangular-cyan">
                            {new Date(prog.fecha).getDate()}
                          </span>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">{prog.tipo}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3.5 h-3.5" />
                              {new Date(prog.fecha).toLocaleDateString("es-ES", {
                                weekday: "long",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {prog.hora}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{prog.miembrosCount} miembros</span>
                        </div>
                        
                        <Badge variant="secondary" className={getEstadoStyles(prog.estado)}>
                          {prog.estado}
                        </Badge>

                        {/* Botón compartir */}
                        {prog.miembros.length > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-cuadrangular-cyan">
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleCompartirWhatsApp(prog)} className="cursor-pointer">
                                <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                                WhatsApp
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCompartirEmail(prog)} className="cursor-pointer">
                                <Mail className="w-4 h-4 mr-2 text-blue-500" />
                                Email
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                        
                        <Button variant="ghost" size="sm" asChild className="text-cuadrangular-cyan">
                          <Link to={`/dashboard/programaciones/${prog.id}`}>
                            <span className="hidden sm:inline">Ver</span>
                            <ChevronRight className="w-4 h-4 sm:ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Vista Calendario */}
            <TabsContent value="calendario" className="mt-0">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Calendario */}
                <div className="flex justify-center p-4 border border-border/50 rounded-xl bg-card">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                  />
                </div>
                
                {/* Programaciones del día */}
                <div className="flex-1">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-cuadrangular-cyan" />
                    {date ? date.toLocaleDateString("es-ES", { 
                      weekday: "long", 
                      day: "numeric", 
                      month: "long" 
                    }) : "Selecciona una fecha"}
                  </h3>
                  
                  {filteredProgramaciones.filter(
                    (prog) => new Date(prog.fecha).toDateString() === date?.toDateString()
                  ).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed border-border/50 rounded-xl">
                      <CalendarIcon className="w-12 h-12 mb-2 opacity-30" />
                      <p>No hay programaciones</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredProgramaciones
                        .filter((prog) => new Date(prog.fecha).toDateString() === date?.toDateString())
                        .map((prog) => (
                          <div 
                            key={prog.id} 
                            className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:border-cuadrangular-cyan/30 transition-colors"
                          >
                            <div>
                              <h4 className="font-semibold">{prog.tipo}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{prog.hora}</span>
                                <Badge variant="secondary" className={getEstadoStyles(prog.estado)}>
                                  {prog.estado}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/dashboard/programaciones/${prog.id}`}>
                                Ver Detalles
                              </Link>
                            </Button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
