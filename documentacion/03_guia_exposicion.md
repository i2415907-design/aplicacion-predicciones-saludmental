# GUIA DE EXPOSICION
## Sistema de BI e Inteligencia Artificial para Prevencion de Depresion y Suicidio

**Guia de estudio para presentacion del proyecto**

---

## ESTRUCTURA DE LA EXPOSICION

**Duracion sugerida:** 15-20 minutos  
**Orden recomendado:** Seguir los temas en secuencia

---

## TEMA 1: PRESENTACION Y CONTEXTO (2 minutos)

### Frase clave de apertura:
> "El suicidio es la cuarta causa de muerte en jovenes de 15 a 29 anos. Mas de 720,000 personas mueren cada ano por esta causa. Nuestro proyecto busca cambiar eso."

### Puntos a cubrir:
- **Quienes somos:** Estudiantes de 6to ciclo de Ingenieria de Sistemas
- **El problema:** La depresion y el suicidio son una crisis de salud publica global
- **La brecha:** Los centros de salud carecen de herramientas de deteccion temprana
- **Nuestra propuesta:** Un sistema de IA que identifica personas en riesgo antes de la crisis

### Datos para recordar:
- 720,000+ muertes por suicidio al ano (OMS)
- 1 de cada 100 personas mayores de 60 anos muere por suicidio
- La depresion es la causa #1 de discapacidad mundial
- Los jovenes de 15-29 anos son el grupo mas vulnerable

---

## TEMA 2: LA HIPOTESIS (2 minutos)

### Frase clave:
> "Creemos que los formularios clinicos contienen suficiente informacion para detectar un patron de vulnerabilidad antes de que ocurra la crisis."

### Puntos a cubrir:

**Hipotesis de Valor:**
- Identificar personas con riesgo usando IA + formularios clinicos
- Los formularios son validados internacionalmente (PHQ-9, C-SSRS, BHS)
- La combinacion de escalas captura multiples dimensiones de la salud mental

**Hipotesis Tecnica:**
- 84 items de evaluacion psicometrica por encuesta
- 17 variables contextuales (edad, sexo, zona, economia, relaciones)
- 7 factores de riesgo ponderados en un algoritmo compuesto
- El sistema procesa 100+ variables en menos de 2 segundos

### Pregunta para el publico:
> "Creen ustedes que con 84 preguntas clinicas se puede detectar si alguien esta en riesgo de suicidio?"

---

## TEMA 3: EL EXPERIMENTO (3 minutos)

### Frase clave:
> "No construimos la solucion final. Disenamos un experimento para validar si el concepto funciona."

### Puntos a cubrir:

**Que hicimos:**
1. Disenamos un formulario digital de 10 pasos con escalas validadas
2. Generamos 3,465 encuestas sinteticas con distribuciones realistas
3. Implementamos un motor de IA que genera recomendaciones clinicas
4. Creamos un panel para que psicologos reciban y gestionen alertas

**Como funciona el flujo:**
1. Paciente o personal de salud completa la encuesta
2. El sistema calcula puntajes automaticamente
3. Se genera un nivel de riesgo compuesto (bajo/moderado/alto/muy alto)
4. Se envia una notificacion al psicologo de turno
5. El psicologo analiza y responde con una accion

**Datos del experimento:**
- 3,465 encuestas procesadas
- 2,000+ notificaciones generadas
- 5 escalas clinicas implementadas
- 17 tablas de base de datos
- 11 paginas de interfaz

---

## TEMA 4: LA METRICA CORE (2 minutos)

### Frase clave:
> "La pregunta no es si el sistema funciona tecnicamente. La pregunta es si los profesionales confian lo suficiente para usarlo."

### La metrica:
**Tasa de Adopcion de Protocolo**

**Formula:**
```
Tasa de Adopcion = (Veces que se activo el protocolo sugerido) / (Total de alertas enviadas) x 100
```

**Ejemplo concreto:**
- El sistema envia 100 alertas
- El personal de salud activa el protocolo en 70
- Tasa de adopcion = 70%

### Por que esta metrica?
- Mide la **utilidad real**, no solo la precision tecnica
- Si no confian en el sistema, es tecnicamente correcto pero clinicamente inutil
- Es la metrica que decide si se continua o se pivotea

---

## TEMA 5: EL CRITERIO DE EXITO (1 minuto)

### Frase clave:
> "El umbral es 70%. Si lo alcanzamos, sabemos que el sistema tiene valor real."

### El criterio:
| Tasa de Adopcion | Decision |
|------------------|----------|
| **>= 70%** | Validacion positiva → Proceder a ML y BI |
| **50-69%** | Zona de mejora → Ajustar interfaz |
| **< 50%** | Pivotar → Rediseñar el enfoque |

### Por que 70%?
- Es una mayoria calificada
- Indica que la mayoria confia en el sistema
- Permite un margen del 30% para resistencia al cambio
- Es realista para una primera implementacion

---

## TEMA 6: DEMOSTRACION DEL SISTEMA (5 minutos)

### Orden de demostracion recomendado:

**Paso 1: Interstitial (10 segundos)**
- Abrir el navegador, mostrar el popup de aviso
- Explicar: "Este es un aviso que aparece la primera vez, indica que es una aplicacion de prueba"

**Paso 2: Login (30 segundos)**
- Mostrar pagina de login
- Explicar: "El usuario puede registrarse o usar credenciales de prueba"
- Login con admin/admin123

**Paso 3: Encuesta (2 minutos)**
- Ir a `/encuesta`
- Mostrar el wizard de 10 pasos
- Completar rapidamente unos pasos de ejemplo
- Explicar las escalas: "PHQ-9 mide depresion, C-SSRS mide ideacion suicida, BHS mide desesperanza"
- Enviar la encuesta

**Paso 4: Resultados (1 minuto)**
- Mostrar la pagina de resultados
- Explicar: "Aqui vemos los puntajes de cada escala y el nivel de riesgo global"
- Mostrar el boton de descarga PDF
- Si es admin, mostrar el widget de archivado

**Paso 5: Panel Admin (1 minuto)**
- Ir a `/admin`
- Mostrar dashboard con KPIs
- Ir a `/admin/encuestas`, mostrar tabla con filtros
- Ir a `/admin/notificaciones`, mostrar sistema de alertas
- Ir a `/admin/chatbot`, mostrar chatbot clinico

**Paso 6: Dashboard BI (30 segundos)**
- Ir a `/dashboard`
- Mostrar graficas: distribucion por edad, sexo, ideacion suicida
- Explicar: "Este panel permite tomar decisiones basadas en datos"

---

## TEMA 7: ARQUITECTURA TECNICA (2 minutos)

### Frase clave:
> "El sistema usa las mejores tecnologias disponibles: Next.js para el frontend, PostgreSQL para los datos, e IA de ultima generacion para las recomendaciones."

### Stack tecnologico:
| Capa | Tecnologia |
|------|-----------|
| Frontend | Next.js 16 + React 19 + Tailwind CSS |
| Backend | Next.js API Routes |
| Base de datos | PostgreSQL 17 (Supabase) |
| ORM | Prisma 5.22 |
| IA | Groq API (Llama 3.3 70B) |
| Graficas | Recharts |
| PDF | jsPDF |

### Numeros clave:
- **17 tablas** de base de datos
- **21 endpoints** de API
- **24 componentes** React
- **11 paginas** de interfaz
- **5 escalas clinicas** implementadas
- **~39,000 filas** de datos en la base de datos
- **~239 columnas** en total

### Diagrama simplificado:
```
Paciente → Encuesta → Servidor → Calculo de Riesgo → Notificacion → Psicologo
                                              ↓
                                         Base de Datos
                                              ↓
                                         Chatbot IA → Recomendacion
```

---

## TEMA 8: FUNCIONALIDADES PRINCIPALES (2 minutos)

### Las 7 funcionalidades del sistema:

1. **Encuesta Clinica Multidimensional**
   - 10 pasos, 84+ items, 5 escalas validadas
   - Anonima o con sesion
   - Calculo automatico de riesgo

2. **Sistema de Alertas Automaticas**
   - Clasificacion por nivel: bajo/moderado/alto/muy alto
   - Notificacion con accion recomendada
   - Respuesta del psicologo

3. **Panel de Administracion**
   - Vista completa de encuestas
   - Filtros por riesgo y categoria
   - Gestion de notificaciones

4. **Chatbot IA Clinico**
   - Recibe contexto del paciente
   - Genera recomendaciones personalizadas
   - 4 dimensiones de analisis

5. **Dashboard BI**
   - KPIs en tiempo real
   - Graficas de distribucion
   - Tendencia temporal

6. **Descarga PDF**
   - Reporte clinico completo
   - Disponible para usuario y admin

7. **Archivado de Casos**
   - 5 categorias predefinidas
   - Categorias personalizables
   - Notas del admin

---

## TEMA 9: RESULTADOS Y CONCLUSIONES (1 minuto)

### Frase clave:
> "Construimos un sistema completo que puede procesar 3,465 encuestas y generar alertas automaticas. Ahora necesitamos validarlo con datos reales."

### Resultados:
- Sistema funcional con 11 paginas y 21 endpoints
- 3,465 encuestas procesadas con exito
- 2,000+ notificaciones generadas
- Chatbot clinico funcional con 4 dimensiones
- Descarga de PDF funcionando

### Limitaciones honestas:
- Datos sinteticos, no reales todavia
- Proteccion admin solo en frontend
- Sin validacion Zod en backend

### Proximo paso:
- **Validar con centros de salud aliados**
- Medir la Tasa de Adopcion de Protocolo
- Si >= 70%, proceder a ML y BI

---

## PREGUNTAS FRECUENTES Y RESPUESTAS

### P: "Por que no usaron una IA predictiva directamente?"
**R:** "Queremos validar primero si los profesionales confian en el sistema. Si la adopcion es baja, no importa que la IA sea precisa. Primero validamos la utilidad, luego la precision."

### P: "Los datos son reales o sinteticos?"
**R:** "Actualmente son sinteticos con distribuciones realistas. El proximo paso es probar con pacientes reales en centros de salud aliados."

### P: "Como protegen los datos de los pacientes?"
**R:** "Usamos cookies httpOnly para sesiones, la base de datos esta en Supabase con Row Level Security, y los usuarios pueden ser anonimos. En produccion, se agregaria encriptacion y cumplimiento HIPAA."

### P: "Que pasa si el sistema falla?"
**R:** "El sistema es una herramienta de apoyo, no reemplaza al clinico. Siempre hay un profesional de salud mental tomando la decision final. El sistema solo alerta y sugiere."

### P: "Cual es el costo de operacion?"
**R:** "Supabase tiene tier gratuito para desarrollo. Groq API tiene tier gratuito con limite de requests. Para produccion, los costos serian bajos porque solo procesamos texto, no imagenes o video."

---

## CONSEJOS PARA LA EXPOSICION

1. **Empieza con el problema:** No empieces hablando de tecnologia. Empieza hablando de las 720,000 muertes.
2. **Usa analogias:** "Es como un semaforo que cambia de verde a rojo cuando alguien esta en peligro."
3. **Muestra, no cuentes:** La demostracion en vivo es mas efectiva que describir funcionalidades.
4. **Se honesto sobre limitaciones:** Los profesionales valoran la honestidad sobre la perfeccion.
5. **Termina con el proximo paso:** Siempre di cual es el siguiente paso concreto.
6. **Controla el tiempo:** Practica con cronometro. Es mejor dejar algo sin decir que quedarse sin tiempo.
7. **Preparate para preguntas tecnicas:** Sabe explicar el algoritmo de riesgo global y las escalas clinicas.
8. **Ten datos claros:** 3,465 encuestas, 2,000+ notificaciones, 17 tablas, 21 endpoints. Los numeros印象ionan.
