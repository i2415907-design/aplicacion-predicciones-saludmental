--
-- PostgreSQL database dump
--

\restrict xsfpNtxxhD4jGjwf74cNqkcBX08KAMF2c65k8mmWQti0aBriU8i85QcqX7TYjyL

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-04 11:47:39

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 12 (class 2615 OID 17589)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 273 (class 1259 OID 17591)
-- Name: analisis_ia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analisis_ia (
    id integer NOT NULL,
    encuesta_id integer NOT NULL,
    tipo_analisis character varying(191) NOT NULL,
    resultado_analisis jsonb,
    nivel_riesgo_calculado character varying(191) DEFAULT NULL::character varying,
    recomendaciones jsonb,
    fecha_analisis timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modelo_ia character varying(191) DEFAULT 'gpt-4o'::character varying NOT NULL
);


ALTER TABLE public.analisis_ia OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 17590)
-- Name: analisis_ia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.analisis_ia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.analisis_ia_id_seq OWNER TO postgres;

--
-- TOC entry 3863 (class 0 OID 0)
-- Dependencies: 272
-- Name: analisis_ia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.analisis_ia_id_seq OWNED BY public.analisis_ia.id;


--
-- TOC entry 275 (class 1259 OID 17601)
-- Name: bhs_respuestas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bhs_respuestas (
    id integer NOT NULL,
    encuesta_id integer NOT NULL,
    item_1 boolean NOT NULL,
    item_2 boolean NOT NULL,
    item_3 boolean NOT NULL,
    item_4 boolean NOT NULL,
    item_5 boolean NOT NULL,
    item_6 boolean NOT NULL,
    item_7 boolean NOT NULL,
    item_8 boolean NOT NULL,
    item_9 boolean NOT NULL,
    item_10 boolean NOT NULL,
    item_11 boolean NOT NULL,
    item_12 boolean NOT NULL,
    item_13 boolean NOT NULL,
    item_14 boolean NOT NULL,
    item_15 boolean NOT NULL,
    item_16 boolean NOT NULL,
    item_17 boolean NOT NULL,
    item_18 boolean NOT NULL,
    item_19 boolean NOT NULL,
    item_20 boolean NOT NULL,
    puntaje_total integer DEFAULT 0 NOT NULL,
    nivel_riesgo character varying(191) DEFAULT 'bajo'::character varying NOT NULL
);


ALTER TABLE public.bhs_respuestas OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 17600)
-- Name: bhs_respuestas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bhs_respuestas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bhs_respuestas_id_seq OWNER TO postgres;

--
-- TOC entry 3864 (class 0 OID 0)
-- Dependencies: 274
-- Name: bhs_respuestas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bhs_respuestas_id_seq OWNED BY public.bhs_respuestas.id;


--
-- TOC entry 277 (class 1259 OID 17608)
-- Name: chat_mensajes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_mensajes (
    id integer NOT NULL,
    sesion_id integer NOT NULL,
    rol character varying(191) NOT NULL,
    contenido character varying(191) NOT NULL,
    contexto_datos jsonb,
    tokens_utilizados integer,
    fecha_mensaje timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.chat_mensajes OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 17607)
-- Name: chat_mensajes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_mensajes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_mensajes_id_seq OWNER TO postgres;

--
-- TOC entry 3865 (class 0 OID 0)
-- Dependencies: 276
-- Name: chat_mensajes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_mensajes_id_seq OWNED BY public.chat_mensajes.id;


--
-- TOC entry 279 (class 1259 OID 17616)
-- Name: chat_sesiones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_sesiones (
    id integer NOT NULL,
    encuesta_id integer,
    fecha_inicio timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_fin timestamp(3) without time zone DEFAULT NULL::timestamp without time zone,
    total_mensajes integer DEFAULT 0 NOT NULL,
    titulo character varying(191) DEFAULT NULL::character varying
);


ALTER TABLE public.chat_sesiones OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 17615)
-- Name: chat_sesiones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_sesiones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_sesiones_id_seq OWNER TO postgres;

--
-- TOC entry 3866 (class 0 OID 0)
-- Dependencies: 278
-- Name: chat_sesiones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_sesiones_id_seq OWNED BY public.chat_sesiones.id;


--
-- TOC entry 281 (class 1259 OID 17625)
-- Name: cssrs_respuestas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cssrs_respuestas (
    id integer NOT NULL,
    encuesta_id integer NOT NULL,
    deseos_morir boolean DEFAULT false NOT NULL,
    pensamientos_suicidas boolean DEFAULT false NOT NULL,
    metodo_sin_plan boolean DEFAULT false NOT NULL,
    intencion_sin_plan boolean DEFAULT false NOT NULL,
    plan_especifico boolean DEFAULT false NOT NULL,
    intencion_ejecutar boolean DEFAULT false NOT NULL,
    intento_previo boolean DEFAULT false NOT NULL,
    fecha_ultimo_intento timestamp(3) without time zone DEFAULT NULL::timestamp without time zone,
    metodo_intento character varying(191) DEFAULT NULL::character varying,
    nivel_severidad character varying(191) DEFAULT 'ideacion'::character varying NOT NULL
);


ALTER TABLE public.cssrs_respuestas OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 17624)
-- Name: cssrs_respuestas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cssrs_respuestas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cssrs_respuestas_id_seq OWNER TO postgres;

--
-- TOC entry 3867 (class 0 OID 0)
-- Dependencies: 280
-- Name: cssrs_respuestas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cssrs_respuestas_id_seq OWNED BY public.cssrs_respuestas.id;


--
-- TOC entry 283 (class 1259 OID 17640)
-- Name: dass21_respuestas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dass21_respuestas (
    id integer NOT NULL,
    encuesta_id integer NOT NULL,
    item_1 integer NOT NULL,
    item_2 integer NOT NULL,
    item_3 integer NOT NULL,
    item_4 integer NOT NULL,
    item_5 integer NOT NULL,
    item_6 integer NOT NULL,
    item_7 integer NOT NULL,
    item_8 integer NOT NULL,
    item_9 integer NOT NULL,
    item_10 integer NOT NULL,
    item_11 integer NOT NULL,
    item_12 integer NOT NULL,
    item_13 integer NOT NULL,
    item_14 integer NOT NULL,
    item_15 integer NOT NULL,
    item_16 integer NOT NULL,
    item_17 integer NOT NULL,
    item_18 integer NOT NULL,
    item_19 integer NOT NULL,
    item_20 integer NOT NULL,
    item_21 integer NOT NULL,
    puntaje_estres integer DEFAULT 0 NOT NULL,
    puntaje_ansiedad integer DEFAULT 0 NOT NULL,
    puntaje_depresion integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.dass21_respuestas OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 17639)
-- Name: dass21_respuestas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dass21_respuestas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dass21_respuestas_id_seq OWNER TO postgres;

--
-- TOC entry 3868 (class 0 OID 0)
-- Dependencies: 282
-- Name: dass21_respuestas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dass21_respuestas_id_seq OWNED BY public.dass21_respuestas.id;


--
-- TOC entry 285 (class 1259 OID 17648)
-- Name: encuestas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encuestas (
    id integer NOT NULL,
    fecha_creacion timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    edad integer NOT NULL,
    sexo character varying(191) NOT NULL,
    estado_civil character varying(191) DEFAULT NULL::character varying,
    nivel_educativo character varying(191) DEFAULT NULL::character varying,
    ocupacion character varying(191) DEFAULT NULL::character varying,
    ingreso_mensual character varying(191) DEFAULT NULL::character varying,
    zona_residencia character varying(191) DEFAULT NULL::character varying,
    estado_usuario character varying(191) DEFAULT 'vivo'::character varying NOT NULL,
    causa_fallecimiento character varying(191) DEFAULT NULL::character varying,
    fallecimiento_voluntario boolean,
    fecha_fallecimiento timestamp(3) without time zone DEFAULT NULL::timestamp without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    apellido character varying(191) DEFAULT NULL::character varying,
    nombre character varying(191) DEFAULT NULL::character varying,
    usuario_id integer
);


ALTER TABLE public.encuestas OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 17647)
-- Name: encuestas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.encuestas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.encuestas_id_seq OWNER TO postgres;

--
-- TOC entry 3869 (class 0 OID 0)
-- Dependencies: 284
-- Name: encuestas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.encuestas_id_seq OWNED BY public.encuestas.id;


--
-- TOC entry 287 (class 1259 OID 17669)
-- Name: factores_psicologicos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.factores_psicologicos (
    id integer NOT NULL,
    encuesta_id integer NOT NULL,
    erq_reevaluacion_cognitiva integer,
    erq_supresion_expresiva integer,
    impulsividad_motora integer,
    impulsividad_no_planificada integer,
    impulsividad_atencional integer,
    perdida_familiar_reciente boolean DEFAULT false NOT NULL,
    violencia_fisica boolean DEFAULT false NOT NULL,
    violencia_psicologica boolean DEFAULT false NOT NULL,
    abuso_sexual boolean DEFAULT false NOT NULL,
    bullying boolean DEFAULT false NOT NULL,
    desempleo_reciente boolean DEFAULT false NOT NULL,
    rupture_pareja_reciente boolean DEFAULT false NOT NULL,
    problema_legal_reciente boolean DEFAULT false NOT NULL,
    tiene_red_apoyo boolean DEFAULT true NOT NULL,
    percibe_vida_con_sentido boolean DEFAULT true NOT NULL,
    ha_buscado_ayuda_profesional boolean DEFAULT false NOT NULL,
    tipo_ayuda_profesional character varying(191) DEFAULT NULL::character varying
);


ALTER TABLE public.factores_psicologicos OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 17668)
-- Name: factores_psicologicos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.factores_psicologicos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.factores_psicologicos_id_seq OWNER TO postgres;

--
-- TOC entry 3870 (class 0 OID 0)
-- Dependencies: 286
-- Name: factores_psicologicos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.factores_psicologicos_id_seq OWNED BY public.factores_psicologicos.id;


--
-- TOC entry 289 (class 1259 OID 17686)
-- Name: factores_socioeconomicos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.factores_socioeconomicos (
    id integer NOT NULL,
    encuesta_id integer NOT NULL,
    estado_laboral character varying(191) DEFAULT NULL::character varying,
    satisfaccion_laboral integer,
    horas_trabajo_semanal integer,
    estres_laboral integer,
    nivel_deudas character varying(191) DEFAULT NULL::character varying,
    dificultad_economica boolean,
    calidad_relaciones_familiares integer,
    calidad_relaciones_pareja integer,
    apoyo_social_percibido integer,
    num_personas_confianza integer,
    vive_solo boolean,
    tipo_vivienda character varying(191) DEFAULT NULL::character varying,
    calidad_vivienda integer,
    acceso_salud_mental boolean,
    tipo_afiliacion_salud character varying(191) DEFAULT NULL::character varying,
    distancia_servicio_salud character varying(191) DEFAULT NULL::character varying
);


ALTER TABLE public.factores_socioeconomicos OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 17685)
-- Name: factores_socioeconomicos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.factores_socioeconomicos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.factores_socioeconomicos_id_seq OWNER TO postgres;

--
-- TOC entry 3871 (class 0 OID 0)
-- Dependencies: 288
-- Name: factores_socioeconomicos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.factores_socioeconomicos_id_seq OWNED BY public.factores_socioeconomicos.id;


--
-- TOC entry 291 (class 1259 OID 17698)
-- Name: historial_intentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_intentos (
    id integer NOT NULL,
    encuesta_id integer NOT NULL,
    num_intentos_previos integer DEFAULT 0 NOT NULL,
    primer_intento_edad integer,
    ultimo_intento_fecha timestamp(3) without time zone DEFAULT NULL::timestamp without time zone,
    metodo_intento character varying(191) DEFAULT NULL::character varying,
    hospitalizacion_por_intento boolean DEFAULT false NOT NULL,
    tratamiento_psiquiatrico_previo boolean DEFAULT false NOT NULL,
    antecedentes_familiares_suicidio boolean DEFAULT false NOT NULL,
    antecedentes_familiares_enfermedad_mental boolean DEFAULT false NOT NULL
);


ALTER TABLE public.historial_intentos OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 17697)
-- Name: historial_intentos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_intentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_intentos_id_seq OWNER TO postgres;

--
-- TOC entry 3872 (class 0 OID 0)
-- Dependencies: 290
-- Name: historial_intentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_intentos_id_seq OWNED BY public.historial_intentos.id;


--
-- TOC entry 293 (class 1259 OID 17710)
-- Name: notificaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificaciones (
    id integer NOT NULL,
    encuesta_id integer NOT NULL,
    tipo_riesgo character varying(191) NOT NULL,
    titulo character varying(191) NOT NULL,
    descripcion character varying(191) NOT NULL,
    leida boolean DEFAULT false NOT NULL,
    accion_requerida character varying(191) DEFAULT NULL::character varying,
    respuesta character varying(191) DEFAULT NULL::character varying,
    fecha_creacion timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_lectura timestamp(3) without time zone DEFAULT NULL::timestamp without time zone,
    fecha_respuesta timestamp(3) without time zone DEFAULT NULL::timestamp without time zone
);


ALTER TABLE public.notificaciones OWNER TO postgres;

--
-- TOC entry 292 (class 1259 OID 17709)
-- Name: notificaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notificaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notificaciones_id_seq OWNER TO postgres;

--
-- TOC entry 3873 (class 0 OID 0)
-- Dependencies: 292
-- Name: notificaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notificaciones_id_seq OWNED BY public.notificaciones.id;


--
-- TOC entry 295 (class 1259 OID 17723)
-- Name: phq9_respuestas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.phq9_respuestas (
    id integer NOT NULL,
    encuesta_id integer NOT NULL,
    interes_actividades integer NOT NULL,
    estado_animo integer NOT NULL,
    sueno integer NOT NULL,
    energia integer NOT NULL,
    apetito integer NOT NULL,
    autoestima integer NOT NULL,
    concentracion integer NOT NULL,
    psicomotricidad integer NOT NULL,
    ideacion_suicida integer NOT NULL,
    dificultad_funcionamiento integer,
    puntaje_total integer DEFAULT 0 NOT NULL,
    nivel_gravedad character varying(191) DEFAULT 'minimo'::character varying NOT NULL
);


ALTER TABLE public.phq9_respuestas OWNER TO postgres;

--
-- TOC entry 294 (class 1259 OID 17722)
-- Name: phq9_respuestas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.phq9_respuestas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.phq9_respuestas_id_seq OWNER TO postgres;

--
-- TOC entry 3874 (class 0 OID 0)
-- Dependencies: 294
-- Name: phq9_respuestas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.phq9_respuestas_id_seq OWNED BY public.phq9_respuestas.id;


--
-- TOC entry 297 (class 1259 OID 17730)
-- Name: rosenberg_respuestas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rosenberg_respuestas (
    id integer NOT NULL,
    encuesta_id integer NOT NULL,
    item1 integer NOT NULL,
    item2 integer NOT NULL,
    item3 integer NOT NULL,
    item4 integer NOT NULL,
    item5 integer NOT NULL,
    item6 integer NOT NULL,
    item7 integer NOT NULL,
    item8 integer NOT NULL,
    item9 integer NOT NULL,
    item10 integer NOT NULL
);


ALTER TABLE public.rosenberg_respuestas OWNER TO postgres;

--
-- TOC entry 296 (class 1259 OID 17729)
-- Name: rosenberg_respuestas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rosenberg_respuestas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rosenberg_respuestas_id_seq OWNER TO postgres;

--
-- TOC entry 3875 (class 0 OID 0)
-- Dependencies: 296
-- Name: rosenberg_respuestas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rosenberg_respuestas_id_seq OWNED BY public.rosenberg_respuestas.id;


--
-- TOC entry 299 (class 1259 OID 17735)
-- Name: salud_fisica; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salud_fisica (
    id integer NOT NULL,
    encuesta_id integer NOT NULL,
    enfermedad_cronica boolean DEFAULT false NOT NULL,
    tipo_enfermedad_cronica character varying(191) DEFAULT NULL::character varying,
    dolor_cronico boolean DEFAULT false NOT NULL,
    tratamiento_medico_actual boolean DEFAULT false NOT NULL,
    medicamentos_actuales character varying(191) DEFAULT NULL::character varying,
    calidad_sueno integer DEFAULT 3 NOT NULL,
    horas_sueno_promedio double precision,
    insomnio boolean DEFAULT false NOT NULL,
    consume_alcohol boolean DEFAULT false NOT NULL,
    frecuencia_alcohol character varying(191) DEFAULT NULL::character varying,
    consume_tabaco boolean DEFAULT false NOT NULL,
    frecuencia_tabaco character varying(191) DEFAULT NULL::character varying,
    consume_drogas boolean DEFAULT false NOT NULL,
    tipo_drogas character varying(191) DEFAULT NULL::character varying,
    frecuencia_drogas character varying(191) DEFAULT NULL::character varying
);


ALTER TABLE public.salud_fisica OWNER TO postgres;

--
-- TOC entry 298 (class 1259 OID 17734)
-- Name: salud_fisica_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.salud_fisica_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.salud_fisica_id_seq OWNER TO postgres;

--
-- TOC entry 3876 (class 0 OID 0)
-- Dependencies: 298
-- Name: salud_fisica_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.salud_fisica_id_seq OWNED BY public.salud_fisica.id;


--
-- TOC entry 301 (class 1259 OID 17756)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    alias character varying(191) NOT NULL,
    password character varying(191) NOT NULL,
    tipo character varying(191) DEFAULT 'usuario'::character varying NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 300 (class 1259 OID 17755)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 3877 (class 0 OID 0)
-- Dependencies: 300
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 3610 (class 2604 OID 17594)
-- Name: analisis_ia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analisis_ia ALTER COLUMN id SET DEFAULT nextval('public.analisis_ia_id_seq'::regclass);


--
-- TOC entry 3614 (class 2604 OID 17604)
-- Name: bhs_respuestas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bhs_respuestas ALTER COLUMN id SET DEFAULT nextval('public.bhs_respuestas_id_seq'::regclass);


--
-- TOC entry 3617 (class 2604 OID 17611)
-- Name: chat_mensajes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_mensajes ALTER COLUMN id SET DEFAULT nextval('public.chat_mensajes_id_seq'::regclass);


--
-- TOC entry 3619 (class 2604 OID 17619)
-- Name: chat_sesiones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_sesiones ALTER COLUMN id SET DEFAULT nextval('public.chat_sesiones_id_seq'::regclass);


--
-- TOC entry 3624 (class 2604 OID 17628)
-- Name: cssrs_respuestas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cssrs_respuestas ALTER COLUMN id SET DEFAULT nextval('public.cssrs_respuestas_id_seq'::regclass);


--
-- TOC entry 3635 (class 2604 OID 17643)
-- Name: dass21_respuestas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dass21_respuestas ALTER COLUMN id SET DEFAULT nextval('public.dass21_respuestas_id_seq'::regclass);


--
-- TOC entry 3639 (class 2604 OID 17651)
-- Name: encuestas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuestas ALTER COLUMN id SET DEFAULT nextval('public.encuestas_id_seq'::regclass);


--
-- TOC entry 3652 (class 2604 OID 17672)
-- Name: factores_psicologicos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factores_psicologicos ALTER COLUMN id SET DEFAULT nextval('public.factores_psicologicos_id_seq'::regclass);


--
-- TOC entry 3665 (class 2604 OID 17689)
-- Name: factores_socioeconomicos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factores_socioeconomicos ALTER COLUMN id SET DEFAULT nextval('public.factores_socioeconomicos_id_seq'::regclass);


--
-- TOC entry 3671 (class 2604 OID 17701)
-- Name: historial_intentos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_intentos ALTER COLUMN id SET DEFAULT nextval('public.historial_intentos_id_seq'::regclass);


--
-- TOC entry 3679 (class 2604 OID 17713)
-- Name: notificaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones ALTER COLUMN id SET DEFAULT nextval('public.notificaciones_id_seq'::regclass);


--
-- TOC entry 3686 (class 2604 OID 17726)
-- Name: phq9_respuestas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phq9_respuestas ALTER COLUMN id SET DEFAULT nextval('public.phq9_respuestas_id_seq'::regclass);


--
-- TOC entry 3689 (class 2604 OID 17733)
-- Name: rosenberg_respuestas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rosenberg_respuestas ALTER COLUMN id SET DEFAULT nextval('public.rosenberg_respuestas_id_seq'::regclass);


--
-- TOC entry 3690 (class 2604 OID 17738)
-- Name: salud_fisica id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salud_fisica ALTER COLUMN id SET DEFAULT nextval('public.salud_fisica_id_seq'::regclass);


--
-- TOC entry 3705 (class 2604 OID 17759)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 3862 (class 0 OID 0)
-- Dependencies: 12
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;


-- Completed on 2026-07-04 11:47:48

--
-- PostgreSQL database dump complete
--

\unrestrict xsfpNtxxhD4jGjwf74cNqkcBX08KAMF2c65k8mmWQti0aBriU8i85QcqX7TYjyL

