import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/metricas/satisfaccion - Guardar satisfacción del usuario
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { encuestaId, satisfaccion } = body

    if (!encuestaId || typeof satisfaccion !== 'number') {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: encuestaId, satisfaccion' },
        { status: 400 }
      )
    }

    if (satisfaccion < 1 || satisfaccion > 5) {
      return NextResponse.json(
        { error: 'satisfaccion debe ser un número entre 1 y 5' },
        { status: 400 }
      )
    }

    const encuesta = await prisma.encuesta.update({
      where: { id: encuestaId },
      data: { satisfaccion },
    })

    return NextResponse.json({ ok: true, encuestaId: encuesta.id })
  } catch (error) {
    console.error('Error al guardar satisfacción:', error)
    return NextResponse.json(
      { error: 'Error al guardar satisfacción' },
      { status: 500 }
    )
  }
}
