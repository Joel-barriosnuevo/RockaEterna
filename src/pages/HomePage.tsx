import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ModeToggle } from "../components/mode-toggle"
import { Music, Users, Calendar, ChevronRight, Mic2, Guitar, Heart, Star, Play } from "lucide-react"

// Características del sistema
const FEATURES = [
  {
    icon: Music,
    title: "Gestión de Repertorio",
    description: "Organiza canciones por categoría, tono y autor con letras y acordes.",
    color: "cuadrangular-red",
    gradient: "from-cuadrangular-red/20 to-cuadrangular-red/5",
  },
  {
    icon: Calendar,
    title: "Programación de Servicios",
    description: "Planifica cada servicio con canciones y asignación de roles.",
    color: "cuadrangular-cyan",
    gradient: "from-cuadrangular-cyan/20 to-cuadrangular-cyan/5",
  },
  {
    icon: Users,
    title: "Gestión de Equipo",
    description: "Administra músicos, vocalistas y sus roles en el ministerio.",
    color: "cuadrangular-yellow",
    gradient: "from-cuadrangular-yellow/20 to-cuadrangular-yellow/5",
  },
  {
    icon: Star,
    title: "Estadísticas",
    description: "Analiza el uso de canciones y participación del equipo.",
    color: "cuadrangular-purple",
    gradient: "from-cuadrangular-purple/20 to-cuadrangular-purple/5",
  },
]

// Símbolos del Evangelio Cuadrangular
const GOSPEL_SYMBOLS = [
  { 
    symbol: "✝", 
    title: "Salvación", 
    color: "bg-cuadrangular-red",
    description: "Jesucristo es el Salvador"
  },
  { 
    symbol: "🍷", 
    title: "Espíritu Santo", 
    color: "bg-cuadrangular-cyan",
    description: "Bautizador con el Espíritu"
  },
  { 
    symbol: "🕊", 
    title: "Sanidad", 
    color: "bg-cuadrangular-yellow",
    description: "El Gran Médico"
  },
  { 
    symbol: "👑", 
    title: "Segunda Venida", 
    color: "bg-cuadrangular-purple",
    description: "El Rey que viene"
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Logo Iglesia Cuadrangular"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-cuadrangular-purple/30 group-hover:ring-cuadrangular-purple transition-all duration-300"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cuadrangular-cyan rounded-full animate-pulse-soft" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-bold tracking-tight">
                Rocka <span className="text-cuadrangular-purple">Eterna</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                Ministerio de Alabanza
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Link to="/login">
              <Button 
                variant="outline" 
                className="hidden sm:flex border-cuadrangular-purple/30 hover:bg-cuadrangular-purple/10 hover:border-cuadrangular-purple transition-all duration-300"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-gradient-to-r from-cuadrangular-red to-cuadrangular-purple hover:opacity-90 text-white shadow-glow-purple transition-all duration-300">
                <Play className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* ═══════════════════════════════════════════════════════════════════
            HERO SECTION
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[90vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Background decorativo */}
          <div className="absolute inset-0 bg-dots-pattern bg-dots opacity-50" />
          
          {/* Círculos decorativos animados - reducidos en móvil */}
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 h-32 sm:w-72 sm:h-72 bg-cuadrangular-purple/20 rounded-full blur-2xl sm:blur-3xl animate-float" />
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-40 h-40 sm:w-96 sm:h-96 bg-cuadrangular-cyan/20 rounded-full blur-2xl sm:blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-cuadrangular-red/10 rounded-full blur-2xl sm:blur-3xl animate-pulse-soft" />
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
              {/* Contenido izquierdo */}
              <div className="text-center lg:text-left space-y-6 sm:space-y-8 order-2 lg:order-1">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-cuadrangular-purple/10 border border-cuadrangular-purple/30 animate-fade-in-down">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-cuadrangular-red animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium text-cuadrangular-purple">
                    Iglesia Cristiana Cuadrangular Soledad 2000
                  </span>
                </div>
                
                {/* Título principal */}
                <div className="space-y-3 sm:space-y-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-black tracking-tight leading-tight">
                    <span className="block">Rocka</span>
                    <span className="block bg-gradient-to-r from-cuadrangular-red via-cuadrangular-purple to-cuadrangular-cyan bg-clip-text text-transparent">
                      Eterna
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                    Sistema de gestión para el <span className="text-cuadrangular-cyan font-semibold">ministerio de alabanza</span>,
                    <br className="hidden sm:block" />
                    facilitando la organización de servicios y la coordinación del equipo.
                  </p>
                </div>
                
                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <Link to="/login">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-gradient-to-r from-cuadrangular-red to-cuadrangular-purple hover:opacity-90 text-white text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 shadow-glow-purple transition-all duration-300 hover:scale-105 min-h-[48px] sm:min-h-[56px]"
                    >
                      <span className="truncate">Comenzar Ahora</span>
                      <ChevronRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                    </Button>
                  </Link>
                  <a href="#features">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 border-2 border-cuadrangular-cyan/50 hover:bg-cuadrangular-cyan/10 hover:border-cuadrangular-cyan transition-all duration-300 min-h-[48px] sm:min-h-[56px]"
                    >
                      <span className="truncate">Conocer Más</span>
                    </Button>
                  </a>
                </div>
                
                {/* Estadísticas rápidas */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 md:gap-6 lg:gap-8 pt-3 sm:pt-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                  {[
                    { value: "120+", label: "Canciones" },
                    { value: "12", label: "Músicos" },
                    { value: "52", label: "Servicios/año" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center flex-shrink-0">
                      <div className="text-lg sm:text-xl md:text-2xl font-display font-bold text-cuadrangular-purple">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Visual derecho - Composición artística */}
              <div className="relative order-1 lg:order-2 mb-8 lg:mb-0">
                {/* Versión móvil - simplificada */}
                <div className="lg:hidden flex justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-card to-muted p-1 shadow-glow-multi">
                          <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                            <img
                              src="/logo.png"
                              alt="Logo Cuadrangular"
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Símbolos del evangelio - versión móvil compacta */}
                    {GOSPEL_SYMBOLS.map((item, index) => {
                      const angle = (index * 90) - 45
                      const radius = 60
                      const x = Math.cos((angle * Math.PI) / 180) * radius
                      const y = Math.sin((angle * Math.PI) / 180) * radius
                      
                      return (
                        <div
                          key={index}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                          style={{ 
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                          }}
                        >
                          <div 
                            className={`w-10 h-10 sm:w-12 sm:h-12 ${item.color} rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer`}
                            title={item.title}
                          >
                            {item.symbol}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Versión desktop - completa */}
                <div className="hidden lg:block animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <div className="relative w-full aspect-square max-w-lg mx-auto">
                    {/* Círculo central con logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {/* Anillo exterior animado */}
                        <div className="absolute -inset-4 sm:-inset-8 rounded-full border-2 border-dashed border-cuadrangular-purple/30 animate-spin-slow" />
                        <div className="absolute -inset-8 sm:-inset-16 rounded-full border border-cuadrangular-cyan/20 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "30s" }} />
                        
                        {/* Logo central */}
                        <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-card to-muted p-1 shadow-glow-multi">
                          <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                            <img
                              src="/logo.png"
                              alt="Logo Cuadrangular"
                              className="w-24 h-24 sm:w-40 sm:h-40 object-cover rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Símbolos del evangelio orbitando */}
                    {GOSPEL_SYMBOLS.map((item, index) => {
                      const angle = (index * 90) - 45
                      const radius = 120
                      const x = Math.cos((angle * Math.PI) / 180) * radius
                      const y = Math.sin((angle * Math.PI) / 180) * radius
                      
                      return (
                        <div
                          key={index}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                          style={{ 
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                          }}
                        >
                          <div 
                            className={`w-12 h-12 sm:w-16 sm:h-16 ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer`}
                            title={item.title}
                          >
                            {item.symbol}
                          </div>
                        </div>
                      )
                    })}
                    
                    {/* Iconos flotantes */}
                    <div className="absolute top-0 right-0 w-10 h-10 sm:w-12 sm:h-12 bg-card rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg animate-float">
                      <Mic2 className="w-5 h-5 sm:w-6 sm:h-6 text-cuadrangular-red" />
                    </div>
                    <div className="absolute bottom-10 left-0 w-10 h-10 sm:w-12 sm:h-12 bg-card rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: "1s" }}>
                      <Guitar className="w-5 h-5 sm:w-6 sm:h-6 text-cuadrangular-cyan" />
                    </div>
                    <div className="absolute bottom-0 right-20 w-10 h-10 sm:w-12 sm:h-12 bg-card rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: "2s" }}>
                      <Music className="w-5 h-5 sm:w-6 sm:h-6 text-cuadrangular-purple" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator - oculto en móvil */}
          <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: "1s" }}>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Descubre más</span>
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-cuadrangular-purple rounded-full animate-bounce" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            EVANGELIO CUADRANGULAR SECTION
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-16 animate-fade-in-up">
              <span className="inline-block px-4 py-1.5 rounded-full bg-cuadrangular-yellow/20 text-cuadrangular-yellow text-sm font-semibold mb-4">
                Nuestra Fe
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                El Evangelio <span className="text-cuadrangular-purple">Cuadrangular</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Los cuatro pilares de nuestra fe que guían nuestro ministerio de alabanza
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {GOSPEL_SYMBOLS.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-border/50 hover:border-transparent transition-all duration-500 hover:shadow-glow-multi animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient border on hover */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cuadrangular-red via-cuadrangular-purple to-cuadrangular-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
                  <div className="absolute inset-[2px] rounded-xl sm:rounded-2xl bg-card -z-10" />
                  
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {item.symbol}
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-bold mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FEATURES SECTION
            ═══════════════════════════════════════════════════════════════════ */}
        <section id="features" className="py-24 relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-cuadrangular-cyan/20 text-cuadrangular-cyan text-sm font-semibold mb-4">
                Características
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Todo lo que <span className="text-cuadrangular-cyan">necesitas</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Herramientas diseñadas específicamente para la gestión de ministerios de alabanza
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {FEATURES.map((feature, index) => (
                <div
                  key={index}
                  className={`group relative bg-gradient-to-br ${feature.gradient} rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-border/50 hover:border-${feature.color}/50 transition-all duration-500 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-${feature.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">{feature.description}</p>
                  
                  <div className="mt-4 sm:mt-6">
                    <Link 
                      to="/login" 
                      className={`inline-flex items-center text-${feature.color} font-semibold hover:gap-3 gap-2 transition-all duration-300 text-sm sm:text-base`}
                    >
                      Explorar
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CTA FINAL
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-24 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-cuadrangular-purple/10 via-background to-cuadrangular-cyan/10" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cuadrangular-red/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cuadrangular-purple/20 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 sm:mb-6 leading-tight">
                ¿Listo para <span className="bg-gradient-to-r from-cuadrangular-red via-cuadrangular-purple to-cuadrangular-cyan bg-clip-text text-transparent">transformar</span> tu ministerio?
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-10 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Únete y lleva la organización de tu ministerio de alabanza al siguiente nivel.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <Link to="/login">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-cuadrangular-red to-cuadrangular-purple hover:opacity-90 text-white text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-7 shadow-glow-purple transition-all duration-300 hover:scale-105 min-h-[56px]"
                  >
                    <span className="truncate">Iniciar Sesión</span>
                    <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo y copyright */}
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-cuadrangular-purple/20"
              />
              <div>
                <span className="font-display font-bold">Rocka Eterna</span>
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Iglesia Cristiana Cuadrangular Soledad 2000
                </p>
              </div>
            </div>
            
            {/* Links */}
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-cuadrangular-purple transition-colors">
                Términos
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-cuadrangular-purple transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-cuadrangular-purple transition-colors">
                Contacto
              </a>
            </div>
            
            {/* Colores del evangelio como decoración */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cuadrangular-red" title="Salvación" />
              <div className="w-3 h-3 rounded-full bg-cuadrangular-cyan" title="Espíritu Santo" />
              <div className="w-3 h-3 rounded-full bg-cuadrangular-yellow" title="Sanidad" />
              <div className="w-3 h-3 rounded-full bg-cuadrangular-purple" title="Segunda Venida" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
