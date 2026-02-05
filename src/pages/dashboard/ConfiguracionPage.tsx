"use client"

import type React from "react"
import { useState, useEffect, startTransition } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Checkbox } from "../../components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { ImageUpload } from "../../components/ui/image-upload"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog"
import { Save, User, Bell, Key, Palette, Camera, Shield, Loader2, Eye, EyeOff, Edit, Trash2, UserCircle } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useAvatarUpload } from "../../hooks/useImageUpload"

export default function ConfiguracionPage() {
  const { profile, refreshProfile } = useAuth()
  
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    nombre?: string
    apellido?: string
    email?: string
    telefono?: string
  }>({})
  
  const [perfil, setPerfil] = useState({
    nombre: "Admin",
    apellido: "Usuario",
    email: "admin@example.com",
    telefono: "+57 300 123 4567",
    avatar_url: null as string | null,
  })

  const [notificaciones, setNotificaciones] = useState({
    email: true,
    programaciones: true,
    canciones: true,
    equipo: false,
  })

  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nuevo: false,
    confirmar: false
  })

  const [seguridad, setSeguridad] = useState({
    passwordActual: "",
    passwordNuevo: "",
    passwordConfirmar: "",
  })

  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const [avatarAction, setAvatarAction] = useState<'view' | 'edit' | null>(null)
  const [isModalClosing, setIsModalClosing] = useState(false)

  // Hook para subida de avatar
  const { uploadFile: uploadAvatar, isUploading, error: uploadError, progress } = useAvatarUpload(profile?.id)

  // Inicializar perfil cuando el usuario autenticado esté disponible (simplificado)
  useEffect(() => {
    console.log('🔍 [useEffect - Perfil] profile cambió:', profile)
    if (profile && !perfil.avatar_url && perfil.nombre === "Admin") {
      // Solo actualizar si es la primera carga o si los datos básicos cambiaron
      const avatarUrl = typeof profile.avatar_url === 'string' 
        ? profile.avatar_url 
        : (profile.avatar_url as any)?.url || null

      const updatedPerfil = {
        nombre: profile.nombre || "",
        apellido: profile.apellido || "",
        email: profile.email || "",
        telefono: profile.telefono || "",
        avatar_url: avatarUrl,
      }
      
      console.log('🔄 Inicializando perfil completo desde profile:', updatedPerfil)
      setPerfil(updatedPerfil)
    }
  }, [profile?.id]) // Solo depender del ID para evitar múltiples disparos

  // useEffect - Avatar eliminado temporalmente para evitar bucle infinito
  // useEffect(() => {
  //   console.log('🔍 [useEffect - Avatar] INICIO - profile.avatar_url:', profile?.avatar_url, 'perfil.avatar_url:', perfil.avatar_url)
  //   if (profile) {
  //     // Extraer la URL si es un objeto, o usar directamente si es string
  //     const profileAvatarUrl = typeof profile.avatar_url === 'string' 
  //       ? profile.avatar_url 
  //       : profile.avatar_url?.url || null
      
  //     const perfilAvatarUrl = typeof perfil.avatar_url === 'string'
  //       ? perfil.avatar_url
  //       : perfil.avatar_url?.url || null

  //     console.log('🔍 [useEffect - Avatar] URLs procesadas - profile:', profileAvatarUrl, 'perfil:', perfilAvatarUrl)
      
  //     if (profileAvatarUrl !== perfilAvatarUrl) {
  //       console.log('🔄 [useEffect - Avatar] ACTUALIZANDO - de', perfilAvatarUrl, 'a', profileAvatarUrl)
  //       setPerfil(prev => ({ ...prev, avatar_url: profileAvatarUrl }))
  //     } else {
  //       console.log('⏭️ [useEffect - Avatar] OMITIENDO - URLs iguales')
  //     }
  //   } else {
  //     console.log('⚠️ [useEffect - Avatar] profile es null')
  //   }
  //   console.log('🔍 [useEffect - Avatar] FIN')
  // }, [profile?.avatar_url, perfil.avatar_url])

  // Ocultar mensaje de éxito automáticamente después de 3 segundos
  useEffect(() => {
    console.log('🔍 [useEffect - Mensaje] updateMessage cambió:', updateMessage)
    if (updateMessage && updateMessage.type === 'success') {
      const timer = setTimeout(() => {
        console.log('⏰ Ocultando mensaje de éxito')
        setUpdateMessage(null)
      }, 3000) // 3 segundos

      return () => {
        console.log('🧹 Limpiando timer de mensaje')
        clearTimeout(timer)
      }
    }
  }, [updateMessage])

  // Efecto de limpieza para asegurar que el modal se cierre correctamente (desactivado)
  // useEffect(() => {
  //   console.log('🔍 [useEffect - Limpieza] Componente montado')
  //   return () => {
  //     console.log('🧹 [useEffect - Limpieza] Componente desmontado - limpiando estados del modal')
  //     setShowAvatarDialog(false)
  //     setAvatarAction(null)
  //     setIsModalClosing(false)
  //   }
  // }, [])

  // Efecto para manejar el cierre del modal
  useEffect(() => {
    if (isModalClosing) {
      const timer = setTimeout(() => {
        console.log('🔄 [useEffect - Modal] Finalizando cierre del modal')
        setIsModalClosing(false)
        setAvatarAction(null)
      }, 300) // Esperar a que termine la animación

      return () => clearTimeout(timer)
    }
  }, [isModalClosing])

  // Debug: Mostrar estado actual del perfil (comentado para evitar bucle infinito)
  // useEffect(() => {
  //   console.log('👤 Estado actual del perfil:', perfil)
  // }, [perfil])

  // Función de validación dinámica
  const validateField = (field: keyof typeof fieldErrors, value: string): string | null => {
    const trimmedValue = value.trim()
    
    switch (field) {
      case 'nombre':
        if (!trimmedValue) return 'El nombre es requerido'
        if (trimmedValue.length < 2) return 'Mínimo 2 caracteres'
        if (!/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(trimmedValue)) return 'Solo letras y espacios'
        return null
        
      case 'apellido':
        if (!trimmedValue) return 'El apellido es requerido'
        if (trimmedValue.length < 2) return 'Mínimo 2 caracteres'
        if (!/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(trimmedValue)) return 'Solo letras y espacios'
        return null
        
      case 'email':
        if (!trimmedValue) return 'El email es requerido'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) return 'Email no válido'
        return null
        
      case 'telefono':
        if (trimmedValue) {
          const telefonoLimpio = trimmedValue.replace(/\s+/g, '').replace(/[()-]/g, '')
          if (trimmedValue !== telefonoLimpio) {
            return 'El teléfono no puede contener espacios'
          }
          if (!/^[+]?[0-9]{7,15}$/.test(telefonoLimpio)) return 'Teléfono no válido'
        }
        return null
        
      default:
        return null
    }
  }

  // Validación en tiempo real (completamente desactivada para evitar bloqueos)
  // useEffect(() => {
  //   console.log('🔍 [useEffect - Validación] Campos de perfil cambiados:', {
  //     nombre: perfil.nombre,
  //     apellido: perfil.apellido,
  //     email: perfil.email,
  //     telefono: perfil.telefono
  //   })
  //   
  //   // Evitar validación si el modal está cerrando para prevenir bloqueos
  //   if (isModalClosing) {
  //     console.log('⏭️ [useEffect - Validación] Omitiendo validación - modal cerrando')
  //     return
  //   }
  //   
  //   const newErrors: typeof fieldErrors = {}
  //   
  //   // Validar cada campo
  //   const nombreError = validateField('nombre', perfil.nombre)
  //   if (nombreError) newErrors.nombre = nombreError
  //   
  //   const apellidoError = validateField('apellido', perfil.apellido)
  //   if (apellidoError) newErrors.apellido = apellidoError
  //   
  //   const emailError = validateField('email', perfil.email)
  //   if (emailError) newErrors.email = emailError
  //   
  //   const telefonoError = validateField('telefono', perfil.telefono)
  //   if (telefonoError) newErrors.telefono = telefonoError
  //   
  //   console.log('🔍 [useEffect - Validación] Errores encontrados:', newErrors)
  //   setFieldErrors(newErrors)
  // }, [perfil.nombre, perfil.apellido, perfil.email, perfil.telefono, isModalClosing])

  const handlePerfilSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateMessage(null)
    
    // Verificar si hay errores en los campos
    const hasErrors = Object.values(fieldErrors).some(error => error !== undefined && error !== '')
    
    if (hasErrors) {
      setUpdateMessage({ 
        type: 'error', 
        message: 'Por favor corrige los errores en el formulario antes de continuar' 
      })
      setIsUpdating(false)
      return
    }
    
    try {
      // Actualizar perfil en la base de datos
      console.log("🔄 Actualizando perfil en base de datos:", perfil)
      
      if (profile?.id) {
        const result = await updateProfileInDatabase(profile.id, {
          nombre: perfil.nombre.trim(),
          apellido: perfil.apellido.trim(),
          email: perfil.email.trim().toLowerCase(),
          telefono: perfil.telefono ? perfil.telefono.trim() : null,
          avatar_url: perfil.avatar_url,
        })
        
        console.log("✅ Perfil actualizado en base de datos:", result)
        
        // Refrescar el perfil del usuario para actualizar el estado global
        await refreshProfile()
        
        setUpdateMessage({ type: 'success', message: 'Perfil actualizado exitosamente' })
      } else {
        throw new Error('No hay ID de usuario disponible')
      }
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error)
      setUpdateMessage({ type: 'error', message: 'Error al actualizar el perfil' })
    } finally {
      setIsUpdating(false)
    }
  }

  // Función auxiliar para actualizar en base de datos
  const updateProfileInDatabase = async (userId: string, updates: any) => {
    const { supabase } = await import('../../lib/supabase')
    const { data, error } = await supabase
      .from('usuarios')
      .update(updates as any)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  const handleNotificacionesSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Notificaciones actualizadas:", notificaciones)
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSeguridadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contraseña actualizada")
    setSeguridad({ passwordActual: "", passwordNuevo: "", passwordConfirmar: "" })
  }

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          Configuración
        </h1>
        <p className="text-muted-foreground mt-1">
          Administra tu cuenta y preferencias
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TABS DE CONFIGURACIÓN
          ═══════════════════════════════════════════════════════════════════ */}
      <Tabs defaultValue="perfil" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <TabsTrigger value="perfil" className="rounded-lg data-[state=active]:bg-card">
            <User className="w-4 h-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="rounded-lg data-[state=active]:bg-card">
            <Bell className="w-4 h-4 mr-2" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="rounded-lg data-[state=active]:bg-card">
            <Shield className="w-4 h-4 mr-2" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="apariencia" className="rounded-lg data-[state=active]:bg-card">
            <Palette className="w-4 h-4 mr-2" />
            Apariencia
          </TabsTrigger>
        </TabsList>

        {/* Tab: Perfil */}
        <TabsContent value="perfil" className="animate-fade-in">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-display">Información del Perfil</CardTitle>
              <CardDescription>Actualiza tu información personal</CardDescription>
            </CardHeader>
            <form onSubmit={handlePerfilSubmit}>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-cuadrangular-purple/20 overflow-hidden bg-gradient-to-br from-cuadrangular-purple to-cuadrangular-cyan flex items-center justify-center">
                        {perfil.avatar_url ? (
                          <img 
                            src={perfil.avatar_url} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-xl sm:text-2xl font-bold flex items-center justify-center">
                            {perfil.nombre && perfil.apellido ? 
                              `${perfil.nombre.charAt(0)}${perfil.apellido.charAt(0)}` : 
                              <UserCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                            }
                          </span>
                        )}
                      </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-border/50 bg-background shadow-md hover:bg-cuadrangular-purple/10 hover:border-cuadrangular-purple/50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => {
                          console.log('🖼️ [Dropdown] Abrir modal para ver avatar')
                          setAvatarAction('view')
                          setShowAvatarDialog(true)
                        }}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver avatar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          console.log('📸 [Dropdown] Abrir modal para cambiar foto')
                          setAvatarAction('edit')
                          setShowAvatarDialog(true)
                        }}>
                          <Camera className="w-4 h-4 mr-2" />
                          Cambiar foto
                        </DropdownMenuItem>
                        {perfil.avatar_url && (
                          <DropdownMenuItem 
                            onClick={async () => {
                              if (perfil.avatar_url) {
                                console.log('Eliminando avatar:', perfil.avatar_url)
                                setPerfil(prev => ({ ...prev, avatar_url: null }))
                              }
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-sm font-medium">
                      {perfil.nombre} {perfil.apellido}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {perfil.email}
                    </p>
                    {perfil.telefono && (
                      <p className="text-xs text-muted-foreground">
                        {perfil.telefono}
                      </p>
                    )}
                  </div>
                </div>

                {/* Campos del formulario */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                      value={perfil.nombre}
                      onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                      placeholder="Ej: Juan"
                      className={`border-border/50 focus:border-cuadrangular-purple ${fieldErrors.nombre ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {fieldErrors.nombre && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.nombre}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Apellido</Label>
                    <Input
                      value={perfil.apellido}
                      onChange={(e) => setPerfil({ ...perfil, apellido: e.target.value })}
                      placeholder="Ej: Pérez García"
                      className={`border-border/50 focus:border-cuadrangular-purple ${fieldErrors.apellido ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {fieldErrors.apellido && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.apellido}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Correo Electrónico</Label>
                  <Input
                    type="email"
                    value={perfil.email}
                    onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                    placeholder="Ej: correo@ejemplo.com"
                    className={`border-border/50 focus:border-cuadrangular-purple ${fieldErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input
                    value={perfil.telefono}
                    onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })}
                    placeholder="Ej: +573001234567"
                    className={`border-border/50 focus:border-cuadrangular-purple ${fieldErrors.telefono ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {fieldErrors.telefono && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.telefono}</p>
                  )}
                </div>
              </CardContent>
              
              {/* Mensaje de actualización */}
              {updateMessage && (
                <div className="px-6 pb-6">
                  <Alert className={updateMessage.type === 'success' ? 'border-green-500/50 bg-green-500/10 text-green-600' : 'border-red-500/50 bg-red-500/10 text-red-600'}>
                    <AlertDescription>
                      {updateMessage.message}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              
              <CardFooter className="flex-col sm:flex-row gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setUpdateMessage(null)}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isUpdating}
                  className="bg-gradient-to-r from-cuadrangular-purple to-cuadrangular-cyan text-white w-full sm:w-auto"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span className="text-xs sm:text-sm">Actualizando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      <span className="truncate">Guardar Cambios</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Tab: Notificaciones */}
        <TabsContent value="notificaciones" className="animate-fade-in">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-display">Preferencias de Notificaciones</CardTitle>
              <CardDescription>Configura qué notificaciones deseas recibir</CardDescription>
            </CardHeader>
            <form onSubmit={handleNotificacionesSubmit}>
              <CardContent className="space-y-6">
                <label className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-cuadrangular-purple/30 transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium">Notificaciones por correo</p>
                    <p className="text-sm text-muted-foreground">Recibe notificaciones en tu correo electrónico</p>
                  </div>
                  <Checkbox
                    checked={notificaciones.email}
                    onCheckedChange={(checked) => setNotificaciones({ ...notificaciones, email: checked as boolean })}
                    className="data-[state=checked]:bg-cuadrangular-purple data-[state=checked]:border-cuadrangular-purple"
                  />
                </label>

                <div className="space-y-3">
                  <p className="font-medium text-sm text-muted-foreground">Notificarme sobre:</p>
                  
                  {[
                    { key: "programaciones", label: "Nuevas programaciones y cambios", color: "cyan" },
                    { key: "canciones", label: "Nuevas canciones en el repertorio", color: "red" },
                    { key: "equipo", label: "Cambios en el equipo", color: "yellow" },
                  ].map((item) => (
                    <label 
                      key={item.key}
                      className="flex items-center gap-3 p-4 rounded-xl border border-border/50 hover:border-cuadrangular-purple/30 transition-colors cursor-pointer"
                    >
                      <Checkbox
                        checked={notificaciones[item.key as keyof typeof notificaciones] as boolean}
                        onCheckedChange={(checked) => setNotificaciones({ ...notificaciones, [item.key]: checked as boolean })}
                        className="data-[state=checked]:bg-cuadrangular-purple data-[state=checked]:border-cuadrangular-purple"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="bg-gradient-to-r from-cuadrangular-purple to-cuadrangular-cyan text-white">
                  <Bell className="w-4 h-4 mr-2" />
                  Guardar Preferencias
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Tab: Seguridad */}
        <TabsContent value="seguridad" className="animate-fade-in">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-display">Seguridad de la Cuenta</CardTitle>
              <CardDescription>Actualiza tu contraseña</CardDescription>
            </CardHeader>
            <form onSubmit={handleSeguridadSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Contraseña Actual</Label>
                  <div className="relative">
                    <Input
                      type={showPasswords.actual ? "text" : "password"}
                      value={seguridad.passwordActual}
                      onChange={(e) => setSeguridad({ ...seguridad, passwordActual: e.target.value })}
                      className="border-border/50 focus:border-cuadrangular-purple pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("actual")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPasswords.actual ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      type={showPasswords.nuevo ? "text" : "password"}
                      value={seguridad.passwordNuevo}
                      onChange={(e) => setSeguridad({ ...seguridad, passwordNuevo: e.target.value })}
                      className="border-border/50 focus:border-cuadrangular-purple pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("nuevo")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPasswords.nuevo ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Confirmar Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      type={showPasswords.confirmar ? "text" : "password"}
                      value={seguridad.passwordConfirmar}
                      onChange={(e) => setSeguridad({ ...seguridad, passwordConfirmar: e.target.value })}
                      className="border-border/50 focus:border-cuadrangular-purple pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirmar")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPasswords.confirmar ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col sm:flex-row gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSeguridad({ passwordActual: "", passwordNuevo: "", passwordConfirmar: "" })}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-cuadrangular-red to-cuadrangular-purple text-white w-full sm:w-auto"
                >
                  <Key className="w-4 h-4 mr-2" />
                  <span className="truncate">Actualizar Contraseña</span>
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Tab: Apariencia */}
        <TabsContent value="apariencia" className="animate-fade-in">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-display">Personalización</CardTitle>
              <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select defaultValue="system">
                  <SelectTrigger className="border-border/50">
                    <SelectValue placeholder="Seleccionar tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  El tema del sistema se ajustará automáticamente según tu dispositivo.
                </p>
              </div>

              {/* Preview de colores */}
              <div className="space-y-3">
                <Label>Colores del Evangelio Cuadrangular</Label>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-xl bg-cuadrangular-red" title="Salvación" />
                    <span className="text-xs text-muted-foreground">Rojo</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-xl bg-cuadrangular-cyan" title="Espíritu Santo" />
                    <span className="text-xs text-muted-foreground">Cyan</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-xl bg-cuadrangular-yellow" title="Sanidad" />
                    <span className="text-xs text-muted-foreground">Amarillo</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-xl bg-cuadrangular-purple" title="Segunda Venida" />
                    <span className="text-xs text-muted-foreground">Morado</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row gap-2">
              <Button className="bg-gradient-to-r from-cuadrangular-purple to-cuadrangular-cyan text-white w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" />
                <span className="truncate">Guardar Preferencias</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para ver/editar avatar */}
      <Dialog open={showAvatarDialog} onOpenChange={(open) => {
        console.log('🔄 [Dialog] onOpenChange:', open)
        if (!open) {
          console.log('❌ [Dialog] Cerrando modal inmediatamente')
          setShowAvatarDialog(false)
          setAvatarAction(null)
        } else {
          setShowAvatarDialog(true)
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              {avatarAction === 'view' ? 'Ver Avatar' : 'Cambiar Foto de Perfil'}
            </DialogTitle>
            {avatarAction === 'view' && (
              <DialogDescription>
                Vista previa de tu avatar actual
              </DialogDescription>
            )}
            {avatarAction === 'edit' && (
              <DialogDescription>
                Sube una nueva imagen o elimina tu avatar actual
              </DialogDescription>
            )}
          </DialogHeader>
          
          {avatarAction === 'view' && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="w-32 h-32 rounded-full ring-4 ring-cuadrangular-purple/20 overflow-hidden bg-gradient-to-br from-cuadrangular-purple to-cuadrangular-cyan flex items-center justify-center">
                {perfil.avatar_url ? (
                  <img 
                    src={perfil.avatar_url} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-4xl font-bold flex items-center justify-center">
                    {perfil.nombre && perfil.apellido ? 
                      `${perfil.nombre.charAt(0)}${perfil.apellido.charAt(0)}` : 
                      <UserCircle className="w-16 h-16" />
                    }
                  </span>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{perfil.nombre} {perfil.apellido}</p>
                <p className="text-xs text-muted-foreground">{perfil.email}</p>
              </div>
            </div>
          )}

          {avatarAction === 'edit' && (
            <div className="space-y-4 py-4">
              <ImageUpload
                currentImage={perfil.avatar_url || undefined}
                onUpload={async (file) => {
                  console.log('🖼️ [ImageUpload] Iniciando subida de avatar...', file.name)
                  try {
                    const result = await uploadAvatar(file)
                    console.log('📤 [ImageUpload] Resultado de uploadAvatar:', result)
                    if (result) {
                      // Extraer solo la URL del objeto resultado
                      const avatarUrl = typeof result === 'string' ? result : result.url
                      console.log('✅ [ImageUpload] Avatar subido, URL extraída:', avatarUrl)
                      
                      // Actualizar estado local con la URL (optimizado con startTransition)
                      console.log('🔄 [ImageUpload] Actualizando estado local con avatarUrl:', avatarUrl)
                      startTransition(() => {
                        setPerfil(prev => {
                          console.log('🔄 [ImageUpload] Estado anterior del perfil:', prev)
                          const newPerfil = { ...prev, avatar_url: avatarUrl }
                          console.log('🔄 [ImageUpload] Nuevo estado del perfil:', newPerfil)
                          return newPerfil
                        })
                      })
                      
                      // Actualizar en base de datos
                      if (profile?.id) {
                        try {
                          console.log('💾 [ImageUpload] Guardando avatar en BD para usuario:', profile.id)
                          await updateProfileInDatabase(profile.id, { avatar_url: avatarUrl || undefined } as any)
                          console.log('💾 [ImageUpload] Avatar guardado en BD')
                          
                          // No llamar a refreshProfile() aquí para evitar bucle infinito
                          // El estado local ya está actualizado
                          console.log('✅ [ImageUpload] Avatar actualizado localmente')
                        } catch (dbError) {
                          console.error('❌ [ImageUpload] Error al guardar avatar en BD:', dbError)
                        }
                      }
                      
                      // Cerrar el modal inmediatamente después de la subida exitosa
                      console.log('❌ [ImageUpload] Cerrando modal después de subida exitosa')
                      setShowAvatarDialog(false)
                      setAvatarAction(null)
                      return avatarUrl
                    }
                    console.log('❌ No se obtuvo resultado del upload')
                    return null
                  } catch (error) {
                    console.error('❌ Error en subida de avatar:', error)
                    return null
                  }
                }}
                onRemove={async () => {
                  console.log('🗑️ [ImageUpload] Iniciando eliminación de avatar')
                  if (perfil.avatar_url) {
                    console.log('🗑️ [ImageUpload] Eliminando avatar:', perfil.avatar_url)
                    setPerfil(prev => {
                      console.log('🗑️ [ImageUpload] Estado anterior del perfil:', prev)
                      const newPerfil = { ...prev, avatar_url: null }
                      console.log('🗑️ [ImageUpload] Nuevo estado del perfil (sin avatar):', newPerfil)
                      return newPerfil
                    })
                    console.log('❌ [ImageUpload] Cerrando modal después de eliminar avatar')
                    setShowAvatarDialog(false)
                    setAvatarAction(null)
                  } else {
                    console.log('⚠️ [ImageUpload] No hay avatar para eliminar')
                  }
                }}
                isUploading={isUploading}
                progress={progress}
                error={uploadError}
                buttonText="Seleccionar imagen"
                description="JPG, PNG o GIF. Máximo 2MB."
                height="h-48"
              />
              
              {/* Mensaje de actualización */}
              {updateMessage && (
                <Alert className={updateMessage.type === 'success' ? 'border-green-500/50 bg-green-500/10 text-green-600' : 'border-red-500/50 bg-red-500/10 text-red-600'}>
                  <AlertDescription>
                    {updateMessage.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
