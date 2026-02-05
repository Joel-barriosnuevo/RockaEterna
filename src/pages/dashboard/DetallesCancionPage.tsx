"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Music, ChevronLeft, Edit, Trash2, Share2, MessageCircle, Mail, Loader2, FileText, Guitar } from 'lucide-react'
import { useAuth } from "../../contexts/AuthContext"
import { useCanciones } from "../../hooks"
import { compartirWhatsApp, compartirEmail } from "../../lib/share"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

export default function DetallesCancionPage() {
  const { profile } = useAuth()
  const isAdmin = profile?.is_admin ?? false
  const { id } = useParams<{ id: string }>()
  
  const { canciones: cancionesData, loading } = useCanciones()
  const [cancion, setCancion] = useState<any>(null)

  useEffect(() => {
    if (cancionesData && id) {
      const song = cancionesData.find(c => c.id === id)
      if (song) {
        setCancion(song)
      }
    }
  }, [cancionesData, id])

  const handleCompartir = (method: 'whatsapp' | 'email') => {
    const mensaje = `🎵 *${cancion?.nombre}* 🎵\n\n` +
      `🎤 Autor: ${cancion?.autor || 'N/A'}\n` +
      `🎼 Tono: ${cancion?.tono || 'N/A'}\n` +
      `📂 Categoría: ${(cancion as any)?.categoria?.nombre || 'N/A'}\n\n` +
      `📝 Letra:\n${cancion?.letra || 'No disponible'}\n\n` +
      `🎸 Acordes:\n${cancion?.acordes || 'No disponible'}`
    
    if (method === 'whatsapp') {
      compartirWhatsApp(mensaje)
    } else {
      compartirEmail(mensaje)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cuadrangular-cyan/5 via-cuadrangular-purple/5 to-cuadrangular-cyan/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cuadrangular-cyan mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando canción...</p>
        </div>
      </div>
    )
  }

  if (!cancion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cuadrangular-cyan/5 via-cuadrangular-purple/5 to-cuadrangular-cyan/10 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground mb-4">Canción no encontrada</h2>
          <Button asChild variant="outline">
            <Link to="/dashboard/repertorio">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver al Repertorio
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cuadrangular-cyan/5 via-cuadrangular-purple/5 to-cuadrangular-cyan/10">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="icon" className="h-8 w-8">
              <Link to="/dashboard/repertorio">
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-cuadrangular-cyan">Detalles de Canción</h1>
              <p className="text-sm text-muted-foreground">Información completa de la canción</p>
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
            
            {isAdmin && (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/dashboard/repertorio/${cancion.id}/editar`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="sm" className="text-cuadrangular-red hover:text-cuadrangular-red">
                  <Link to={`/dashboard/repertorio/${cancion.id}/eliminar`}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Información principal */}
        <Card className="mb-6 bg-white/50 backdrop-blur-sm border-cuadrangular-cyan/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cuadrangular-cyan to-cuadrangular-purple flex items-center justify-center text-white">
                  <Music className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-cuadrangular-cyan mb-2">{cancion.nombre}</h2>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-cuadrangular-purple/10 text-cuadrangular-purple border-cuadrangular-purple/30">
                      <Guitar className="w-3 h-3 mr-1" />
                      {(cancion as any)?.categoria?.nombre || "Sin categoría"}
                    </Badge>
                    {cancion.tono && (
                      <Badge variant="outline" className="bg-cuadrangular-yellow/10 text-cuadrangular-yellow border-cuadrangular-yellow/30">
                        🎵 {cancion.tono}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Autor</h3>
                <p className="font-medium">{cancion.autor || "No especificado"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Tono</h3>
                <p className="font-medium">{cancion.tono || "No especificado"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Letra */}
        {cancion.letra && (
          <Card className="mb-6 bg-white/50 backdrop-blur-sm border-cuadrangular-cyan/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-cuadrangular-cyan" />
                <h3 className="text-lg font-semibold text-cuadrangular-cyan">Letra</h3>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                  {cancion.letra}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acordes */}
        {cancion.acordes && (
          <Card className="bg-white/50 backdrop-blur-sm border-cuadrangular-cyan/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Guitar className="w-5 h-5 text-cuadrangular-cyan" />
                <h3 className="text-lg font-semibold text-cuadrangular-cyan">Acordes</h3>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                  {cancion.acordes}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sin letra/acordes */}
        {!cancion.letra && !cancion.acordes && (
          <Card className="bg-white/50 backdrop-blur-sm border-cuadrangular-cyan/20">
            <CardContent className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay letra ni acordes disponibles para esta canción</p>
                {isAdmin && (
                  <Button asChild className="mt-4 bg-gradient-to-r from-cuadrangular-cyan to-cuadrangular-purple hover:opacity-90 text-white">
                    <Link to={`/dashboard/repertorio/${cancion.id}/editar`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Agregar letra y acordes
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
