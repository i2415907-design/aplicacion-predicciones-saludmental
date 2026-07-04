import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calcularRiesgoGlobal } from '@/lib/calculos'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const riesgo = searchParams.get('riesgo') || ''
    const categoriaId = searchParams.get('categoriaId') || ''
    const soloArchivadas = searchParams.get('soloArchivadas') === 'true'
    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { nombre: { contains: search } },
        { apellido: { contains: search } },
        { usuario: { alias: { contains: search } } }
      ]
    }

    if (categoriaId) {
      where.casosArchivados = {
        some: { categoriaId: parseInt(categoriaId) }
      }
    }

    if (soloArchivadas) {
      where.casosArchivados = { ...where.casosArchivados as object, some: {} }
    }

    const [encuestas, total] = await Promise.all([
      prisma.encuesta.findMany({
        where,
        include: {
          usuario: {
            select: { alias: true }
          },
          phq9: {
            select: { puntajeTotal: true, nivelGravedad: true, ideacionSuicida: true }
          },
          cssrs: {
            select: { nivelSeveridad: true, intentoPrevio: true }
          },
          bhs: {
            select: { puntajeTotal: true, nivelRiesgo: true }
          },
          saludFisica: {
            select: { consumeAlcohol: true, frecuenciaAlcohol: true, consumeDrogas: true }
          },
          socioeconomicos: {
            select: { viveSolo: true, numPersonasConfianza: true }
          },
          notificaciones: {
            select: { tipoRiesgo: true },
            orderBy: { fechaCreacion: 'desc' },
            take: 1
          },
          casosArchivados: {
            select: {
              id: true,
              categoria: { select: { id: true, nombre: true, color: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.encuesta.count({ where })
    ])

    // Calculate risk level for each encuesta
    const encuestasConRiesgo = encuestas.map(encuesta => {
      // Use notification's tipoRiesgo if available (most accurate)
      const notifRiesgo = encuesta.notificaciones?.[0]?.tipoRiesgo

      // Also calculate for display
      const consumeSustancias = encuesta.saludFisica?.consumeDrogas ||
        (encuesta.saludFisica?.consumeAlcohol && ['frecuente', 'diario'].includes(encuesta.saludFisica?.frecuenciaAlcohol || ''))
      const aislamiento = encuesta.socioeconomicos?.viveSolo ||
        (encuesta.socioeconomicos?.numPersonasConfianza || 0) === 0

      const riesgoCalc = calcularRiesgoGlobal({
        phq9: encuesta.phq9?.[0]?.puntajeTotal || 0,
        bhs: encuesta.bhs?.[0]?.puntajeTotal || 0,
        cssrs: encuesta.cssrs?.[0]?.nivelSeveridad || 'sin_ideacion',
        desesperanza: (encuesta.bhs?.[0]?.puntajeTotal || 0) >= 10,
        ideacionSuicida: encuesta.phq9?.[0]?.ideacionSuicida || 0,
        intentoPrevio: encuesta.cssrs?.[0]?.intentoPrevio || false,
        consumoSustancias: consumeSustancias || false,
        aislamientoSocial: aislamiento
      })

      // Prefer notification's risk level (stored at creation time)
      const nivelRiesgo = notifRiesgo || riesgoCalc.nivelRiesgo

      return {
        id: encuesta.id,
        nombre: encuesta.nombre,
        apellido: encuesta.apellido,
        edad: encuesta.edad,
        sexo: encuesta.sexo,
        fechaCreacion: encuesta.createdAt,
        usuario: encuesta.usuario?.alias || 'Anónimo',
        phq9: encuesta.phq9?.[0]?.puntajeTotal || 0,
        nivelDepresion: encuesta.phq9?.[0]?.nivelGravedad || 'minimo',
        nivelIdeacion: encuesta.cssrs?.[0]?.nivelSeveridad || 'sin_ideacion',
        nivelDesesperanza: encuesta.bhs?.[0]?.nivelRiesgo || 'bajo',
        nivelRiesgo,
        categorias: encuesta.casosArchivados.map(ca => ({
          id: ca.categoria.id,
          nombre: ca.categoria.nombre,
          color: ca.categoria.color,
          casoId: ca.id,
        })),
      }
    })

    // Filter by risk level if specified
    let filteredEncuestas = encuestasConRiesgo
    if (riesgo) {
      filteredEncuestas = encuestasConRiesgo.filter(e => e.nivelRiesgo === riesgo)
    }

    return NextResponse.json({
      encuestas: filteredEncuestas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching encuestas:', error)
    return NextResponse.json(
      { error: 'Error al obtener encuestas' },
      { status: 500 }
    )
  }
}
