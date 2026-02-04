"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import { Progress } from "./progress"
import { Alert, AlertDescription } from "./alert"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"

interface ImageUploadProps {
  /** URL de la imagen actual */
  currentImage?: string
  /** Callback cuando se sube una imagen */
  onUpload: (file: File) => Promise<string | null>
  /** Callback cuando se elimina una imagen */
  onRemove?: () => Promise<void>
  /** Si está subiendo actualmente */
  isUploading?: boolean
  /** Progreso de subida (0-100) */
  progress?: number
  /** Error de subida */
  error?: string | null
  /** Texto del botón */
  buttonText?: string
  /** Descripción */
  description?: string
  /** Tamaño máximo del archivo en bytes */
  maxSize?: number
  /** Tipos de archivo permitidos */
  acceptedTypes?: string
  /** Clases adicionales */
  className?: string
  /** Altura del componente */
  height?: string
  /** Ancho del componente */
  width?: string
}

export function ImageUpload({
  currentImage,
  onUpload,
  onRemove,
  isUploading = false,
  progress = 0,
  error = null,
  buttonText = "Seleccionar imagen",
  description = "Arrastra una imagen aquí o haz clic para seleccionar",
  maxSize = 2 * 1024 * 1024, // 2MB
  acceptedTypes = "image/jpeg,image/png,image/gif,image/webp",
  className,
  height = "h-48",
  width = "w-full"
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sincronizar preview con currentImage cuando cambia (versión simplificada)
  useEffect(() => {
    console.log('🔍 [ImageUpload] useEffect - currentImage:', currentImage, 'preview:', preview)
    if (currentImage !== preview) {
      console.log('🔄 [ImageUpload] Actualizando preview a:', currentImage)
      setPreview(currentImage || null)
    } else {
      console.log('⏭️ [ImageUpload] Preview ya actual, omitiendo')
    }
  }, [currentImage])

  // Formatear tamaño del archivo para mostrar
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Validar archivo
  const validateFile = (file: File): string | null => {
    // Validar tipo
    const allowedTypes = acceptedTypes.split(',')
    if (!allowedTypes.includes(file.type)) {
      return `Tipo de archivo no permitido. Se permiten: ${allowedTypes.join(', ')}`
    }

    // Validar tamaño
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024) * 10) / 10
      return `El archivo es demasiado grande. Máximo permitido: ${maxSizeMB}MB`
    }

    return null
  }

  // Crear preview de la imagen
  const createPreview = (file: File): void => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Manejar selección de archivo
  const handleFileSelect = useCallback(async (file: File) => {
    console.log('📁 Archivo seleccionado:', file.name)
    const validationError = validateFile(file)
    if (validationError) {
      console.log('❌ Error de validación:', validationError)
      return validationError
    }

    // Crear preview
    console.log('🖼️ Creando preview temporal...')
    createPreview(file)

    // Subir archivo
    try {
      console.log('📤 Iniciando subida...')
      const result = await onUpload(file)
      console.log('✅ Resultado de subida:', result)
      if (result) {
        // Extraer URL si result es un objeto, o usar directamente si es string
        const imageUrl = typeof result === 'string' ? result : result
        console.log('🔄 Actualizando preview con URL:', imageUrl)
        setPreview(imageUrl)
      } else {
        console.log('⚠️ No se recibió URL de resultado')
      }
    } catch (error) {
      console.error('❌ Error al subir imagen:', error)
      return 'Error al subir la imagen'
    }

    return null
  }, [onUpload])

  // Manejar cambio de input
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const error = await handleFileSelect(file)
    if (error) {
      // El error se manejará a través del prop error
      console.error(error)
    }
  }

  // Manejar drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    const error = await handleFileSelect(file)
    if (error) {
      console.error(error)
    }
  }, [handleFileSelect])

  // Eliminar imagen
  const handleRemove = async () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    
    if (onRemove) {
      try {
        await onRemove()
      } catch (error) {
        console.error('Error al eliminar imagen:', error)
      }
    }
  }

  // Abrir selector de archivos
  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className={cn(height, width, "relative flex items-center justify-center")}>
          {/* Input oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleInputChange}
            className="hidden"
            disabled={isUploading}
          />

          {/* Estado de carga */}
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
              {progress > 0 && (
                <div className="w-full max-w-xs mt-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{progress}%</p>
                </div>
              )}
            </div>
          )}

          {/* Preview de imagen */}
          {preview && !isUploading && (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Área de subida */}
          {!preview && !isUploading && (
            <div
              className={cn(
                "w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors cursor-pointer",
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              <div className="flex flex-col items-center justify-center space-y-2 text-center p-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  dragActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{buttonText}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                  <p className="text-xs text-muted-foreground">
                    Máximo: {formatFileSize(maxSize)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && !isUploading && (
            <div className="absolute bottom-0 left-0 right-0">
              <Alert variant="destructive" className="rounded-none">
                <AlertDescription className="text-xs">
                  {error}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
