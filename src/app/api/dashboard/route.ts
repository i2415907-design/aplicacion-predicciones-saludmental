import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const totalEncuestas = await prisma.encuesta.count()

    const encuestasMes = await prisma.encuesta.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    })

    const phq9Avg = await prisma.phq9Respuesta.aggregate({
      _avg: { puntajeTotal: true },
    })
    const promedioPHQ9 = phq9Avg._avg.puntajeTotal || 0

    const cssrsGroup = await prisma.cssrsRespuesta.groupBy({
      by: ["nivelSeveridad"],
      _count: true,
    })
    const distribucionRiesgo: Record<string, number> = {
      ideacion: 0,
      planificacion: 0,
      intento_no_letal: 0,
      intento_letal: 0,
    }
    cssrsGroup.forEach((g) => {
      if (distribucionRiesgo.hasOwnProperty(g.nivelSeveridad)) {
        distribucionRiesgo[g.nivelSeveridad] = g._count
      }
    })

    const totalFallecidos = await prisma.encuesta.count({
      where: { estadoUsuario: "fallecido" },
    })
    const fallecimientosVoluntarios = await prisma.encuesta.count({
      where: { estadoUsuario: "fallecido", fallecimientoVoluntario: true },
    })

    const sexoGroup = await prisma.encuesta.groupBy({
      by: ["sexo"],
      _count: true,
    })
    const distribucionSexo = sexoGroup.map((g) => ({
      sexo: g.sexo,
      _count: g._count,
    }))

    // Use Prisma raw SQL with correct column names (mapped from @map)
    const distribucionEdad = await prisma.$queryRaw`
      SELECT
        CASE
          WHEN edad BETWEEN 10 AND 17 THEN '10-17'
          WHEN edad BETWEEN 18 AND 25 THEN '18-25'
          WHEN edad BETWEEN 26 AND 35 THEN '26-35'
          WHEN edad BETWEEN 36 AND 45 THEN '36-45'
          WHEN edad BETWEEN 46 AND 55 THEN '46-55'
          WHEN edad BETWEEN 56 AND 65 THEN '56-65'
          ELSE '65+'
        END as rango,
        COUNT(*) as cantidad
      FROM encuestas
      GROUP BY rango
      ORDER BY rango
    ` as { rango: string; cantidad: bigint }[]

    const distribucionEdadFormatted = distribucionEdad.map((d) => ({
      rango: d.rango,
      cantidad: Number(d.cantidad),
    }))

    return NextResponse.json({
      totalEncuestas,
      encuestasUltimoMes: encuestasMes,
      promedioPHQ9: Math.round(promedioPHQ9 * 100) / 100,
      distribucionRiesgo,
      totalFallecidos,
      fallecimientosVoluntarios,
      distribucionEdad: distribucionEdadFormatted,
      distribucionSexo,
    })
  } catch (error) {
    console.error("Error en dashboard:", error)
    return NextResponse.json(
      { error: "Error al obtener datos", details: String(error) },
      { status: 500 }
    )
  }
}
