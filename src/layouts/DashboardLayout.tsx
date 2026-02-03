"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ModeToggle } from "../components/mode-toggle"
import { 
  Music, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  Home
} from "lucide-react"
import { useMobile } from "../hooks/use-mobile"
import { useAuth } from "../contexts/AuthContext"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    color: "text-cuadrangular-purple",
    bgColor: "bg-cuadrangular-purple/10",
  },
  {
    name: "Repertorio",
    href: "/dashboard/repertorio",
    icon: Music,
    color: "text-cuadrangular-red",
    bgColor: "bg-cuadrangular-red/10",
  },
  {
    name: "Programaciones",
    href: "/dashboard/programaciones",
    icon: Calendar,
    color: "text-cuadrangular-cyan",
    bgColor: "bg-cuadrangular-cyan/10",
  },
  {
    name: "Equipo",
    href: "/dashboard/equipo",
    icon: Users,
    color: "text-cuadrangular-yellow",
    bgColor: "bg-cuadrangular-yellow/10",
  },
  {
    name: "Configuración",
    href: "/dashboard/configuracion",
    icon: Settings,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
]

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useMobile()
  const { signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Función para cerrar sesión
  const handleLogout = async () => {
    await signOut()
    navigate("/", { replace: true })
  }

  useEffect(() => {
    setSidebarOpen(!isMobile)
    if (isMobile) setSidebarCollapsed(false)
  }, [isMobile])

  const currentPage = navigation.find((item) => item.href === location.pathname)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ═══════════════════════════════════════════════════════════════════
          SIDEBAR MÓVIL - Overlay
          ═══════════════════════════════════════════════════════════════════ */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SIDEBAR
          ═══════════════════════════════════════════════════════════════════ */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          flex flex-col
          bg-card border-r border-border/50
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? sidebarOpen ? "translate-x-0" : "-translate-x-full" 
            : "translate-x-0"
          }
          ${sidebarCollapsed && !isMobile ? "w-20" : "w-72"}
        `}
      >
        {/* Header del sidebar */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-cuadrangular-purple/30"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col animate-fade-in">
                <span className="font-display font-bold text-lg leading-tight">
                  Rocka <span className="text-cuadrangular-purple">Eterna</span>
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Ministerio
                </span>
              </div>
            )}
          </Link>
          
          {/* Botón cerrar en móvil */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={`
                    group flex items-center gap-3 px-3 py-3 rounded-xl
                    transition-all duration-300
                    ${isActive 
                      ? `bg-gradient-to-r from-cuadrangular-purple/20 to-cuadrangular-cyan/10 ${item.color} font-semibold` 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                    ${sidebarCollapsed && !isMobile ? "justify-center" : ""}
                  `}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-xl
                    transition-all duration-300
                    ${isActive ? item.bgColor : "bg-transparent group-hover:bg-muted"}
                  `}>
                    <item.icon className={`h-5 w-5 ${isActive ? item.color : ""}`} />
                  </div>
                  {!sidebarCollapsed && (
                    <span className="animate-fade-in">{item.name}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-cuadrangular-purple animate-pulse-soft" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer del sidebar */}
        <div className="p-3 border-t border-border/50">
          {/* Botón colapsar (solo desktop) */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`w-full mb-2 ${sidebarCollapsed ? "justify-center" : "justify-start"}`}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span>Colapsar</span>
                </>
              )}
            </Button>
          )}
          
          {/* Botón cerrar sesión */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`
              w-full text-muted-foreground hover:text-cuadrangular-red hover:bg-cuadrangular-red/10
              transition-all duration-300
              ${sidebarCollapsed && !isMobile ? "justify-center px-0" : "justify-start"}
            `}
          >
            <LogOut className={`h-5 w-5 ${!sidebarCollapsed && "mr-3"}`} />
            {!sidebarCollapsed && <span>Cerrar Sesión</span>}
          </Button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════════
          CONTENIDO PRINCIPAL
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header principal */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {/* Botón menú móvil */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Breadcrumb / Título */}
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <Home className="h-4 w-4" />
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium flex items-center gap-2">
                {currentPage && (
                  <currentPage.icon className={`h-4 w-4 ${currentPage.color}`} />
                )}
                {currentPage?.name || "Dashboard"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Toggle tema */}
            <ModeToggle />
            
            {/* Avatar usuario */}
            <div className="flex items-center gap-3 pl-3 border-l border-border/50">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cuadrangular-purple to-cuadrangular-cyan flex items-center justify-center text-white font-semibold text-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Área de contenido */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 lg:p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
