"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Input } from "../../components/ui/input"
import { CalendarIcon, Clock, Users, ChevronLeft, Share2, MessageCircle, Mail, Loader2, Music, Plus, Trash2, Search, X } from 'lucide-react'
import { useAuth } from "../../contexts/AuthContext"
import { useProgramaciones, useCanciones } from "../../hooks"
import { compartirWhatsApp, compartirEmail, generarMensajeSimple, generarMensajeProgramacion } from "../../lib/share"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"

export default function DetallesProgramacionPage() {
  const { profile } = useAuth()
  const isAdmin = profile?.is_admin ?? false
  const { id } = useParams<{ id: string }>()
  
  console.log('Datos del usuario:', {
    profile,
    profileId: profile?.id,
    profileNombre: profile?.nombre,
    profileApellido: profile?.apellido,
    isAdmin
  })
  
  const { programaciones: programacionesData, loading } = useProgramaciones()
  const { canciones: cancionesData } = useCanciones()
  const [programacion, setProgramacion] = useState<any>(null)
  const [isVozLider, setIsVozLider] = useState(false)
  const [canManageSongs, setCanManageSongs] = useState(false)
  
  // Estados para gestión de canciones
  const [isAddSongDialogOpen, setIsAddSongDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSong, setSelectedSong] = useState<any>(null)
  const [selectedTono, setSelectedTono] = useState("")
  const [isAddingSong, setIsAddingSong] = useState(false)

  useEffect(() => {
    if (programacionesData && id) {
      const prog = programacionesData.find(p => p.id === id)
      if (prog) {
        setProgramacion(prog)
        
        // TEMPORAL: Forzar permisos para debugging
        const tempForceAccess = true // Cambiar a false cuando esté solucionado
        
        // Verificar si el usuario actual es Voz Líder en esta programación
        const usuarioEsVozLider = (prog as any).programacion_miembros?.some((pm: any) => {
          const miembroId = pm.miembro?.id
          const rolNombre = pm.rol?.nombre?.toLowerCase()
          const usuarioId = profile?.id
          
          console.log('Verificación Voz Líder:', {
            miembroId,
            miembroNombre: pm.miembro?.nombre,
            miembroApellido: pm.miembro?.apellido,
            rolNombre,
            usuarioId,
            coinciden: miembroId === usuarioId && (rolNombre === "voz líder" || rolNombre === "voz lider" || rolNombre === "voz_lider")
          })
          
          return miembroId === usuarioId && (rolNombre === "voz líder" || rolNombre === "voz lider" || rolNombre === "voz_lider")
        })
        
        setIsVozLider(usuarioEsVozLider || tempForceAccess)
        setCanManageSongs(isAdmin || usuarioEsVozLider || tempForceAccess)
        
        console.log('Permisos de gestión:', {
          isAdmin,
          isVozLider: usuarioEsVozLider,
          canManageSongs: isAdmin || usuarioEsVozLider
        })
      }
    }
  }, [programacionesData, id, profile?.id, isAdmin])

  // Filtrar canciones disponibles
  const filteredCanciones = cancionesData?.filter(cancion => 
    cancion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cancion.autor?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  // Obtener canciones ya asignadas
  const assignedSongs = (programacion as any)?.programacion_canciones || []
  const assignedSongIds = new Set(assignedSongs.map((pc: any) => pc.cancion_id))
  
  // Canciones disponibles (no asignadas)
  const availableCanciones = filteredCanciones.filter(cancion => !assignedSongIds.has(cancion.id))

  const handleAddSong = async () => {
    if (!selectedSong || !selectedTono) return
    
    setIsAddingSong(true)
    try {
      // Aquí iría la lógica para añadir la canción a la programación
      // Por ahora, solo cerramos el diálogo
      console.log("Añadiendo canción:", selectedSong.nombre, "Tono:", selectedTono)
      setIsAddSongDialogOpen(false)
      setSelectedSong(null)
      setSelectedTono("")
      setSearchTerm("")
    } catch (error) {
      console.error("Error al añadir canción:", error)
    } finally {
      setIsAddingSong(false)
    }
  }

  const handleRemoveSong = async (songId: string) => {
    try {
      // Aquí iría la lógica para eliminar la canción
      console.log("Eliminando canción:", songId)
    } catch (error) {
      console.error("Error al eliminar canción:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cuadrangular-cyan/5 via-cuadrangular-purple/5 to-cuadrangular-cyan/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cuadrangular-cyan mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando programación...</p>
        </div>
      </div>
    )
  }

  if (!programacion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cuadrangular-cyan/5 via-cuadrangular-purple/5 to-cuadrangular-cyan/10 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground mb-4">Programación no encontrada</h2>
          <Button asChild variant="outline">
            <Link to="/dashboard/programaciones">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver a Programaciones
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Extraer miembros con sus roles
  const miembros = (programacion as any).programacion_miembros?.map((pm: any) => ({
    id: pm.miembro?.id,
    nombre: pm.miembro?.nombre || "",
    apellido: pm.miembro?.apellido || "",
    rol: pm.rol?.nombre || "Sin rol",
    avatar_url: pm.miembro?.avatar_url
  })) || []

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

  const handleCompartir = (method: 'whatsapp' | 'email') => {
    const mensaje = generarMensajeProgramacion(programacion)
    
    if (method === 'whatsapp') {
      compartirWhatsApp(mensaje)
    } else {
      compartirEmail(mensaje)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cuadrangular-cyan/5 via-cuadrangular-purple/5 to-cuadrangular-cyan/10">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="icon" className="h-8 w-8">
              <Link to="/dashboard/programaciones">
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-cuadrangular-cyan">Detalles de Programación</h1>
              <p className="text-sm text-muted-foreground">
                {new Date(programacion.fecha).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleCompartir('whatsapp')}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCompartir('email')}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {canManageSongs && (
              <>
                <Button asChild className="bg-gradient-to-r from-cuadrangular-cyan to-cuadrangular-purple hover:opacity-90 text-white">
                  <Link to={`/dashboard/programaciones/${programacion.id}/editar`}>
                    Editar
                  </Link>
                </Button>
                
                <Button 
                  onClick={() => setIsAddSongDialogOpen(true)}
                  className="bg-gradient-to-r from-cuadrangular-purple to-cuadrangular-red hover:opacity-90 text-white"
                >
                  <Music className="w-4 h-4 mr-2" />
                  Añadir Canción
                </Button>
              </>
            )}
            
            {isAdmin && !canManageSongs && (
              <Button asChild className="bg-gradient-to-r from-cuadrangular-cyan to-cuadrangular-purple hover:opacity-90 text-white">
                <Link to={`/dashboard/programaciones/${programacion.id}/editar`}>
                  Editar
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Información principal */}
        <Card className="mb-6 bg-white/50 backdrop-blur-sm border-cuadrangular-cyan/20">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-cuadrangular-cyan" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium">
                      {new Date(programacion.fecha).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-cuadrangular-cyan" />
                  <div>
                    <p className="text-sm text-muted-foreground">Hora</p>
                    <p className="font-medium">{programacion.hora || "9:00 AM"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-cuadrangular-purple/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded bg-cuadrangular-purple" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <p className="font-medium">{(programacion as any).tipo_servicio?.nombre || "Servicio"}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Estado</p>
                  <Badge className={getEstadoStyles(programacion.estado)}>
                    {programacion.estado}
                  </Badge>
                </div>
                
                {programacion.notas && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Notas</p>
                    <p className="text-sm bg-muted/50 rounded-lg p-3">{programacion.notas}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Miembros asignados */}
        <Card className="bg-white/50 backdrop-blur-sm border-cuadrangular-cyan/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-cuadrangular-cyan" />
              <h3 className="text-lg font-semibold text-cuadrangular-cyan">Miembros Asignados</h3>
              <Badge variant="outline" className="ml-auto">
                {miembros.length} miembro{miembros.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            {miembros.length > 0 ? (
              <div className="grid gap-3">
                {miembros.map((miembro: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-cuadrangular-cyan/5 rounded-lg border border-cuadrangular-cyan/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cuadrangular-cyan to-cuadrangular-purple flex items-center justify-center text-white font-medium">
                        {miembro.avatar_url ? (
                          <img 
                            src={miembro.avatar_url} 
                            alt={miembro.nombre}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          `${miembro.nombre.charAt(0)}${miembro.apellido.charAt(0)}`
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{miembro.nombre} {miembro.apellido}</p>
                        <p className="text-sm text-muted-foreground">{miembro.rol}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay miembros asignados</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Canciones asignadas */}
        <Card className="bg-white/50 backdrop-blur-sm border-cuadrangular-cyan/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-5 h-5 text-cuadrangular-cyan" />
              <h3 className="text-lg font-semibold text-cuadrangular-cyan">Canciones Asignadas</h3>
              <Badge variant="outline" className="ml-auto">
                {assignedSongs.length} canción{assignedSongs.length !== 1 ? 'es' : ''}
              </Badge>
              {canManageSongs && (
                <Button 
                  size="sm" 
                  onClick={() => setIsAddSongDialogOpen(true)}
                  className="ml-2 bg-gradient-to-r from-cuadrangular-purple to-cuadrangular-red hover:opacity-90 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Añadir
                </Button>
              )}
            </div>
            
            {assignedSongs.length > 0 ? (
              <div className="space-y-3">
                {assignedSongs.map((pc: any, index: number) => (
                  <div key={pc.id || index} className="flex items-center justify-between p-4 bg-cuadrangular-purple/5 rounded-lg border border-cuadrangular-purple/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cuadrangular-purple to-cuadrangular-red flex items-center justify-center text-white">
                        <Music className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{pc.cancion?.nombre || 'Canción sin nombre'}</p>
                        <p className="text-sm text-muted-foreground">
                          {pc.cancion?.autor || 'Autor desconocido'} • 
                          <span className="ml-1 font-medium text-cuadrangular-purple">
                            Tono: {pc.tono_usado || pc.cancion?.tono || 'N/A'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Orden #{pc.orden || index + 1}
                      </Badge>
                      {canManageSongs && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-cuadrangular-red hover:text-cuadrangular-red"
                          onClick={() => handleRemoveSong(pc.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay canciones asignadas</p>
                {canManageSongs && (
                  <Button 
                    onClick={() => setIsAddSongDialogOpen(true)}
                    className="mt-4 bg-gradient-to-r from-cuadrangular-purple to-cuadrangular-red hover:opacity-90 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir Primera Canción
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diálogo para añadir canción */}
        <Dialog open={isAddSongDialogOpen} onOpenChange={setIsAddSongDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-cuadrangular-purple" />
                Añadir Canción a la Programación
              </DialogTitle>
              <DialogDescription>
                Selecciona una canción del repertorio para añadirla a esta programación.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar canción o autor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Lista de canciones disponibles */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {availableCanciones.length > 0 ? (
                  availableCanciones.map((cancion) => (
                    <div
                      key={cancion.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedSong?.id === cancion.id
                          ? 'bg-cuadrangular-purple/10 border-cuadrangular-purple'
                          : 'bg-muted/30 border-border hover:bg-cuadrangular-purple/5'
                      }`}
                      onClick={() => setSelectedSong(cancion)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cuadrangular-purple to-cuadrangular-red flex items-center justify-center text-white text-sm">
                            <Music className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium">{cancion.nombre}</p>
                            <p className="text-sm text-muted-foreground">{cancion.autor || 'Autor desconocido'}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {cancion.tono || 'Sin tono'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>
                      {searchTerm 
                        ? 'No se encontraron canciones' 
                        : 'No hay canciones disponibles en el repertorio'
                      }
                    </p>
                  </div>
                )}
              </div>
              
              {/* Selección de tono */}
              {selectedSong && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Tono para esta programación:</label>
                  <Select value={selectedTono} onValueChange={setSelectedTono}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tono..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={selectedSong.tono || ''}>Tono original: {selectedSong.tono || 'N/A'}</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                      <SelectItem value="G">G</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddSongDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleAddSong}
                disabled={!selectedSong || !selectedTono || isAddingSong}
                className="bg-gradient-to-r from-cuadrangular-purple to-cuadrangular-red hover:opacity-90 text-white"
              >
                {isAddingSong ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Añadiendo...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir Canción
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
