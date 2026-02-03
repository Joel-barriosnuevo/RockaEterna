// ═══════════════════════════════════════════════════════════════════════════
// UTILIDADES PARA COMPARTIR PROGRAMACIONES
// ═══════════════════════════════════════════════════════════════════════════

export interface MiembroProgramacion {
  nombre: string
  apellido: string
  rol: string
}

export interface ProgramacionParaCompartir {
  fecha: Date
  tipo?: string
  miembros: MiembroProgramacion[]
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERAR MENSAJE DE PROGRAMACIÓN
// ═══════════════════════════════════════════════════════════════════════════
export function generarMensajeProgramacion(programaciones: ProgramacionParaCompartir[]): string {
  const mensajes = programaciones.map(prog => {
    const fecha = prog.fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).toUpperCase()

    // Agrupar miembros por rol
    const miembrosPorRol: Record<string, string[]> = {}
    
    prog.miembros.forEach(m => {
      const rol = m.rol
      if (!miembrosPorRol[rol]) {
        miembrosPorRol[rol] = []
      }
      miembrosPorRol[rol].push(`${m.nombre} ${m.apellido}`.trim())
    })

    // Separar roles vocales de instrumentales
    const rolesVocales = ['Voz líder', 'Voz Líder', 'Coro', 'Corista', 'Vocal']
    const rolesInstrumentales = ['Piano', 'Guitarra', 'Bajo', 'Batería', 'Teclado', 'Pads', 'Piano / Pads']

    let mensaje = `*${fecha}*\n\n`

    // Primero los vocales
    Object.entries(miembrosPorRol).forEach(([rol, nombres]) => {
      const esVocal = rolesVocales.some(rv => rol.toLowerCase().includes(rv.toLowerCase()))
      if (esVocal) {
        mensaje += `*${rol}:*\n`
        nombres.forEach(nombre => {
          mensaje += `${nombre}\n`
        })
        mensaje += '\n'
      }
    })

    // Luego los instrumentales (en línea)
    Object.entries(miembrosPorRol).forEach(([rol, nombres]) => {
      const esVocal = rolesVocales.some(rv => rol.toLowerCase().includes(rv.toLowerCase()))
      if (!esVocal) {
        mensaje += `*${rol}:* ${nombres.join(', ')}\n`
      }
    })

    return mensaje.trim()
  })

  return mensajes.join('\n\n───────────────\n\n')
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPARTIR POR WHATSAPP
// ═══════════════════════════════════════════════════════════════════════════
export function compartirWhatsApp(mensaje: string): void {
  const textoEncoded = encodeURIComponent(mensaje)
  const url = `https://wa.me/?text=${textoEncoded}`
  window.open(url, '_blank')
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPARTIR POR EMAIL
// ═══════════════════════════════════════════════════════════════════════════
export function compartirEmail(asunto: string, mensaje: string, destinatarios?: string[]): void {
  const to = destinatarios?.join(',') || ''
  const subject = encodeURIComponent(asunto)
  const body = encodeURIComponent(mensaje.replace(/\*/g, '')) // Quitar asteriscos de formato
  const url = `mailto:${to}?subject=${subject}&body=${body}`
  window.location.href = url
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERAR MENSAJE SIMPLE (para una sola programación)
// ═══════════════════════════════════════════════════════════════════════════
export function generarMensajeSimple(
  fecha: Date,
  miembros: { nombre: string; apellido: string; rol: string }[]
): string {
  return generarMensajeProgramacion([{ fecha, miembros }])
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERAR NOTIFICACIÓN PERSONAL PARA UN MIEMBRO
// ═══════════════════════════════════════════════════════════════════════════
export interface ProgramacionMiembro {
  fecha: Date
  rol: string
  tipo?: string
}

export function generarNotificacionPersonal(
  nombreMiembro: string,
  programaciones: ProgramacionMiembro[],
  appUrl?: string
): string {
  if (programaciones.length === 0) {
    return `Hola ${nombreMiembro}, no tienes programaciones asignadas por el momento.`
  }

  let mensaje = `¡Hola ${nombreMiembro}! 🎵\n\n`
  mensaje += `Tienes *${programaciones.length}* programación${programaciones.length > 1 ? 'es' : ''} asignada${programaciones.length > 1 ? 's' : ''}:\n\n`

  programaciones.forEach((prog, index) => {
    const fechaFormateada = prog.fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
    
    mensaje += `📅 *${fechaFormateada.toUpperCase()}*\n`
    mensaje += `   🎤 Rol: ${prog.rol}\n`
    if (prog.tipo) {
      mensaje += `   ⛪ ${prog.tipo}\n`
    }
    if (index < programaciones.length - 1) {
      mensaje += '\n'
    }
  })

  mensaje += '\n\n'
  
  // Añadir enlace a la app
  const url = appUrl || window.location.origin
  mensaje += `🔗 *Ver programaciones:*\n${url}/dashboard/programaciones\n\n`
  
  mensaje += '¡Dios te bendiga! 🙏'

  return mensaje
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICAR MIEMBRO POR WHATSAPP (con número de teléfono)
// ═══════════════════════════════════════════════════════════════════════════
export function notificarMiembroWhatsApp(
  telefono: string,
  mensaje: string
): void {
  // Limpiar número de teléfono (quitar espacios, guiones, etc.)
  const numeroLimpio = telefono.replace(/[\s\-\(\)]/g, '')
  const textoEncoded = encodeURIComponent(mensaje)
  const url = `https://wa.me/${numeroLimpio}?text=${textoEncoded}`
  window.open(url, '_blank')
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICAR MIEMBRO POR EMAIL
// ═══════════════════════════════════════════════════════════════════════════
export function notificarMiembroEmail(
  email: string,
  nombreMiembro: string,
  mensaje: string
): void {
  const subject = encodeURIComponent(`Rocka Eterna - Tus programaciones, ${nombreMiembro}`)
  const body = encodeURIComponent(mensaje.replace(/\*/g, ''))
  const url = `mailto:${email}?subject=${subject}&body=${body}`
  window.location.href = url
}
