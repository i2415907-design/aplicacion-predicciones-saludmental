import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calcularPHQ9, calcularCSSRS, calcularBHS, calcularRiesgoGlobal } from "@/lib/calculos"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Calcular escalas
    const phq9 = body.phq9 ? calcularPHQ9(body.phq9) : null
    const cssrs = body.cssrs ? calcularCSSRS(body.cssrs) : null
    const bhs = body.bhs ? calcularBHS(body.bhs) : null

    // Crear encuesta con todas las relaciones
    const encuesta = await prisma.encuesta.create({
      data: {
        usuarioId: body.usuarioId || null,
        nombre: body.nombre || null,
        apellido: body.apellido || null,
        edad: body.edad,
        sexo: body.sexo,
        estadoCivil: body.estadoCivil || null,
        nivelEducativo: body.nivelEducativo || null,
        ocupacion: body.ocupacion || null,
        ingresoMensual: body.ingresoMensual || null,
        zonaResidencia: body.zonaResidencia || null,
        estadoUsuario: body.estadoUsuario || "vivo",

        // PHQ-9
        ...(body.phq9 && {
          phq9: {
            create: {
              interesActividades: body.phq9.interesActividades,
              estadoAnimo: body.phq9.estadoAnimo,
              sueno: body.phq9.sueno,
              energia: body.phq9.energia,
              apetito: body.phq9.apetito,
              autoestima: body.phq9.autoestima,
              concentracion: body.phq9.concentracion,
              psicomotricidad: body.phq9.psicomotricidad,
              ideacionSuicida: body.phq9.ideacionSuicida,
              dificultadFuncionamiento: body.phq9.dificultadFuncionamiento,
              puntajeTotal: phq9?.puntajeTotal || 0,
              nivelGravedad: phq9?.nivelGravedad || "minimo",
            },
          },
        }),

        // C-SSRS
        ...(body.cssrs && {
          cssrs: {
            create: {
              deseosMorir: body.cssrs.deseosMorir,
              pensamientosSuicidas: body.cssrs.pensamientosSuicidas,
              metodoSinPlan: body.cssrs.metodoSinPlan,
              intencionSinPlan: body.cssrs.intencionSinPlan,
              planEspecifico: body.cssrs.planEspecifico,
              intencionEjecutar: body.cssrs.intencionEjecutar,
              intentoPrevio: body.cssrs.intentoPrevio,
              nivelSeveridad: cssrs?.nivelSeveridad || "ideacion",
            },
          },
        }),

        // BHS
        ...(body.bhs && {
          bhs: {
            create: {
              item1: body.bhs[0],
              item2: body.bhs[1],
              item3: body.bhs[2],
              item4: body.bhs[3],
              item5: body.bhs[4],
              item6: body.bhs[5],
              item7: body.bhs[6],
              item8: body.bhs[7],
              item9: body.bhs[8],
              item10: body.bhs[9],
              item11: body.bhs[10],
              item12: body.bhs[11],
              item13: body.bhs[12],
              item14: body.bhs[13],
              item15: body.bhs[14],
              item16: body.bhs[15],
              item17: body.bhs[16],
              item18: body.bhs[17],
              item19: body.bhs[18],
              item20: body.bhs[19],
              puntajeTotal: bhs?.puntajeTotal || 0,
              nivelRiesgo: bhs?.nivelRiesgo || "bajo",
            },
          },
        }),

        // Rosenberg
        ...(body.rosenberg && {
          rosenberg: {
            create: {
              item1: body.rosenberg[0],
              item2: body.rosenberg[1],
              item3: body.rosenberg[2],
              item4: body.rosenberg[3],
              item5: body.rosenberg[4],
              item6: body.rosenberg[5],
              item7: body.rosenberg[6],
              item8: body.rosenberg[7],
              item9: body.rosenberg[8],
              item10: body.rosenberg[9],
            },
          },
        }),

        // DASS-21
        ...(body.dass21 && {
          dass21: {
            create: {
              item1: body.dass21[0],
              item2: body.dass21[1],
              item3: body.dass21[2],
              item4: body.dass21[3],
              item5: body.dass21[4],
              item6: body.dass21[5],
              item7: body.dass21[6],
              item8: body.dass21[7],
              item9: body.dass21[8],
              item10: body.dass21[9],
              item11: body.dass21[10],
              item12: body.dass21[11],
              item13: body.dass21[12],
              item14: body.dass21[13],
              item15: body.dass21[14],
              item16: body.dass21[15],
              item17: body.dass21[16],
              item18: body.dass21[17],
              item19: body.dass21[18],
              item20: body.dass21[19],
              item21: body.dass21[20],
              puntajeEstres: (body.dass21[0] + body.dass21[5] + body.dass21[7] + body.dass21[10] + body.dass21[11] + body.dass21[13] + body.dass21[17]) * 2,
              puntajeAnsiedad: (body.dass21[1] + body.dass21[3] + body.dass21[6] + body.dass21[8] + body.dass21[14] + body.dass21[18] + body.dass21[19]) * 2,
              puntajeDepresion: (body.dass21[2] + body.dass21[4] + body.dass21[9] + body.dass21[12] + body.dass21[15] + body.dass21[16] + body.dass21[20]) * 2,
            },
          },
        }),

        // Factores Socioeconómicos
        ...(body.socioeconomicos && {
          socioeconomicos: {
            create: {
              estadoLaboral: body.socioeconomicos.estadoLaboral,
              satisfaccionLaboral: body.socioeconomicos.satisfaccionLaboral,
              estresLaboral: body.socioeconomicos.estresLaboral,
              nivelDeudas: body.socioeconomicos.nivelDeudas,
              dificultadEconomica: body.socioeconomicos.dificultadEconomica,
              calidadVivienda: body.socioeconomicos.calidadVivienda,
            },
          },
        }),

        // Relaciones
        ...(body.relaciones && {
          psicologicos: {
            create: {
              tieneRedApoyo: body.relaciones.tieneRedApoyo,
              percibeVidaConSentido: true,
              // Mapear eventos
              perdidaFamiliarReciente: body.psicologicos?.eventos?.includes("perdida_familiar") || false,
              violenciaFisica: body.psicologicos?.eventos?.includes("violencia_fisica") || false,
              violenciaPsicologica: body.psicologicos?.eventos?.includes("violencia_psicologica") || false,
              abusoSexual: body.psicologicos?.eventos?.includes("abuso_sexual") || false,
              bullying: body.psicologicos?.eventos?.includes("bullying") || false,
              desempleoReciente: body.psicologicos?.eventos?.includes("desempleo") || false,
              ruptureParejaReciente: body.psicologicos?.eventos?.includes("ruptura_pareja") || false,
              problemaLegalReciente: body.psicologicos?.eventos?.includes("problemas_legales") || false,
              haBuscadoAyudaProfesional: body.psicologicos?.haBuscadoAyudaProfesional || false,
            },
          },
        }),

        // Salud Física
        ...(body.saludFisica && {
          saludFisica: {
            create: {
              enfermedadCronica: body.saludFisica.enfermedadCronica,
              dolorCronico: body.saludFisica.dolorCronico,
              calidadSueno: body.saludFisica.calidadSueno,
              horasSuenoPromedio: body.saludFisica.horasSuenoPromedio,
              insomnio: body.saludFisica.insomnio,
              consumeAlcohol: body.saludFisica.consumeAlcohol,
              frecuenciaAlcohol: body.saludFisica.frecuenciaAlcohol,
              consumeTabaco: body.saludFisica.consumeTabaco,
              frecuenciaTabaco: body.saludFisica.frecuenciaTabaco,
              consumeDrogas: body.saludFisica.consumeDrogas,
              tipoDrogas: body.saludFisica.tipoDrogas,
            },
          },
        }),
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
      },
    })

    // Calculate global risk level
    const riesgoGlobal = calcularRiesgoGlobal({
      phq9: phq9?.puntajeTotal || 0,
      bhs: bhs?.puntajeTotal || 0,
      cssrs: cssrs?.nivelSeveridad || 'sin_ideacion',
      desesperanza: (bhs?.puntajeTotal || 0) >= 10,
      ideacionSuicida: body.phq9?.ideacionSuicida || 0,
      intentoPrevio: body.cssrs?.intentoPrevio || false,
      consumoSustancias: body.saludFisica?.consumeDrogas || body.saludFisica?.consumeAlcohol || false,
      aislamientoSocial: body.relaciones?.viveSolo || (body.relaciones?.numPersonasConfianza || 0) === 0
    })

    // Generate notification based on risk level
    const nombrePaciente = body.nombre || 'Anónimo'
    const apellidoPaciente = body.apellido || ''
    const nombreCompleto = `${nombrePaciente} ${apellidoPaciente}`.trim()

    let notifTitle = ''
    let notifDescription = ''
    let notifAction = ''

    switch (riesgoGlobal.nivelRiesgo) {
      case 'muy_alto':
        notifTitle = `⚠️ RIESGO CRÍTICO: ${nombreCompleto}`
        notifDescription = `Paciente con nivel de riesgo MUY ALTO. PHQ-9: ${phq9?.puntajeTotal || 0}, C-SSRS: ${cssrs?.nivelSeveridad || 'sin_ideacion'}. Requiere intervención inmediata.`
        notifAction = 'Contactar al paciente inmediatamente. Considerar derivación a servicios de emergencia.'
        break
      case 'alto':
        notifTitle = `🔴 Riesgo Alto: ${nombreCompleto}`
        notifDescription = `Paciente con nivel de riesgo ALTO. PHQ-9: ${phq9?.puntajeTotal || 0}, C-SSRS: ${cssrs?.nivelSeveridad || 'sin_ideacion'}.`
        notifAction = 'Programar cita de seguimiento dentro de 48 horas.'
        break
      case 'moderado':
        notifTitle = `🟡 Riesgo Moderado: ${nombreCompleto}`
        notifDescription = `Paciente con nivel de riesgo MODERADO. PHQ-9: ${phq9?.puntajeTotal || 0}.`
        notifAction = 'Seguimiento semanal recomendado.'
        break
      default:
        notifTitle = `✅ Riesgo Bajo: ${nombreCompleto}`
        notifDescription = `Paciente con nivel de riesgo BAJO. PHQ-9: ${phq9?.puntajeTotal || 0}.`
        notifAction = 'Continuar monitoreo de rutina.'
    }

    // Create notification
    await prisma.notificacion.create({
      data: {
        encuestaId: encuesta.id,
        tipoRiesgo: riesgoGlobal.nivelRiesgo,
        titulo: notifTitle,
        descripcion: notifDescription,
        accionRequerida: notifAction
      }
    })

    // Unwrap array relations (one-to-many in schema but only one created per encuesta)
    const result = {
      ...encuesta,
      phq9: encuesta.phq9?.[0] || null,
      cssrs: encuesta.cssrs?.[0] || null,
      bhs: encuesta.bhs?.[0] || null,
      rosenberg: encuesta.rosenberg?.[0] || null,
      dass21: encuesta.dass21?.[0] || null,
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error al crear encuesta:", error)
    return NextResponse.json(
      { error: "Error al crear la encuesta" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const [encuestas, total] = await Promise.all([
      prisma.encuesta.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          phq9: { select: { puntajeTotal: true, nivelGravedad: true } },
          cssrs: { select: { nivelSeveridad: true } },
          bhs: { select: { puntajeTotal: true, nivelRiesgo: true } },
        },
      }),
      prisma.encuesta.count(),
    ])

    // Unwrap array relations for each encuesta
    const encuestasUnwrapped = encuestas.map(encuesta => ({
      ...encuesta,
      phq9: encuesta.phq9?.[0] || null,
      cssrs: encuesta.cssrs?.[0] || null,
      bhs: encuesta.bhs?.[0] || null,
    }))

    return NextResponse.json({
      encuestas: encuestasUnwrapped,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error al obtener encuestas:", error)
    return NextResponse.json(
      { error: "Error al obtener las encuestas" },
      { status: 500 }
    )
  }
}
