"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { ModeToggle } from "../components/mode-toggle"
import { ArrowLeft, Mail, Lock, AlertCircle, Music, Loader2, UserPlus, LogIn, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

interface FormData {
  email: string
  password: string
  nombre: string
  apellido: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn, signUp, user, initialized } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    nombre: "",
    apellido: ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (initialized && user) {
      navigate("/dashboard")
    }
  }, [user, initialized, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      if (isRegister) {
        // Registro
        if (!formData.nombre || !formData.apellido) {
          setError("Por favor completa tu nombre y apellido")
          return
        }
        await signUp(formData.email, formData.password, formData.nombre, formData.apellido)
        setSuccess("¡Cuenta creada! Revisa tu correo para confirmar.")
        setIsRegister(false)
      } else {
        // Login
        await signIn(formData.email, formData.password)
        navigate("/dashboard")
      }
    } catch (err: any) {
      console.error("Auth error:", err)
      if (err.message?.includes("Invalid login")) {
        setError("Credenciales incorrectas. Inténtalo de nuevo.")
      } else if (err.message?.includes("Email not confirmed")) {
        setError("Por favor confirma tu email antes de iniciar sesión.")
      } else if (err.message?.includes("User already registered")) {
        setError("Este correo ya está registrado. Intenta iniciar sesión.")
      } else {
        setError(err.message || "Error al procesar la solicitud.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const toggleMode = () => {
    setIsRegister(!isRegister)
    setError("")
    setSuccess("")
  }

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          PANEL IZQUIERDO - Decorativo
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-cuadrangular-purple via-cuadrangular-red/80 to-cuadrangular-cyan" />
        
        {/* Patrón de puntos */}
        <div className="absolute inset-0 bg-dots-pattern bg-dots opacity-20" />
        
        {/* Círculos decorativos */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cuadrangular-yellow/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        
        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          {/* Logo grande */}
          <div className="mb-8 animate-fade-in-down">
            <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm p-2 ring-4 ring-white/20">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          
          {/* Texto */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-5xl font-display font-bold mb-4">
              Rocka Eterna
            </h1>
            <p className="text-xl text-white/80 max-w-md">
              Sistema de gestión para el ministerio de alabanza
            </p>
          </div>
          
          {/* Símbolos del evangelio */}
          <div className="flex items-center gap-4 mt-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { symbol: "✝", bg: "bg-cuadrangular-red" },
              { symbol: "🍷", bg: "bg-cuadrangular-cyan" },
              { symbol: "🕊", bg: "bg-cuadrangular-yellow" },
              { symbol: "👑", bg: "bg-cuadrangular-purple" },
            ].map((item, i) => (
              <div
                key={i}
                className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center text-xl shadow-lg hover:scale-110 transition-transform duration-300`}
              >
                {item.symbol}
              </div>
            ))}
          </div>
          
          {/* Texto inferior */}
          <div className="absolute bottom-12 text-center text-white/60 text-sm animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <p>Iglesia Cristiana Cuadrangular</p>
            <p>Soledad 2000</p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          PANEL DERECHO - Formulario
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Volver al inicio</span>
          </Link>
          <ModeToggle />
        </header>

        {/* Formulario centrado */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            {/* Logo para móvil */}
            <div className="lg:hidden flex flex-col items-center mb-8 animate-fade-in-down">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-cuadrangular-purple/20 mb-4">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-display font-bold">
                Rocka <span className="text-cuadrangular-purple">Eterna</span>
              </h1>
            </div>
            
            {/* Título del formulario */}
            <div className="text-center lg:text-left animate-fade-in-up">
              <h2 className="text-3xl font-display font-bold mb-2">
                {isRegister ? "Crear cuenta" : "Bienvenido de vuelta"}
              </h2>
              <p className="text-muted-foreground">
                {isRegister 
                  ? "Regístrate para acceder al sistema" 
                  : "Ingresa tus credenciales para acceder al sistema"}
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              {/* Error message */}
              {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-cuadrangular-red/10 border border-cuadrangular-red/30 text-cuadrangular-red animate-fade-in">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Success message */}
              {success && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 animate-fade-in">
                  <Music className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {/* Nombre y Apellido (solo registro) */}
              {isRegister && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-sm font-medium">
                      Nombre
                    </Label>
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Tu nombre"
                      className="h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background focus:border-cuadrangular-purple"
                      value={formData.nombre}
                      onChange={handleInputChange("nombre")}
                      required={isRegister}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido" className="text-sm font-medium">
                      Apellido
                    </Label>
                    <Input
                      id="apellido"
                      type="text"
                      placeholder="Tu apellido"
                      className="h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background focus:border-cuadrangular-purple"
                      value={formData.apellido}
                      onChange={handleInputChange("apellido")}
                      required={isRegister}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    className="pl-12 h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background focus:border-cuadrangular-purple focus:ring-cuadrangular-purple/20 transition-all duration-300"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Contraseña
                  </Label>
                  {!isRegister && (
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-cuadrangular-purple hover:text-cuadrangular-purple/80 transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isRegister ? "Mínimo 6 caracteres" : "••••••••"}
                    className="pl-12 pr-12 h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background focus:border-cuadrangular-purple focus:ring-cuadrangular-purple/20 transition-all duration-300"
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-gradient-to-r from-cuadrangular-red to-cuadrangular-purple hover:opacity-90 text-white font-semibold text-base shadow-glow-purple transition-all duration-300 hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isRegister ? "Creando cuenta..." : "Iniciando sesión..."}
                  </>
                ) : (
                  <>
                    {isRegister ? (
                      <>
                        <UserPlus className="mr-2 h-5 w-5" />
                        Crear Cuenta
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-5 w-5" />
                        Iniciar Sesión
                      </>
                    )}
                  </>
                )}
              </Button>
            </form>

            {/* Toggle login/register */}
            <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <p className="text-sm text-muted-foreground">
                {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-2 text-cuadrangular-purple hover:text-cuadrangular-purple/80 font-semibold transition-colors"
                >
                  {isRegister ? "Iniciar sesión" : "Regístrate"}
                </button>
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-cuadrangular-red" />
            <div className="w-2 h-2 rounded-full bg-cuadrangular-cyan" />
            <div className="w-2 h-2 rounded-full bg-cuadrangular-yellow" />
            <div className="w-2 h-2 rounded-full bg-cuadrangular-purple" />
          </div>
          © {new Date().getFullYear()} Rocka Eterna - Iglesia Cristiana Cuadrangular
        </footer>
      </div>
    </div>
  )
}
