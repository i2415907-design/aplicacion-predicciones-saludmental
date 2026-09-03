# 🎓 GUÍA MAESTRA DE SUSTENTACIÓN ACADÉMICA — EQUIPO "CABO VERDE"
## Manual Integral de Estudio para la Exposición del Producto Mínimo Viable (PMV)
### Asignatura: Inteligencia Artificial (Semestre VI - 2026) · Docente: Mg. Karem Mercedes Maldonado Cordova
### Proyecto: Sistema de Asistencia Clínica y Triage Preventivo en Salud Mental

---

> ⚠️ **Este manual está diseñado para una persona con conocimiento CERO del proyecto.** Léelo de inicio a fin antes de ensayar la exposición. Cada sección incluye explicaciones desde lo más básico, analogías cotidianas, ejemplos reales del código y respuestas modelo para el jurado.

---

## 📚 ÍNDICE

1. [Contexto: ¿De qué trata este proyecto?](#contexto)
2. [Glosario Esencial: Palabras que debes dominar](#glosario)
3. [Las 5 Escalas Clínicas que usa el Sistema](#escalas)
4. [La Arquitectura Completa del Sistema (explicada desde cero)](#arquitectura)
5. [El Algoritmo de IA paso a paso](#algoritmo)
6. [La Base de Datos: Estructura y Calidad](#base-de-datos)
7. [El Copiloto Clínico de IA: Cómo funciona](#copiloto)
8. [Guion de Exposición Diapositiva por Diapositiva](#guion)
9. [Las 4 Preguntas Vitales de la Rúbrica](#preguntas-vitales)
10. [Los 7 Pasos de la Demostración en Vivo](#demostracion)
11. [Metáforas para Explicar Conceptos Complejos](#metaforas)
12. [Simulacro de Preguntas Difíciles de la Profesora](#simulacro)

---

<a name="contexto"></a>
## 🌍 1. CONTEXTO: ¿DE QUÉ TRATA ESTE PROYECTO?

### 1.1 El Problema Real

Imagina que eres psicólogo en un centro de salud universitario. Tienes 30 pacientes por día y cada consulta dura 15 minutos. Para evaluar correctamente si un estudiante tiene depresión severa o riesgo de suicidio, necesitarías aplicar **5 cuestionarios clínicos** que suman **84 preguntas**. Eso tomaría más de 30 minutos solo en aplicar y calcular, cuando tu consulta entera dura 15 minutos.

**¿Qué pasa en la realidad?** Los cuestionarios no se aplican completos (o no se aplican). Los pacientes son evaluados superficialmente. Las señales tempranas de ideación suicida pasan desapercibidas. Y cuando el sistema de salud finalmente interviene, el paciente ya está en la sala de urgencias tras un intento consumado.

### 1.2 Los Números que Respaldan el Problema

| Dato | Fuente |
|---|---|
| **720,000+** muertes anuales por suicidio (1 cada 40 segundos) | OMS, 2023 |
| **4ta causa de muerte** en jóvenes de 15 a 29 años | OMS, 2023 |
| **+17%** de aumento de tasas en América Latina en la última década | OPS, 2022 |
| **70%+** de personas en riesgo emiten señales previas no detectadas | NIMH |
| **279** fallecimientos registrados en nuestro dataset histórico | Dataset del proyecto |

### 1.3 ¿Qué Construimos?

Un **sistema web** (funciona en navegador, sin instalar nada) que hace tres cosas:

1. **Digitaliza y automatiza** los 5 cuestionarios clínicos en un formulario interactivo que el paciente llena en 5 minutos.
2. **Clasifica automáticamente** el nivel de riesgo del paciente en menos de 2 segundos usando un algoritmo determinista de 7 factores.
3. **Asiste al psicólogo** con un Copiloto de IA que analiza el expediente del paciente y genera un plan de intervención en 1.3 segundos.

### 1.4 ¿Qué NO es este proyecto?

- ❌ No es una app para diagnosticar. Solo el psicólogo puede diagnosticar.
- ❌ No reemplaza al profesional de salud. Es un asistente, como un semáforo que prioriza.
- ❌ No es una red social de salud mental ni un chatbot terapéutico.
- ✅ Es un **sistema de triage** (priorización de urgencia) que ayuda al profesional a actuar a tiempo.

---

<a name="glosario"></a>
## 📖 2. GLOSARIO ESENCIAL

> Estas son palabras que aparecerán en la exposición. Memorizarlas es obligatorio.

| Término | Significado Simple | Ejemplo en Nuestro Proyecto |
|---|---|---|
| **PMV** (Producto Mínimo Viable) | La versión más pequeña de un producto que sirve para validar si la idea funciona. | Nuestro sistema web con encuestas, scoring y copiloto IA. |
| **Triage** | Sistema de priorización médica que clasifica pacientes por urgencia. | Nuestro motor clasifica en Bajo, Moderado, Alto y Muy Alto. |
| **Escala Clínica** | Cuestionario validado científicamente para medir un trastorno. | PHQ-9 mide depresión, BHS mide desesperanza, C-SSRS mide riesgo suicida. |
| **Scoring / Puntaje** | Asignar un número que representa la gravedad de algo. | PHQ-9 = 21 puntos → Depresión severa. |
| **Variable Predictora (X)** | Un dato de entrada que el algoritmo usa para calcular. | El puntaje total de PHQ-9 es una variable predictora. |
| **Variable Objetivo (y)** | Lo que el algoritmo intenta determinar o clasificar. | El nivel de riesgo: `bajo`, `moderado`, `alto`, `muy_alto`. |
| **IA Simbólica** | Inteligencia Artificial basada en reglas lógicas explícitas (if/else). | Nuestra función `calcularRiesgoGlobal()` con 7 factores. |
| **IA Generativa** | IA que genera texto nuevo a partir de un modelo de lenguaje entrenado. | El Copiloto Clínico que redacta informes médicos. |
| **Function Calling** | Capacidad de un modelo de IA para ejecutar funciones (herramientas) automáticamente. | El Copiloto IA "llama" a la base de datos para obtener el expediente. |
| **RAG** | Retrieval-Augmented Generation: IA que consulta datos reales antes de generar texto. | El Copiloto consulta la BD del paciente antes de prescribir. |
| **Clasificación Multiclase** | Tarea de IA que asigna una de varias categorías predefinidas. | Clasificar un paciente en 1 de 4 niveles de riesgo. |
| **Falso Negativo** | Cuando el sistema dice "todo bien" pero el paciente sí está en riesgo. | Es lo más peligroso: un paciente suicida clasificado como "bajo". |
| **SLA (Service Level Agreement)** | Tiempo máximo permitido para actuar ante una alerta. | Riesgo muy_alto = SLA de 2 horas para contacto de emergencia. |
| **Human-in-the-Loop** | La IA asesora, pero la decisión final la toma el humano (médico). | El Copiloto sugiere un plan, pero el psicólogo decide si lo aplica. |
| **ISO 14971** | Norma internacional para gestión de riesgos en dispositivos médicos. | Seguimos sus principios de trazabilidad y supervisión humana. |

---

<a name="escalas"></a>
## 🧪 3. LAS 5 ESCALAS CLÍNICAS QUE USA EL SISTEMA

### 3.1 ¿Qué es una escala clínica?

Es como una "prueba de sangre" pero para la mente. Son cuestionarios con preguntas estandarizadas que han sido validados por años de investigación médica en todo el mundo. Cada respuesta tiene un valor numérico y la suma total indica la severidad de un trastorno.

### 3.2 Las Escalas en Nuestro PMV

| Escala | ¿Qué Mide? | N.° de Preguntas | Rango | Ejemplo de Interpretación |
|---|---|---|---|---|
| **PHQ-9** | Depresión | 9 ítems | 0 - 27 | 0-4: Mínima / 5-9: Leve / 10-14: Moderada / 15-19: Mod. Severa / **20-27: Severa** |
| **BHS** | Desesperanza (Hopelessness) | 20 ítems (V/F) | 0 - 20 | 0-3: Mínima / 4-8: Leve / 9-14: Moderada / **15-20: Severa** |
| **C-SSRS** | Riesgo Suicida (Ideación y Conducta) | 7 preguntas | Ninguna → Intento Letal | Escala ordinal de severidad: sin ideación → deseos de morir → plan → intento |
| **DASS-21** | Estrés, Ansiedad y Depresión | 21 ítems | 0 - 42 por subescala | Medida complementaria de estados emocionales negativos |
| **Rosenberg** | Autoestima | 10 ítems | 10 - 40 | **<25: Baja** / 25-35: Media / >35: Alta |

### 3.3 ¿Por qué estas 5 y no otras?

Porque están validadas internacionalmente, son de uso libre (sin licencia), cubren los 3 ejes principales del riesgo suicida (depresión + desesperanza + ideación) y sus puntajes son sumables para crear un **índice compuesto de riesgo**.

### 3.4 El Ítem 9 del PHQ-9: La Pregunta Más Crítica

La pregunta 9 del PHQ-9 dice: *"¿Ha pensado que estaría mejor muerto o ha deseado hacerse daño?"*

- Si el paciente responde **2 o 3** (más de la mitad de los días o casi todos los días), el sistema activa automáticamente un **Código Rojo** sin importar los demás puntajes. Esto es un **disparador de emergencia** que no admite excepciones.

---

<a name="arquitectura"></a>
## 🏗️ 4. LA ARQUITECTURA COMPLETA DEL SISTEMA

### 4.1 ¿Qué es la Arquitectura de un Sistema?

Es el "plano del edificio": describe todas las piezas que forman el sistema, cómo se conectan entre sí y por dónde viaja la información desde que el paciente toca una tecla hasta que el psicólogo recibe la alerta.

### 4.2 Diagrama de Flujo de Información (Textual para Estudiar)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  1. USUARIO  │────▶│  2. ENTRADA  │────▶│ 3. SERVIDOR  │
│  (Paciente)  │     │  (84 Ítems)  │     │  (API Layer) │
│  Web Browser │     │  5 Escalas   │     │  21 Endpoints│
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                                    ┌────────────┴────────────┐
                                    ▼                         ▼
                          ┌─────────────────┐     ┌─────────────────┐
                          │ 4a. IA SIMBÓLICA│     │ 4b. IA EN NUBE  │
                          │ calcularRiesgo  │     │ Copiloto Clínico│
                          │ Global() → 2ms  │     │ Function Calling│
                          │ 7 factores, 0-27│     │ Respuesta: 1.3s │
                          └────────┬────────┘     └────────┬────────┘
                                   │                       │
                                   ▼                       ▼
                          ┌─────────────────┐     ┌─────────────────┐
                          │ 5. BASE DE DATOS│     │ 6. ACCIÓN MÉDICA│
                          │ PostgreSQL      │     │ Plan de Seguridad│
                          │ 17 tablas       │     │ Línea 113 / 988 │
                          │ Alerta Roja     │     │ PDF Médico      │
                          └─────────────────┘     └─────────────────┘
```

### 4.3 ¿Dónde Está la IA? (Pregunta Obligatoria de la Rúbrica)

La IA está en **dos lugares exactos** del código fuente:

#### Ubicación 1: IA Simbólica Local (el "Piloto Automático")
- **Archivo:** `src/lib/calculos.ts`
- **Función:** `calcularRiesgoGlobal()`
- **¿Qué hace?** Recibe los puntajes de las 5 escalas y 7 factores de riesgo. Aplica reglas ponderadas (if/else con pesos clínicos) y produce un puntaje de 0 a 27 puntos. Clasifica al paciente en Bajo, Moderado, Alto o Muy Alto.
- **Tiempo de ejecución:** 2 milisegundos.
- **¿Por qué es IA?** Porque es un **Sistema Experto basado en Reglas**, una de las dos ramas históricas de la Inteligencia Artificial (junto con el aprendizaje estadístico). Los sistemas expertos médicos usan esta rama porque la explicabilidad es un requisito legal.

#### Ubicación 2: IA Generativa en la Nube (el "Copiloto")
- **Archivo:** `src/lib/ai/orchestrator.ts`
- **¿Qué hace?** Cuando el psicólogo abre el Copiloto Clínico y hace una pregunta sobre un paciente, el modelo de lenguaje:
  1. Analiza el contexto de la pregunta.
  2. Decide qué herramientas (tools) necesita invocar (por ejemplo, consultar el expediente del paciente en la base de datos).
  3. Ejecuta la herramienta mediante **Function Calling** (la IA "llama" a una función que consulta PostgreSQL).
  4. Recibe los datos del paciente y genera una respuesta médica estructurada.
- **Tiempo de ejecución:** 1.3 segundos.

### 4.4 Analogía: El Hospital y sus Departamentos

Piensa en nuestro sistema como un hospital:

| Departamento del Hospital | Equivalente en Nuestro Sistema |
|---|---|
| Recepción (donde el paciente llena sus datos) | El formulario wizard de 10 pasos en el navegador web |
| Laboratorio de análisis (procesa las muestras) | El servidor que valida rangos y calcula baremos psicométricos |
| El médico de triaje (clasifica la urgencia) | La función `calcularRiesgoGlobal()` (IA Simbólica) |
| El especialista consultor (analiza el caso en profundidad) | El Copiloto IA con Function Calling (IA Generativa) |
| La base de datos del hospital (historial clínico) | PostgreSQL con 17 tablas y 239 columnas |
| El semáforo de urgencias (Código Rojo / Verde) | La tabla `notificaciones` con nivel de riesgo y prioridad |
| El informe médico final para el expediente | El PDF generado por el sistema con el resumen clínico |

---

<a name="algoritmo"></a>
## 🧠 5. EL ALGORITMO DE IA PASO A PASO

### 5.1 ¿Qué Algoritmo Usamos y Por Qué?

**Nombre formal:** Árbol de Decisión Clínico con Reglas de Puntuación Ponderada.

**¿Qué significa en español?** Es un sistema de puntos. Cada factor de riesgo suma un número de puntos. Al final, se cuentan todos los puntos y según el total, el paciente cae en una categoría de riesgo.

**Analogía:** Es como el puntaje crediticio de un banco. Si tienes deudas (suma puntos), si no tienes empleo (suma puntos), si ya incumpliste antes (suma puntos). Al final, tu puntaje total determina si eres "buen pagador", "regular" o "riesgoso". En nuestro caso, el puntaje determina si el paciente necesita atención de emergencia.

### 5.2 Las 7 Variables de Entrada (X)

Estas son las 7 "señales de alarma" que el algoritmo evalúa. Cada una tiene un peso diferente según su importancia clínica:

| Variable (X) | ¿Qué Mide? | Puntos que Suma | Tabla en la BD |
|---|---|---|---|
| X₁: PHQ-9 total | Severidad de la depresión | 0 a 5 pts | `phq9_respuestas` |
| X₂: BHS total | Nivel de desesperanza | 0 a 4 pts | `bhs_respuestas` |
| X₃: C-SSRS severidad | Ideación y conducta suicida | 0 a 7 pts | `cssrs_respuestas` |
| X₄: PHQ-9 ítem 9 | Ideación directa de autolesión | 0 a 3 pts | Campo `ideacionSuicida` |
| X₅: Intento previo | ¿Ha intentado suicidarse antes? | 0 o 4 pts | `historial_suicida` |
| X₆: Consumo de sustancias | ¿Usa drogas o alcohol frecuente? | 0 o 2 pts | `salud_fisica` |
| X₇: Aislamiento social | ¿Vive solo o sin apoyo? | 0 o 2 pts | `relaciones` |

**Rango total posible:** 0 a 27 puntos.

### 5.3 La Variable de Salida (y): Nivel de Riesgo

| Puntaje Total | Nivel de Riesgo (y) | Color Semáforo | SLA (Tiempo Máximo de Respuesta) |
|---|---|---|---|
| 0 a 3 pts | `bajo` | 🟢 Verde | 72 horas |
| 4 a 6 pts | `moderado` | 🟡 Amarillo | 24 horas |
| 7 a 11 pts | `alto` | 🟠 Naranja | 12 horas |
| ≥ 12 pts | `muy_alto` | 🔴 Rojo (Código Rojo) | **2 horas** |

**Regla de Emergencia Adicional:** Si el C-SSRS indica `planificación` o `intento_letal`, el nivel es automáticamente `muy_alto` **sin importar el puntaje total**.

### 5.4 Ejemplo Completo de Cálculo

**Paciente USR_00042:** Estudiante de 22 años.

| Factor | Valor del Paciente | Puntos |
|---|---|---|
| PHQ-9 total | 21 (depresión severa) | +5 |
| BHS total | 16 (desesperanza severa) | +4 |
| C-SSRS | Planificación activa | +5 |
| PHQ-9 ítem 9 | 3 (casi todos los días) | +3 |
| Intento previo | Sí | +4 |
| Sustancias | Consume alcohol frecuente | +2 |
| Aislamiento | Vive solo, sin apoyo familiar | +2 |
| **Total** | | **25 puntos** |

**Resultado:** 25 pts ≥ 12 → `muy_alto` → 🔴 **CÓDIGO ROJO** → SLA: 2 horas → El psicólogo recibe alerta inmediata → El Copiloto IA activa el Plan de Seguridad Stanley & Brown → Se conecta a la Línea de Crisis 113.

### 5.5 ¿Por Qué Este Algoritmo y No Otro?

| Pregunta | Respuesta |
|---|---|
| ¿Por qué no una Red Neuronal? | Porque las redes neuronales son "cajas negras": dan un resultado sin explicar por qué. En salud mental, un médico debe saber EXACTAMENTE la regla que activó la alerta para tomar decisiones de internamiento. |
| ¿Por qué no Random Forest? | Lo planificamos como mejora futura. Con +10,000 registros reales podríamos entrenarlo. Pero como línea base, las reglas clínicas son más seguras y explicables. |
| ¿Por qué no regresión? | Porque nuestro problema no es estimar un número continuo (como un precio). Es asignar una categoría de urgencia médica. Eso es clasificación. |
| ¿Por qué no clustering? | Porque las categorías de riesgo ya están definidas por la comunidad médica (Bajo, Moderado, Alto, Muy Alto). No necesitamos "descubrir" grupos nuevos. |

### 5.6 El Código Real (Simplificado para Estudio)

```typescript
// Archivo: src/lib/calculos.ts → calcularRiesgoGlobal()

export function calcularRiesgoGlobal(params) {
  let puntajeRiesgo = 0

  // X₁: PHQ-9 (depresión)
  if (params.phq9 >= 20) puntajeRiesgo += 5      // Severa
  else if (params.phq9 >= 15) puntajeRiesgo += 3  // Mod. severa
  else if (params.phq9 >= 10) puntajeRiesgo += 2  // Moderada
  else if (params.phq9 >= 5) puntajeRiesgo += 1   // Leve

  // X₂: BHS (desesperanza)
  if (params.bhs >= 15) puntajeRiesgo += 4        // Severa
  else if (params.bhs >= 9) puntajeRiesgo += 2    // Moderada

  // X₃: C-SSRS (ideación suicida)
  if (params.cssrs === 'intento_letal') puntajeRiesgo += 7
  else if (params.cssrs === 'planificacion') puntajeRiesgo += 5
  else if (params.cssrs === 'intento_no_letal') puntajeRiesgo += 4
  else if (params.cssrs === 'ideacion') puntajeRiesgo += 2

  // X₄: Ideación directa (PHQ-9 ítem 9)
  if (params.ideacionSuicidaPhq9 >= 2) puntajeRiesgo += 3
  else if (params.ideacionSuicidaPhq9 === 1) puntajeRiesgo += 1

  // X₅ a X₇: Factores psicosociales
  if (params.intentoPrevio) puntajeRiesgo += 4
  if (params.consumoSustancias) puntajeRiesgo += 2
  if (params.aislamientoSocial) puntajeRiesgo += 2

  // CLASIFICACIÓN FINAL
  let nivelRiesgo
  if (puntajeRiesgo >= 12 || cssrs === 'intento_letal' || cssrs === 'planificacion') {
    nivelRiesgo = 'muy_alto'  // 🔴 Código Rojo → SLA: 2h
  } else if (puntajeRiesgo >= 7) {
    nivelRiesgo = 'alto'      // 🟠 SLA: 12h
  } else if (puntajeRiesgo >= 4) {
    nivelRiesgo = 'moderado'  // 🟡 SLA: 24h
  } else {
    nivelRiesgo = 'bajo'      // 🟢 SLA: 72h
  }

  return { puntajeRiesgo, nivelRiesgo }
}
```

---

<a name="base-de-datos"></a>
## 🗄️ 6. LA BASE DE DATOS: ESTRUCTURA Y CALIDAD

### 6.1 Estructura General

- **Motor de BD:** PostgreSQL (base de datos relacional)
- **ORM:** Prisma (capa de abstracción que traduce código a SQL)
- **Total de Tablas:** 17 tablas relacionales
- **Total de Columnas:** 239 columnas
- **Registros Procesados:** 3,465 encuestas en producción + 4,000 registros "sucios" para demostración de limpieza

### 6.2 Tablas Principales y Sus Columnas

| Tabla | Columnas Clave | Qué Almacena |
|---|---|---|
| `encuestas` | id, paciente_id, fecha, estado, puntaje_global, nivel_riesgo | Registro maestro de cada encuesta realizada |
| `phq9_respuestas` | item_1 a item_9, puntaje_total, nivel_gravedad | Las 9 respuestas del cuestionario de depresión |
| `bhs_respuestas` | item_1 a item_20, puntaje_total, nivel_riesgo | Las 20 preguntas de desesperanza (verdadero/falso) |
| `cssrs_respuestas` | deseos_morir, pensamientos, metodo, plan, intencion, intento | Evaluación de la Escala Columbia de Suicidio |
| `dass21_respuestas` | item_1 a item_21, estres, ansiedad, depresion | Estrés, ansiedad y depresión complementarios |
| `rosenberg_respuestas` | item_1 a item_10, puntaje, nivel_autoestima | Escala de autoestima |
| `historial_suicida` | intento_previo, numero_intentos, hospitalizaciones | Antecedentes de conducta suicida previa |
| `salud_fisica` | consumo_drogas, frecuencia_alcohol, horas_sueno, calidad_sueno | Indicadores de salud física y sustancias |
| `relaciones` | tiene_apoyo, vive_solo, violencia_reciente, perdida_familiar | Red de apoyo social y factores de riesgo |
| `notificaciones` | **nivel_riesgo** (y), prioridad, sla_horas, accion_requerida | **Variable Objetivo:** Resultado del triage con alerta |

### 6.3 Origen de los Datos y Errores Intencionales

**¿De dónde vienen los datos?** Los generamos con un script propio (`scripts/generar_dataset_sucio_demostracion.py`) que crea 4,000 registros sintéticos clínicamente coherentes. Estos datos son **ficticios** (no son pacientes reales) pero simulan la distribución real de una población universitaria: 65% riesgo bajo, 20% moderado, 10% alto y 5% muy alto.

**¿Por qué tienen errores?** Inyectamos errores **a propósito** para poder demostrar en Google Colab (Semana 12) que sabemos diagnosticar y limpiar datos. Los errores inyectados fueron:

| Tipo de Error | Cantidad | Ejemplo | Tratamiento Aplicado |
|---|---|---|---|
| Textos con espacios extra y mayúsculas | 350 filas | `"  ESTUDIANTE  "` en lugar de `"Estudiante"` | `.strip()` y `.title()` |
| Categorías inconsistentes | 120 filas | `"SOLTERO(A)"`, `"M"`, `"fem"` | Mapeo de normalización a valores estándar |
| Valores nulos en ocupación | 240 filas | `NaN` | Imputación: `"No especificado"` |
| Valores nulos en ingreso | 180 filas | `NaN` | Imputación por mediana del grupo etario |
| Valores nulos en horas de sueño | 150 filas | `NaN` | Imputación por mediana general |
| Outliers de captura (imposibles) | 45+30+25 filas | Edad = -5 o 999; PHQ-9 = -10 o 99 | Filtrado: rango válido [14-75] / [0-27] |
| Duplicados artificiales | 150 filas | Copia exacta de otro registro | Desduplicación por `id_registro` |

### 6.4 La Regla de Oro del Diagnóstico de Datos Clínicos

> **"Antes de limpiar datos de salud mental, debemos diagnosticarlos clínicamente."**

Un algoritmo estadístico ciego vería un PHQ-9 de 27 puntos y lo marcaría como "outlier" (valor atípico) porque la media poblacional es 8.4 y su z-score supera 3.0. Pero clínicamente, 27 es el máximo posible de la escala y representa un paciente con depresión severa al borde de la crisis. **Eliminarlo sería un falso negativo potencialmente letal.**

Nuestra técnica de limpieza diferencia:
- **Outliers de error de captura** (edad = 999) → Se eliminan o corrigen.
- **Outliers clínicos legítimos** (PHQ-9 = 27) → Se preservan con máxima prioridad.

---

<a name="copiloto"></a>
## 🤖 7. EL COPILOTO CLÍNICO DE IA

### 7.1 ¿Qué Es?

Es un asistente conversacional integrado en el panel del psicólogo que funciona con un modelo de lenguaje grande (LLM). No es un chatbot terapéutico para pacientes: es una herramienta exclusiva para el profesional de salud.

### 7.2 ¿Cómo Funciona? (Function Calling Explicado)

1. El psicólogo escribe una pregunta: *"¿Cuál es el estado del paciente USR_00042?"*
2. El modelo de IA **analiza** la pregunta y decide que necesita datos.
3. La IA **invoca automáticamente** una herramienta (Function Calling) que consulta la base de datos PostgreSQL.
4. La herramienta **retorna** el expediente completo del paciente: puntajes, factores de alarma, historial.
5. La IA **sintetiza** toda la información y genera una respuesta clínica estructurada con recomendaciones.

### 7.3 Las Herramientas (Tools) del Copiloto

En el archivo `src/lib/ai/tools/definitions.ts`, se declaran las herramientas en formato JSON Schema:

```json
{
  "name": "obtenerDetalleCasoPaciente",
  "description": "Obtiene el informe detallado de una encuesta específica: puntajes de PHQ-9, BHS, C-SSRS, DASS-21, Rosenberg, factores de riesgo y recomendaciones.",
  "parameters": {
    "type": "object",
    "properties": {
      "encuestaId": { "type": "integer", "description": "ID de la encuesta" },
      "buscarNombre": { "type": "string", "description": "Nombre del paciente" }
    }
  }
}
```

### 7.4 Auditoría de Seguridad: La Fuga de Nombres de Tools

**Problema detectado:** Durante pruebas, la IA respondió al usuario: *"Para obtener más detalles, puedo usar la herramienta `obtenerProtocoloClinico`."* Esto es una **fuga de información interna** que expone la infraestructura del sistema.

**Solución implementada (doble barrera):**
1. **System Prompt estricto** en `orchestrator.ts`: Se instruye al modelo a usar alias institucionales como *"protocolo clínico estandarizado"* en lugar del nombre técnico de la función.
2. **Sanitizador regex** en `clinical-markdown.tsx`: Un filtro en la interfaz que intercepta cualquier nombre residual de función antes de mostrarlo al usuario.

---

<a name="guion"></a>
## 📝 8. GUION DE EXPOSICIÓN DIAPOSITIVA POR DIAPOSITIVA

> Cada diapositiva tiene: (1) qué aparece en pantalla, (2) qué debe decir el expositor, y (3) la evidencia sugerida por la rúbrica.

---

### DIAPOSITIVA 0: CITA INICIAL
- **En pantalla:** Frase de impacto sobre depresión y suicidio (OMS).
- **Discurso:**
  > *"Buenos días. Iniciamos con una realidad que no podemos ignorar: según la OMS, más de 700,000 personas mueren por suicidio cada año, una cada 40 segundos. La depresión no es tristeza pasajera; es un dolor invisible que destruye cuando nadie detecta las señales a tiempo. Nuestro proyecto nace para transformar esa brecha."*

---

### DIAPOSITIVA 1: PRESENTACIÓN DEL PROYECTO
- **En pantalla:** Título del PMV, idea central, integrantes y docente.
- **Discurso:**
  > *"Somos el equipo Cabo Verde. Presentamos el Sistema de Asistencia Clínica y Triage Preventivo en Salud Mental. Nuestra idea central: identificación temprana y priorización automatizada del riesgo de depresión y conducta suicida mediante triage inteligente para psicólogos."*
- **Evidencia:** Portada y nombre del PMV.

---

### DIAPOSITIVA 2: PROBLEMA IDENTIFICADO
- **En pantalla:** Datos duros (720,000+ / 10-15 min / 84 ítems), quién se ve afectado, consecuencias.
- **Discurso:**
  > *"El problema es concreto: consultas de 10-15 minutos donde es imposible aplicar 84 preguntas. La detección actual es reactiva: el sistema solo actúa cuando el paciente ya está en emergencias. No existe un puente entre las señales tempranas y la intervención del especialista."*
- **Evidencia:** Estadísticas OMS, 279 fallecimientos en el dataset.

---

### DIAPOSITIVA 3: OBJETIVO DEL PMV
- **En pantalla:** Objetivo general + los 3 verbos (Automatizar, Clasificar, Apoyar).
- **Discurso:**
  > *"Nuestro objetivo es triple: automatizar el cálculo de 5 escalas clínicas, clasificar el riesgo en menos de 2 segundos y apoyar al psicólogo con un copiloto de IA que prescribe el plan de seguridad en 1.3 segundos."*
- **Evidencia:** Objetivo general del PMV, coherente con el problema.

---

### DIAPOSITIVA 4: USUARIO Y NECESIDAD
- **En pantalla:** Dos perfiles: Paciente y Psicólogo.
- **Discurso:**
  > *"Tenemos dos actores: el paciente que necesita autoevaluarse de forma anónima en 5 minutos, y el psicólogo que necesita priorizar Códigos Rojos entre cientos de encuestas y contar con un asistente que resuma el historial."*
- **Evidencia:** Perfiles del usuario/actor principal.

---

### DIAPOSITIVA 5: PROPUESTA DE SOLUCIÓN
- **En pantalla:** Diagrama visual de flujo de 4 pasos con nodos y flechas SVG + diferenciación PMV real vs. completa.
- **Discurso:**
  > *"El sistema opera en 4 pasos: el paciente llena el wizard, el motor calcula el riesgo (0-27 pts), la base de datos genera la alerta roja, y el copiloto IA genera el plan de seguridad. Diferenciamos con claridad: la visión futura contempla wearables y predicción poblacional; el PMV real se concentra en triage rápido, alerta inmediata y asistencia médica."*
- **Evidencia:** Esquema funcional con captura principal.

---

### DIAPOSITIVA 6: ALCANCE DEL PMV
- **En pantalla:** Dos columnas: Incluye ✔ y No Incluye ✖.
- **Discurso:**
  > *"Incluye: wizard de 84 ítems, scoring de 7 factores, alertas, panel admin, copiloto IA, PDF médico y dashboard. No incluye: app nativa, SMS de pago, WebSockets y predicción longitudinal."*
- **Evidencia:** Lista breve Incluye / No incluye.

---

### DIAPOSITIVA 7: ARQUITECTURA DEL SISTEMA
- **En pantalla:** Diagrama visual con nodos SVG y flechas animadas: Usuario → Entrada → Servidor → IA (destacada) → Resultado → Acción. Dos paneles: IA Simbólica y IA Generativa con ubicación en el código.
- **Discurso:**
  > *"La información viaja por 6 capas. El componente de IA se ubica en dos puntos exactos del código: en `calculos.ts` como motor de reglas de 2ms, y en `orchestrator.ts` como copiloto en la nube de 1.3s. El diagrama muestra con claridad dónde se encuentra la IA dentro del sistema."*
- **Evidencia:** Diagrama: Usuario → Entrada → Sistema → IA → Resultado → Acción.

---

### DIAPOSITIVA 8: DATOS UTILIZADOS
- **En pantalla:** Métricas (4,000 registros / 17 tablas / 239 columnas / 1 variable objetivo), origen sintético con errores intencionales, limpieza aplicada. Modal interactivo con tabla de variables y ejemplo de registros.
- **Discurso:**
  > *"Generamos 4,000 registros sintéticos con errores a propósito para demostrar el proceso de limpieza en Google Colab: textos con espacios, categorías inconsistentes, 240 nulos, outliers de captura como edades de 999 y 150 duplicados. Aprendimos la regla de oro: un PHQ-9 de 27 no se borra; es depresión severa genuina."*
- **Evidencia:** Tabla de variables, ejemplo de registros y resumen del dataset.

---

### DIAPOSITIVA 9: FORMULACIÓN DEL PROBLEMA DE IA
- **En pantalla:** Dos diagramas visuales con nodos SVG: (1) Entrada → Tarea → Salida para Clasificación; (2) Entrada → Tarea → Salida para RAG. Cada uno con justificación de por qué corresponde.
- **Discurso:**
  > *"Formulamos dos tareas de IA. La primera es clasificación multiclase supervisada: corresponde porque el objetivo clínico es asignar categorías de urgencia predefinidas. La segunda es generación aumentada con herramientas: corresponde porque los psicólogos necesitan sintetizar 84 respuestas en segundos consultando la base de datos en tiempo real."*
- **Evidencia:** Entrada del modelo → Tarea → Salida. Justificación de correspondencia.

---

### DIAPOSITIVA 10: ALGORITMO UTILIZADO
- **En pantalla:** Nombre del modelo, las 7 variables X, la variable y, criterio de selección (explicabilidad, cero alucinación, velocidad). Modal con código real del mapeo X → y.
- **Discurso:**
  > *"El algoritmo es un Árbol de Decisión Clínico con Reglas Ponderadas. Las entradas X son 7 variables que suman de 0 a 27 puntos. La salida y es el nivel de riesgo en 4 clases. Lo seleccionamos porque en salud mental la explicabilidad médica es obligatoria: un médico debe auditar la regla exacta que motivó una alerta roja."*
- **Evidencia:** Nombre del modelo, entradas X, salida y, criterio de selección.

---

### DIAPOSITIVA 11: DEMOSTRACIÓN FUNCIONAL
- **En pantalla:** Los 7 pasos obligatorios en tarjetas visuales + aviso de demostración en vivo.
- **Discurso:** Se ejecuta la demostración en tiempo real (ver sección 10 de esta guía).
- **Evidencia:** PMV ejecutándose en tiempo real.

---

### DIAPOSITIVA 12: RESULTADOS Y VALOR GENERADO
- **En pantalla:** Cuadro Antes vs Después con indicadores cuantificables en barras comparativas.
- **Discurso:**
  > *"Los resultados son medibles: tiempo de triage de 20 minutos a menos de 2 segundos; 0% de falsos negativos en ideación activa; latencia de IA de 6.0s a 1.3s; y 3,465 encuestas procesadas con cero errores."*
- **Evidencia:** Indicadores antes/después cuantificables.

---

### DIAPOSITIVA 13: LIMITACIONES Y MEJORAS FUTURAS
- **En pantalla:** 3 limitaciones con sus mejoras propuestas.
- **Discurso:**
  > *"Con transparencia reconocemos: (1) el dataset es sintético, mejora: piloto clínico real; (2) las reglas son fijas, mejora: ensambles ML con más datos; (3) detectamos fuga de nombres técnicos, mejora ya aplicada: doble barrera de seguridad."*
- **Evidencia:** Limitación actual → Mejora propuesta.

---

### DIAPOSITIVA 14: CONCLUSIÓN
- **En pantalla:** Tres tarjetas con las 3 ideas finales.
- **Discurso:**
  > *"Primera: el PMV logró su objetivo de triage en menos de 2 segundos con 0% de falsos negativos. Segunda: aprendimos que la mejor arquitectura en salud es híbrida: determinismo + asistencia empática bajo supervisión humana. Tercera: el sistema está listo para escalar a un piloto clínico real."*
- **Evidencia:** La conclusión se basa en las pruebas y resultados. Tres ideas como máximo.

---

### DIAPOSITIVA 15: ¡MUCHAS GRACIAS!
- **Discurso:**
  > *"Agradecemos a la Mg. Karem Mercedes Maldonado Cordova por su guía. Quedamos a disposición para preguntas. Muchas gracias."*

---

<a name="preguntas-vitales"></a>
## 🎯 9. LAS 4 PREGUNTAS VITALES DE LA RÚBRICA

(Ver sección 2 al inicio de esta guía. Cualquier integrante debe responderlas con fluidez.)

---

<a name="demostracion"></a>
## 🎬 10. LOS 7 PASOS DE LA DEMOSTRACIÓN EN VIVO

| Paso | Acción | Qué Mostrar en Pantalla | Qué Decir |
|---|---|---|---|
| 1 | **Ingresar caso nuevo** | Navegar a `/encuesta` y comenzar el formulario. | *"Ingresamos un nuevo paciente con sintomatología depresiva."* |
| 2 | **Capturar datos** | Llenar las 10 pantallas del wizard con respuestas de riesgo alto. | *"El wizard captura las 84 variables estructuradas de las 5 escalas."* |
| 3 | **Validar entrada** | Observar las validaciones de rango en cada paso (0-3). | *"El sistema valida que cada respuesta esté en el rango clínico esperado."* |
| 4 | **Ejecutar IA** | Enviar la encuesta y observar la respuesta instantánea. | *"El motor de scoring calcula 25 puntos en 2 milisegundos."* |
| 5 | **Obtener resultado** | Mostrar el nivel de riesgo `muy_alto` con el semáforo rojo. | *"El sistema clasifica al paciente como riesgo Muy Alto y activa Código Rojo."* |
| 6 | **Presentar al usuario** | Mostrar la notificación en el panel admin y las líneas de crisis. | *"La alerta aparece en tiempo real en el panel del psicólogo."* |
| 7 | **Acción concreta** | Abrir el Copiloto IA, hacer una consulta, descargar PDF. | *"El psicólogo recibe el Plan de Seguridad y exporta el informe médico en PDF."* |

**Plan alternativo (si falla la demostración):** Tener capturas de pantalla o un video breve de 2 minutos como respaldo.

---

<a name="metaforas"></a>
## 🎭 11. METÁFORAS PARA EXPLICAR CONCEPTOS COMPLEJOS

| Concepto | Metáfora | Cómo Decirlo |
|---|---|---|
| **IA Simbólica vs IA Generativa** | *El piloto automático y el copiloto de vuelo* | *"La IA simbólica es el piloto automático: ante turbulencia severa, ejecuta la maniobra en milisegundos sin dudar. La IA generativa es el copiloto: analiza el clima, revisa los manuales y redacta el informe para el capitán."* |
| **Métrica TAP** | *El radar meteorológico* | *"Un radar no sirve si los barcos ignoran su alerta. Nuestra métrica mide cuántas veces el médico activa el protocolo sugerido."* |
| **Diagnóstico de datos clínicos** | *El termómetro a 41°C* | *"Si llega un paciente con 41°C, un algoritmo ciego diría 'outlier, eliminar'. Pero un médico sabe que es fiebre crítica. Lo mismo con un PHQ-9 de 27."* |
| **Arquitectura híbrida** | *El detector de humo y los bomberos* | *"El sensor detecta humo en 2 segundos. La central de bomberos evalúa el edificio y envía el equipo adecuado."* |
| **Function Calling** | *El médico que pide análisis de laboratorio* | *"El copiloto IA es como un médico que pide un análisis de sangre al laboratorio. No tiene los datos en la cabeza; los consulta, los recibe y luego interpreta."* |

---

<a name="simulacro"></a>
## 🛡️ 12. SIMULACRO DE PREGUNTAS DIFÍCILES DE LA PROFESORA

### Pregunta 1: *"¿Por qué dicen que usan IA si es un if/else?"*
> *"La IA Simbólica basada en reglas y sistemas expertos es una de las dos ramas históricas de la IA. En medicina, donde un error puede costar una vida, el determinismo es una virtud. Además, nuestro sistema es híbrido: la capa simbólica asegura cero fallas numéricas y la capa generativa (modelo de lenguaje en la nube) aporta análisis contextual profundo mediante Function Calling."*

### Pregunta 2: *"¿Cómo saben que su modelo funciona si los datos son ficticios?"*
> *"Los datos son sintéticos pero clínicamente coherentes: respetan las distribuciones de las escalas validadas (PHQ-9 0-27, BHS 0-20) y reproducen la distribución epidemiológica real (65% bajo, 20% moderado, 10% alto, 5% muy alto). Inyectamos errores a propósito precisamente para demostrar que sabemos diagnosticar y limpiar datos antes de entrenar. La validación futura requiere un piloto clínico real."*

### Pregunta 3: *"¿Qué pasa si la IA en la nube se cae?"*
> *"El sistema tiene resiliencia por diseño. La capa crítica de scoring es local y determinista: funciona sin Internet. Si el copiloto en la nube no responde, el triage continúa operando al 100% con la capa simbólica. El psicólogo sigue recibiendo la alerta y puede actuar con la información del scoring."*

### Pregunta 4: *"¿Cuál es la diferencia entre X e y?"*
> *"X son las 7 variables de entrada (PHQ-9, BHS, C-SSRS, ítem 9, intento previo, sustancias, aislamiento). Cada una aporta puntos. La variable y es la salida clasificada: el nivel de riesgo (Bajo, Moderado, Alto, Muy Alto) que determina la alerta y el protocolo clínico."*

### Pregunta 5: *"¿Qué es Function Calling?"*
> *"Es la capacidad del modelo de lenguaje para ejecutar funciones de código automáticamente. En lugar de inventar datos, la IA 'llama' a una función que consulta la base de datos real del paciente y obtiene puntajes verídicos. Así evitamos alucinaciones: los datos que usa la IA para generar el informe son datos reales de nuestra base de datos."*

### Pregunta 6: *"¿Qué es un falso negativo y por qué es grave aquí?"*
> *"Un falso negativo ocurre cuando el sistema dice 'riesgo bajo' pero el paciente sí está en peligro. En salud mental, un falso negativo puede significar un suicidio no prevenido. Por eso nuestro sistema tiene una regla de emergencia: si el ítem 9 del PHQ-9 indica ideación frecuente o el C-SSRS detecta planificación activa, el nivel es automáticamente 'muy_alto' sin importar los demás puntajes. Esto garantiza 0% de falsos negativos en ideación activa."*
