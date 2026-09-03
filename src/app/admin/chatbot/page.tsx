'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Send,
  Bot,
  User,
  MessageSquare,
  PlusCircle,
  Trash2,
  BarChart3,
  ShieldAlert,
  FileCheck2,
  Sparkles,
  FileDown,
} from 'lucide-react'
import { ClinicalMarkdown } from '@/components/ui/clinical-markdown'
import { generarPdfInformeIa } from '@/lib/pdf-generator'
import { useAuth } from '@/lib/auth-context'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  toolsUsed?: string[]
}

interface ConversacionResumen {
  id: number
  titulo: string | null
  fechaInicio: string
  totalMensajes: number
}

export default function AdminChatbotPage() {
  const [conversaciones, setConversaciones] = useState<ConversacionResumen[]>([])
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '¡Hola! Soy tu Copiloto Clínico y Asistente de Inteligencia Artificial para el equipo de salud mental.\n\nPuedo ayudarte con:\n• Evaluación y triage de expedientes clínicos según PHQ-9, C-SSRS y BHS.\n• Protocolos de intervención clínica y medidas de contención de crisis.\n• Consultas analíticas y estadísticas poblacionales de encuestas en tiempo real.\n\nEscribe cualquier consulta clínica o utiliza las acciones rápidas inferiores.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const { user } = useAuth()
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const activeSessionRef = useRef<number | null>(null)

  // Mantener sincronizada la referencia a la sesión activa
  useEffect(() => {
    activeSessionRef.current = activeSessionId
  }, [activeSessionId])

  // Scroll contenido al final sin provocar saltos en la ventana global
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [])

  const handleDescargarPdf = (mensajeEspecifico?: Message) => {
    let consultasParaExportar: Array<{ pregunta?: string; respuesta: string; timestamp?: string }> = []

    if (mensajeEspecifico) {
      consultasParaExportar = [
        {
          respuesta: mensajeEspecifico.content,
          timestamp: mensajeEspecifico.timestamp.toLocaleTimeString(),
        },
      ]
    } else {
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].role === 'assistant' && messages[i].id !== 'welcome') {
          const userMsg = i > 0 && messages[i - 1].role === 'user' ? messages[i - 1].content : undefined
          consultasParaExportar.push({
            pregunta: userMsg,
            respuesta: messages[i].content,
            timestamp: messages[i].timestamp.toLocaleTimeString(),
          })
        }
      }

      if (consultasParaExportar.length === 0 && messages.length > 0) {
        consultasParaExportar.push({
          respuesta: messages[messages.length - 1].content,
        })
      }
    }

    if (consultasParaExportar.length === 0) return

    const activeConv = conversaciones.find((c) => c.id === activeSessionId)

    generarPdfInformeIa({
      titulo: activeConv?.titulo || 'Informe Clínico Asistido por IA',
      profesional: user?.alias ? `Psic. ${user.alias}` : 'Psicólogo de Turno',
      fecha: new Date().toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' }),
      consultas: consultasParaExportar,
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const loadConversaciones = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/chatbot/conversaciones')
      if (res.ok) {
        const data = await res.json()
        setConversaciones(data.conversaciones || [])
      }
    } catch (error) {
      console.error('Error loading conversaciones:', error)
    }
  }, [])

  useEffect(() => {
    loadConversaciones()
  }, [loadConversaciones])

  const handleCrearNuevaConversacion = async () => {
    try {
      const res = await fetch('/api/admin/chatbot/conversaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: 'Nueva consulta clínica' }),
      })
      if (res.ok) {
        const data = await res.json()
        const newId = data.conversacion.id
        setActiveSessionId(newId)
        activeSessionRef.current = newId
        setMessages([
          {
            id: 'init-new',
            role: 'assistant',
            content:
              'Nueva consulta iniciada. Puedes preguntarme sobre métricas epidemiológicas, protocolos o consultar el estado de un paciente específico indicando su nombre o expediente.',
            timestamp: new Date(),
          },
        ])
        loadConversaciones()
      }
    } catch (error) {
      console.error('Error al crear conversación:', error)
    }
  }

  const handleSeleccionarConversacion = async (sesionId: number) => {
    if (activeSessionId === sesionId) return

    setActiveSessionId(sesionId)
    activeSessionRef.current = sesionId
    setLoading(true)
    setMessages([]) // Limpiar mensajes previos para evitar mezclas

    try {
      const res = await fetch(`/api/admin/chatbot/conversaciones/${sesionId}`)
      if (res.ok) {
        const data = await res.json()

        // Descartar si el usuario cambió rápidamente a otra conversación
        if (activeSessionRef.current !== sesionId) return

        if (data.mensajes && data.mensajes.length > 0) {
          setMessages(
            data.mensajes.map((m: { id: number; rol: 'user' | 'assistant'; contenido: string; fechaMensaje: string; contextoDatos?: { tools?: string[] } }) => ({
              id: m.id.toString(),
              role: m.rol,
              content: m.contenido,
              timestamp: new Date(m.fechaMensaje),
              toolsUsed: m.contextoDatos?.tools,
            }))
          )
        } else {
          setMessages([
            {
              id: 'empty',
              role: 'assistant',
              content: 'Conversación sin mensajes previos. ¿En qué puedo asistirte hoy?',
              timestamp: new Date(),
            },
          ])
        }
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error)
    } finally {
      if (activeSessionRef.current === sesionId) {
        setLoading(false)
      }
    }
  }

  const handleEliminarConversacion = async (sesionId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('¿Deseas eliminar esta consulta del historial?')) return

    try {
      const res = await fetch(`/api/admin/chatbot/conversaciones/${sesionId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        if (activeSessionId === sesionId) {
          setActiveSessionId(null)
          activeSessionRef.current = null
          setMessages([
            {
              id: 'deleted',
              role: 'assistant',
              content: 'Consulta eliminada. Selecciona otra del historial o inicia una nueva.',
              timestamp: new Date(),
            },
          ])
        }
        loadConversaciones()
      }
    } catch (error) {
      console.error('Error al eliminar conversación:', error)
    }
  }

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim()
    if (!textToSend || loading) return

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!customPrompt) setInput('')
    setLoading(true)

    const sessionTarget = activeSessionId

    try {
      const res = await fetch('/api/admin/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          sessionId: sessionTarget,
        }),
      })

      if (res.ok) {
        const data = await res.json()

        // Si se creó una nueva sesión automáticamente
        if (data.sessionId && activeSessionId !== data.sessionId) {
          setActiveSessionId(data.sessionId)
          activeSessionRef.current = data.sessionId
          loadConversaciones()
        }

        // Si el usuario no cambió de conversación mientras la IA generaba respuesta
        if (activeSessionRef.current === sessionTarget || (!sessionTarget && data.sessionId)) {
          const assistantMessage: Message = {
            id: (data.messageId || Date.now() + 1).toString(),
            role: 'assistant',
            content: data.response,
            timestamp: new Date(),
            toolsUsed: data.toolsUsed,
          }
          setMessages((prev) => [...prev, assistantMessage])
        }
      } else {
        const errData = await res.json().catch(() => ({}))
        const errorMessage: Message = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            errData.error ||
            'Ocurrió un error al procesar tu solicitud con el servicio de IA.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error in handleSend:', error)
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Error de conexión con el motor de Inteligencia Artificial.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-[calc(100vh-9.5rem)] min-h-[580px] flex flex-col lg:flex-row gap-4 overflow-hidden">
      {/* Sidebar: Historial de Consultas Limpio */}
      <div className="w-full lg:w-76 bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shrink-0">
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Historial ({conversaciones.length})
            </h3>
          </div>

          <button
            onClick={handleCrearNuevaConversacion}
            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nueva</span>
          </button>
        </div>

        {/* Lista de Conversaciones */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {conversaciones.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-indigo-400" />
              No hay consultas previas archivadas. Escribe tu primera pregunta en el chat.
            </div>
          ) : (
            conversaciones.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSeleccionarConversacion(conv.id)}
                className={`group relative w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer border ${
                  activeSessionId === conv.id
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-xs text-indigo-950 dark:text-indigo-200'
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold truncate flex-1">
                    {conv.titulo || `Consulta #${conv.id}`}
                  </p>
                  <button
                    onClick={(e) => handleEliminarConversacion(conv.id, e)}
                    title="Eliminar consulta"
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                  <span>{new Date(conv.fechaInicio).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{conv.totalMensajes || 0} mensajes</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                Copiloto Clínico de Inteligencia Artificial
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Triage psicométrico, cruce de factores y soporte prescriptivo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDescargarPdf()}
              title="Descargar informe de esta consulta en PDF"
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Exportar Consulta PDF</span>
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistema de Triage Activo
            </span>
          </div>
        </div>

        {/* Messages Feed */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start gap-3 max-w-[85%] ${
                  msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/70 dark:border-slate-700/70'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <>
                      <ClinicalMarkdown content={msg.content} />
                      <div className="flex justify-end mt-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                        <button
                          onClick={() => handleDescargarPdf(msg)}
                          title="Descargar esta respuesta como informe médico PDF"
                          className="text-[11px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
                        >
                          <FileDown className="w-3 h-3" />
                          <span>Descargar PDF</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none flex items-center gap-2 border border-slate-200/70 dark:border-slate-700/70">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                    Evaluando expedientes y protocolos clínicos...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Chips */}
        <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Consultas rápidas:
          </span>
          <button
            onClick={() => handleSend('¿Cuáles son las métricas generales de salud mental y distribución de gravedad actual en la población?')}
            disabled={loading}
            className="px-2.5 py-1 rounded-full text-xs bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0 transition-colors flex items-center gap-1"
          >
            <BarChart3 className="w-3 h-3 text-indigo-500" />
            Métricas Poblacionales
          </button>
          <button
            onClick={() => handleSend('¿Cuáles son los casos de riesgo crítico que requieren atención inmediata y qué acciones se sugieren?')}
            disabled={loading}
            className="px-2.5 py-1 rounded-full text-xs bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0 transition-colors flex items-center gap-1"
          >
            <ShieldAlert className="w-3 h-3 text-rose-500" />
            Casos de Riesgo Crítico
          </button>
          <button
            onClick={() => handleSend('¿Cuál es el protocolo de contención y seguridad para un paciente en riesgo muy alto según las guías clínicas?')}
            disabled={loading}
            className="px-2.5 py-1 rounded-full text-xs bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0 transition-colors flex items-center gap-1"
          >
            <FileCheck2 className="w-3 h-3 text-emerald-500" />
            Protocolo de Crisis Oficial
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Escribe tu consulta clínica (ej. "Evaluar caso de Juan Pérez", "¿Qué factores aumentan el riesgo en zona rural?")...'
              className="flex-1 p-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100 dark:placeholder:text-slate-400 resize-none transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="px-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
