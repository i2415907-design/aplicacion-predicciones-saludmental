import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/metricas/sesion/[id] - Actualizar sesión (último paso, completada, tiempo)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const body = await request.json()

    const updateData: Record<string, unknown> = {}

    if (body.ultimoPaso !== undefined) {
      updateData.ultimoPaso = body.ultimoPaso
    }

    if (body.completada !== undefined) {
      updateData.completada = body.completada
    }

    if (body.tiempoSegundos !== undefined) {
      updateData.tiempoSegundos = body.tiempoSegundos
    }

    if (body.encuestaId !== undefined) {
      updateData.encuestaId = body.encuestaId
    }

    const sesion = await prisma.sesionEncuesta.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(sesion)
  } catch (error) {
    console.error('Error al actualizar sesión:', error)
    return NextResponse.json(
      { error: 'Error al actualizar sesión' },
      { status: 500 }
    )
  }
}
