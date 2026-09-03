# ESTRUCTURA PARA LA EXPOSICIÓN DEL PMV
## Producto Mínimo Viable con componente de Inteligencia Artificial

| Proyecto | |
| :--- | :--- |
| **Integrantes** | |
| **Curso** | |
| **Fecha de exposición** | |

**Propósito:** demostrar que el equipo comprende el problema, ha construido un PMV funcional, justifica técnicamente el uso de IA y presenta evidencias de su funcionamiento mediante pruebas y métricas.

---

### 1. Finalidad de la exposición

La exposición no debe limitarse a describir el proyecto. El equipo debe demostrar la relación entre el problema identificado, la solución desarrollada, los datos utilizados, el componente de Inteligencia Artificial, la integración dentro del sistema y los resultados obtenidos.

**Secuencia lógica obligatoria:**

PROBLEMA → PROPUESTA → PMV → DATOS → IA → RESULTADOS → CONCLUSIÓN

**La exposición debe responder, como mínimo, a estas cuatro preguntas:**
* ¿Qué problema real se está resolviendo?
* ¿Qué parte del problema resuelve el PMV desarrollado?
* ¿Cómo interviene la Inteligencia Artificial dentro de la solución?
* ¿Qué evidencias demuestran que el PMV funciona y aporta valor?

---

### 2. Estructura de la exposición

| N.° | Parte | Qué debe presentar | Qué debe demostrar | Evidencia sugerida |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **Presentación del proyecto** | Nombre del proyecto, integrantes, organización o contexto de aplicación y una frase breve que describa qué hace el PMV. | El proyecto debe poder explicarse en una sola idea central. | Portada y nombre del PMV. |
| 2 | **Problema identificado** | Describir la situación actual, quién se ve afectado, qué dificultad existe y qué consecuencias produce. Evitar problemas demasiado generales. | Debe existir relación directa entre el problema y la solución propuesta. | Dato, evidencia, proceso actual, captura o ejemplo del problema. |
| 3 | **Objetivo del PMV** | Presentar el objetivo concreto del producto. Debe indicar qué se busca mejorar, automatizar, predecir, clasificar, recomendar, detectar o apoyar. | El objetivo debe ser coherente con el problema. | Objetivo general del PMV. |
| 4 | **Usuario y necesidad** | Identificar quién utilizará la solución y qué tarea, necesidad o decisión se busca mejorar. | No presentar un sistema sin usuario definido. | Perfil del usuario o actor principal. |
| 5 | **Propuesta de solución** | Explicar qué hace el PMV, cómo funciona de manera general y cuál es su funcionalidad mínima. | Diferenciar la solución completa imaginada del PMV realmente desarrollado. | Esquema funcional o captura principal. |
| 6 | **Alcance del PMV** | Precisar qué funcionalidades se implementaron, cuáles no se implementaron y qué queda para una versión posterior. | El PMV debe ser acotado y verificable. | Lista breve: Incluye / No incluye. |
| 7 | **Arquitectura o flujo del sistema** | Mostrar cómo circula la información desde el usuario o fuente de datos hasta el resultado. Identificar interfaz, backend, base de datos, modelo de IA, API u otros componentes utilizados. | Debe observarse dónde se encuentra realmente la IA. | Diagrama: Usuario → Entrada Sistema → IA Resultado → Acción. |
| 8 | **Datos utilizados** | Indicar origen, variables principales, cantidad de registros, variable objetivo cuando corresponda, limpieza o transformación y problemas de calidad detectados. | No utilizar datos sin explicar su procedencia y pertinencia. | Tabla de variables, ejemplo de registros o resumen del dataset. |
| 9 | **Formulación del problema de IA** | Definir técnicamente la tarea: clasificación, regresión, clustering, detección de anomalías, recomendación, procesamiento de lenguaje natural, IA generativa u otra. | Explicar por qué esa tarea corresponde al problema. | Entrada del modelo → tarea salida. |
| 10 | **Algoritmo o modelo utilizado** | Indicar el algoritmo/modelo seleccionado y justificar su elección. Explicar qué representan las variables de entrada X y la variable objetivo y, si aplica. | No basta con decir el nombre del algoritmo. | Nombre del modelo, entradas, salida y criterio de selección. |
| 11 | **Demostración funcional** | Ejecutar el PMV. Ingresar uno o dos casos de prueba y mostrar el proceso completo hasta obtener el resultado. | Esta es una de las partes con mayor peso de la exposición. | PMV ejecutándose en tiempo real. |
| 12 | **Resultados y valor generado** | Explicar qué mejora aporta el PMV frente al proceso anterior: tiempo, priorización, automatización, precisión, reducción de errores, disponibilidad de información o apoyo a decisiones. | Distinguir resultados medidos de expectativas futuras. | Indicadores antes/después o resultados cuantificables. |
| 13 | **Limitaciones y mejoras futuras** | Reconocer restricciones de datos, modelo, infraestructura, cobertura, precisión, seguridad, privacidad, integración u operación. | No presentar el prototipo como producto terminado si todavía existen limitaciones. | Limitación actual → mejora propuesta. |
| 14 | **Conclusión** | Responder si el PMV logró el objetivo y con qué evidencia. Indicar qué aprendió el equipo y cuál sería el siguiente paso técnico. | La conclusión debe basarse en las pruebas y resultados. | Tres ideas finales como máximo. |

---

### 3. Secuencia obligatoria para la demostración del PMV

La demostración debe evidenciar el recorrido completo de una entrada nueva hasta la respuesta que recibe el usuario. El equipo no debe limitarse a mostrar pantallas estáticas.

| Paso | Acción | Qué deben mostrar |
| :---: | :--- | :--- |
| 1 | **Ingresar un caso nuevo** | Ejemplo: pedido, cliente, estudiante, máquina, reserva, producto, documento u otra unidad de análisis. |
| 2 | **Capturar o recuperar los datos** | Mostrar qué variables necesita el sistema para procesar el caso. |
| 3 | **Validar y preparar la entrada** | Evidenciar validaciones, transformaciones o preparación necesaria antes del modelo. |
| 4 | **Ejecutar el componente de IA** | Explicar qué modelo recibe los datos y qué operación realiza. |
| 5 | **Obtener el resultado** | Predicción, clasificación, recomendación, agrupamiento, alerta, puntuación, texto generado u otra salida. |
| 6 | **Presentar el resultado al usuario** | Mostrar dónde aparece el resultado dentro del PMV. |
| 7 | **Relacionar el resultado con una acción** | Explicar qué decisión o acción puede realizar el usuario gracias a esa salida. |

**Regla:** si el equipo afirma que utiliza IA, debe poder explicar con claridad qué información recibe el componente de IA, qué procesa, qué devuelve y cómo ese resultado aporta al funcionamiento del PMV.

---

### 4. Aspectos técnicos que deben poder explicar

* **Problema:** Qué situación concreta se desea mejorar y por qué requiere una solución tecnológica.
* **Datos:** Qué datos se usan, de dónde provienen, qué variables contienen y qué problemas de calidad pueden presentar.
* **Tipo de IA:** Qué tarea se realiza: clasificación, regresión, clustering, recomendación, anomalías, NLP, IA generativa, etc.
* **Modelo/algoritmo:** Por qué se eligió y qué relación tiene con el tipo de problema.
* **Trazabilidad y límites:** Qué parte funciona realmente y qué parte todavía es prototipo, simulación o propuesta futura.

---

### 5. Requisitos de la presentación

* Todos los integrantes deben conocer el proyecto completo, aunque se distribuyan las partes de la exposición.
* Las diapositivas deben apoyar la explicación; no deben contener párrafos extensos para leer.
* La demostración debe ejecutarse con al menos uno o dos casos de prueba previamente preparados.
* El equipo debe diferenciar claramente entre funcionalidades implementadas y funcionalidades futuras.
* El equipo debe tener un plan alternativo de evidencias (capturas o video breve) únicamente para respaldar la explicación si existiera una falla técnica durante la demostración.

---

### 9. Criterio central de la sustentación

```
PROBLEMA CORRECTAMENTE FORMULADO
+
PMV FUNCIONAL
+
IA TÉCNICAMENTE JUSTIFICADA
```