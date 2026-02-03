// ═══════════════════════════════════════════════════════════════════════════
// TIPOS DE BASE DE DATOS - SUPABASE
// Generados para el proyecto Rocka Eterna
// ═══════════════════════════════════════════════════════════════════════════

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          nombre: string
          apellido: string
          avatar_url: string | null
          tema: string
          is_admin: boolean
          activo: boolean
          ultimo_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nombre: string
          apellido: string
          avatar_url?: string | null
          tema?: string
          is_admin?: boolean
          activo?: boolean
          ultimo_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nombre?: string
          apellido?: string
          avatar_url?: string | null
          tema?: string
          is_admin?: boolean
          activo?: boolean
          ultimo_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      roles: {
        Row: {
          id: number
          nombre: string
          descripcion: string | null
          icono: string | null
          orden: number
          created_at: string
        }
        Insert: {
          id?: number
          nombre: string
          descripcion?: string | null
          icono?: string | null
          orden?: number
          created_at?: string
        }
        Update: {
          id?: number
          nombre?: string
          descripcion?: string | null
          icono?: string | null
          orden?: number
          created_at?: string
        }
      }
      miembros: {
        Row: {
          id: string
          usuario_id: string | null
          nombre: string
          apellido: string
          email: string | null
          telefono: string | null
          rol_principal_id: number | null
          activo: boolean
          foto_url: string | null
          notas: string | null
          fecha_ingreso: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          usuario_id?: string | null
          nombre: string
          apellido: string
          email?: string | null
          telefono?: string | null
          rol_principal_id?: number | null
          activo?: boolean
          foto_url?: string | null
          notas?: string | null
          fecha_ingreso?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          usuario_id?: string | null
          nombre?: string
          apellido?: string
          email?: string | null
          telefono?: string | null
          rol_principal_id?: number | null
          activo?: boolean
          foto_url?: string | null
          notas?: string | null
          fecha_ingreso?: string
          created_at?: string
          updated_at?: string
        }
      }
      miembro_roles: {
        Row: {
          miembro_id: string
          rol_id: number
          es_principal: boolean
        }
        Insert: {
          miembro_id: string
          rol_id: number
          es_principal?: boolean
        }
        Update: {
          miembro_id?: string
          rol_id?: number
          es_principal?: boolean
        }
      }
      categorias: {
        Row: {
          id: number
          nombre: string
          color: string
          descripcion: string | null
          created_at: string
        }
        Insert: {
          id?: number
          nombre: string
          color?: string
          descripcion?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          nombre?: string
          color?: string
          descripcion?: string | null
          created_at?: string
        }
      }
      canciones: {
        Row: {
          id: string
          nombre: string
          autor: string | null
          categoria_id: number | null
          tono: string | null
          bpm: number | null
          duracion: number | null
          letra: string | null
          acordes: string | null
          notas: string | null
          url_audio: string | null
          url_video: string | null
          url_charts: string | null
          veces_usada: number
          ultima_vez_usada: string | null
          activa: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          autor?: string | null
          categoria_id?: number | null
          tono?: string | null
          bpm?: number | null
          duracion?: number | null
          letra?: string | null
          acordes?: string | null
          notas?: string | null
          url_audio?: string | null
          url_video?: string | null
          url_charts?: string | null
          veces_usada?: number
          ultima_vez_usada?: string | null
          activa?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          autor?: string | null
          categoria_id?: number | null
          tono?: string | null
          bpm?: number | null
          duracion?: number | null
          letra?: string | null
          acordes?: string | null
          notas?: string | null
          url_audio?: string | null
          url_video?: string | null
          url_charts?: string | null
          veces_usada?: number
          ultima_vez_usada?: string | null
          activa?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tipos_servicio: {
        Row: {
          id: number
          nombre: string
          descripcion: string | null
          hora_defecto: string | null
          color: string
          created_at: string
        }
        Insert: {
          id?: number
          nombre: string
          descripcion?: string | null
          hora_defecto?: string | null
          color?: string
          created_at?: string
        }
        Update: {
          id?: number
          nombre?: string
          descripcion?: string | null
          hora_defecto?: string | null
          color?: string
          created_at?: string
        }
      }
      programaciones: {
        Row: {
          id: string
          fecha: string
          hora: string
          tipo_id: number | null
          estado: string
          notas: string | null
          tema_servicio: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fecha: string
          hora: string
          tipo_id?: number | null
          estado?: string
          notas?: string | null
          tema_servicio?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fecha?: string
          hora?: string
          tipo_id?: number | null
          estado?: string
          notas?: string | null
          tema_servicio?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      programacion_canciones: {
        Row: {
          id: string
          programacion_id: string
          cancion_id: string
          orden: number
          tono_usado: string | null
          notas: string | null
        }
        Insert: {
          id?: string
          programacion_id: string
          cancion_id: string
          orden: number
          tono_usado?: string | null
          notas?: string | null
        }
        Update: {
          id?: string
          programacion_id?: string
          cancion_id?: string
          orden?: number
          tono_usado?: string | null
          notas?: string | null
        }
      }
      programacion_miembros: {
        Row: {
          id: string
          programacion_id: string
          miembro_id: string
          rol_id: number | null
          confirmado: boolean
          notas: string | null
          created_at: string
        }
        Insert: {
          id?: string
          programacion_id: string
          miembro_id: string
          rol_id?: number | null
          confirmado?: boolean
          notas?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          programacion_id?: string
          miembro_id?: string
          rol_id?: number | null
          confirmado?: boolean
          notas?: string | null
          created_at?: string
        }
      }
      notificaciones: {
        Row: {
          id: string
          usuario_id: string
          tipo: string
          titulo: string
          descripcion: string | null
          link: string | null
          leida: boolean
          created_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          tipo: string
          titulo: string
          descripcion?: string | null
          link?: string | null
          leida?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          usuario_id?: string
          tipo?: string
          titulo?: string
          descripcion?: string | null
          link?: string | null
          leida?: boolean
          created_at?: string
        }
      }
      preferencias_usuario: {
        Row: {
          id: string
          usuario_id: string
          notif_email: boolean
          notif_push: boolean
          notif_programaciones: boolean
          notif_canciones: boolean
          notif_equipo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          notif_email?: boolean
          notif_push?: boolean
          notif_programaciones?: boolean
          notif_canciones?: boolean
          notif_equipo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          usuario_id?: string
          notif_email?: boolean
          notif_push?: boolean
          notif_programaciones?: boolean
          notif_canciones?: boolean
          notif_equipo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      historial_canciones: {
        Row: {
          id: string
          cancion_id: string
          programacion_id: string
          fecha_uso: string
          created_at: string
        }
        Insert: {
          id?: string
          cancion_id: string
          programacion_id: string
          fecha_uso: string
          created_at?: string
        }
        Update: {
          id?: string
          cancion_id?: string
          programacion_id?: string
          fecha_uso?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS AUXILIARES PARA USO EN LA APP
// ═══════════════════════════════════════════════════════════════════════════

export type Usuario = Database['public']['Tables']['usuarios']['Row']
export type Rol = Database['public']['Tables']['roles']['Row']
export type Miembro = Database['public']['Tables']['miembros']['Row']
export type Categoria = Database['public']['Tables']['categorias']['Row']
export type Cancion = Database['public']['Tables']['canciones']['Row']
export type TipoServicio = Database['public']['Tables']['tipos_servicio']['Row']
export type Programacion = Database['public']['Tables']['programaciones']['Row']
export type ProgramacionCancion = Database['public']['Tables']['programacion_canciones']['Row']
export type ProgramacionMiembro = Database['public']['Tables']['programacion_miembros']['Row']
export type Notificacion = Database['public']['Tables']['notificaciones']['Row']
export type PreferenciasUsuario = Database['public']['Tables']['preferencias_usuario']['Row']

// Tipos con relaciones
export type MiembroConRol = Miembro & {
  rol: Rol | null
}

export type CancionConCategoria = Cancion & {
  categoria: Categoria | null
}

export type ProgramacionCompleta = Programacion & {
  tipo_servicio: TipoServicio | null
  canciones: (ProgramacionCancion & { cancion: Cancion })[]
  miembros: (ProgramacionMiembro & { miembro: Miembro; rol: Rol | null })[]
}

// Tipos para insertar
export type NuevoMiembro = Database['public']['Tables']['miembros']['Insert']
export type NuevaCancion = Database['public']['Tables']['canciones']['Insert']
export type NuevaProgramacion = Database['public']['Tables']['programaciones']['Insert']
export type NuevaNotificacion = Database['public']['Tables']['notificaciones']['Insert']

// Tipos para actualizar
export type ActualizarMiembro = Database['public']['Tables']['miembros']['Update']
export type ActualizarCancion = Database['public']['Tables']['canciones']['Update']
export type ActualizarProgramacion = Database['public']['Tables']['programaciones']['Update']
