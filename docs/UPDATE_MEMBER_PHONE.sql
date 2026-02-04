-- ═══════════════════════════════════════════════════════════════════════════
-- ACTUALIZAR TELÉFONO DE MIEMBROS EXISTENTES
-- Para miembros que no tienen teléfono asignado
-- ═══════════════════════════════════════════════════════════════════════════

-- Opción 1: Actualizar un miembro específico (Joel)
UPDATE miembros 
SET telefono = '+57 300 123 4567' 
WHERE nombre = 'Joel' 
AND apellido = 'Barriosnuevo Martinez';

-- Opción 2: Actualizar desde la tabla usuarios si el usuario tiene teléfono
UPDATE miembros m
SET telefono = u.telefono
FROM usuarios u
WHERE m.usuario_id = u.id 
AND u.telefono IS NOT NULL 
AND m.telefono IS NULL;

-- Verificar los cambios
SELECT id, nombre, apellido, email, telefono 
FROM miembros 
WHERE nombre = 'Joel' 
AND apellido = 'Barriosnuevo Martinez';

-- ═══════════════════════════════════════════════════════════════════════════
-- LISTO! El teléfono ahora debería aparecer en la tarjeta del miembro
-- ═══════════════════════════════════════════════════════════════════════════
