# ANÁLISIS COMPLETO DE VARIABLES: Predictoras y Contextuales

**Proyecto:** Sistema de BI e Inteligencia Artificial para Prevención de Depresión y Suicidio
**Fecha:** Julio 2026
**Versión:** 1.0

---

## 1. VARIABLES PREDICTORAS (Variables que alimentan el algoritmo de riesgo)

Estas son las **7 variables que `calcularRiesgoGlobal()` usa directamente** para asignar un puntaje de riesgo (0-23 puntos) y clasificar al paciente en bajo/moderado/alto/muy_alto.

### 1.1 Tabla Resumen

| # | Variable | Tipo | Rango de Puntos | Escala Clínica | Por qué se usa (Evidencia Científica) | Fuente en Código |
|---|---|---|---|---|---|---|
| **1** | **PHQ-9 Total** (Severidad de Depresión) | Cuantitativa ordinal | 0-4 pts | Patient Health Questionnaire-9 | La depresión es el factor de riesgo #1 asociado con suicidio (meta-análisis: OR 3.7 para suicidio). El PHQ-9 es el instrumento de screening depresivo más validado del mundo (50+ estudios de validación). Umbrales: mínimo(0-4), leve(5-9), moderado(10-14), moderado-severo(15-19), severo(20-27). Cada rango subsecuente incrementa puntos porque la evidencia muestra relación dosis-respuesta entre severidad depresiva y riesgo suicida. | `calculos.ts:100-104` |
| **2** | **BHS Total** (Desesperanza de Beck) | Cuantitativa ordinal | 0-4 pts | Beck Hopelessness Scale | La desesperanza es el predictor **más fuerte y específico** de conducta suicida (Beck et al., 1985). Meta-análisis muestra correlación r=0.44 con ideación suicida. Es más predictivo que la depresión misma porque captura la expectativa negativa del futuro ("nada va a mejorar"). El BHS tiene 20 ítems booleanos (Sí/No) que miden sentimientos de desesperanza, falta de motivación, y expectativas negativas. | `calculos.ts:106-109` |
| **3** | **C-SSRS Nivel** (Ideación Suicida) | Categórica ordinal | 0-5 pts | Columbia Suicide Severity Rating Scale | El C-SSRS es el **gold standard internacional** para evaluar ideación y comportamiento suicida (Posner et al., 2011). A diferencia del PHQ-9, evalúa la **jerarquía de severidad**: deseos de morir → pensamientos sin método → método sin plan → intención sin plan → plan específico → intención de ejecutar → intento. Cada nivel representa mayor probabilidad de transición a intento. Recibe los puntos más altos (5) porque es la variable con mayor peso predictivo directo. | `calculos.ts:111-114` |
| **4** | **PHQ-9 Item 9** (Ideación Suicida Directa) | Cuantitativa ordinal | 0-3 pts | PHQ-9 (ítem 9 específicamente) | El ítem 9 del PHQ-9 pregunta directamente: "Pensamientos de que estaría muerto o de hacerse daño de alguna manera". Se usa como variable **adicional** al C-SSRS porque captura ideación suicida de forma más sensible (aunque menos específica). Estudios muestran sensibilidad 74-87% y NPV 95-97% (Na et al., 2018). Sin embargo, tiene limitaciones: PVP bajo (27-28%), lo cual se mitiga al usarlo junto con el C-SSRS. | `calculos.ts:116-118` |
| **5** | **Intento Previo de Suicidio** | Booleana (Sí/No) | 0 o 3 pts | Historial clínico | El intento previo es el **predictor #1 de suicidio consumado**: personas con intento previo tienen riesgo 30-40 veces mayor de morir por suicidio que la población general (Owens et al., 2002, meta-análisis de 90 estudios). El 1-5% de quienes intentan mueren por suicidio en el año siguiente. Recibe 3 puntos porque es un factor de riesgo establecido y de alta severidad. | `calculos.ts:120-121` |
| **6** | **Consumo de Sustancias** | Booleana (Sí/No) | 0 o 2 pts | Salud física | El consumo de sustancias (drogas o alcohol frecuente/diario) está asociado con ideación suicida (OR 2-5x, meta-análisis Borges et al., 2004). Las sustancias alteran el juicio, aumentan la impulsividad, empeoran la depresión, y facilitan la transición de ideación a acción. Se define como positivo si consume drogas O alcohol frecuente/diario. Recibe 2 puntos porque es un factor de riesgo moderado-alto. | `calculos.ts:123-124` |
| **7** | **Aislamiento Social** | Booleana (Sí/No) | 0 o 2 pts | Relaciones sociales | El aislamiento social es un factor protector fundamental: personas sin red de apoyo tienen mayor riesgo de depresión y suicidio (Holt-Lunstad et al., 2015, meta-análisis: mortalidad aumentada 26-32%). Se define como positivo si vive solo O no tiene personas de confianza (numPersonasConfianza = 0). Recibe 2 puntos porque la ausencia de apoyo social elimina uno de los factores protectores más importantes. | `calculos.ts:126-127` |

### 1.2 Resumen del Puntaje de Riesgo

| Nivel de Riesgo | Puntaje | Acción Generada |
|---|---|---|
| **Bajo** | 0-3 puntos | Monitoreo de rutina |
| **Moderado** | 4-7 puntos | Seguimiento semanal |
| **Alto** | 8-11 puntos | Cita en 48 horas |
| **Muy Alto** | 12+ puntos | Intervención inmediata + emergencia |

### 1.3 Código del Algoritmo

```typescript
// src/lib/calculos.ts:88-137
export function calcularRiesgoGlobal(params: {
  phq9: number
  bhs: number
  cssrs: string
  desesperanza: boolean
  ideacionSuicida: number
  intentoPrevio: boolean
  consumoSustancias: boolean
  aislamientoSocial: boolean
}) {
  let puntajeRiesgo = 0

  // PHQ-9
  if (params.phq9 >= 20) puntajeRiesgo += 4
  else if (params.phq9 >= 15) puntajeRiesgo += 3
  else if (params.phq9 >= 10) puntajeRiesgo += 2
  else if (params.phq9 >= 5) puntajeRiesgo += 1

  // BHS (desesperanza)
  if (params.bhs >= 15) puntajeRiesgo += 4
  else if (params.bhs >= 10) puntajeRiesgo += 3
  else if (params.bhs >= 5) puntajeRiesgo += 1

  // C-SSRS
  if (params.cssrs === 'intento_letal') puntajeRiesgo += 5
  else if (params.cssrs === 'planificacion') puntajeRiesgo += 4
  else if (params.cssrs === 'intento_no_letal') puntajeRiesgo += 3

  // Ideación suicida PHQ-9
  if (params.ideacionSuicida >= 2) puntajeRiesgo += 3
  else if (params.ideacionSuicida >= 1) puntajeRiesgo += 1

  // Intento previo
  if (params.intentoPrevio) puntajeRiesgo += 3

  // Consumo de sustancias
  if (params.consumoSustancias) puntajeRiesgo += 2

  // Aislamiento
  if (params.aislamientoSocial) puntajeRiesgo += 2

  // Determinar nivel
  let nivelRiesgo: string
  if (puntajeRiesgo >= 12) nivelRiesgo = 'muy_alto'
  else if (puntajeRiesgo >= 8) nivelRiesgo = 'alto'
  else if (puntajeRiesgo >= 4) nivelRiesgo = 'moderado'
  else nivelRiesgo = 'bajo'

  return { puntajeRiesgo, nivelRiesgo }
}
```

---

## 2. VARIABLES CLÍNICAS CONTEXTUALES (Escalas completas capturadas pero NO ponderadas en el algoritmo)

Estas variables se **almacenan en la base de datos** y se envían al chatbot de IA como contexto, pero **no se suman al puntaje de riesgo**. Son usadas para análisis descriptivo, diagnóstico y recomendaciones del chatbot.

| # | Variable | Tipo | Escala | Tabla DB | Campos | Por qué se captura (Evidencia) |
|---|---|---|---|---|---|---|
| **8** | **Rosenberg** (Autoestima) | Cuantitativa ordinal | 10-40 puntos | `rosenberg_respuestas` | 10 ítems (1-4 cada uno), items 2,5,6,8,9 invertidos | La baja autoestima está asociada con depresión (OR 1.8-2.5) y conducta suicida (Sowislo & Orth, 2013, meta-análisis). Captura la valoración negativa de uno mismo ("no valgo nada"), que es un componente cognitivo clave de la tríada de Beck (sí mismo, mundo, futuro). **No está en el algoritmo** pero se usa en el análisis del chatbot. |
| **9** | **DASS-21 Depresión** | Cuantitativa ordinal | 0-42 (×2 para equivalencia DASS-42) | `dass21_respuestas` | 7 ítems × 2 | El DASS-21 mide depresión de forma diferente al PHQ-9: se enfoca en anhedonia, inercia, y falta de interés/commitment. Los 21 ítems se dividen en 3 subescalas. La depresión DASS-21 complementa el PHQ-9 capturando síntomas que el PHQ-9 puede subestimar. |
| **10** | **DASS-21 Ansiedad** | Cuantitativa ordinal | 0-42 (×2) | `dass21_respuestas` | 7 ítems × 2 | La ansiedad comórbida con depresión incrementa riesgo suicida (OR 1.5-2x). El DASS-21 ansiedad mide activación fisiológica, preocupación catastrofista, y reactivity emocional. La comorbilidad depresión+ansiedad es más peligrosa que cada una por separado. |
| **11** | **DASS-21 Estrés** | Cuantitativa ordinal | 0-42 (×2) | `dass21_respuestas` | 7 ítems × 2 | El estrés crónico activa el eje HPA (hipotálamo-pituitario-adrenal), elevando cortisol, que a su vez empeora depresión y función cognitiva. Captura tensión, irritabilidad, y sobrecarga percibida. |
| **12** | **PHQ-9 Desglose por Ítems** | Cuantitativa ordinal (9 ítems) | 0-3 cada uno | `phq9_respuestas` | 9 campos (interés, ánimo, sueño, energía, apetito, autoestima, concentración, psicomotricidad, ideación) | Cada ítem captura un síntoma específico de depresión. El desglose permite identificar qué síntomas son predominantes (ej: insomnia predominant vs hipersomnia), lo cual es útil para personalizar recomendaciones del chatbot. |
| **13** | **BHS Desglose** | Booleana (20 ítems) | 0-20 | `bhs_respuestas` | 20 campos booleanos | El BHS evalúa 3 dimensiones de la desesperanza: sentimientos sobre el futuro, pérdida de interés, y expectativas negativas. El desglose permite al chatbot identificar qué aspecto de la desesperanza es más prominente. |

---

## 3. VARIABLES CONTEXTUALES (Factores que enriquecen el análisis pero NO se usan en el cálculo de riesgo)

### 3.1 Variables Demográficas

| # | Variable | Tipo | Tabla DB | Campos | Por qué se captura (Evidencia) |
|---|---|---|---|---|---|
| **14** | Edad | Cuantitativa | `encuestas` | `edad` | El riesgo suicida varía por edad: pico en 15-29 años y >65 años. En Perú, el suicide rate es mayor en varones jóvenes (15-29). La edad permite estratificar análisis. |
| **15** | Sexo | Categórica | `encuestas` | `sexo` (masculino/femenino/no_binario/otro) | El sexo influye en la expresión de depresión (femenino: más internalización; masculino: más externalización/consumo). Tasa de suicidio 2-3x mayor en varones, pero 2-3x más intentos en mujeres. |
| **16** | Estado Civil | Categórica | `encuestas` | `estadoCivil` | El ser soltero/viudo/divorciado es factor de riesgo (Holt-Lunstad et al., 2015). El apoyo de pareja es factor protector significativo. |
| **17** | Nivel Educativo | Categórica | `encuestas` | `nivelEducativo` | La educación se correlaciona con acceso a información de salud, alfabetización en salud mental, y acceso a empleo. Niveles bajos de educación se asocian con menor uso de servicios de salud. |
| **18** | Ocupación | Texto libre | `encuestas` | `ocupacion` | El desempleo y el estrés laboral son factores de riesgo establecidos (WHO, 2022). Permite cruzar ocupación con factores psicosociales. |
| **19** | Ingreso Mensual | Categórica | `encuestas` | `ingresoMensual` (5 categorías en SMLV) | La pobreza se asocia con mayor riesgo de depresión (OR 1.5-2x) y menor acceso a servicios de salud mental. Los 5 rangos capturan desigualdad económica. |
| **20** | Zona de Residencia | Categórica | `encuestas` | `zonaResidencia` (urbana/rural) | Las zonas rurales tienen menor acceso a servicios de salud mental pero pueden tener menor estrés urbano. En Perú, la brecha urbano-rural en salud mental es significativa. |
| **21** | Estado del Usuario | Categórica | `encuestas` | `estadoUsuario` (vivo/fallecido) + `fallecimientoVoluntario` + `causaFallecimiento` | Permite trackear desenlace clínico. Esencial para validar el algoritmo: ¿cuántos de los clasificados como "bajo riesgo" fallecieron? Variable de outcome para futuros estudios. |

### 3.2 Variables Socioeconómicas

| # | Variable | Tipo | Tabla DB | Campos | Por qué se captura (Evidencia) |
|---|---|---|---|---|---|
| **22** | Estado Laboral | Categórica | `factores_socioeconomicos` | `estadoLaboral` (empleado/desempleado/estudiante/jubilado/ama_casa/otro) | El desempleo es factor de riesgo establecido para depresión y suicidio (OR 1.5-2.5x). Permite cruzar con estrés laboral. |
| **23** | Satisfacción Laboral | Cuantitativa (1-5) | `factores_socioeconomicos` | `satisfaccionLaboral` | La baja satisfacción laboral se asocia con burnout, depresión, y absentismo. La escala Likert 1-5 permite análisis de gradiente. |
| **24** | Horas de Trabajo Semanal | Cuantitativa | `factores_socioeconomicos` | `horasTrabajoSemanal` | El exceso de horas (>48h/semana) se asocia con burnout y deterioro de salud mental. La OMS reconoce el trabajo excesivo como factor de riesgo. |
| **25** | Estrés Laboral | Cuantitativa (1-5) | `factores_socioeconomicos` | `estresLaboral` | El estrés laboral crónico eleva cortisol y se asocia con depresión, ansiedad, y conducta suicida (WHO, 2022 guidelines). |
| **26** | Nivel de Deudas | Categórica | `factores_socioeconomicos` | `nivelDeudas` (sin_deudas/bajo/medio/alto/muy_alto) | Las deudas financieras son factor de riesgo significativo para suicidio, especialmente en varones (Coope et al., 2015). La categoría "muy_alto" representa un factor de riesgo urgente. |
| **27** | Dificultad Económica | Booleana | `factores_socioeconomicos` | `dificultadEconomica` | La inseguridad económica percibida se asocia con ideación suicida (OR 2-3x), incluso controlando por ingreso real. Captura la percepción subjetiva de escasez. |
| **28** | Calidad de Relaciones Familiares | Cuantitativa (1-5) | `factores_socioeconomicos` | `calidadRelacionesFamiliares` | Las relaciones familiares disfuncionales son factor de riesgo (conflicto, violencia doméstica). Las relaciones familiares saludables son factor protector (OR 0.5-0.7 para suicidio). |
| **29** | Calidad de Relaciones de Pareja | Cuantitativa (1-5) | `factores_socioeconomicos` | `calidadRelacionesPareja` | La ruptura de pareja y el conflicto conyugal son factores de riesgo agudos para suicidio (OR 2-3x). La calidad percibida es mejor predictor que el estado civil. |
| **30** | Apoyo Social Percibido | Cuantitativa (1-5) | `factores_socioeconomicos` | `apoyoSocialPercibido` | El bajo apoyo social percibido es factor de riesgo independiente para depresión (OR 1.8) y suicidio (OR 1.5-2x). Mide la percepción subjetiva, no la estructura objetiva. |
| **31** | Personas de Confianza | Cuantitativa | `factores_socioeconomicos` | `numPersonasConfianza` | Variable objetiva de red social. Tener 0 personas de confianza es definición de aislamiento social. Se usa directamente en el cálculo de `aislamientoSocial`. |
| **32** | Vive Solo | Booleana | `factores_socioeconomicos` | `viveSolo` | Vivir solo se asocia con mayor riesgo de aislamiento y demora en detección de crisis. Se usa en el cálculo de `aislamientoSocial`. |
| **33** | Tipo de Vivienda | Categórica | `factores_socioeconomicos` | `tipoVivienda` (propia/alquilada/prestada/otro) | La inseguridad habitacional se asocia con estrés y menor estabilidad emocional. Ser propietario es factor protector por estabilidad. |
| **34** | Calidad de Vivienda | Cuantitativa (1-5) | `factores_socioeconomicos` | `calidadVivienda` | La vivienda de baja calidad se asocia con hacinamiento, insalubridad, y estrés crónico, factores que empeoran salud mental. |
| **35** | Acceso a Salud Mental | Booleana | `factores_socioeconomicos` | `accesoSaludMental` | El acceso limitado a servicios de salud mental es barrera #1 para tratamiento en Perú (OMS: 70% de personas con trastornos mentales no reciben tratamiento en países en desarrollo). |
| **36** | Tipo de Afiliación Salud | Categórica | `factores_socioeconomicos` | `tipoAfiliacionSalud` (contributivo/subsidado/privado/ninguno) | El tipo de afiliación determina acceso real a servicios de salud mental. "Ninguno" implica barrera total de acceso. |
| **37** | Distancia a Servicio Salud | Categórica | `factores_socioeconomicos` | `distanciaServicioSalud` (cerca/moderado/lejano/sin_acceso) | La distancia geográfica es barrera significativa en zonas rurales del Perú. "Sin_acceso" implica imposibilidad de求助. |

### 3.3 Variables de Salud Física

| # | Variable | Tipo | Tabla DB | Campos | Por qué se captura (Evidencia) |
|---|---|---|---|---|---|
| **38** | Enfermedad Crónica | Booleana | `salud_fisica` | `enfermedadCronica` + `tipoEnfermedadCronica` | La enfermedad crónica se asocia con depresión comórbida (OR 1.5-2x). Pacientes con enfermedades terminales o crónicas severas tienen mayor riesgo suicida. |
| **39** | Dolor Crónico | Booleana | `salud_fisica` | `dolorCronico` | El dolor crónico es factor de riesgo independiente para depresión y suicidio (OR 1.5-2x, Smith et al., 2014). El dolor no tratado genera desesperanza y discapacidad funcional. **Variable clínicamente importante que NO está en el algoritmo de riesgo.** |
| **40** | Tratamiento Médico Actual | Booleana | `salud_fisica` | `tratamientoMedicoActual` + `medicamentosActuales` | Permite evaluar adherencia a tratamiento y posibles efectos secundarios de medicamentos que empeoran depresión (ej: corticosteroides, interferón). |
| **41** | Calidad del Sueño | Cuantitativa (1-5) | `salud_fisica` | `calidadSueno` | La mala calidad de sueño es factor de riesgo para depresión (OR 1.5-2x) e ideación suicida. El insomnio es predictor de intento de suicidio incluso controlando depresión (Bernert et al., 2015). |
| **42** | Horas de Sueño Promedio | Cuantitativa | `salud_fisica` | `horasSuenoPromedio` | Tanto el insomnio (<6h) como la hipersomnia (>9h) se asocian con depresión y suicidio. La relación es U-invertida. |
| **43** | Insomnio | Booleana | `salud_fisica` | `insomnio` | El insomnio es predictor independiente de suicidio (meta-análisis: OR 2-3x, Pigeon et al., 2012). Aumenta rumiación, reduce control de impulsos, y empeora depresión. |
| **44** | Consumo de Alcohol | Booleana + Frecuencia | `salud_fisica` | `consumeAlcohol` + `frecuenciaAlcohol` | El alcohol es depresor del SNC y aumenta impulsividad. Beber frecuentemente/diariamente es factor de riesgo para suicidio (OR 2-4x). Se usa en el cálculo de `consumoSustancias`. |
| **45** | Consumo de Tabaco | Booleana + Frecuencia | `salud_fisica` | `consumeTabaco` + `frecuenciaTabaco` | El tabaco se asocia con depresión y ansiedad (OR 1.5-2x). La nicotina afecta neurotransmisores. Aunque no es factor de riesgo directo para suicidio, es comorbilidad frecuente. |
| **46** | Consumo de Drogas | Booleana + Tipo + Frecuencia | `salud_fisica` | `consumeDrogas` + `tipoDrogas` + `frecuenciaDrogas` | Las drogas ilícitas son factor de riesgo mayor para suicidio (OR 3-5x). Especialmente peligrosos: cocaína, anfetaminas, opioides. Se usa en el cálculo de `consumoSustancias`. |

### 3.4 Variables Psicológicas

| # | Variable | Tipo | Tabla DB | Campos | Por qué se captura (Evidencia) |
|---|---|---|---|---|---|
| **47** | ERQ Reevaluación Cognitiva | Cuantitativa (1-7) | `factores_psicologicos` | `erqReevaluacionCognitiva` | La reevaluación cognitiva es una estrategia adaptativa de regulación emocional. Scores altos indican mejor capacidad de manejar emociones negativas (factor protector). La ERQ (Emotion Regulation Questionnaire) está validada en español. |
| **48** | ERQ Supresión Expresiva | Cuantitativa (1-7) | `factores_psicologicos` | `erqSupresionExpresiva` | La supresión expresiva es una estrategia desadaptativa: ocultar emociones sin procesarlas. Scores altos se asocian con peores resultados en terapia y mayor psicopatología. |
| **49** | Impulsividad Motora | Cuantitativa (1-5) | `factores_psicologicos` | `impulsividadMotora` | La impulsividad motora (actuar sin pensar) es factor de riesgo para intento de suicidio (OR 2-3x). Especialmente relevante en intentos con métodos letales. |
| **50** | Impulsividad No Planificada | Cuantitativa (1-5) | `factores_psicologicos` | `impulsividadNoPlanificada` | La impulsividad no planificada (dificultad para planificar el futuro) se asocia con desesperanza y falta de visión de futuro. |
| **51** | Impulsividad Atencional | Cuantitativa (1-5) | `factores_psicologicos` | `impulsividadAtencional` | La impulsividad atencional (dificultad para concentrarse) se asocia con síntomas de TDAH y dificultad para procesar información, lo que puede afectar la toma de decisiones en crisis. |
| **52** | Evento: Pérdida Familiar Reciente | Booleana | `factores_psicologicos` | `perdidaFamiliarReciente` | La pérdida de un ser querido es uno de los eventos vitales más estresantes (Holmes-Rahe: 100 puntos). Se asocia con duelo patológico y mayor riesgo de depresión y suicidio. |
| **53** | Evento: Violencia Física | Booleana | `factores_psicologicos` | `violenciaFisica` | La exposición a violencia física es factor de riesgo mayor para PTSD, depresión y suicidio (OR 2-4x). En Perú, la violencia doméstica es problema significativo. |
| **54** | Evento: Violencia Psicológica | Booleana | `factores_psicologicos` | `violenciaPsicologica` | El maltrato psicológico (humillación, manipulación, amenazas) es factor de riesgo para depresión y suicidio, especialmente en relaciones de poder. |
| **55** | Evento: Abuso Sexual | Booleana | `factores_psicologicos` | `abusoSexual` | El abuso sexual es factor de riesgo extremadamente alto para suicidio (OR 3-10x, Chen et al., 2010). Se asocia con PTSD, depresión crónica, y autolesión. **Variable crítica que NO está en el algoritmo.** |
| **56** | Evento: Bullying | Booleana | `factores_psicologicos` | `bullying` | El bullying se asocia con depresión y suicidio en adolescentes y jóvenes (OR 1.5-3x). En Perú, el bullying escolar es prevalente. |
| **57** | Evento: Desempleo Reciente | Booleana | `factores_psicologicos` | `desempleoReciente` | La pérdida repentina de empleo es evento vital estresante que precipita crisis emocionales. Se asocia con pérdida de identidad y propósito. |
| **58** | Evento: Ruptura de Pareja | Booleana | `factores_psicologicos` | `ruptureParejaReciente` | La ruptura de pareja es factor de riesgo agudo para suicidio (OR 2-3x). El duelo romántico es particularmente peligroso en varones jóvenes. |
| **59** | Evento: Problema Legal | Booleana | `factores_psicologicos` | `problemaLegalReciente` | Los problemas legales generan estrés crónico, vergüenza, y sentimiento de atrapamiento, factores asociados con suicidio. |
| **60** | Tiene Red de Apoyo | Booleana | `factores_psicologicos` | `tieneRedApoyo` | Factor protector fundamental. La ausencia de red de apoyo es equivalente funcional al aislamiento social. |
| **61** | Percibe Vida con Sentido | Booleana | `factores_psicologicos` | `percibeVidaConSentido` | La falta de sentido de vida es componente central de la desesperanza (Frankl, 1946; Steger et al., 2006). Factor protector establecido. |
| **62** | Ha Buscado Ayuda Profesional | Booleana | `factores_psicologicos` | `haBuscadoAyudaProfesional` + `tipoAyudaProfesional` | Indica disposición a buscar ayuda y nivel de conciencia de enfermedad. Permite evaluar brecha entre necesidad y uso de servicios. |

### 3.5 Variables de Historial Clínico

| # | Variable | Tipo | Tabla DB | Campos | Por qué se captura (Evidencia) |
|---|---|---|---|---|---|
| **63** | Número de Intentos Previos | Cuantitativa | `historial_intentos` | `numIntentosPrevios` | El riesgo de suicidio aumenta con cada intento: 1er intento → 30-40x, 2do intento → aún mayor. Es factor acumulativo. |
| **64** | Edad del Primer Intento | Cuantitativa | `historial_intentos` | `primerIntentoEdad` | El primer intento a edad temprana indica vulnerabilidad más profunda y mayor riesgo de recurrencia. |
| **65** | Fecha del Último Intento | Temporal | `historial_intentos` | `ultimoIntentoFecha` | Un intento reciente (<3 meses) indica riesgo inmediato. Permite evaluar distancia temporal desde última crisis. |
| **66** | Método del Intento | Categórica | `historial_intentos` | `metodoIntento` | El método letal previo (arma, ahorcamiento) indica acceso a medios y mayor riesgo de completar. Métodos no letales indican ideación pero menor letalidad. |
| **67** | Hospitalización por Intento | Booleana | `historial_intentos` | `hospitalizacionPorIntento` | La hospitalización indica severidad del intento previo. Es predictor de futuros intentos. |
| **68** | Tratamiento Psiquiátrico Previo | Booleana | `historial_intentos` | `tratamientoPsiquiatricoPrevio` | Indica gravedad diagnóstica previa. Permite evaluar si el paciente ha tenido atención especializada. |
| **69** | Antecedentes Familiares de Suicidio | Booleana | `historial_intentos` | `antecedentesFamiliaresSuicidio` | Los antecedentes familiares de suicidio incrementan riesgo 2-3x, tanto por factores genéticos (serotonina) como ambientales (aprendizaje, normalización). |
| **70** | Antecedentes Familiares de Enfermedad Mental | Booleana | `historial_intentos` | `antecedentesFamiliaresEnfermedadMental` | Los antecedentes familiares de depresión, bipolar, o esquizofrenia incrementan riesgo genético de enfermedad mental (OR 2-4x). |

---

## 4. RESUMEN: CÓMO SE USAN LAS VARIABLES

```
┌─────────────────────────────────────────────────────────────┐
│                  70 VARIABLES CAPTURADAS                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─── 7 VARIABLES PREDICTORAS ──────────────────────┐       │
│  │ PHQ-9 + BHS + C-SSRS + Item9 + Intento +        │       │
│  │ Sustancias + Aislamiento                          │       │
│  │ → calcularRiesgoGlobal() → Score 0-23             │       │
│  │ → Clasificación: bajo/moderado/alto/muy_alto      │       │
│  │ → Genera NOTIFICACIÓN automática                  │       │
│  └───────────────────────────────────────────────────┘       │
│                                                              │
│  ┌─── 63 VARIABLES CONTEXTUALES ─────────────────────┐      │
│  │ • 5 escalas clínicas completas (Rosenberg, DASS-21)│      │
│  │ • 16 factores socioeconómicos                      │      │
│  │ • 17 factores de salud física                      │      │
│  │ • 16 factores psicológicos (ERQ, impulsividad,     │      │
│  │   eventos vitales)                                 │      │
│  │ • 8 variables de historial clínico                 │      │
│  │ • 7 variables demográficas                         │      │
│  │                                                    │      │
│  │ → Se GUARDAN en BD                                 │      │
│  │ → Se ENVÍAN al chatbot como CONTEXTO               │      │
│  │ → Se usan en ANÁLISIS DESCRIPTIVO (tablas, cruces) │      │
│  │ → NO se suman al score de riesgo                   │      │
│  └────────────────────────────────────────────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. VARIABLES CLÍNICAMENTE IMPORTANTES QUE FALTAN EN EL ALGORITMO

| Variable | Por qué debería estar | Evidencia |
|---|---|---|
| **Acceso a métodos letales** | Factor protector/riesgo #1 según SAFE-T Protocol con C-SSRS | Posner et al., 2011 |
| **Dolor crónico** | OR 1.5-2x para suicidio; capturado en BD pero no en algoritmo | Smith et al., 2014 |
| **Eventos vitales estresantes** | Capturados (8 tipos) pero no se suman al score | Holmes-Rahe Scale |
| **Impulsividad motora** | OR 2-3x para intento; capturada pero no en algoritmo | Glenn & Nock, 2014 |
| **Abuso sexual** | OR 3-10x para suicidio; capturado pero no en algoritmo | Chen et al., 2010 |
| **Antecedentes familiares suicidio** | OR 2-3x; capturado pero no en algoritmo | Brent & Mann, 2005 |

---

## 6. VARIABLES QUE SÍ SE USAN EN EL CÁLCULO PERO TIENEN LIMITACIONES

| Variable | Limitación | Impacto |
|---|---|---|
| **PHQ-9 Item 9** | PVP bajo (27-28% según Na et al., 2018). Sobre-identifica pacientes en riesgo. | Genera falsos positivos |
| **Consumo de sustancias** | Define como positivo si consume drogas O alcohol frecuente/diario. No distingue entre tipos de sustancia ni frecuencia exacta. | Pierde granularidad |
| **Aislamiento social** | Define como vive solo O 0 personas de confianza. No captura calidad del aislamiento. | Simplificación excesiva |
| **BHS ≥10 como umbral** | Umbral no validado en población peruana. La literatura usa BHS ≥10 para "desesperanza moderada-severa" en poblaciones anglosajonas. | Posible sesgo cultural |

---

## 7. REFERENCIAS BIBLIOGRÁFICAS

1. **Beck, A.T., et al.** (1985). Hopelessness and eventual suicide: a 10-year prospective study of patients hospitalized with suicidal ideation. *American Journal of Psychiatry*, 142(5), 559-563.
2. **Borges, G., et al.** (2004). Alcohol use and likelihood of suicide in a household survey. *Suicide and Life-Threatening Behavior*, 34(1), 63-73.
3. **Brent, D.A. & Mann, J.J.** (2005). Family genetic studies, suicide, and suicidal behavior. *American Journal of Medical Genetics Part C: Seminars in Medical Genetics*, 133C(1), 13-24.
4. **Chen, L.P., et al.** (2010). The association between sexual violence and suicide: a systematic review. *Journal of Interpersonal Violence*, 25(10), 1851-1867.
5. **Coope, C., et al.** (2015). Characteristics of people who died by suicide in the UK in 2014: results from a national enquiry. *The Lancet Psychiatry*, 2(6), 513-520.
6. **Glenn, C.R. & Nock, M.K.** (2014). Improving the short-term prediction of suicidal behavior. *American Journal of Preventive Medicine*, 47(3S2), S176-S180.
7. **Holt-Lunstad, J., et al.** (2015). Loneliness and social isolation as risk factors for mortality: a meta-analytic review. *Perspectives on Psychological Science*, 10(2), 227-237.
8. **Na, P.J., et al.** (2018). The PHQ-9 Item 9 based screening for suicide risk: a validation study. *Journal of Affective Disorders*, 232, 34-40.
9. **Owens, D., et al.** (2002). Self-harm, suicide, and adverse outcomes following self-harm: systematic review. *British Journal of Psychiatry*, 181(5), 393-399.
10. **Pigeon, W.R., et al.** (2012). The relationship between insomnia and suicidal behaviors: a meta-analysis. *Journal of Sleep Research*, 21(4), 369-376.
11. **Posner, K., et al.** (2011). The Columbia-Suicide Severity Rating Scale: initial validity and internal consistency findings. *American Journal of Psychiatry*, 168(12), 1266-1277.
12. **Smith, M.T., et al.** (2014). Chronic pain and the risk of suicide: a meta-analysis. *Pain*, 155(10), 1951-1959.
13. **Sowislo, J.F. & Orth, U.** (2013). Does low self-esteem predict depression and anxiety? A meta-analysis. *Psychological Bulletin*, 139(1), 213-240.
14. **WHO** (2021). Ethics and governance of artificial intelligence for health. *World Health Organization*.
15. **WHO** (2022). Guidelines on mental health at work. *World Health Organization*.
16. **SAFE-T Protocol** (2024). Columbia Risk and Protective Factors. *Columbia Lighthouse Project*.
