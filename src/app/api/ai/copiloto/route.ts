import { NextResponse } from 'next/server'
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
        datosPaciente = {
          edad: encuesta.edad,
          sexo: encuesta.sexo,
          phq9: encuesta.phq9?.[0],
          cssrs: encuesta.cssrs?.[0],
          bhs: encuesta.bhs?.[0],
          dass21: encuesta.dass21?.[0],
          psicologicos: encuesta.psicologicos,
          saludFisica: encuesta.saludFisica,
          socioeconomicos: encuesta.socioeconomicos,
        }
      }
    }

    if (!datosPaciente) {
      return NextResponse.json({ error: 'No se enviaron datos del caso' }, { status: 400 })
    }

    const preguntas = await AIService.generarPreguntasEntrevista(datosPaciente)
    return NextResponse.json({ preguntas })
  } catch (error: any) {
    console.error('Error en /api/ai/copiloto:', error)
    return NextResponse.json(
      { error: 'Error al generar preguntas del copiloto', details: error?.message },
      { status: 500 }
    )
  }
}
