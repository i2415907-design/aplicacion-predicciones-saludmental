# Producto Mínimo Viable (PMV): Sistema de BI e Inteligencia Artificial para la Prevención de la Depresión y el Riesgo Suicida

**Proyecto base:** Sistema de BI e Inteligencia Artificial para prevención y depresión de suicidio
**Problema abordado:** Incremento de personas con riesgo a ser vulnerables a depresión, autolesiones y suicidio
**Enfoque metodológico:** Lean Startup — ciclo Construir-Medir-Aprender (Build-Measure-Learn)

> **Nota metodológica:** Este análisis se limita a la información proporcionada por el equipo del proyecto. Todo aspecto que dependa de decisiones de negocio, institucionales, legales o clínicas específicas —y que no pueda determinarse con la información disponible— se marca explícitamente como *"Debe validarse durante el desarrollo del proyecto."*

---

## 1. Hipótesis del PMV

> **Creemos que**, al ofrecer a los usuarios de una población objetivo (institución educativa, entorno laboral u otro contexto — *a definir por el equipo*) una autoevaluación emocional digital periódica, basada en instrumentos de tamizaje validados, y complementada con un módulo de Inteligencia Artificial que clasifique el nivel de riesgo de las respuestas en bajo/medio/alto,
>
> **Para** conectar de forma oportuna a las personas con indicios de riesgo con un profesional de salud mental o una línea de ayuda,
>
> **Obtendremos como resultado** que una proporción significativa de los casos de riesgo medio o alto sean identificados tempranamente y efectivamente derivados a atención profesional — algo que hoy, sin este sistema, ocurre de forma tardía, reactiva o no ocurre en absoluto,
>
> **Lo comprobaremos cuando**, durante un piloto controlado (se sugiere una duración de 4 a 8 semanas, con un grupo reducido de usuarios que otorguen consentimiento informado), se registre: (a) una tasa de finalización del cuestionario igual o superior al 80%; (b) al menos un caso de riesgo medio/alto correctamente identificado por el sistema y derivado a un profesional dentro de un plazo definido (p. ej., 24 horas); y (c) una valoración de utilidad percibida positiva tanto por los usuarios como por los profesionales de salud mental involucrados.

**¿Por qué esta hipótesis permite validar la idea?**

Aísla la **propuesta de valor central** del proyecto —detección temprana + conexión oportuna con ayuda profesional— sin depender de funcionalidades secundarias (seguimiento longitudinal, chatbot, analítica predictiva). Es:

- **Específica:** define población, mecanismo (autoevaluación + IA) y resultado esperado (derivación efectiva).
- **Medible:** se apoya en indicadores cuantificables (tasa de finalización, tiempo de derivación, valoración de utilidad).
- **Validable:** puede confirmarse o refutarse en un plazo corto (piloto de semanas, no meses).
- **Coherente con el problema:** responde directamente al incremento de personas en riesgo que no están siendo detectadas ni atendidas a tiempo.

Si la hipótesis se refuta (por ejemplo, baja participación o baja tasa de derivación efectiva), el equipo aprende esto con una inversión mínima, antes de construir el sistema completo.

---

## 2. Funcionalidad mínima

| Funcionalidad | Objetivo | Prioridad |
|---|---|---|
| Registro de usuario con opción de seudónimo/anonimato | Reducir la barrera de estigma y proteger la identidad del usuario | **Alta** |
| Consentimiento informado digital | Asegurar que el usuario comprende el propósito, alcance y límites del sistema (no es un servicio de emergencia ni reemplaza atención clínica) | **Alta** |
| Cuestionario de autoevaluación emocional periódico (basado en escalas validadas) | Recolectar los datos estructurados mínimos necesarios para estimar el nivel de riesgo | **Alta** |
| Módulo de IA de clasificación de riesgo (bajo/medio/alto) | Priorizar casos que requieren atención humana; es el componente de Inteligencia Artificial central del PMV | **Alta** |
| Acceso directo y permanente a línea de ayuda/crisis | Garantizar que todo usuario tenga acceso inmediato a apoyo profesional, independientemente del resultado de la IA | **Alta** |
| Sistema de alerta y derivación a un profesional designado | Cerrar el ciclo de valor: de la detección a una acción humana concreta | **Alta** |
| Panel de BI básico con indicadores agregados y anónimos | Dar visibilidad institucional a tendencias generales para apoyar decisiones de asignación de recursos | **Alta** |
| Historial longitudinal individual con gráficas de evolución emocional | Permitir seguimiento personalizado en el tiempo | Media |
| Notificaciones y recordatorios personalizados | Aumentar la adherencia al uso periódico del sistema | Media |
| Chatbot conversacional de apoyo emocional | Ofrecer acompañamiento adicional entre evaluaciones | Baja |
| Analítica predictiva avanzada de tendencias poblacionales | Anticipar patrones de riesgo a futuro | Baja |
| Integración con datos biométricos o wearables | Enriquecer la clasificación de riesgo con señales fisiológicas | Baja |
| Multi-idioma y accesibilidad avanzada | Ampliar el alcance a poblaciones más diversas | Baja |
| Red de apoyo entre pares moderada | Fomentar soporte social estructurado entre usuarios | Baja |

**¿Por qué las funcionalidades de prioridad Media/Baja se desarrollan después?**

- No son necesarias para validar la hipótesis central: lo que se prueba es "detección + derivación", no "acompañamiento continuo" ni "predicción poblacional".
- Algunas requieren **validación clínica y de seguridad adicional** antes de exponerlas a usuarios reales: un chatbot conversacional en temas de salud mental, por ejemplo, implica un riesgo de interacción directa mucho mayor que un cuestionario de tamizaje, y no debería construirse sin dicha validación previa.
- Otras dependen de que el sistema ya cuente con una base de usuarios y datos reales (la analítica predictiva, por ejemplo, necesita historial acumulado que el PMV aún no genera).
- Construirlas antes de validar la hipótesis central iría en contra del principio Lean Startup de minimizar el esfuerzo invertido en funcionalidades no validadas.

---

## 3. Construcción del PMV

### Alcance
El PMV cubre únicamente el **ciclo mínimo de valor**: autoevaluación → clasificación de riesgo por IA → alerta y derivación humana → visibilidad agregada en BI. Quedan explícitamente **fuera de alcance**: chatbot conversacional, seguimiento longitudinal individual, analítica predictiva, integración con wearables y funcionalidades de red social. El público objetivo específico (tipo de institución, tamaño del grupo piloto, cobertura geográfica) **debe validarse durante el desarrollo del proyecto**.

### Flujo general
1. El usuario ingresa a la plataforma y **acepta el consentimiento informado**.
2. El usuario completa el **cuestionario de autoevaluación** (breve, periódico).
3. El **módulo de IA** procesa las respuestas y asigna un nivel de riesgo: bajo, medio o alto.
4. Bifurcación según resultado:
   - **Riesgo bajo:** el usuario recibe retroalimentación general y recursos de bienestar. La línea de ayuda permanece visible.
   - **Riesgo medio/alto:** el usuario recibe **de inmediato** la información de contacto con ayuda profesional/línea de crisis, sin esperar una revisión humana previa, **y** en paralelo se genera una alerta automática al profesional designado.
5. El profesional revisa la alerta y registra el seguimiento en un módulo simple de gestión de casos.
6. Los datos, agregados y anonimizados, alimentan el **panel de BI** institucional.

### Componentes principales
- **Frontend** (web o app): cuestionario, resultados, recursos de ayuda.
- **Backend/API:** gestión de usuarios, lógica del flujo, seguridad.
- **Módulo de IA/clasificación de riesgo.**
- **Base de datos cifrada** para el almacenamiento de respuestas.
- **Módulo de alertas** hacia el profesional designado.
- **Panel de BI** (dashboard de indicadores agregados).
- **Módulo simple de gestión de casos** para el registro del seguimiento profesional.

### Interacción del usuario
La interacción debe ser breve y de baja fricción (cuestionario completable en pocos minutos), con una interfaz simple y sin tecnicismos. Los recursos de ayuda/crisis deben ser **siempre visibles**, no ocultos en submenús, independientemente del resultado obtenido.

### Dónde interviene la IA y cómo aporta valor
La Inteligencia Artificial interviene en un único punto crítico: el **módulo de clasificación de riesgo**, que procesa las respuestas del cuestionario (y, opcionalmente, texto libre mediante Procesamiento de Lenguaje Natural) para asignar un nivel de riesgo. Su valor está en actuar como una capa de **priorización (triage)** que permite a un equipo humano —necesariamente limitado en capacidad— enfocar su atención en los casos más urgentes, en lugar de revisar manualmente todas las respuestas.

Es fundamental dejar establecido, tanto en el diseño técnico como en la comunicación al usuario, que **la IA no diagnostica ni reemplaza el juicio clínico**: su función es exclusivamente de apoyo a la priorización y alerta, siempre sujeta a revisión humana.

### Datos mínimos necesarios
- Respuestas estructuradas al cuestionario de autoevaluación. *(La selección del instrumento de tamizaje específico —por ejemplo, adaptaciones de escalas reconocidas como el PHQ-9 para depresión o el Columbia Protocol/C-SSRS para ideación suicida— debe definirse con el acompañamiento de un profesional de salud mental, dado que su uso e interpretación requieren validación clínica.)*
- Marca de tiempo de cada respuesta.
- Identificador de usuario (seudónimo, no necesariamente datos personales identificables).
- Registro del consentimiento informado.

No se recomienda recolectar en esta etapa datos biométricos, de geolocalización precisa o de identidad completa, salvo justificación clínica/legal específica. Qué datos institucionales adicionales podrían incorporarse (p. ej. indicadores académicos o laborales) **debe validarse durante el desarrollo del proyecto**, con respaldo de un comité de ética.

### Tecnologías sugeridas
| Componente | Sugerencia | Justificación |
|---|---|---|
| Frontend | React o framework ligero equivalente | Rapidez de desarrollo y amplio soporte de componentes de formularios |
| Backend | Node.js (Express) o Python (FastAPI) | Ecosistemas maduros, adecuados para el prototipado rápido de un PMV |
| IA / Clasificación | Modelo de clasificación supervisado (p. ej. scikit-learn) sobre respuestas estructuradas; NLP básico si se incorpora texto libre | No requiere infraestructura compleja de ML; suficiente para validar si la clasificación aporta valor operativo |
| Base de datos | PostgreSQL con cifrado en reposo | Robustez y compatibilidad con requisitos de protección de datos sensibles |
| BI | Herramienta de bajo costo/rápida implementación (p. ej. Metabase o Power BI) | Evita construir un módulo de BI propio desde cero en la etapa de validación |
| Hosting | Proveedor cloud con opciones de cumplimiento de privacidad | A validar según la normativa de protección de datos aplicable en el país correspondiente |

*Nota: la selección final de tecnologías debe validarse según las capacidades del equipo, presupuesto y normativa institucional/legal aplicable.*

### Justificación del diseño
Este alcance es suficiente para validar la solución porque implementa el **ciclo de valor completo** (detección → alerta → derivación → visibilidad) con la mínima complejidad técnica posible, permitiendo comprobar tanto la **viabilidad técnica** (¿la clasificación de riesgo es operativamente útil?) como la **viabilidad de valor** (¿usuarios y profesionales encuentran útil el sistema?), sin incurrir en el costo, tiempo y riesgo de construir funcionalidades avanzadas que solo tienen sentido si la hipótesis central se confirma primero.

---

## 4. Pruebas del PMV

| Prueba | Objetivo | Resultado esperado |
|---|---|---|
| **Funcional** | Verificar que el flujo completo (registro → cuestionario → clasificación IA → alerta → panel BI) se ejecuta sin errores | Los casos de prueba —incluyendo escenarios simulados de riesgo bajo, medio y alto— se ejecutan correctamente, sin pérdida de datos ni fallos en la generación de alertas |
| **Usabilidad** | Evaluar si los usuarios completan el cuestionario y comprenden los resultados/recursos sin dificultad | Tasa de finalización ≥ 80%; comprensión del propósito del sistema sin necesidad de explicación adicional (prueba moderada con 5-8 usuarios) |
| **Con usuarios (piloto controlado)** | Validar la hipótesis de valor con un grupo reducido de usuarios reales, bajo consentimiento informado y supervisión institucional/ética | Retroalimentación cualitativa mayormente positiva; al menos un caso real de riesgo detectado y correctamente derivado durante el piloto |
| **Calidad de datos / IA** | Evaluar el desempeño del modelo de clasificación frente a un conjunto de validación revisado por un profesional de salud mental | Se prioriza sensibilidad (recall) sobre precisión general, minimizando falsos negativos; el umbral numérico específico **debe validarse con un profesional clínico antes del piloto** |
| **Rendimiento básico** | Verificar tiempos de respuesta y estabilidad del sistema bajo la carga esperada del piloto (bajo volumen de usuarios) | Tiempo de respuesta menor a 2-3 segundos por interacción; sin caídas del sistema durante el periodo de piloto |

---

## 5. Indicadores de éxito

| Indicador | Cómo se mide | Meta esperada |
|---|---|---|
| Tasa de finalización del cuestionario | (usuarios que completan / usuarios que inician) × 100 | ≥ 80% |
| Tasa de derivación efectiva de casos de riesgo | (alertas de riesgo medio/alto atendidas por un profesional / alertas generadas) × 100 | 100% — indicador crítico de seguridad, no negociable |
| Tiempo de respuesta a alertas de riesgo alto | Tiempo entre la generación de la alerta y la primera respuesta del profesional | ≤ 24 horas (ajustable según capacidad institucional real) |
| Sensibilidad (recall) del modelo de IA | Comparación de las clasificaciones del modelo frente a la evaluación de un profesional sobre un conjunto de validación | Debe validarse durante el desarrollo del proyecto, junto con un profesional clínico |
| Utilidad percibida por los usuarios | Encuesta post-uso (escala Likert 1-5 o NPS) | ≥ 70% de valoraciones positivas |
| Tiempo de respuesta técnico del sistema | Medición de logs de backend (latencia por solicitud) | < 2-3 segundos |
| Tasa de retención durante el piloto | (usuarios activos en la última semana / usuarios registrados en la primera semana) × 100 | Debe validarse durante el desarrollo del proyecto (depende del contexto institucional) |

---

## 6. Riesgos del PMV

| Riesgo | Impacto | Estrategia de mitigación |
|---|---|---|
| Falsos negativos: el modelo no detecta un caso real de riesgo alto | **Crítico** — consecuencias potencialmente graves para la seguridad de la persona | Priorizar sensibilidad sobre precisión; mantener siempre visible el acceso a líneas de ayuda, independientemente del resultado de la IA; supervisión humana obligatoria; validación clínica del modelo antes de usarlo con usuarios reales |
| Falsos positivos frecuentes | Medio — sobrecarga del equipo profesional, posible pérdida de confianza en el sistema | Ajuste iterativo de umbrales durante el piloto; capacitación del equipo receptor de alertas |
| Vulneración de privacidad y confidencialidad de datos sensibles | Alto — legal, ético y reputacional | Cifrado de datos, seudonimización, consentimiento informado explícito, cumplimiento de normativa de protección de datos aplicable, revisión ética institucional previa al piloto |
| El usuario interpreta el resultado de la IA como un diagnóstico clínico | Alto | Mensajes explícitos en la interfaz aclarando que el sistema no diagnostica; contacto humano profesional siempre disponible junto al resultado |
| Baja participación por estigma asociado a temas de salud mental | Medio — compromete la validez de la validación | Enfatizar anonimato y confidencialidad; involucrar a profesionales de confianza de la institución en la difusión del piloto |
| Capacidad insuficiente del equipo profesional para atender alertas | Alto | Definir protocolo y capacidad de respuesta antes de iniciar el piloto; limitar el tamaño del grupo piloto a la capacidad real disponible |
| Sesgos del modelo de IA por datos de entrenamiento no representativos | Medio-Alto | Uso de conjuntos de datos diversos y validados; revisión de resultados desagregados por grupo; acompañamiento de expertos del dominio clínico |

---

## 7. Recomendaciones

**Mejoras futuras** *(evolución de funcionalidades ya validadas)*
- Seguimiento longitudinal individual con visualización de evolución emocional en el tiempo.
- Incorporación de instrumentos de evaluación adicionales, más allá del cuestionario inicial.

**Nuevas funcionalidades** *(no presentes en el PMV, a evaluar tras la validación)*
- Chatbot conversacional de apoyo (requiere validación clínica y de seguridad específica antes de implementarse).
- Módulo de recursos de bienestar personalizados según perfil del usuario.
- Programación de seguimiento con profesionales vía integración de calendario.

**Optimizaciones** *(mejoras sobre lo ya construido)*
- Reentrenamiento periódico del modelo de IA con datos del piloto y ajuste de umbrales de clasificación.
- Mejora de la experiencia de usuario (UX) a partir de la retroalimentación recogida en las pruebas.
- Evolución del panel de BI hacia reportes más automatizados conforme crezca el volumen de datos.

**Escalabilidad** *(crecimiento más allá del piloto)*
- Extensión a otras instituciones o poblaciones adicionales, una vez validada la hipótesis.
- Migración a una arquitectura más robusta (p. ej. microservicios) si el volumen de usuarios lo requiere.
- Soporte multi-idioma y accesibilidad ampliada si el proyecto se extiende a poblaciones más diversas.

---

## 8. Conclusión

El PMV diseñado permite validar la propuesta de valor central del proyecto —detección temprana de señales de riesgo y conexión oportuna con ayuda profesional— con una inversión mínima de tiempo y recursos, evitando construir funcionalidades avanzadas (chatbot, analítica predictiva, seguimiento longitudinal) cuya utilidad depende de que la hipótesis central se confirme primero.

Al centrarse únicamente en el ciclo mínimo de valor (autoevaluación → clasificación por IA → alerta → derivación humana → visibilidad en BI), el equipo puede obtener evidencia real sobre:
- Si los usuarios están dispuestos a utilizar una herramienta digital para este propósito.
- Si el módulo de IA aporta una señal operativamente útil para priorizar casos.
- Si el proceso de derivación a profesionales es viable en la práctica.
- Si los tomadores de decisión institucionales encuentran valor en el panel de BI.

Este enfoque reduce el riesgo del proyecto en dos dimensiones: **riesgo técnico** (evita invertir en infraestructura compleja de IA sin saber si es necesaria) y **riesgo de mercado/adopción** (evita construir un sistema completo que los usuarios podrían no adoptar). Además, expone tempranamente los aspectos éticos, legales y clínicos que deben resolverse —consentimiento, privacidad, validación clínica del modelo, capacidad de respuesta profesional— antes de escalar la solución, permitiendo al equipo tomar decisiones informadas (continuar, pivotar o descartar) con evidencia real y no solo con supuestos.

---

*Documento elaborado como guía metodológica de diseño de PMV. Los aspectos marcados como "Debe validarse durante el desarrollo del proyecto" requieren decisiones específicas del equipo, la institución y, dado el dominio del proyecto, la participación de profesionales de salud mental y asesoría ética/legal.*
