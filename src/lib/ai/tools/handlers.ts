import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

const DETALLE_INCLUDES = {
  phq9: true,
  cssrs: true,
  bhs: true,
  dass21: true,
  rosenberg: true,
  socioeconomicos: true,
  saludFisica: true,
  psicologicos: true,
  historial: true,
  notificaciones: {
    orderBy: { fechaCreacion: 'desc' as const },
    take: 3,
  },
} as const

type EncuestaDetalle = Prisma.EncuestaGetPayload<{
  include: typeof DETALLE_INCLUDES
}>

export class ToolHandlers {
  /**
   * Ejecuta la herramienta requerida por el modelo Gemini
   */
  public static async ejecutar(
    nombre: string,
    args: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    try {
      switch (nombre) {
        case 'obtenerDetalleCasoPaciente':
          return await this.obtenerDetalleCasoPaciente(args as { encuestaId?: number; buscarNombre?: string })

        case 'consultarMetricasGeneralesBI':
          return await this.consultarMetricasGeneralesBI(args as { filtroSexo?: string; filtroZona?: string })

        case 'consultarAlertasCriticas':
          return await this.consultarAlertasCriticas(args as { tipoRiesgo?: string; soloNoLeidas?: boolean; limite?: number })

        case 'analizarCrucesFactoresRiesgo':
          return await this.analizarCrucesFactoresRiesgo(args as { factor: string })

        case 'obtenerProtocoloClinico':
          return this.obtenerProtocoloClinico(args as { nivelRiesgo: string }) as Record<string, unknown>

        default:
          return { error: `Herramienta desconocida: ${nombre}` }
      }
    } catch (error) {
      console.error(`[ToolHandlers] Error ejecutando herramienta ${nombre}:`, error)
      return {
        error: `No se pudo consultar los datos mediante ${nombre}.`,
      }
    }
  }

  private static async obtenerDetalleCasoPaciente(args: {
    encuestaId?: number
    buscarNombre?: string
  }) {
    let encuesta: EncuestaDetalle | null = null

    if (args.encuestaId) {
      encuesta = await prisma.encuesta.findUnique({
        where: { id: Number(args.encuestaId) },
        include: DETALLE_INCLUDES,
      })
    } else if (args.buscarNombre) {
      const termino = args.buscarNombre.trim()
      encuesta = await prisma.encuesta.findFirst({
        where: {
          OR: [
            { nombre: { contains: termino, mode: 'insensitive' } },
            { apellido: { contains: termino, mode: 'insensitive' } },
          ],
        },
        include: DETALLE_INCLUDES,
        orderBy: { id: 'desc' },
      })
    }

    if (!encuesta) {
      return {
        mensaje: 'No se encontró ninguna encuesta con los criterios proporcionados.',
      }
    }

    const phq9 = encuesta.phq9?.[0]
    const cssrs = encuesta.cssrs?.[0]
    const bhs = encuesta.bhs?.[0]
    const dass21 = encuesta.dass21?.[0]
    const rosenberg = encuesta.rosenberg?.[0]

    let rosenbergScore = 0
    if (rosenberg) {
      rosenbergScore =
        rosenberg.item1 +
        rosenberg.item2 +
        rosenberg.item3 +
        rosenberg.item4 +
        rosenberg.item5 +
        rosenberg.item6 +
        rosenberg.item7 +
        rosenberg.item8 +
        rosenberg.item9 +
        rosenberg.item10
    }

    return {
      paciente: {
        id: encuesta.id,
        nombre: encuesta.nombre || 'Anónimo',
        apellido: encuesta.apellido || '',
        edad: encuesta.edad,
        sexo: encuesta.sexo,
        estadoCivil: encuesta.estadoCivil,
        ocupacion: encuesta.ocupacion,
        zona: encuesta.zonaResidencia,
        fecha: encuesta.fechaCreacion,
      },
      escalasClinicas: {
        phq9: phq9
          ? {
              puntajeTotal: phq9.puntajeTotal,
              gravedad: phq9.nivelGravedad,
              item9IdeacionSuicida: phq9.ideacionSuicida,
            }
          : null,
        cssrs: cssrs
          ? {
              severidad: cssrs.nivelSeveridad,
              deseosMorir: cssrs.deseosMorir,
              pensamientosSuicidas: cssrs.pensamientosSuicidas,
              planEspecifico: cssrs.planEspecifico,
              intentoPrevio: cssrs.intentoPrevio,
              metodoIntento: cssrs.metodoIntento,
            }
          : null,
        bhs: bhs
          ? {
              puntajeTotal: bhs.puntajeTotal,
              nivelRiesgo: bhs.nivelRiesgo,
            }
          : null,
        dass21: dass21
          ? {
              estres: dass21.puntajeEstres,
              ansiedad: dass21.puntajeAnsiedad,
              depresion: dass21.puntajeDepresion,
            }
          : null,
        autoestimaRosenberg: rosenberg ? rosenbergScore : null,
      },
      factoresPsicosociales: {
        violenciaFisica: encuesta.psicologicos?.violenciaFisica,
        violenciaPsicologica: encuesta.psicologicos?.violenciaPsicologica,
        abusoSexual: encuesta.psicologicos?.abusoSexual,
        perdidaFamiliarReciente: encuesta.psicologicos?.perdidaFamiliarReciente,
        desempleoReciente: encuesta.psicologicos?.desempleoReciente,
        tieneRedApoyo: encuesta.psicologicos?.tieneRedApoyo,
      },
      saludFisica: {
        consumeDrogas: encuesta.saludFisica?.consumeDrogas,
        frecuenciaAlcohol: encuesta.saludFisica?.frecuenciaAlcohol,
        calidadSueno: encuesta.saludFisica?.calidadSueno,
        insomnio: encuesta.saludFisica?.insomnio,
      },
      historialIntentos: {
        numIntentosPrevios: encuesta.historial?.numIntentosPrevios || 0,
        tratamientoPrevio: encuesta.historial?.tratamientoPsiquiatricoPrevio,
        antecedentesFamiliares: encuesta.historial?.antecedentesFamiliaresSuicidio,
      },
    }
  }

  private static async consultarMetricasGeneralesBI(args: {
    filtroSexo?: string
    filtroZona?: string
  }) {
    const where: Prisma.EncuestaWhereInput = {}
    if (args.filtroSexo && args.filtroSexo !== 'todos') {
      where.sexo = args.filtroSexo
    }
    if (args.filtroZona && args.filtroZona !== 'todas') {
      where.zonaResidencia = args.filtroZona
    }

    const totalEncuestas = await prisma.encuesta.count({ where })

    const porSexo = await prisma.encuesta.groupBy({
      by: ['sexo'],
      _count: { id: true },
      where,
    })

    const porZona = await prisma.encuesta.groupBy({
      by: ['zonaResidencia'],
      _count: { id: true },
      where,
    })

    // Promedio de PHQ-9
    const avgPhq9 = await prisma.phq9Respuesta.aggregate({
      _avg: { puntajeTotal: true },
      where: where.sexo ? { encuesta: { sexo: where.sexo } } : {},
    })

    // Conteo por gravedad PHQ-9
    const distribucionDepresion = await prisma.phq9Respuesta.groupBy({
      by: ['nivelGravedad'],
      _count: { id: true },
    })

    // Conteo de ideación suicida activa (C-SSRS)
    const ideacionActiva = await prisma.cssrsRespuesta.count({
      where: { pensamientosSuicidas: true },
    })

    const planesEspecificos = await prisma.cssrsRespuesta.count({
      where: { planEspecifico: true },
    })

    // Casos con intentos previos registrados
    const conIntentoPrevio = await prisma.historialIntentos.count({
      where: { numIntentosPrevios: { gt: 0 } },
    })

    return {
      totalEncuestas,
      distribucionPorSexo: porSexo.map((s) => ({ sexo: s.sexo, total: s._count.id })),
      distribucionPorZona: porZona.map((z) => ({ zona: z.zonaResidencia, total: z._count.id })),
      promedioPhq9Depresion: Number(avgPhq9._avg.puntajeTotal?.toFixed(2) || 0),
      gravedadDepresion: distribucionDepresion.map((d) => ({
        gravedad: d.nivelGravedad,
        total: d._count.id,
      })),
      estadisticasRiesgoSuicida: {
        pensamientosSuicidasDeclarados: ideacionActiva,
        planesEspecificosElaborados: planesEspecificos,
        pacientesConHistorialIntentos: conIntentoPrevio,
      },
    }
  }

  private static async consultarAlertasCriticas(args: {
    tipoRiesgo?: string
    soloNoLeidas?: boolean
    limite?: number
  }) {
    const where: Prisma.NotificacionWhereInput = {}
    if (args.tipoRiesgo && args.tipoRiesgo !== 'todos') {
      where.tipoRiesgo = args.tipoRiesgo
    }
    if (args.soloNoLeidas) {
      where.leida = false
    }

    const take = Math.min(Number(args.limite) || 10, 25)

    const notificaciones = await prisma.notificacion.findMany({
      where,
      orderBy: { fechaCreacion: 'desc' },
      take,
      include: {
        encuesta: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            edad: true,
            sexo: true,
          },
        },
      },
    })

    return {
      totalAlertasRetornadas: notificaciones.length,
      alertas: notificaciones.map((n) => ({
        id: n.id,
        encuestaId: n.encuestaId,
        tipoRiesgo: n.tipoRiesgo,
        titulo: n.titulo,
        descripcion: n.descripcion,
        leida: n.leida,
        accionRequerida: n.accionRequerida,
        paciente: {
          nombre: `${n.encuesta.nombre || 'Anónimo'} ${n.encuesta.apellido || ''}`.trim(),
          edad: n.encuesta.edad,
          sexo: n.encuesta.sexo,
        },
        fecha: n.fechaCreacion,
      })),
    }
  }

  private static async analizarCrucesFactoresRiesgo(args: { factor: string }) {
    const { factor } = args

    if (factor === 'drogas') {
      const conDrogas = await prisma.saludFisica.count({ where: { consumeDrogas: true } })
      const sinDrogas = await prisma.saludFisica.count({ where: { consumeDrogas: false } })
      return {
        factor: 'Consumo de Sustancias/Drogas',
        pacientesConsumenDrogas: conDrogas,
        pacientesNoConsumen: sinDrogas,
        observacion:
          'El consumo de sustancias psicoactivas actúa como desinhibidor conductual, aumentando significativamente el riesgo de paso al acto en ideaciones suicidas.',
      }
    }

    if (factor === 'violencia') {
      const conViolencia = await prisma.factoresPsicologicos.count({
        where: {
          OR: [{ violenciaFisica: true }, { violenciaPsicologica: true }, { abusoSexual: true }],
        },
      })
      return {
        factor: 'Exposición a Violencia o Abuso',
        totalCasosReportados: conViolencia,
        observacion:
          'Los antecedentes de trauma o violencia reciente correlacionan con elevados índices de estrés postraumático y desesperanza clínica (BHS).',
      }
    }

    if (factor === 'sin_red_apoyo') {
      const aislados = await prisma.factoresPsicologicos.count({
        where: { tieneRedApoyo: false },
      })
      return {
        factor: 'Ausencia de Red de Apoyo Social',
        totalPacientesAislados: aislados,
        observacion:
          'El aislamiento percibido es uno de los factores de vulnerabilidad más determinantes en las escalas de desesperanza.',
      }
    }

    return {
      factor,
      mensaje: `Análisis procesado para ${factor}. Se recomienda correlacionar con las escalas individuales de PHQ-9 y C-SSRS.`,
    }
  }

  private static obtenerProtocoloClinico(args: { nivelRiesgo: string }) {
    const protocolos: Record<string, unknown> = {
      bajo: {
        nivel: 'Bajo',
        acciones: [
          'Brindar psicoeducación y validación emocional.',
          'Ofrecer recursos comunitarios de bienestar y manejo del estrés.',
          'Mantener acceso visible y permanente a líneas de ayuda preventivas.',
        ],
        seguimiento: 'Reevaluación periódica sugerida cada 4 a 6 semanas.',
      },
      moderado: {
        nivel: 'Moderado',
        acciones: [
          'Derivar a consulta psicológica ambulatoria en plazo no mayor a 7 días.',
          'Explorar factores desencadenantes (duelo, desempleo, conflicto familiar).',
          'Identificar e involucrar a un contacto de confianza para fortalecer la red de apoyo.',
        ],
        seguimiento: 'Control de evolución clínica cada 1 a 2 semanas.',
      },
      alto: {
        nivel: 'Alto',
        acciones: [
          'Atención profesional prioritaria dentro de las primeras 24 a 48 horas.',
          'Elaborar Plan de Seguridad estructurado (Stanley & Brown): identificar señales de advertencia, estrategias de afrontamiento y personas de contacto.',
          'Restringir de inmediato el acceso a medios potencialmente letales en el entorno del paciente.',
          'Coordinar con un adulto responsable o familiar directo.',
        ],
        seguimiento: 'Monitoreo diario o cada 48 horas.',
      },
      muy_alto_emergencia: {
        nivel: 'Crítico / Inminente',
        acciones: [
          '🚨 PROTOCOLO DE EMERGENCIA INMEDIATA: No dejar solo al paciente bajo ninguna circunstancia.',
          'Contactar de inmediato a los servicios de urgencia o acudir al centro de salud mental más cercano.',
          'Líneas de crisis oficiales disponibles 24/7: Línea 113 (Salud Mental - Minsa) / Línea 988.',
          'Evaluación psiquiátrica de urgencia para determinar necesidad de hospitalización protectora.',
          'Retiro absoluto de cualquier medio letal (fármacos, objetos punzocortantes, armas).',
        ],
        seguimiento: 'Acompañamiento continuo y enlace con servicios hospitalarios.',
      },
    }

    return protocolos[args.nivelRiesgo] || protocolos['alto']
  }
}
