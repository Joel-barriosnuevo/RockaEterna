"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Search, Plus, Mail, Phone, Edit, Trash2, Users, UserCheck, UserX, Loader2, MessageCircle, Send, Check } from 'lucide-react'
import { useMiembros, useRoles } from "../../hooks"
import { miembrosService } from "../../services/miembros.service"
import { authService } from "../../services/auth.service"
import { useAuth } from "../../contexts/AuthContext"
import type { NuevoMiembro, Usuario } from "../../types/database.types"
import { generarNotificacionPersonal, notificarMiembroWhatsApp } from "../../lib/share"
import { notificarMiembroPorEmail } from "../../services/email.service"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

// Gradientes para avatars
const GRADIENTS = [
  "from-cuadrangular-red to-cuadrangular-purple",
  "from-cuadrangular-cyan to-cuadrangular-purple",
  "from-cuadrangular-yellow to-cuadrangular-red",
  "from-cuadrangular-purple to-cuadrangular-cyan",
  "from-cuadrangular-red to-cuadrangular-yellow",
  "from-cuadrangular-cyan to-cuadrangular-yellow",
]

export default function EquipoPage() {
  const { profile } = useAuth()
  const isAdmin = profile?.is_admin ?? false
  
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Estado para usuarios registrados (crear)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loadingUsuarios, setLoadingUsuarios] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [selectedRoles, setSelectedRoles] = useState<number[]>([])

  // Estado para editar miembro
  const [editingMiembro, setEditingMiembro] = useState<typeof miembros[0] | null>(null)
  const [editRoles, setEditRoles] = useState<number[]>([])
  const [editTelefono, setEditTelefono] = useState("")

  // Hooks de datos
  const { miembros, loading, createMiembro, updateMiembro, deleteMiembro, toggleActivo, refetch } = useMiembros()
  const { roles } = useRoles()

  // Cargar usuarios cuando se abre el diálogo
  useEffect(() => {
    if (isDialogOpen) {
      loadUsuarios()
    }
  }, [isDialogOpen])

  const loadUsuarios = async () => {
    setLoadingUsuarios(true)
    try {
      const data = await authService.getAllUsuarios()
      setUsuarios(data)
    } catch (error) {
      console.error("Error cargando usuarios:", error)
    } finally {
      setLoadingUsuarios(false)
    }
  }

  // Filtrar usuarios que ya son miembros
  const usuariosDisponibles = useMemo(() => {
    const emailsMiembros = miembros.map(m => m.email?.toLowerCase()).filter(Boolean)
    return usuarios.filter(u => !emailsMiembros.includes(u.email?.toLowerCase()))
  }, [usuarios, miembros])

  // Usuario seleccionado
  const usuarioSeleccionado = useMemo(() => {
    return usuarios.find(u => u.id === selectedUserId)
  }, [usuarios, selectedUserId])

  // Obtener nombre del rol
  const getRolName = (rolId: number | null) => {
    if (!rolId) return "Sin rol"
    const rol = roles.find(r => r.id === rolId)
    return rol?.nombre || "Sin rol"
  }

  // Obtener iniciales
  const getIniciales = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  // Obtener gradiente basado en el índice
  const getGradient = (index: number) => {
    return GRADIENTS[index % GRADIENTS.length]
  }

  // Datos de ejemplo de programaciones (TODO: cargar desde Supabase)
  const programacionesEjemplo = [
    { 
      fecha: new Date("2025-03-08"), 
      tipo: "Servicio Principal",
      miembros: ["Victoria", "Rosaura", "Mónica", "Amed", "Elías", "Adrián", "Arley", "Joan", "Fernanda"]
    },
    { 
      fecha: new Date("2025-03-15"), 
      tipo: "Servicio Principal",
      miembros: ["Joel", "Mónica", "Yosmy", "Fela", "Elías", "Adrián", "Arley", "Joan"]
    },
  ]

  // Función para obtener las programaciones de un miembro
  const getProgramacionesMiembro = (nombreMiembro: string) => {
    const programaciones: { fecha: Date; rol: string; tipo: string }[] = []
    
    programacionesEjemplo.forEach(prog => {
      if (prog.miembros.some(m => m.toLowerCase().includes(nombreMiembro.toLowerCase()))) {
        const rolMiembro = getRolName(
          miembros.find(m => m.nombre.toLowerCase() === nombreMiembro.toLowerCase())?.rol_principal_id || null
        )
        programaciones.push({
          fecha: prog.fecha,
          rol: rolMiembro,
          tipo: prog.tipo
        })
      }
    })
    
    return programaciones
  }

  // Notificar miembro por WhatsApp
  const handleNotificarWhatsApp = (miembro: typeof miembros[0]) => {
    if (!miembro.telefono) {
      alert("Este miembro no tiene número de teléfono registrado")
      return
    }
    
    const programaciones = getProgramacionesMiembro(miembro.nombre)
    const mensaje = generarNotificacionPersonal(miembro.nombre, programaciones)
    notificarMiembroWhatsApp(miembro.telefono, mensaje)
  }

  // Notificar miembro por Email (con Resend)
  const [enviandoEmail, setEnviandoEmail] = useState<string | null>(null)
  
  const handleNotificarEmail = async (miembro: typeof miembros[0]) => {
    if (!miembro.email) {
      alert("Este miembro no tiene email registrado")
      return
    }
    
    setEnviandoEmail(miembro.id)
    
    try {
      const programaciones = getProgramacionesMiembro(miembro.nombre)
      
      if (programaciones.length === 0) {
        alert(`${miembro.nombre} no tiene programaciones asignadas`)
        return
      }
      
      const resultado = await notificarMiembroPorEmail(
        miembro.email,
        miembro.nombre,
        programaciones
      )
      
      if (resultado) {
        alert(`✅ Email enviado a ${miembro.nombre}`)
      } else {
        alert(`❌ Error al enviar email a ${miembro.nombre}`)
      }
    } catch (error) {
      console.error("Error enviando email:", error)
      alert("Error al enviar el email")
    } finally {
      setEnviandoEmail(null)
    }
  }

  const handleAddMember = async () => {
    if (!usuarioSeleccionado) {
      alert("Por favor selecciona un usuario")
      return
    }
    
    if (selectedRoles.length === 0) {
      alert("Por favor selecciona al menos un rol")
      return
    }
    
    setIsSaving(true)
    try {
      const nuevoMiembro: NuevoMiembro = {
        nombre: usuarioSeleccionado.nombre,
        apellido: usuarioSeleccionado.apellido,
        email: usuarioSeleccionado.email || null,
        telefono: null, // El teléfono se puede agregar después
        rol_principal_id: selectedRoles[0],
      }
      const miembroCreado = await createMiembro(nuevoMiembro)
      
      // Si hay roles seleccionados, asignarlos
      if (selectedRoles.length > 0 && miembroCreado?.id) {
        await miembrosService.setMiembroRoles(
          miembroCreado.id, 
          selectedRoles, 
          selectedRoles[0] // El primero es el principal
        )
      }
      
      // Limpiar formulario
      setSelectedUserId("")
      setSelectedRoles([])
      setIsDialogOpen(false)
      
      // Recargar miembros
      if (refetch) refetch()
    } catch (error) {
      console.error("Error al crear miembro:", error)
      alert("Error al agregar miembro")
    } finally {
      setIsSaving(false)
    }
  }

  // Toggle rol en el formulario (crear)
  const toggleRol = (rolId: number) => {
    setSelectedRoles(prev => 
      prev.includes(rolId)
        ? prev.filter(id => id !== rolId)
        : [...prev, rolId]
    )
  }

  // Toggle rol en el formulario (editar)
  const toggleEditRol = (rolId: number) => {
    setEditRoles(prev => 
      prev.includes(rolId)
        ? prev.filter(id => id !== rolId)
        : [...prev, rolId]
    )
  }

  // Abrir diálogo de edición
  const handleOpenEdit = async (miembro: typeof miembros[0]) => {
    setEditingMiembro(miembro)
    setEditTelefono(miembro.telefono || "")
    
    // Cargar roles del miembro
    try {
      const miembroRoles = await miembrosService.getMiembroRoles(miembro.id)
      const rolesIds = miembroRoles.map(mr => mr.rol_id)
      setEditRoles(rolesIds.length > 0 ? rolesIds : (miembro.rol_principal_id ? [miembro.rol_principal_id] : []))
    } catch (error) {
      console.error("Error cargando roles:", error)
      setEditRoles(miembro.rol_principal_id ? [miembro.rol_principal_id] : [])
    }
    
    setIsEditDialogOpen(true)
  }

  // Guardar edición
  const handleSaveEdit = async () => {
    if (!editingMiembro) return
    
    if (editRoles.length === 0) {
      alert("Por favor selecciona al menos un rol")
      return
    }
    
    setIsSaving(true)
    try {
      // Actualizar datos del miembro
      await updateMiembro(editingMiembro.id, {
        telefono: editTelefono || null,
        rol_principal_id: editRoles[0],
      })
      
      // Actualizar roles
      await miembrosService.setMiembroRoles(
        editingMiembro.id,
        editRoles,
        editRoles[0]
      )
      
      setIsEditDialogOpen(false)
      setEditingMiembro(null)
      if (refetch) refetch()
    } catch (error) {
      console.error("Error al actualizar miembro:", error)
      alert("Error al actualizar miembro")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este miembro?")) {
      try {
        await deleteMiembro(id)
      } catch (error) {
        console.error("Error al eliminar miembro:", error)
      }
    }
  }

  const handleToggleActivo = async (id: string, activo: boolean) => {
    try {
      await toggleActivo(id, !activo)
    } catch (error) {
      console.error("Error al cambiar estado:", error)
    }
  }

  const filteredMembers = useMemo(() => {
    return miembros.filter((miembro) => {
      const rolNombre = getRolName(miembro.rol_principal_id)
      const matchesSearch =
        miembro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        miembro.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rolNombre.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTab = 
        activeTab === "todos" || 
        (activeTab === "activos" && miembro.activo) || 
        (activeTab === "inactivos" && !miembro.activo)
      
      return matchesSearch && matchesTab
    })
  }, [miembros, searchTerm, activeTab, roles])

  const stats = useMemo(() => ({
    total: miembros.length,
    activos: miembros.filter(m => m.activo).length,
    inactivos: miembros.filter(m => !m.activo).length,
  }), [miembros])

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cuadrangular-yellow/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-cuadrangular-yellow" />
            </div>
            Equipo de Alabanza
          </h1>
          <p className="text-muted-foreground mt-1">
            {stats.activos} miembros activos de {stats.total} totales
          </p>
        </div>
        
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cuadrangular-yellow to-cuadrangular-red hover:opacity-90 text-white shadow-glow-yellow animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Miembro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-display">Nuevo Miembro</DialogTitle>
              <DialogDescription>
                Selecciona un usuario registrado y asígnale sus roles
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Selector de Usuario */}
              <div className="space-y-2">
                <Label>Usuario *</Label>
                {loadingUsuarios ? (
                  <div className="flex items-center justify-center p-4 border border-border/50 rounded-md">
                    <Loader2 className="w-5 h-5 animate-spin text-cuadrangular-yellow" />
                    <span className="ml-2 text-sm text-muted-foreground">Cargando usuarios...</span>
                  </div>
                ) : usuariosDisponibles.length === 0 ? (
                  <div className="p-4 border border-border/50 rounded-md text-center text-muted-foreground">
                    <p>No hay usuarios disponibles</p>
                    <p className="text-xs mt-1">Todos los usuarios ya son miembros del equipo</p>
                  </div>
                ) : (
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger className="border-border/50 focus:border-cuadrangular-yellow">
                      <SelectValue placeholder="Selecciona un usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuariosDisponibles.map((usuario) => (
                        <SelectItem key={usuario.id} value={usuario.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cuadrangular-yellow to-cuadrangular-red flex items-center justify-center text-white text-xs font-bold">
                              {usuario.nombre?.charAt(0)}{usuario.apellido?.charAt(0)}
                            </div>
                            <span>{usuario.nombre} {usuario.apellido}</span>
                            <span className="text-muted-foreground text-xs">({usuario.email})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Info del usuario seleccionado */}
              {usuarioSeleccionado && (
                <div className="p-3 bg-muted/50 rounded-md space-y-1">
                  <p className="font-medium">{usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</p>
                  <p className="text-sm text-muted-foreground">{usuarioSeleccionado.email}</p>
                </div>
              )}

              {/* Selector de Roles */}
              <div className="space-y-2">
                <Label>Roles * (selecciona todos los que apliquen)</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-border/50 rounded-md">
                  {roles.map((rol) => (
                    <button
                      key={rol.id}
                      type="button"
                      onClick={() => toggleRol(rol.id)}
                      className={`flex items-center gap-2 p-2 rounded-md text-sm transition-all ${
                        selectedRoles.includes(rol.id)
                          ? "bg-cuadrangular-yellow/20 text-cuadrangular-yellow border border-cuadrangular-yellow/50"
                          : "bg-muted/50 hover:bg-muted border border-transparent"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedRoles.includes(rol.id) 
                          ? "bg-cuadrangular-yellow border-cuadrangular-yellow" 
                          : "border-muted-foreground/30"
                      }`}>
                        {selectedRoles.includes(rol.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      {rol.nombre}
                    </button>
                  ))}
                </div>
                {selectedRoles.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {selectedRoles.length} rol(es) seleccionado(s). El primero será el principal.
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddMember} 
                disabled={isSaving || !selectedUserId || selectedRoles.length === 0}
                className="bg-gradient-to-r from-cuadrangular-yellow to-cuadrangular-red text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Agregando...
                  </>
                ) : (
                  "Agregar al Equipo"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
          </Dialog>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          FILTROS Y BÚSQUEDA
          ═══════════════════════════════════════════════════════════════════ */}
      <Card className="border-border/50 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Búsqueda */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar miembro..."
                className="pl-10 border-border/50 focus:border-cuadrangular-yellow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Tabs de estado */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-muted/50">
                <TabsTrigger value="todos" className="data-[state=active]:bg-card">
                  <Users className="w-4 h-4 mr-2" />
                  Todos ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="activos" className="data-[state=active]:bg-card">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Activos ({stats.activos})
                </TabsTrigger>
                <TabsTrigger value="inactivos" className="data-[state=active]:bg-card">
                  <UserX className="w-4 h-4 mr-2" />
                  Inactivos ({stats.inactivos})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════════
          GRID DE MIEMBROS
          ═══════════════════════════════════════════════════════════════════ */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-cuadrangular-yellow" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Users className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">No se encontraron miembros</p>
              <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            filteredMembers.map((miembro, index) => {
              const rolNombre = getRolName(miembro.rol_principal_id)
              const iniciales = getIniciales(miembro.nombre, miembro.apellido)
              const gradient = getGradient(index)
              
              return (
                <Card 
                  key={miembro.id} 
                  className={`group border-border/50 hover:border-cuadrangular-yellow/30 transition-all duration-300 hover:shadow-glow-yellow/20 animate-fade-in-up ${!miembro.activo ? "opacity-70" : ""}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    {/* Header con avatar y estado */}
                    <div className="flex items-start justify-between mb-4">
                      <Avatar className="w-16 h-16 ring-4 ring-background shadow-lg">
                        <AvatarImage src={miembro.foto_url || ""} />
                        <AvatarFallback className={`bg-gradient-to-br ${gradient} text-white text-lg font-bold`}>
                          {iniciales}
                        </AvatarFallback>
                      </Avatar>
                      <Badge 
                        variant={miembro.activo ? "default" : "secondary"}
                        className={`cursor-pointer ${miembro.activo 
                          ? "bg-green-500/10 text-green-600 dark:text-green-400 border-0 hover:bg-green-500/20" 
                          : "bg-muted text-muted-foreground border-0 hover:bg-muted/80"
                        }`}
                        onClick={() => handleToggleActivo(miembro.id, miembro.activo)}
                      >
                        {miembro.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    
                    {/* Info del miembro */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{miembro.nombre} {miembro.apellido}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {/* Mostrar todos los roles si existen */}
                          {(miembro as any).todos_los_roles?.length > 0 ? (
                            (miembro as any).todos_los_roles.map((mr: any, idx: number) => (
                              <Badge 
                                key={idx} 
                                variant="secondary" 
                                className={`border-0 text-xs ${
                                  mr.es_principal 
                                    ? "bg-cuadrangular-purple/20 text-cuadrangular-purple" 
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {mr.rol?.nombre || "Sin rol"}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="secondary" className="bg-cuadrangular-purple/10 text-cuadrangular-purple border-0">
                              {rolNombre}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        {miembro.email && (
                          <a 
                            href={`mailto:${miembro.email}`} 
                            className="flex items-center gap-2 text-muted-foreground hover:text-cuadrangular-cyan transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{miembro.email}</span>
                          </a>
                        )}
                        {miembro.telefono && (
                          <a 
                            href={`tel:${miembro.telefono}`} 
                            className="flex items-center gap-2 text-muted-foreground hover:text-cuadrangular-cyan transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            <span>{miembro.telefono}</span>
                          </a>
                        )}
                        {!miembro.email && !miembro.telefono && (
                          <p className="text-muted-foreground/50 italic">Sin información de contacto</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Acciones */}
                    <div className="flex items-center justify-between gap-1 mt-4 pt-4 border-t border-border/50">
                      {/* Botón notificar - disponible para todos */}
                      {(miembro.telefono || miembro.email) && (
                        enviandoEmail === miembro.id ? (
                          <Button variant="outline" size="sm" disabled className="text-cuadrangular-cyan border-cuadrangular-cyan/30">
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Enviando...
                          </Button>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="text-cuadrangular-cyan border-cuadrangular-cyan/30 hover:bg-cuadrangular-cyan/10">
                                <Send className="w-4 h-4 mr-1" />
                                Notificar
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              {miembro.telefono && (
                                <DropdownMenuItem onClick={() => handleNotificarWhatsApp(miembro)} className="cursor-pointer">
                                  <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                                  WhatsApp
                                </DropdownMenuItem>
                              )}
                              {miembro.email && (
                                <DropdownMenuItem onClick={() => handleNotificarEmail(miembro)} className="cursor-pointer">
                                  <Mail className="w-4 h-4 mr-2 text-blue-500" />
                                  Email (Resend)
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )
                      )}
                      
                      {/* Acciones admin */}
                      {isAdmin && (
                        <div className="flex items-center gap-1 ml-auto">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-muted-foreground hover:text-cuadrangular-purple"
                            onClick={() => handleOpenEdit(miembro)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-muted-foreground hover:text-cuadrangular-red"
                            onClick={() => handleDeleteMember(miembro.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          DIÁLOGO DE EDICIÓN
          ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">Editar Miembro</DialogTitle>
            <DialogDescription>
              Modifica los datos y roles de {editingMiembro?.nombre} {editingMiembro?.apellido}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Info del miembro */}
            {editingMiembro && (
              <div className="p-3 bg-muted/50 rounded-md space-y-1">
                <p className="font-medium">{editingMiembro.nombre} {editingMiembro.apellido}</p>
                <p className="text-sm text-muted-foreground">{editingMiembro.email}</p>
              </div>
            )}

            {/* Teléfono */}
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                value={editTelefono}
                onChange={(e) => setEditTelefono(e.target.value)}
                placeholder="Ej: +57 300 123 4567"
                className="border-border/50 focus:border-cuadrangular-yellow"
              />
            </div>

            {/* Selector de Roles */}
            <div className="space-y-2">
              <Label>Roles * (selecciona todos los que apliquen)</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-border/50 rounded-md">
                {roles.map((rol) => (
                  <button
                    key={rol.id}
                    type="button"
                    onClick={() => toggleEditRol(rol.id)}
                    className={`flex items-center gap-2 p-2 rounded-md text-sm transition-all ${
                      editRoles.includes(rol.id)
                        ? "bg-cuadrangular-yellow/20 text-cuadrangular-yellow border border-cuadrangular-yellow/50"
                        : "bg-muted/50 hover:bg-muted border border-transparent"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      editRoles.includes(rol.id) 
                        ? "bg-cuadrangular-yellow border-cuadrangular-yellow" 
                        : "border-muted-foreground/30"
                    }`}>
                      {editRoles.includes(rol.id) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    {rol.nombre}
                  </button>
                ))}
              </div>
              {editRoles.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {editRoles.length} rol(es) seleccionado(s). El primero será el principal.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              disabled={isSaving || editRoles.length === 0}
              className="bg-gradient-to-r from-cuadrangular-yellow to-cuadrangular-red text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
