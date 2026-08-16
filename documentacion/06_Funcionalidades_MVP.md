# TAREA: Funcionalidades del Sistema de Salud Mental IA

---

## 1. FUNCIONALIDADES PRINCIPALES (Máximo 5)

### Funcionalidad 1: Encuesta Clínica Multidimensional
El sistema ofrece una encuesta wizard de 10 pasos que evalúa múltiples dimensiones de la salud mental del usuario: depresión (PHQ-9), ideación suicida (C-SSRS), desesperanza (BHS), autoestima (Rosenberg), regulación emocional (DASS-21), factores socioeconómicos, relaciones interpersonales, salud física y eventos vitales adversos. El usuario puede completarla de forma anónima (solo alias) o con sesión iniciada. El sistema calcula automáticamente puntajes por escala, genera un nivel de riesgo compuesto (bajo/moderado/alto/muy alto) y crea una notificación para el equipo clínico.

### Funcionalidad 2: Sistema de Alertas y Notificaciones Clínicas
Al enviar una encuesta, el sistema genera automáticamente una notificación clasificada por nivel de gravedad. Cada notificación incluye: nombre del paciente, nivel de riesgo, descripción del caso, puntajes de las escalas y la acción clínica recomendada. El psicólogo/admin puede marcar como leída, responder y gestionar cada alerta.

### Funcionalidad 3: Panel de Administración con Historial Clínico
Panel protegido que permite al admin/psicólogo: visualizar todas las encuestas recibidas con búsqueda y filtros por nivel de riesgo, acceder al detalle completo de cada encuesta con todos los resultados de las escalas clínicas, y gestionar notificaciones con respuesta y seguimiento.

### Funcionalidad 4: Chatbot IA Contextual para Psicólogos
Asistente de inteligencia artificial que recibe el contexto completo de cada caso (nivel de riesgo, puntajes, factores de riesgo) y genera recomendaciones clínicas personalizadas: protocolo de intervención, preguntas de seguimiento, planes de tratamiento y recursos de apoyo. El admin selecciona una notificación como contexto y el chatbot responde con base en los datos reales del paciente.

### Funcionalidad 5: Dashboard de Inteligencia de Negocios
Panel visual con indicadores clave de rendimiento (KPIs): total de encuestas, distribución por nivel de riesgo, promedio de PHQ-9, tendencia temporal, distribución por sexo y edad, y análisis de ideación suicida. Permite al equipo directivo tomar decisiones basadas en datos.

---

## 2. FUNCIONALIDADES QUE NO SE VAN A DESARROLLAR (Enfoque MVP)

| Funcionalidad | Justificación de exclusión |
|---|---|
| **Notificaciones por email/SMS** | Requiere integración con servicios externos (SendGrid, Twilio). Las notificaciones in-app son suficientes para el MVP. |
| **Recuperación de contraseña** | Funcionalidad auxilia no esencial para el propósito clínico del sistema. |
| **Exportación de datos (PDF/Excel)** | *Se desarrollará en la fase actual.* Originalmente excluida, se agregó al MVP. |
| **Edición/eliminación de encuestas** | Las encuestas deben ser inmutables por integridad clínica. |
| **Chat en tiempo real (WebSockets)** | El chat actual con polling es funcional. El tiempo real es un enhancement. |
| **Historial de chat persistente** | Las tablas existen pero no se usan activamente. Prioridad baja para MVP. |
| **Asignación de notificaciones a psicólogos específicos** | Requiere sistema de roles más complejo. En el MVP cualquier admin gestiona todas. |
| **Validación Zod en backend** | Las escalas se validan en el frontend. Agregar validación server-side es mejora de seguridad. |
| **Multi-idioma (i18n)** | El sistema está en español, suficiente para el contexto académico/local. |
| **App móvil nativa** | El sistema es responsive web, no requiere app nativa en MVP. |

---

## 3. DIAGRAMA DE FLUJO NARRATIVO POR ROLES

### ROL 1: USUARIO REGULAR (Cliente)

#### Flujo: Inicio de Sesión
1. El usuario accede al sistema desde el navegador.
2. En la barra de navegación, hace clic en "Iniciar Sesión".
3. El sistema muestra la página de login con opciones: iniciar sesión o registrarse.
4. **Si es usuario nuevo**: ingresa un alias (nombre público), contraseña y confirma contraseña. El sistema crea la cuenta y lo autentica automáticamente.
5. **Si es usuario existente**: ingresa alias y contraseña. El sistema valida las credenciales contra la base de datos.
6. Si las credenciales son correctas, el usuario es redirigido a la página principal con sesión activa.
7. Si son incorrectas, se muestra un mensaje de error.

#### Flujo: Realizar Encuesta (con sesión)
1. El usuario hace clic en "Encuesta" en la barra de navegación.
2. El sistema muestra el formulario wizard de 10 pasos:
   - **Paso 1**: Datos demográficos básicos (edad, sexo, estado civil, nivel educativo, ocupación).
   - **Paso 2**: PHQ-9 - Cuestionario de depresión (9 preguntas, escala 0-3).
   - **Paso 3**: C-SSRS - Escala de ideación suicida (7 preguntas yes/no).
   - **Paso 4**: BHS - Escala de desesperanza (20 afirmaciones Sí/No).
   - **Paso 5**: Rosenberg - Escala de autoestima (10 preguntas, escala 1-4).
   - **Paso 6**: DASS-21 - Depresión, ansiedad y estrés (21 preguntas, escala 0-3).
   - **Paso 7**: Factores socioeconómicos (laboral, deudas, vivienda).
   - **Paso 8**: Relaciones interpersonales y apoyo social.
   - **Paso 9**: Salud física, sueño y consumo de sustancias.
   - **Paso 10**: Eventos vitales adversos y factores psicológicos.
3. El usuario puede navegar entre pasos con botones "Anterior" y "Siguiente".
4. Al completar el paso 10, hace clic en "Enviar Encuesta".
5. El sistema:
   a. Valida que todos los campos obligatorios estén completos.
   b. Calcula automáticamente los puntajes de cada escala clínica.
   c. Calcula el nivel de riesgo global compuesto.
   d. Guarda la encuesta en la base de datos vinculada al usuario (usuario_id).
   e. Genera una notificación automática para el equipo clínico.
6. El sistema muestra la página de resultados con:
   - Puntaje e interpretación de cada escala.
   - Nivel de riesgo global con semáforo de color.
   - Alerta de riesgo si aplica (con número de línea de crisis 988).
   - Botón "Descargar PDF" con el reporte completo.
   - Botón "Nueva Encuesta" para realizar otra evaluación.

#### Flujo: Realizar Encuesta (sin sesión / anónimo)
1. El usuario accede directamente a "/encuesta" sin iniciar sesión.
2. Completa el mismo wizard de 10 pasos.
3. Al enviar, la encuesta se guarda SIN vinculación a usuario (usuario_id = NULL).
4. Los campos opcionales (nombre, apellido) quedan vacíos o parcialmente llenos.
5. Se genera la notificación para el admin igual que con sesión.
6. **Diferencia clave**: el usuario NO podrá ver esta encuesta en un historial posterior porque no tiene cuenta.

#### Flujo: Ver Historial de Encuestas (solo con sesión)
1. El usuario hace clic en "Mis Encuestas" en la barra de navegación.
2. El sistema muestra una lista de todas las encuestas que ha completado, ordenadas por fecha descendente.
3. Cada entrada muestra: ID, fecha, nivel de riesgo, y puntaje PHQ-9.
4. El usuario puede hacer clic en "Ver Resultados" para ver el detalle completo de cualquier encuesta anterior.
5. Cada encuesta tiene un botón "Descargar PDF" para guardar el reporte.

#### Flujo: Descargar Resultados en PDF
1. Desde la página de resultados o desde el historial, el usuario hace clic en "Descargar PDF".
2. El sistema genera un documento PDF con:
   - Encabezado con datos del paciente (nombre/alias, edad, sexo, fecha).
   - Resumen de cada escala clínica con puntaje e interpretación.
   - Nivel de riesgo global.
   - Recomendaciones generales.
   - Nota de descargo legal (no constituye diagnóstico).
3. El PDF se descarga automáticamente en el dispositivo del usuario.

---

### ROL 2: ADMINISTRADOR / PSICÓLOGO

#### Flujo: Acceso al Panel de Administración
1. El usuario con tipo "admin" inicia sesión (credenciales: admin/admin123).
2. En la barra de navegación aparece el enlace "Panel Admin" con icono de escudo.
3. Al hacer clic, accede al layout protegido del admin con sidebar de navegación.
4. El sidebar muestra: Dashboard, Encuestas, Notificaciones, Chatbot.

#### Flujo: Dashboard (Panel Principal)
1. Al acceder al panel, el admin ve el dashboard con:
   - Tarjetas KPI: total encuestas, total notificaciones, total fallecidos.
   - Gráfica de distribución por nivel de riesgo (barras o pie chart).
   - Gráfica de tendencia temporal de encuestas.
   - Últimas notificaciones recibidas.
2. El dashboard se actualiza automáticamente al cargar.

#### Flujo: Gestionar Notificaciones
1. El admin accede a "Notificaciones" desde el sidebar.
2. Ve una lista de todas las notificaciones ordenadas por fecha.
3. Puede filtrar por nivel de riesgo y buscar por nombre.
4. Al hacer clic en una notificación:
   - Se muestra el panel lateral con detalle completo: título, descripción, acción requerida.
   - El admin puede marcar como leída.
   - El admin puede escribir una respuesta/acción tomada.
   - Hay un botón "Abrir Chat con Contexto" que lleva al chatbot pre-cargado con los datos de ese caso.

#### Flujo: Chatbot IA Contextual
1. El admin accede a "Chatbot" desde el sidebar.
2. Ve una lista de notificaciones recientes a la derecha como "contexto rápido".
3. Selecciona una notificación o escribe directamente.
4. Al seleccionar una notificación, el chatbot recibe automáticamente:
   - Nivel de riesgo del paciente.
   - Puntajes de todas las escalas.
   - Factores de riesgo identificados.
5. El admin escribe preguntas como: "¿Cuál es el protocolo para este caso?" o "Genera un plan de seguimiento".
6. La IA responde con recomendaciones clínicas basadas en los datos reales del paciente.
7. El admin puede cambiar de contexto seleccionando otra notificación.

#### Flujo: Ver y Buscar Encuestas
1. El admin accede a "Encuestas" desde el sidebar.
2. Ve una tabla paginada con todas las encuestas del sistema.
3. Puede buscar por nombre, alias de usuario, o filtrar por nivel de riesgo.
4. Cada fila muestra: ID, nombre, edad, sexo, usuario, PHQ-9, nivel de depresión, nivel de riesgo, fecha.
5. Al hacer clic en "Ver", accede a la página de resultados detallados de esa encuesta.
6. Desde los resultados, el admin puede descargar el PDF del caso.

#### Flujo: Archivar y Categorizar Casos
1. Desde la vista detallada de una encuesta, el admin ve la sección "Archivar Caso".
2. El sistema muestra las categorías disponibles predefinidas:
   - **Caso Especial**: para casos que requieren atención prioritaria.
   - **Seguimiento**: para casos en proceso de monitoreo.
   - **Estabilizado**: para pacientes que han mejorado.
   - **Derivado**: para pacientes transferidos a servicios externos.
   - **Cerrado**: para casos finalizados.
3. El admin selecciona una o varias categorías y opcionalmente escribe una nota.
4. El caso queda archivado y es visible con su etiqueta de categoría en la lista de encuestas.
5. El admin puede crear categorías personalizadas desde el panel.
6. Puede mover un caso de una categoría a otra en cualquier momento.
7. La lista de encuestas permite filtrar por categoría de archivado.

---

## 4. FLUJO GENERAL DEL SISTEMA (Diagrama Resumen)

```
[USUARIO ACCede AL SISTEMA]
        │
        ├─── ¿Tiene cuenta? ──NO──→ [Realizar Encuesta Anónima]
        │                                  │
        │                                  ├─── Completar 10 pasos
        │                                  │
        │                                  ├─── Enviar → [Guardar sin usuario_id]
        │                                  │
        │                                  ├─── [Generar Notificación Admin]
        │                                  │
        │                                  └─── [Mostrar Resultados + PDF]
        │
        SÍ
        │
        ▼
[Iniciar Sesión → Redirigir a Inicio]
        │
        ├─── [Realizar Encuesta Con Sesión]
        │         │
        │         ├─── Completar 10 pasos
        │         │
        │         ├─── Enviar → [Guardar con usuario_id]
        │         │
        │         ├─── [Generar Notificación Admin]
        │         │
        │         ├─── [Mostrar Resultados + PDF]
        │         │
        │         └─── [Guardar en Historial del Usuario]
        │
        ├─── [Ver Historial de Encuestas]
        │         │
        │         ├─── Lista de encuestas anteriores
        │         │
        │         └─── Ver detalle / Descargar PDF
        │
        ▼
[ADMIN accede AL PANEL]
        │
        ├─── [Dashboard: KPIs y Gráficas]
        │
        ├─── [Gestionar Notificaciones]
        │         │
        │         ├─── Ver detalle → Responder
        │         │
        │         └─── Abrir en Chatbot con contexto
        │
        ├─── [Buscar/Ver Encuestas]
        │         │
        │         ├─── Filtros por riesgo, nombre, categoría
        │         │
        │         ├─── Ver detalle completo
        │         │
        │         ├─── Descargar PDF
        │         │
        │         └─── Archivar en categoría
        │
        └─── [Chatbot IA Contextual]
                  │
                  ├─── Seleccionar caso/notificación
                  │
                  └─── Recibir recomendaciones clínicas IA
```

---

## 5. TECNOLOGÍAS UTILIZADAS

| Componente | Tecnología |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend/API | Next.js API Routes |
| Base de datos | PostgreSQL 17 (Supabase) |
| ORM | Prisma 5.22 |
| IA Generativa | Groq API (Llama 3.3 70B Versatile) |
| Autenticación | Cookies HttpOnly + SHA-256 |
| Gráficas | Recharts |
| Iconos | Lucide React |
| Generación PDF | html2canvas + jsPDF (cliente) |
