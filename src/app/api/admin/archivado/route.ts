import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const encuestaId = searchParams.get("encuestaId")

    const where = encuestaId ? { encuestaId: parseInt(encuestaId) } : {}

    const casos = await prisma.casosArchivados.findMany({
      where,
      include: {
        categoria: true,
        encuesta: {
          select: { id: true, nombre: true, apellido: true, edad: true, sexo: true },
        },
      },
      orderBy: { fechaArchivo: "desc" },
    })

    return NextResponse.json({ casos })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error al obtener casos archivados" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { encuestaId, categoriaId, notas, archivadoPor } = body

    if (!encuestaId || !categoriaId) {
      return NextResponse.json({ error: "encuestaId y categoriaId son requeridos" }, { status: 400 })
    }

    const caso = await prisma.casosArchivados.upsert({
      where: {
        encuestaId_categoriaId: { encuestaId, categoriaId },
      },
      update: { notas, archivadoPor },
      create: { encuestaId, categoriaId, notas, archivadoPor },
      include: { categoria: true },
    })

    return NextResponse.json(caso, { status: 201 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error al archivar caso" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 })
    }

    await prisma.casosArchivados.delete({ where: { id: parseInt(id) } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}
