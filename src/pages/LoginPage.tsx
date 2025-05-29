"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { ModeToggle } from "../components/mode-toggle"
import { ArrowLeft, Mail, Lock, AlertCircle } from "lucide-react"

interface LoginCredentials {
  email: string
  password: string
}

const DEFAULT_CREDENTIALS: LoginCredentials = {
  email: "admin@example.com",
  password: "password"
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Simulación de inicio de sesión
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (credentials.email === DEFAULT_CREDENTIALS.email && 
          credentials.password === DEFAULT_CREDENTIALS.password) {
        navigate("/dashboard")
      } else {
        setError("Credenciales incorrectas. Inténtalo de nuevo.")
      }
    } catch (err) {
      setError("Error al intentar iniciar sesión. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-primary/10">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al inicio</span>
          </Link>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="flex justify-center">
              <img
                src="/logo.png"
                alt="Logo Iglesia Cristiana Cuadrangular Soledad 2000"
                className="w-[80px] h-[80px] rounded-full"
              />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Iniciar Sesión</h1>
            <p className="mt-2 text-muted-foreground">Accede a tu cuenta para gestionar el ministerio de alabanza</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-md">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  className="pl-10"
                  value={credentials.email}
                  onChange={handleInputChange("email")}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={credentials.password}
                  onChange={handleInputChange("password")}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
              variant="default"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Para fines de demostración, usa:
              <br />
              Email: {DEFAULT_CREDENTIALS.email}
              <br />
              Contraseña: {DEFAULT_CREDENTIALS.password}
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          {new Date().getFullYear()} Rocka Eterna - Iglesia Cristiana Cuadrangular Soledad 2000
        </div>
      </footer>
    </div>
  )
}
