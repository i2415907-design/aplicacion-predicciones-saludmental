import { NextRequest, NextResponse } from 'next/server'
import { ChatService } from '@/services/chat.service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sesionId = Number(id)

    if (isNaN(sesionId)) {
      return NextResponse.json({ error: 'ID de sesión inválido' }, { status: 400 })
    }

    const mensajes = await ChatService.cargarMensajes(sesionId)
    return NextResponse.json({ mensajes })
  } catch (error) {
    console.error('[API Conversación ID] Error al cargar mensajes:', error)
    return NextResponse.json(
      { error: 'Error al cargar mensajes' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sesionId = Number(id)

    if (isNaN(sesionId)) {
      return NextResponse.json({ error: 'ID de sesión inválido' }, { status: 400 })
    }

    await ChatService.eliminarSesion(sesionId)
    return NextResponse.json({ success: true, message: 'Conversación eliminada' })
  } catch (error) {
    console.error('[API Conversación ID] Error al eliminar:', error)
    return NextResponse.json(
      { error: 'Error al eliminar conversación' },
      { status: 500 }
    )
  }
}
