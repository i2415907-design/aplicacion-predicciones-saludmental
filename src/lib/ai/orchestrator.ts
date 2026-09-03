import { VertexProvider, ChatMessage } from './vertex-provider'
import { CLINICAL_AND_BI_TOOLS } from './tools/definitions'
import { ToolHandlers } from './tools/handlers'

const SYSTEM_PROMPT_ADMIN = `Eres un Asistente Clínico y Analista de Inteligencia Artificial especializado en Salud Mental y Prevención del Riesgo Suicida, diseñado para brindar soporte a psicólogos, médicos y administradores del sistema.

TU MISIÓN:
1. Orientar a los profesionales en la evaluación del riesgo suicida y la depresión severa.
2. Proporcionar información precisa consultando la base de datos real mediante las herramientas (tools) disponibles.
3. Sugerir protocolos de intervención clínica fundamentados en evidencia (como el Plan de Seguridad de Stanley & Brown y guías de la OMS).
4. Resolver dudas epidemiológicas y estadísticas poblacionales de las encuestas registradas.

REGLAS CRÍTICAS DE SEGURIDAD Y ÉTICA:
- NUNCA inventes cifras, pacientes o estadísticas. Si requieres datos para responder la pregunta, INVOCA la herramienta adecuada (ej. 'consultarMetricasGeneralesBI' o 'obtenerDetalleCasoPaciente').
- REGLA DE CONTEXTO ACTIVO: Si el prompt incluye un "EXPEDIENTE DEL PACIENTE EN CONSULTA ACTIVA" o "CONTEXTO DE ALERTA", asume de inmediato que el usuario te está consultando sobre ese paciente en particular. NUNCA le pidas al usuario que te proporcione el ID o nombre del paciente si ya está presente en el contexto; responde directamente o utiliza ese ID con la herramienta 'obtenerDetalleCasoPaciente'.
- CONFIDENCIALIDAD Y SEGURIDAD ARQUITECTURAL (REGLA INQUEBRANTABLE):
  * JAMÁS menciones nombres técnicos de herramientas o funciones de código (está terminantemente PROHIBIDO decir nombres como 'obtenerProtocoloClinico', 'obtenerDetalleCasoPaciente', 'consultarMetricasGeneralesBI', 'consultarAlertasCriticas', 'analizarCrucesFactoresRiesgo' ni la palabra 'herramienta' o 'tool').
  * Usa SIEMPRE alias y términos clínicos naturales institucionales:
    - En lugar de 'obtenerProtocoloClinico', refiérete a 'el protocolo clínico de intervención' o 'la guía técnica de contención'.
    - En lugar de 'obtenerDetalleCasoPaciente', refiérete a 'el expediente clínico del paciente'.
    - En lugar de 'consultarMetricasGeneralesBI', refiérete a 'el censo epidemiológico y estadísticas poblacionales'.
    - En lugar de 'consultarAlertasCriticas', refiérete a 'el panel de alertas clínicas de emergencia'.
  * Si necesitas información de un protocolo para responderle al profesional, EJECUTA la herramienta directamente en esta ronda en lugar de preguntarle '¿deseas que consulte la herramienta?'.
  * JAMÁS menciones infraestructura técnica como "base de datos", "tabla", "consultas SQL", "PostgreSQL", "tools", "funciones", "servidor" ni digas frases como "según la información extraída de la base de datos".
  * Comunícate SIEMPRE con lenguaje clínico, institucional y formal:
    - "De acuerdo con el expediente clínico..."
    - "Conforme a los registros de evaluación psicométrica..."
    - "Según el historial del paciente en el sistema..."
    - "Los indicadores epidemiológicos poblacionales reflejan..."
  * Si no encuentras información de un paciente, di con sobriedad: "No se encontraron registros clínicos coincidentes con los criterios de búsqueda."
- Recuerda siempre que eres una herramienta de apoyo al triage y toma de decisiones; NO reemplazas el criterio clínico ni emites diagnósticos definitivos.
- En situaciones de riesgo inminente o crítico (C-SSRS severo o PHQ-9 ítem 9 >= 2), prioriza inmediatamente las medidas de contención, restricción de medios y las líneas de crisis (ej. Línea 113 opción 5 / Línea 988).
- Responde siempre en español profesional, empático, riguroso y con formato Markdown limpio (listas, negritas cuando ayuden a la claridad).`

export class AIOrchestrator {
  private provider: VertexProvider

  constructor(provider?: VertexProvider) {
    this.provider = provider || new VertexProvider()
  }

  /**
   * Procesa la consulta del usuario con soporte de Function Calling multi-turno
   */
  public async procesarConsulta(
    mensajeUsuario: string,
    historialPrevio: ChatMessage[] = [],
    contextoAdicional?: string
  ): Promise<{ respuesta: string; toolsEjecutadas: string[] }> {
    let systemPrompt = SYSTEM_PROMPT_ADMIN
    if (contextoAdicional) {
      systemPrompt += `\n\nCONTEXTO INMEDIATO DEL CASO SELECCIONADO:\n${contextoAdicional}`
    }

    const messages: ChatMessage[] = [...historialPrevio, { role: 'user', content: mensajeUsuario }]
    const tools = CLINICAL_AND_BI_TOOLS
    const toolsEjecutadas: string[] = []

    const maxRounds = 2
    let round = 0
    let respuestaFinal = ''

    while (round < maxRounds) {
      const resp = await this.provider.chat(messages, systemPrompt, tools)

      if (resp.error && !resp.texto) {
        return {
          respuesta: 'Hubo un error al comunicarse con el servicio de IA de Vertex. Verifica las credenciales configuradas.',
          toolsEjecutadas,
        }
      }

      // Si el modelo solicitó una llamada a función (tool call)
      if (resp.function_call && resp.function_call.name) {
        const toolName = resp.function_call.name
        const toolArgs = resp.function_call.args || {}

        toolsEjecutadas.push(toolName)
        console.log(`[AIOrchestrator] Ejecutando tool [Ronda ${round + 1}]: ${toolName}`, toolArgs)

        // Registrar la llamada del modelo en el historial de la conversación
        messages.push({
          role: 'model',
          content: resp.texto || '',
          tool_calls_raw: resp.tool_calls_raw || [resp.function_call],
        })

        // Ejecución segura en el backend
        const resultadoTool = await ToolHandlers.ejecutar(toolName, toolArgs)

        // Salvaguarda Anti-Alucinación: si la herramienta arrojó error de ejecución
        if (resultadoTool.error) {
          console.warn(`[AIOrchestrator] Error en tool ${toolName}:`, resultadoTool.error)
          return {
            respuesta: `No pude obtener los datos solicitados debido a una dificultad técnica al consultar la información (${resultadoTool.error}).`,
            toolsEjecutadas,
          }
        }

        // Devolver la respuesta de la tool al modelo como mensaje de rol 'tool'
        messages.push({
          role: 'tool',
          function_name: toolName,
          content: JSON.stringify(resultadoTool),
        })

        round++
      } else {
        // El modelo devolvió una respuesta textual directa
        respuestaFinal = resp.texto || 'No se obtuvo una respuesta del modelo.'
        break
      }
    }

    // Si terminó el bucle después de las rondas de tools, hacer la llamada final para que el modelo redacte
    if (!respuestaFinal && round > 0) {
      const respSintesis = await this.provider.chat(messages, systemPrompt, [])
      respuestaFinal = respSintesis.texto || 'Análisis completado en base a los datos recuperados.'
    }

    return {
      respuesta: respuestaFinal,
      toolsEjecutadas,
    }
  }
}
