-- Consulta para arreglar avatar_url cuando está guardado como text con JSON
UPDATE usuarios 
SET avatar_url = avatar_url::json->>'url' 
WHERE avatar_url IS NOT NULL 
AND avatar_url LIKE '{"url":%';

-- Verificación después de la actualización
SELECT 
    id,
    nombre,
    avatar_url,
    pg_typeof(avatar_url) as data_type,
    LENGTH(avatar_url) as url_length
FROM usuarios 
WHERE avatar_url IS NOT NULL;
