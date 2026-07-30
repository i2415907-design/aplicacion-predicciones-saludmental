# Comprensión de Datos — Sistema de BI e IA para la Prevención de la Depresión y el Riesgo Suicida

**Instituto Continental** — Comprensión de Datos para Sistemas de Inteligencia Artificial
**Docente:** Ing. Karem Maldonado Córdova
**Proyecto:** Sistema de BI e Inteligencia Artificial para la Prevención de la Depresión y el Riesgo Suicida
**Stack:** Next.js 16, React 19, Prisma 5.22, PostgreSQL (Supabase), LLaMA 3.3 70B (Groq API)

> *"La calidad de un sistema de Inteligencia Artificial depende más de la calidad de sus datos que de la complejidad del algoritmo."*

---

## Introducción

La **Comprensión de Datos** (Data Understanding) es la etapa del proceso de Ciencia de Datos en la que se estudian los datos disponibles para conocer sus características, evaluar su calidad y determinar si son adecuados para resolver el problema planteado. Según la definición de la clase, durante esta etapa el analista busca responder:

- ¿Qué datos existen y quién los genera?
- ¿Son suficientes y confiables?
- ¿Qué información contienen?
- ¿Qué problemas presentan?

Este documento aplica esos principios al proyecto de prevención de depresión y riesgo suicida, respondiendo las preguntas solicitadas y completando la ficha de análisis del conjunto de datos.

---

## PARTE 1: ¿Qué datos necesita mi proyecto?

### 01. ¿Qué información necesita?

El sistema captura **70 variables** organizadas en 10 dominios clínicos y socioemocionales. Según los conceptos de la clase, cada **variable** es una columna que representa una característica medida, cada **registro** es un caso (una encuesta completa), y cada **observación** es el valor concreto de una variable en un registro.

| Dominio | Cantidad de Variables | Tipo de Dato | Ejemplo de Variable |
|---|---|---|---|
| Datos demográficos | 7 | Numéricos y categóricos | Edad (numérica), Sexo (categórica), Ingreso mensual (categórica ordinal) |
| Depresión (PHQ-9) | 11 | Numéricos discretos | Ítems 1-9 (0-3 cada uno), Puntaje total (0-27), Nivel de gravedad |
| Ideación suicida (C-SSRS) | 9 | Booleanos y categóricos | Deseos morir (bool), Nivel de severidad (categórica ordinal) |
| Desesperanza (BHS) | 22 | Booleanos y numéricos | 20 ítems (true/false), Puntaje total (0-20) |
| Autoestima (Rosenberg) | 11 | Numéricos discretos | 10 ítems Likert (1-4 cada uno) |
| Ansiedad, estrés y depresión (DASS-21) | 24 | Numéricos discretos | 21 ítems (0-3), 3 subescalas calculadas (×2) |
| Factores socioeconómicos | 16 | Categóricos, numéricos y booleanos | Estado laboral (categórica), Satisfacción laboral (1-5), Vive solo (bool) |
| Salud física | 13 | Booleanos, numéricos y categóricos | Enfermedad crónica (bool), Calidad de sueño (1-5), Frecuencia alcohol (ordinal) |
| Factores psicológicos | 17 | Booleanos y numéricos | Eventos vitales 8 tipos (bool), Impulsividad (1-5) |
| Historial clínico | 8 | Numéricos y booleanos | Intentos previos (num), Antecedentes familiares (bool) |

**Tipos de datos presentes en el proyecto (según clasificación de IA):**
- **Numéricos:** Edad, puntajes de escalas (PHQ-9, BHS, DASS-21, Rosenberg), horas de sueño, intentos previos
- **Categóricos:** Sexo, estado civil, nivel educativo, zona de residencia, frecuencia de consumo
- **Booleanos (binarios):** Ítems de C-SSRS, BHS, eventos vitales, consumo de sustancias
- **Texto:** Ocupación, tipo de drogas, notas de casos archivados
- **Imágenes, Audio, Video, Series temporales:** No se capturan actualmente en el sistema

---

### 02. ¿Quién la genera?

| Actor | Rol | Datos que Genera | Tipo de Dato |
|---|---|---|---|
| **Usuario anónimo o registrado** | Persona que completa la encuesta de autoevaluación | Las 70 variables del cuestionario (demográficos, 5 escalas clínicas, socioeconómicos, salud, psicología, historial) | Cualitativos y cuantitativos |
| **Sistema (cálculos server-side)** | Backend en Next.js + Prisma ORM | Puntajes derivados: PHQ-9 total, BHS total, DASS-21 (3 subescalas), nivel C-SSRS, riesgo global (0-23), clasificación de riesgo, notificaciones | Cuantitativos derivados |
| **Modelo de IA (LLaMA 3.3 70B vía Groq)** | Análisis inteligente del chatbot | 4 dimensiones de análisis: descriptivo, diagnóstico, predictivo, prescriptivo. Recomendaciones basadas en el cruce de variables | Texto estructurado (JSON) |
| **Administrador/Psicólogo** | Profesional que revisa el dashboard | Respuestas a notificaciones, notas de casos archivados, clasificación de categorías | Texto |
| **Encuesta de satisfacción** | Feedback del usuario | Puntuación 1-5 de utilidad percibida | Cuantitativo discreto |

**Concepto clave:** Los datos primarios provienen del usuario (autoevaluación). Los datos derivados se calculan server-side. Los datos de IA se generan on-demand.

---

### 03. ¿Dónde se almacena?

| Capa | Tecnología | Ubicación | Descripción |
|---|---|---|---|
| **Base de datos relacional** | PostgreSQL (Supabase) | Nube (AWS us-east-2) | 18 tablas: `encuestas`, `phq9_respuestas`, `cssrs_respuestas`, `bhs_respuestas`, `rosenberg_respuestas`, `dass21_respuestas`, `factores_socioeconomicos`, `salud_fisica`, `factores_psicologicos`, `historial_intentos`, `analisis_ia`, `chat_sesiones`, `chat_mensajes`, `notificaciones`, `usuarios`, `categorias_casos`, `casos_archivados`, `sesiones_encuesta` |
| **ORM** | Prisma 5.22.0 | `prisma/schema.prisma` | Capa de abstracción entre la aplicación y la base de datos |
| **Sesión de usuario** | Next.js (cookie-based) | Cliente (navegador) | Cache de sesión autenticada |
| **Archivos generados** | PDF (jsPDF + html2canvas) | Navegador del usuario | Reportes PDF generados localmente (no se almacenan en servidor) |

**Flujo de persistencia:**
```
Frontend (React) → POST /api/encuesta → Prisma ORM → PostgreSQL (Supabase)
                                                    ↑
Frontend (React) → POST /api/chat → Groq API (LLaMA 3.3) → AnalisisIa (JSON) → PostgreSQL
```

---

### 04. ¿Cada cuánto se actualiza?

| Tipo de Dato | Frecuencia | Descripción |
|---|---|---|
| **Encuestas clínicas** | Event-driven | Cada vez que un usuario completa la evaluación (no hay periodicidad fija). Es una **serie temporal** potencial si se repiten evaluaciones del mismo usuario. |
| **Análisis IA** | On-demand | Generado cuando el usuario interactúa con el chatbot |
| **Notificaciones** | Automáticas | Se crean al generar una encuesta con nivel de riesgo ≥ moderado |
| **Sesiones de encuesta** | Tiempo real | Se actualizan a medida que el usuario avanza entre los 10 pasos |
| **Satisfacción** | Once-off | Un solo registro por encuesta, al finalizar la evaluación |
| **Dashboard/Estadísticas** | Consultas en vivo | Se calculan al cargar el panel de administración |
| **Datos del catálogo (seed)** | Estáticos | 60 perfiles predefinidos cargados una sola vez via `prisma/seed.ts` |

**Nota:** El sistema no tiene actualización periódica programada (cron jobs). Todo es transaccional e inmediato. No existen series temporales históricas porque no se implementa seguimiento longitudinal.

---

### 05. ¿Está completa?

| Aspecto | Estado | Observaciones |
|---|---|---|
| **Escalas clínicas validadas** | ✅ Completa | PHQ-9, C-SSRS, BHS, Rosenberg, DASS-21 — todas las 5 escalas están correctamente implementadas y codificadas según sus manuales oficiales |
| **Variables demográficas** | ✅ Completa | Edad, sexo, estado civil, educación, ocupación, ingreso, zona |
| **Factores protectores** | ✅ Completa | Red de apoyo, sentido de vida, personas de confianza, apoyo social percibido |
| **Eventos vitales adversos** | ✅ Completa | 8 tipos de eventos adversos capturados (pérdida familiar, violencia, abuso, bullying, desempleo, ruptura, problemas legales) |
| **Historial de intentos** | ✅ Completa | Frecuencia, edad del primer intento, método, hospitalización, antecedentes familiares |
| **Consumo de sustancias** | ✅ Completa | Alcohol, tabaco, drogas con frecuencia y tipo |
| **Variable objetivo para ML** | ⚠️ Parcial | La clasificación de riesgo se calcula por reglas heurísticas (no por ML supervisado). No hay etiqueta humana de validación clínica (diagnóstico gold-standard) |
| **Seguimiento longitudinal** | ❌ No implementado | No se registra evolución temporal de un mismo paciente. Imposible calcular tendencias o variaciones |
| **Validación externa** | ❌ No implementado | No hay diagnóstico profesional de referencia para contrastar las predicciones del sistema |
| **Consentimiento informado** | ✅ Implementado | Checkbox de consentimiento en el popup intersticial con disclaimer de uso académico |

---

### 06. ¿Qué problemas presenta?

| Problema | Tipo de Calidad | Severidad | Descripción |
|---|---|---|---|
| **Ausencia de variable objetivo validada** | Datos incorrectos | 🔴 Crítico | La variable `nivel_riesgo` se calcula con reglas heurísticas (7 variables ponderadas), no con diagnóstico clínico de referencia. Imposible entrenar un modelo ML supervisado sin etiquetas gold-standard. |
| **Datos sintéticos (seed)** | Datos sesgados | 🔴 Crítico | Los 60 perfiles del dataset son generados algorítmicamente (`prisma/seed.ts`), no provienen de pacientes reales. La distribución de variables no refleja la población real. Sesgo de distribución artificial. |
| **Valores faltantes no aleatorios (MNAR)** | Datos incompletos | 🔴 Crítico | Los usuarios en crisis tienden a abandonar la encuesta más temprano, generando datos faltantes correlacionados con la variable objetivo. Esto es un **sesgo de selección** que distorsiona el análisis. |
| **Desbalanceo de clases** | Datos sesgados | 🟡 Alto | Los casos "muy alto" riesgo e intentos suicidas son extremadamente raros en datos reales (~1-2%). Con datos sintéticos esta proporción está artificialmente forzada. El modelo tendería a predecir "bajo" riesgo. |
| **Sesgo de autorreporte** | Datos sesgados | 🟡 Alto | Todos los datos provienen de autoevaluación. El usuario puede subestimar síntomas por vergüenza o sobreestimar por ansiedad. No hay fuente de verificación cruzada. |
| **Variables predictoras omitidas** | Datos incompletos | 🟡 Medio | El algoritmo no incluye variables clínicamente relevantes: acceso a métodos letales, dolor crónico (OR 1.5-2×), impulsividad motora (OR 2-3×), abuso sexual (OR 3-10×), antecedentes familiares de suicidio (OR 2-3×). |
| **Valores atípicos ambiguos** | Datos atípicos | 🟡 Medio | Puntuaciones extremas en escalas pueden ser outliers estadísticos O señales de crisis genuina. No hay mecanismo para distinguir un error de captura de un caso clínico real. |
| **Sin seguimiento longitudinal** | Datos desactualizados | 🟠 Moderado | No se captura evolución del paciente en el tiempo. Una sola evaluación puntual limita el poder predictivo del sistema. |
| **Posibles registros duplicados** | Datos duplicados | 🟠 Bajo | Un usuario podría completar la encuesta múltiples veces. No hay restricción de unicidad por usuario en la tabla `encuestas`. |
| **Sesgo geográfico** | Datos sesgados | 🟠 Bajo | Los números de crisis (SAMU 116, Línea 100) son exclusivos de Perú. Los datos no son generalizables a otros contextos. |

---

## PARTE 2: Ficha de Análisis del Conjunto de Datos

### Exploración del Conjunto de Datos

Antes de analizar las variables, se realiza una exploración inicial del conjunto de datos siguiendo los pasos indicados en clase:

| Criterio de Exploración | Resultado |
|---|---|
| **Cantidad de registros** | 60 encuestas (generadas por `prisma/seed.ts`). En producción, cada encuesta completada genera 1 registro en `encuestas` + registros asociados en 9 tablas de respuestas. |
| **Cantidad de variables** | 70 variables por registro (divididas en 10 dominios). Cada encuesta genera registros en hasta 10 tablas relacionadas. |
| **Tipos de datos** | Numéricos (38), Categóricos (16), Booleanos (28), Texto (2). No hay imágenes, audio, video ni series temporales. |
| **Valores únicos por variable** | Edad: 14-75 años. Sexo: 4 categorías. PHQ-9 total: 0-27. BHS total: 0-20. DASS-21: 0-42 por subescala. C-SSRS: 4 niveles de severidad. |
| **Valores faltantes** | Las variables opcionales (nombre, apellido, estado civil, educación, ocupación, ingreso, zona) pueden ser NULL. Los ítems de escalas siempre tienen valor (0-3 o true/false). |
| **Distribuciones** | Los 60 perfiles seed tienen distribución artificial: ~30% alto/muy alto riesgo (en datos reales sería ~5-10%). Distribución por sexo: ~50% masculino, ~45% femenino, ~5% otro. |
| **Correlaciones esperadas** | PHQ-9 ↔ BHS (depresión-desesperanza), PHQ-9 ↔ DASS-21 depresión (convergencia), C-SSRS ↔ PHQ-9 ítem 9 (ideación), BHS ≥ 10 ↔ C-SSRS nivel elevado. |

---

### Variables

El sistema captura un total de **70 variables**. A continuación se listan todas las variables del dataset, clasificadas según su tipo:

#### Variables Numéricas (38)

| # | Dominio | Variable | Tipo | Rango | Descripción |
|---|---|---|---|---|---|
| 1 | Demográficos | Edad | Entera | 10-100 | Edad del usuario en años |
| 2 | PHQ-9 | Ítem 1: Interés/placer | Discreta | 0-3 | Frecuencia en las últimas 2 semanas |
| 3 | | Ítem 2: Estado de ánimo | Discreta | 0-3 | Sentirse deprimido, triste, sin esperanza |
| 4 | | Ítem 3: Sueño | Discreta | 0-3 | Dificultad para dormir o dormir demasiado |
| 5 | | Ítem 4: Energía | Discreta | 0-3 | Sentirse cansado o sin energía |
| 6 | | Ítem 5: Apetito | Discreta | 0-3 | Poco apetito o comer en exceso |
| 7 | | Ítem 6: Autoestima | Discreta | 0-3 | Sentirse mal consigo mismo |
| 8 | | Ítem 7: Concentración | Discreta | 0-3 | Dificultad para concentrarse |
| 9 | | Ítem 8: Psicomotricidad | Discreta | 0-3 | Moverse o hablar lentamente, o estar agitado |
| 10 | | Ítem 9: Ideación suicida | Discreta | 0-3 | Pensamientos de que sería mejor estar muerto |
| 11 | | PHQ-9 Total | Discreta | 0-27 | Suma de ítems 1-9 |
| 12 | BHS | Ítems 1-20 | Discreta | 0-1 c/u | Cada ítem: Sí (1) o No (0) |
| 13 | | BHS Total | Discreta | 0-20 | Suma de ítems verdaderos |
| 14 | Rosenberg | Ítems 1-10 | Discreta | 1-4 c/u | Escala Likert: Totalmente de acuerdo a Totalmente en desacuerdo |
| 15 | DASS-21 | Ítems 1-21 | Discreta | 0-3 c/u | Frecuencia en la semana pasada |
| 16 | | Puntaje Estrés | Continua | 0-42 | Suma de ítems 1,6,8,11,12,14,18 × 2 |
| 17 | | Puntaje Ansiedad | Continua | 0-42 | Suma de ítems 2,4,7,9,15,19,20 × 2 |
| 18 | | Puntaje Depresión | Continua | 0-42 | Suma de ítems 3,5,10,13,16,17,21 × 2 |
| 19 | Socioeconómicos | Satisfacción laboral | Discreta | 1-5 | 1=Nada satisfecho, 5=Muy satisfecho |
| 20 | | Estrés laboral | Discreta | 1-5 | 1=Nada de estrés, 5=Mucho estrés |
| 21 | | Personas de confianza | Discreta | 0-10 | Número de personas de confianza |
| 22 | | Calidad de vivienda | Discreta | 1-5 | 1=Muy mala, 5=Excelente |
| 23 | Salud física | Calidad de sueño | Discreta | 1-5 | 1=Muy mala, 5=Excelente |
| 24 | | Horas de sueño | Continua | 0-12 | Promedio de horas por noche |
| 25 | Psicológicos | ERQ Reevaluación cognitiva | Discreta | 1-7 | Regulación emocional positiva |
| 26 | | ERQ Supresión expresiva | Discreta | 1-7 | Regulación emocional negativa |
| 27 | | Impulsividad motora | Discreta | 1-5 | Barratt Impulsiveness Scale |
| 28 | | Impulsividad no planificada | Discreta | 1-5 | |
| 29 | | Impulsividad atencional | Discreta | 1-5 | |
| 30 | Historial | Intentos previos | Discreta | 0-∞ | Número de intentos suicidas previos |
| 31 | | Edad del primer intento | Discreta | 10-100 | |
| 32 | Derivadas | Riesgo global | Discreta | 0-23 | Puntaje calculado por algoritmo ponderado |
| 33 | Métricas | Satisfacción usuario | Discreta | 1-5 | Utilidad percibida de la evaluación |
| 34 | | Tiempo de sesión | Continua | 0-∞ | Segundos desde inicio hasta finalización |
| 35 | | Paso alcanzado | Discreta | 0-9 | Último paso completado en la encuesta |

#### Variables Categóricas (16)

| # | Dominio | Variable | Tipo | Categorías |
|---|---|---|---|---|
| 1 | Demográficos | Sexo | Nominal | masculino, femenino, no_binario, otro |
| 2 | | Estado civil | Nominal | soltero, casado, divorciado, viudo, union_libre |
| 3 | | Nivel educativo | Ordinal | primaria, secundaria, tecnico, universitario, posgrado |
| 4 | | Ocupación | Nominal | Texto libre |
| 5 | | Ingreso mensual | Ordinal | menos_1_smlv, 1_2_smlv, 2_4_smlv, 4_8_smlv, mas_8_smlv |
| 6 | | Zona de residencia | Nominal | urbana, rural |
| 7 | PHQ-9 | Nivel de gravedad | Ordinal | minimo, leve, moderado, moderadamente_severo, severo |
| 8 | C-SSRS | Nivel de severidad | Ordinal | ideacion, planificacion, intento_no_letal, intento_letal |
| 9 | BHS | Nivel de riesgo | Ordinal | bajo, moderado, alto |
| 10 | Socioeconómicos | Estado laboral | Nominal | empleado, desempleado, estudiante, jubilado, ama_casa |
| 11 | | Nivel de deudas | Ordinal | sin_deudas, bajo, medio, alto, muy_alto |
| 12 | Salud física | Frecuencia alcohol | Ordinal | nunca, ocasional, moderado, frecuente, diario |
| 13 | | Frecuencia tabaco | Ordinal | nunca, ocasional, moderado, frecuente, diario |
| 14 | | Frecuencia drogas | Ordinal | nunca, ocasional, moderado, frecuente, diario |
| 15 | Derivadas | Nivel de riesgo global | Ordinal | bajo, moderado, alto, muy_alto |
| 16 | | Tipo de drogas | Nominal | Texto libre |

#### Variables Booleanas (28)

| # | Dominio | Variable | Descripción |
|---|---|---|---|
| 1 | C-SSRS | Deseos de morir | ¿Ha deseado estar muerto o ir a dormir y no despertar? |
| 2 | | Pensamientos suicidas | ¿Ha tenido pensamientos de quitarse la vida? |
| 3 | | Método sin plan | ¿Ha pensado en cómo podría hacerlo? |
| 4 | | Intención sin plan | ¿Ha tenido pensamientos con intención de actuar? |
| 5 | | Plan específico | ¿Ha elaborado un plan específico e intención de ejecutarlo? |
| 6 | | Intención ejecutar | ¿Ha hecho algo o se ha preparado para terminar con su vida? |
| 7 | | Intento previo | ¿Ha intentado quitarse la vida anteriormente? |
| 8 | BHS | Ítems 1-20 | Cada ítem: Sí o No |
| 9-28 | | (20 booleanos) | 20 declaraciones sobre sentimientos de desesperanza |

#### Variables Booleanas — Salud y Psicología (12)

| # | Dominio | Variable | Descripción |
|---|---|---|---|
| 1 | Salud física | Enfermedad crónica | Diagnóstico de enfermedad crónica |
| 2 | | Dolor crónico | Experimenta dolor crónico |
| 3 | | Insomnio | Dificultades para conciliar el sueño |
| 4 | | Consume alcohol | Consumo actual de alcohol |
| 5 | | Consume tabaco | Consumo actual de tabaco |
| 6 | | Consume drogas | Consumo de drogas ilícitas |
| 7 | Psicológicos | Pérdida familiar | Pérdida de un ser querido en últimos 12 meses |
| 8 | | Violencia física | Experiencia de violencia física |
| 9 | | Violencia psicológica | Experiencia de maltrato psicológico |
| 10 | | Abuso sexual | Experiencia de abuso sexual |
| 11 | | Bullying | Experiencia de bullying o ciberbullying |
| 12 | | Desempleo | Desempleo o pérdida de empleo reciente |

#### Variables Booleanas — Factores Protectores y Historial (8)

| # | Dominio | Variable | Descripción |
|---|---|---|---|
| 1 | Psicológicos | Tiene red de apoyo | Cuenta con personas que le ayuden en momentos difíciles |
| 2 | | Percibe vida con sentido | Percibe que su vida tiene propósito |
| 3 | | Ha buscado ayuda profesional | Ha consultado a un profesional de salud mental |
| 4 | Historial | Hospitalización por intento | Fue hospitalizado debido a un intento previo |
| 5 | | Tratamiento psiquiátrico previo | Ha recibido tratamiento psiquiátrico |
| 6 | | Antecedentes familiares suicidio | Familiar con historial de suicidio |
| 7 | | Antecedentes familiares E. mental | Familiar con enfermedad mental |
| 8 | Socioeconómicos | Dificultad económica | Dificultad para cubrir necesidades básicas |

---

### Variable Objetivo

**Variable objetivo:** `nivel_riesgo` (clasificación de riesgo global)

| Aspecto | Descripción |
|---|---|
| **Nombre** | `nivel_riesgo` / `riesgoGlobal` |
| **Tipo** | Categórica ordinal |
| **Valores** | bajo (0-3), moderado (4-7), alto (8-11), muy_alto (12+) |
| **Justificación** | El objetivo del sistema es clasificar a cada usuario en un nivel de riesgo para priorizar la intervención clínica. Esta variable determina si se genera una notificación de alerta y qué tipo de acción se requiere: monitoreo rutinario, seguimiento semanal, cita profesional en 48 horas, o intervención inmediata con derivación a emergencias. |
| **Método actual** | Algoritmo heurístico ponderado basado en 7 variables predictoras. **No es un modelo ML supervisado** — la clasificación se realiza por reglas clínicas, no por aprendizaje automático. |

---

### Variables Predictoras

Las **7 variables predictoras** utilizadas en el algoritmo `calcularRiesgoGlobal()`:

| # | Variable Predictor | Tipo | Puntaje Máximo | Justificación Clínica |
|---|---|---|---|---|
| 1 | **PHQ-9 total** (severidad depresiva) | Numérica | +4 | La depresión es el factor de riesgo #1 para suicidio (OR 3.7). Más de 50 estudios de validación. |
| 2 | **BHS total** (desesperanza) | Numérica | +4 | Predictor más fuerte y específico de conducta suicida (r=0.44 con ideación). Escala de Beck. |
| 3 | **Nivel C-SSRS** (ideación suicida) | Categórica | +5 | Estándar de oro internacional (Posner et al., 2011). Recibe el peso más alto del algoritmo. |
| 4 | **Ítem 9 PHQ-9** (ideación directa) | Numérica | +3 | Sensibilidad 74-87%, VPN 95-79%. Bajo VPP (27-28%) mitigado por C-SSRS. |
| 5 | **Intento previo de suicidio** | Booleana | +3 | Predictor #1 de suicidio completado: riesgo 30-40× (Owens et al., 2002, meta-análisis de 90 estudios). |
| 6 | **Consumo de sustancias** | Booleana | +2 | OR 2-5× (Borges et al., 2004). Altera juicio, aumenta impulsividad. |
| 7 | **Aislamiento social** | Booleana | +2 | Mortalidad incrementada 26-32% (Holt-Lunstad et al., 2015). Definido como vive solo O 0 personas de confianza. |

**Umbrales de clasificación:**

| Nivel | Puntaje | Acción del Sistema |
|---|---|---|
| Bajo | 0-3 | Monitoreo rutinario |
| Moderado | 4-7 | Seguimiento semanal |
| Alto | 8-11 | Cita profesional en 48 horas |
| Muy alto | 12+ | Intervención inmediata + derivación a emergencias |

---

### Problemas Encontrados

#### Valores Faltantes

| Variable | Tipo de Faltante | Impacto |
|---|---|---|
| Nombre, apellido | Opcional (NULL permitido) | Bajo — no afecta análisis clínico |
| Estado civil, educación, ocupación, ingreso, zona | Opcional (NULL permitido) | Medio — limita análisis demográfico |
| Edad del primer intento (historial) | Condicional (solo si intento previo = true) | Bajo — estructuralmente esperado |
| Encuestas abandonadas | MNAR (Missing Not At Random) | **Alto** — los usuarios en crisis tienden a abandonar más temprano, generando un sesgo de selección donde los datos faltantes están correlacionados con la variable objetivo |

#### Datos Atípicos (Outliers)

| Variable | Tipo de Outlier | Evaluación |
|---|---|---|
| PHQ-9 ítem 9 = 3 (todos los días) | **Señal clínica genuina** | No es error de captura. Indica ideación suicida frecuente. Priorizar sobre otras alertas. |
| BHS total = 20 (todos los ítems verdaderos) | **Señal clínica genuina** | Desesperanza extrema. Validar con C-SSRS. |
| Edad < 15 o > 80 | Posible error | Verificar razonabilidad. Edades extremas son válidas pero infrecuentes. |
| Horas de sueño = 0 o 12 | Posible error o señal | Puede indicar insomnio severo o hipersomnia. Requiere validación clínica. |
| DASS-21 subescalas > 35 | Señal clínica | Niveles "extremadamente severos". Casos genuinos de crisis. |

#### Sesgos Identificados

| Sesgo | Tipo | Descripción |
|---|---|---|
| **Sesgo de autorreporte** | Medición | Todos los datos provienen de autoevaluación. El usuario puede subestimar por vergüenza o sobreestimar por ansiedad. No hay fuente de verificación cruzada. |
| **Sesgo de selección (MNAR)** | Muestreo | Los datos faltantes no son aleatorios: están correlacionados con el nivel de riesgo. Los usuarios más graves abandonan antes. |
| **Sesgo de distribución artificial** | Representatividad | Los 60 perfiles seed tienen proporciones forzadas (~30% alto riesgo) que no reflejan la prevalencia real (~5-10%). |
| **Sesgo de deseabilidad social** | Medición | El usuario puede dar respuestas socialmente aceptables en lugar de respuestas honestas sobre conducta suicida o consumo de sustancias. |
| **Sesgo geográfico** | Generalización | Los datos son exclusivamente peruanos (números de crisis, contexto cultural). No generalizable a otros países. |

---

### Posibles Mejoras

| # | Mejora | Prioridad | Acción Concreta |
|---|---|---|---|
| 1 | **Incorporar diagnóstico clínico de referencia** | Crítica | Vincular el sistema con evaluaciones profesionales (psicólogo/psiquiatra) para crear una columna `diagnostico_clinico` que sirva como variable objetivo válida para ML. Actualmente la variable objetivo se calcula por reglas, no por diagnóstico gold-standard. |
| 2 | **Agregar variables predictoras faltantes** | Alta | Incluir en la encuesta: acceso a métodos letales (SAFE-T Protocol), dolor crónico (OR 1.5-2×), impulsividad motora (Barratt, OR 2-3×), antecedentes familiares de suicidio (OR 2-3×). Estas variables mejorarían la sensibilidad del algoritmo. |
| 3 | **Implementar seguimiento longitudinal** | Alta | Crear tabla `seguimientos` vinculada a `encuestas` para registrar evolución periódica de cada paciente. Calcular variación temporal (delta) como nueva variable predictora. Permite detectar tendencias de deterioro o mejoría. |
| 4 | **Validar con dataset externo real** | Alta | Buscar datasets públicos de salud mental (ej. NHANES, MIMIC-III, datasets universitarios) para validar el algoritmo heurístico actual contra datos de poblaciones reales. |
| 5 | **Manejo de valores faltantes** | Media | Implementar imputación por dominio clínico (MICE, KNN) o análisis de sensibilidad para evaluar el impacto de datos faltantes MNAR. Los datos faltantes de usuarios en crisis no deben ignorarse. |
| 6 | **Detección de outliers clínicos** | Media | Implementar reglas clínicas para distinguir entre outliers de error y señales de crisis (ej. si PHQ-9 ítem 9 = 3 Y C-SSRS positivo → priorizar sobre valor atípico). |
| 7 | **Métricas de validación del modelo** | Media | Implementar: sensibilidad, especificidad, VPP, VPN, AUC-ROC, F1-score, curva ROC. Medir tasa de falsos negativos (el error más crítico en este dominio). |
| 8 | **Muestreo estratificado para ML** | Media | Si se implementa ML, usar SMOTE, ADASYN o muestreo estratificado para manejar el desbalanceo de clases. La clase "muy alto" riesgo es la más importante pero la más infrecuente. |
| 9 | **Restricción de duplicados** | Baja | Agregar validación para evitar que un mismo usuario registre múltiples encuestas sin intervalo razonable. Actualmente no hay restricción de unicidad por usuario. |
| 10 | **Internacionalización** | Baja | Parametrizar números de emergencia por país/geolocalización. Actualmente hardcodeado para Perú (SAMU 116, Línea 100). |

---

## Conclusiones

- La **Inteligencia Artificial depende de los datos**: sin datos de calidad no existe aprendizaje posible. Este proyecto captura 70 variables clínicas válidas, pero el dataset actual es sintético.
- La **comprensión de datos permite detectar problemas antes del entrenamiento**: los 9 problemas identificados (valores faltantes MNAR, outliers ambiguos, sesgo de autorreporte, desbalanceo de clases, etc.) deben abordarse antes de implementar ML.
- La **calidad del modelo está directamente relacionada con la calidad de los datos**: el problema más crítico es la ausencia de una variable objetivo gold-standard (diagnóstico clínico externo). Sin esto, cualquier modelo ML sería invalidable.
- **No existe algoritmo capaz de compensar datos deficientes**: el algoritmo heurístico actual (7 variables ponderadas) es una buena aproximación clínica, pero su validación requiere datos reales con diagnóstico de referencia.

---

**Documento generado:** Julio 2026
**Instituto Continental** — Comprensión de Datos para Sistemas de Inteligencia Artificial
**Proyecto:** Sistema de BI e Inteligencia Artificial para la Prevención de la Depresión y el Riesgo Suicida
