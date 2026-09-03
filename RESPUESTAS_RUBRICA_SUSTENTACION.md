# 📋 FUNDAMENTACIÓN TÉCNICA Y PREGUNTAS CLAVE DE LA RÚBRICA — EQUIPO "CABO VERDE"
## Sustentación Oficial del Producto Mínimo Viable (PMV)
### Asignatura: Inteligencia Artificial (Semestre VI - 2026) · Docente: Mg. Karem Mercedes Maldonado Cordova
### Proyecto: Sistema de Asistencia Clínica y Triage Preventivo en Salud Mental

---

## 📌 BLOQUE 1: LAS 4 PREGUNTAS VITALES DE LA RÚBRICA

### 1. ¿Qué problema real se está resolviendo?
* **El problema de fondo:** La **detección tardía y el triage reactivo en salud mental**. Según la Organización Mundial de la Salud (OMS), cada 40 segundos se suicida una persona en el mundo (>720,000 al año), siendo la cuarta causa de muerte en jóvenes de 15 a 29 años. Más del 70% de las personas que cometen un intento emiten señales previas que no son detectadas a tiempo por los servicios de salud.
* **El cuello de botella clínico:** Las consultas psicológicas y de medicina general en atención primaria duran apenas **10 a 15 minutos**. En ese intervalo es inviable aplicar, corregir y tabular manualmente las **5 escalas clínicas psicométricas obligatorias (84 ítems en total)**:
  * **PHQ-9:** Cuestionario de salud del paciente para depresión (9 preguntas).
  * **BHS:** Escala de desesperanza de Beck (20 preguntas V/F).
  * **C-SSRS:** Escala Columbia para evaluar riesgo e ideación suicida (7 preguntas).
  * **DASS-21:** Escala de depresión, ansiedad y estrés (21 preguntas).
  * **Rosenberg:** Escala de autoestima (10 preguntas).
* **La consecuencia:** La atención médica llega únicamente cuando el paciente ya se encuentra en la sala de urgencias tras un intento consumado. El sistema de salud actúa como un hospital de bomberos apagando emergencias en lugar de prevenir.

---

### 2. ¿Qué parte del problema resuelve el PMV desarrollado?
El PMV no pretende sustituir al psicólogo ni brindar terapia automatizada; resuelve específicamente el **puente crítico de detección temprana y priorización clínica inmediata**:
1. **Digitaliza y automatiza el tamizaje:** El paciente completa los 84 ítems en un formulario web asistido (wizard de 10 pasos) en ~5 minutos desde cualquier dispositivo.
2. **Triage automatizado en tiempo real:** Clasifica el nivel de riesgo del paciente (**Bajo, Moderado, Alto o Muy Alto**) en **menos de 2 milisegundos**.
3. **Generación instantánea de Código Rojo:** Si detecta ideación activa o combinación crítica de factores, inserta una alerta de prioridad crítica en el panel del psicólogo con un **SLA de atención de 2 horas** y muestra de inmediato los canales de auxilio de emergencia (Línea 113 opción 5 / Línea 988).
4. **Asistencia a la prescripción médica:** Genera el borrador del **Plan de Seguridad (Stanley & Brown)** y el informe clínico en PDF para que el profesional tome decisiones informadas en su primera consulta sin perder tiempo calculando baremos.

---

### 3. ¿Cómo interviene la Inteligencia Artificial dentro de la solución?
La IA interviene mediante una **arquitectura híbrida de dos capas**, asignando a cada técnica de IA la tarea donde es más segura, rápida y explicable:

* **Capa 1: IA Simbólica / Sistema Experto Clínico (`src/lib/calculos.ts` -> `calcularRiesgoGlobal`)**
  * **Rol:** Ejecuta el scoring ponderado y el árbol de decisión sobre 7 variables clínicas compuestas.
  * **Por qué aquí:** En salud mental no se pueden tolerar "cajas negras" ni alucinaciones estocásticas. Esta IA opera en **2 milisegundos**, es 100% determinista, auditable regla por regla y garantiza **0% de falsos negativos en pacientes con ideación activa o planificación suicida**.
* **Capa 2: IA Generativa Asistencial con Function Calling (`src/lib/ai/orchestrator.ts`)**
  * **Rol:** Actúa como copiloto clínico para el profesional. Cuando el psicólogo consulta sobre un caso, el modelo ejecuta **Function Calling** para extraer de forma estructurada los puntajes y factores de la base de datos relacional (`obtenerDetalleCasoPaciente`) y redacta el informe clínico, identificando inconsistencias psicométricas cruzadas y formulando el Plan de Seguridad en **1.3 segundos**.

---

### 4. ¿Qué evidencias demuestran que el PMV funciona y aporta valor?
* **Evidencia de Desempeño Operativo:** 
  * Reducción del tiempo de cálculo psicométrico de **15–20 minutos manuales a 2 milisegundos**.
  * Latencia de generación de informe asistido con IA optimizada de **6.0 segundos a 1.3 segundos**.
* **Evidencia en Base de Datos y Volumen:**
  * **3,465 encuestas procesadas y persistidas** en producción a través de un esquema relacional de **17 tablas y 239 columnas** en PostgreSQL (Prisma ORM).
* **Evidencia de Robustez Clínica (Cero Falsos Negativos Críticos):**
  * Toda respuesta con C-SSRS en `planificacion` o `intento_letal`, o ítem 9 de PHQ-9 $\ge 2$, dispara de forma determinista el nivel `muy_alto` y la alerta roja con SLA de 2 horas, sin depender de la variabilidad estocástica de un LLM.
* **Evidencia de Software Funcionando (Demostración en Vivo):**
  * El flujo completo se ejecuta de punta a punta: desde el llenado de la encuesta por el paciente, el cálculo y persistencia en base de datos, el semáforo de crisis en pantalla, hasta la consulta interactiva con el Copiloto IA y la exportación del PDF clínico.

---

## 📌 BLOQUE 2: PROFUNDIZACIÓN TÉCNICA REQUERIDA

### A. Problema: Qué situación concreta se desea mejorar y por qué requiere solución tecnológica
* **Situación:** La sobrecarga asistencial en los centros de salud mental comunitarios y tópicos universitarios, donde 1 solo psicólogo atiende a cientos de personas y debe clasificar la urgencia "a ojo" o revisando hojas de papel desordenadas.
* **Por qué requiere tecnología:**
  1. **Velocidad de procesamiento:** Un humano tarda minutos sumando e interpretando los 84 ítems; un algoritmo lo hace en milisegundos sin error aritmético.
  2. **Vigilancia 24/7:** Las crisis de salud mental suelen ocurrir de noche o fines de semana, cuando los consultorios están cerrados. La plataforma web recibe el formulario a cualquier hora, detecta la crisis y entrega de inmediato los números de auxilio.
  3. **Trazabilidad médico-legal:** La ley de salud mental exige registro documentado de por qué se priorizó a un paciente y qué protocolo se activó. El sistema guarda cada cálculo con fecha, hora, puntajes parciales y factores de alarma.

---

### B. Datos: Origen, variables, problemas de calidad y limpieza
* **Origen de los datos:**
  * Dataset clínico estructurado de **4,000 registros** generado con base en distribuciones epidemiológicas validadas (`scripts/generar_dataset_sucio_demostracion.py`), diseñado con errores inyectados intencionalmente para la práctica de calidad de datos en Google Colab (Semana 12).
* **Variables principales:**
  * **Variables Predictoras ($X$ - Entradas del Modelo):**
    * $X_1$: `phq9_puntaje_total` (numérica continua [0–27], mide depresión).
    * $X_2$: `bhs_desesperanza_total` (numérica discreta [0–20], mide desesperanza de Beck).
    * $X_3$: `cssrs_nivel_severidad` (categórica ordinal: `ninguna`, `ideacion`, `intento_no_letal`, `planificacion`, `intento_letal`).
    * $X_4$: `phq9_item_9_ideacion` (ordinal [0–3], pensamientos de muerte o autolesión).
    * $X_5$: `historial_intento_previo` (booleana, factor de riesgo clínico crítico).
    * $X_6$: `consumo_sustancias` (booleana, consumo frecuente de alcohol o drogas).
    * $X_7$: `aislamiento_social` (booleana, carencia de red de apoyo social).
  * **Variable Objetivo ($y$ - Salida del Modelo):**
    * `nivel_riesgo_objetivo` (categórica multiclase: `bajo`, `moderado`, `alto`, `muy_alto`).
* **Problemas de Calidad Detectados y Limpieza:**
  * **Ruido de texto y mayúsculas inconsistentes (350 casos):** Textos con espacios en blanco extras (`"  Estudiante  "`) o mezclas de mayúsculas/minúsculas. *Solución:* Normalización vectorial con `.str.strip()` y `.str.title()`.
  * **Valores nulos / faltantes (240 en ocupación, 180 en ingreso económico):** *Solución:* Imputación clínica contextual: asignación de categoría `"No especificado"` en texto y reemplazo por la mediana del estrato socioeconómico en variables numéricas.
  * **Outliers por error de captura (45 edades anómalas: -5 y 999 años; PHQ-9 con -10 y 99):** *Solución:* Filtrado por rangos biológicos y psicométricos válidos (Edad: $[14, 75]$; PHQ-9: $[0, 27]$).
  * **Outliers clínicos legítimos (PHQ-9 = 27):** *Regla de Oro:* Un análisis estadístico simple basado en desvío estándar marcaría un puntaje de 27 como "outlier a eliminar". **En salud mental, un PHQ-9 de 27 representa la máxima gravedad depresiva; eliminarlo causaría un falso negativo mortal.** Se conserva intacto.
  * **Duplicados artificiales (150 registros):** *Solución:* Deduplicación por hash de identidad y combinación temporal de encuesta.

---

### C. Tipo de IA: Tareas realizadas
El sistema ejecuta **dos tareas formales de Inteligencia Artificial**:

1. **Clasificación Multiclase Supervisada (Triage Clínico):**
   * *Entrada ($X$):* Vector de 7 variables psicométricas y psicosociales.
   * *Salida ($y$):* Asignación determinista a una de 4 clases disjuntas: `bajo` (72h SLA), `moderado` (24h SLA), `alto` (12h SLA), o `muy_alto` (2h SLA - Código Rojo).
   * *Por qué NO es regresión:* Porque el objetivo de un triage de salud no es predecir un valor continuo infinito (ej. calcular un precio en soles), sino asignar una categoría operativa de intervención clínica.
   * *Por qué NO es clustering:* Porque no se están descubriendo grupos a ciegas en el vacío; las categorías clínicas (`bajo` a `muy_alto`) ya están estandarizadas por la psiquiatría internacional.
2. **Generación Asistencial con Recuperación Aumentada (RAG con Function Calling):**
   * *Entrada:* Historial clínico recuperado de la base de datos + consulta del psicólogo.
   * *Salida:* Síntesis estructurada del caso, detección de inconsistencias psicométricas cruzadas (ej. PHQ-9 bajo pero BHS extremo) y borrador del Plan de Seguridad de 6 pasos.

---

### D. Modelo/Algoritmo: Justificación y correspondencia con el problema
* **Algoritmo seleccionado para el Triage:** **Árbol de Decisión Clínico con Reglas de Puntuación Ponderada** (`calcularRiesgoGlobal`).
* **Justificación de su elección:**
  1. **Explicabilidad Médica Obligatoria (XAI):** La regulación sanitaria y la ética médica prohíben someter a un paciente a un protocolo de internamiento involuntario o crisis basado en una "caja negra" (como una red neuronal profunda que no explica sus pesos). El psicólogo puede auditar con precisión: *"El paciente sumó 5 pts por PHQ-9 severo + 5 pts por C-SSRS con plan + 4 pts por intento previo = 14 pts $\rightarrow$ Muy Alto"*.
  2. **Cero Estocasticidad:** Los modelos de lenguaje o clasificadores probabilísticos pueden variar sus respuestas ante pequeñas perturbaciones de texto. El motor de scoring asegura que para las mismas respuestas, el resultado de triage es 100% reproducible y constante.
  3. **Eficiencia y Disponibilidad:** Se ejecuta en el servidor local en **2 ms**, sin costos de API externa y funcionando incluso ante caídas de la red de internet.

---

### E. Trazabilidad y Límites: Qué funciona realmente y qué es propuesta futura

| Aspecto | Estado en el Proyecto | Detalle Técnico |
|---|---|---|
| **Formulario Web Wizard (84 ítems)** | ✅ **Funciona Realmente** | 10 pasos interactivos con validación de rangos en cliente y servidor. |
| **Motor de Scoring (2 ms)** | ✅ **Funciona Realmente** | Algoritmo determinista en `src/lib/calculos.ts` con 7 variables ponderadas. |
| **Persistencia en Base de Datos** | ✅ **Funciona Realmente** | PostgreSQL gestionado con Prisma ORM (17 tablas, 239 columnas). |
| **Sistema de Alertas y Semáforo** | ✅ **Funciona Realmente** | Código Rojo en pantalla y registro en tabla `notificaciones` con SLA de 2h. |
| **Copiloto Clínico con Function Calling** | ✅ **Funciona Realmente** | Consulta a BD con herramienta `obtenerDetalleCasoPaciente` y genera reporte en 1.3s. |
| **Exportación a PDF** | ✅ **Funciona Realmente** | Generación de informe médico listo para archivar en historia clínica. |
| **Dataset de 4,000 registros** | ⚠️ **Simulación Controlada** | Datos sintéticos clínicamente consistentes con errores inyectados para fines docentes y protección de privacidad (Ley N.° 29733). |
| **Alertas SMS / WhatsApp** | 🔮 **Propuesta Futura** | Requiere integración con gateways de mensajería de pago (ej. Twilio). |
| **Modelos de ML (Random Forest/XGBoost)** | 🔮 **Propuesta Futura** | Planificado para entrenarse cuando se cuente con $>10,000$ casos de un piloto hospitalario. |
| **Integración con Wearables** | 🔮 **Propuesta Futura** | Monitoreo biométrico continuo de sueño y ritmo cardíaco. |
| **App Móvil Nativa (iOS/Android)** | 🔮 **Propuesta Futura** | Actualmente la plataforma web responsive cubre el 100% de dispositivos. |
