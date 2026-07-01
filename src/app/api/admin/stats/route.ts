import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      totalEncuestas,
      encuestasHoy,
      notificacionesPendientes,
      riesgoAlto,
      riesgoCritico
    ] = await Promise.all([
      prisma.encuesta.count(),
      prisma.encuesta.count({
        where: {
          createdAt: { gte: today }
        }
      }),
      prisma.notificacion.count({
        where: { leida: false }
      }),
      prisma.notificacion.count({
        where: { tipoRiesgo: 'alto', leida: false }
      }),
      prisma.notificacion.count({
        where: { tipoRiesgo: 'critico', leida: false }
      })
    ])

    return NextResponse.json({
      totalEncuestas,
      encuestasHoy,
      notificacionesPendientes,
      riesgoAlto,
      riesgoCritico
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
