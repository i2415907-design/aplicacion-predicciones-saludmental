import { NextResponse } from 'next/server'
import { EncuestaService } from '@/services/encuesta.service'

export async function POST(request: Request) {
  try {
    const rawBody = await request.json()
    const usuarioId = rawBody.usuarioId ? Number(rawBody.usuarioId) : null

    const result = await EncuestaService.crearEncuesta(rawBody, usuarioId)

    // Unwrapping para compatibilidad con la vista
    const unwrapped = {
      ...result.encuesta,
      phq9: result.encuesta.phq9?.[0] || null,
      cssrs: result.encuesta.cssrs?.[0] || null,
      bhs: result.encuesta.bhs?.[0] || null,
      rosenberg: result.encuesta.rosenberg?.[0] || null,
      dass21: result.encuesta.dass21?.[0] || null,
      calculos: result.calculos,
    }

    return NextResponse.json(unwrapped, { status: 201 })
  } catch (error: any) {
    console.error('Error al crear encuesta:', error)
    return NextResponse.json(
      { error: 'Error interno al procesar la encuesta', details: error?.message },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const busqueda = searchParams.get('search') || undefined

    const result = await EncuestaService.listarEncuestas({
      page,
      limit,
      busqueda,
    })

    const encuestasUnwrapped = result.encuestas.map((enc) => ({
      ...enc,
      phq9: enc.phq9?.[0] || null,
      cssrs: enc.cssrs?.[0] || null,
      bhs: enc.bhs?.[0] || null,
      dass21: enc.dass21?.[0] || null,
      notificacion: enc.notificaciones?.[0] || null,
    }))

    return NextResponse.json({
      encuestas: encuestasUnwrapped,
      pagination: result.pagination,
    })
  } catch (error: any) {
    console.error('Error al listar encuestas:', error)
    return NextResponse.json(
      { error: 'Error al obtener las encuestas', details: error?.message },
      { status: 500 }
    )
  }
}
