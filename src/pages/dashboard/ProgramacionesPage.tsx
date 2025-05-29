"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Calendar } from "../../components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { CalendarIcon, Plus, Filter, ChevronRight, Users } from 'lucide-react'

interface Programacion {
  id: number
  fecha: string
  dia: string
  hora: string
  tipo: string
  estado: string
  miembros: number
}

export default function ProgramacionesPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState("lista")
  const [filterMonth, setFilterMonth] = useState<string>("all")

  // Datos de ejemplo
  const programaciones: Programacion[] = [
    {
      id: 1,
      fecha: "2025-04-21",
      dia: "Domingo",
      hora: "9:00 AM",
      tipo: "Servicio Principal",
      estado: "Confirmado",
      miembros: 8,
    },
    {
      id: 2,
      fecha: "2025-04-24",
      dia: "Miércoles",
      hora: "7:00 PM",
      tipo: "Servicio de Oración",
      estado: "Pendiente",
      miembros: 5,
    },
    {
      id: 3,
      fecha: "2025-04-28",
      dia: "Domingo",
      hora: "9:00 AM",
      tipo: "Servicio Principal",
      estado: "Borrador",
      miembros: 0,
    },
    {
      id: 4,
      fecha: "2025-05-01",
      dia: "Miércoles",
      hora: "7:00 PM",
      tipo: "Servicio de Oración",
      estado: "Pendiente",
      miembros: 4,
    },
    {
      id: 5,
      fecha: "2025-05-05",
      dia: "Domingo",
      hora: "9:00 AM",
      tipo: "Servicio Principal",
      estado: "Borrador",
      miembros: 0,
    },
  ]

  // Filtrar programaciones por mes si se selecciona un filtro
  const filteredProgramaciones = programaciones.filter((prog) => {
    if (filterMonth === "all") return true
    const month = new Date(prog.fecha).getMonth() + 1
    return month.toString() === filterMonth
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Programaciones</h2>
          <p className="text-muted-foreground">Gestiona las programaciones de los servicios</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/programaciones/nueva">
            <Plus className="mr-2 h-4 w-4" /> Nueva Programación
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent>
          <Tabs defaultValue="lista" value={view} onValueChange={setView} className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="lista">Lista</TabsTrigger>
                <TabsTrigger value="calendario">Calendario</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
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
            </div>

            <TabsContent value="lista" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Miembros</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProgramaciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <CalendarIcon className="h-12 w-12 mb-2" />
                          <p>No hay programaciones para este período</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProgramaciones.map((prog) => (
                      <TableRow key={prog.id}>
                        <TableCell>
                          {new Date(prog.fecha).toLocaleDateString("es-ES", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </TableCell>
                        <TableCell>{prog.hora}</TableCell>
                        <TableCell>{prog.tipo}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              prog.estado === "Confirmado"
                                ? "default"
                                : prog.estado === "Pendiente"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {prog.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{prog.miembros}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/dashboard/programaciones/${prog.id}`}>
                              Ver <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="calendario">
              <div className="flex flex-col items-center p-4 border rounded-md">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="mx-auto"
                  disabled={{ before: new Date() }}
                />
                <div className="mt-6 w-full max-w-md">
                  <h3 className="font-medium mb-2">Programaciones para la fecha seleccionada:</h3>
                  {filteredProgramaciones.filter(
                    (prog) => new Date(prog.fecha).toDateString() === date?.toDateString(),
                  ).length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No hay programaciones para esta fecha</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredProgramaciones
                        .filter((prog) => new Date(prog.fecha).toDateString() === date?.toDateString())
                        .map((prog) => (
                          <div key={prog.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                              <h4 className="font-medium">{prog.tipo}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{prog.hora}</span>
                                <Badge
                                  variant={
                                    prog.estado === "Confirmado"
                                      ? "default"
                                      : prog.estado === "Pendiente"
                                      ? "secondary"
                                      : "outline"
                                  }
                                >
                                  {prog.estado}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/dashboard/programaciones/${prog.id}`}>
                                  Ver Detalles
                                </Link>
                              </Button>
                            </div>
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
