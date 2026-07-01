"use client"

import { useState, useRef, useEffect } from "react"

interface AnalisisDimension {
  titulo: string
  contenido: string
}

interface AnalisisData {
  descriptivo: AnalisisDimension
  diagnostico: AnalisisDimension
  predictivo: AnalisisDimension
  prescriptivo: AnalisisDimension
}

interface Message {
  role: "user" | "assistant"
  content: string
  analisis?: AnalisisData
}

const SUGERENCIAS = [
  "¿Cuál es el promedio de PHQ-9 en las encuestas?",
  "¿Cuántas personas tienen ideación suicida?",
  "¿Qué factores son más comunes en casos de alto riesgo?",
  "Dame un resumen de los datos demográficos",
  "¿Cuál es la relación entre depresión y desesperanza?",
  "¿Cuántos fallecimientos hay registrados?",
]

const DIMENSIONES = [
  { key: "descriptivo" as const, label: "Descriptivo", icon: " ", color: "blue" },
  { key: "diagnostico" as const, label: "Diagnóstico", icon: " ", color: "purple" },
  { key: "predictivo" as const, label: "Predictivo", icon: " ", color: "orange" },
  { key: "prescriptivo" as const, label: "Prescriptivo", icon: " ", color: "green" },
]

const COLOR_CLASSES: Record<string, { bg: string; border: string; text: string; activeBg: string }> = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", activeBg: "bg-blue-100" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", activeBg: "bg-purple-100" },
  orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", activeBg: "bg-orange-100" },
  green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", activeBg: "bg-green-100" },
}

function PanelAnalisis({ analisis }: { analisis: AnalisisData }) {
  const [dimensionActiva, setDimensionActiva] = useState<"descriptivo" | "diagnostico" | "predictivo" | "prescriptivo">("descriptivo")
  const dims = DIMENSIONES.find((d) => d.key === dimensionActiva)!
  const colors = COLOR_CLASSES[dims.color]
  const data = analisis[dimensionActiva]

  return (
    <div className="mt-3 border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Tabs */}
      <div className="flex border-b bg-gray-50">
        {DIMENSIONES.map((dim) => {
          const c = COLOR_CLASSES[dim.color]
          const isActive = dim.key === dimensionActiva
          return (
            <button
              key={dim.key}
              onClick={() => setDimensionActiva(dim.key)}
              className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                isActive
                  ? `${c.activeBg} ${c.text} border-current`
                  : "text-gray-500 border-transparent hover:bg-gray-100"
              }`}
            >
              <span className="mr-1">{dim.icon}</span>
              {dim.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className={`p-4 ${colors.bg}`}>
        <h4 className={`text-sm font-bold ${colors.text} mb-2`}>{data.titulo}</h4>
        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {data.contenido}
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const text = messageText || input
    if (!text.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
          analisis: data.analisis,
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat con IA</h1>
        <p className="text-gray-600">
          Consulta en lenguaje natural sobre datos de depresión y suicidio
        </p>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border p-4 mb-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿En qué puedo ayudarte?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Pregúntame sobre los datos de depresión, factores de riesgo o tendencias
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              {SUGERENCIAS.map((sugerencia, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(sugerencia)}
                  className="text-left p-2 text-xs text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {sugerencia}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                  </div>
                </div>

                {/* Panel de 4 dimensiones de análisis */}
                {message.role === "assistant" && message.analisis && (
                  <div className="max-w-[90%] mt-2 ml-2">
                    <PanelAnalisis analisis={message.analisis} />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe tu pregunta..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "..." : "Enviar"}
        </button>
      </div>

      <div className="mt-4 bg-yellow-50 rounded-lg p-3">
        <p className="text-xs text-yellow-800">
          <strong>Nota:</strong> Este chat utiliza IA para analizar datos. Las respuestas son
          informativas y no sustituyen una evaluación clínica profesional. En caso de crisis,
          contacte a un profesional de salud mental o llame al 988.
        </p>
      </div>
    </div>
  )
}
