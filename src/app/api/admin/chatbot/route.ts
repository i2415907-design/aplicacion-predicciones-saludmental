import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const groq = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
})

const ADMIN_CHATBOT_PROMPT = `Eres un asistente de IA especializado en psicología clínica y prevención del suicidio. Tu rol es ayudar a psicólogos y profesionales de salud mental a:

1. Evaluar el riesgo de pacientes basándose en sus respuestas
2. Sugerir intervenciones apropiadas según el nivel de riesgo
3. Proporcionar protocolos de actuación
4. Responder preguntas sobre escalas clínicas (PHQ-9, C-SSRS, BHS, DASS-21)
5. Ayudar a redactar respuestas a notificaciones de alerta

IMPORTANTE:
- Siempre mantén un tono profesional y empático
- Recuerda que eres un apoyo, no reemplazas el juicio clínico
- En situaciones de riesgo inminente, siempre recomienda contactar servicios de emergencia
- Usa terminología clínica apropiada pero comprensible
- Basa tus respuestas en evidencia científica

Formato de respuesta:
- Sé conciso pero completo
- Usa listas cuando sea apropiado
- Incluye referencias a protocolos cuando sea relevante
- Si hay contexto de un paciente específico, úsalo para personalizar tu respuesta`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context } = body

    if (!message) {
      return NextResponse.json(
        { error: 'El mensaje es requerido' },
        { status: 400 }
      )
    }

    let systemPrompt = ADMIN_CHATBOT_PROMPT

    // Add context if available
    if (context?.notificacion) {
      const notif = context.notificacion
      systemPrompt += `\n\nCONTEXTO DE LA NOTIFICACIÓN ACTUAL:
- Tipo de riesgo: ${notif.tipoRiesgo}
- Título: ${notif.titulo}
- Descripción: ${notif.descripcion}
- Acción requerida: ${notif.accionRequerida || 'No especificada'}
- Paciente: ${notif.paciente.nombre || 'Anónimo'} ${notif.paciente.apellido || ''}
- Edad: ${notif.paciente.edad} años
- Sexo: ${notif.paciente.sexo}

Basándote en esta información, proporciona una respuesta específica y accionable.`
    }

    const { text } = await generateText({
      model: groq(process.env.OPENAI_MODEL || 'llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: message,
      maxTokens: 1024,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error('Error in admin chatbot:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
