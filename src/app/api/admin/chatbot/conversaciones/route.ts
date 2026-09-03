import { NextRequest, NextResponse } from 'next/server'
import { ChatService } from '@/services/chat.service'

export async function GET() {
  try {
    const sesiones = await ChatService.listarSesiones()
    return NextResponse.json({ conversaciones: sesiones })
  } catch (error) {
    console.error('[API Conversaciones] Error al listar:', error)
    return NextResponse.json(
      { error: 'Error al listar conversaciones' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { encuestaId, titulo } = body

    const sesion = await ChatService.crearSesion(encuestaId, titulo)
    return NextResponse.json({ conversacion: sesion })
  } catch (error) {
    console.error('[API Conversaciones] Error al crear:', error)
    return NextResponse.json(
      { error: 'Error al crear conversación' },
      { status: 500 }
    )
  }
}
