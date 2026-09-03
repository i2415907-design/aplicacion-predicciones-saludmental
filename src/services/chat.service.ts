import { prisma } from '@/lib/prisma'
import { ChatMessage } from '@/lib/ai/vertex-provider'

export interface MensajeGuardado {
  id: number
  sesionId: number
  rol: 'user' | 'assistant'
  contenido: string
  contextoDatos?: Record<string, unknown> | null
  fechaMensaje: Date
}

export class ChatService {
  /**
   * Crea una nueva sesión de conversación
   */
  public static async crearSesion(encuestaId?: number, titulo?: string) {
    return prisma.chatSesion.create({
      data: {
        encuestaId: encuestaId || null,
        titulo: titulo || 'Nueva consulta clínica',
      },
    })
  }

  /**
   * Lista las conversaciones recientes del administrador
   */
  public static async listarSesiones(limite = 25) {
    return prisma.chatSesion.findMany({
      orderBy: { fechaInicio: 'desc' },
      take: limite,
      include: {
        _count: {
          select: { mensajes: true },
        },
      },
    })
  }

  /**
   * Elimina una sesión y sus mensajes asociados
   */
  public static async eliminarSesion(sesionId: number) {
    return prisma.chatSesion.delete({
      where: { id: Number(sesionId) },
    })
  }

  /**
   * Obtiene o crea una sesión por defecto
   */
  public static async obtenerOCrearSesion(sesionId?: number, encuestaId?: number) {
    if (sesionId) {
      const encontrada = await prisma.chatSesion.findUnique({
        where: { id: Number(sesionId) },
      })
      if (encontrada) return encontrada
    }

    return this.crearSesion(encuestaId)
  }

  /**
   * Carga los mensajes de una sesión con su texto completo
   */
  public static async cargarMensajes(sesionId: number): Promise<MensajeGuardado[]> {
    const mensajesDb = await prisma.chatMensaje.findMany({
      where: { sesionId: Number(sesionId) },
      orderBy: { fechaMensaje: 'asc' },
    })

    return mensajesDb.map((m) => {
      // Recuperar el texto íntegro desde contexto_datos o fallback a contenido
      const ctx = m.contextoDatos as Record<string, unknown> | null
      const textoCompleto =
        (ctx?.texto_completo as string) || m.contenido

      return {
        id: m.id,
        sesionId: m.sesionId,
        rol: m.rol === 'usuario' || m.rol === 'user' ? 'user' : 'assistant',
        contenido: textoCompleto,
        contextoDatos: ctx,
        fechaMensaje: m.fechaMensaje,
      }
    })
  }

  /**
   * Obtiene el historial formateado para el contexto del LLM (últimos N mensajes)
   */
  public static async obtenerHistorialParaLLM(
    sesionId: number,
    limite = 6
  ): Promise<ChatMessage[]> {
    const ultimos = await prisma.chatMensaje.findMany({
      where: { sesionId: Number(sesionId) },
      orderBy: { fechaMensaje: 'desc' },
      take: limite,
    })

    // Invertir para mantener orden cronológico
    const cronologicos = ultimos.reverse()

    return cronologicos.map((m) => {
      const ctx = m.contextoDatos as Record<string, unknown> | null
      const texto = (ctx?.texto_completo as string) || m.contenido
      const role = m.rol === 'usuario' || m.rol === 'user' ? 'user' : 'model'

      return {
        role,
        content: texto,
      }
    })
  }

  /**
   * Guarda un mensaje de forma segura protegiendo contra límites de varchar
   */
  public static async guardarMensaje(params: {
    sesionId: number
    rol: 'usuario' | 'asistente' | 'user' | 'assistant'
    contenido: string
    contextoExtra?: Record<string, unknown>
  }) {
    const rolEstandar =
      params.rol === 'usuario' || params.rol === 'user' ? 'usuario' : 'asistente'

    const textoCompleto = params.contenido || ''
    // En caso de que contenido en BD tenga límite varchar(191), guardamos preview seguro
    // y guardamos el 100% del texto íntegro en contexto_datos (jsonb sin límite)
    const contenidoSeguro = textoCompleto.length > 190 ? textoCompleto.slice(0, 190) : textoCompleto

    const contextoDatos = {
      texto_completo: textoCompleto,
      ...(params.contextoExtra || {}),
    }

    const mensajeCreado = await prisma.chatMensaje.create({
      data: {
        sesionId: Number(params.sesionId),
        rol: rolEstandar,
        contenido: contenidoSeguro,
        contextoDatos,
      },
    })

    // Actualizar total_mensajes en la sesión
    await prisma.chatSesion.update({
      where: { id: Number(params.sesionId) },
      data: {
        totalMensajes: { increment: 1 },
      },
    })

    return mensajeCreado
  }

  /**
   * Actualiza el título de la conversación si es el primer mensaje
   */
  public static async actualizarTituloSiEsInicio(sesionId: number, mensaje: string) {
    try {
      const sesion = await prisma.chatSesion.findUnique({
        where: { id: Number(sesionId) },
        select: { totalMensajes: true, titulo: true },
      })

      if (sesion && sesion.totalMensajes <= 2) {
        const tituloLimpio = mensaje.slice(0, 50).trim()
        if (tituloLimpio) {
          await prisma.chatSesion.update({
            where: { id: Number(sesionId) },
            data: { titulo: tituloLimpio },
          })
        }
      }
    } catch (e) {
      console.error('[ChatService] Error actualizando título:', e)
    }
  }
}
