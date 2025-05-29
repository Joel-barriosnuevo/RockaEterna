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
import { Save, User, Bell, Key } from "lucide-react"

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

  const [seguridad, setSeguridad] = useState({
    passwordActual: "",
    passwordNuevo: "",
    passwordConfirmar: "",
  })

  const [tema, setTema] = useState("light")

  const handlePerfilSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para actualizar el perfil
    console.log("Perfil actualizado:", perfil)
  }

  const handleNotificacionesSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para actualizar las notificaciones
    console.log("Notificaciones actualizadas:", notificaciones)
  }

  const handleSeguridadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para actualizar la contraseña
    console.log("Contraseña actualizada")
    setSeguridad({
      passwordActual: "",
      passwordNuevo: "",
      passwordConfirmar: "",
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">Administra tu cuenta y preferencias</p>
      </div>

      <Tabs defaultValue="perfil" className="space-y-4">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>Actualiza tu información personal</CardDescription>
            </CardHeader>
            <form onSubmit={handlePerfilSubmit}>
              <CardContent className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-2">
                      <AvatarImage src="/placeholder.svg" alt="Avatar" />
                      <AvatarFallback className="text-2xl">
                        {perfil.nombre.charAt(0)}
                        {perfil.apellido.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <User className="mr-2 h-4 w-4" /> Cambiar foto
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={perfil.nombre}
                      onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      value={perfil.apellido}
                      onChange={(e) => setPerfil({ ...perfil, apellido: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={perfil.email}
                    onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={perfil.telefono}
                    onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>Configura tus preferencias de notificaciones</CardDescription>
            </CardHeader>
            <form onSubmit={handleNotificacionesSubmit}>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email-notif"
                    checked={notificaciones.email}
                    onCheckedChange={(checked) => setNotificaciones({ ...notificaciones, email: checked as boolean })}
                  />
                  <Label htmlFor="email-notif">Recibir notificaciones por correo electrónico</Label>
                </div>

                <div className="pt-4">
                  <h3 className="font-medium mb-2">Notificarme sobre:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="programaciones-notif"
                        checked={notificaciones.programaciones}
                        onCheckedChange={(checked) =>
                          setNotificaciones({ ...notificaciones, programaciones: checked as boolean })
                        }
                      />
                      <Label htmlFor="programaciones-notif">Nuevas programaciones y cambios</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="canciones-notif"
                        checked={notificaciones.canciones}
                        onCheckedChange={(checked) =>
                          setNotificaciones({ ...notificaciones, canciones: checked as boolean })
                        }
                      />
                      <Label htmlFor="canciones-notif">Nuevas canciones en el repertorio</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="equipo-notif"
                        checked={notificaciones.equipo}
                        onCheckedChange={(checked) =>
                          setNotificaciones({ ...notificaciones, equipo: checked as boolean })
                        }
                      />
                      <Label htmlFor="equipo-notif">Cambios en el equipo</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">
                  <Bell className="mr-2 h-4 w-4" /> Guardar Preferencias
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad">
          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>Actualiza tu contraseña y configuración de seguridad</CardDescription>
            </CardHeader>
            <form onSubmit={handleSeguridadSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password-actual">Contraseña Actual</Label>
                  <Input
                    id="password-actual"
                    type="password"
                    value={seguridad.passwordActual}
                    onChange={(e) => setSeguridad({ ...seguridad, passwordActual: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-nuevo">Nueva Contraseña</Label>
                  <Input
                    id="password-nuevo"
                    type="password"
                    value={seguridad.passwordNuevo}
                    onChange={(e) => setSeguridad({ ...seguridad, passwordNuevo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-confirmar">Confirmar Nueva Contraseña</Label>
                  <Input
                    id="password-confirmar"
                    type="password"
                    value={seguridad.passwordConfirmar}
                    onChange={(e) => setSeguridad({ ...seguridad, passwordConfirmar: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">
                  <Key className="mr-2 h-4 w-4" /> Actualizar Contraseña
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="apariencia">
          <Card>
            <CardHeader>
              <CardTitle>Apariencia</CardTitle>
              <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tema">Tema</Label>
                <Select value={tema} onValueChange={setTema}>
                  <SelectTrigger id="tema">
                    <SelectValue placeholder="Seleccionar tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  El tema del sistema se ajustará automáticamente según la configuración de tu dispositivo.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" /> Guardar Preferencias
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
