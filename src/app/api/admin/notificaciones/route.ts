import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const soloNoLeidas = searchParams.get('soloNoLeidas') === 'true'

    const where = soloNoLeidas ? { leida: false } : {}

    const notificaciones = await prisma.notificacion.findMany({
      where,
      include: {
        encuesta: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            edad: true,
            sexo: true,
            fechaCreacion: true
          }
        }
      },
      orderBy: { fechaCreacion: 'desc' },
      take: limit
    })

    return NextResponse.json({ notificaciones })
  } catch (error) {
    console.error('Error fetching notificaciones:', error)
    return NextResponse.json(
      { error: 'Error al obtener notificaciones' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { encuestaId, tipoRiesgo, titulo, descripcion, accionRequerida } = body

    const notificacion = await prisma.notificacion.create({
      data: {
        encuestaId,
        tipoRiesgo,
        titulo,
        descripcion,
        accionRequerida: accionRequerida || null
      }
    })

    return NextResponse.json(notificacion, { status: 201 })
  } catch (error) {
    console.error('Error creating notificacion:', error)
    return NextResponse.json(
      { error: 'Error al crear notificación' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, leida, respuesta } = body

    const updateData: Record<string, unknown> = {}
    
    if (leida !== undefined) {
      updateData.leida = leida
      if (leida) {
        updateData.fechaLectura = new Date()
      }
    }
    
    if (respuesta !== undefined) {
      updateData.respuesta = respuesta
      updateData.fechaRespuesta = new Date()
    }

    const notificacion = await prisma.notificacion.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(notificacion)
  } catch (error) {
    console.error('Error updating notificacion:', error)
    return NextResponse.json(
      { error: 'Error al actualizar notificación' },
      { status: 500 }
    )
  }
}
