import { openai } from '@/lib/openai'
import { streamText, generateText } from 'ai'
import { prisma } from '@/lib/prisma'

const AI_MODEL = process.env.OPENAI_MODEL || 'llama-3.3-70b-versatile'

export class AIService {
  /**
   * Genera un informe clínico 4D en streaming para el médico de turno
   * (Descriptivo, Diagnóstico, Predictivo, Prescriptivo)
   */
  static async generarAnalisis4DStreaming(datosPaciente: {
    edad: number
    sexo: string
    ocupacion?: string | null
    nivelEducativo?: string | null
    phq9Total?: number
    phq9Gravedad?: string
    phq9Ideacion?: number
    cssrsSeveridad?: string
    cssrsIntentoPrevio?: boolean
    bhsTotal?: number
    bhsRiesgo?: string
    dass21Estres?: number
    dass21Ansiedad?: number
    dass21Depresion?: number
    autoestima?: string
    consumoSustancias?: boolean
    apoyoSocial?: boolean
    perdidaReciente?: boolean
    violenciaReciente?: boolean
    textoLibre?: string
  }) {
    const prompt = `
Eres un Copiloto Clínico Especialista en Salud Mental y Prevención del Suicidio.
Analiza la siguiente evaluación multidimensional para orientar al Médico o Psicólogo de Turno:

DATOS DEL PACIENTE:
- Demografía: ${datosPaciente.edad} años, sexo ${datosPaciente.sexo}, ocupación ${datosPaciente.ocupacion || 'No especificada'}
- Depresión (PHQ-9): Puntaje ${datosPaciente.phq9Total ?? 'N/A'}/27 (Severidad: ${datosPaciente.phq9Gravedad ?? 'N/A'}). Ítem 9 (Ideación): ${datosPaciente.phq9Ideacion ?? 0}/3
- Ideación y Conducta Suicida (C-SSRS): Severidad clasificada como "${datosPaciente.cssrsSeveridad || 'Ninguna'}". Intento previo: ${datosPaciente.cssrsIntentoPrevio ? 'SÍ' : 'NO'}
- Desesperanza (BHS): Puntaje ${datosPaciente.bhsTotal ?? 'N/A'}/20 (Nivel: ${datosPaciente.bhsRiesgo ?? 'N/A'})
- DASS-21: Estrés ${datosPaciente.dass21Estres ?? 0}/42, Ansiedad ${datosPaciente.dass21Ansiedad ?? 0}/42, Depresión ${datosPaciente.dass21Depresion ?? 0}/42
- Autoestima (Rosenberg): Nivel ${datosPaciente.autoestima || 'Media'}
- Factores Clínicos y Psicosociales:
  * Consumo de sustancias de riesgo: ${datosPaciente.consumoSustancias ? 'SÍ' : 'NO'}
  * Red de apoyo social: ${datosPaciente.apoyoSocial ? 'PRESENTE' : 'AUSENTE / AISLADO'}
  * Pérdida o duelo reciente: ${datosPaciente.perdidaReciente ? 'SÍ' : 'NO'}
  * Exposición a violencia/abuso: ${datosPaciente.violenciaReciente ? 'SÍ' : 'NO'}
${datosPaciente.textoLibre ? `- Comentario libre del paciente: "${datosPaciente.textoLibre}"` : ''}

INSTRUCCIONES CLÍNICAS:
Genera un informe estructurado riguroso en formato Markdown, con un tono profesional médico, dividido exactamente en los 4 niveles de análisis:

### 1. 📋 ANÁLISIS DESCRIPTIVO (Perfil y Cuadro Actual)
- Síntesis del cuadro sintomático y puntajes más significativos.
- Nivel de afectación funcional y gravedad global detectada.

### 2. 🔍 ANÁLISIS DIAGNÓSTICO ORIENTATIVO (Factores Subyacentes y Correlación)
- Cruce de variables: ¿Cómo interactúa la desesperanza con el ánimo o la ideación?
- Factores de vulnerabilidad biológicos, psicológicos y socioeconómicos detectados.
- *Aclaración ética: Esta es una hipótesis orientativa para guiar la entrevista, no un diagnóstico definitivo.*

### 3. ⚠️ ANÁLISIS PREDICTIVO (Factores Gatillantes y Riesgo a Corto Plazo)
- Nivel de riesgo estimado de agravamiento o conducta autolesiva.
- Factores desencadenantes inmediatos a monitorear con mayor atención.
- Detección de inconsistencias psicométricas si las hubiere.

### 4. 🛡️ ANÁLISIS PRESCRIPTIVO (Protocolo de Acción para el Médico de Turno)
- Acciones inmediatas en los primeros 15-30 minutos de contacto.
- Medidas de seguridad y contención (red de apoyo, restricción de medios letales).
- Criterios de derivación médica/psiquiátrica de urgencia o seguimiento ambulatorio.
`

    return streamText({
      model: openai(AI_MODEL),
      prompt,
      temperature: 0.3,
    })
  }

  /**
   * Genera preguntas sugeridas para que el médico guíe la entrevista clínica (Copiloto)
   */
  static async generarPreguntasEntrevista(datosPaciente: Record<string, unknown>) {
    const prompt = `
Como supervisor clínico en salud mental, sugiere 4 a 5 preguntas concretas, empáticas y estratégicas que el médico de turno debe formular en la entrevista clínica basándose en estos datos:
${JSON.stringify(datosPaciente, null, 2)}

Para cada pregunta:
1. La formulación textual sugerida (en lenguaje empático pero directo).
2. El objetivo clínico de la pregunta (qué factor de riesgo se busca explorar o validar).
`

    const { text } = await generateText({
      model: openai(AI_MODEL),
      prompt,
      temperature: 0.4,
    })

    return text
  }

  /**
   * Guarda el resultado del análisis de IA en la base de datos
   */
  static async guardarAnalisisIa(params: {
    encuestaId: number
    tipoAnalisis: 'descriptivo' | 'diagnostico' | 'predictivo' | 'prescriptivo' | '4d_completo'
    resultadoAnalisis: Record<string, unknown>
    nivelRiesgoCalculado?: string
    recomendaciones?: Record<string, unknown>
  }) {
    return prisma.analisisIa.create({
      data: {
        encuestaId: params.encuestaId,
        tipoAnalisis: params.tipoAnalisis,
        resultadoAnalisis: params.resultadoAnalisis as any,
        nivelRiesgoCalculado: params.nivelRiesgoCalculado,
        recomendaciones: params.recomendaciones as any,
        modeloIa: AI_MODEL,
      },
    })
  }
}
