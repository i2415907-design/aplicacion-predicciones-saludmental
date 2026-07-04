-- ============================================================
-- SCRIPT SQL: Nuevas tablas para el Sistema de Salud Mental IA
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- Tabla 1: Categorías de archivado de casos
-- Permite al admin crear categorías personalizadas para organizar casos
CREATE TABLE IF NOT EXISTS categorias_casos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion VARCHAR(255),
  color VARCHAR(7) DEFAULT '#6B7280', -- hex color para UI
  icono VARCHAR(50) DEFAULT 'folder', -- nombre del icono
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla 2: Casos archivados
-- Relaciona encuestas con categorías, permite notas del admin
CREATE TABLE IF NOT EXISTS casos_archivados (
  id SERIAL PRIMARY KEY,
  encuesta_id INTEGER NOT NULL REFERENCES encuestas(id) ON DELETE CASCADE,
  categoria_id INTEGER NOT NULL REFERENCES categorias_casos(id) ON DELETE CASCADE,
  notas TEXT,
  archivado_por VARCHAR(191), -- alias del admin que archivó
  fecha_archivo TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(encuesta_id, categoria_id) -- una encuesta no puede estar dos veces en la misma categoría
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_casos_archivados_encuesta ON casos_archivados(encuesta_id);
CREATE INDEX IF NOT EXISTS idx_casos_archivados_categoria ON casos_archivados(categoria_id);

-- ============================================================
-- Categorías por defecto
-- ============================================================
INSERT INTO categorias_casos (nombre, descripcion, color, icono) VALUES
  ('Caso Especial', 'Casos que requieren atención especial o seguimiento prioritario', '#EF4444', 'star'),
  ('Seguimiento', 'Casos en proceso de seguimiento clínico', '#F59E0B', 'clock'),
  ('Estabilizado', 'Pacientes que han mostrado mejoría y están estables', '#10B981', 'check-circle'),
  ('Derivado', 'Pacientes derivados a servicios externos', '#3B82F6', 'external-link'),
  ('Cerrado', 'Casos cerrados o finalizados', '#6B7280', 'archive')
ON CONFLICT (nombre) DO NOTHING;

-- ============================================================
-- Permisos RLS (Row Level Security) para Supabase
-- ============================================================
ALTER TABLE categorias_casos ENABLE ROW LEVEL SECURITY;
ALTER TABLE casos_archivados ENABLE ROW LEVEL SECURITY;

-- Permitir acceso completo a service_role (para la API)
CREATE POLICY "service_role_full_access categorias" ON categorias_casos
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_full_access casos" ON casos_archivados
  FOR ALL USING (auth.role() = 'service_role');

-- Permitir lectura a usuarios autenticados
CREATE POLICY "authenticated_read categorias" ON categorias_casos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_read casos" ON casos_archivados
  FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir lectura anónima (para encuestas públicas)
CREATE POLICY "anon_read categorias" ON categorias_casos
  FOR SELECT USING (auth.role() = 'anon');

CREATE POLICY "anon_read casos" ON casos_archivados
  FOR SELECT USING (auth.role() = 'anon');
