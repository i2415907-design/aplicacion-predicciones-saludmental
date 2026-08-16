import { prisma } from '@/lib/prisma'
import {
  calcularPHQ9,
  calcularDASS21,
  calcularBHS,
  calcularRosenberg,
  calcularCSSRS,
  calcularRiesgoGlobal,
} from '@/lib/calculos'
import { EncuestaInput } from '@/validators/encuesta'

export class EncuestaService {
  /**
   * Crea una encuesta completa con todas sus escalas clínicas y factores asociados,
   * calcula los puntajes en tiempo real y emite una alerta clínica si es necesario.
   */
  static async crearEncuesta(data: EncuestaInput, usuarioId?: number | null) {
    // 1. Cálculos de escalas clínicas
    const phq9Calc = data.phq9 ? calcularPHQ9(data.phq9) : null
    const dass21Calc = data.dass21 ? calcularDASS21(data.dass21) : null
    const bhsCalc = data.bhs
      ? calcularBHS([
          data.bhs.item1, data.bhs.item2, data.bhs.item3, data.bhs.item4, data.bhs.item5,
          data.bhs.item6, data.bhs.item7, data.bhs.item8, data.bhs.item9, data.bhs.item10,
          data.bhs.item11, data.bhs.item12, data.bhs.item13, data.bhs.item14, data.bhs.item15,
          data.bhs.item16, data.bhs.item17, data.bhs.item18, data.bhs.item19, data.bhs.item20,
        ])
      : null
    const rosenbergCalc = data.rosenberg ? calcularRosenberg(data.rosenberg) : null
    const cssrsCalc = data.cssrs ? calcularCSSRS(data.cssrs) : { nivelSeveridad: 'ninguna' }

    // 2. Cálculo compuesto de riesgo y triaje clínico
    const riesgoGlobal = calcularRiesgoGlobal({
      phq9: phq9Calc?.puntajeTotal || 0,
      bhs: bhsCalc?.puntajeTotal || 0,
      cssrs: cssrsCalc.nivelSeveridad,
      ideacionSuicidaPhq9: data.phq9?.ideacionSuicida,
      intentoPrevio: data.cssrs?.intentoPrevio || data.historial?.numIntentosPrevios ? true : false,
      consumoSustancias:
        data.saludFisica?.consumeDrogas ||
        data.saludFisica?.frecuenciaAlcohol === 'diario' ||
        data.saludFisica?.frecuenciaAlcohol === 'frecuente',
      aislamientoSocial: data.psicologicos?.tieneRedApoyo === false || data.socioeconomicos?.viveSolo === true,
      violenciaReciente:
        data.psicologicos?.violenciaFisica ||
        data.psicologicos?.violenciaPsicologica ||
        data.psicologicos?.abusoSexual ||
        data.psicologicos?.bullying,
      perdidaReciente:
        data.psicologicos?.perdidaFamiliarReciente ||
        data.psicologicos?.ruptureParejaReciente ||
        data.psicologicos?.desempleoReciente,
    })

    // 3. Persistencia en transacción atómica de base de datos
    const encuestaCreada = await prisma.encuesta.create({
      data: {
        usuarioId: usuarioId || null,
        edad: data.edad,
        sexo: data.sexo,
        estadoCivil: data.estadoCivil,
        nivelEducativo: data.nivelEducativo,
        ocupacion: data.ocupacion,
        ingresoMensual: data.ingresoMensual,
        zonaResidencia: data.zonaResidencia,
        estadoUsuario: data.estadoUsuario || 'vivo',
        causaFallecimiento: data.causaFallecimiento,
        fallecimientoVoluntario: data.fallecimientoVoluntario,
        fechaFallecimiento: data.fechaFallecimiento ? new Date(data.fechaFallecimiento) : null,

        // PHQ-9
        phq9: data.phq9 && phq9Calc
          ? {
              create: {
                ...data.phq9,
                puntajeTotal: phq9Calc.puntajeTotal,
                nivelGravedad: phq9Calc.nivelGravedad,
              },
            }
          : undefined,

        // C-SSRS
        cssrs: data.cssrs
          ? {
              create: {
                ...data.cssrs,
                fechaUltimoIntento: data.cssrs.fechaUltimoIntento ? new Date(data.cssrs.fechaUltimoIntento) : null,
                nivelSeveridad: cssrsCalc.nivelSeveridad,
              },
            }
          : undefined,

        // BHS
        bhs: data.bhs && bhsCalc
          ? {
              create: {
                ...data.bhs,
                puntajeTotal: bhsCalc.puntajeTotal,
                nivelRiesgo: bhsCalc.nivelRiesgo,
              },
            }
          : undefined,

        // Rosenberg
        rosenberg: data.rosenberg
          ? {
              create: {
                ...data.rosenberg,
              },
            }
          : undefined,

        // DASS-21
        dass21: data.dass21 && dass21Calc
          ? {
              create: {
                ...data.dass21,
                puntajeEstres: dass21Calc.puntajeEstres,
                puntajeAnsiedad: dass21Calc.puntajeAnsiedad,
                puntajeDepresion: dass21Calc.puntajeDepresion,
              },
            }
          : undefined,

        // Factores Socioeconómicos
        socioeconomicos: data.socioeconomicos
          ? {
              create: {
                ...data.socioeconomicos,
              },
            }
          : undefined,

        // Salud Física
        saludFisica: data.saludFisica
          ? {
              create: {
                ...data.saludFisica,
              },
            }
          : undefined,

        // Factores Psicológicos
        psicologicos: data.psicologicos
          ? {
              create: {
                ...data.psicologicos,
              },
            }
          : undefined,

        // Historial Intentos
        historial: data.historial
          ? {
              create: {
                ...data.historial,
                ultimoIntentoFecha: data.historial.ultimoIntentoFecha ? new Date(data.historial.ultimoIntentoFecha) : null,
              },
            }
          : undefined,

        // Notificación automática al equipo clínico
        notificaciones: {
          create: {
            tipoRiesgo: riesgoGlobal.nivelRiesgo,
            titulo: `Alerta ${riesgoGlobal.prioridadAlerta.toUpperCase()}: Paciente (${data.edad} años, ${data.sexo})`,
            descripcion: `Puntaje compuesto: ${riesgoGlobal.puntajeRiesgo}. Factores clave: ${
              riesgoGlobal.factoresAlarma.slice(0, 3).join('; ') || 'Evaluación rutinaria'
            }. SLA de atención: ${riesgoGlobal.slaHoras}h.`,
            accionRequerida: riesgoGlobal.accionRequerida,
          },
        },
      },
      include: {
        phq9: true,
        cssrs: true,
        bhs: true,
        rosenberg: true,
        dass21: true,
        socioeconomicos: true,
        saludFisica: true,
        psicologicos: true,
        historial: true,
        notificaciones: true,
      },
    })

    return {
      encuesta: encuestaCreada,
      calculos: {
        phq9: phq9Calc,
        dass21: dass21Calc,
        bhs: bhsCalc,
        rosenberg: rosenbergCalc,
        cssrs: cssrsCalc,
        riesgoGlobal,
      },
    }
  }

  /**
   * Obtiene el detalle completo de una encuesta por ID
   */
  static async obtenerEncuestaPorId(id: number) {
    return prisma.encuesta.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { id: true, alias: true, tipo: true },
        },
        phq9: true,
        cssrs: true,
        bhs: true,
        rosenberg: true,
        dass21: true,
        socioeconomicos: true,
        saludFisica: true,
        psicologicos: true,
        historial: true,
        analisis: {
          orderBy: { fechaAnalisis: 'desc' },
        },
        notificaciones: {
          orderBy: { fechaCreacion: 'desc' },
        },
        casosArchivados: {
          include: { categoria: true },
        },
      },
    })
  }

  /**
   * Lista encuestas con paginación, filtros por riesgo y búsqueda
   */
  static async listarEncuestas(params: {
    page?: number
    limit?: number
    nivelRiesgo?: string
    busqueda?: string
    soloAnonimas?: boolean
  }) {
    const page = Math.max(1, params.page || 1)
    const limit = Math.min(100, Math.max(5, params.limit || 20))
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (params.soloAnonimas) {
      where.usuarioId = null
    }

    if (params.busqueda) {
      const searchNumber = parseInt(params.busqueda, 10)
      where.OR = [
        ...(isNaN(searchNumber) ? [] : [{ id: searchNumber }]),
        { nombre: { contains: params.busqueda, mode: 'insensitive' } },
        { apellido: { contains: params.busqueda, mode: 'insensitive' } },
        { ocupacion: { contains: params.busqueda, mode: 'insensitive' } },
        { usuario: { alias: { contains: params.busqueda, mode: 'insensitive' } } },
      ]
    }

    const [total, encuestas] = await Promise.all([
      prisma.encuesta.count({ where }),
      prisma.encuesta.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fechaCreacion: 'desc' },
        include: {
          usuario: { select: { id: true, alias: true } },
          phq9: { select: { puntajeTotal: true, nivelGravedad: true, ideacionSuicida: true } },
          cssrs: { select: { nivelSeveridad: true, intentoPrevio: true } },
          bhs: { select: { puntajeTotal: true, nivelRiesgo: true } },
          dass21: { select: { puntajeEstres: true, puntajeAnsiedad: true, puntajeDepresion: true } },
          notificaciones: {
            take: 1,
            orderBy: { fechaCreacion: 'desc' },
            select: { tipoRiesgo: true, leida: true },
          },
        },
      }),
    ])

    return {
      encuestas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}
