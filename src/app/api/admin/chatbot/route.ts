import { NextRequest, NextResponse } from 'next/server'
import { AIOrchestrator } from '@/lib/ai/orchestrator'
import { ChatService } from '@/services/chat.service'

const orchestrator = new AIOrchestrator()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context, sessionId } = body

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'El mensaje es requerido' },
        { status: 400 }
      )
    }

    // 1. Obtener o crear la sesión relacional en base de datos
    const encuestaId = context?.notificacion?.encuestaId || context?.encuestaId
    const sesion = await ChatService.obtenerOCrearSesion(sessionId ? Number(sessionId) : undefined, encuestaId)

    // 2. Formatear contexto clínico ya sea de expediente de paciente o de notificación seleccionada
    let contextoTexto = ''
    if (context?.paciente || context?.encuestaId) {
      const p = context.paciente || {}
      const idPaciente = context.encuestaId || p.id
      const nombreCompleto = `${p.nombre || 'Paciente'} ${p.apellido || ''}`.trim()
      contextoTexto = `
=== EXPEDIENTE DEL PACIENTE EN CONSULTA ACTIVA ===
- ID del Paciente / Encuesta: #${idPaciente}
- Nombre: ${nombreCompleto}
- Edad: ${p.edad ?? 'No registrada'} años | Sexo: ${p.sexo ?? 'No registrado'}
- Depresión PHQ-9: ${p.phq9 ? `${p.phq9.puntajeTotal ?? 'N/A'} pts (Gravedad: ${p.phq9.nivelGravedad ?? 'N/A'})` : 'No registrado'}
- Riesgo Suicida C-SSRS: ${p.cssrs ? `Nivel: ${p.cssrs.nivelSeveridad ?? 'N/A'}${p.cssrs.intentoPrevio ? ' (REGISTRA INTENTO PREVIO)' : ''}` : 'No registrado'}
- Desesperanza BHS: ${p.bhs ? `${p.bhs.puntajeTotal ?? 'N/A'} pts (Nivel: ${p.bhs.nivelRiesgo ?? 'N/A'})` : 'No registrado'}

INSTRUCCIÓN OBLIGATORIA:
El usuario está consultando DIRECTAMENTE sobre este paciente #${idPaciente} (${nombreCompleto}).
NUNCA le pidas el ID al usuario, porque ya te lo estamos proveyendo en este contexto. Si requieres más variables o historial, invoca la herramienta obtenerDetalleCasoPaciente({ encuestaId: ${idPaciente} }).
`.trim()
    } else if (context?.notificacion) {
      const n = context.notificacion
      const idPaciente = n.encuestaId || n.encuesta?.id
      const nombreCompleto = `${n.paciente?.nombre || n.encuesta?.nombre || 'Paciente'} ${n.paciente?.apellido || n.encuesta?.apellido || ''}`.trim()
      contextoTexto = `
=== CONTEXTO DE ALERTA CLÍNICA ACTIVA ===
- Alerta ID: #${n.id || 'N/A'}
- ID del Paciente / Encuesta: #${idPaciente || 'N/A'}
- Nivel de Riesgo: ${n.tipoRiesgo}
- Título Alerta: ${n.titulo}
- Descripción: ${n.descripcion}
- Acción Requerida: ${n.accionRequerida || 'No especificada'}
- Paciente: ${nombreCompleto} (${n.paciente?.edad || n.encuesta?.edad || 'N/A'} años, ${n.paciente?.sexo || n.encuesta?.sexo || 'N/A'})

INSTRUCCIÓN OBLIGATORIA:
El usuario te está preguntando sobre el caso de la alerta #${n.id} (Paciente #${idPaciente}). No pidas el ID al usuario.
`.trim()
    }

    // 3. Guardar el mensaje del usuario en la base de datos
    await ChatService.guardarMensaje({
      sesionId: sesion.id,
      rol: 'usuario',
      contenido: message.trim(),
      contextoExtra: context,
    })

    // 4. Cargar los últimos mensajes para contexto del modelo
    const historialLLM = await ChatService.obtenerHistorialParaLLM(sesion.id, 6)

    // 5. Ejecutar la inferencia mediante Vertex AI con Function Calling
    const { respuesta, toolsEjecutadas } = await orchestrator.procesarConsulta(
      message.trim(),
      historialLLM.slice(0, -1), // excluir el último mensaje ya que se envía como prompt actual
      contextoTexto || undefined
    )

    // 6. Guardar la respuesta generada por la IA
    const mensajeGuardado = await ChatService.guardarMensaje({
      sesionId: sesion.id,
      rol: 'asistente',
      contenido: respuesta,
      contextoExtra: { tools: toolsEjecutadas },
    })

    // 7. Actualizar el título de la sesión si es el primer intercambio
    await ChatService.actualizarTituloSiEsInicio(sesion.id, message.trim())

    return NextResponse.json({
      response: respuesta,
      sessionId: sesion.id,
      messageId: mensajeGuardado.id,
      toolsUsed: toolsEjecutadas,
    })
  } catch (error) {
    console.error('[Admin Chatbot] Error al procesar solicitud:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud con Vertex AI' },
      { status: 500 }
    )
  }
}

