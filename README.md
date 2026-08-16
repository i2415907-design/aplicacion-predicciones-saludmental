# 🧠 Sistema de Salud Mental IA & Business Intelligence

> **Plataforma Integral de Detección Temprana, Triaje Clínico con IA y Dashboard BI para la Prevención de la Depresión y el Riesgo Suicida.**

Este proyecto es un **Producto Mínimo Viable (PMV)** para el curso de **Inteligencia Artificial**, diseñado para transformar la detección de riesgo psicoemocional de un enfoque reactivo a uno **proactivo y preventivo**.

---

## 🌟 Características Principales

* **Encuesta Clínica Multidimensional (Wizard 10 Pasos)**:
  * Evaluación de 5 escalas clínicas validadas: **PHQ-9** (Depresión), **C-SSRS** (Ideación Suicida), **BHS** (Desesperanza), **Rosenberg** (Autoestima) y **DASS-21** (Depresión, Ansiedad, Estrés).
  * Factores socioeconómicos, calidad de sueño, consumo de sustancias y eventos vitales adversos.
  * Modalidad autenticada o **anónima** para reducir el estigma.
* **Motor de Triaje Clínico & Alertas con SLA**:
  * Algoritmo compuesto determinista en tiempo real: *Bajo, Moderado, Alto, Crítico*.
  * Asignación automática de tiempos máximos de atención clínica (SLA: 2h, 12h, 24h, 72h).
  * Detector de inconsistencias psicométricas.
* **Copiloto Clínico e Informe 4D Asistido por IA (Groq / LLaMA-3.3-70B)**:
  * **Análisis 4D**: *Descriptivo, Diagnóstico, Predictivo y Prescriptivo*.
  * **Copiloto de Entrevista**: Generación de preguntas estratégicas personalizadas para el médico de turno.
  * Chatbot clínico contextual con acceso al expediente anonimizado.
* **Dashboard de Business Intelligence (BI)**:
  * Visualización de KPIs en tiempo real con Recharts (distribuciones de escalas, mapas demográficos, tendencias).
* **Generador de Informes Médicos en PDF**:
  * Exportación de reportes clínicos individuales con diseño formal.

---

## 🏛️ Arquitectura del Software (Capas / MVC)

```
sistema-ia/
├── src/
│   ├── app/                      # Capa de Vistas y Enrutamiento (App Router)
│   │   ├── (vistas usuario)      # /, /encuesta, /encuesta/[id], /usuario/*
│   │   ├── (vistas admin)        # /admin, /admin/notificaciones, /admin/chatbot, /admin/encuestas
│   │   ├── (vistas BI)           # /dashboard, /chat
│   │   └── api/                  # Controladores HTTP (API Handlers)
│   ├── services/                 # Capa de Lógica de Negocio y Orquestación
│   │   ├── encuesta.service.ts   # Procesamiento clínico y guardado
│   │   ├── ai.service.ts         # Integración Groq (4D, Copiloto)
│   │   ├── notificaciones.service.ts # Triaje por severidad y SLA
│   │   └── analytics.service.ts  # Agregaciones de BI
│   ├── lib/                      # Clientes y utilidades
│   │   ├── calculos.ts           # Algoritmos puros PHQ-9, C-SSRS, BHS, DASS-21
│   │   ├── openai.ts             # Cliente Groq AI
│   │   ├── prisma.ts             # Singleton Prisma (Supabase Pooler)
│   │   └── pdf-generator.ts      # Generador de reportes PDF
│   ├── validators/               # Validaciones Zod de entrada
│   └── components/               # Componentes UI reutilizables
├── prisma/                       # Schema ORM y seeders
├── database/                     # Respaldo oficial de la base de datos PostgreSQL
├── notebooks/                    # Jupyter Notebooks de análisis y limpieza de datos
├── scripts/                      # Scripts de migración, seeding y pruebas
└── documentacion/                # Documentación académica y técnica completa
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, TailwindCSS |
| **Visualización BI** | Recharts |
| **Generación PDF** | jsPDF, html2canvas |
| **Backend / API** | Next.js API Routes, Zod |
| **Base de Datos & ORM** | PostgreSQL (Supabase), Prisma ORM |
| **Inteligencia Artificial** | Groq API (`llama-3.3-70b-versatile`), `@ai-sdk/openai` |

---

## 🚀 Guía de Instalación y Ejecución Local

### 1. Clonar el repositorio e instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno (`.env`)
Crea o edita tu archivo `.env` con las siguientes credenciales:

```env
# Conexión PostgreSQL (Supabase Pooler o Local)
DATABASE_URL="postgresql://usuario:password@host:6543/postgres?pgbouncer=true"

# Groq API (Compatible con OpenAI SDK)
OPENAI_API_KEY="gsk_tu_api_key_de_groq"
OPENAI_BASE_URL="https://api.groq.com/openai/v1"
OPENAI_MODEL="llama-3.3-70b-versatile"
```

### 3. Generar cliente Prisma y correr migraciones
```bash
npx prisma generate
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```
Abre tu navegador en [http://localhost:3000](http://localhost:3000).

---

## 🌐 Despliegue en la Nube (Render + Supabase)

El proyecto está preparado para ejecutarse tanto en local como en producción:
1. **Base de Datos**: PostgreSQL alojada en **Supabase** (usando Connection Pooling en el puerto 6543).
2. **Aplicación Web**: Desplegada en **Render** con el comando de build:
   ```bash
   npm run build
   ```
   y comando de inicio:
   ```bash
   npm run start
   ```

---

## 📚 Documentación Adicional

En la carpeta [`documentacion/`](./documentacion/) encontrarás:
* `00_PMV_Sistema_BI_IA.md`: Documento de Producto Mínimo Viable (Lean Startup).
* `01_documento_tecnico.md`: Especificaciones técnicas y arquitecturales.
* `02_documento_descriptivo.md`: Visión del problema y justificación clínica.
* `03_guia_exposicion.md`: Guía para sustentación académica.
* `05_Ficha_Tecnica_Dataset_IA.md`: Especificación del dataset y variables predictoras.
* `06_Funcionalidades_MVP.md`: Desglose funcional detallado.
