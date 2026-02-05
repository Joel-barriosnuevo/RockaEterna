"use client"

import { useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
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
  const navigate = useNavigate()
  
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

  const filteredProgramaciones = useMemo(() => {
    if (!programaciones.length) return []
    
    if (filterMonth === "all") {
      console.log('Mostrando todas las programaciones:', programaciones.length)
      return programaciones
    }
    
    const filtered = programaciones.filter((prog) => {
      try {
        const progDate = new Date(prog.fecha)
        const month = progDate.getMonth() + 1
        const matches = month.toString() === filterMonth
        return matches
      } catch (error) {
        console.error('Error parsing date:', prog.fecha, error)
        return false
      }
    })
    
    console.log(`Filtro mes ${filterMonth}: ${programaciones.length} total -> ${filtered.length} filtradas`)
    return filtered
  }, [programaciones, filterMonth])

  // Obtener días que tienen programaciones para el calendario
  const daysWithProgramaciones = useMemo(() => {
    const days = new Set<string>()
    filteredProgramaciones.forEach(prog => {
      try {
        days.add(new Date(prog.fecha).toDateString())
      } catch (error) {
        console.error('Error parsing date for calendar:', prog.fecha, error)
      }
    })
    return days
  }, [filteredProgramaciones])

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
          <h1 className="text-2xl sm:text-3xl font-display font-bold flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cuadrangular-cyan/10 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-cuadrangular-cyan" />
            </div>
            <span className="truncate">Programaciones</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {filteredProgramaciones.length} programaciones encontradas
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Botón compartir todas - Solo admin */}
          {isAdmin && programacionesConMiembros.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border/50 animate-fade-in-up w-full sm:w-auto justify-start sm:justify-center" style={{ animationDelay: "0.05s" }}>
                  <Share2 className="w-4 h-4 mr-2" />
                  <span className="truncate">Compartir Todas</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
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
            <Button asChild className="bg-gradient-to-r from-cuadrangular-cyan to-cuadrangular-purple hover:opacity-90 text-white shadow-glow-cyan animate-fade-in-up w-full sm:w-auto justify-start sm:justify-center" style={{ animationDelay: "0.1s" }}>
              <Link to="/dashboard/programaciones/nueva">
                <Plus className="w-4 h-4 mr-2" />
                <span className="truncate">Nueva Programación</span>
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
              <TabsList className="bg-muted/50 w-full sm:w-auto justify-start">
                <TabsTrigger value="lista" className="data-[state=active]:bg-card flex-1 sm:flex-none">
                  <List className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Lista</span>
                  <span className="sm:hidden">Lista</span>
                </TabsTrigger>
                <TabsTrigger value="calendario" className="data-[state=active]:bg-card flex-1 sm:flex-none">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Calendario</span>
                  <span className="sm:hidden">Calend</span>
                </TabsTrigger>
              </TabsList>

              {/* Filtro de meses - Solo en vista calendario */}
              {view === "calendario" && (
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger className="w-full sm:w-48 border-border/50">
                    <Filter className="w-4 h-4 mr-2 shrink-0" />
                    <SelectValue placeholder="Filtrar por mes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los meses</SelectItem>
                    <SelectItem value="1">Enero</SelectItem>
                    <SelectItem value="2">Febrero</SelectItem>
                    <SelectItem value="3">Marzo</SelectItem>
                    <SelectItem value="4">Abril</SelectItem>
                    <SelectItem value="5">Mayo</SelectItem>
                    <SelectItem value="6">Junio</SelectItem>
                    <SelectItem value="7">Julio</SelectItem>
                    <SelectItem value="8">Agosto</SelectItem>
                    <SelectItem value="9">Septiembre</SelectItem>
                    <SelectItem value="10">Octubre</SelectItem>
                    <SelectItem value="11">Noviembre</SelectItem>
                    <SelectItem value="12">Diciembre</SelectItem>
                  </SelectContent>
                </Select>
              )}
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
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl border border-border/50 hover:border-cuadrangular-cyan/30 hover:bg-gradient-to-r hover:from-cuadrangular-cyan/5 hover:to-transparent transition-all duration-300 animate-fade-in-up gap-3"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Fecha visual */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-cuadrangular-cyan/20 to-cuadrangular-purple/20 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[10px] sm:text-xs text-muted-foreground uppercase">
                            {new Date(prog.fecha).toLocaleDateString("es-ES", { month: "short" })}
                          </span>
                          <span className="text-lg sm:text-xl font-bold text-cuadrangular-cyan">
                            {new Date(prog.fecha).getDate()}
                          </span>
                        </div>
                        
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base truncate">{prog.tipo}</h4>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span className="hidden sm:inline">{new Date(prog.fecha).toLocaleDateString("es-ES", { weekday: "long" })}</span>
                              <span className="sm:hidden">{new Date(prog.fecha).toLocaleDateString("es-ES", { weekday: "short" })}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              {prog.hora}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-2 pl-15 sm:pl-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground sm:hidden">
                            {prog.miembrosCount}
                          </span>
                          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{prog.miembrosCount}</span>
                          </div>
                          
                          <Badge variant="secondary" className={`text-xs ${getEstadoStyles(prog.estado)}`}>
                            {prog.estado}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Botón compartir - Solo admin */}
                          {isAdmin && prog.miembros.length > 0 && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-cuadrangular-cyan">
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
                          
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-cuadrangular-cyan">
                            <Link to={`/dashboard/programaciones/${prog.id}`}>
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Vista Calendario */}
            <TabsContent value="calendario" className="mt-0">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Calendario mejorado */}
                <div className="flex flex-col justify-center p-6 border-2 border-dashed border-cuadrangular-cyan/30 rounded-2xl bg-gradient-to-br from-cuadrangular-cyan/5 via-cuadrangular-purple/5 to-cuadrangular-cyan/10 backdrop-blur-sm">
                  <div className="text-center mb-4 w-full">
                    <h3 className="text-lg font-semibold text-cuadrangular-cyan flex items-center justify-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      Calendario de Programaciones
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Selecciona una fecha para ver las programaciones
                    </p>
                  </div>
                  <div className="w-full">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-lg"
                    components={{
                      Day: ({ date: dayDate, ...props }) => {
                        if (!dayDate) return <div {...props} />
                        
                        const hasProgramacion = daysWithProgramaciones.has(dayDate.toDateString())
                        const isToday = dayDate.toDateString() === new Date().toDateString()
                        const isSelected = date?.toDateString() === dayDate.toDateString()
                        
                        let className = "h-10 w-10 text-sm rounded-lg font-medium transition-all duration-200 "
                        
                        if (isSelected) {
                          className += " bg-gradient-to-r from-cuadrangular-cyan to-cuadrangular-purple text-white shadow-lg hover:shadow-xl "
                        } else if (isToday) {
                          className += " bg-cuadrangular-yellow/20 text-cuadrangular-yellow font-bold "
                        } else if (hasProgramacion) {
                          className += " bg-cuadrangular-cyan/10 text-cuadrangular-cyan border border-cuadrangular-cyan/30 hover:bg-cuadrangular-cyan/20 "
                        } else {
                          className += " hover:bg-cuadrangular-cyan/20 "
                        }
                        
                        return (
                          <div
                            {...props}
                            className={className}
                          >
                            {dayDate.getDate()}
                          </div>
                        )
                      }
                    }}
                    classNames={{
                      months: "space-y-2",
                      month: "text-sm font-medium text-cuadrangular-cyan",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium text-cuadrangular-purple",
                      nav: "space-x-1",
                      nav_button: "h-8 w-8 rounded-lg bg-cuadrangular-cyan/10 hover:bg-cuadrangular-cyan/20 text-cuadrangular-cyan transition-colors",
                      table: "w-full border-collapse space-y-1",
                      head_row: "text-cuadrangular-purple",
                      head_cell: "text-xs font-medium uppercase tracking-wider py-2 px-3",
                      row: "hover:bg-cuadrangular-cyan/5 transition-colors",
                      cell: "text-center py-3 px-2 relative",
                      day_outside: "text-muted-foreground opacity-50"
                    }}
                  />
                  </div>
                </div>
                
                {/* Programaciones del día mejorado */}
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-cuadrangular-cyan/10 via-cuadrangular-purple/10 to-cuadrangular-cyan/5 backdrop-blur-sm rounded-2xl p-6 border border-cuadrangular-cyan/20">
                    <h3 className="font-semibold text-lg text-cuadrangular-cyan flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      {date ? date.toLocaleDateString("es-ES", { 
                        weekday: "long", 
                        day: "numeric", 
                        month: "long",
                        year: "numeric"
                      }) : "Selecciona una fecha"}
                    </h3>
                    
                    {filteredProgramaciones.filter(
                      (prog) => new Date(prog.fecha).toDateString() === date?.toDateString()
                    ).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <CalendarIcon className="w-16 h-16 mb-4 text-cuadrangular-cyan/50" />
                        <h4 className="text-lg font-medium text-cuadrangular-cyan">No hay programaciones</h4>
                        <p className="text-sm text-muted-foreground mt-2">
                          {date ? 'No hay programaciones programadas para este día' : 'Selecciona una fecha en el calendario'}
                        </p>
                        {date && (
                          <Button 
                            onClick={() => navigate('/dashboard/programaciones/nueva')}
                            className="mt-4 bg-gradient-to-r from-cuadrangular-cyan to-cuadrangular-purple hover:opacity-90 text-white shadow-lg transition-all duration-300"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Programación
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(() => {
                          const dayProgramaciones = filteredProgramaciones
                            .filter((prog) => new Date(prog.fecha).toDateString() === date?.toDateString())
                          
                          console.log(`Programaciones para el día ${date?.toDateString()}:`, {
                            totalFiltradas: filteredProgramaciones.length,
                            delDia: dayProgramaciones.length,
                            diaSeleccionado: date?.toDateString(),
                            programacionesDelDia: dayProgramaciones.map(p => ({ id: p.id, fecha: p.fecha, tipo: p.tipo }))
                          })
                          
                          return dayProgramaciones.map((prog, index) => (
                            <div 
                              key={prog.id} 
                              className="group bg-white/80 backdrop-blur-sm rounded-xl border border-cuadrangular-cyan/30 p-4 hover:border-cuadrangular-cyan/50 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-cuadrangular-purple flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-cuadrangular-cyan animate-pulse" />
                                    {prog.tipo}
                                  </h4>
                                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4 text-cuadrangular-cyan" />
                                      <span className="font-medium">{prog.hora}</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users className="w-4 h-4 text-cuadrangular-yellow" />
                                      <span className="font-medium">{prog.miembrosCount} miembros</span>
                                    </span>
                                  </div>
                                  {prog.miembros.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                      {prog.miembros.slice(0, 3).map((miembro: any, idx: number) => (
                                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full bg-cuadrangular-purple/10 text-cuadrangular-purple text-xs font-medium">
                                          {miembro.nombre} {miembro.apellido}
                                        </span>
                                      ))}
                                      {prog.miembros.length > 3 && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-cuadrangular-purple/10 text-cuadrangular-purple text-xs font-medium">
                                          +{prog.miembros.length - 3} más
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <Badge variant="secondary" className={`text-xs font-medium px-3 py-1 ${getEstadoStyles(prog.estado)}`}>
                                    {prog.estado}
                                  </Badge>
                                  <Button variant="ghost" size="sm" asChild className="bg-cuadrangular-cyan/10 hover:bg-cuadrangular-cyan/20 text-cuadrangular-cyan border-cuadrangular-cyan/30">
                                    <Link to={`/dashboard/programaciones/${prog.id}`}>
                                      <ChevronRight className="w-4 h-4" />
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
