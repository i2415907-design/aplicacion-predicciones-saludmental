import { getAIConfig, AIConfig } from './config'
import { VertexAuth } from './vertex-auth'

export interface ToolDeclaration {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'model' | 'system' | 'tool'
  content: string
  tool_calls_raw?: Array<{
    name: string
    args: Record<string, unknown>
  }>
  function_name?: string
}

export interface ProviderResponse {
  texto?: string
  function_call?: {
    name: string
    args: Record<string, unknown>
  }
  tool_calls_raw?: Array<{
    name: string
    args: Record<string, unknown>
  }>
  error?: string
}

export class VertexProvider {
  private config: AIConfig

  constructor(customConfig?: AIConfig) {
    this.config = customConfig || getAIConfig()
  }

  /**
   * Ejecuta una llamada de inferencia a Vertex AI / Google Gemini
   */
  public async chat(
    messages: ChatMessage[],
    systemPrompt: string,
    tools: ToolDeclaration[] = []
  ): Promise<ProviderResponse> {
    const isVertex = this.config.provider === 'vertex'
    let accessToken: string | null = null

    if (isVertex && this.config.vertex.serviceAccountPath) {
      accessToken = await VertexAuth.obtenerAccessToken(this.config.vertex.serviceAccountPath)
    }

    // Determinar la URL correspondiente: Vertex AI (Google Cloud) o Gemini (AI Studio)
    let url: string
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const model = isVertex ? this.config.vertex.model : this.config.gemini.model
    const maxTokens = isVertex ? this.config.vertex.maxTokens : this.config.gemini.maxTokens
    const temperature = isVertex ? this.config.vertex.temperature : this.config.gemini.temperature

    if (accessToken && this.config.vertex.projectId) {
      // Endpoint de Google Cloud Vertex AI
      url = `https://aiplatform.googleapis.com/v1/projects/${this.config.vertex.projectId}/locations/${this.config.vertex.location}/publishers/google/models/${model}:generateContent`
      headers['Authorization'] = `Bearer ${accessToken}`
    } else if (this.config.gemini.apiKey) {
      // Endpoint directo de Google AI Studio
      url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.config.gemini.apiKey}`
    } else {
      console.warn('[VertexProvider] Ni Service Account de Vertex AI ni GEMINI_API_KEY configurados. Intentando fallback OpenAI/Groq.')
      return this.chatOpenAiFallback(messages, systemPrompt, tools)
    }

    const contents = this.formatearMensajes(messages)

    const requestBody: Record<string, unknown> = {
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    }

    if (tools && tools.length > 0) {
      requestBody.tools = [
        {
          functionDeclarations: tools,
        },
      ]
    }

    const maxRetries = 1
    for (let intento = 0; intento <= maxRetries; intento++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
        })

        if (response.ok) {
          const json = await response.json()
          return this.procesarRespuestaGemini(json)
        }

        const status = response.status
        const esRateLimit = status === 429 || status === 503

        if (esRateLimit && intento < maxRetries) {
          const retryAfter = Number(response.headers.get('Retry-After')) || 5
          console.warn(`[VertexProvider] Rate limit (${status}). Reintentando en ${retryAfter}s...`)
          await new Promise((r) => setTimeout(r, retryAfter * 1000))
          continue
        }

        const errorText = await response.text()
        console.error(`[VertexProvider] Error API (${status}):`, errorText)
        return {
          texto: 'Hubo un inconveniente al comunicarse con el servicio de IA de Vertex. Por favor, intenta nuevamente.',
          error: errorText,
        }
      } catch (err) {
        console.error('[VertexProvider] Excepción de conexión:', err)
        if (intento === maxRetries) {
          return {
            texto: 'Error de conexión con el servicio de IA de Vertex.',
            error: String(err),
          }
        }
      }
    }

    return { texto: 'No se obtuvo respuesta del proveedor de IA.' }
  }

  /**
   * Formatea los mensajes del historial al esquema de Google Generative AI
   */
  private formatearMensajes(messages: ChatMessage[]) {
    const contents: Array<{
      role: 'user' | 'model'
      parts: Array<Record<string, unknown>>
    }> = []

    for (const msg of messages) {
      if (msg.tool_calls_raw && msg.tool_calls_raw.length > 0) {
        // Respuesta previa del modelo emitiendo una o más funciones
        const parts = msg.tool_calls_raw.map((tc) => ({
          functionCall: {
            name: tc.name,
            args: tc.args || {},
          },
        }))
        contents.push({ role: 'model', parts })
      } else if (msg.role === 'tool') {
        // Respuesta de ejecución de una función
        let responseData: Record<string, unknown> = {}
        try {
          responseData = typeof msg.content === 'string' ? JSON.parse(msg.content) : msg.content
        } catch {
          responseData = { resultado: msg.content }
        }

        const funcName = msg.function_name || (responseData._function_name as string) || 'tool'
        delete responseData._function_name

        contents.push({
          role: 'user',
          parts: [
            {
              functionResponse: {
                name: funcName,
                response: responseData,
              },
            },
          ],
        })
      } else {
        // Mensaje normal de texto
        const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user'
        contents.push({
          role,
          parts: [{ text: msg.content }],
        })
      }
    }

    return contents
  }

  /**
   * Procesa la respuesta de Google Gemini / Vertex AI
   */
  private procesarRespuestaGemini(json: Record<string, unknown>): ProviderResponse {
    const candidates = json.candidates as Array<{
      content?: {
        parts?: Array<{
          text?: string
          functionCall?: {
            name: string
            args?: Record<string, unknown>
          }
        }>
      }
    }> | undefined

    const candidate = candidates?.[0]
    if (!candidate || !candidate.content) {
      return { texto: 'Sin respuesta generada.' }
    }

    const parts = candidate.content.parts || []
    let textoCompleto = ''
    let functionCall: ProviderResponse['function_call'] = undefined
    const toolCallsRaw: Array<{ name: string; args: Record<string, unknown> }> = []

    for (const part of parts) {
      if (part.text) {
        textoCompleto += part.text
      }
      if (part.functionCall) {
        const fc = {
          name: part.functionCall.name,
          args: part.functionCall.args || {},
        }
        if (!functionCall) {
          functionCall = fc
        }
        toolCallsRaw.push(fc)
      }
    }

    const result: ProviderResponse = {
      texto: textoCompleto.trim(),
    }

    if (functionCall) {
      result.function_call = functionCall
      result.tool_calls_raw = toolCallsRaw
    }

    return result
  }

  /**
   * Fallback a OpenAI / Groq si no hay credenciales de Vertex o Gemini
   */
  private async chatOpenAiFallback(
    messages: ChatMessage[],
    systemPrompt: string,
    _tools: ToolDeclaration[] = []
  ): Promise<ProviderResponse> {
    try {
      const apiKey = this.config.openai.apiKey
      if (!apiKey) {
        return { texto: 'No hay ninguna API Key ni credenciales de IA configuradas en .env.' }
      }

      const openaiMessages: Array<{ role: string; content: string }> = [
        { role: 'system', content: systemPrompt },
      ]
      for (const m of messages) {
        openaiMessages.push({
          role: m.role === 'model' ? 'assistant' : m.role,
          content: m.content,
        })
      }

      const body: Record<string, unknown> = {
        model: this.config.openai.model,
        messages: openaiMessages,
        max_tokens: this.config.openai.maxTokens,
        temperature: this.config.openai.temperature,
      }

      const response = await fetch(`${this.config.openai.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const err = await response.text()
        return { texto: 'Error en fallback de IA.', error: err }
      }

      const resJson = await response.json()
      const content = resJson.choices?.[0]?.message?.content || ''
      return { texto: content }
    } catch (e) {
      return { texto: 'Error al contactar proveedor de fallback.', error: String(e) }
    }
  }
}
