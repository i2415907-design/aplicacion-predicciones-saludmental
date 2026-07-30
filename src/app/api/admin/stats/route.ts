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
      riesgoCritico,
      totalSesiones,
      sesionesCompletadas,
      satisfaccionAvg,
      tiempoPromedio
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
      }),
      prisma.sesionEncuesta.count(),
      prisma.sesionEncuesta.count({
        where: { completada: true }
      }),
      prisma.encuesta.aggregate({
        _avg: { satisfaccion: true },
        where: { satisfaccion: { not: null } }
      }),
      prisma.sesionEncuesta.aggregate({
        _avg: { tiempoSegundos: true },
        where: { completada: true, tiempoSegundos: { not: null } }
      })
    ])

    const tasaFinalizacion = totalSesiones > 0
      ? Math.round((sesionesCompletadas / totalSesiones) * 100)
      : 0

    return NextResponse.json({
      totalEncuestas,
      encuestasHoy,
      notificacionesPendientes,
      riesgoAlto,
      riesgoCritico,
      tasaFinalizacion,
      satisfaccionPromedio: satisfaccionAvg._avg.satisfaccion
        ? Math.round(satisfaccionAvg._avg.satisfaccion * 10) / 10
        : null,
      tiempoPromedioSegundos: tiempoPromedio._avg.tiempoSegundos
        ? Math.round(tiempoPromedio._avg.tiempoSegundos)
        : null
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
