import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categorias = await prisma.categoriasCasos.findMany({
      orderBy: { nombre: "asc" },
    })
    return NextResponse.json({ categorias })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error al obtener categorias" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, descripcion, color, icono } = body

    if (!nombre) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 })
    }

    const categoria = await prisma.categoriasCasos.create({
      data: { nombre, descripcion, color, icono },
    })

    return NextResponse.json(categoria, { status: 201 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error al crear categoria" }, { status: 500 })
  }
}
