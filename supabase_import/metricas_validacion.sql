-- ============================================================
-- SCRIPT SQL: Métricas de Validación
-- Base de datos: PostgreSQL (Supabase)
-- Proyecto: Sistema de BI e IA para Prevención de Depresión
-- ============================================================
-- INSTRUCCIONES:
-- 1. Copiar y pegar este script en el SQL Editor de Supabase
-- 2. Ejecutar el script completo
-- 3. Ejecutar `npx prisma db push` para sincronizar el schema
-- ============================================================

-- ============================================================
-- TABLA 1: sesiones_encuesta
-- Propósito: Rastrear cada intento de encuesta (incluso si no se completa)
-- Permite calcular: tasa de finalización, tiempo promedio, pasos abandonados
-- ============================================================

CREATE TABLE IF NOT EXISTS sesiones_encuesta (
  id              SERIAL PRIMARY KEY,
  inicio_en       TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  ultimo_paso     INTEGER DEFAULT 0 NOT NULL,
  completada      BOOLEAN DEFAULT FALSE NOT NULL,
  tiempo_segundos INTEGER,
  encuesta_id     INTEGER UNIQUE,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- FK a encuestas: SetNull para conservar métrica si se borra la encuesta
  CONSTRAINT fk_sesiones_encuesta_encuesta
    FOREIGN KEY (encuesta_id)
    REFERENCES encuestas(id)
    ON DELETE SET NULL
);

-- Índices para consultas frecuentes del dashboard
CREATE INDEX IF NOT EXISTS idx_sesiones_encuesta_completada ON sesiones_encuesta(completada);
CREATE INDEX IF NOT EXISTS idx_sesiones_encuesta_inicio_en ON sesiones_encuesta(inicio_en);

-- Comentario de tabla
COMMENT ON TABLE sesiones_encuesta IS 'Rastrea cada intento de encuesta para métricas de validación (completion rate, tiempo, pasos)';

-- ============================================================
-- ROW LEVEL SECURITY (RLS) para sesiones_encuesta
-- ============================================================

ALTER TABLE sesiones_encuesta ENABLE ROW LEVEL SECURITY;

-- service_role: acceso completo (para API routes)
CREATE POLICY "service_role_full_access sesiones"
  ON sesiones_encuesta
  USING ((auth.role() = 'service_role'::text));

-- authenticated: acceso de lectura (para dashboard admin)
CREATE POLICY "authenticated_read sesiones"
  ON sesiones_encuesta
  FOR SELECT
  USING ((auth.role() = 'authenticated'::text));

-- anon: acceso de lectura (para métricas públicas si se necesita)
CREATE POLICY "anon_read sesiones"
  ON sesiones_encuesta
  FOR SELECT
  USING ((auth.role() = 'anon'::text));

-- ============================================================
-- COLUMNA 1: satisfaccion en tabla encuestas
-- Propósito: Guardar la satisfacción del usuario (1-5) después de completar
-- Nullable: el usuario puede omitir la encuesta de satisfacción
-- ============================================================

ALTER TABLE encuestas 
ADD COLUMN IF NOT EXISTS satisfaccion INTEGER DEFAULT NULL;

-- Restricción: solo valores 1-5 o NULL
ALTER TABLE encuestas 
ADD CONSTRAINT chk_satisfaccion_range 
CHECK (satisfaccion IS NULL OR (satisfaccion >= 1 AND satisfaccion <= 5));

-- Comentario de columna
COMMENT ON COLUMN encuestas.satisfaccion IS 'Satisfacción del usuario con la evaluación (1-5). NULL si no respondió.';

-- ============================================================
-- VERIFICACIÓN
-- ============================================================

-- Verificar que la tabla se creó correctamente
SELECT 
  table_name, 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'sesiones_encuesta'
ORDER BY ordinal_position;

-- Verificar que la columna satisfaccion se agregó
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'encuestas' 
  AND column_name = 'satisfaccion';
