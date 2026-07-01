import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)

    const encuesta = await prisma.encuesta.findUnique({
      where: { id },
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

    if (!encuesta) {
      return NextResponse.json(
        { error: "Encuesta no encontrada" },
        { status: 404 }
      )
    }

    // Unwrap arrays: phq9, cssrs, bhs, rosenberg, dass21 are one-to-many in schema
    // but we always create exactly one per encuesta
    const result = {
      ...encuesta,
      phq9: encuesta.phq9?.[0] || null,
      cssrs: encuesta.cssrs?.[0] || null,
      bhs: encuesta.bhs?.[0] || null,
      rosenberg: encuesta.rosenberg?.[0] || null,
      dass21: encuesta.dass21?.[0] || null,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Error al obtener la encuesta" },
      { status: 500 }
    )
  }
}
