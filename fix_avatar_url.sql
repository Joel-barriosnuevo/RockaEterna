-- Solución 1: Si avatar_url está guardado como texto JSON
UPDATE usuarios 
SET avatar_url = avatar_url::json->>'url' 
WHERE avatar_url IS NOT NULL 
AND avatar_url::json ? 'url';

-- Solución 2: Verificar primero el tipo de dato
SELECT 
    id,
    nombre,
    avatar_url,
    pg_typeof(avatar_url) as data_type
FROM usuarios 
WHERE avatar_url IS NOT NULL 
LIMIT 5;

-- Solución 3: Si avatar_url es texto que empieza con '{"url":'
UPDATE usuarios 
SET avatar_url = 
    CASE 
        WHEN avatar_url LIKE '{"url":%' THEN
            regexp_replace(avatar_url, '\{"url":"([^"]*)".*', '\1')
        ELSE avatar_url
    END
WHERE avatar_url IS NOT NULL 
AND avatar_url LIKE '{"url":%';

-- Verificación después de la actualización
SELECT 
    id,
    nombre,
    avatar_url,
    pg_typeof(avatar_url) as data_type
FROM usuarios 
WHERE avatar_url IS NOT NULL 
LIMIT 5;
