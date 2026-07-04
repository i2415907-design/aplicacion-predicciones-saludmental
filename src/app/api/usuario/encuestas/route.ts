import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const usuarioId = session.id

    if (!usuarioId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const encuestas = await prisma.encuesta.findMany({
      where: { usuarioId },
      orderBy: { createdAt: "desc" },
      include: {
        phq9: { select: { puntajeTotal: true, nivelGravedad: true } },
        cssrs: { select: { nivelSeveridad: true } },
        bhs: { select: { puntajeTotal: true, nivelRiesgo: true } },
        notificaciones: { select: { tipoRiesgo: true } },
      },
    })

    const encuestasUnwrapped = encuestas.map((e) => {
      const notif = e.notificaciones?.[0]
      return {
        id: e.id,
        nombre: e.nombre,
        apellido: e.apellido,
        edad: e.edad,
        sexo: e.sexo,
        fechaCreacion: e.createdAt,
        phq9: e.phq9?.[0]?.puntajeTotal || 0,
        nivelDepresion: e.phq9?.[0]?.nivelGravedad || "minimo",
        nivelRiesgo: notif?.tipoRiesgo || "bajo",
        cssrsNivel: e.cssrs?.[0]?.nivelSeveridad || "ideacion",
        bhsNivel: e.bhs?.[0]?.nivelRiesgo || "bajo",
      }
    })

    return NextResponse.json({ encuestas: encuestasUnwrapped })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error al obtener encuestas" }, { status: 500 })
  }
}
