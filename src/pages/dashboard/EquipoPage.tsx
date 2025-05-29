"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
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
import { Search, Plus, Mail, Phone, Edit, Trash } from 'lucide-react'

export default function EquipoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("todos")
  const [newMember, setNewMember] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    rol: "",
  })

  // Datos de ejemplo
  const miembros = [
    {
      id: 1,
      nombre: "Carlos",
      apellido: "Pérez",
      rol: "Voz Líder",
      email: "carlos@example.com",
      telefono: "+57 300 123 4567",
      imagen: "",
      iniciales: "CP",
      activo: true,
    },
    {
      id: 2,
      nombre: "María",
      apellido: "Rodríguez",
      rol: "Piano",
      email: "maria@example.com",
      telefono: "+57 300 234 5678",
      imagen: "",
      iniciales: "MR",
      activo: true,
    },
    {
      id: 3,
      nombre: "Juan",
      apellido: "Gómez",
      rol: "Batería",
      email: "juan@example.com",
      telefono: "+57 300 345 6789",
      imagen: "",
      iniciales: "JG",
      activo: true,
    },
    {
      id: 4,
      nombre: "Ana",
      apellido: "Martínez",
      rol: "Coros",
      email: "ana@example.com",
      telefono: "+57 300 456 7890",
      imagen: "",
      iniciales: "AM",
      activo: true,
    },
    {
      id: 5,
      nombre: "Pedro",
      apellido: "Sánchez",
      rol: "Bajo",
      email: "pedro@example.com",
      telefono: "+57 300 567 8901",
      imagen: "",
      iniciales: "PS",
      activo: false,
    },
    {
      id: 6,
      nombre: "Lucía",
      apellido: "Fernández",
      rol: "Guitarra",
      email: "lucia@example.com",
      telefono: "+57 300 678 9012",
      imagen: "",
      iniciales: "LF",
      activo: false,
    },
  ]

  const handleAddMember = () => {
    // Aquí iría la lógica para agregar un nuevo miembro
    console.log("Nuevo miembro:", newMember)
    // Resetear el formulario
    setNewMember({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      rol: "",
    })
  }

  const filteredMembers = miembros.filter((miembro) => {
    const matchesSearch =
      miembro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      miembro.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      miembro.rol.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTab = 
      activeTab === "todos" || 
      (activeTab === "activos" && miembro.activo) || 
      (activeTab === "inactivos" && !miembro.activo)
    
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Equipo</h2>
          <p className="text-muted-foreground">Gestiona los miembros del equipo de alabanza</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Agregar Miembro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Miembro</DialogTitle>
              <DialogDescription>
                Completa el formulario para agregar un nuevo miembro al equipo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={newMember.nombre}
                    onChange={(e) => setNewMember({ ...newMember, nombre: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={newMember.apellido}
                    onChange={(e) => setNewMember({ ...newMember, apellido: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={newMember.telefono}
                  onChange={(e) => setNewMember({ ...newMember, telefono: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rol">Rol</Label>
                <Select value={newMember.rol} onValueChange={(value) => setNewMember({ ...newMember, rol: value })}>
                  <SelectTrigger id="rol">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Voz Líder">Voz Líder</SelectItem>
                    <SelectItem value="Coros">Coros</SelectItem>
                    <SelectItem value="Piano">Piano</SelectItem>
                    <SelectItem value="Guitarra">Guitarra</SelectItem>
                    <SelectItem value="Bajo">Bajo</SelectItem>
                    <SelectItem value="Batería">Batería</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddMember}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar miembro..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="activos">Activos</TabsTrigger>
                <TabsTrigger value="inactivos">Inactivos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-8 text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p>No se encontraron miembros</p>
              </div>
            ) : (
              filteredMembers.map((miembro) => (
                <div
                  key={miembro.id}
                  className="flex flex-col border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={miembro.imagen || "/placeholder.svg"} alt={`${miembro.nombre} ${miembro.apellido}`} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {miembro.iniciales}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">{`${miembro.nombre} ${miembro.apellido}`}</h3>
                      <Badge variant={miembro.activo ? "default" : "outline"}>
                        {miembro.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{miembro.rol}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{miembro.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{miembro.telefono}</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
