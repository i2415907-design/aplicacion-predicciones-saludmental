# 🎓 GUÍA MAESTRA DE EXPOSICIÓN ACADÉMICA — EQUIPO "CABO VERDE"
## Alineada 100% con la Rúbrica Oficial de Sustentación de Inteligencia Artificial
### Proyecto: Sistema de Asistencia Clínica y Triage Preventivo en Salud Mental mediante Inteligencia Artificial

---

### 📌 FICHA TÉCNICA INSTITUCIONAL
- **Asignatura:** Inteligencia Artificial (Semestre VI - 2026)
- **Docente:** Mg. Karem Mercedes Maldonado Cordova
- **Equipo de Trabajo:** *“Cabo Verde”*
- **Integrantes:**
  1. **Arones Romani, Henry**
  2. **Inga Quispe, Diego Anthony**
  3. **Paucar Torres, Gabriel Emerando**
  4. **Ponce Otarola, Jarem Antonio**
- **Criterio Central de la Sustentación:**  
  $$\text{PROBLEMA CORRECTAMENTE FORMULADO} + \text{PMV FUNCIONAL} + \text{IA TÉCNICAMENTE JUSTIFICADA}$$
- **Secuencia Lógica Obligatoria:**  
  $$\mathbf{PROBLEMA} \longrightarrow \mathbf{PROPUESTA} \longrightarrow \mathbf{PMV} \longrightarrow \mathbf{DATOS} \longrightarrow \mathbf{IA} \longrightarrow \mathbf{RESULTADOS} \longrightarrow \mathbf{CONCLUSI\acute{O}N}$$

---

## 🧭 LAS 4 PREGUNTAS FUNDAMENTALES DE LA RÚBRICA

Antes de ver diapositiva por diapositiva, todo el equipo debe memorizar las respuestas a estas 4 preguntas clave que evaluará la docente:

1. **¿Qué problema real se está resolviendo?**  
   *La detección tardía y el triage reactivo de la depresión severa y el riesgo suicida en consultas médicas sobrecargadas (10 a 15 minutos), donde no da tiempo de aplicar tamizajes exhaustivos manuales.*
2. **¿Qué parte del problema resuelve el PMV desarrollado?**  
   *La fase de tamizaje inicial y priorización: digitaliza 5 escalas clínicas (84 ítems), calcula el riesgo en menos de 2 segundos, enciende alertas inmediatas (Código Rojo) y entrega al psicólogo un informe prescriptivo asistido por IA.*
3. **¿Cómo interviene la Inteligencia Artificial dentro de la solución?**  
   *Mediante una arquitectura híbrida: una capa de IA Simbólica determinista en código que calcula matemáticamente el score de riesgo (0-23 pts) sin margen de error, y un Copiloto Generativo en Google Vertex AI (Gemini 2.5 Flash) que analiza el expediente holístico, ejecuta herramientas mediante Function Calling y formula el plan de seguridad en 1.3s.*
4. **¿Qué evidencias demuestran que el PMV funciona y aporta valor?**  
   *Reducción del tiempo de triage de 20 minutos a menos de 2 segundos; 0% de falsos negativos en ideación activa (ítem 9 de PHQ-9 ≥ 2); latencia optimizada de 1.3s con `thinkingBudget: 0`; 3,465 encuestas y 2,000+ notificaciones procesadas; y una Tasa de Adopción de Protocolo proyectada $\ge 70\%$.*

---

## 📖 GUION DE EXPOSICIÓN DIAPOSITIVA POR DIAPOSITIVA (RÚBRICA OFICIAL)

---

### DIAPOSITIVA 0: Cita de Impacto y Realidad Epidemiológica
- **Texto:** *“Cada 40 segundos, una persona en el mundo se quita la vida; más de 700,000 al año. La depresión no es tristeza pasajera ni debilidad: es un dolor invisible que destruye en silencio cuando nadie detecta las señales a tiempo.”*
- **Qué decir al jurado:**
  > *"Iniciamos nuestra sustentación con una realidad crítica: según la OMS, el suicidio es la 4ta causa de muerte en jóvenes de 15 a 29 años. Más del 70% de las personas en riesgo emiten señales previas de ideación pasiva y desesperanza, pero la sobrecarga del sistema de salud y la falta de un triage preventivo impiden actuar a tiempo. Nuestro proyecto nace para transformar esa brecha."*

---

### DIAPOSITIVA 1: PARTE 1 — Presentación del Proyecto y Portada del PMV
- **Objetivo de la rúbrica:** Presentar nombre, integrantes, contexto y frase breve en una sola idea central.
- **Qué decir al jurado:**
  > *"Somos el equipo **Cabo Verde**, conformado por Henry Arones Romani, Diego Inga Quispe, Gabriel Paucar Torres y Jarem Ponce Otarola. Para la asignatura de **Inteligencia Artificial**, a cargo de nuestra docente Mg. Karem Mercedes Maldonado Cordova, presentamos el **Sistema de Asistencia Clínica y Triage Preventivo en Salud Mental**.*
  >
  > *Nuestra idea central es:* **Identificación temprana y priorización automatizada del riesgo de depresión y conducta suicida mediante triage inteligente para psicólogos y profesionales de salud.**"

---

### DIAPOSITIVA 2: PARTE 2 — Problema Identificado
- **Objetivo de la rúbrica:** Situación actual, quién se ve afectado, qué dificultad existe y qué consecuencias produce.
- **Qué decir al jurado:**
  > *"**1. Situación Actual y Consecuencias:** Más de 720,000 muertes al año y un incremento del 17% en América Latina. Afecta directamente a jóvenes, estudiantes y familias, produciendo pérdidas de vidas humanas evitables.*
  >
  > *2. **Dificultad Concreta:** Las consultas clínicas duran entre 10 y 15 minutos, lo que hace inviable aplicar manualmente cuestionarios extensos de 84 preguntas. La detección actual es **reactiva**: el sistema de salud solo se entera cuando el paciente ya está en la sala de emergencias con una autolesión. Existe una desconexión total entre las primeras señales del paciente y la atención oportuna del psicólogo."*

---

### DIAPOSITIVA 3: PARTE 3 — Objetivo del PMV
- **Objetivo de la rúbrica:** Indicar qué se busca mejorar, automatizar, clasificar, apoyar o recomendar.
- **Qué decir al jurado:**
  > *"El objetivo concreto de nuestro PMV es:*
  > 1. **Automatizar** la captura y cálculo psicométrico de 5 escalas internacionales (PHQ-9, C-SSRS, BHS, DASS-21, Rosenberg).
  > 2. **Clasificar** en menos de 2 segundos el nivel de severidad en una escala ordinal de 4 niveles: Bajo, Moderado, Alto y Muy Alto.
  > 3. **Apoyar y Recomendar** al profesional de turno mediante un Copiloto Clínico de IA que genera en tiempo real el plan de contingencia basado en evidencia (Plan de Seguridad Stanley & Brown y derivación a la Línea de Crisis 113)."*

---

### DIAPOSITIVA 4: PARTE 4 — Usuario y Necesidad
- **Objetivo de la rúbrica:** Identificar quién utilizará la solución y qué tarea o decisión se busca mejorar.
- **Qué decir al jurado:**
  > *"Nuestro PMV atiende a dos actores claramente definidos:*
  > - **Actor 1: El Paciente / Encuestado:** Una persona o estudiante vulnerable que necesita una autoevaluación anónima, confidencial, sin estigma social, que pueda responder en 5 minutos y que le brinde contacto inmediato con líneas de ayuda.
  > - **Actor 2: El Psicólogo / Triajista de Turno:** El profesional que necesita priorizar casos críticos (Código Rojo) entre cientos de encuestas, visualizar el expediente resumido y contar con un asistente que le ahorre tiempo redactando informes clínicos."*

---

### DIAPOSITIVA 5: PARTE 5 — Propuesta de Solución
- **Objetivo de la rúbrica:** Explicar qué hace el PMV, cómo funciona y diferenciar la solución completa del PMV.
- **Qué decir al jurado:**
  > *"El PMV funciona mediante un flujo continuo: el paciente llena un formulario wizard digital; el backend calcula automáticamente los baremos y pondera el riesgo de 0 a 23 puntos; la base de datos genera una alerta roja si hay peligro; y el psicólogo recibe el apoyo de un Copiloto con IA.*
  >
  > *Diferenciamos con claridad la visión completa del PMV desarrollado:*
  > - *La visión futura completa contempla seguimiento por meses, integración con relojes inteligentes (wearables) y predicción poblacional.*
  > - *El **PMV real implementado** se concentra estrictamente en la propuesta de valor esencial: **Triage rápido + Alerta roja inmediata + Asistencia médica en la decisión**."*

---

### DIAPOSITIVA 6: PARTE 6 — Alcance del PMV (Incluye / No Incluye)
- **Objetivo de la rúbrica:** Lista breve de qué se implementó y qué queda para versiones posteriores.
- **Qué decir al jurado:**
  > *"Para mantener un desarrollo ágil y verificable, definimos el alcance:*
  > - **Incluye:** Wizard de 10 pasos (84 ítems), motor de scoring compuesto (0-23 pts), semáforo clínico, panel de administración con filtros de riesgo, Copiloto Clínico de IA (Vertex AI Gemini), exportador de informes en PDF médico y Dashboard de Business Intelligence.
  > - **No incluye en esta fase:** App móvil nativa (se resolvió con web responsive en Next.js), notificaciones por SMS de pago, chat por WebSockets (el polling actual es suficiente) y analítica de series temporales largas."*

---

### DIAPOSITIVA 7: PARTE 7 — Arquitectura y Flujo del Sistema (¿Dónde está la IA?)
- **Objetivo de la rúbrica:** Mostrar cómo circula la información y observar dónde se encuentra realmente la IA.
- **Qué decir al jurado:**
  > *"La información circula a través de 6 capas:*
  > 1. *Usuario (Paciente en el navegador).*
  > 2. *Entrada (Petición POST con 84 respuestas a `/api/encuesta`).*
  > 3. *Backend (API Routes en Next.js 16 con validación de tipos).*
  > 4. **Componente de IA (El Núcleo):** Se encuentra en dos ubicaciones exactas del código:
  >    - En `src/lib/calculos.ts` (IA Simbólica determinista que procesa los 7 factores de riesgo en 2ms).
  >    - En `src/lib/ai/orchestrator.ts` (Google Vertex AI con Gemini 2.5 Flash que ejecuta Function Calling en 1.3s).
  > 5. *Resultado (Alerta en la tabla `notificaciones` con semáforo).*
  > 6. *Acción Clínica (Psicólogo activa Plan de Seguridad y derivación).* "

---

### DIAPOSITIVA 8: PARTE 8 — Datos Utilizados y Calidad (Semana 12 Colab)
- **Objetivo de la rúbrica:** Origen, variables, cantidad de registros y problemas de calidad detectados.
- **Qué decir al jurado:**
  > *"Trabajamos con una base de datos relacional en PostgreSQL 17 conformada por **17 tablas y 239 columnas**, con **3,465 encuestas procesadas** y un censo histórico de 279 fallecimientos.*
  >
  > *En la **Semana 12 en Google Colab**, aplicamos la regla de oro:* **Antes de limpiar datos de salud mental, debemos diagnosticarlos clínicamente.**
  >
  > *Detectamos un problema clásico de calidad: valores extremos en el PHQ-9 (puntaje 27). Un estadístico tradicional eliminaría el dato por ser outlier; nuestro diagnóstico clínico determinó que un 27 representa la máxima severidad del episodio depresivo. Eliminarlo provocaría un falso negativo letal. Por ende, la técnica aplicada fue **preservar y priorizar**."*

---

### DIAPOSITIVA 9: PARTE 9 — Formulación Técnica del Problema de IA
- **Objetivo de la rúbrica:** Definir técnicamente la tarea (clasificación, NLP, IA generativa) y justificarla.
- **Qué decir al jurado:**
  > *"Formulamos el problema de Inteligencia Artificial mediante dos tareas técnicas:*
  > 1. **Clasificación Multiclase Supervisada:**
  >    - *Entrada:* Vector estructurado de 84 respuestas psicométricas.
  >    - *Tarea:* Asignar una de 4 clases ordinales de riesgo (`bajo`, `moderado`, `alto`, `muy_alto`).
  >    - *Salida:* Nivel de severidad y bandera de Alerta Roja.
  > 2. **Generación Aumentada por Recuperación con Herramientas (RAG con Function Calling):**
  >    - *Entrada:* Expediente anonimizado del paciente + consulta del médico.
  >    - *Tarea:* Inferencia contextual, consulta a base de datos y síntesis asistencial.
  >    - *Salida:* Informe clínico prescriptivo en lenguaje natural."*

---

### DIAPOSITIVA 10: PARTE 10 — Algoritmo o Modelo Utilizado (Mapeo $X \rightarrow y$)
- **Objetivo de la rúbrica:** Justificar algoritmo, variables de entrada $X$ y variable objetivo $y$.
- **Qué decir al jurado:**
  > *"En `src/lib/calculos.ts` implementamos el modelo:*
  > - **Variables de Entrada $X$ (7 factores ponderados):** PHQ-9 total (0-4 pts), BHS desesperanza (0-4 pts), C-SSRS ideación (0-5 pts), PHQ-9 ítem 9 directo (0-3 pts), Intento previo (3 pts), Sustancias (2 pts), Aislamiento social (2 pts).
  > - **Variable Objetivo $y$:** `nivel_riesgo` (`bajo`, `moderado`, `alto`, `muy_alto`).
  > - **Criterio de Selección:** Elegimos un **Árbol de Decisión Clínico y Reglas Deterministas** como línea base porque en salud mental la **explicabilidad médica es obligatoria**: un psicólogo no puede aceptar una recomendación de una 'caja negra' que no explique por qué el paciente tiene riesgo inminente. Además, garantiza **cero alucinaciones** y ejecución en milisegundos."*

---

### DIAPOSITIVA 11: PARTE 11 — Demostración Funcional (Los 7 Pasos Obligatorios)
- **Objetivo de la rúbrica:** Guiar la demostración en vivo mostrando el recorrido completo de una entrada nueva.
- **Qué decir y mostrar al jurado (Guion de los 7 Pasos):**
  > *"Ejecutaremos la demostración en vivo siguiendo la secuencia exigida por la rúbrica:*
  > - **Paso 1 (Ingreso):** Simulamos el ingreso de un paciente nuevo en `/encuesta` con ideación activa.
  > - **Paso 2 (Captura):** El wizard de 10 pasos captura las 84 variables.
  > - **Paso 3 (Validación):** El backend valida rangos 0-3 y computa las sumatorias.
  > - **Paso 4 (Ejecución IA):** El motor calcula 14 puntos (≥12) y Vertex AI procesa el expediente.
  > - **Paso 5 (Resultado):** Se genera la categoría **'muy_alto'** y el semáforo en Código Rojo.
  > - **Paso 6 (Presentación):** La alerta aparece en tiempo real en el panel del psicólogo y en la pantalla del paciente con el número de crisis.
  > - **Paso 7 (Acción):** El psicólogo abre el Copiloto IA, recibe la recomendación del Plan Stanley & Brown, exporta el PDF médico y activa la derivación a la Línea 113."*

---

### DIAPOSITIVA 12: PARTE 12 — Resultados y Valor Generado (Antes vs Después)
- **Objetivo de la rúbrica:** Cuantificar la mejora frente al proceso tradicional (tiempo, errores, decisiones).
- **Qué decir al jurado:**
  > *"Los resultados del PMV son cuantificables y contrastables:*
  > - **Tiempo de Triage:** Se redujo de 15-20 minutos de cálculo manual a **menos de 2 segundos**.
  > - **Tiempo de Espera para Intervención:** De semanas para conseguir cita médica a **alerta roja en tiempo real**.
  > - **Sensibilidad Diagnóstica:** **0% de falsos negativos** en pacientes con ideación suicida activa (ítem 9 de PHQ-9 ≥ 2).
  > - **Latencia de IA:** Optimizamos la respuesta de Vertex AI de 6.0s a **1.3s** desactivando el thinking budget.
  > - **Adopción Proyectada:** Métrica Core de Tasa de Adopción de Protocolo (TAP) $\ge 70\%$."*

---

### DIAPOSITIVA 13: PARTE 13 — Limitaciones y Mejoras Futuras
- **Objetivo de la rúbrica:** Reconocer restricciones con honestidad técnica y proponer mejoras concretas.
- **Qué decir al jurado:**
  > *"Con transparencia de ingeniería reconocemos tres aspectos:*
  > 1. **Limitación:** El dataset inicial tiene base sintética generada con Faker para proteger la confidencialidad.  
  >    *Mejora:* Realizar un piloto clínico en un centro de salud universitario con consentimiento informado.
  > 2. **Limitación:** La línea base simbólica usa reglas ponderadas fijas.  
  >    *Mejora:* Entrenar un ensamble de **Random Forest o XGBoost** cuando acumulemos más de 10,000 registros validados.
  > 3. **Auditoría Resuelta:** Detectamos que la IA generativa filtraba nombres de código (`obtenerProtocoloClinico`). Implementamos alias clínicos institucionales en `orchestrator.ts` y sanitizador regex en el frontend."*

---

### DIAPOSITIVA 14: PARTE 14 — Conclusiones (Tres Ideas Finales)
- **Objetivo de la rúbrica:** Responder si se logró el objetivo con evidencia, qué aprendió el equipo y siguiente paso.
- **Qué decir al jurado:**
  > *"Concluimos nuestra sustentación con tres ideas fundamentales:*
  > 1. **Logro del Objetivo:** El PMV demostró con evidencia funcional que la digitalización y el triage inteligente reducen el tiempo de respuesta de semanas a menos de 2 segundos con 0% de falsos negativos.
  > 2. **Aprendizaje Técnico:** Comprobamos que la mejor arquitectura en salud es **híbrida**: la IA Simbólica aporta determinismo sin alucinaciones, y la IA Generativa aporta flexibilidad prescriptiva, siempre bajo supervisión médica (*Human-in-the-Loop*) y bajo la norma ISO 14971.
  > 3. **Siguiente Paso:** Escalar la solución hacia un piloto controlado para medir en campo la Tasa de Adopción de Protocolo con profesionales de la salud."*

---

### DIAPOSITIVA 15: Cierre Institucional ("¡Muchas Gracias!")
- **Texto:** *“¡Muchas Gracias! — La tecnología al servicio de la vida y la salud mental.”*
- **Qué decir al jurado:**
  > *"Agradecemos a nuestra docente Mg. Karem Mercedes Maldonado Cordova y quedamos a disposición del jurado para responder cualquier consulta técnica o funcional sobre el sistema. Muchas gracias."*

---

## 🛡️ BANCO DE PREGUNTAS DIFÍCILES DE LA PROFESORA

### Pregunta 1: *"¿Por qué afirman que su sistema usa IA si el cálculo de riesgo es determinista?"*
**Respuesta maestra:**
> *"Profesora, la IA Simbólica basada en reglas y árboles de decisión es una de las dos ramas históricas fundamentales de la Inteligencia Artificial (junto con el aprendizaje estadístico). En sistemas clínicos donde un error numérico puede costar una vida, el determinismo es una virtud, no un defecto. Además, nuestro sistema es una **arquitectura híbrida**: la IA Simbólica calcula el puntaje certero sin margen de error, y la **IA Generativa en Google Vertex AI (Gemini 2.5 Flash)** analiza el expediente del paciente, procesa el lenguaje natural y formula el plan de intervención mediante Function Calling."*

### Pregunta 2: *"¿Dónde está la base de datos y qué problemas de calidad detectaron en la Semana 12?"*
**Respuesta maestra:**
> *"Nuestra base de datos está implementada en **PostgreSQL 17** con 17 tablas y 239 columnas. En la **Semana 12 en Google Colab**, aprendimos que en salud mental no se pueden aplicar técnicas ciegas de eliminación de outliers: un paciente con puntaje 27 en PHQ-9 tiene un valor atípico estadísticamente, pero clínicamente representa un caso crítico inminente. Eliminarlo sería un error grave; por eso nuestra técnica de calidad consistió en validar la coherencia de rangos y clasificarlo con máxima prioridad."*

### Pregunta 3: *"¿Qué es la Tasa de Adopción de Protocolo y por qué es su Métrica Core?"*
**Respuesta maestra:**
> *"Es el porcentaje de alertas clínicas sugeridas por la IA que los psicólogos deciden activar en la práctica real. Es nuestra Métrica Core porque en Lean Startup medimos la **utilidad real y la confianza del usuario**: si el sistema emite recomendaciones que el profesional ignora, el proyecto no aporta valor. Nuestro criterio de éxito es una adopción $\ge 70\%$."*
