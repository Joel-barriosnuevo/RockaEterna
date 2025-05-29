"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
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
import { Textarea } from "../../components/ui/textarea"
import { Music, Search, Plus, Edit, Trash, ChevronRight } from "lucide-react"

interface Cancion {
  id: number
  nombre: string
  categoria: string
  autor: string
  fechaAgregada: string
  letra?: string
  acordes?: string
}

export default function RepertorioPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [authorFilter, setAuthorFilter] = useState("")
  const [newSong, setNewSong] = useState<Cancion>({
    nombre: "",
    categoria: "",
    autor: "",
    fechaAgregada: new Date().toISOString().split('T')[0],
    letra: "",
    acordes: "",
  })

  // Datos de ejemplo
  const canciones: Cancion[] = [
    {
      id: 1,
      nombre: "Grande y Fuerte",
      categoria: "Alabanza",
      autor: "Miel San Marcos",
      fechaAgregada: "2025-04-10",
      letra: "",
      acordes: "",
    },
    {
      id: 2,
      nombre: "Dios Incomparable",
      categoria: "Adoración",
      autor: "Generación 12",
      fechaAgregada: "2025-04-08",
      letra: "",
      acordes: "",
    },
    {
      id: 3,
      nombre: "Tu Amor No Se Rinde",
      categoria: "Adoración",
      autor: "Hillsong",
      fechaAgregada: "2025-04-05",
      letra: "",
      acordes: "",
    },
    {
      id: 4,
      nombre: "Poderoso Para Salvar",
      categoria: "Adoración",
      autor: "Hillsong",
      fechaAgregada: "2025-04-01",
      letra: "",
      acordes: "",
    },
    {
      id: 5,
      nombre: "Agnus Dei",
      categoria: "Adoración",
      autor: "Michael W. Smith",
      fechaAgregada: "2025-03-28",
      letra: "",
      acordes: "",
    },
    {
      id: 6,
      nombre: "Roca Eterna",
      categoria: "Alabanza",
      autor: "Marcos Witt",
      fechaAgregada: "2025-03-25",
      letra: "",
      acordes: "",
    },
    {
      id: 7,
      nombre: "Digno Es El Señor",
      categoria: "Adoración",
      autor: "Marcos Witt",
      fechaAgregada: "2025-03-20",
      letra: "",
      acordes: "",
    },
    {
      id: 8,
      nombre: "Al Que Está Sentado",
      categoria: "Adoración",
      autor: "Marcos Brunet",
      fechaAgregada: "2025-03-15",
      letra: "",
      acordes: "",
    },
  ]

  const autores = [...new Set(canciones.map((cancion) => cancion.autor))]

  const handleAddSong = () => {
    // Aquí iría la lógica para agregar la canción a la base de datos
    console.log("Nueva canción:", newSong)
    // Resetear el formulario
    setNewSong({
      nombre: "",
      categoria: "",
      autor: "",
      fechaAgregada: new Date().toISOString().split('T')[0],
      letra: "",
      acordes: "",
    })
  }

  const filteredSongs = canciones.filter((cancion) => {
    const matchesSearch = cancion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "" || cancion.categoria === categoryFilter
    const matchesAuthor = authorFilter === "" || cancion.autor === authorFilter
    return matchesSearch && matchesCategory && matchesAuthor
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Repertorio</h2>
          <p className="text-muted-foreground">Gestiona el repertorio de canciones del ministerio</p>
        </div>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Agregar Canción
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Canción</DialogTitle>
                <DialogDescription>
                  Completa el formulario para agregar una nueva canción al repertorio.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    value={newSong.nombre}
                    onChange={(e) => setNewSong({ ...newSong, nombre: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoria" className="text-right">
                    Categoría
                  </Label>
                  <Select
                    value={newSong.categoria}
                    onValueChange={(value) => setNewSong({ ...newSong, categoria: value })}
                  >
                    <SelectTrigger id="categoria" className="col-span-3">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alabanza">Alabanza</SelectItem>
                      <SelectItem value="Adoración">Adoración</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="autor" className="text-right">
                    Autor
                  </Label>
                  <Input
                    id="autor"
                    value={newSong.autor}
                    onChange={(e) => setNewSong({ ...newSong, autor: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="letra" className="text-right">
                    Letra
                  </Label>
                  <Textarea
                    id="letra"
                    value={newSong.letra}
                    onChange={(e) => setNewSong({ ...newSong, letra: e.target.value })}
                    className="col-span-3"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="acordes" className="text-right">
                    Acordes
                  </Label>
                  <Textarea
                    id="acordes"
                    value={newSong.acordes}
                    onChange={(e) => setNewSong({ ...newSong, acordes: e.target.value })}
                    className="col-span-3"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddSong}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar canción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="w-48">
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Alabanza">Alabanza</SelectItem>
              <SelectItem value="Adoración">Adoración</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select
            value={authorFilter}
            onValueChange={setAuthorFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por autor" />
            </SelectTrigger>
            <SelectContent>
              {autores.map((autor) => (
                <SelectItem key={autor} value={autor}>
                  {autor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Fecha de Agregado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSongs.map((cancion) => (
                <TableRow key={cancion.id}>
                  <TableCell>{cancion.nombre}</TableCell>
                  <TableCell>
                    <Badge variant={cancion.categoria === "Alabanza" ? "default" : "secondary"}>
                      {cancion.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell>{cancion.autor}</TableCell>
                  <TableCell>
                    {new Date(cancion.fechaAgregada).toLocaleDateString("es-ES")}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/dashboard/repertorio/${cancion.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => {
                      // Aquí iría la lógica para eliminar la canción
                      console.log("Eliminar canción:", cancion)
                    }}>
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
