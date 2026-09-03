import { prisma } from '@/lib/prisma'
import {
  calcularPHQ9,
  calcularDASS21,
  calcularBHS,
  calcularRosenberg,
  calcularCSSRS,
  calcularRiesgoGlobal,
} from '@/lib/calculos'

export class EncuestaService {
  /**
   * Normaliza y crea una encuesta completa con todas sus escalas clínicas y factores asociados,
   * calculando los puntajes en tiempo real y emitiendo una notificación clínica automática.
   */
  static async crearEncuesta(rawBody: any, usuarioId?: number | null) {
    // 1. Normalizar BHS (puede venir como array de booleans o como objeto con item1..item20)
    let bhsArray: boolean[] = []
    if (Array.isArray(rawBody.bhs)) {
      bhsArray = rawBody.bhs
    } else if (rawBody.bhs && typeof rawBody.bhs === 'object') {
      bhsArray = Array.from({ length: 20 }, (_, i) => !!rawBody.bhs[`item${i + 1}`] || !!rawBody.bhs[`item_${i + 1}`])
    }
    const bhsCalc = bhsArray.length > 0 ? calcularBHS(bhsArray) : null

    // 2. Normalizar Rosenberg (puede venir como array de números o como objeto)
    let rosenbergArray: number[] = []
    if (Array.isArray(rawBody.rosenberg)) {
      rosenbergArray = rawBody.rosenberg
    } else if (rawBody.rosenberg && typeof rawBody.rosenberg === 'object') {
      rosenbergArray = Array.from({ length: 10 }, (_, i) => Number(rawBody.rosenberg[`item${i + 1}`]) || 2)
    }
    const rosenbergCalc = rosenbergArray.length > 0
      ? calcularRosenberg({
          item1: rosenbergArray[0] || 2,
          item2: rosenbergArray[1] || 2,
          item3: rosenbergArray[2] || 2,
          item4: rosenbergArray[3] || 2,
          item5: rosenbergArray[4] || 2,
          item6: rosenbergArray[5] || 2,
          item7: rosenbergArray[6] || 2,
          item8: rosenbergArray[7] || 2,
          item9: rosenbergArray[8] || 2,
          item10: rosenbergArray[9] || 2,
        })
      : null

    // 3. Normalizar DASS-21 (puede venir como array de 21 números o como objeto)
    let dassArray: number[] = []
    if (Array.isArray(rawBody.dass21)) {
      dassArray = rawBody.dass21
    } else if (rawBody.dass21 && typeof rawBody.dass21 === 'object') {
      dassArray = Array.from({ length: 21 }, (_, i) => Number(rawBody.dass21[`item${i + 1}`]) || Number(rawBody.dass21[`item_${i + 1}`]) || 0)
    }
    const dass21Calc = dassArray.length > 0
      ? calcularDASS21({
          item1: dassArray[0] || 0, item2: dassArray[1] || 0, item3: dassArray[2] || 0,
          item4: dassArray[3] || 0, item5: dassArray[4] || 0, item6: dassArray[5] || 0,
          item7: dassArray[6] || 0, item8: dassArray[7] || 0, item9: dassArray[8] || 0,
          item10: dassArray[9] || 0, item11: dassArray[10] || 0, item12: dassArray[11] || 0,
          item13: dassArray[12] || 0, item14: dassArray[13] || 0, item15: dassArray[14] || 0,
          item16: dassArray[15] || 0, item17: dassArray[16] || 0, item18: dassArray[17] || 0,
          item19: dassArray[18] || 0, item20: dassArray[19] || 0, item21: dassArray[20] || 0,
        })
      : null

    // 4. PHQ-9 y C-SSRS
    const phq9Calc = rawBody.phq9 ? calcularPHQ9(rawBody.phq9) : null
    const cssrsCalc = rawBody.cssrs ? calcularCSSRS(rawBody.cssrs) : { nivelSeveridad: 'ninguna' as const }

    // 5. Factores Psicosociales, Salud y Relaciones
    const salud = rawBody.saludFisica || {}
    const socio = rawBody.socioeconomicos || {}
    const rel = rawBody.relaciones || {}
    const psico = rawBody.psicologicos || {}
    const hist = rawBody.historial || {}
    const eventos: string[] = Array.isArray(psico.eventos) ? psico.eventos : []

    // 6. Cálculo compuesto de riesgo
    const riesgoGlobal = calcularRiesgoGlobal({
      phq9: phq9Calc?.puntajeTotal || 0,
      bhs: bhsCalc?.puntajeTotal || 0,
      cssrs: cssrsCalc.nivelSeveridad,
      ideacionSuicidaPhq9: rawBody.phq9?.ideacionSuicida,
      intentoPrevio: rawBody.cssrs?.intentoPrevio || hist.numIntentosPrevios > 0,
      consumoSustancias: salud.consumeDrogas || ['frecuente', 'diario'].includes(salud.frecuenciaAlcohol),
      aislamientoSocial: rel.viveSolo || rel.numPersonasConfianza === 0 || psico.tieneRedApoyo === false,
      violenciaReciente:
        psico.violenciaFisica ||
        psico.violenciaPsicologica ||
        psico.abusoSexual ||
        eventos.includes('violencia_fisica') ||
        eventos.includes('violencia_psicologica') ||
        eventos.includes('abuso_sexual') ||
        eventos.includes('bullying'),
      perdidaReciente:
        psico.perdidaFamiliarReciente ||
        eventos.includes('perdida_familiar') ||
        eventos.includes('ruptura_pareja') ||
        eventos.includes('desempleo'),
    })

    const edad = Number(rawBody.edad) || 25
    const sexo = String(rawBody.sexo || 'otro')

    // Validar si el usuarioId realmente existe en la base de datos para evitar errores de Foreign Key
    let validUsuarioId: number | null = null
    if (usuarioId) {
      try {
        const userExists = await prisma.usuario.findUnique({
          where: { id: usuarioId },
          select: { id: true }
        })
        if (userExists) validUsuarioId = userExists.id
      } catch {
        validUsuarioId = null
      }
    }

    // 7. Inserción atómica en base de datos
    const encuestaCreada = await prisma.encuesta.create({
      data: {
        usuarioId: validUsuarioId,
        nombre: rawBody.nombre ? String(rawBody.nombre).trim() : null,
        apellido: rawBody.apellido ? String(rawBody.apellido).trim() : null,
        edad,
        sexo,
        estadoCivil: rawBody.estadoCivil || null,
        nivelEducativo: rawBody.nivelEducativo || null,
        ocupacion: rawBody.ocupacion || null,
        ingresoMensual: rawBody.ingresoMensual || null,
        zonaResidencia: rawBody.zonaResidencia || null,
        estadoUsuario: rawBody.estadoUsuario || 'vivo',

        // PHQ-9
        ...(rawBody.phq9 && phq9Calc && {
          phq9: {
            create: {
              interesActividades: Number(rawBody.phq9.interesActividades) || 0,
              estadoAnimo: Number(rawBody.phq9.estadoAnimo) || 0,
              sueno: Number(rawBody.phq9.sueno) || 0,
              energia: Number(rawBody.phq9.energia) || 0,
              apetito: Number(rawBody.phq9.apetito) || 0,
              autoestima: Number(rawBody.phq9.autoestima) || 0,
              concentracion: Number(rawBody.phq9.concentracion) || 0,
              psicomotricidad: Number(rawBody.phq9.psicomotricidad) || 0,
              ideacionSuicida: Number(rawBody.phq9.ideacionSuicida) || 0,
              dificultadFuncionamiento: Number(rawBody.phq9.dificultadFuncionamiento) || 0,
              puntajeTotal: phq9Calc.puntajeTotal,
              nivelGravedad: phq9Calc.nivelGravedad,
            },
          },
        }),

        // C-SSRS
        ...(rawBody.cssrs && {
          cssrs: {
            create: {
              deseosMorir: !!rawBody.cssrs.deseosMorir,
              pensamientosSuicidas: !!rawBody.cssrs.pensamientosSuicidas,
              metodoSinPlan: !!rawBody.cssrs.metodoSinPlan,
              intencionSinPlan: !!rawBody.cssrs.intencionSinPlan,
              planEspecifico: !!rawBody.cssrs.planEspecifico,
              intencionEjecutar: !!rawBody.cssrs.intencionEjecutar,
              intentoPrevio: !!rawBody.cssrs.intentoPrevio,
              nivelSeveridad: cssrsCalc.nivelSeveridad,
            },
          },
        }),

        // BHS
        ...(bhsArray.length > 0 && bhsCalc && {
          bhs: {
            create: {
              item1: !!bhsArray[0], item2: !!bhsArray[1], item3: !!bhsArray[2], item4: !!bhsArray[3], item5: !!bhsArray[4],
              item6: !!bhsArray[5], item7: !!bhsArray[6], item8: !!bhsArray[7], item9: !!bhsArray[8], item10: !!bhsArray[9],
              item11: !!bhsArray[10], item12: !!bhsArray[11], item13: !!bhsArray[12], item14: !!bhsArray[13], item15: !!bhsArray[14],
              item16: !!bhsArray[15], item17: !!bhsArray[16], item18: !!bhsArray[17], item19: !!bhsArray[18], item20: !!bhsArray[19],
              puntajeTotal: bhsCalc.puntajeTotal,
              nivelRiesgo: bhsCalc.nivelRiesgo,
            },
          },
        }),

        // Rosenberg
        ...(rosenbergArray.length > 0 && {
          rosenberg: {
            create: {
              item1: rosenbergArray[0] || 2,
              item2: rosenbergArray[1] || 2,
              item3: rosenbergArray[2] || 2,
              item4: rosenbergArray[3] || 2,
              item5: rosenbergArray[4] || 2,
              item6: rosenbergArray[5] || 2,
              item7: rosenbergArray[6] || 2,
              item8: rosenbergArray[7] || 2,
              item9: rosenbergArray[8] || 2,
              item10: rosenbergArray[9] || 2,
            },
          },
        }),

        // DASS-21
        ...(dassArray.length > 0 && dass21Calc && {
          dass21: {
            create: {
              item1: dassArray[0] || 0, item2: dassArray[1] || 0, item3: dassArray[2] || 0,
              item4: dassArray[3] || 0, item5: dassArray[4] || 0, item6: dassArray[5] || 0,
              item7: dassArray[6] || 0, item8: dassArray[7] || 0, item9: dassArray[8] || 0,
              item10: dassArray[9] || 0, item11: dassArray[10] || 0, item12: dassArray[11] || 0,
              item13: dassArray[12] || 0, item14: dassArray[13] || 0, item15: dassArray[14] || 0,
              item16: dassArray[15] || 0, item17: dassArray[16] || 0, item18: dassArray[17] || 0,
              item19: dassArray[18] || 0, item20: dassArray[19] || 0, item21: dassArray[20] || 0,
              puntajeEstres: dass21Calc.puntajeEstres,
              puntajeAnsiedad: dass21Calc.puntajeAnsiedad,
              puntajeDepresion: dass21Calc.puntajeDepresion,
            },
          },
        }),

        // Socioeconómicos y Relaciones
        ...((rawBody.socioeconomicos || rawBody.relaciones) && {
          socioeconomicos: {
            create: {
              estadoLaboral: socio.estadoLaboral || null,
              satisfaccionLaboral: Number.isFinite(Number(socio.satisfaccionLaboral)) ? Number(socio.satisfaccionLaboral) : null,
              estresLaboral: Number.isFinite(Number(socio.estresLaboral)) ? Number(socio.estresLaboral) : null,
              nivelDeudas: socio.nivelDeudas || null,
              dificultadEconomica: socio.dificultadEconomica !== undefined ? Boolean(socio.dificultadEconomica) : null,
              calidadRelacionesFamiliares: Number.isFinite(Number(rel.calidadRelacionesFamiliares)) ? Number(rel.calidadRelacionesFamiliares) : null,
              calidadRelacionesPareja: Number.isFinite(Number(rel.calidadRelacionesPareja)) ? Number(rel.calidadRelacionesPareja) : null,
              apoyoSocialPercibido: Number.isFinite(Number(rel.apoyoSocialPercibido)) ? Number(rel.apoyoSocialPercibido) : null,
              numPersonasConfianza: Number.isFinite(Number(rel.numPersonasConfianza)) ? Number(rel.numPersonasConfianza) : null,
              viveSolo: rel.viveSolo !== undefined ? Boolean(rel.viveSolo) : null,
              tipoVivienda: socio.tipoVivienda || null,
              calidadVivienda: Number.isFinite(Number(socio.calidadVivienda)) ? Number(socio.calidadVivienda) : null,
            },
          },
        }),

        // Salud Física
        ...(rawBody.saludFisica && {
          saludFisica: {
            create: {
              enfermedadCronica: Boolean(salud.enfermedadCronica),
              dolorCronico: Boolean(salud.dolorCronico),
              calidadSueno: Number.isFinite(Number(salud.calidadSueno)) ? Number(salud.calidadSueno) : 3,
              horasSuenoPromedio: Number.isFinite(Number(salud.horasSuenoPromedio)) ? Number(salud.horasSuenoPromedio) : null,
              insomnio: Boolean(salud.insomnio),
              consumeAlcohol: Boolean(salud.consumeAlcohol),
              frecuenciaAlcohol: salud.frecuenciaAlcohol || 'nunca',
              consumeTabaco: Boolean(salud.consumeTabaco),
              frecuenciaTabaco: salud.frecuenciaTabaco || 'nunca',
              consumeDrogas: Boolean(salud.consumeDrogas),
              tipoDrogas: salud.tipoDrogas || null,
            },
          },
        }),

        // Factores Psicológicos
        ...((rawBody.psicologicos || rawBody.relaciones) && {
          psicologicos: {
            create: {
              tieneRedApoyo: Boolean(psico.tieneRedApoyo ?? rel.tieneRedApoyo ?? true),
              percibeVidaConSentido: Boolean(psico.percibeVidaConSentido ?? true),
              haBuscadoAyudaProfesional: Boolean(psico.haBuscadoAyudaProfesional ?? false),
              perdidaFamiliarReciente: Boolean(psico.perdidaFamiliarReciente || eventos.includes('perdida_familiar')),
              violenciaFisica: Boolean(psico.violenciaFisica || eventos.includes('violencia_fisica')),
              violenciaPsicologica: Boolean(psico.violenciaPsicologica || eventos.includes('violencia_psicologica')),
              abusoSexual: Boolean(psico.abusoSexual || eventos.includes('abuso_sexual')),
              bullying: Boolean(psico.bullying || eventos.includes('bullying')),
              desempleoReciente: Boolean(psico.desempleoReciente || eventos.includes('desempleo')),
              ruptureParejaReciente: Boolean(psico.ruptureParejaReciente || eventos.includes('ruptura_pareja')),
              problemaLegalReciente: Boolean(psico.problemaLegalReciente || eventos.includes('problemas_legales')),
            },
          },
        }),

        // Notificación de triaje automático para el equipo clínico
        notificaciones: {
          create: {
            tipoRiesgo: riesgoGlobal.nivelRiesgo,
            titulo: `Alerta ${riesgoGlobal.prioridadAlerta.toUpperCase()}: ${rawBody.nombre ? `${rawBody.nombre} ${rawBody.apellido || ''}`.trim() : 'Paciente'} (${edad} años, ${sexo})`,
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
   * Lista encuestas con paginación y búsqueda
   */
  static async listarEncuestas(params: {
    page?: number
    limit?: number
    nivelRiesgo?: string
    busqueda?: string
  }) {
    const page = Math.max(1, params.page || 1)
    const limit = Math.min(100, Math.max(5, params.limit || 20))
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (params.busqueda) {
      const searchNumber = parseInt(params.busqueda, 10)
      where.OR = [
        ...(isNaN(searchNumber) ? [] : [{ id: searchNumber }]),
        { nombre: { contains: params.busqueda, mode: 'insensitive' } },
        { apellido: { contains: params.busqueda, mode: 'insensitive' } },
        { ocupacion: { contains: params.busqueda, mode: 'insensitive' } },
      ]
    }

    const [total, encuestas] = await Promise.all([
      prisma.encuesta.count({ where }),
      prisma.encuesta.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
