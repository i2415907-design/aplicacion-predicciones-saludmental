# DOCUMENTO TECNICO
## Sistema de BI e Inteligencia Artificial para Prevencion de Depresion y Suicidio

**Version:** 1.0  
**Fecha:** Julio 2026  
**Stack Tecnologico:** Next.js 16, React 19, PostgreSQL 17, Prisma 5.22, Groq API (Llama 3.3 70B), Tailwind CSS 4

---

## 1. ARQUITECTURA DEL SISTEMA

### 1.1 Arquitectura General

El sistema sigue una arquitectura **monolitica modular** basada en Next.js, donde el frontend y backend coexisten en la misma aplicacion. Las API Routes de Next.js manejan la logica del servidor, mientras que las paginas React manejan la interfaz de usuario.

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                     │
│  React 19 + Next.js 16 + Tailwind CSS 4 + Recharts     │
│  24 componentes React | 11 paginas | 9 componentes UI   │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/HTTPS
┌───────────────────────▼─────────────────────────────────┐
│                 SERVIDOR (Next.js API Routes)            │
│  21 endpoints HTTP | 15 archivos de rutas               │
│  Autenticacion via cookies HttpOnly (SHA-256)           │
│  Calculos clinicos en tiempo real (calculos.ts)         │
└───────────┬───────────────────────┬─────────────────────┘
            │                       │
┌───────────▼──────────┐ ┌─────────▼───────────────────┐
│   PostgreSQL 17.6    │ │     Groq API (Cloud)        │
│   (Supabase)         │ │  llama-3.3-70b-versatile    │
│   17 tablas          │ │  IA contextual + chatbot    │
│   ~239 columnas      │ │  Analisis de 4 dimensiones  │
│   ~39,000 filas      │ └─────────────────────────────┘
│   16 foreign keys     │
│   7 unique constraints│
└──────────────────────┘
```

### 1.2 Flujo de Datos

1. **Usuario completa encuesta** → Frontend envia POST a `/api/encuesta`
2. **Servidor calcula escalas** → `calculos.ts` procesa PHQ-9, C-SSRS, BHS, DASS-21
3. **Servidor calcula riesgo global** → `calcularRiesgoGlobal()` combina 7 factores ponderados
4. **Servidor guarda en DB** → Prisma crea registros en 10+ tablas en transaccion
5. **Servidor genera notificacion** → Clasificada por nivel de riesgo (bajo/moderado/alto/muy_alto)
6. **Admin recibe alerta** → Panel de notificaciones en tiempo real
7. **Admin usa chatbot** → IA genera recomendaciones clinicas con contexto del paciente

---

## 2. BASE DE DATOS

### 2.1 Motor y Plataforma

- **Motor:** PostgreSQL 17.6
- **Plataforma:** Supabase (hosting managed)
- **ORM:** Prisma 5.22 con PostgreSQL provider
- **Schema:** `public`

### 2.2 Diagrama de Tablas (17 tablas)

| # | Tabla | Columnas | Proposito |
|---|-------|----------|-----------|
| 1 | `usuarios` | 5 | Autenticacion y perfiles de usuario |
| 2 | `encuestas` | 17 | **Tabla central** - Encuesta clinica principal |
| 3 | `phq9_respuestas` | 13 | Escala PHQ-9 (Depresion) |
| 4 | `cssrs_respuestas` | 11 | Escala C-SSRS (Ideacion Suicida) |
| 5 | `bhs_respuestas` | 23 | Escala BHS (Desesperanza) |
| 6 | `rosenberg_respuestas` | 12 | Escala Rosenberg (Autoestima) |
| 7 | `dass21_respuestas` | 25 | Escala DASS-21 (Depresion/Ansiedad/Estrés) |
| 8 | `factores_socioeconomicos` | 18 | Contexto socioeconomico |
| 9 | `salud_fisica` | 17 | Salud fisica y consumo de sustancias |
| 10 | `factores_psicologicos` | 18 | Eventos vitales y factores psicologicos |
| 11 | `historial_intentos` | 10 | Historial de intentos previos |
| 12 | `analisis_ia` | 8 | Resultados de analisis IA (reservado) |
| 13 | `chat_sesiones` | 6 | Sesiones de chat |
| 14 | `chat_mensajes` | 7 | Mensajes de chat |
| 15 | `notificaciones` | 11 | Alertas clinicas automaticas |
| 16 | `categorias_casos` | 6 | Categorias de archivado |
| 17 | `casos_archivados` | 6 | Casos archivados por admin |

**Total:** 17 tablas, ~239 columnas, ~39,000 filas

### 2.3 Relaciones (Foreign Keys)

```
usuarios (1) ──── (N) encuestas
                        │
        ┌───────────────┼───────────────────────────┐
        │ (1:1)         │ (1:1)                     │ (1:N)
   phq9_respuestas  cssrs_respuestas          notificaciones
   bhs_respuestas   rosenberg_respuestas      casos_archivados
   dass21_respuestas factores_socioeconomicos  chat_sesiones ──(N)── chat_mensajes
                     salud_fisica
                     factores_psicologicos
                     historial_intentos

categorias_casos (1) ──── (N) casos_archivados
```

### 2.4 Tipos de Datos Utilizados

| Tipo PostgreSQL | Cantidad | Uso |
|----------------|----------|-----|
| `integer` (SERIAL) | 17 | Primary keys auto-increment |
| `integer` | ~60 | Edad, puntajes, items, conteos |
| `varchar(191)` | ~45 | Aliases, campos de texto corto, enums |
| `boolean` | ~40 | Flags de riesgo, consumo, trauma |
| `timestamp` | ~18 | Fechas y timestamps |
| `jsonb` | 4 | Resultados IA, contexto de chat |
| `text` | 1 | Notas de archivado |
| `double precision` | 1 | Horas de sueno promedio |

### 2.5 Constraints e Indices

- **Primary Keys:** 17 (una por tabla, SERIAL)
- **Foreign Keys:** 16
- **Unique Constraints:** 7 (`usuarios.alias`, `factores_socioeconomicos.encuesta_id`, `salud_fisica.encuesta_id`, `factores_psicologicos.encuesta_id`, `historial_intentos.encuesta_id`, `categorias_casos.nombre`, `casos_archivados.[encuesta_id, categoria_id]`)
- **Indices:** 2 explicitos en `casos_archivados`
- **RLS (Row Level Security):** Habilitado en `categorias_casos` y `casos_archivados`

---

## 3. ALGORITMOS CLINICOS

### 3.1 PHQ-9 (Patient Health Questionnaire-9)

**Funcion:** `calcularPHQ9()` en `src/lib/calculos.ts`

- **Entrada:** 9 items enteros (cada uno 0-3)
- **Calculo:** Suma simple de los 9 items (rango 0-27)
- **Clasificacion:**

| Puntaje | Severidad |
|---------|-----------|
| 0-4 | Minimo |
| 5-9 | Leve |
| 10-14 | Moderado |
| 15-19 | Moderadamente severo |
| 20-27 | Severo |

### 3.2 C-SSRS (Columbia Suicide Severity Rating Scale)

**Funcion:** `calcularCSSRS()` en `src/lib/calculos.ts`

- **Entrada:** 6 flags booleanos de severidad creciente
- **Calculo:** Clasificacion en cascada (mayor severidad gana)

| Condicion | Severidad |
|-----------|-----------|
| `intencionEjecutar` = true | intento_letal |
| `planEspecifico` = true | planificacion |
| `intencionSinPlan` o `metodoSinPlan` = true | intento_no_letal |
| `pensamientosSuicidas` = true | ideacion |
| Default | ideacion |

### 3.3 BHS (Beck Hopelessness Scale)

**Funcion:** `calcularBHS()` en `src/lib/calculos.ts`

- **Entrada:** 20 items booleanos (Si/No)
- **Calculo:** Conteo de respuestas "Si" (rango 0-20)

| Puntaje | Nivel |
|---------|-------|
| 0-9 | Bajo |
| 10-14 | Moderado |
| 15-20 | Alto |

### 3.4 Rosenberg (Escala de Autoestima)

- **Entrada:** 10 items (escala 1-4)
- **Calculo:** Suma con inversion en items 2, 5, 6, 8, 9 (puntaje = 5 - valor)
- **Rango:** 10-40

| Puntaje | Nivel |
|---------|-------|
| <=15 | Baja |
| 16-25 | Media |
| >=26 | Alta |

### 3.5 DASS-21 (Depression, Anxiety and Stress Scales)

- **Entrada:** 21 items (escala 0-3)
- **Calculo:** 3 subescalas, cada una suma 7 items x 2 (equivalencia DASS-42)

| Subescala | Items |
|-----------|-------|
| Estres | 1, 6, 8, 11, 12, 14, 18 |
| Ansiedad | 2, 4, 7, 9, 15, 19, 20 |
| Depresion | 3, 5, 10, 13, 16, 17, 21 |

### 3.6 Riesgo Global Composto

**Funcion:** `calcularRiesgoGlobal()` en `src/lib/calculos.ts`

Algoritmo aditivo con 7 factores ponderados (puntaje maximo: 23):

| Factor | Condicion | Puntos |
|--------|-----------|--------|
| PHQ-9 | >= 20 | +4 |
| PHQ-9 | >= 15 | +3 |
| PHQ-9 | >= 10 | +2 |
| PHQ-9 | >= 5 | +1 |
| BHS | >= 15 | +4 |
| BHS | >= 10 | +3 |
| BHS | >= 5 | +1 |
| C-SSRS | intento_letal | +5 |
| C-SSRS | planificacion | +4 |
| C-SSRS | intento_no_letal | +3 |
| Ideacion suicida (PHQ-9 item 9) | >= 2 | +3 |
| Ideacion suicida | >= 1 | +1 |
| Intento previo | true | +3 |
| Consumo de sustancias | true | +2 |
| Aislamiento social | true | +2 |

**Clasificacion:**

| Puntaje | Nivel de Riesgo |
|---------|-----------------|
| >= 12 | MUY ALTO |
| 8-11 | ALTO |
| 4-7 | MODERADO |
| 0-3 | BAJO |

---

## 4. API ENDPOINTS (21 handlers)

### 4.1 Autenticacion (4 endpoints)

| Metodo | Ruta | Funcion |
|--------|------|---------|
| POST | `/api/auth/login` | Login con alias + password, setea cookie httpOnly |
| POST | `/api/auth/register` | Registro de usuario nuevo |
| GET | `/api/auth/session` | Verifica si hay sesion activa |
| POST | `/api/auth/logout` | Limpia cookie de sesion |

**Mecanismo de sesion:** Cookie httpOnly名为 `session` con JSON `{id, alias, tipo}`, maxAge 24h.

**Hasheo:** SHA-256 via Node.js `crypto.createHash`.

### 4.2 Encuestas (3 endpoints)

| Metodo | Ruta | Funcion |
|--------|------|---------|
| POST | `/api/encuesta` | Crear encuesta completa con todas las escalas |
| GET | `/api/encuesta` | Listar encuestas con paginacion |
| GET | `/api/encuesta/[id]` | Obtener encuesta completa por ID |

**POST `/api/encuesta`** es el endpoint mas complejo: recibe ~100+ campos, calcula 5 escalas, calcula riesgo global, crea registros en 10+ tablas, y genera una notificacion automatica.

### 4.3 Dashboard (1 endpoint)

| Metodo | Ruta | Funcion |
|--------|------|---------|
| GET | `/api/dashboard` | Estadisticas agregadas: total encuestas, promedio PHQ-9, distribucion por sexo/edad, fallecidos |

### 4.4 Usuario (1 endpoint)

| Metodo | Ruta | Funcion |
|--------|------|---------|
| GET | `/api/usuario/encuestas` | Encuestas del usuario autenticado (requiere sesion) |

### 4.5 Admin (8 endpoints)

| Metodo | Ruta | Funcion |
|--------|------|---------|
| GET | `/api/admin/stats` | Estadisticas del panel admin |
| GET | `/api/admin/encuestas` | Lista de encuestas con filtros avanzados |
| GET | `/api/admin/notificaciones` | Lista de notificaciones |
| POST | `/api/admin/notificaciones` | Crear notificacion |
| PATCH | `/api/admin/notificaciones` | Marcar leida / responder |
| POST | `/api/admin/chatbot` | Chatbot IA contextual |
| GET/POST/DELETE | `/api/admin/archivado` | CRUD de casos archivados |
| GET/POST | `/api/admin/categorias` | CRUD de categorias |

### 4.6 Chat (1 endpoint)

| Metodo | Ruta | Funcion |
|--------|------|---------|
| POST | `/api/chat` | Chat publico con contexto de base de datos completo |

**Total: 21 handlers HTTP en 15 archivos de ruta**

---

## 5. FRONTEND

### 5.1 Stack

- **Framework:** Next.js 16.2.9 (App Router)
- **UI Library:** React 19.2.4
- **Estilos:** Tailwind CSS 4
- **Graficas:** Recharts 3.9
- **Iconos:** Lucide React 1.21
- **PDF:** jsPDF (client-side)
- **State Management:** React useState + useContext (AuthContext)

### 5.2 Paginas (11 rutas)

| # | Ruta | Componente | Lineas | Descripcion |
|---|------|------------|--------|-------------|
| 1 | `/` | Home | ~100 | Landing page estatica |
| 2 | `/login` | LoginPage | ~150 | Login/Registro con toggle |
| 3 | `/encuesta` | EncuestaPage | 921 | Wizard de 10 pasos (mayor archivo) |
| 4 | `/encuesta/[id]` | EncuestaResultadoPage | ~330 | Resultados + PDF + archivado |
| 5 | `/dashboard` | DashboardPage | ~200 | Graficas BI con Recharts |
| 6 | `/chat` | ChatPage | ~300 | Chat IA publico + analisis 4D |
| 7 | `/usuario/encuestas` | MisEncuestasPage | ~120 | Historial del usuario |
| 8 | `/admin` | AdminDashboard | ~170 | Dashboard admin con KPIs |
| 9 | `/admin/encuestas` | AdminEncuestasPage | ~280 | Tabla admin con filtros |
| 10 | `/admin/notificaciones` | AdminNotificacionesPage | ~300 | Notificaciones paginadas |
| 11 | `/admin/chatbot` | AdminChatbotPage | ~200 | Chatbot clinico contextual |

### 5.3 Componentes (24 total)

**Componentes UI reutilizables (5):**
- `BarraProgreso` - Barra de progreso del wizard
- `PreguntaEscala` - Preguntas numericas (0-3, 1-4, 1-5)
- `PreguntaSeleccion` - Dropdown de seleccion
- `PreguntaSiNo` - Toggle Si/No
- `PreguntaCheckbox` - Checkboxes multiples

**Componentes globales (2):**
- `Navigation` - Barra de navegacion responsive
- `InterstitialPopup` - Modal de aviso (una vez por sesion)

**Componentes admin (2):**
- `ArchivarCaso` - Widget inline de archivado
- `ArchivarModal` - Modal de archivado

**Context (1):**
- `AuthProvider` - Contexto de autenticacion

---

## 6. SISTEMA DE IA

### 6.1 Modelo Utilizado

- **Proveedor:** Groq API
- **Modelo:** llama-3.3-70b-versatile
- **Max tokens:** 1024 (admin chatbot), dinamico (chat publico)
- **Temperatura:** 0.7

### 6.2 Chat Publico (`/api/chat`)

El chat publico recibe contexto statistico completo de la base de datos:
- Total de encuestas y fallecidos
- Distribucion demografica completa
- Distribucion de escalas clinicas por sexo
- Tabulaciones cruzadas (depresion x factores, ideacion x factores)
- Datos de consumo de sustancias
- Estadisticas de salud fisica
- Factores psicologicos y socioeconomicos
- Promedios de impulsividad
- Historial de intentos

El sistema genera **dos llamadas a la IA por mensaje:**
1. Respuesta conversacional
2. Analisis estructurado de 4 dimensiones (Descriptivo, Diagnostico, Predictivo, Prescriptivo)

### 6.3 Chatbot Admin (`/api/admin/chatbot`)

Asistente clinico especializado para psicologos:
- Recibe contexto de la notificacion seleccionada (riesgo, paciente, descripcion)
- Genera recomendaciones clinicas: protocolos de intervencion, preguntas de seguimiento, planes de tratamiento
- System prompt especializado en psicologia clinica

---

## 7. SISTEMA DE NOTIFICACIONES

### 7.1 Creacion Automatica

Al enviar una encuesta (`POST /api/encuesta`), el sistema genera automaticamente una notificacion:

| Nivel de Riesgo | Titulo | Accion Recomendada |
|-----------------|--------|--------------------|
| muy_alto | RIESGO CRITICO | Contactar inmediatamente, derivar a emergencia |
| alto | Riesgo Alto | Cita de seguimiento en 48 horas |
| moderado | Riesgo Moderado | Seguimiento semanal |
| bajo | Riesgo Bajo | Monitoreo de rutina |

### 7.2 Estados

- **No leida:** Punto purpura indicador
- **Leida:** Sin indicador, fecha de lectura registrada
- **Respondida:** Texto de respuesta del admin con fecha

---

## 8. SISTEMA DE ARCHIVADO

### 8.1 Categorias Predefinidas

| Categoria | Color | Descripcion |
|-----------|-------|-------------|
| Caso Especial | Rojo (#EF4444) | Atencion prioritaria |
| Seguimiento | Amarillo (#F59E0B) | En proceso de monitoreo |
| Estabilizado | Verde (#10B981) | Pacientes mejorados |
| Derivado | Azul (#3B82F6) | Transferidos a servicios externos |
| Cerrado | Gris (#6B7280) | Casos finalizados |

### 8.2 Funcionalidad

- El admin puede crear categorias personalizadas con nombre, color y descripcion
- Un caso puede estar en multiples categorias simultaneamente
- Cada archivado incluye notas y el alias del admin que archivo
- Filtro por categoria en la tabla de encuestas admin

---

## 9. SEGURIDAD

### 9.1 Autenticacion

- **Contrasenas:** Hasheadas con SHA-256
- **Sesiones:** Cookies httpOnly con `sameSite: lax`, maxAge 24h
- **Roles:** `usuario` (regular) y `admin` (psicologo)

### 9.2 Row Level Security (RLS)

Habilitado en Supabase para `categorias_casos` y `casos_archivados`:
- `service_role`: Acceso completo
- `authenticated`: Solo lectura
- `anon`: Solo lectura

### 9.3 Observaciones

- Los endpoints admin no tienen proteccion server-side (accesibles por cualquier usuario que conozca las rutas)
- La proteccion admin es solo en el frontend (layout guard)
- No hay validacion Zod en backend

---

## 10. DEPENDENCIAS

### 10.1 Dependencias Principales

| Paquete | Version | Uso |
|---------|---------|-----|
| next | 16.2.9 | Framework fullstack |
| react | 19.2.4 | UI library |
| @prisma/client | 5.22.0 | ORM |
| prisma | 5.22.0 | Schema y migraciones |
| ai | 6.0.209 | SDK de IA |
| @ai-sdk/openai | 3.0.74 | Provider OpenAI-compatible |
| recharts | 3.9.0 | Graficas |
| lucide-react | 1.21.0 | Iconos |
| jspdf | latest | Generacion PDF |
| html2canvas | latest | Captura de pantalla (reservado) |
| zod | 4.4.3 | Validacion (instalado, no usado activamente) |
| tailwind-merge | 3.6.0 | Utilidad de clases CSS |
| class-variance-authority | 0.7.1 | Variantes de componentes |
| pg | 8.22.0 | Cliente PostgreSQL |

### 10.2 DevDependencies

| Paquete | Version | Uso |
|---------|---------|-----|
| typescript | 5.x | Type checking |
| @tailwindcss/postcss | 4.x | PostCSS plugin |
| tsx | 4.22.4 | Ejecucion TypeScript |
| dotenv | 17.4.2 | Variables de entorno |

---

## 11. SCRIPTS Y UTILIDADES

### 11.1 Faker Seed (`faker_seed.py`)

Script en Python para generar datos sinteticos realistas:
- Genera encuestas con distribuciones ponderadas de severidad
- Calcula puntajes de escalas clinicas
- Genera notificaciones basadas en nivel de riesgo
- Crea usuarios ficticios con encuestas vinculadas
- Soporte para exportacion a SQL y carga directa a PostgreSQL

### 11.2 Prisma Seed (`prisma/seed.ts`)

Script TypeScript con 60 perfiles clinicos curados:
- Casos de alta severidad con intentos previos
- Casos estabilizados con seguimiento
- Casos anonimos sin usuario vinculado
- Distribucion demografica variada

---

## 12. VARIABLES DE ENTORNO

| Variable | Proposito |
|----------|-----------|
| `DATABASE_URL` | URL de conexion a PostgreSQL (Supabase) |
| `OPENAI_API_KEY` | API key de Groq |
| `OPENAI_MODEL` | Modelo a usar (default: llama-3.3-70b-versatile) |

---

## 13. ESTADISTICAS DEL PROYECTO

| Metrica | Valor |
|---------|-------|
| Total de paginas | 11 |
| Total de componentes React | 24 |
| Total de endpoints API | 21 |
| Total de tablas DB | 17 |
| Total de columnas DB | ~239 |
| Total de foreign keys | 16 |
| Total de filas en DB | ~39,000 |
| Lineas de codigo (estimado) | ~8,000+ |
| Archivo mas grande | `encuesta/page.tsx` (921 lineas) |
| Escalas clinicas implementadas | 5 (PHQ-9, C-SSRS, BHS, Rosenberg, DASS-21) |
| Modelo de IA | Llama 3.3 70B (Groq) |
| Total de dependencias | 14 principales + 8 dev |
