import { prisma } from '@/lib/prisma'

export class AnalyticsService {
  /**
   * Genera el resumen consolidado de métricas para el Dashboard de BI
   */
  static async obtenerResumenBI() {
    const [
      totalEncuestas,
      totalUsuarios,
      notificacionesCriticas,
      promediosPhq9,
      distribucionPhq9,
      distribucionCssrs,
      distribucionSexo,
      encuestasRecientes,
    ] = await Promise.all([
      // Total encuestas
      prisma.encuesta.count(),

      // Total usuarios registrados
      prisma.usuario.count(),

      // Notificaciones activas de riesgo alto/muy alto no leídas
      prisma.notificacion.count({
        where: {
          leida: false,
          tipoRiesgo: { in: ['alto', 'muy_alto', 'critico'] },
        },
      }),

      // Promedio PHQ-9
      prisma.phq9Respuesta.aggregate({
        _avg: { puntajeTotal: true },
        _max: { puntajeTotal: true },
        _min: { puntajeTotal: true },
      }),

      // Distribución por nivel de gravedad PHQ-9
      prisma.phq9Respuesta.groupBy({
        by: ['nivelGravedad'],
        _count: { id: true },
      }),

      // Distribución C-SSRS
      prisma.cssrsRespuesta.groupBy({
        by: ['nivelSeveridad'],
        _count: { id: true },
      }),

      // Distribución por sexo
      prisma.encuesta.groupBy({
        by: ['sexo'],
        _count: { id: true },
      }),

      // Últimas 5 encuestas
      prisma.encuesta.findMany({
        take: 5,
        orderBy: { fechaCreacion: 'desc' },
        include: {
          phq9: { select: { puntajeTotal: true, nivelGravedad: true } },
          cssrs: { select: { nivelSeveridad: true } },
        },
      }),
    ])

    return {
      kpis: {
        totalEncuestas,
        totalUsuarios,
        notificacionesCriticas,
        promedioPhq9: Number((promediosPhq9._avg.puntajeTotal || 0).toFixed(1)),
        maxPhq9: promediosPhq9._max.puntajeTotal || 0,
      },
      distribuciones: {
        phq9: distribucionPhq9.map((item) => ({
          name: item.nivelGravedad,
          value: item._count.id,
        })),
        cssrs: distribucionCssrs.map((item) => ({
          name: item.nivelSeveridad,
          value: item._count.id,
        })),
        sexo: distribucionSexo.map((item) => ({
          name: item.sexo,
          value: item._count.id,
        })),
      },
      encuestasRecientes,
    }
  }
}
