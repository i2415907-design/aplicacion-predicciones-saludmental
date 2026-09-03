'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  X,
  Bot,
  User,
  Send,
  Activity,
  Zap,
  ShieldAlert,
  RefreshCw,
  Maximize2,
  Minimize2,
  FileDown,
} from 'lucide-react'
import { ClinicalMarkdown } from '@/components/ui/clinical-markdown'
import { generarPdfInformeIa } from '@/lib/pdf-generator'
import { useAuth } from '@/lib/auth-context'

interface EncuestaDetalle {
  id: number
  nombre: string | null
  apellido: string | null
  edad: number
  sexo: string
  phq9?: { puntajeTotal: number; nivelGravedad: string; ideacionSuicida: number } | null
  cssrs?: { nivelSeveridad: string; intentoPrevio: boolean; planEspecifico?: boolean } | null
  bhs?: { puntajeTotal: number; nivelRiesgo: string } | null
  dass21?: { puntajeEstres: number; puntajeAnsiedad: number; puntajeDepresion: number } | null
  rosenberg?: { puntajeTotal?: number } | null
  saludFisica?: { insomnio?: boolean; calidadSueno?: number; consumeDrogas?: boolean; consumeAlcohol?: boolean } | null
  psicologicos?: {
    violenciaFisica?: boolean
    violenciaPsicologica?: boolean
    bullying?: boolean
    perdidaFamiliarReciente?: boolean
    tieneRedApoyo?: boolean
    percibeVidaConSentido?: boolean
  } | null
  historial?: { numIntentosPrevios?: number; hospitalizacionPorIntento?: boolean } | null
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ConsultaIaModalProps {
  isOpen: boolean
  onClose: () => void
  encuestaId?: number | null
}

export function ConsultaIaModal({ isOpen, onClose, encuestaId }: ConsultaIaModalProps) {
  const { user } = useAuth()
  const [encuesta, setEncuesta] = useState<EncuestaDetalle | null>(null)
  const [loadingData, setLoadingData] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loadingAi, setLoadingAi] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [sessionId, setSessionId] = useState<number | null>(null)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const activeSessionRef = useRef<number | null>(null)

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
        if (messages[i].role === 'assistant') {
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

    generarPdfInformeIa({
      titulo: 'Informe de Triage Clínico y Evaluación IA',
      profesional: user?.alias ? `Psic. ${user.alias}` : 'Psicólogo de Turno',
      fecha: new Date().toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' }),
      paciente: encuesta
        ? {
            id: encuesta.id,
            nombre: encuesta.nombre,
            apellido: encuesta.apellido,
            edad: encuesta.edad,
            sexo: encuesta.sexo,
            phq9Nivel: encuesta.phq9 ? `${encuesta.phq9.puntajeTotal} pts (${encuesta.phq9.nivelGravedad})` : undefined,
            cssrsNivel: encuesta.cssrs?.nivelSeveridad,
            bhsNivel: encuesta.bhs ? `${encuesta.bhs.puntajeTotal} pts (${encuesta.bhs.nivelRiesgo})` : undefined,
          }
        : undefined,
      consultas: consultasParaExportar,
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Cargar datos de la encuesta al abrir con encuestaId
  useEffect(() => {
    if (!isOpen) {
      setMessages([])
      setEncuesta(null)
      setSessionId(null)
      activeSessionRef.current = null
      setInput('')
      return
    }

    if (encuestaId) {
      setLoadingData(true)
      fetch(`/api/encuesta/${encuestaId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setEncuesta(data)
            const nombreCompleto = `${data.nombre || 'Paciente'} ${data.apellido || ''}`.trim()
            const gravedadDep = data.phq9?.nivelGravedad || 'evaluación'
            const severidadCssrs = data.cssrs?.nivelSeveridad || 'sin ideación'

            setMessages([
              {
                id: 'init',
                role: 'assistant',
                content: `Hola. He cargado el expediente de **${nombreCompleto}** (ID #${data.id}, ${data.edad} años, ${data.sexo}).\n\n• **Depresión (PHQ-9):** ${gravedadDep} (${data.phq9?.puntajeTotal || 0} pts)\n• **Riesgo Suicida (C-SSRS):** ${severidadCssrs.replace('_', ' ')}\n• **Desesperanza (BHS):** ${data.bhs?.nivelRiesgo || 'N/A'}\n\n¿Deseas generar el triage clínico completo o revisar algún factor específico?`,
                timestamp: new Date(),
              },
            ])
          }
        })
        .catch((err) => console.error('Error cargando expediente en modal:', err))
        .finally(() => setLoadingData(false))
    } else {
      setEncuesta(null)
      setMessages([
        {
          id: 'init-general',
          role: 'assistant',
          content:
            'Hola. Asistente Clínico activo. Puedes consultar métricas generales, buscar casos por nombre o pedir protocolos de intervención de urgencia.',
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, encuestaId])

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim()
    if (!query || loadingAi) return

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!textToSend) setInput('')
    setLoadingAi(true)

    try {
      const payload: Record<string, unknown> = {
        message: query,
        sessionId: sessionId,
      }

      if (encuesta) {
        payload.context = {
          encuestaId: encuesta.id,
          paciente: {
            id: encuesta.id,
            nombre: encuesta.nombre,
            apellido: encuesta.apellido,
            edad: encuesta.edad,
            sexo: encuesta.sexo,
            phq9: encuesta.phq9,
            cssrs: encuesta.cssrs,
            bhs: encuesta.bhs,
          },
        }
      }

      const res = await fetch('/api/admin/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.sessionId && !sessionId) {
          setSessionId(data.sessionId)
          activeSessionRef.current = data.sessionId
        }

        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMsg])
      } else {
        const err = await res.json().catch(() => ({}))
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: err.error || 'No se pudo procesar la solicitud en este momento.',
            timestamp: new Date(),
          },
        ])
      }
    } catch (e) {
      console.error('Error enviando mensaje en modal:', e)
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Error de conexión con el motor de inferencia clínica.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoadingAi(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }

  if (!isOpen) return null

  const getRiesgoColor = (nivel?: string) => {
    switch (nivel?.toLowerCase()) {
      case 'intento_letal':
      case 'muy_alto':
      case 'severo':
      case 'critico':
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
      case 'planificacion':
      case 'alto':
      case 'moderadamente_severo':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
      case 'moderado':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800'
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-200 ${
          isMaximized
            ? 'w-full h-full max-w-none rounded-none'
            : 'w-full max-w-5xl h-[88vh] max-h-[900px]'
        }`}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base truncate">
                  {encuesta
                    ? `Expediente Clínico: ${encuesta.nombre || 'Paciente'} ${encuesta.apellido || ''} (#${encuesta.id})`
                    : 'Copiloto Clínico de Inteligencia Artificial'}
                </h3>
                {encuesta && (
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getRiesgoColor(
                      encuesta.cssrs?.nivelSeveridad || encuesta.phq9?.nivelGravedad
                    )}`}
                  >
                    {encuesta.cssrs?.nivelSeveridad
                      ? encuesta.cssrs.nivelSeveridad.replace('_', ' ')
                      : 'Evaluación'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {encuesta
                  ? `${encuesta.edad} años · Sexo ${encuesta.sexo} · Triage y soporte en toma de decisiones`
                  : 'Soporte analítico, triage y prescripción de protocolos'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => handleDescargarPdf()}
              title="Descargar Informe Clínico en PDF"
              className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Exportar PDF</span>
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? 'Restaurar tamaño' : 'Pantalla completa'}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              title="Cerrar modal"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split Layout */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Panel: Resumen Clínico & Quick Prompts */}
          {encuesta && (
            <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 overflow-y-auto space-y-4 shrink-0">
              {/* Escalas Clínicas */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-500" />
                  Instrumentos Psicométricos
                </h4>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                    <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
                      <span>PHQ-9 (Depresión)</span>
                      <span className="font-bold">{encuesta.phq9?.puntajeTotal ?? 0} pts</span>
                    </div>
                    <div className="text-[11px] text-slate-500 capitalize mt-0.5">
                      Nivel: {encuesta.phq9?.nivelGravedad?.replace('_', ' ') || 'No registrado'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                    <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
                      <span>C-SSRS (Riesgo Suicida)</span>
                      <span className="font-bold capitalize text-rose-600 dark:text-rose-400">
                        {encuesta.cssrs?.nivelSeveridad?.replace('_', ' ') || 'Sin ideación'}
                      </span>
                    </div>
                    {encuesta.cssrs?.intentoPrevio && (
                      <span className="inline-block mt-1 text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                        ⚠ Antecedente de intento registrado
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                    <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
                      <span>BHS (Desesperanza Beck)</span>
                      <span className="font-bold">{encuesta.bhs?.puntajeTotal ?? 0} pts</span>
                    </div>
                    <div className="text-[11px] text-slate-500 capitalize mt-0.5">
                      Nivel: {encuesta.bhs?.nivelRiesgo || 'No registrado'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Factores de Alerta Clave */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  Factores Determinantes
                </h4>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {encuesta.saludFisica?.insomnio && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-medium border border-amber-200 dark:border-amber-800">
                      Insomnio Crónico
                    </span>
                  )}
                  {encuesta.psicologicos?.violenciaFisica && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-medium border border-rose-200 dark:border-rose-800">
                      Violencia Física
                    </span>
                  )}
                  {encuesta.psicologicos?.bullying && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-medium border border-rose-200 dark:border-rose-800">
                      Bullying
                    </span>
                  )}
                  {encuesta.psicologicos?.perdidaFamiliarReciente && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
                      Duelo Reciente
                    </span>
                  )}
                  {encuesta.historial?.numIntentosPrevios && encuesta.historial.numIntentosPrevios > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800">
                      {encuesta.historial.numIntentosPrevios} Intento(s) Previos
                    </span>
                  )}
                  {encuesta.psicologicos?.tieneRedApoyo === false && (
                    <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 font-medium border border-orange-200 dark:border-orange-800">
                      Sin Red de Apoyo
                    </span>
                  )}
                </div>
              </div>

              {/* Acciones Rápidas (1-Click Prompts) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-500" />
                  Acciones Rápidas de Triage
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() =>
                      handleQuickPrompt(
                        `Realiza un triage clínico integral de este paciente (ID #${encuesta.id}). Desglosa los hallazgos según PHQ-9, C-SSRS y BHS, e indica el nivel de severidad.`
                      )}
                    disabled={loadingAi}
                    className="w-full text-left p-2 rounded-xl text-xs bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-800 dark:text-slate-200 transition-all flex items-center justify-between"
                  >
                    <span>⚡ Triage y Resumen Clínico</span>
                  </button>

                  <button
                    onClick={() =>
                      handleQuickPrompt(
                        `¿Qué factores de riesgo y determinantes críticos presenta el paciente #${encuesta.id}? Analiza los cruces entre su depresión, factores psicosociales y salud física.`
                      )}
                    disabled={loadingAi}
                    className="w-full text-left p-2 rounded-xl text-xs bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-800 dark:text-slate-200 transition-all flex items-center justify-between"
                  >
                    <span>🔍 Analizar Cruces de Riesgo</span>
                  </button>

                  <button
                    onClick={() =>
                      handleQuickPrompt(
                        `¿Cuál es el protocolo clínico prescriptivo de intervención inmediata para este paciente (#${encuesta.id})? Incluye medidas de contención de crisis y seguimiento.`
                      )}
                    disabled={loadingAi}
                    className="w-full text-left p-2 rounded-xl text-xs bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-800 dark:text-slate-200 transition-all flex items-center justify-between"
                  >
                    <span>📋 Prescribir Protocolo de Crisis</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Right Panel: Chat Stream */}
          <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 overflow-hidden">
            {/* Messages Feed */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
            >
              {loadingData ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2 text-indigo-500" />
                  Cargando expediente del paciente...
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start gap-2.5 max-w-[90%] sm:max-w-[85%] ${
                        msg.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        }`}
                      >
                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/70 dark:border-slate-700/70'
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
                                title="Exportar esta respuesta en PDF"
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
                ))
              )}

              {loadingAi && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none flex items-center gap-2 border border-slate-200/70 dark:border-slate-700/70">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                        Analizando variables clínicas...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loadingAi}
                  placeholder={
                    encuesta
                      ? `Haz una pregunta clínica sobre el caso #${encuesta.id}...`
                      : 'Escribe tu consulta clínica...'
                  }
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100 dark:placeholder:text-slate-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loadingAi}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Consultar</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
