"use client"

import { useState, useMemo } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
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
import { Music, Search, Plus, Edit, Trash2, Filter, ListMusic, Grid3X3, Loader2 } from "lucide-react"
import { useCanciones, useCategorias } from "../../hooks"
import { useAuth } from "../../contexts/AuthContext"
import type { NuevaCancion } from "../../types/database.types"

export default function RepertorioPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newSong, setNewSong] = useState({
    nombre: "",
    categoria_id: "",
    autor: "",
    tono: "",
    letra: "",
    acordes: "",
  })
  const [editSong, setEditSong] = useState({
    nombre: "",
    categoria_id: "",
    autor: "",
    tono: "",
    letra: "",
    acordes: "",
  })

  // Hooks de datos
  const { canciones, loading, createCancion, updateCancion, deleteCancion } = useCanciones({ activa: true })
  const { categorias } = useCategorias()

  // Filtrar canciones
  const filteredSongs = useMemo(() => {
    return canciones.filter((cancion) => {
      const matchesSearch = cancion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (cancion.autor?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      const matchesCategory = !categoryFilter || categoryFilter === "todas" || 
                              cancion.categoria_id?.toString() === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [canciones, searchTerm, categoryFilter])

  // Obtener nombre de categoría
  const getCategoriaName = (categoriaId: number | null) => {
    if (!categoriaId) return "Sin categoría"
    const cat = categorias.find(c => c.id === categoriaId)
    return cat?.nombre || "Sin categoría"
  }

  const handleAddSong = async () => {
    if (!newSong.nombre) {
      alert("Por favor ingresa el nombre de la canción")
      return
    }
    
    // Validar que no exista una canción con el mismo nombre y autor
    const existingSong = canciones.find(
      cancion => cancion.nombre.toLowerCase().trim() === newSong.nombre.toLowerCase().trim() &&
               (cancion.autor || "").toLowerCase().trim() === (newSong.autor || "").toLowerCase().trim()
    )
    
    if (existingSong) {
      alert(`Ya existe una canción con el nombre "${newSong.nombre}" del autor "${newSong.autor || 'Desconocido'}"`)
      return
    }
    
    setIsSaving(true)
    try {
      const nuevaCancion: NuevaCancion = {
        nombre: newSong.nombre,
        autor: newSong.autor || null,
        categoria_id: newSong.categoria_id ? parseInt(newSong.categoria_id) : null,
        tono: newSong.tono || null,
        letra: newSong.letra || null,
        acordes: newSong.acordes || null,
        created_by: user?.id,
      }
      await createCancion(nuevaCancion)
      setNewSong({ nombre: "", categoria_id: "", autor: "", tono: "", letra: "", acordes: "" })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error al crear canción:", error)
      alert("Error al crear la canción")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteSong = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta canción?")) {
      try {
        await deleteCancion(id)
      } catch (error) {
        console.error("Error al eliminar canción:", error)
      }
    }
  }

  // Abrir diálogo de edición
  const handleOpenEdit = (cancion: typeof canciones[0]) => {
    setEditingId(cancion.id)
    setEditSong({
      nombre: cancion.nombre,
      categoria_id: cancion.categoria_id?.toString() || "",
      autor: cancion.autor || "",
      tono: cancion.tono || "",
      letra: cancion.letra || "",
      acordes: cancion.acordes || "",
    })
    setIsEditDialogOpen(true)
  }

  // Guardar edición
  const handleEditSong = async () => {
    if (!editSong.nombre || !editingId) return
    
    setIsSaving(true)
    try {
      await updateCancion(editingId, {
        nombre: editSong.nombre,
        autor: editSong.autor || null,
        categoria_id: editSong.categoria_id ? parseInt(editSong.categoria_id) : null,
        tono: editSong.tono || null,
        letra: editSong.letra || null,
        acordes: editSong.acordes || null,
      })
      setIsEditDialogOpen(false)
      setEditingId(null)
    } catch (error) {
      console.error("Error al editar canción:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cuadrangular-red/10 flex items-center justify-center">
              <Music className="w-5 h-5 text-cuadrangular-red" />
            </div>
            Repertorio
          </h1>
          <p className="text-muted-foreground mt-1">
            {filteredSongs.length} canciones en el repertorio
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cuadrangular-red to-cuadrangular-purple hover:opacity-90 text-white shadow-glow-purple animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Canción
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-display flex items-center justify-between">
                <span>Nueva Canción</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDialogOpen(false)}
                  className="h-8 w-8 rounded-full"
                >
                  ×
                </Button>
              </DialogTitle>
              <DialogDescription>
                Agrega una nueva canción al repertorio del ministerio
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre *</Label>
                  <Input
                    value={newSong.nombre}
                    onChange={(e) => setNewSong({ ...newSong, nombre: e.target.value })}
                    placeholder="Nombre de la canción"
                    className="border-border/50 focus:border-cuadrangular-purple"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tono</Label>
                  <Input
                    value={newSong.tono}
                    onChange={(e) => setNewSong({ ...newSong, tono: e.target.value })}
                    placeholder="Ej: G, Am, D"
                    className="border-border/50 focus:border-cuadrangular-purple"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select value={newSong.categoria_id} onValueChange={(value) => setNewSong({ ...newSong, categoria_id: value })}>
                    <SelectTrigger className="border-border/50 focus:border-cuadrangular-purple">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Autor</Label>
                  <Input
                    value={newSong.autor}
                    onChange={(e) => setNewSong({ ...newSong, autor: e.target.value })}
                    placeholder="Artista o banda"
                    className="border-border/50 focus:border-cuadrangular-purple"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Letra</Label>
                <Textarea
                  value={newSong.letra}
                  onChange={(e) => setNewSong({ ...newSong, letra: e.target.value })}
                  placeholder="Letra de la canción..."
                  rows={4}
                  className="border-border/50 focus:border-cuadrangular-purple resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label>Acordes</Label>
                <Textarea
                  value={newSong.acordes}
                  onChange={(e) => setNewSong({ ...newSong, acordes: e.target.value })}
                  placeholder="Progresión de acordes..."
                  rows={3}
                  className="border-border/50 focus:border-cuadrangular-purple resize-none font-mono text-sm"
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2 sticky bottom-0 bg-background pt-4 border-t">
              <Button 
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddSong} 
                disabled={isSaving || !newSong.nombre}
                className="bg-gradient-to-r from-cuadrangular-red to-cuadrangular-purple text-white w-full sm:w-auto"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Canción"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Editar Canción */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-display">Editar Canción</DialogTitle>
              <DialogDescription>
                Modifica los detalles de la canción
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre *</Label>
                  <Input
                    value={editSong.nombre}
                    onChange={(e) => setEditSong({ ...editSong, nombre: e.target.value })}
                    placeholder="Nombre de la canción"
                    className="border-border/50 focus:border-cuadrangular-purple"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tono</Label>
                  <Input
                    value={editSong.tono}
                    onChange={(e) => setEditSong({ ...editSong, tono: e.target.value })}
                    placeholder="Ej: G, Am, D"
                    className="border-border/50 focus:border-cuadrangular-purple"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select value={editSong.categoria_id} onValueChange={(value) => setEditSong({ ...editSong, categoria_id: value })}>
                    <SelectTrigger className="border-border/50 focus:border-cuadrangular-purple">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Autor</Label>
                  <Input
                    value={editSong.autor}
                    onChange={(e) => setEditSong({ ...editSong, autor: e.target.value })}
                    placeholder="Artista o banda"
                    className="border-border/50 focus:border-cuadrangular-purple"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Letra</Label>
                <Textarea
                  value={editSong.letra}
                  onChange={(e) => setEditSong({ ...editSong, letra: e.target.value })}
                  placeholder="Letra de la canción..."
                  rows={4}
                  className="border-border/50 focus:border-cuadrangular-purple resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label>Acordes</Label>
                <Textarea
                  value={editSong.acordes}
                  onChange={(e) => setEditSong({ ...editSong, acordes: e.target.value })}
                  placeholder="Progresión de acordes..."
                  rows={3}
                  className="border-border/50 focus:border-cuadrangular-purple resize-none font-mono text-sm"
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleEditSong} 
                disabled={isSaving || !editSong.nombre}
                className="bg-gradient-to-r from-cuadrangular-red to-cuadrangular-purple text-white w-full sm:w-auto"
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

      {/* ═══════════════════════════════════════════════════════════════════
          FILTROS
          ═══════════════════════════════════════════════════════════════════ */}
      <Card className="border-border/50 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            {/* Primera fila: Búsqueda */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border/50 focus:border-cuadrangular-cyan"
              />
            </div>
            
            {/* Segunda fila: Filtro y Vista */}
            <div className="flex items-center gap-2">
              {/* Filtro categoría */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="flex-1 sm:w-48 sm:flex-none border-border/50">
                  <Filter className="w-4 h-4 mr-2 shrink-0" />
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Vista */}
              <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg shrink-0">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8"
                >
                  <ListMusic className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════════
          LISTA DE CANCIONES
          ═══════════════════════════════════════════════════════════════════ */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-cuadrangular-purple" />
        </div>
      ) : filteredSongs.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Music className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No hay canciones</p>
            <p className="text-sm text-muted-foreground">Agrega una nueva canción para comenzar</p>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSongs.map((cancion, index) => {
            const categoriaNombre = getCategoriaName(cancion.categoria_id)
            return (
              <Card 
                key={cancion.id} 
                className="group border-border/50 hover:border-cuadrangular-red/30 transition-all duration-300 hover:shadow-glow-red/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cuadrangular-red/20 to-cuadrangular-purple/20 flex items-center justify-center">
                      <Music className="w-6 h-6 text-cuadrangular-red" />
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={categoriaNombre === "Alabanza" 
                        ? "bg-cuadrangular-red/10 text-cuadrangular-red border-0" 
                        : "bg-cuadrangular-cyan/10 text-cuadrangular-cyan border-0"
                      }
                    >
                      {categoriaNombre}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">{cancion.nombre}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{cancion.autor || "Desconocido"}</p>
                  
                    <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Tono: <span className="font-semibold text-cuadrangular-purple">{cancion.tono || "-"}</span>
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleOpenEdit(cancion)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-cuadrangular-red"
                        onClick={() => handleDeleteSong(cancion.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-border/50 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {filteredSongs.map((cancion) => {
                const categoriaNombre = getCategoriaName(cancion.categoria_id)
                return (
                  <div 
                    key={cancion.id} 
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-muted/30 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cuadrangular-red/20 to-cuadrangular-purple/20 flex items-center justify-center shrink-0">
                        <Music className="w-5 h-5 text-cuadrangular-red" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold truncate">{cancion.nombre}</h4>
                        <p className="text-sm text-muted-foreground truncate">{cancion.autor || "Desconocido"}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 pl-13 sm:pl-0">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${categoriaNombre === "Alabanza" 
                            ? "bg-cuadrangular-red/10 text-cuadrangular-red border-0" 
                            : "bg-cuadrangular-cyan/10 text-cuadrangular-cyan border-0"
                          }`}
                        >
                          {categoriaNombre}
                        </Badge>
                        <span className="text-xs sm:text-sm font-medium text-cuadrangular-purple">
                          {cancion.tono || "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleOpenEdit(cancion)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-cuadrangular-red"
                          onClick={() => handleDeleteSong(cancion.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
