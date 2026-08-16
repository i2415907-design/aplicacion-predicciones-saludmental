import { AIService } from '@/services/ai.service'
import { EncuestaService } from '@/services/encuesta.service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { encuestaId, datosManuales } = body

    let datosPaciente = datosManuales

    if (encuestaId) {
      const encuesta = await EncuestaService.obtenerEncuestaPorId(Number(encuestaId))
      if (encuesta) {
        const phq9 = encuesta.phq9?.[0]
        const cssrs = encuesta.cssrs?.[0]
        const bhs = encuesta.bhs?.[0]
        const dass21 = encuesta.dass21?.[0]
        const salud = encuesta.saludFisica
        const psico = encuesta.psicologicos

        datosPaciente = {
          edad: encuesta.edad,
          sexo: encuesta.sexo,
          ocupacion: encuesta.ocupacion,
          nivelEducativo: encuesta.nivelEducativo,
          phq9Total: phq9?.puntajeTotal,
          phq9Gravedad: phq9?.nivelGravedad,
          phq9Ideacion: phq9?.ideacionSuicida,
          cssrsSeveridad: cssrs?.nivelSeveridad,
          cssrsIntentoPrevio: cssrs?.intentoPrevio,
          bhsTotal: bhs?.puntajeTotal,
          bhsRiesgo: bhs?.nivelRiesgo,
          dass21Estres: dass21?.puntajeEstres,
          dass21Ansiedad: dass21?.puntajeAnsiedad,
          dass21Depresion: dass21?.puntajeDepresion,
          consumoSustancias: salud?.consumeDrogas || salud?.consumeAlcohol,
          apoyoSocial: psico?.tieneRedApoyo,
          perdidaReciente: psico?.perdidaFamiliarReciente || psico?.ruptureParejaReciente,
          violenciaReciente: psico?.violenciaFisica || psico?.violenciaPsicologica || psico?.abusoSexual,
        }
      }
    }

    if (!datosPaciente) {
      return new Response(JSON.stringify({ error: 'No se suministraron datos del paciente' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const result = await AIService.generarAnalisis4DStreaming(datosPaciente)
    return result.toTextStreamResponse()
  } catch (error: any) {
    console.error('Error en /api/ai/analisis-4d:', error)
    return new Response(JSON.stringify({ error: error?.message || 'Error al generar informe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
