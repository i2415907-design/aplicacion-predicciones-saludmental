import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/metricas/sesion - Registrar inicio de una encuesta
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const sesion = await prisma.sesionEncuesta.create({
      data: {
        inicioEn: new Date(),
        ultimoPaso: 0,
        completada: false,
      },
    })

    return NextResponse.json({ sesionId: sesion.id }, { status: 201 })
  } catch (error) {
    console.error('Error al crear sesión:', error)
    return NextResponse.json(
      { error: 'Error al crear sesión' },
      { status: 500 }
    )
  }
}
