"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Checkbox } from "../../components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Save, User, Bell, Key, Palette, Camera, Shield, Eye, EyeOff } from "lucide-react"

export default function ConfiguracionPage() {
  const [perfil, setPerfil] = useState({
    nombre: "Admin",
    apellido: "Usuario",
    email: "admin@example.com",
    telefono: "+57 300 123 4567",
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

  const handlePerfilSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Perfil actualizado:", perfil)
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
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24 ring-4 ring-cuadrangular-purple/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-cuadrangular-purple to-cuadrangular-cyan text-white text-2xl font-bold">
                      {perfil.nombre.charAt(0)}{perfil.apellido.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" className="border-border/50">
                      <Camera className="w-4 h-4 mr-2" />
                      Cambiar foto
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG, PNG o GIF. Máximo 2MB.
                    </p>
                  </div>
                </div>

                {/* Campos del formulario */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                      value={perfil.nombre}
                      onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                      className="border-border/50 focus:border-cuadrangular-purple"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Apellido</Label>
                    <Input
                      value={perfil.apellido}
                      onChange={(e) => setPerfil({ ...perfil, apellido: e.target.value })}
                      className="border-border/50 focus:border-cuadrangular-purple"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Correo Electrónico</Label>
                  <Input
                    type="email"
                    value={perfil.email}
                    onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                    className="border-border/50 focus:border-cuadrangular-purple"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input
                    value={perfil.telefono}
                    onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })}
                    className="border-border/50 focus:border-cuadrangular-purple"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="bg-gradient-to-r from-cuadrangular-purple to-cuadrangular-cyan text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
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
              <CardFooter>
                <Button type="submit" className="bg-gradient-to-r from-cuadrangular-red to-cuadrangular-purple text-white">
                  <Key className="w-4 h-4 mr-2" />
                  Actualizar Contraseña
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
            <CardFooter>
              <Button className="bg-gradient-to-r from-cuadrangular-purple to-cuadrangular-cyan text-white">
                <Save className="w-4 h-4 mr-2" />
                Guardar Preferencias
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
