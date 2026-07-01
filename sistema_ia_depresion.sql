-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-06-2026 a las 20:32:23
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_ia_depresion`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `analisis_ia`
--

CREATE TABLE `analisis_ia` (
  `id` int(11) NOT NULL,
  `encuesta_id` int(11) NOT NULL,
  `tipo_analisis` varchar(191) NOT NULL,
  `resultado_analisis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`resultado_analisis`)),
  `nivel_riesgo_calculado` varchar(191) DEFAULT NULL,
  `recomendaciones` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`recomendaciones`)),
  `fecha_analisis` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `modelo_ia` varchar(191) NOT NULL DEFAULT 'gpt-4o'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bhs_respuestas`
--

CREATE TABLE `bhs_respuestas` (
  `id` int(11) NOT NULL,
  `encuesta_id` int(11) NOT NULL,
  `item_1` tinyint(1) NOT NULL,
  `item_2` tinyint(1) NOT NULL,
  `item_3` tinyint(1) NOT NULL,
  `item_4` tinyint(1) NOT NULL,
  `item_5` tinyint(1) NOT NULL,
  `item_6` tinyint(1) NOT NULL,
  `item_7` tinyint(1) NOT NULL,
  `item_8` tinyint(1) NOT NULL,
  `item_9` tinyint(1) NOT NULL,
  `item_10` tinyint(1) NOT NULL,
  `item_11` tinyint(1) NOT NULL,
  `item_12` tinyint(1) NOT NULL,
  `item_13` tinyint(1) NOT NULL,
  `item_14` tinyint(1) NOT NULL,
  `item_15` tinyint(1) NOT NULL,
  `item_16` tinyint(1) NOT NULL,
  `item_17` tinyint(1) NOT NULL,
  `item_18` tinyint(1) NOT NULL,
  `item_19` tinyint(1) NOT NULL,
  `item_20` tinyint(1) NOT NULL,
  `puntaje_total` int(11) NOT NULL DEFAULT 0,
  `nivel_riesgo` varchar(191) NOT NULL DEFAULT 'bajo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `bhs_respuestas`
--

INSERT INTO `bhs_respuestas` (`id`, `encuesta_id`, `item_1`, `item_2`, `item_3`, `item_4`, `item_5`, `item_6`, `item_7`, `item_8`, `item_9`, `item_10`, `item_11`, `item_12`, `item_13`, `item_14`, `item_15`, `item_16`, `item_17`, `item_18`, `item_19`, `item_20`, `puntaje_total`, `nivel_riesgo`) VALUES
(1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 7, 'bajo'),
(2, 2, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 9, 'bajo'),
(3, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 6, 'bajo'),
(4, 4, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 9, 'bajo'),
(5, 5, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 7, 'bajo'),
(6, 6, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 11, 'moderado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat_mensajes`
--

CREATE TABLE `chat_mensajes` (
  `id` int(11) NOT NULL,
  `sesion_id` int(11) NOT NULL,
  `rol` varchar(191) NOT NULL,
  `contenido` varchar(191) NOT NULL,
  `contexto_datos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`contexto_datos`)),
  `tokens_utilizados` int(11) DEFAULT NULL,
  `fecha_mensaje` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat_sesiones`
--

CREATE TABLE `chat_sesiones` (
  `id` int(11) NOT NULL,
  `encuesta_id` int(11) DEFAULT NULL,
  `fecha_inicio` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `fecha_fin` datetime(3) DEFAULT NULL,
  `total_mensajes` int(11) NOT NULL DEFAULT 0,
  `titulo` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cssrs_respuestas`
--

CREATE TABLE `cssrs_respuestas` (
  `id` int(11) NOT NULL,
  `encuesta_id` int(11) NOT NULL,
  `deseos_morir` tinyint(1) NOT NULL DEFAULT 0,
  `pensamientos_suicidas` tinyint(1) NOT NULL DEFAULT 0,
  `metodo_sin_plan` tinyint(1) NOT NULL DEFAULT 0,
  `intencion_sin_plan` tinyint(1) NOT NULL DEFAULT 0,
  `plan_especifico` tinyint(1) NOT NULL DEFAULT 0,
  `intencion_ejecutar` tinyint(1) NOT NULL DEFAULT 0,
  `intento_previo` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_ultimo_intento` datetime(3) DEFAULT NULL,
  `metodo_intento` varchar(191) DEFAULT NULL,
  `nivel_severidad` varchar(191) NOT NULL DEFAULT 'ideacion'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cssrs_respuestas`
--

INSERT INTO `cssrs_respuestas` (`id`, `encuesta_id`, `deseos_morir`, `pensamientos_suicidas`, `metodo_sin_plan`, `intencion_sin_plan`, `plan_especifico`, `intencion_ejecutar`, `intento_previo`, `fecha_ultimo_intento`, `metodo_intento`, `nivel_severidad`) VALUES
(1, 1, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, 'ideacion'),
(2, 2, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, 'ideacion'),
(3, 3, 1, 1, 0, 0, 0, 0, 0, NULL, NULL, 'ideacion'),
(4, 4, 1, 0, 0, 0, 0, 0, 1, NULL, NULL, 'intento_no_letal'),
(5, 5, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, 'ideacion'),
(6, 6, 0, 1, 0, 0, 0, 0, 0, NULL, NULL, 'ideacion');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dass21_respuestas`
--

CREATE TABLE `dass21_respuestas` (
  `id` int(11) NOT NULL,
  `encuesta_id` int(11) NOT NULL,
  `item_1` int(11) NOT NULL,
  `item_2` int(11) NOT NULL,
  `item_3` int(11) NOT NULL,
  `item_4` int(11) NOT NULL,
  `item_5` int(11) NOT NULL,
  `item_6` int(11) NOT NULL,
  `item_7` int(11) NOT NULL,
  `item_8` int(11) NOT NULL,
  `item_9` int(11) NOT NULL,
  `item_10` int(11) NOT NULL,
  `item_11` int(11) NOT NULL,
  `item_12` int(11) NOT NULL,
  `item_13` int(11) NOT NULL,
  `item_14` int(11) NOT NULL,
  `item_15` int(11) NOT NULL,
  `item_16` int(11) NOT NULL,
  `item_17` int(11) NOT NULL,
  `item_18` int(11) NOT NULL,
  `item_19` int(11) NOT NULL,
  `item_20` int(11) NOT NULL,
  `item_21` int(11) NOT NULL,
  `puntaje_estres` int(11) NOT NULL DEFAULT 0,
  `puntaje_ansiedad` int(11) NOT NULL DEFAULT 0,
  `puntaje_depresion` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `dass21_respuestas`
--

INSERT INTO `dass21_respuestas` (`id`, `encuesta_id`, `item_1`, `item_2`, `item_3`, `item_4`, `item_5`, `item_6`, `item_7`, `item_8`, `item_9`, `item_10`, `item_11`, `item_12`, `item_13`, `item_14`, `item_15`, `item_16`, `item_17`, `item_18`, `item_19`, `item_20`, `item_21`, `puntaje_estres`, `puntaje_ansiedad`, `puntaje_depresion`) VALUES
(1, 1, 3, 2, 1, 1, 3, 1, 0, 2, 1, 2, 2, 0, 3, 0, 0, 3, 1, 3, 1, 3, 2, 22, 16, 30),
(2, 2, 0, 3, 2, 3, 0, 3, 0, 1, 0, 2, 0, 2, 1, 3, 3, 0, 2, 0, 1, 3, 2, 18, 26, 18),
(3, 3, 0, 3, 1, 0, 2, 3, 3, 3, 3, 0, 1, 1, 2, 1, 0, 3, 2, 3, 0, 1, 0, 24, 20, 20),
(4, 4, 3, 2, 0, 0, 1, 2, 3, 1, 3, 3, 3, 1, 1, 3, 0, 0, 2, 2, 1, 1, 2, 30, 20, 18),
(5, 5, 3, 2, 1, 3, 0, 1, 2, 1, 3, 3, 2, 2, 0, 2, 0, 3, 3, 0, 1, 2, 3, 22, 26, 26),
(6, 6, 2, 3, 2, 3, 2, 3, 2, 3, 0, 2, 2, 2, 2, 0, 0, 3, 3, 0, 3, 3, 3, 24, 28, 34);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `encuestas`
--

CREATE TABLE `encuestas` (
  `id` int(11) NOT NULL,
  `fecha_creacion` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `edad` int(11) NOT NULL,
  `sexo` varchar(191) NOT NULL,
  `estado_civil` varchar(191) DEFAULT NULL,
  `nivel_educativo` varchar(191) DEFAULT NULL,
  `ocupacion` varchar(191) DEFAULT NULL,
  `ingreso_mensual` varchar(191) DEFAULT NULL,
  `zona_residencia` varchar(191) DEFAULT NULL,
  `estado_usuario` varchar(191) NOT NULL DEFAULT 'vivo',
  `causa_fallecimiento` varchar(191) DEFAULT NULL,
  `fallecimiento_voluntario` tinyint(1) DEFAULT NULL,
  `fecha_fallecimiento` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `encuestas`
--

INSERT INTO `encuestas` (`id`, `fecha_creacion`, `edad`, `sexo`, `estado_civil`, `nivel_educativo`, `ocupacion`, `ingreso_mensual`, `zona_residencia`, `estado_usuario`, `causa_fallecimiento`, `fallecimiento_voluntario`, `fecha_fallecimiento`, `created_at`) VALUES
(1, '2026-06-23 18:05:28.451', 22, 'femenino', 'soltero', 'universitario', 'estudiante', 'menos_1_smlv', 'urbana', 'vivo', NULL, NULL, NULL, '2026-06-23 18:05:28.451'),
(2, '2026-06-23 18:05:28.549', 35, 'masculino', 'casado', 'universitario', 'empleado', '2_4_smlv', 'urbana', 'vivo', NULL, NULL, NULL, '2026-06-23 18:05:28.549'),
(3, '2026-06-23 18:05:28.649', 17, 'femenino', 'soltero', 'secundaria', 'estudiante', 'menos_1_smlv', 'urbana', 'vivo', NULL, NULL, NULL, '2026-06-23 18:05:28.649'),
(4, '2026-06-23 18:05:28.699', 45, 'masculino', 'divorciado', 'tecnico', 'desempleado', 'sin_ingresos', 'rural', 'vivo', NULL, NULL, NULL, '2026-06-23 18:05:28.699'),
(5, '2026-06-23 18:05:28.749', 28, 'femenino', 'union_libre', 'universitario', 'empleado', '1_2_smlv', 'urbana', 'vivo', NULL, NULL, NULL, '2026-06-23 18:05:28.749'),
(6, '2026-06-23 18:11:06.447', 18, 'masculino', 'soltero', 'tecnico', '', 'menos_1_smlv', 'rural', 'vivo', NULL, NULL, NULL, '2026-06-23 18:11:06.447');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factores_psicologicos`
--

CREATE TABLE `factores_psicologicos` (
  `id` int(11) NOT NULL,
  `encuesta_id` int(11) NOT NULL,
  `erq_reevaluacion_cognitiva` int(11) DEFAULT NULL,
  `erq_supresion_expresiva` int(11) DEFAULT NULL,
  `impulsividad_motora` int(11) DEFAULT NULL,
  `impulsividad_no_planificada` int(11) DEFAULT NULL,
  `impulsividad_atencional` int(11) DEFAULT NULL,
  `perdida_familiar_reciente` tinyint(1) NOT NULL DEFAULT 0,
  `violencia_fisica` tinyint(1) NOT NULL DEFAULT 0,
  `violencia_psicologica` tinyint(1) NOT NULL DEFAULT 0,
  `abuso_sexual` tinyint(1) NOT NULL DEFAULT 0,
  `bullying` tinyint(1) NOT NULL DEFAULT 0,
  `desempleo_reciente` tinyint(1) NOT NULL DEFAULT 0,
  `rupture_pareja_reciente` tinyint(1) NOT NULL DEFAULT 0,
  `problema_legal_reciente` tinyint(1) NOT NULL DEFAULT 0,
  `tiene_red_apoyo` tinyint(1) NOT NULL DEFAULT 1,
  `percibe_vida_con_sentido` tinyint(1) NOT NULL DEFAULT 1,
  `ha_buscado_ayuda_profesional` tinyint(1) NOT NULL DEFAULT 0,
  `tipo_ayuda_profesional` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `factores_psicologicos`
--

INSERT INTO `factores_psicologicos` (`id`, `encuesta_id`, `erq_reevaluacion_cognitiva`, `erq_supresion_expresiva`, `impulsividad_motora`, `impulsividad_no_planificada`, `impulsividad_atencional`, `perdida_familiar_reciente`, `violencia_fisica`, `violencia_psicologica`, `abuso_sexual`, `bullying`, `desempleo_reciente`, `rupture_pareja_reciente`, `problema_legal_reciente`, `tiene_red_apoyo`, `percibe_vida_con_sentido`, `ha_buscado_ayuda_profesional`, `tipo_ayuda_profesional`) VALUES
(1, 1, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, NULL),
(2, 2, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, NULL),
(3, 3, NULL, NULL, NULL, NULL, NULL, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, NULL),
(4, 4, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, NULL),
(5, 5, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, NULL),
(6, 6, NULL, NULL, NULL, NULL, NULL, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factores_socioeconomicos`
--

CREATE TABLE `factores_socioeconomicos` (
  `id` int(11) NOT NULL,
  `encuesta_id` int(11) NOT NULL,
  `estado_laboral` varchar(191) DEFAULT NULL,
  `satisfaccion_laboral` int(11) DEFAULT NULL,
  `horas_trabajo_semanal` int(11) DEFAULT NULL,
  `estres_laboral` int(11) DEFAULT NULL,
  `nivel_deudas` varchar(191) DEFAULT NULL,
  `dificultad_economica` tinyint(1) DEFAULT NULL,
  `calidad_relaciones_familiares` int(11) DEFAULT NULL,
  `calidad_relaciones_pareja` int(11) DEFAULT NULL,
  `apoyo_social_percibido` int(11) DEFAULT NULL,
  `num_personas_confianza` int(11) DEFAULT NULL,
  `vive_solo` tinyint(1) DEFAULT NULL,
  `tipo_vivienda` varchar(191) DEFAULT NULL,
  `calidad_vivienda` int(11) DEFAULT NULL,
  `acceso_salud_mental` tinyint(1) DEFAULT NULL,
  `tipo_afiliacion_salud` varchar(191) DEFAULT NULL,
  `distancia_servicio_salud` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `factores_socioeconomicos`
--

INSERT INTO `factores_socioeconomicos` (`id`, `encuesta_id`, `estado_laboral`, `satisfaccion_laboral`, `horas_trabajo_semanal`, `estres_laboral`, `nivel_deudas`, `dificultad_economica`, `calidad_relaciones_familiares`, `calidad_relaciones_pareja`, `apoyo_social_percibido`, `num_personas_confianza`, `vive_solo`, `tipo_vivienda`, `calidad_vivienda`, `acceso_salud_mental`, `tipo_afiliacion_salud`, `distancia_servicio_salud`) VALUES
(1, 1, 'estudiante', 1, NULL, 3, 'sin_deudas', 0, NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL),
(2, 2, 'empleado', 3, NULL, 1, 'sin_deudas', 0, NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL),
(3, 3, 'estudiante', 5, NULL, 5, 'medio', 1, NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL),
(4, 4, 'estudiante', 2, NULL, 4, 'sin_deudas', 0, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL),
(5, 5, 'empleado', 4, NULL, 2, 'medio', 0, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL),
(6, 6, 'desempleado', 2, NULL, 5, 'muy_alto', 1, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_intentos`
--

CREATE TABLE `historial_intentos` (
  `id` int(11) NOT NULL,
  `encuesta_id` int(11) NOT NULL,
  `num_intentos_previos` int(11) NOT NULL DEFAULT 0,
  `primer_intento_edad` int(11) DEFAULT NULL,
  `ultimo_intento_fecha` datetime(3) DEFAULT NULL,
  `metodo_intento` varchar(191) DEFAULT NULL,
  `hospitalizacion_por_intento` tinyint(1) NOT NULL DEFAULT 0,
  `tratamiento_psiquiatrico_previo` tinyint(1) NOT NULL DEFAULT 0,
  `antecedentes_familiares_suicidio` tinyint(1) NOT NULL DEFAULT 0,
  `antecedentes_familiares_enfermedad_mental` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `historial_intentos`
--

INSERT INTO `historial_intentos` (`id`, `encuesta_id`, `num_intentos_previos`, `primer_intento_edad`, `ultimo_intento_fecha`, `metodo_intento`, `hospitalizacion_por_intento`, `tratamiento_psiquiatrico_previo`, `antecedentes_familiares_suicidio`, `antecedentes_familiares_enfermedad_mental`) VALUES
(1, 1, 0, NULL, NULL, NULL, 0, 0, 0, 0),
(2, 2, 0, NULL, NULL, NULL, 0, 0, 0, 0),
(3, 3, 0, NULL, NULL, NULL, 0, 1, 0, 1),
(4, 4, 1, NULL, NULL, NULL, 0, 0, 0, 0),
(5, 5, 0, NULL, NULL, NULL, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `phq9_respuestas`
--

CREATE TABLE `phq9_respuestas` (
  `id` int(11) NOT NULL,
  `encuesta_id` int(11) NOT NULL,
  `interes_actividades` int(11) NOT NULL,
  `estado_animo` int(11) NOT NULL,
  `sueno` int(11) NOT NULL,
  `energia` int(11) NOT NULL,
  `apetito` int(11) NOT NULL,
  `autoestima` int(11) NOT NULL,
  `concentracion` int(11) NOT NULL,
  `psicomotricidad` int(11) NOT NULL,
  `ideacion_suicida` int(11) NOT NULL,
  `dificultad_funcionamiento` int(11) DEFAULT NULL,
  `puntaje_total` int(11) NOT NULL DEFAULT 0,
  `nivel_gravedad` varchar(191) NOT NULL DEFAULT 'minimo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `phq9_respuestas`
--

INSERT INTO `phq9_respuestas` (`id`, `encuesta_id`, `interes_actividades`, `estado_animo`, `sueno`, `energia`, `apetito`, `autoestima`, `concentracion`, `psicomotricidad`, `ideacion_suicida`, `dificultad_funcionamiento`, `puntaje_total`, `nivel_gravedad`) VALUES
(1, 1, 0, 3, 1, 1, 2, 1, 3, 1, 0, 3, 0, 'leve'),
(2, 2, 1, 0, 2, 3, 3, 2, 2, 0, 1, 2, 0, 'leve'),
(3, 3, 1, 2, 1, 2, 2, 0, 0, 0, 2, 3, 0, 'leve'),
(4, 4, 0, 1, 2, 2, 2, 3, 3, 3, 1, 0, 0, 'leve'),
(5, 5, 1, 1, 2, 0, 3, 2, 1, 0, 0, 3, 0, 'leve'),
(6, 6, 2, 3, 3, 2, 2, 3, 3, 2, 2, NULL, 22, 'severo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rosenberg_respuestas`
--

CREATE TABLE `rosenberg_respuestas` (
  `id` int(11) NOT NULL,
  `encuesta_id` int(11) NOT NULL,
  `item1` int(11) NOT NULL,
  `item2` int(11) NOT NULL,
  `item3` int(11) NOT NULL,
  `item4` int(11) NOT NULL,
  `item5` int(11) NOT NULL,
  `item6` int(11) NOT NULL,
  `item7` int(11) NOT NULL,
  `item8` int(11) NOT NULL,
  `item9` int(11) NOT NULL,
  `item10` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `rosenberg_respuestas`
--

INSERT INTO `rosenberg_respuestas` (`id`, `encuesta_id`, `item1`, `item2`, `item3`, `item4`, `item5`, `item6`, `item7`, `item8`, `item9`, `item10`) VALUES
(1, 1, 4, 1, 4, 4, 4, 3, 3, 1, 3, 4),
(2, 2, 4, 2, 2, 1, 2, 1, 4, 2, 3, 1),
(3, 3, 2, 2, 1, 2, 2, 2, 1, 3, 4, 2),
(4, 4, 4, 2, 4, 1, 3, 3, 1, 1, 2, 3),
(5, 5, 3, 3, 4, 3, 2, 3, 1, 1, 4, 3),
(6, 6, 4, 2, 2, 4, 2, 2, 4, 3, 3, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salud_fisica`
--

CREATE TABLE `salud_fisica` (
  `id` int(11) NOT NULL,
  `encuesta_id` int(11) NOT NULL,
  `enfermedad_cronica` tinyint(1) NOT NULL DEFAULT 0,
  `tipo_enfermedad_cronica` varchar(191) DEFAULT NULL,
  `dolor_cronico` tinyint(1) NOT NULL DEFAULT 0,
  `tratamiento_medico_actual` tinyint(1) NOT NULL DEFAULT 0,
  `medicamentos_actuales` varchar(191) DEFAULT NULL,
  `calidad_sueno` int(11) NOT NULL DEFAULT 3,
  `horas_sueno_promedio` double DEFAULT NULL,
  `insomnio` tinyint(1) NOT NULL DEFAULT 0,
  `consume_alcohol` tinyint(1) NOT NULL DEFAULT 0,
  `frecuencia_alcohol` varchar(191) DEFAULT NULL,
  `consume_tabaco` tinyint(1) NOT NULL DEFAULT 0,
  `frecuencia_tabaco` varchar(191) DEFAULT NULL,
  `consume_drogas` tinyint(1) NOT NULL DEFAULT 0,
  `tipo_drogas` varchar(191) DEFAULT NULL,
  `frecuencia_drogas` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `salud_fisica`
--

INSERT INTO `salud_fisica` (`id`, `encuesta_id`, `enfermedad_cronica`, `tipo_enfermedad_cronica`, `dolor_cronico`, `tratamiento_medico_actual`, `medicamentos_actuales`, `calidad_sueno`, `horas_sueno_promedio`, `insomnio`, `consume_alcohol`, `frecuencia_alcohol`, `consume_tabaco`, `frecuencia_tabaco`, `consume_drogas`, `tipo_drogas`, `frecuencia_drogas`) VALUES
(1, 1, 0, NULL, 0, 0, NULL, 5, 7.129485548342787, 0, 0, 'nunca', 0, 'nunca', 0, NULL, NULL),
(2, 2, 0, NULL, 0, 0, NULL, 4, 6.605557183050007, 0, 0, 'nunca', 0, 'nunca', 0, NULL, NULL),
(3, 3, 0, NULL, 0, 0, NULL, 3, 6.39911761870271, 1, 0, 'nunca', 0, 'nunca', 0, NULL, NULL),
(4, 4, 0, NULL, 1, 0, NULL, 3, 8.65608412732303, 1, 1, 'frecuente', 1, 'moderado', 0, NULL, NULL),
(5, 5, 0, NULL, 0, 0, NULL, 2, 8.977864683779774, 0, 1, 'ocasional', 0, 'nunca', 0, NULL, NULL),
(6, 6, 1, NULL, 1, 0, NULL, 3, 5, 1, 0, 'nunca', 0, 'nunca', 0, '', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `analisis_ia`
--
ALTER TABLE `analisis_ia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `analisis_ia_encuesta_id_fkey` (`encuesta_id`);

--
-- Indices de la tabla `bhs_respuestas`
--
ALTER TABLE `bhs_respuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bhs_respuestas_encuesta_id_fkey` (`encuesta_id`);

--
-- Indices de la tabla `chat_mensajes`
--
ALTER TABLE `chat_mensajes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_mensajes_sesion_id_fkey` (`sesion_id`);

--
-- Indices de la tabla `chat_sesiones`
--
ALTER TABLE `chat_sesiones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_sesiones_encuesta_id_fkey` (`encuesta_id`);

--
-- Indices de la tabla `cssrs_respuestas`
--
ALTER TABLE `cssrs_respuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cssrs_respuestas_encuesta_id_fkey` (`encuesta_id`);

--
-- Indices de la tabla `dass21_respuestas`
--
ALTER TABLE `dass21_respuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dass21_respuestas_encuesta_id_fkey` (`encuesta_id`);

--
-- Indices de la tabla `encuestas`
--
ALTER TABLE `encuestas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `factores_psicologicos`
--
ALTER TABLE `factores_psicologicos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `factores_psicologicos_encuesta_id_key` (`encuesta_id`);

--
-- Indices de la tabla `factores_socioeconomicos`
--
ALTER TABLE `factores_socioeconomicos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `factores_socioeconomicos_encuesta_id_key` (`encuesta_id`);

--
-- Indices de la tabla `historial_intentos`
--
ALTER TABLE `historial_intentos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `historial_intentos_encuesta_id_key` (`encuesta_id`);

--
-- Indices de la tabla `phq9_respuestas`
--
ALTER TABLE `phq9_respuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `phq9_respuestas_encuesta_id_fkey` (`encuesta_id`);

--
-- Indices de la tabla `rosenberg_respuestas`
--
ALTER TABLE `rosenberg_respuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rosenberg_respuestas_encuesta_id_fkey` (`encuesta_id`);

--
-- Indices de la tabla `salud_fisica`
--
ALTER TABLE `salud_fisica`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `salud_fisica_encuesta_id_key` (`encuesta_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `analisis_ia`
--
ALTER TABLE `analisis_ia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `bhs_respuestas`
--
ALTER TABLE `bhs_respuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `chat_mensajes`
--
ALTER TABLE `chat_mensajes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `chat_sesiones`
--
ALTER TABLE `chat_sesiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cssrs_respuestas`
--
ALTER TABLE `cssrs_respuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `dass21_respuestas`
--
ALTER TABLE `dass21_respuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `encuestas`
--
ALTER TABLE `encuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `factores_psicologicos`
--
ALTER TABLE `factores_psicologicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `factores_socioeconomicos`
--
ALTER TABLE `factores_socioeconomicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `historial_intentos`
--
ALTER TABLE `historial_intentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `phq9_respuestas`
--
ALTER TABLE `phq9_respuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `rosenberg_respuestas`
--
ALTER TABLE `rosenberg_respuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `salud_fisica`
--
ALTER TABLE `salud_fisica`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `analisis_ia`
--
ALTER TABLE `analisis_ia`
  ADD CONSTRAINT `analisis_ia_encuesta_id_fkey` FOREIGN KEY (`encuesta_id`) REFERENCES `encuestas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `bhs_respuestas`
--
ALTER TABLE `bhs_respuestas`
  ADD CONSTRAINT `bhs_respuestas_encuesta_id_fkey` FOREIGN KEY (`encuesta_id`) REFERENCES `encuestas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `chat_mensajes`
--
ALTER TABLE `chat_mensajes`
  ADD CONSTRAINT `chat_mensajes_sesion_id_fkey` FOREIGN KEY (`sesion_id`) REFERENCES `chat_sesiones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `chat_sesiones`
--
ALTER TABLE `chat_sesiones`
  ADD CONSTRAINT `chat_sesiones_encuesta_id_fkey` FOREIGN KEY (`encuesta_id`) REFERENCES `encuestas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `cssrs_respuestas`
--
ALTER TABLE `cssrs_respuestas`
  ADD CONSTRAINT `cssrs_respuestas_encuesta_id_fkey` FOREIGN KEY (`encuesta_id`) REFERENCES `encuestas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `dass21_respuestas`
--
ALTER TABLE `dass21_respuestas`
  ADD CONSTRAINT `dass21_respuestas_encuesta_id_fkey` FOREIGN KEY (`encuesta_id`) REFERENCES `encuestas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `factores_psicologicos`
--
ALTER TABLE `factores_psicologicos`
  ADD CONSTRAINT `factores_psicologicos_encuesta_id_fkey` FOREIGN KEY (`encuesta_id`) REFERENCES `encuestas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `factores_socioeconomicos`
--
ALTER TABLE `factores_socioeconomicos`
  ADD CONSTRAINT `factores_socioeconomicos_encuesta_id_fkey` FOREIGN KEY (`encuesta_id`) REFERENCES `encuestas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `historial_intentos`
--
ALTER TABLE `historial_intentos`
  ADD CONSTRAINT `historial_intentos_encuesta_id_fkey` FOREIGN KEY (`encuesta_id`) REFERENCES `encuestas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `phq9_respuestas`
--
ALTER TABLE `phq9_respuestas`
  ADD CONSTRAINT `phq9_respuestas_encuesta_id_fkey` FOREIGN KEY (`encuesta_id`) REFERENCES `encuestas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `rosenberg_respuestas`
--
ALTER TABLE `rosenberg_respuestas`
  ADD CONSTRAINT `rosenberg_respuestas_encuesta_id_fkey` FOREIGN KEY (`encuesta_id`) REFERENCES `encuestas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `salud_fisica`
--
ALTER TABLE `salud_fisica`
  ADD CONSTRAINT `salud_fisica_encuesta_id_fkey` FOREIGN KEY (`encuesta_id`) REFERENCES `encuestas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
