import { NextResponse } from 'next/server'
import { EncuestaService } from '@/services/encuesta.service'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID de encuesta inválido' }, { status: 400 })
    }

    const encuesta = await EncuestaService.obtenerEncuestaPorId(id)

    if (!encuesta) {
      return NextResponse.json({ error: 'Encuesta no encontrada' }, { status: 404 })
    }

    // Unwrap array relations for clean view consumption
    const result = {
      ...encuesta,
      phq9: encuesta.phq9?.[0] || null,
      cssrs: encuesta.cssrs?.[0] || null,
      bhs: encuesta.bhs?.[0] || null,
      rosenberg: encuesta.rosenberg?.[0] || null,
      dass21: encuesta.dass21?.[0] || null,
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error al obtener encuesta por id:', error)
    return NextResponse.json(
      { error: 'Error al obtener la encuesta', details: error?.message },
      { status: 500 }
    )
  }
}
