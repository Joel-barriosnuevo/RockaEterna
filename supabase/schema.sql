-- ═══════════════════════════════════════════════════════════════════════════════════
-- ROCKA ETERNA - ESQUEMA DE BASE DE DATOS PARA SUPABASE
-- ═══════════════════════════════════════════════════════════════════════════════════
-- 
-- Instrucciones:
-- 1. Ve a tu proyecto en Supabase (https://supabase.com/dashboard)
-- 2. Navega a SQL Editor
-- 3. Copia y pega todo este archivo
-- 4. Ejecuta el script
--
-- ═══════════════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════════════
-- TABLA: usuarios
-- Perfil extendido de usuarios (conectado con auth.users de Supabase)
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.usuarios (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           VARCHAR(255) NOT NULL,
    nombre          VARCHAR(100) NOT NULL,
    apellido        VARCHAR(100) NOT NULL,
    avatar_url      TEXT,
    tema            VARCHAR(20) DEFAULT 'system',
    is_admin        BOOLEAN DEFAULT FALSE,
    activo          BOOLEAN DEFAULT TRUE,
    ultimo_login    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Usuarios pueden ver su propio perfil"
    ON public.usuarios FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
    ON public.usuarios FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins pueden ver todos los usuarios"
    ON public.usuarios FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- ═══════════════════════════════════════════════════════════════════════════════════
-- TABLA: roles
-- Roles musicales disponibles
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.roles (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(50) UNIQUE NOT NULL,
    descripcion     TEXT,
    icono           VARCHAR(50),
    orden           INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver los roles
CREATE POLICY "Cualquiera puede ver los roles"
    ON public.roles FOR SELECT
    TO authenticated
    USING (TRUE);

-- Solo admins pueden modificar roles
CREATE POLICY "Solo admins pueden modificar roles"
    ON public.roles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- Insertar roles iniciales
INSERT INTO public.roles (nombre, icono, orden) VALUES
    ('Voz Líder', 'mic', 1),
    ('Coros', 'users', 2),
    ('Piano', 'piano', 3),
    ('Guitarra', 'guitar', 4),
    ('Bajo', 'disc', 5),
    ('Batería', 'drum', 6),
    ('Teclado', 'keyboard', 7),
    ('Sonido', 'volume-2', 8),
    ('Proyección', 'monitor', 9)
ON CONFLICT (nombre) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════════
-- TABLA: miembros
-- Miembros del equipo de alabanza
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.miembros (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      UUID UNIQUE REFERENCES public.usuarios(id) ON DELETE SET NULL,
    nombre          VARCHAR(100) NOT NULL,
    apellido        VARCHAR(100) NOT NULL,
    email           VARCHAR(255),
    telefono        VARCHAR(20),
    rol_principal_id INTEGER REFERENCES public.roles(id),
    activo          BOOLEAN DEFAULT TRUE,
    foto_url        TEXT,
    notas           TEXT,
    fecha_ingreso   DATE DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.miembros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden ver miembros"
    ON public.miembros FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Usuarios autenticados pueden crear miembros"
    ON public.miembros FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

CREATE POLICY "Usuarios autenticados pueden actualizar miembros"
    ON public.miembros FOR UPDATE
    TO authenticated
    USING (TRUE);

CREATE POLICY "Solo admins pueden eliminar miembros"
    ON public.miembros FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- ═══════════════════════════════════════════════════════════════════════════════════
-- TABLA: miembro_roles (muchos a muchos)
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.miembro_roles (
    miembro_id      UUID REFERENCES public.miembros(id) ON DELETE CASCADE,
    rol_id          INTEGER REFERENCES public.roles(id) ON DELETE CASCADE,
    es_principal    BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (miembro_id, rol_id)
);

ALTER TABLE public.miembro_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden gestionar miembro_roles"
    ON public.miembro_roles FOR ALL
    TO authenticated
    USING (TRUE);

-- ═══════════════════════════════════════════════════════════════════════════════════
-- TABLA: categorias
-- Categorías de canciones
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.categorias (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(50) UNIQUE NOT NULL,
    color           VARCHAR(20) DEFAULT '#8B5CF6',
    descripcion     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede ver categorías"
    ON public.categorias FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Usuarios autenticados pueden gestionar categorías"
    ON public.categorias FOR ALL
    TO authenticated
    USING (TRUE);

-- Insertar categorías iniciales
INSERT INTO public.categorias (nombre, color) VALUES
    ('Alabanza', '#EF4444'),
    ('Adoración', '#00D4FF'),
    ('Himnos', '#FBBF24'),
    ('Especial', '#8B5CF6')
ON CONFLICT (nombre) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════════
-- TABLA: canciones
-- Repertorio musical
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.canciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          VARCHAR(200) NOT NULL,
    autor           VARCHAR(200),
    categoria_id    INTEGER REFERENCES public.categorias(id),
    tono            VARCHAR(10),
    bpm             INTEGER,
    duracion        INTEGER,
    letra           TEXT,
    acordes         TEXT,
    notas           TEXT,
    url_audio       TEXT,
    url_video       TEXT,
    url_charts      TEXT,
    veces_usada     INTEGER DEFAULT 0,
    ultima_vez_usada DATE,
    activa          BOOLEAN DEFAULT TRUE,
    created_by      UUID REFERENCES public.usuarios(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.canciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden ver canciones"
    ON public.canciones FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Usuarios autenticados pueden crear canciones"
    ON public.canciones FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

CREATE POLICY "Usuarios autenticados pueden actualizar canciones"
    ON public.canciones FOR UPDATE
    TO authenticated
    USING (TRUE);

CREATE POLICY "Solo admins pueden eliminar canciones"
    ON public.canciones FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- Índices para búsqueda
CREATE INDEX IF NOT EXISTS idx_canciones_nombre ON public.canciones(nombre);
CREATE INDEX IF NOT EXISTS idx_canciones_autor ON public.canciones(autor);
CREATE INDEX IF NOT EXISTS idx_canciones_categoria ON public.canciones(categoria_id);

-- ═══════════════════════════════════════════════════════════════════════════════════
-- TABLA: tipos_servicio
-- Tipos de servicios
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.tipos_servicio (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    descripcion     TEXT,
    hora_defecto    TIME,
    color           VARCHAR(20) DEFAULT '#8B5CF6',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tipos_servicio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede ver tipos de servicio"
    ON public.tipos_servicio FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Solo admins pueden gestionar tipos de servicio"
    ON public.tipos_servicio FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- Insertar tipos iniciales
INSERT INTO public.tipos_servicio (nombre, hora_defecto, color) VALUES
    ('Servicio Principal', '09:00', '#EF4444'),
    ('Servicio de Oración', '19:00', '#00D4FF'),
    ('Servicio de Jóvenes', '18:00', '#FBBF24'),
    ('Evento Especial', '10:00', '#8B5CF6')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════════
-- TABLA: programaciones
-- Programaciones de servicios
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.programaciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha           DATE NOT NULL,
    hora            TIME NOT NULL,
    tipo_id         INTEGER REFERENCES public.tipos_servicio(id),
    estado          VARCHAR(20) DEFAULT 'borrador',
    notas           TEXT,
    tema_servicio   VARCHAR(200),
    created_by      UUID REFERENCES public.usuarios(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.programaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden ver programaciones"
    ON public.programaciones FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Usuarios autenticados pueden crear programaciones"
    ON public.programaciones FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

CREATE POLICY "Usuarios autenticados pueden actualizar programaciones"
    ON public.programaciones FOR UPDATE
    TO authenticated
    USING (TRUE);

CREATE POLICY "Solo admins pueden eliminar programaciones"
    ON public.programaciones FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

CREATE INDEX IF NOT EXISTS idx_programaciones_fecha ON public.programaciones(fecha);
CREATE INDEX IF NOT EXISTS idx_programaciones_estado ON public.programaciones(estado);

-- ═══════════════════════════════════════════════════════════════════════════════════
-- TABLA: programacion_canciones
-- Canciones asignadas a cada programación
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.programacion_canciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    programacion_id UUID NOT NULL REFERENCES public.programaciones(id) ON DELETE CASCADE,
    cancion_id      UUID NOT NULL REFERENCES public.canciones(id) ON DELETE CASCADE,
    orden           INTEGER NOT NULL,
    tono_usado      VARCHAR(10),
    notas           TEXT,
    UNIQUE(programacion_id, cancion_id)
);

ALTER TABLE public.programacion_canciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden gestionar programacion_canciones"
    ON public.programacion_canciones FOR ALL
    TO authenticated
    USING (TRUE);

-- ═══════════════════════════════════════════════════════════════════════════════════
-- TABLA: programacion_miembros
-- Miembros asignados a cada programación
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.programacion_miembros (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    programacion_id UUID NOT NULL REFERENCES public.programaciones(id) ON DELETE CASCADE,
    miembro_id      UUID NOT NULL REFERENCES public.miembros(id) ON DELETE CASCADE,
    rol_id          INTEGER REFERENCES public.roles(id),
    confirmado      BOOLEAN DEFAULT FALSE,
    notas           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(programacion_id, miembro_id, rol_id)
);

ALTER TABLE public.programacion_miembros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden gestionar programacion_miembros"
    ON public.programacion_miembros FOR ALL
    TO authenticated
    USING (TRUE);

-- ═══════════════════════════════════════════════════════════════════════════════════
-- TABLA: notificaciones
-- Sistema de notificaciones
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.notificaciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    tipo            VARCHAR(50) NOT NULL,
    titulo          VARCHAR(200) NOT NULL,
    descripcion     TEXT,
    link            TEXT,
    leida           BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus propias notificaciones"
    ON public.notificaciones FOR SELECT
    USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus propias notificaciones"
    ON public.notificaciones FOR UPDATE
    USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar sus propias notificaciones"
    ON public.notificaciones FOR DELETE
    USING (auth.uid() = usuario_id);

CREATE POLICY "Sistema puede crear notificaciones"
    ON public.notificaciones FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON public.notificaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON public.notificaciones(leida);

-- ═══════════════════════════════════════════════════════════════════════════════════
-- TABLA: preferencias_usuario
-- Configuraciones de cada usuario
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.preferencias_usuario (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      UUID UNIQUE NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    notif_email     BOOLEAN DEFAULT TRUE,
    notif_push      BOOLEAN DEFAULT TRUE,
    notif_programaciones BOOLEAN DEFAULT TRUE,
    notif_canciones BOOLEAN DEFAULT TRUE,
    notif_equipo    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.preferencias_usuario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus preferencias"
    ON public.preferencias_usuario FOR SELECT
    USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus preferencias"
    ON public.preferencias_usuario FOR UPDATE
    USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden crear sus preferencias"
    ON public.preferencias_usuario FOR INSERT
    WITH CHECK (auth.uid() = usuario_id);

-- ═══════════════════════════════════════════════════════════════════════════════════
-- TABLA: historial_canciones
-- Historial de uso de canciones
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.historial_canciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cancion_id      UUID NOT NULL REFERENCES public.canciones(id) ON DELETE CASCADE,
    programacion_id UUID NOT NULL REFERENCES public.programaciones(id) ON DELETE CASCADE,
    fecha_uso       DATE NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.historial_canciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden ver historial"
    ON public.historial_canciones FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Usuarios autenticados pueden crear historial"
    ON public.historial_canciones FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

-- ═══════════════════════════════════════════════════════════════════════════════════
-- FUNCIONES Y TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════════════

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER set_updated_at_usuarios
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_miembros
    BEFORE UPDATE ON public.miembros
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_canciones
    BEFORE UPDATE ON public.canciones
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_programaciones
    BEFORE UPDATE ON public.programaciones
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_preferencias
    BEFORE UPDATE ON public.preferencias_usuario
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════════════
-- FUNCIÓN: Crear perfil de usuario automáticamente al registrarse
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.usuarios (id, email, nombre, apellido)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario'),
        COALESCE(NEW.raw_user_meta_data->>'apellido', 'Nuevo')
    );
    
    -- Crear preferencias por defecto
    INSERT INTO public.preferencias_usuario (usuario_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para nuevos usuarios
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════════════════════════
-- FUNCIÓN: Actualizar contador de uso de canciones
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.increment_song_usage()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.canciones
    SET 
        veces_usada = veces_usada + 1,
        ultima_vez_usada = NEW.fecha_uso
    WHERE id = NEW.cancion_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_historial_insert
    AFTER INSERT ON public.historial_canciones
    FOR EACH ROW EXECUTE FUNCTION public.increment_song_usage();

-- ═══════════════════════════════════════════════════════════════════════════════════
-- VISTA: Estadísticas del dashboard
-- ═══════════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW public.v_estadisticas AS
SELECT 
    (SELECT COUNT(*) FROM public.canciones WHERE activa = TRUE) as total_canciones,
    (SELECT COUNT(*) FROM public.programaciones WHERE fecha >= CURRENT_DATE) as programaciones_futuras,
    (SELECT COUNT(*) FROM public.miembros WHERE activo = TRUE) as miembros_activos,
    (SELECT COUNT(*) FROM public.programaciones 
     WHERE DATE_TRUNC('month', fecha) = DATE_TRUNC('month', CURRENT_DATE)) as programaciones_mes;

-- ═══════════════════════════════════════════════════════════════════════════════════
-- DATOS DE EJEMPLO (OPCIONAL - Comentar si no se necesitan)
-- ═══════════════════════════════════════════════════════════════════════════════════

-- Canciones de ejemplo
INSERT INTO public.canciones (nombre, autor, categoria_id, tono, bpm) VALUES
    ('Grande y Fuerte', 'Miel San Marcos', 1, 'G', 130),
    ('Dios Incomparable', 'Generación 12', 2, 'D', 72),
    ('Tu Amor No Se Rinde', 'Hillsong', 2, 'C', 68),
    ('Poderoso Para Salvar', 'Hillsong', 2, 'A', 76),
    ('Agnus Dei', 'Michael W. Smith', 2, 'E', 66),
    ('Roca Eterna', 'Marcos Witt', 1, 'G', 128),
    ('Digno Es El Señor', 'Marcos Witt', 2, 'D', 70),
    ('Al Que Está Sentado', 'Marcos Brunet', 2, 'B', 65)
ON CONFLICT DO NOTHING;

-- Miembros de ejemplo
INSERT INTO public.miembros (nombre, apellido, email, telefono, rol_principal_id, activo) VALUES
    ('Carlos', 'Pérez', 'carlos@example.com', '+57 300 123 4567', 1, TRUE),
    ('María', 'Rodríguez', 'maria@example.com', '+57 300 234 5678', 3, TRUE),
    ('Juan', 'Gómez', 'juan@example.com', '+57 300 345 6789', 6, TRUE),
    ('Ana', 'Martínez', 'ana@example.com', '+57 300 456 7890', 2, TRUE),
    ('Pedro', 'Sánchez', 'pedro@example.com', '+57 300 567 8901', 5, FALSE),
    ('Lucía', 'Fernández', 'lucia@example.com', '+57 300 678 9012', 4, TRUE)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════════
-- FIN DEL SCRIPT
-- ═══════════════════════════════════════════════════════════════════════════════════
