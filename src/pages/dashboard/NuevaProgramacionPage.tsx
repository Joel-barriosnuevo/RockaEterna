"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { Calendar } from "../../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { Checkbox } from "../../components/ui/checkbox"
import { CalendarIcon, Clock, Save, ArrowLeft } from 'lucide-react'
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function NuevaProgramacionPage() {
  const navigate = useNavigate()
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    tipo: "",
    hora: "",
    notas: "",
    canciones: [] as string[],
  })

  // Datos de ejemplo
  const cancionesDisponibles = [
    { id: "1", nombre: "Grande y Fuerte", autor: "Miel San Marcos" },
    { id: "2", nombre: "Dios Incomparable", autor: "Generación 12" },
    { id: "3", nombre: "Tu Amor No Se Rinde", autor: "Hillsong" },
    { id: "4", nombre: "Poderoso Para Salvar", autor: "Hillsong" },
    { id: "5", nombre: "Agnus Dei", autor: "Michael W. Smith" },
    { id: "6", nombre: "Roca Eterna", autor: "Marcos Witt" },
  ]

  const miembrosEquipo = [
    { id: "1", nombre: "Carlos Pérez", rol: "Voz Líder" },
    { id: "2", nombre: "María Rodríguez", rol: "Piano" },
    { id: "3", nombre: "Juan Gómez", rol: "Batería" },
    { id: "4", nombre: "Ana Martínez", rol: "Coros" },
    { id: "5", nombre: "Pedro Sánchez", rol: "Bajo" },
    { id: "6", nombre: "Lucía Fernández", rol: "Guitarra" },
  ]

  const handleCancionToggle = (cancionId: string) => {
    setFormData((prev) => {
      if (prev.canciones.includes(cancionId)) {
        return { ...prev, canciones: prev.canciones.filter((id) => id !== cancionId) }
      } else {
        return { ...prev, canciones: [...prev.canciones, cancionId] }
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar la programación
    console.log("Programación a guardar:", { ...formData, fecha: date })
    // Redirigir a la lista de programaciones
    navigate("/dashboard/programaciones")
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate("/dashboard/programaciones")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nueva Programación</h2>
          <p className="text-muted-foreground">Crea una nueva programación para un servicio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>Detalles básicos de la programación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Servicio</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Seleccionar tipo de servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principal">Servicio Principal</SelectItem>
                    <SelectItem value="oracion">Servicio de Oración</SelectItem>
                    <SelectItem value="jovenes">Servicio de Jóvenes</SelectItem>
                    <SelectItem value="especial">Evento Especial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="fecha"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora">Hora</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="hora"
                    type="time"
                    value={formData.hora}
                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas">Notas</Label>
                <Textarea
                  id="notas"
                  placeholder="Notas adicionales para esta programación..."
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Canciones</CardTitle>
                <CardDescription>Selecciona las canciones para esta programación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cancionesDisponibles.map((cancion) => (
                    <div key={cancion.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cancion-${cancion.id}`}
                        checked={formData.canciones.includes(cancion.id)}
                        onCheckedChange={() => handleCancionToggle(cancion.id)}
                      />
                      <Label htmlFor={`cancion-${cancion.id}`} className="flex-1 cursor-pointer">
                        <div>{cancion.nombre}</div>
                        <div className="text-sm text-muted-foreground">{cancion.autor}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Equipo</CardTitle>
                <CardDescription>Asigna miembros del equipo para esta programación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {miembrosEquipo.map((miembro) => (
                    <div key={miembro.id} className="flex items-center space-x-2">
                      <Checkbox id={`miembro-${miembro.id}`} />
                      <Label htmlFor={`miembro-${miembro.id}`} className="flex-1 cursor-pointer">
                        <div>{miembro.nombre}</div>
                        <div className="text-sm text-muted-foreground">{miembro.rol}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => navigate("/dashboard/programaciones")}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" /> Guardar Programación
          </Button>
        </div>
      </form>
    </div>
  )
}
