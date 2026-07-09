'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Send, Bot, User, Bell, AlertTriangle } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Notificacion {
  id: number
  tipoRiesgo: string
  titulo: string
  descripcion: string
  accionRequerida: string | null
  encuesta: {
    id: number
    nombre: string | null
    apellido: string | null
    edad: number
    sexo: string
  }
}

export default function AdminChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'assistant',
    content: '¡Hola! Soy tu asistente de IA para psicólogos. Puedo ayudarte a:\n\n• Evaluar el riesgo de un paciente\n• Sugerir intervenciones apropiadas\n• Responder a notificaciones de alerta\n• Proporcionar información clínica relevante\n\nSelecciona una notificación de la lista o escribe tu pregunta.',
    timestamp: new Date()
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [selectedNotif, setSelectedNotif] = useState<Notificacion | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const loadNotificaciones = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notificaciones?limit=20')
      if (res.ok) {
        const data = await res.json()
        setNotificaciones(data.notificaciones || [])
      }
    } catch (error) {
      console.error('Error loading notificaciones:', error)
    }
  }, [])

  useEffect(() => {
    loadNotificaciones()
  }, [loadNotificaciones])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const contextPayload = selectedNotif ? {
        notificacion: {
          tipoRiesgo: selectedNotif.tipoRiesgo,
          titulo: selectedNotif.titulo,
          descripcion: selectedNotif.descripcion,
          accionRequerida: selectedNotif.accionRequerida,
          paciente: {
            nombre: selectedNotif.encuesta.nombre,
            apellido: selectedNotif.encuesta.apellido,
            edad: selectedNotif.encuesta.edad,
            sexo: selectedNotif.encuesta.sexo
          }
        }
      } : {}

      const res = await fetch('/api/admin/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          context: contextPayload
        })
      })

      if (res.ok) {
        const data = await res.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo) {
      case 'muy_alto': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      case 'alto': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
      case 'moderado': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
      default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    }
  }

  return (
    <div className="h-[calc(100vh-200px)] flex gap-4">
      {/* Sidebar: Notificaciones */}
      <div className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            Notificaciones Activas
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Selecciona para contexto</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {notificaciones.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No hay notificaciones pendientes</p>
          ) : (
            notificaciones.map((notif) => (
              <button
                key={notif.id}
                onClick={() => setSelectedNotif(notif)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedNotif?.id === notif.id
                    ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-2">
                  {notif.tipoRiesgo === 'muy_alto' || notif.tipoRiesgo === 'alto' ? (
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  ) : (
                    <Bell className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{notif.titulo}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {notif.encuesta.nombre || 'Anónimo'} · {notif.encuesta.edad} años
                    </p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${getRiesgoColor(notif.tipoRiesgo)}`}>
                      {notif.tipoRiesgo}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-600" />
            Asistente IA para Psicólogos
          </h2>
          {selectedNotif && (
            <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-sm">
              <p className="font-medium text-purple-800 dark:text-purple-300">Contexto: {selectedNotif.titulo}</p>
              <p className="text-purple-600 text-xs mt-1">{selectedNotif.descripcion}</p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 max-w-[80%] ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-indigo-100 dark:bg-indigo-900/30' 
                    : 'bg-purple-100 dark:bg-purple-900/30'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Bot className="w-4 h-4 text-purple-600" />
                  )}
                </div>
                <div className={`px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-purple-600" />
                </div>
                <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedNotif ? "Pregunta sobre esta notificación..." : "Escribe tu pregunta..."}
              className="flex-1 resize-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400"
              rows={2}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={() => setInput("¿Cuál es el protocolo de intervención para este nivel de riesgo?")}
              className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Protocolo de intervención
            </button>
            <button
              onClick={() => setInput("¿Qué preguntas de seguimiento debería hacer?")}
              className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Preguntas de seguimiento
            </button>
            <button
              onClick={() => setInput("Genera un plan de tratamiento sugerido")}
              className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Plan de tratamiento
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
