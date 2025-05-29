"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ModeToggle } from "../components/mode-toggle"
import { Music, Calendar, Users, Bell, BarChart, Settings, LogOut, Menu, X } from "lucide-react"
import { useMobile } from "../hooks/use-mobile"

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      name: "Repertorio",
      href: "/dashboard/repertorio",
      icon: <Music className="h-5 w-5" />,
    },
    {
      name: "Programaciones",
      href: "/dashboard/programaciones",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Equipo",
      href: "/dashboard/equipo",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Notificaciones",
      href: "/dashboard/notificaciones",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      name: "Configuración",
      href: "/dashboard/configuracion",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar para móvil */}
      {isMobile && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {sidebarOpen && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          )}

          <div
            className={`relative flex w-full max-w-xs flex-1 flex-col bg-card pt-5 pb-4 transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="absolute right-0 top-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Cerrar sidebar</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-shrink-0 items-center px-4">
              <img src="/logo.png" alt="Logo" className="w-[40px] h-[40px] rounded-full" />
              <span className="ml-2 text-xl font-bold">Rocka Eterna</span>
            </div>
            <div className="mt-5 h-0 flex-1 overflow-y-auto">
              <nav className="space-y-1 px-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      location.pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex flex-shrink-0 border-t p-4">
              <div className="flex items-center">
                <div>
                  <Button
                    variant="ghost"
                    className="flex items-center text-sm"
                    onClick={() => {
                      // Lógica para cerrar sesión
                      navigate("/")
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar para escritorio */}
      {!isMobile && (
        <div
          className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ${
            sidebarOpen ? "lg:w-64" : "lg:w-20"
          }`}
        >
          <div className={`flex flex-col border-r ${sidebarOpen ? "w-64" : "w-20"}`}>
            <div className="flex flex-col h-0 flex-1">
              <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
                <img src="/logo.png" alt="Logo" className="w-[40px] h-[40px] rounded-full" />
                {sidebarOpen && <span className="ml-2 text-xl font-bold">Rocka Eterna</span>}
              </div>
              <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-2 py-4 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        location.pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {item.icon}
                      {sidebarOpen && <span className="ml-3">{item.name}</span>}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex flex-shrink-0 border-t p-4">
                <Button
                  variant="ghost"
                  className={`flex items-center text-sm ${!sidebarOpen && "justify-center p-0 w-full"}`}
                  onClick={() => {
                    // Lógica para cerrar sesión
                    navigate("/")
                  }}
                >
                  <LogOut className={`h-4 w-4 ${sidebarOpen && "mr-2"}`} />
                  {sidebarOpen && <span>Cerrar Sesión</span>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-card shadow-sm border-b">
          <button
            type="button"
            className="px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold">
                {navigation.find((item) => item.href === location.pathname)?.name || "Dashboard"}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <ModeToggle />
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
