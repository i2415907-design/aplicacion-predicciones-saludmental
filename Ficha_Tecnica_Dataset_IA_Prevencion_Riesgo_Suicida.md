# Ficha Técnica de Análisis del Conjunto de Datos: Modelo de IA para Clasificación de Riesgo Psicoemocional

**Proyecto base:** Sistema de BI e Inteligencia Artificial para prevención y depresión de suicidio
**Problema abordado:** Incremento de personas con riesgo a ser vulnerables a depresión, autolesiones y suicidio
**Alcance de este documento:** Estructura del *dataset* de entrenamiento del modelo de IA — **no** el diseño de la base de datos del sistema.
**Coherencia con el PMV:** Este dataset alimenta el módulo de IA definido en el PMV, cuya función es la **clasificación de riesgo (triage)** a partir de una autoevaluación digital, no el diagnóstico clínico ni la predicción directa de un desenlace fatal.

> **Nota metodológica:** Todo aspecto que no pueda determinarse únicamente a partir del problema planteado se marca como: *"Este aspecto deberá definirse durante la etapa de recopilación y preparación de los datos."*

---

## 1. Objetivo del análisis

El dataset debe contener registros estructurados de respuestas a un instrumento de autoevaluación emocional validado, junto con una **etiqueta de nivel de riesgo** (variable objetivo) asignada según criterios clínicos reconocidos. Cada registro representa una evaluación individual (no necesariamente un usuario único, ya que un mismo usuario puede generar múltiples registros a lo largo del tiempo).

Con este dataset se espera entrenar un modelo capaz de **clasificar el nivel de riesgo psicoemocional** de una persona a partir de sus respuestas, para priorizar la atención humana — no para sustituirla. El dataset contribuye al entrenamiento aportando los ejemplos etiquetados (aprendizaje supervisado) a partir de los cuales el modelo aprende a asociar patrones de respuesta con niveles de riesgo.

La calidad del dato es, en este proyecto, un factor crítico más que uno deseable: dado que el modelo participa —aunque sea de forma indirecta, como capa de apoyo— en decisiones que pueden tener consecuencias graves para la seguridad de una persona, cualquier deficiencia en los datos (etiquetas mal validadas, sesgos no corregidos, desbalance no tratado) se traduce directamente en un riesgo de falsos negativos con consecuencias potencialmente irreversibles. Esto eleva el estándar de calidad exigido muy por encima del de un proyecto de Machine Learning convencional.

---

## 2. Variables del dataset

| Variable | Tipo de dato | Descripción | Ejemplo |
|---|---|---|---|
| `id_registro` (seudónimo) | Categórica (nominal) | Identificador único y anónimo del registro/usuario | `USR_04821` |
| `fecha_hora_respuesta` | Fecha/hora | Momento en que se completó la evaluación | `2026-07-10 14:32` |
| `item_1` … `item_n` | Numérica ordinal (escala tipo Likert, p. ej. 0-3) | Puntaje de cada ítem del instrumento de tamizaje validado utilizado | `0 = "Nunca"`, `3 = "Casi todos los días"` |
| `puntaje_total` | Numérica (entero) | Suma o promedio ponderado de los ítems del cuestionario | `14` (sobre un máximo de 27, en escalas tipo PHQ-9) |
| `variacion_vs_evaluacion_anterior` | Numérica (entero, puede ser negativa) | Diferencia entre el puntaje actual y el de la evaluación previa del mismo usuario | `+5` |
| `frecuencia_uso_sistema` | Numérica (entero) | N.º de evaluaciones completadas en un periodo definido | `3 evaluaciones/mes` |
| `indicador_texto_libre` (opcional) | Numérica (score normalizado de NLP) | Puntaje derivado de análisis de lenguaje sobre respuestas abiertas, si el cuestionario las incluye | `0.72` |
| `grupo_etario` (a evaluar) | Categórica ordinal (por rangos) | Rango de edad del usuario, sujeto a pertinencia ética de recolección | `18-24` |
| `nivel_riesgo` (**variable objetivo**) | Categórica ordinal | Nivel de riesgo asignado según los criterios del instrumento utilizado | `Medio` |

**Utilidad dentro del modelo:**
- Los ítems individuales (`item_1`…`item_n`) son las variables predictoras primarias: capturan la señal clínica directa.
- `puntaje_total` es una variable derivada útil como *feature* adicional y como referencia de validación cruzada frente a la variable objetivo.
- `variacion_vs_evaluacion_anterior` aporta una dimensión temporal: un cambio abrupto puede ser tan relevante como el nivel absoluto.
- `frecuencia_uso_sistema` es una variable de comportamiento (*engagement*): tanto el desenganche súbito como el uso inusualmente frecuente pueden correlacionar con cambios en el estado emocional.
- `indicador_texto_libre` añade una fuente de señal complementaria cuando existen campos abiertos.
- `grupo_etario` permite auditar el desempeño del modelo por subgrupo y detectar sesgos, aunque su inclusión concreta **deberá definirse durante la etapa de recopilación y preparación de los datos**, junto con la evaluación ética correspondiente.

---

## 3. Variable objetivo

**Variable: `nivel_riesgo`** — Categórica ordinal: **Bajo / Medio / Alto**.

Representa el nivel de riesgo psicoemocional detectado en una evaluación puntual, según las bandas de puntaje o categorías clínicas de un instrumento de tamizaje validado (p. ej. bandas del PHQ-9 para depresión, o categorías del Columbia Protocol/C-SSRS para ideación suicida). La elección del instrumento específico **deberá definirse durante la etapa de recopilación y preparación de los datos**, en conjunto con un profesional de salud mental.

**Por qué se seleccionó esta variable — y no un desenlace binario tipo "intento de suicidio: sí/no":**

Esta es una decisión técnica y ética central de esta ficha. Se descarta deliberadamente un desenlace binario de autolesión/suicidio consumado como variable objetivo por tres razones:

1. **Prevalencia extremadamente baja:** estos eventos son estadísticamente raros incluso en poblaciones de alto riesgo. Un desbalance de esa magnitud produce modelos con un valor predictivo positivo (precisión) muy bajo aun con sensibilidad aceptable, es decir, una cantidad inmanejable de falsos positivos o una falsa sensación de fiabilidad.
2. **Disponibilidad y eticidad del dato:** un dataset etiquetado con desenlaces reales de autolesión o suicidio requiere acceso a información extremadamente sensible, de difícil obtención ética y legal, y generalmente fuera del alcance de un proyecto académico.
3. **Coherencia con el rol de la IA en el PMV:** el sistema fue diseñado para que la IA prioricé casos para revisión humana (*triage*), no para predecir un desenlace fatal. Entrenar el modelo contra un desenlace binario induciría a interpretarlo como herramienta diagnóstica, lo cual contradice ese diseño.

Por ello, la variable objetivo elegida es el **nivel de riesgo derivado de un instrumento validado**: es obtenible éticamente mediante autoevaluación con consentimiento informado, es clínicamente interpretable y es coherente con la función de apoyo a la priorización humana definida para la IA.

**Tipo de dato:** Categórica ordinal (Bajo < Medio < Alto).

**Tipo de aprendizaje automático: Clasificación (multiclase ordinal).**

Justificación:
- La salida esperada es una categoría discreta y ordenada, no un valor continuo sin acotar — esto descarta una Regresión pura (aunque una regresión sobre el puntaje total, seguida de una discretización clínica, es un enfoque alternativo válido que puede evaluarse empíricamente).
- No es un problema de **Series Temporales** puro: la variación temporal puede usarse como *feature*, pero el objetivo es clasificar un estado en cada evaluación, no pronosticar una serie continua.
- No es un problema de **Recomendación**: no se sugieren ítems o contenidos personalizados en este componente.
- Podría explorarse en una fase posterior como problema complementario de **Detección de anomalías** (para identificar patrones de respuesta atípicos que no encajen en las categorías conocidas), pero esto excede el alcance del modelo base del PMV.

---

## 4. Variables predictoras

| Variable | Justificación técnica |
|---|---|
| `item_1`…`item_n` | Señal clínica primaria; cada ítem aporta información parcial sobre una dimensión del estado emocional (ánimo, sueño, energía, ideación), y su combinación permite al modelo aprender patrones más ricos que el puntaje total aislado |
| `puntaje_total` | Resume la información de los ítems en una sola dimensión; útil como *feature* adicional y para detectar inconsistencias entre el puntaje agregado y la clasificación predicha |
| `variacion_vs_evaluacion_anterior` | Un incremento abrupto en el puntaje puede ser más predictivo de riesgo que un puntaje absoluto estable, aunque sea alto |
| `frecuencia_uso_sistema` | Patrones de uso inusuales (abandono súbito o uso muy frecuente) pueden correlacionar con cambios en el estado emocional |
| `indicador_texto_libre` (si aplica) | Aporta señal complementaria proveniente de lenguaje natural, capturando matices que la escala estructurada no siempre recoge |
| `grupo_etario` (si se incluye) | La expresión de síntomas y los umbrales de riesgo pueden variar según la edad; permite auditar sesgos de desempeño por subgrupo, pero su inclusión debe sopesarse frente al principio de minimización de datos |

---

## 5. Problemas encontrados en el conjunto de datos

| Problema | Causa | Impacto | Nivel de riesgo |
|---|---|---|---|
| Datos faltantes | Abandono del cuestionario antes de completarlo; omisión de preguntas sensibles por estigma | El patrón de no-respuesta puede estar correlacionado con el propio riesgo (no aleatorio), no solo reducir el tamaño de muestra | **Alto** |
| Registros duplicados | Reenvíos accidentales, errores de sincronización, un mismo usuario con distintos seudónimos | Sobre-representa ciertos patrones de respuesta, distorsionando el aprendizaje | Medio |
| Valores atípicos (*outliers*) | Respuestas extremas genuinas —potencialmente señales reales de riesgo— o errores de captura | Un tratamiento automático/ingenuo podría eliminar señal clínicamente relevante en lugar de ruido | **Alto** |
| Inconsistencias | Respuestas contradictorias entre ítems relacionados | Algunas inconsistencias aparentes pueden ser clínicamente significativas (p. ej. un ítem de ideación alto con puntaje general bajo); "corregirlas" automáticamente podría enmascarar riesgo real | **Alto** |
| Errores de captura | Fallos de interfaz, problemas de conectividad, errores de digitación en campos abiertos | Introduce ruido que reduce la calidad del entrenamiento | Medio |
| Variables irrelevantes | Metadatos técnicos sin valor clínico (p. ej. tipo de dispositivo) | Aumenta la dimensionalidad sin aportar señal | Bajo |
| Variables redundantes | Ítems individuales y puntajes derivados altamente correlacionados entre sí | Multicolinealidad; afecta la interpretabilidad del modelo, relevante en un dominio clínico | Medio |
| Ruido en los datos | Respuestas poco reflexivas, apresuradas o por fatiga del usuario | Reduce la señal real disponible para el aprendizaje | Medio |
| Datos desactualizados | El estado emocional de una persona cambia en el tiempo | Usar registros antiguos como reflejo del estado actual puede llevar a decisiones erróneas, contradiciendo el propósito de detección oportuna | **Alto** |
| Desbalance de clases | Menor proporción de casos de riesgo Alto frente a Bajo en la mayoría de poblaciones | El modelo tiende a favorecer la clase mayoritaria, reduciendo su capacidad de detectar los casos más críticos | **Alto** |
| Sesgos | Subrepresentación de grupos demográficos/culturales; instrumentos validados en poblaciones distintas a la población objetivo real | Desempeño desigual entre subgrupos, afectando la detección en poblaciones ya vulnerables | **Alto** |
| Calidad de etiquetas | Errores en la aplicación o interpretación del instrumento al asignar `nivel_riesgo` | El modelo replica y puede amplificar errores presentes en las etiquetas; es la base de todo el aprendizaje supervisado | **Alto** |

---

## 6. Posibles mejoras

| Mejora | Beneficio esperado |
|---|---|
| Limpieza de datos | Elimina ruido y errores evidentes, mejorando la calidad de las señales de entrada |
| Tratamiento de valores nulos (imputación cuidadosa o exclusión justificada) | Reduce sesgo por no-respuesta; requiere cuidado para no enmascarar patrones de no-respuesta clínicamente relevantes |
| Eliminación de duplicados | Evita sobre-representación artificial de ciertos patrones de respuesta |
| Tratamiento de *outliers* (revisión clínica, no eliminación automática) | Distingue ruido real de señal clínicamente válida antes de decidir su tratamiento, evitando pérdida de casos de riesgo genuino |
| Normalización / Estandarización de variables numéricas | Mejora la convergencia y el desempeño de algoritmos sensibles a la escala de las variables |
| Codificación de variables categóricas (*one-hot*, ordinal *encoding*) | Permite que variables como `grupo_etario` o `nivel_riesgo` sean interpretables por el modelo |
| *Feature Engineering* (variación temporal, ratios entre ítems) | Enriquece la capacidad predictiva más allá de las variables crudas del cuestionario |
| Selección de variables | Reduce dimensionalidad y multicolinealidad, mejorando la interpretabilidad — clave para que los profesionales de salud confíen en el criterio del modelo |
| Balanceo de clases (SMOTE, ponderación de clases, muestreo estratificado) | Mejora la capacidad del modelo para detectar la clase minoritaria (riesgo alto), la más crítica desde el punto de vista de seguridad |
| Incremento del tamaño del dataset | Mejora la generalización y reduce el sobreajuste, especialmente relevante dado el desbalance esperado |
| Validación de registros (revisión por un profesional de salud mental de una muestra de etiquetas) | Aumenta la confiabilidad de la variable objetivo, mitigando el riesgo de "calidad de etiquetas" |
| Actualización periódica del dataset | Mantiene la relevancia del modelo frente a cambios en los patrones de la población objetivo en el tiempo |

---

## 7. Recomendaciones para preparar el dataset

- **Calidad sobre cantidad —ambas necesarias:** ningún volumen de datos compensa una etiqueta mal validada. La asignación de `nivel_riesgo` debe respaldarse siempre en un instrumento validado y, cuando sea posible, en revisión de un profesional de salud mental.
- **Consistencia:** aplicar el mismo instrumento de tamizaje y los mismos criterios de puntuación de forma uniforme durante toda la recolección; documentar cualquier cambio de versión del cuestionario.
- **Representatividad:** la muestra debe reflejar la diversidad demográfica y contextual de la población objetivo real, para evitar sesgos de desempeño entre subgrupos.
- **Cantidad mínima recomendada:** no existe un número universal aplicable a cualquier proyecto. Como referencia general, un modelo de clasificación inicial con pocas variables estructuradas suele requerir al menos cientos de registros etiquetados por clase para resultados mínimamente confiables, y considerablemente más para la clase minoritaria (riesgo alto). **Este aspecto deberá definirse durante la etapa de recopilación y preparación de los datos**, en función del desempeño observado en validaciones preliminares.
- **Actualización:** dado que el estado emocional es dinámico, el dataset debe actualizarse periódicamente y el modelo reentrenarse conforme se disponga de nuevos datos validados.
- **Documentación:** cada variable debe documentarse en un diccionario de datos (*data dictionary*) — fuente, instrumento de origen, escala, fecha de recolección, versión del cuestionario— esencial para la trazabilidad y auditoría de un modelo usado en un dominio de alta sensibilidad.
- **Cumplimiento normativo:** por tratarse de datos de salud (categoría de "datos sensibles" en la mayoría de marcos de protección de datos personales), el proceso de recopilación debe contar con respaldo legal y ético institucional. La normativa específica aplicable **deberá definirse durante la etapa de recopilación y preparación de los datos**.

---

## 8. Conclusión técnica

El problema —apoyar la identificación temprana de personas en riesgo psicoemocional— **es abordable mediante Inteligencia Artificial únicamente en su función de clasificación/priorización sobre datos de autoevaluación validados, no como herramienta de predicción o diagnóstico definitivo de un desenlace como el suicidio.** Esta distinción, ya establecida en el diseño del PMV, es también la que hace viable el dataset propuesto: un modelo que clasifica niveles de riesgo a partir de un instrumento validado es técnicamente alcanzable con datos de tamaño y calidad razonables; un modelo que pretenda predecir directamente un desenlace fatal no lo es, dada la rareza del evento y las limitaciones éticas de acceso a ese tipo de datos.

La calidad del dataset es, en este proyecto, tan determinante como el algoritmo elegido —si no más—, porque cualquier deficiencia (etiquetas mal validadas, sesgos no corregidos, desbalance no tratado) se traduce en un riesgo directo para la seguridad de las personas, no solo en una métrica de desempeño subóptima.

**Principales desafíos para construir un modelo confiable:**
1. El desbalance de clases inherente a este dominio.
2. La dificultad de obtener etiquetas de alta calidad sin comprometer la ética o la viabilidad del proyecto.
3. El riesgo de sesgos si la muestra no representa adecuadamente a la población objetivo.
4. La necesidad de mantener siempre la supervisión humana como parte del sistema: ningún modelo entrenado bajo estas condiciones debe operar como decisor autónomo en un dominio de esta sensibilidad.

---

*Ficha elaborada como guía metodológica para el diseño del dataset de entrenamiento. Los aspectos marcados como "Este aspecto deberá definirse durante la etapa de recopilación y preparación de los datos" requieren la participación de un profesional de salud mental y, según corresponda, asesoría ética/legal institucional.*
