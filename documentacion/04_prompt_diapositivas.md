# PROMPT PARA CREACION DE DIAPOSITIVAS
## Sistema de BI e IA para Prevencion de Depresion y Suicidio

**Instrucciones:** Usar este prompt para generar las diapositivas de la exposicion del proyecto. Cada seccion corresponde a una diapositiva.

---

## DIAPOSITIVA 1: PORTADA

**Palabras clave para la diapositiva:**
- Titulo: "Sistema de BI e Inteligencia Artificial para Prevencion de Depresion y Suicidio"
- Subtitulo: "Identificacion temprana de riesgo psicologico mediante IA"
- 6to Ciclo — Ingenieria de Sistemas — Julio 2026
- Logo de la universidad
- Imagen de fondo: personas en contexto de salud mental (tonos azul y morado)

---

## DIAPOSITIVA 2: EL PROBLEMA

**Palabras clave:**
- 720,000+ muertes por suicidio al ano (OMS)
- Causa #1 de discapacidad mundial: depresion
- 4ta causa de muerte en jovenes 15-29 anos
- 17% de aumento en America Latina (ultima decada)
- Brecha en deteccion: consultas de 10-15 minutos
- Sin herramientas estandarizadas de tamizaje
- Deteccion reactiva, no preventiva

**Diseno sugerido:** Iconos grandes con numeros impactantes. Colores rojo y naranja para urgencia.

---

## DIAPOSITIVA 3: NUESTRA PROPUESTA

**Palabras clave:**
- Sistema de IA para deteccion temprana
- Formulario clinico digital validado
- Motor de calculo de riesgo automatico
- Alertas en tiempo real para psicologos
- Chatbot clinico con recomendaciones
- Dashboard de inteligencia de negocios
- Prevencion sobre reaccion

**Diseno sugerido:** Diagrama de flujo simplificado: Paciente → Encuesta → IA → Alerta → Psicologo

---

## DIAPOSITIVA 4: HIPOTESIS

**Palabras clave:**
- Hipotesis de Valor: IA + formularios clinicos = deteccion temprana
- Hipotesis Tecnica: 84 items clinicos + 17 variables = patron de vulnerabilidad
- 5 escalas validadas internacionalmente
- PHQ-9, C-SSRS, BHS, Rosenberg, DASS-21
- 7 factores de riesgo ponderados
- Procesamiento en <2 segundos

**Diseno sugerido:** Dos columnas: Hipotesis de Valor (izq) y Hipotesis Tecnica (der)

---

## DIAPOSITIVA 5: EL EXPERIMENTO

**Palabras clave:**
- Flujo manual que valida el concepto
- Formulario digital de 10 pasos
- 3,465 encuestas sinteticas procesadas
- 2,000+ notificaciones automaticas
- 5 escalas clinicas implementadas
- Panel de administracion para psicologos
- Chatbot IA contextual

**Diseno sugerido:** Timeline o pasos numerados del 1 al 4

---

## DIAPOSITIVA 6: METRICA CORE

**Palabras clave:**
- Tasa de Adopcion de Protocolo
- Formula: (Protocolos activados / Total alertas) x 100
- Ejemplo: 70 alertas activadas de 100 = 70%
- Mide utilidad real, no precision tecnica
- Confianza del profesional en el sistema
- La pregunta clave: "Los profesionales usan lo que el sistema sugiere?"

**Diseno sugerido:** Formula grande en el centro, ejemplo visual con grafico de barras

---

## DIAPOSITIVA 7: CRITERIO DE EXITO

**Palabras clave:**
- Umbral: 70% de adopcion
- >= 70%: Validacion positiva → ML y BI
- 50-69%: Zona de mejora → Ajustar
- < 50%: Pivotar → Rediseñar
- Mayoria calificada de aceptacion
- Margen del 30% para resistencia al cambio

**Diseno sugerido:** Semaforo: Verde (70%+), Amarillo (50-69%), Rojo (<50%)

---

## DIAPOSITIVA 8: STACK TECNOLOGICO

**Palabras clave:**
- Frontend: Next.js 16 + React 19 + Tailwind CSS
- Backend: Next.js API Routes (21 endpoints)
- Base de datos: PostgreSQL 17 (Supabase) — 17 tablas
- ORM: Prisma 5.22
- IA: Groq API — Llama 3.3 70B
- Graficas: Recharts
- PDF: jsPDF
- 24 componentes React
- 11 paginas de interfaz

**Diseno sugerido:** Logos de tecnologias en cuadricula o circulos

---

## DIAPOSITIVA 9: ARQUITECTURA DEL SISTEMA

**Palabras clave:**
- Diagrama de arquitectura simplificada
- Capa de presentacion (React)
- Capa de API (Next.js)
- Capa de datos (PostgreSQL)
- Capa de IA (Groq/Llama)
- Flujo: Paciente → Encuesta → Calculo → Notificacion → Psicologo
- Base de datos: ~39,000 filas, ~239 columnas

**Diseno sugerido:** Diagrama de bloques con flechas mostrando el flujo de datos

---

## DIAPOSITIVA 10: FUNCIONALIDADES (1/2)

**Palabras clave:**
- Encuesta Clinica: 10 pasos, 84+ items, 5 escalas
- Sistema de Alertas: Clasificacion automatica por riesgo
- Panel Admin: Vista completa, filtros, gestion
- Chatbot IA: Recomendaciones clinicas personalizadas

**Diseno sugerido:** 4 tarjetas con iconos y descripcion corta

---

## DIAPOSITIVA 11: FUNCIONALIDADES (2/2)

**Palabras clave:**
- Dashboard BI: KPIs, graficas, tendencia temporal
- Descarga PDF: Reporte clinico completo
- Archivado: 5 categorias + personalizables
- Interstitial: Aviso de aplicacion de prueba
- Autenticacion: Login匿名/registrado, roles usuario/admin

**Diseno sugerido:** 4 tarjetas con iconos y descripcion corta

---

## DIAPOSITIVA 12: BASE DE DATOS

**Palabras clave:**
- 17 tablas en PostgreSQL
- 239 columnas totales
- 16 foreign keys
- ~39,000 filas de datos
- 5 escalas clinicas: PHQ-9 (13 cols), C-SSRS (11 cols), BHS (23 cols), Rosenberg (12 cols), DASS-21 (25 cols)
- Tabla central: encuestas (17 cols)
- RLS habilitado en tablas criticas

**Diseno sugerido:** Diagrama ER simplificado con las tablas principales conectadas

---

## DIAPOSITIVA 13: ALGORITMO DE RIESGO

**Palabras clave:**
- Riesgo global compuesto
- 7 factores ponderados
- Puntaje maximo: 23 puntos
- PHQ-9 (0-4 pts) + BHS (0-4 pts) + C-SSRS (0-5 pts) + Ideacion (0-3 pts) + Intento previo (3 pts) + Sustancias (2 pts) + Aislamiento (2 pts)
- Bajo (0-3), Moderado (4-7), Alto (8-11), Muy Alto (12+)

**Diseno sugerido:** Grafico de barras apiladas mostrando los 7 factores y sus puntos maximos

---

## DIAPOSITIVA 14: DEMO EN VIVO

**Palabras clave:**
- Demonstracion en vivo del sistema
- Encuesta → Resultados → Panel Admin → Chatbot → Dashboard
- Tiempo estimado: 5 minutos
- Punto focal: Flujo completo de uso

**Diseno sugerido:** Pantalla simple con texto "Demo en Vivo" y timer

---

## DIAPOSITIVA 15: RESULTADOS

**Palabras clave:**
- 3,465 encuestas procesadas
- 2,000+ notificaciones generadas
- 11 paginas funcionales
- 21 endpoints de API
- 24 componentes React
- Chatbot con 4 dimensiones de analisis
- PDF descargable funcional

**Diseno sugerido:** Numeros grandes con iconos representativos

---

## DIAPOSITIVA 16: LIMITACIONES Y PROXIMO PASO

**Palabras clave:**
- Limitaciones: Datos sinteticos, no reales
- Proteccion admin solo en frontend
- Sin validacion Zod en backend
- Proximo paso: Validar con centros de salud aliados
- Medir Tasa de Adopcion de Protocolo
- Si >= 70%, proceder a ML y BI

**Diseno sugerido:** Dos columnas: Limitaciones (izq) y Proximo Paso (der)

---

## DIAPOSITIVA 17: CIERRE

**Palabras clave:**
- "Salvar vidas mediante la deteccion temprana"
- Gracias por su atencion
- Preguntas?
- Contacto: [emails/equipo]
- Recursos: Linea 988 (Prevencion del Suicidio)

**Diseno sugerido:** Fondo oscuro con texto blanco, numero de crisis visible

---

## PALETA DE COLORES SUGERIDA

| Color | Uso | Hex |
|-------|-----|-----|
| Azul principal | Titulos, botones primarios | #3B82F6 |
| Morado | Admin, chatbot, elementos IA | #7C3AED |
| Verde | Riesgo bajo, exito | #10B981 |
| Amarillo | Riesgo moderado, advertencia | #F59E0B |
| Naranja | Riesgo alto | #EA580C |
| Rojo | Riesgo muy alto, urgencia | #DC2626 |
| Gris oscuro | Texto principal | #1F2937 |
| Gris claro | Fondos, bordes | #F3F4F6 |

## FUENTES SUGERIDAS

- **Titulos:** Inter Bold o Poppins Bold
- **Cuerpo:** Inter Regular o Poppins Regular
- **Numeros grandes:** Inter Black o Montserrat Bold
- **Codigo:** Fira Code o JetBrains Mono
