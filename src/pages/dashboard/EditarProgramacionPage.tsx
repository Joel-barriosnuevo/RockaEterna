"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { Checkbox } from "../../components/ui/checkbox"
import { CalendarIcon, Save, ArrowLeft, Users, ShieldAlert, Loader2, Trash2 } from 'lucide-react'
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { useAuth } from "../../contexts/AuthContext"
import { useMiembros, useTiposServicio } from "../../hooks"
import { programacionesService } from "../../services/programaciones.service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog"

export default function EditarProgramacionPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { profile, initialized } = useAuth()
  const isAdmin = profile?.is_admin ?? false
  
  const [date, setDate] = useState<Date>()
  const [fechaHora, setFechaHora] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [loadingProg, setLoadingProg] = useState(true)
  const [formData, setFormData] = useState({
    tipo: "",
    notas: "",
    estado: "Pendiente",
    miembrosSeleccionados: [] as { id: string; rolId: number; rolNombre: string }[],
  })
  
  // Cargar datos desde Supabase
  const { miembros, loading: loadingMiembros } = useMiembros({ activo: true })
  const { tipos: tiposServicio, loading: loadingTipos } = useTiposServicio()
  
  // Convertir fecha y hora a Date cuando cambia el input datetime-local
  useEffect(() => {
    if (fechaHora) {
      const newDate = new Date(fechaHora)
      if (!isNaN(newDate.getTime())) {
        setDate(newDate)
      }
    }
  }, [fechaHora])
  
  // Formatear fecha para el input datetime-local
  const formatFechaHora = (date: Date | undefined) => {
    if (!date) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }
  
  // Cargar programación existente
  useEffect(() => {
    const loadProgramacion = async () => {
      if (!id) return
      
      try {
        const prog = await programacionesService.getById(id)
        if (prog) {
          // Combinar fecha y hora en un Date
          const fechaBase = parseISO(prog.fecha)
          if (prog.hora) {
            const [hours, minutes] = prog.hora.split(':')
            fechaBase.setHours(parseInt(hours), parseInt(minutes))
          }
          setDate(fechaBase)
          setFechaHora(formatFechaHora(fechaBase))
          
          // Extraer miembros asignados con su rol
          const miembrosAsignados = (prog as any).programacion_miembros?.map((pm: any) => ({
            id: pm.miembro_id,
            rolId: pm.rol_id || 0,
            rolNombre: pm.rol?.nombre || "Sin rol"
          })) || []
          
          setFormData({
            tipo: prog.tipo_id?.toString() || "",
            notas: prog.notas || "",
            estado: prog.estado || "Pendiente",
            miembrosSeleccionados: miembrosAsignados
          })
        }
      } catch (error) {
        console.error("Error cargando programación:", error)
      } finally {
        setLoadingProg(false)
      }
    }
    
    loadProgramacion()
  }, [id])
  
  // Redirigir si no es admin
  useEffect(() => {
    if (initialized && !isAdmin) {
      navigate("/dashboard/programaciones")
    }
  }, [isAdmin, initialized, navigate])
  
  // Mostrar mensaje si no es admin
  if (initialized && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="w-16 h-16 text-cuadrangular-red mb-4" />
        <h2 className="text-2xl font-bold mb-2">Acceso Restringido</h2>
        <p className="text-muted-foreground">Solo los administradores pueden editar programaciones.</p>
      </div>
    )
  }

  // Obtener todos los roles de un miembro
  const getTodosRoles = (miembro: typeof miembros[0]) => {
    const todosRoles = (miembro as any).todos_los_roles
    if (todosRoles && todosRoles.length > 0) {
      return todosRoles.map((r: any) => ({
        id: r.rol_id,
        nombre: r.rol?.nombre || "Sin nombre",
        esPrincipal: r.es_principal
      }))
    }
    // Fallback al rol principal
    if ((miembro as any).rol?.nombre) {
      return [{ id: miembro.rol_principal_id, nombre: (miembro as any).rol.nombre, esPrincipal: true }]
    }
    return []
  }

  const handleToggleMiembro = (miembroId: string, rolId: number, rolNombre: string) => {
    setFormData((prev) => {
      const existe = prev.miembrosSeleccionados.find(m => m.id === miembroId)
      if (existe) {
        return { 
          ...prev, 
          miembrosSeleccionados: prev.miembrosSeleccionados.filter((m) => m.id !== miembroId) 
        }
      }
      return { 
        ...prev, 
        miembrosSeleccionados: [...prev.miembrosSeleccionados, { id: miembroId, rolId, rolNombre }] 
      }
    })
  }

  // Cambiar el rol de un miembro ya seleccionado
  const handleCambiarRol = (miembroId: string, rolId: number, rolNombre: string) => {
    setFormData((prev) => ({
      ...prev,
      miembrosSeleccionados: prev.miembrosSeleccionados.map(m => 
        m.id === miembroId ? { ...m, rolId, rolNombre } : m
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date || !id) {
      alert("Por favor selecciona una fecha y hora")
      return
    }
    
    if (!formData.tipo) {
      alert("Por favor selecciona un tipo de servicio")
      return
    }
    
    setIsSaving(true)
    try {
      // Actualizar la programación
      await programacionesService.update(id, {
        fecha: format(date, "yyyy-MM-dd"),
        hora: format(date, "HH:mm"),
        tipo_id: parseInt(formData.tipo),
        notas: formData.notas || null,
        estado: formData.estado,
      })
      
      // Actualizar miembros: primero eliminar todos, luego agregar los nuevos
      const progActual = await programacionesService.getById(id)
      const miembrosActuales = (progActual as any).programacion_miembros || []
      
      // Eliminar miembros que ya no están
      for (const pm of miembrosActuales) {
        if (!formData.miembrosSeleccionados.find(m => m.id === pm.miembro_id)) {
          await programacionesService.removeMiembro(id, pm.miembro_id)
        }
      }
      
      // Agregar miembros nuevos o actualizar rol
      for (const miembro of formData.miembrosSeleccionados) {
        const existente = miembrosActuales.find((pm: any) => pm.miembro_id === miembro.id)
        if (!existente) {
          // Agregar nuevo
          await programacionesService.addMiembro(id, miembro.id, miembro.rolId || undefined)
        } else if (existente.rol_id !== miembro.rolId) {
          // Rol cambió - eliminar y re-agregar
          await programacionesService.removeMiembro(id, miembro.id)
          await programacionesService.addMiembro(id, miembro.id, miembro.rolId || undefined)
        }
      }
      
      navigate("/dashboard/programaciones")
    } catch (error) {
      console.error("Error al actualizar programación:", error)
      alert("Error al actualizar la programación")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    
    setIsDeleting(true)
    try {
      await programacionesService.delete(id)
      navigate("/dashboard/programaciones")
    } catch (error) {
      console.error("Error al eliminar programación:", error)
      alert("Error al eliminar la programación")
    } finally {
      setIsDeleting(false)
    }
  }

  if (loadingProg) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-cuadrangular-cyan" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/dashboard/programaciones")}
            className="border-border/50 hover:bg-cuadrangular-cyan/10 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-display font-bold truncate">Editar Programación</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">Modifica los detalles de la programación</p>
          </div>
        </div>
        
        {/* Botón Eliminar */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isDeleting} className="self-end sm:self-auto">
              {isDeleting ? (
                <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 sm:mr-2" />
              )}
              <span className="hidden sm:inline">Eliminar</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar programación?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente la programación
                y todos los miembros asignados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="w-full sm:w-auto bg-destructive text-destructive-foreground">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Columna izquierda - Info general */}
          <Card className="border-border/50 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-cuadrangular-cyan" />
                Información General
              </CardTitle>
              <CardDescription>Detalles básicos de la programación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tipo de servicio */}
              <div className="space-y-2">
                <Label>Tipo de Servicio *</Label>
                {loadingTipos ? (
                  <div className="flex items-center gap-2 p-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Cargando...</span>
                  </div>
                ) : (
                  <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger className="border-border/50 focus:border-cuadrangular-cyan">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposServicio.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                          {tipo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                  <SelectTrigger className="border-border/50 focus:border-cuadrangular-cyan">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Confirmado">Confirmado</SelectItem>
                    <SelectItem value="Borrador">Borrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fecha y Hora combinados */}
              <div className="space-y-2">
                <Label>Fecha y Hora *</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="datetime-local"
                    value={formatFechaHora(date)}
                    onChange={(e) => setFechaHora(e.target.value)}
                    className="pl-10 border-border/50 focus:border-cuadrangular-cyan"
                  />
                </div>
                {date && (
                  <p className="text-sm text-muted-foreground">
                    {format(date, "EEEE, d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                  </p>
                )}
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <Label>Notas</Label>
                <Textarea
                  placeholder="Notas adicionales..."
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  rows={4}
                  className="border-border/50 focus:border-cuadrangular-cyan resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Columna derecha - Equipo */}
          <Card className="border-border/50 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <Users className="w-5 h-5 text-cuadrangular-yellow" />
                  Equipo
                  <span className="ml-auto text-sm font-normal text-muted-foreground">
                    {formData.miembrosSeleccionados.length} seleccionados
                  </span>
                </CardTitle>
                <CardDescription>Asigna miembros del equipo</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingMiembros ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-cuadrangular-yellow" />
                  </div>
                ) : miembros.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No hay miembros en el equipo</p>
                    <p className="text-sm">Agrega miembros desde la sección Equipo</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {miembros.map((miembro) => {
                      const roles = getTodosRoles(miembro)
                      const seleccionado = formData.miembrosSeleccionados.find(m => m.id === miembro.id)
                      const isSelected = !!seleccionado
                      const tieneMultiplesRoles = roles.length > 1
                      
                      return (
                        <div
                          key={miembro.id}
                          className={`p-3 rounded-xl border transition-all duration-200 ${
                            isSelected
                              ? "border-cuadrangular-yellow/50 bg-cuadrangular-yellow/5"
                              : "border-border/50 hover:border-cuadrangular-yellow/30"
                          }`}
                        >
                          <label className="flex items-center gap-3 cursor-pointer">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => {
                                if (isSelected) {
                                  handleToggleMiembro(miembro.id, 0, "")
                                } else {
                                  const primerRol = roles[0]
                                  if (primerRol) {
                                    handleToggleMiembro(miembro.id, primerRol.id, primerRol.nombre)
                                  }
                                }
                              }}
                              className="data-[state=checked]:bg-cuadrangular-yellow data-[state=checked]:border-cuadrangular-yellow"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{miembro.nombre} {miembro.apellido}</p>
                              {!isSelected && (
                                <p className="text-sm text-muted-foreground">
                                  {roles.map((r: any) => r.nombre).join(", ")}
                                </p>
                              )}
                            </div>
                          </label>
                          
                          {/* Selector de rol si tiene múltiples roles y está seleccionado */}
                          {isSelected && tieneMultiplesRoles && (
                            <div className="mt-2 pl-8">
                              <Select
                                value={seleccionado?.rolId?.toString()}
                                onValueChange={(value) => {
                                  const rol = roles.find((r: any) => r.id.toString() === value)
                                  if (rol) {
                                    handleCambiarRol(miembro.id, rol.id, rol.nombre)
                                  }
                                }}
                              >
                                <SelectTrigger className="h-8 text-sm border-cuadrangular-yellow/30 bg-cuadrangular-yellow/5">
                                  <SelectValue placeholder="Seleccionar rol" />
                                </SelectTrigger>
                                <SelectContent>
                                  {roles.map((rol: any) => (
                                    <SelectItem key={rol.id} value={rol.id.toString()}>
                                      <div className="flex items-center gap-2">
                                        {rol.nombre}
                                        {rol.esPrincipal && (
                                          <span className="text-xs text-muted-foreground">(principal)</span>
                                        )}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          
                          {/* Mostrar rol seleccionado si solo tiene uno */}
                          {isSelected && !tieneMultiplesRoles && roles[0] && (
                            <p className="text-sm text-cuadrangular-yellow mt-1 pl-8">
                              {roles[0].nombre}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
          </Card>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/dashboard/programaciones")}
            className="border-border/50 w-full sm:w-auto"
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isSaving || !date || !formData.tipo}
            className="bg-gradient-to-r from-cuadrangular-cyan to-cuadrangular-purple hover:opacity-90 text-white shadow-glow-cyan w-full sm:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
