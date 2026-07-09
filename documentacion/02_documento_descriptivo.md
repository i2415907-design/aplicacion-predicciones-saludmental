# DOCUMENTO DESCRIPTIVO
## Sistema de BI e Inteligencia Artificial para Prevencion de Depresion y Suicidio

**Proyecto Academico** — 6to Ciclo, Ingenieria de Sistemas  
**Julio 2026**

---

## 1. RESUMEN EJECUTIVO

Este proyecto presenta el diseno, desarrollo e implementacion de un **sistema de inteligencia artificial orientado a la identificacion temprana de personas con riesgo de depresion, autolesiones y suicidio**. El sistema combina un formulario clinico digital validado, un motor de calculo de riesgo basado en escalas psicometricas reconocidas internacionalmente, un panel de administracion para profesionales de salud mental, y un asistente de IA contextual que genera recomendaciones clinicas personalizadas.

El problema que aborda es critico: la OMS reporta que mas de **720,000 personas mueren por suicidio cada ano** a nivel mundial, siendo esta la cuarta causa de muerte en personas de 15 a 29 anos. En muchos contextos, la deteccion de personas en riesgo depende exclusivamente de la evaluacion clinica manual durante consultas breves, lo que resulta insuficiente para identificar patrones de vulnerabilidad antes de que ocurra una crisis.

Este sistema propone una solucion que **automatiza la recopilacion, analisis y alerta** a partir de formularios clinicos, permitiendo que el personal de salud detecte riesgos de forma preventiva y no reactiva.

---

## 2. CONTEXTO Y PROBLEMA

### 2.1 El Problema de Salud Publica

La depresion y el suicidio representan una de las mayores crisis de salud mental a nivel global:

- **720,000+ muertes por suicidio al ano** (OMS, 2023)
- **La depresion es la causa principal de discapacidad** a nivel mundial
- **1 de cada 100 personas** mayores de 60 anos muere por suicidio
- **Los jovenes de 15-29 anos** son el grupo mas vulnerable
- En America Latina, las tasas de suicidio han **aumentado un 17%** en la ultima decada

### 2.2 La Brecha en la Deteccion

En centros de salud de nivel primario, el proceso actual de deteccion presenta limitaciones estructurales:

- **Tiempo limitado:** Las consultas duran en promedio 10-15 minutos, insuficientes para una evaluacion psicologica completa
- **Subjetividad:** La evaluacion depende exclusivamente de la percepcion del clinico
- **Falta de herramientas estandarizadas:** No todos los centros utilizan escalas clinicas validadas
- **Reactividad:** Solo se evalua cuando el paciente ya presenta sintomas evidentes
- **Sobrecarga:** El personal de salud maneja cientos de pacientes simultaneamente

### 2.3 El Impacto Economico y Social

- La depresion cuesta a la economia global **$1 trillon dolares al ano** en perdida de productividad
- Cada muerte por suicidio afecta en promedio a **135 personas** cercanas
- Los intentos fallidos de suicidio generan costos medicos significativos
- La falta de deteccion temprana prolonga el sufrimiento innecesariamente

---

## 3. HIPOTESIS

### 3.1 Hipotesis de Valor

**Identificar personas con riesgo de vulnerabilidad de problemas psicologicos (depresion, autolesiones, etc.) mediante una IA que usara informacion recopilada a traves de formularios clinicos.**

Esta hipotesis se sustenta en que:
- Los formularios clinicos estandarizados (PHQ-9, C-SSRS, BHS, Rosenberg, DASS-21) son herramientas validadas internacionalmente con sensibilidades superiores al 80%
- La combinacion de multiples escalas permite capturar dimensiones diferentes de la salud mental (depresion, ideacion suicida, desesperanza, autoestima, regulacion emocional)
- Los factores contextuales (socioeconomicos, relaciones, salud fisica, eventos vitales) aportan informacion complementaria critica para el diagnostico
- Un algoritmo de riesgo compuesto puede identificar patrones que un clinico podria pasar por alto en una evaluacion rapida

### 3.2 Hipotesis Tecnica

**Los formularios contienen la informacion suficiente para identificar un patron de vulnerabilidad antes de que ocurra la crisis.**

Esta hipotesis tecnica se valida por que:
- Las 5 escalas clinicas cubren **84 items** de evaluacion psicometrica
- Los **17 campos demograficos y contextuales** aportan variables de riesgo conocidas
- El algoritmo de riesgo global combina **7 factores ponderados** con un puntaje maximo de 23 puntos
- La distribucion de datos permite clasificar pacientes en 4 niveles de riesgo (bajo, moderado, alto, muy alto)
- El sistema procesa **~100+ variables por encuesta** en menos de 2 segundos

---

## 4. EL EXPERIMENTO

### 4.1 Diseno del Experimento

En lugar de programar una solucion extensa con integracion con BI y una IA predictiva, creamos un **flujo manual que valida la viabilidad del concepto** antes de escalar.

**Fase 1: Diseno del formulario digital**
- Se disenaron 10 pasos de evaluacion cubriendo todas las dimensiones clinicas relevantes
- Cada paso utiliza escalas validadas internacionalmente (PHQ-9, C-SSRS, BHS, Rosenberg, DASS-21)
- Se incluyeron factores socioeconomicos, relaciones, salud fisica y eventos vitales
- El formulario es accesible desde cualquier dispositivo con navegador web

**Fase 2: Prueba con datos sinteticos**
- Se generaron **3,465 encuestas sinteticas** usando algoritmos de distribucion ponderada
- Los datos simulan poblaciones reales con distribuciones de edad, sexo, zona residencia y severidad clinica
- Se crearon **2,000+ notificaciones** automaticas clasificadas por nivel de riesgo
- Se valido que el sistema de clasificacion de riesgo funciona correctamente

**Fase 3: Implementacion del motor de IA**
- Se integro un modelo de lenguaje (Llama 3.3 70B) como asistente clinico
- El chatbot recibe el contexto completo del paciente y genera recomendaciones
- Se implementaron 4 dimensiones de analisis: Descriptivo, Diagnostico, Predictivo, Prescriptivo
- SeValido que las recomendaciones son clinicamente relevantes

**Fase 4: Panel de administracion**
- Se creo un panel para psicologos con vista completa de encuestas
- Sistema de notificaciones con clasificacion automatica de riesgo
- Herramienta de archivado y categorizacion de casos
- Descarga de reportes en formato PDF

### 4.2 Variables del Experimento

**Variable independiente:** Aplicacion del formulario clinico digital  
**Variable dependiente:** Nivel de riesgo identificado (bajo/moderado/alto/muy alto)  
**Variables de control:**
- Edad: 10-100 anos
- Sexo: masculino, femenino, no binario, otro
- Zona: urbana, rural
- Estado civil: soltero, casado, divorciado, viudo, union libre

### 4.3 Datos del Experimento

| Metrica | Valor |
|---------|-------|
| Encuestas generadas | 3,465 |
| Notificaciones creadas | 2,000+ |
| Escalas clinicas por encuesta | 5 |
| Items totales por encuesta | 84+ |
| Variables contextuales | 17 |
| Usuarios registrados | 4 (1 admin + 3 prueba) |
| Rango de fechas | Enero 2024 - Junio 2026 |

### 4.4 Distribucion de Severidad Clinica

**PHQ-9 (Depresion):**
| Nivel | Porcentaje |
|-------|-----------|
| Minimo | 20% |
| Leve | 22% |
| Moderado | 25% |
| Moderadamente severo | 18% |
| Severo | 15% |

**Riesgo Global:**
| Nivel | Porcentaje |
|-------|-----------|
| Bajo | ~45% |
| Moderado | ~30% |
| Alto | ~18% |
| Muy alto | ~7% |

---

## 5. LA METRICA CORE

### 5.1 Definicion

**Tasa de Adopcion de Protocolo**

**Formula:**  
`Tasa de Adopcion = (Numero de veces que el personal de salud activo el protocolo sugerido por la alerta) / (Numero total de alertas preventivas enviadas) x 100`

### 5.2 Interpretacion

Esta metrica mide si los profesionales de la salud estan dispuestos a **cambiar su metodo de trabajo** basandose en las recomendaciones del sistema.

**Ejemplo de calculo:**
- Si el sistema envia 100 alertas preventivas
- Y el personal de salud activa el protocolo en 70 de ellas
- La tasa de adopcion es del **70%**

### 5.3 Por que esta metrica?

- No mide la precision del sistema (eso se mide con datos clinicos reales)
- Mide la **utilidad percibida** por los profesionales
- Si el personal confia en el sistema, usara sus recomendaciones
- Si no confia, el sistema es tecnologicamente correcto pero clinicamente inutil
- Es la metrica mas importante para decidir si se continua o se pivotea

### 5.4 Datos para el Calculo

Actualmente el sistema tiene la infraestructura para medir esta metrica:
- Las notificaciones incluyen campo `accion_requerida` con el protocolo sugerido
- El campo `respuesta` del admin registra si se acepto la recomendacion
- El campo `leida` indica si el profesional vio la alerta
- **Falta implementar:** Un campo explicito que registre si se ejecuto el protocolo (actualmente solo se registra la respuesta)

---

## 6. EL CRITERIO DE EXITO

### 6.1 Criterio Principal

**Si el personal medico acata e implementa el protocolo de contencion sugerido en al menos el 70% de las alertas emitidas, validamos que hay confianza en el sistema y procedemos a estructurar el modelo de Machine Learning y el pipeline de BI.**

### 6.2 Interpretacion del Criterio

| Tasa de Adopcion | Decision |
|------------------|----------|
| >= 70% | **Validacion positiva** → Proceder a ML y BI |
| 50-69% | **Zona de mejora** → Ajustar interfaz y recomendaciones |
| < 50% | **Pivotar** → Rediseñar el enfoque o la propuesta de valor |

### 6.3 Justificacion del 70%

- El 70% representa una **mayoria calificada** de aceptacion
- Indica que la mayoria de los profesionales confia en el sistema
- Permite un margen del 30% para resistencia al cambio natural
- Es un umbral realista para una primera implementacion

### 6.4 Metricas Complementarias

| Metrica | Descripcion | Objetivo |
|---------|-------------|----------|
| Tasa de lectura de alertas | % de notificaciones leidas | >= 90% |
| Tiempo de respuesta promedio | Tiempo entre alerta y respuesta | < 24 horas |
| Tasa de completitud de encuestas | % de encuestas completadas vs iniciadas | >= 80% |
| Satisfaccion del usuario | Encuesta de satisfaccion (1-5) | >= 4.0 |
| Tasa de retencion de usuarios | % de usuarios que repiten encuesta | >= 30% |

---

## 7. IMPORTANCIA DEL PROYECTO

### 7.1 Impacto en Salud Publica

Este proyecto tiene el potencial de **salvar vidas** al permitir la deteccion temprana de personas en riesgo:

- **Prevencion sobre reaccion:** En vez de esperar a que ocurra una crisis, el sistema identifica el riesgo antes
- **Estandarizacion:** Todas las evaluaciones usan las mismas escalas validadas, eliminando la subjetividad
- **Escalabilidad:** Un solo sistema puede atender multiples centros de salud simultaneamente
- **Accesibilidad:** El formulario se puede completar desde cualquier dispositivo, reduciendo barreras de acceso

### 7.2 Impacto en Profesionales de Salud

- **Reduccion de carga cognitiva:** El sistema automatiza el tamizaje, permitiendo que el clinico se enfoque en la intervencion
- **Decisiones basadas en datos:** Las graficas y estadisticas proporcionan evidencia objetiva para la toma de decisiones
- **Herramienta de seguimiento:** El panel de administracion permite monitorear la evolucion de pacientes a lo largo del tiempo
- **Asistente inteligente:** El chatbot clinico ofrece recomendaciones basadas en evidencia, funcionando como una segunda opinion

### 7.3 Impacto Academico

- **Validacion de methodology:** Demuestra que las escalas clinicas pueden integrarse en sistemas digitales de forma efectiva
- **Base para investigacion:** Los 3,465 registros permiten analisis estadisticos de poblacion
- **Referencia para futuros trabajos:** Establece un patron arquitectonico para sistemas similares
- **Interdisciplinariedad:** Combina ingenieria de software, psicologia clinica, inteligencia artificial y ciencia de datos

### 7.4 Impacto Economico

- **Reduccion de costos de emergencia:** La deteccion temprana reduce intervenciones de crisis costosas
- **Mejora de productividad:** Pacientes tratados a tiempo retornan mas rapido a sus actividades
- **Optimizacion de recursos:** Permite priorizar casos que realmente requieren atencion intensiva
- **Eficiencia operativa:** Automatiza tareas de tamizaje que actualmente consumen tiempo clinico valioso

### 7.5 Alineacion con Objetivos de Desarrollo Sostenible

El proyecto contribuye a los ODS de la ONU:
- **ODS 3:** Salud y bienestar (meta 3.4: reducir mortandad prematura por enfermedades no transmisibles)
- **ODS 10:** Reduccion de las desigualdades (acceso equitativo a servicios de salud mental)
- **ODS 9:** Industria, innovacion e infraestructura (tecnologia al servicio de la salud)

---

## 8. FUNCIONALIDADES DESARROLLADAS

### 8.1 Encuesta Clinica Multidimensional
El sistema ofrece una encuesta de 10 pasos que evalua 5 escalas clinicas validadas + factores contextuales. El usuario puede completarla de forma anonima o con sesion. El sistema calcula automaticamente puntajes y genera un nivel de riesgo compuesto.

**Escalas implementadas:**
- PHQ-9: 9 items (Depresion) — Rango 0-27
- C-SSRS: 7 preguntas (Ideacion Suicida) — 4 niveles de severidad
- BHS: 20 items (Desesperanza) — Rango 0-20
- Rosenberg: 10 items (Autoestima) — Rango 10-40
- DASS-21: 21 items (Depresion/Ansiedad/Estrés) — 3 subescalas

### 8.2 Sistema de Alertas Automaticas
Al enviar una encuesta, se genera una notificacion clasificada por nivel de gravedad con descripcion del caso y accion recomendada.

### 8.3 Panel de Administracion
Panel protegido con vista completa de encuestas, filtros por riesgo y categoria, y gestion de notificaciones con respuesta.

### 8.4 Chatbot IA Contextual
Asistente de IA que recibe el contexto del paciente y genera recomendaciones clinicas: protocolos, preguntas de seguimiento, planes de tratamiento.

### 8.5 Dashboard de Inteligencia de Negocios
Panel visual con KPIs, graficas de distribucion por edad, sexo, nivel de riesgo, y tendencia temporal.

### 8.6 Descarga de Reportes PDF
Generacion automatica de reportes clinicos en formato PDF con todas las escalas y resultados.

### 8.7 Sistema de Archivado
Categorias predefinidas y personalizables para organizar casos (Caso Especial, Seguimiento, Estabilizado, Derivado, Cerrado).

---

## 9. FUNCIONALIDADES EXCLUIDAS (MVP)

| Funcionalidad | Razon de Exclusion |
|---------------|-------------------|
| Notificaciones por email/SMS | Requiere servicios externos; in-app es suficiente para MVP |
| Historial de chatbot persistente | Prioridad baja para MVP |
| Asignacion a psicologos especificos | Requiere sistema de roles complejo |
| Multi-idioma | Suficiente en espanol para contexto local |
| API para app movil | MVP busca validar viabilidad, no expandir plataformas |

---

## 10. CONCLUSIONES

### 10.1 Resultados Alcanzados

1. Se implemento un sistema funcional con **11 paginas, 24 componentes, 21 endpoints API y 17 tablas de base de datos**
2. Se procesaron **3,465 encuestas sinteticas** con distribuciones realistas
3. Se generaron **2,000+ notificaciones** automaticas clasificadas por riesgo
4. Se implemento un chatbot clinico con **4 dimensiones de analisis**
5. El sistema puede procesar una encuesta completa en **menos de 2 segundos**

### 10.2 Limitaciones

- Los datos actuales son sinteticos; se requieren datos reales para validar
- La proteccion de endpoints admin es solo frontend
- No hay validacion Zod en backend
- El sistema de archivado es basico (sin jerarquia de carpetas)

### 10.3 Trabajo Futuro

1. **Validacion clinica:** Probar el sistema con pacientes reales en centros de salud aliados
2. **Modelo de Machine Learning:** Entrenar modelos predictivos con datos reales
3. **Pipeline de BI:** Integrar con herramientas de visualizacion avanzada
4. **Seguridad backend:** Implementar proteccion server-side en endpoints admin
5. **Exportacion avanzada:** Reportes personalizables y exportacion a Excel

---

## 11. REFERENCIAS

1. Organizacion Mundial de la Salud. (2023). *Suicide worldwide in 2019.* WHO.
2. Kroenke, K., Spitzer, R. L., & Williams, J. B. (2001). The PHQ-9. *Journal of General Internal Medicine.*
3. Posner, K., et al. (2011). The Columbia-Suicide Severity Rating Scale. *American Journal of Psychiatry.*
4. Beck, A. T., et al. (1974). Measuring depression: The Beck Hopelessness Scale. *Archives of General Psychiatry.*
5. Rosenberg, M. (1965). *Society and the Adolescent Self-Image.* Princeton University Press.
6. Lovibond, S. H., & Lovibond, P. F. (1995). *Manual for the Depression Anxiety Stress Scales.* Psychology Foundation.
