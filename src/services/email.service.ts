// ═══════════════════════════════════════════════════════════════════════════
// SERVICIO DE EMAIL CON RESEND (via Supabase Edge Function)
// ═══════════════════════════════════════════════════════════════════════════

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

interface ProgramacionEmail {
  fecha: Date
  tipo: string
  rol: string
}

// ═══════════════════════════════════════════════════════════════════════════
// ENVIAR EMAIL (via Edge Function)
// ═══════════════════════════════════════════════════════════════════════════
export async function enviarEmail(options: EmailOptions): Promise<boolean> {
  if (!SUPABASE_URL) {
    console.error('No hay URL de Supabase configurada')
    return false
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      console.error('Error enviando email:', data.error || data)
      return false
    }

    console.log('Email enviado exitosamente')
    return true
  } catch (error) {
    console.error('Error enviando email:', error)
    return false
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERAR HTML DE NOTIFICACIÓN DE PROGRAMACIÓN
// ═══════════════════════════════════════════════════════════════════════════
export function generarEmailProgramacion(
  nombreMiembro: string,
  programaciones: ProgramacionEmail[],
  appUrl: string
): { html: string; text: string } {
  const fechasHtml = programaciones.map(prog => {
    const fechaFormateada = prog.fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
    return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <strong style="color: #EAB308;">${fechaFormateada.toUpperCase()}</strong>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${prog.tipo}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <span style="background: linear-gradient(135deg, #EF4444, #8B5CF6); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
            ${prog.rol}
          </span>
        </td>
      </tr>
    `
  }).join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #EF4444 0%, #8B5CF6 50%, #06B6D4 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎵 Rocka Eterna</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Equipo de Alabanza</p>
        </div>
        
        <!-- Content -->
        <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">¡Hola ${nombreMiembro}! 👋</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Tienes <strong style="color: #EAB308;">${programaciones.length}</strong> programación${programaciones.length > 1 ? 'es' : ''} asignada${programaciones.length > 1 ? 's' : ''}:
          </p>
          
          <!-- Tabla de programaciones -->
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f8f8f8;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #EAB308;">Fecha</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #EAB308;">Servicio</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #EAB308;">Tu Rol</th>
              </tr>
            </thead>
            <tbody>
              ${fechasHtml}
            </tbody>
          </table>
          
          <!-- Botón -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${appUrl}/dashboard/programaciones" 
               style="display: inline-block; background: linear-gradient(135deg, #EAB308, #EF4444); color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Ver Programaciones
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center; margin-bottom: 0;">
            ¡Dios te bendiga! 🙏
          </p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>Rocka Eterna - Iglesia del Evangelio Cuadrangular</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
¡Hola ${nombreMiembro}!

Tienes ${programaciones.length} programación${programaciones.length > 1 ? 'es' : ''} asignada${programaciones.length > 1 ? 's' : ''}:

${programaciones.map(prog => {
  const fechaFormateada = prog.fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
  return `📅 ${fechaFormateada.toUpperCase()}\n   Servicio: ${prog.tipo}\n   Rol: ${prog.rol}`
}).join('\n\n')}

Ver programaciones: ${appUrl}/dashboard/programaciones

¡Dios te bendiga! 🙏
  `.trim()

  return { html, text }
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICAR MIEMBRO POR EMAIL
// ═══════════════════════════════════════════════════════════════════════════
export async function notificarMiembroPorEmail(
  email: string,
  nombreMiembro: string,
  programaciones: ProgramacionEmail[]
): Promise<boolean> {
  const appUrl = window.location.origin
  const { html, text } = generarEmailProgramacion(nombreMiembro, programaciones, appUrl)
  
  return enviarEmail({
    to: email,
    subject: `🎵 ${nombreMiembro}, tienes ${programaciones.length} programación${programaciones.length > 1 ? 'es' : ''} asignada${programaciones.length > 1 ? 's' : ''}`,
    html,
    text,
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICAR MÚLTIPLES MIEMBROS
// ═══════════════════════════════════════════════════════════════════════════
export async function notificarMiembrosDeProgramacion(
  miembros: Array<{
    email: string
    nombre: string
    programaciones: ProgramacionEmail[]
  }>
): Promise<{ exitosos: number; fallidos: number }> {
  let exitosos = 0
  let fallidos = 0

  for (const miembro of miembros) {
    if (!miembro.email) {
      fallidos++
      continue
    }

    const resultado = await notificarMiembroPorEmail(
      miembro.email,
      miembro.nombre,
      miembro.programaciones
    )

    if (resultado) {
      exitosos++
    } else {
      fallidos++
    }

    // Pequeña pausa para no saturar la API
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return { exitosos, fallidos }
}
