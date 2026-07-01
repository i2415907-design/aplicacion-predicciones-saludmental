-- PostgreSQL dump converted from MySQL
-- Converted using convert_mysql_to_postgres.py

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-07-2026 a las 19:08:21
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

--
-- Base de datos: `sistema_ia_depresion`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `analisis_ia`
--

CREATE TABLE "analisis_ia" (
    "id" SERIAL,
    "encuesta_id" INTEGER NOT NULL,
    "tipo_analisis" varchar(191) NOT NULL,
    "resultado_analisis" JSONB,
    "nivel_riesgo_calculado" varchar(191) DEFAULT NULL,
    "recomendaciones" JSONB,
    "fecha_analisis" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modelo_ia" varchar(191) NOT NULL DEFAULT 'gpt-4o'
);

CREATE TABLE "bhs_respuestas" (
    "id" SERIAL,
    "encuesta_id" INTEGER NOT NULL,
    "item_1" BOOLEAN NOT NULL,
    "item_2" BOOLEAN NOT NULL,
    "item_3" BOOLEAN NOT NULL,
    "item_4" BOOLEAN NOT NULL,
    "item_5" BOOLEAN NOT NULL,
    "item_6" BOOLEAN NOT NULL,
    "item_7" BOOLEAN NOT NULL,
    "item_8" BOOLEAN NOT NULL,
    "item_9" BOOLEAN NOT NULL,
    "item_10" BOOLEAN NOT NULL,
    "item_11" BOOLEAN NOT NULL,
    "item_12" BOOLEAN NOT NULL,
    "item_13" BOOLEAN NOT NULL,
    "item_14" BOOLEAN NOT NULL,
    "item_15" BOOLEAN NOT NULL,
    "item_16" BOOLEAN NOT NULL,
    "item_17" BOOLEAN NOT NULL,
    "item_18" BOOLEAN NOT NULL,
    "item_19" BOOLEAN NOT NULL,
    "item_20" BOOLEAN NOT NULL,
    "puntaje_total" INTEGER NOT NULL DEFAULT 0,
    "nivel_riesgo" varchar(191) NOT NULL DEFAULT 'bajo'
);

CREATE TABLE "chat_mensajes" (
    "id" SERIAL,
    "sesion_id" INTEGER NOT NULL,
    "rol" varchar(191) NOT NULL,
    "contenido" varchar(191) NOT NULL,
    "contexto_datos" JSONB,
    "tokens_utilizados" INTEGER DEFAULT NULL,
    "fecha_mensaje" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "chat_sesiones" (
    "id" SERIAL,
    "encuesta_id" INTEGER DEFAULT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) DEFAULT NULL,
    "total_mensajes" INTEGER NOT NULL DEFAULT 0,
    "titulo" varchar(191) DEFAULT NULL
);

CREATE TABLE "cssrs_respuestas" (
    "id" SERIAL,
    "encuesta_id" INTEGER NOT NULL,
    "deseos_morir" BOOLEAN NOT NULL DEFAULT false,
    "pensamientos_suicidas" BOOLEAN NOT NULL DEFAULT false,
    "metodo_sin_plan" BOOLEAN NOT NULL DEFAULT false,
    "intencion_sin_plan" BOOLEAN NOT NULL DEFAULT false,
    "plan_especifico" BOOLEAN NOT NULL DEFAULT false,
    "intencion_ejecutar" BOOLEAN NOT NULL DEFAULT false,
    "intento_previo" BOOLEAN NOT NULL DEFAULT false,
    "fecha_ultimo_intento" TIMESTAMP(3) DEFAULT NULL,
    "metodo_intento" varchar(191) DEFAULT NULL,
    "nivel_severidad" varchar(191) NOT NULL DEFAULT 'ideacion'
);

CREATE TABLE "dass21_respuestas" (
    "id" SERIAL,
    "encuesta_id" INTEGER NOT NULL,
    "item_1" INTEGER NOT NULL,
    "item_2" INTEGER NOT NULL,
    "item_3" INTEGER NOT NULL,
    "item_4" INTEGER NOT NULL,
    "item_5" INTEGER NOT NULL,
    "item_6" INTEGER NOT NULL,
    "item_7" INTEGER NOT NULL,
    "item_8" INTEGER NOT NULL,
    "item_9" INTEGER NOT NULL,
    "item_10" INTEGER NOT NULL,
    "item_11" INTEGER NOT NULL,
    "item_12" INTEGER NOT NULL,
    "item_13" INTEGER NOT NULL,
    "item_14" INTEGER NOT NULL,
    "item_15" INTEGER NOT NULL,
    "item_16" INTEGER NOT NULL,
    "item_17" INTEGER NOT NULL,
    "item_18" INTEGER NOT NULL,
    "item_19" INTEGER NOT NULL,
    "item_20" INTEGER NOT NULL,
    "item_21" INTEGER NOT NULL,
    "puntaje_estres" INTEGER NOT NULL DEFAULT 0,
    "puntaje_ansiedad" INTEGER NOT NULL DEFAULT 0,
    "puntaje_depresion" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "encuestas" (
    "id" SERIAL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edad" INTEGER NOT NULL,
    "sexo" varchar(191) NOT NULL,
    "estado_civil" varchar(191) DEFAULT NULL,
    "nivel_educativo" varchar(191) DEFAULT NULL,
    "ocupacion" varchar(191) DEFAULT NULL,
    "ingreso_mensual" varchar(191) DEFAULT NULL,
    "zona_residencia" varchar(191) DEFAULT NULL,
    "estado_usuario" varchar(191) NOT NULL DEFAULT 'vivo',
    "causa_fallecimiento" varchar(191) DEFAULT NULL,
    "fallecimiento_voluntario" BOOLEAN DEFAULT NULL,
    "fecha_fallecimiento" TIMESTAMP(3) DEFAULT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "apellido" varchar(191) DEFAULT NULL,
    "nombre" varchar(191) DEFAULT NULL,
    "usuario_id" INTEGER DEFAULT NULL
);

CREATE TABLE "factores_psicologicos" (
    "id" SERIAL,
    "encuesta_id" INTEGER NOT NULL,
    "erq_reevaluacion_cognitiva" INTEGER DEFAULT NULL,
    "erq_supresion_expresiva" INTEGER DEFAULT NULL,
    "impulsividad_motora" INTEGER DEFAULT NULL,
    "impulsividad_no_planificada" INTEGER DEFAULT NULL,
    "impulsividad_atencional" INTEGER DEFAULT NULL,
    "perdida_familiar_reciente" BOOLEAN NOT NULL DEFAULT false,
    "violencia_fisica" BOOLEAN NOT NULL DEFAULT false,
    "violencia_psicologica" BOOLEAN NOT NULL DEFAULT false,
    "abuso_sexual" BOOLEAN NOT NULL DEFAULT false,
    "bullying" BOOLEAN NOT NULL DEFAULT false,
    "desempleo_reciente" BOOLEAN NOT NULL DEFAULT false,
    "rupture_pareja_reciente" BOOLEAN NOT NULL DEFAULT false,
    "problema_legal_reciente" BOOLEAN NOT NULL DEFAULT false,
    "tiene_red_apoyo" BOOLEAN NOT NULL DEFAULT true,
    "percibe_vida_con_sentido" BOOLEAN NOT NULL DEFAULT true,
    "ha_buscado_ayuda_profesional" BOOLEAN NOT NULL DEFAULT false,
    "tipo_ayuda_profesional" varchar(191) DEFAULT NULL
);

CREATE TABLE "factores_socioeconomicos" (
    "id" SERIAL,
    "encuesta_id" INTEGER NOT NULL,
    "estado_laboral" varchar(191) DEFAULT NULL,
    "satisfaccion_laboral" INTEGER DEFAULT NULL,
    "horas_trabajo_semanal" INTEGER DEFAULT NULL,
    "estres_laboral" INTEGER DEFAULT NULL,
    "nivel_deudas" varchar(191) DEFAULT NULL,
    "dificultad_economica" BOOLEAN DEFAULT NULL,
    "calidad_relaciones_familiares" INTEGER DEFAULT NULL,
    "calidad_relaciones_pareja" INTEGER DEFAULT NULL,
    "apoyo_social_percibido" INTEGER DEFAULT NULL,
    "num_personas_confianza" INTEGER DEFAULT NULL,
    "vive_solo" BOOLEAN DEFAULT NULL,
    "tipo_vivienda" varchar(191) DEFAULT NULL,
    "calidad_vivienda" INTEGER DEFAULT NULL,
    "acceso_salud_mental" BOOLEAN DEFAULT NULL,
    "tipo_afiliacion_salud" varchar(191) DEFAULT NULL,
    "distancia_servicio_salud" varchar(191) DEFAULT NULL
);

CREATE TABLE "historial_intentos" (
    "id" SERIAL,
    "encuesta_id" INTEGER NOT NULL,
    "num_intentos_previos" INTEGER NOT NULL DEFAULT 0,
    "primer_intento_edad" INTEGER DEFAULT NULL,
    "ultimo_intento_fecha" TIMESTAMP(3) DEFAULT NULL,
    "metodo_intento" varchar(191) DEFAULT NULL,
    "hospitalizacion_por_intento" BOOLEAN NOT NULL DEFAULT false,
    "tratamiento_psiquiatrico_previo" BOOLEAN NOT NULL DEFAULT false,
    "antecedentes_familiares_suicidio" BOOLEAN NOT NULL DEFAULT false,
    "antecedentes_familiares_enfermedad_mental" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "notificaciones" (
    "id" SERIAL,
    "encuesta_id" INTEGER NOT NULL,
    "tipo_riesgo" varchar(191) NOT NULL,
    "titulo" varchar(191) NOT NULL,
    "descripcion" varchar(191) NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "accion_requerida" varchar(191) DEFAULT NULL,
    "respuesta" varchar(191) DEFAULT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_lectura" TIMESTAMP(3) DEFAULT NULL,
    "fecha_respuesta" TIMESTAMP(3) DEFAULT NULL
);

CREATE TABLE "phq9_respuestas" (
    "id" SERIAL,
    "encuesta_id" INTEGER NOT NULL,
    "interes_actividades" INTEGER NOT NULL,
    "estado_animo" INTEGER NOT NULL,
    "sueno" INTEGER NOT NULL,
    "energia" INTEGER NOT NULL,
    "apetito" INTEGER NOT NULL,
    "autoestima" INTEGER NOT NULL,
    "concentracion" INTEGER NOT NULL,
    "psicomotricidad" INTEGER NOT NULL,
    "ideacion_suicida" INTEGER NOT NULL,
    "dificultad_funcionamiento" INTEGER DEFAULT NULL,
    "puntaje_total" INTEGER NOT NULL DEFAULT 0,
    "nivel_gravedad" varchar(191) NOT NULL DEFAULT 'minimo'
);

CREATE TABLE "rosenberg_respuestas" (
    "id" SERIAL,
    "encuesta_id" INTEGER NOT NULL,
    "item1" INTEGER NOT NULL,
    "item2" INTEGER NOT NULL,
    "item3" INTEGER NOT NULL,
    "item4" INTEGER NOT NULL,
    "item5" INTEGER NOT NULL,
    "item6" INTEGER NOT NULL,
    "item7" INTEGER NOT NULL,
    "item8" INTEGER NOT NULL,
    "item9" INTEGER NOT NULL,
    "item10" INTEGER NOT NULL
);

CREATE TABLE "salud_fisica" (
    "id" SERIAL,
    "encuesta_id" INTEGER NOT NULL,
    "enfermedad_cronica" BOOLEAN NOT NULL DEFAULT false,
    "tipo_enfermedad_cronica" varchar(191) DEFAULT NULL,
    "dolor_cronico" BOOLEAN NOT NULL DEFAULT false,
    "tratamiento_medico_actual" BOOLEAN NOT NULL DEFAULT false,
    "medicamentos_actuales" varchar(191) DEFAULT NULL,
    "calidad_sueno" INTEGER NOT NULL DEFAULT 3,
    "horas_sueno_promedio" DOUBLE PRECISION DEFAULT NULL,
    "insomnio" BOOLEAN NOT NULL DEFAULT false,
    "consume_alcohol" BOOLEAN NOT NULL DEFAULT false,
    "frecuencia_alcohol" varchar(191) DEFAULT NULL,
    "consume_tabaco" BOOLEAN NOT NULL DEFAULT false,
    "frecuencia_tabaco" varchar(191) DEFAULT NULL,
    "consume_drogas" BOOLEAN NOT NULL DEFAULT false,
    "tipo_drogas" varchar(191) DEFAULT NULL,
    "frecuencia_drogas" varchar(191) DEFAULT NULL
);

CREATE TABLE "usuarios" (
    "id" SERIAL,
    "alias" varchar(191) NOT NULL,
    "password" varchar(191) NOT NULL,
    "tipo" varchar(191) NOT NULL DEFAULT 'usuario',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
