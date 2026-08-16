import { prisma } from '@/lib/prisma'

export class NotificacionesService {
  /**
   * Obtiene la lista de notificaciones con filtros de criticidad y estado de lectura
   */
  static async listarNotificaciones(params: {
    leida?: boolean
    tipoRiesgo?: string
    limit?: number
  }) {
    const where: Record<string, unknown> = {}
    if (typeof params.leida === 'boolean') {
      where.leida = params.leida
    }
    if (params.tipoRiesgo) {
      where.tipoRiesgo = params.tipoRiesgo
    }

    return prisma.notificacion.findMany({
      where,
      orderBy: { fechaCreacion: 'desc' },
      take: params.limit || 50,
      include: {
        encuesta: {
          select: {
            id: true,
            edad: true,
            sexo: true,
            fechaCreacion: true,
            usuario: { select: { alias: true } },
            phq9: { select: { puntajeTotal: true, nivelGravedad: true } },
            cssrs: { select: { nivelSeveridad: true } },
          },
        },
      },
    })
  }

  /**
   * Marca una notificación como leída
   */
  static async marcarComoLeida(id: number) {
    return prisma.notificacion.update({
      where: { id },
      data: {
        leida: true,
        fechaLectura: new Date(),
      },
    })
  }

  /**
   * Registra una respuesta o acción tomada por el médico/psicólogo
   */
  static async responderNotificacion(id: number, respuesta: string) {
    return prisma.notificacion.update({
      where: { id },
      data: {
        respuesta,
        leida: true,
        fechaRespuesta: new Date(),
      },
    })
  }
}
