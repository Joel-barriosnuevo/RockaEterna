import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ModeToggle } from "../components/mode-toggle"
import { Music, Users, Calendar, ChevronRight } from "lucide-react"

// Tipos para las características
interface Feature {
  title: string
  description: string
  color: "primary" | "secondary" | "accent" | "muted"
}

const FEATURES: Feature[] = [
  {
    title: "Gestión de Repertorio",
    description: "Organiza y clasifica las canciones por categoría y autor.",
    color: "primary",
  },
  {
    title: "Programación de Servicios",
    description: "Crea y gestiona las programaciones para cada servicio.",
    color: "secondary",
  },
  {
    title: "Asignación de Roles",
    description: "Asigna roles específicos a cada miembro del equipo.",
    color: "accent",
  },
  {
    title: "Notificaciones",
    description: "Recibe alertas sobre nuevas asignaciones o cambios.",
    color: "muted",
  },
  {
    title: "Calendario Interactivo",
    description: "Visualiza las programaciones en un calendario intuitivo.",
    color: "primary",
  },
  {
    title: "Estadísticas",
    description: "Analiza el uso de canciones y la participación de los miembros.",
    color: "secondary",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Logo Iglesia Cristiana Cuadrangular Soledad 2000"
              className="w-[50px] h-[50px] rounded-full"
            />
            <span className="text-xl font-bold">Rocka Eterna</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4 animate-fade-in">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Rocka Eterna</h1>
                <h2 className="text-xl text-muted-foreground">Iglesia Cristiana Cuadrangular Soledad 2000</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Sistema de gestión para el grupo de alabanza, facilitando la organización de programaciones,
                  repertorio musical y roles dentro de los servicios religiosos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/login">
                    <Button className="w-full sm:w-auto">Iniciar Sesión</Button>
                  </Link>
                  <a href="#about">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Conocer Más
                    </Button>
                  </a>
                </div>
              </div>
              <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] animate-slide-up">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <Music className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <h3 className="text-2xl font-bold">Alabanza y Adoración</h3>
                    <p className="mt-2 text-muted-foreground">Uniendo corazones a través de la música</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10 animate-fade-in">
              <h2 className="text-3xl font-bold">Sobre Nosotros</h2>
              <p className="mt-2 text-muted-foreground">Conoce más sobre el ministerio de alabanza Rocka Eterna</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 animate-slide-up">
              {[
                {
                  icon: Music,
                  title: "Nuestro Repertorio",
                  description: "Contamos con un amplio repertorio de canciones de alabanza y adoración para glorificar el nombre de Dios.",
                  color: "primary",
                },
                {
                  icon: Users,
                  title: "Nuestro Equipo",
                  description: "Somos un grupo de músicos y vocalistas comprometidos con el servicio a Dios a través de nuestros talentos.",
                  color: "secondary",
                },
                {
                  icon: Calendar,
                  title: "Nuestros Servicios",
                  description: "Participamos activamente en los servicios de miércoles y domingo, llevando alabanza y adoración a la congregación.",
                  color: "accent",
                },
              ].map((item, index) => (
                <div key={index} className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`rounded-full bg-${item.color}/10 w-12 h-12 flex items-center justify-center mb-4`}>
                    <item.icon className={`text-${item.color} h-6 w-6`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10 animate-fade-in">
              <h2 className="text-3xl font-bold">Características del Sistema</h2>
              <p className="mt-2 text-muted-foreground">Descubre las funcionalidades que ofrece nuestra plataforma</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
              {FEATURES.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-${feature.color}`}
                >
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-b from-background to-primary/10">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
              <p className="text-muted-foreground mb-8">
                Inicia sesión para acceder a todas las funcionalidades del sistema y mejorar la organización de tu
                ministerio de alabanza.
              </p>
              <Link to="/login">
                <Button size="lg" className="animate-pulse">
                  Iniciar Sesión <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Logo Iglesia Cristiana Cuadrangular Soledad 2000"
              className="w-[30px] h-[30px] rounded-full"
            />
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Rocka Eterna - Iglesia Cristiana Cuadrangular Soledad 2000
            </p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Términos
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Privacidad
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
