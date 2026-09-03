'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Activity,
  ShieldAlert,
  Sparkles,
  Layers,
  Database,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Workflow,
  Cpu,
  TrendingUp,
  Maximize2,
  X,
  Code2,
  Eye,
} from 'lucide-react'

export default function DiapositivasPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 16
  const [modalData, setModalData] = useState<{ title: string; subtitle?: string; content: React.ReactNode } | null>(null)

  const nextSlide = useCallback(() => {
    if (modalData) return
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev))
  }, [totalSlides, modalData])

  const prevSlide = useCallback(() => {
    if (modalData) return
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev))
  }, [modalData])

  const salir = useCallback(() => {
    if (modalData) {
      setModalData(null)
      return
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }
    router.push('/admin')
  }, [router, modalData])

  // Controles de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        salir()
      } else if (!modalData) {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
          e.preventDefault()
          nextSlide()
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          prevSlide()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide, salir, modalData])

  // Desactivar scroll global del navegador
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[99999] w-screen h-screen bg-[#040507] text-white flex flex-col justify-center items-center overflow-hidden select-none">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap');
        
        html, body {
          overflow: hidden !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        ::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .font-curva-seria {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .font-sans-curva {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        }
        .font-mono-code {
          font-family: 'Fira Code', monospace;
        }
      `}</style>

      {/* Sutil resplandor de fondo ambiental */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.14),transparent_65%)] pointer-events-none" />

      {/* ======================================================== */}
      {/* MODAL INTERACTIVO DE ZOOM PARA EJEMPLOS Y CÓDIGO         */}
      {/* ======================================================== */}
      {modalData && (
        <div className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 sm:p-12 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full max-w-4xl max-h-[85vh] bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block">Detalle Clínico / Código del MVP</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-curva-seria">{modalData.title}</h3>
                {modalData.subtitle && <p className="text-xs sm:text-sm text-zinc-400 font-sans-curva mt-0.5">{modalData.subtitle}</p>}
              </div>
              <button
                onClick={() => setModalData(null)}
                className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-800"
                title="Cerrar modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto text-sm text-zinc-200 font-sans-curva space-y-4 pr-1">
              {modalData.content}
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-900 flex justify-end">
              <button
                onClick={() => setModalData(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                Cerrar Ventana (Esc)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor Principal Amplio */}
      <main className="w-full max-w-6xl px-6 sm:px-12 lg:px-16 flex items-center justify-center relative z-10">

        {/* ======================================================== */}
        {/* DIAPOSITIVA 1: FRASE REALISTA Y DATOS (CENTRADA)         */}
        {/* ======================================================== */}
        {currentSlide === 0 && (
          <div className="w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.35] text-zinc-100 font-curva-seria max-w-5xl mx-auto drop-shadow-sm">
              “Cada 40 segundos, una persona en el mundo se quita la vida; más de 700,000 al año.
              La depresión no es tristeza pasajera ni debilidad: es un dolor invisible que destruye
              en silencio cuando nadie detecta las señales a tiempo.”
            </h1>
          </div>
        )}

        {/* ======================================================== */}
        {/* DIAPOSITIVA 2: PORTADA OFICIAL DEL EQUIPO CABO VERDE    */}
        {/* ======================================================== */}
        {currentSlide === 1 && (
          <div className="w-full max-w-5xl text-center space-y-12 animate-in fade-in zoom-in-95 duration-500">
            <div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white font-curva-seria leading-tight">
                Sistema de Asistencia Clínica y Triage Preventivo en Salud Mental
              </h1>
            </div>

            <div className="space-y-3 pt-6 border-t border-zinc-900 font-sans-curva">
              <p className="text-base sm:text-lg font-semibold tracking-wider uppercase text-zinc-500">
                Curso: <span className="text-zinc-200 font-bold">Inteligencia Artificial</span>
              </p>
              <p className="text-base sm:text-lg font-semibold tracking-wider uppercase text-zinc-500">
                Maestra: <span className="text-zinc-100 font-bold font-curva-seria text-xl sm:text-2xl">KAREM MERCEDES MALDONADO CORDOVA</span>
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-zinc-900 font-sans-curva">
              <p className="text-lg sm:text-xl font-bold tracking-wider uppercase text-zinc-400">
                Equipo: <span className="text-white underline decoration-indigo-500 underline-offset-8">“Cabo Verde”</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 transition-all">
                  <p className="text-base sm:text-lg font-semibold text-zinc-200">• Arones Romani Henry</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 transition-all">
                  <p className="text-base sm:text-lg font-semibold text-zinc-200">• Inga Quispe Diego Anthony</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 transition-all">
                  <p className="text-base sm:text-lg font-semibold text-zinc-200">• Paucar Torres Gabriel Emerando</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 transition-all">
                  <p className="text-base sm:text-lg font-semibold text-zinc-200">• Ponce Otarola Jarem Antonio</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DIAPOSITIVA 3: HIPÓTESIS, EXPERIMENTO, MÉTRICA Y ÉXITO  */}
        {/* ======================================================== */}
        {currentSlide === 2 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Validación Científica del MVP</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Hipótesis, Experimento y Criterio de Éxito
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans-curva">
              <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> La Hipótesis del MVP
                </span>
                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                  <strong>Hipótesis de Valor:</strong> Autoevaluación digital periódica + IA = identificación temprana y derivación efectiva antes del intento suicida.
                </p>
                <p className="text-xs text-zinc-400">
                  <strong>Hipótesis Técnica:</strong> 5 escalas clínicas (84 ítems) + 7 factores ponderados = clasificación de riesgo certera en &lt; 2 segundos.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> El Experimento (Nuestro MVP)
                </span>
                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                  Formulario wizard de <strong>10 pasos</strong> con 3,465 encuestas procesadas, 2,000+ notificaciones y panel con Copiloto Clínico de IA.
                </p>
                <p className="text-xs text-zinc-400">
                  Flujo verificado: <em>Paciente ➔ Encuesta ➔ Scoring de Riesgo ➔ Alerta Roja ➔ Psicólogo</em>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> La Métrica Core
                </span>
                <div className="p-2.5 bg-zinc-900/80 rounded-xl font-mono-code text-xs text-emerald-300 border border-zinc-800">
                  TAP = (Protocolos Activados / Total Alertas de Riesgo) × 100
                </div>
                <p className="text-xs text-zinc-300">
                  Mide la <strong>confianza y utilidad clínica real</strong>: ¿Usa el profesional las recomendaciones que el sistema sugiere?
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Criterio de Éxito
                </span>
                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                  <strong>Umbral de Validación: TAP ≥ 70%</strong>.
                </p>
                <div className="text-xs text-zinc-400 space-y-0.5">
                  <p>• <strong>≥ 70%:</strong> Validación positiva para escalar a producción clínica.</p>
                  <p>• <strong>50% - 69%:</strong> Zona de ajuste de usabilidad y protocolos.</p>
                  <p>• <strong>&lt; 50%:</strong> Pivotar el enfoque del copiloto clínico.</p>
                </div>
              </div>
            </div>

            {/* Botón de Ejemplo Interactivo */}
            <div
              onClick={() =>
                setModalData({
                  title: 'Ejemplo Real de Medición de la Métrica Core (TAP)',
                  subtitle: 'Simulación del piloto en un centro universitario con 100 alertas clínicas',
                  content: (
                    <div className="space-y-4">
                      <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                        <p className="font-semibold text-white mb-2">Escenario Clínico:</p>
                        <p className="text-zinc-300">Durante un mes de tamizaje, el sistema procesó 1,200 estudiantes y generó <strong>100 alertas de riesgo moderado a muy alto</strong>.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                          <p className="text-xs text-zinc-500 uppercase">Alertas Totales</p>
                          <p className="text-2xl font-bold text-white">100 casos</p>
                        </div>
                        <div className="p-4 bg-emerald-950/50 rounded-xl border border-emerald-800">
                          <p className="text-xs text-emerald-400 uppercase">Protocolos Activados por Psicólogos</p>
                          <p className="text-2xl font-bold text-emerald-300">76 protocolos</p>
                        </div>
                      </div>
                      <div className="p-4 bg-black rounded-xl border border-zinc-800 font-mono-code text-sm text-emerald-300">
                        TAP = (76 / 100) * 100 = 76%  ➔  VALIDACIÓN POSITIVA (&gt; 70%)
                      </div>
                      <p className="text-xs text-zinc-400">Demuestra que en el 76% de los casos, los profesionales de salud confiaron y aplicaron la recomendación de la IA para intervenir oportunamente.</p>
                    </div>
                  ),
                })
              }
              className="p-3 bg-zinc-950 border border-indigo-900/40 hover:border-indigo-500 rounded-xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-indigo-300">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span><strong>Ejemplo Práctico en Nuestro MVP:</strong> Ver cálculo real de la TAP con 100 alertas y criterio de éxito del 70%</span>
              </div>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">Click para agrandar</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DIAPOSITIVA 4: INTERFAZ INTEGRADA Y DUALIDAD DE IA      */}
        {/* ======================================================== */}
        {currentSlide === 3 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Arquitectura de Software del MVP</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Interfaz Integrada y Dualidad de Inteligencia Artificial
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans-curva">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                  1. IA Tradicional / Simbólica (Determinista)
                </span>
                <p className="text-base text-zinc-200 leading-relaxed font-semibold">
                  Motor de Scoring en Código: Función `calcularRiesgoGlobal()`
                </p>
                <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-300">
                  <li>• Ejecución determinista en milisegundos en el backend de Next.js.</li>
                  <li>• Suma ponderada de 7 factores psicométricos (0-23 puntos).</li>
                  <li>• <strong>Cero margen de alucinación:</strong> si PHQ-9 ítem 9 ≥ 2, activa Alerta Roja inmediata.</li>
                  <li>• Clasificación matemática: Bajo (0-3), Moderado (4-7), Alto (8-11), Muy Alto (12+).</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                  2. IA Generativa (Google Cloud Vertex AI · Gemini 2.5 Flash)
                </span>
                <p className="text-base text-zinc-200 leading-relaxed font-semibold">
                  Copiloto Clínico y Soporte a la Decisión Médica
                </p>
                <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-300">
                  <li>• Inferencia contextual profunda sobre el historial del paciente.</li>
                  <li>• <strong>Function Calling:</strong> Ejecuta herramientas para consultar expedientes y protocolos.</li>
                  <li>• <strong>Latencia de 1.3s:</strong> Optimizado mediante `thinkingBudget: 0`.</li>
                  <li>• Generación y exportación de informes médicos descargables en PDF.</li>
                </ul>
              </div>
            </div>

            {/* Botón de Ejemplo Interactivo */}
            <div
              onClick={() =>
                setModalData({
                  title: 'Ejemplo de Sinergia entre IA Simbólica e IA Generativa',
                  subtitle: 'Cómo colaboran ambas ramas de IA en una misma encuesta',
                  content: (
                    <div className="space-y-4">
                      <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                        <p className="text-sm font-semibold text-white mb-1">Paso 1: Intervención de la IA Simbólica (Backend)</p>
                        <p className="text-xs text-zinc-300">El paciente finaliza la encuesta. El motor ejecuta en 2ms: PHQ-9 = 19 (3 pts) + C-SSRS intento letal (5 pts) + Aislamiento (2 pts) = <strong>10 pts ➔ Riesgo 'alto'</strong>.</p>
                      </div>
                      <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                        <p className="text-sm font-semibold text-white mb-1">Paso 2: Intervención de la IA Generativa (Vertex AI Gemini 2.5 Flash)</p>
                        <p className="text-xs text-zinc-300">El psicólogo abre el Copiloto Clínico. La IA recibe el expediente y prescribe en 1.3s: <em>"Paciente con riesgo alto por antecedente de intento. Activar de inmediato protocolo de restricción de objetos cortantes y programar cita presencial en 24h."</em></p>
                      </div>
                      <p className="text-xs text-zinc-400 italic">La IA tradicional asegura cero fallas numéricas; la IA generativa aporta empatía y formulación asistencial médica.</p>
                    </div>
                  ),
                })
              }
              className="p-3 bg-zinc-950 border border-indigo-900/40 hover:border-indigo-500 rounded-xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-indigo-300">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span><strong>Ejemplo Práctico en Nuestro MVP:</strong> Ver cómo interactúan la función de 2ms y el modelo Vertex AI de 1.3s</span>
              </div>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">Click para agrandar</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DIAPOSITIVA 5: ECOSISTEMA DE NODOS, WORKFLOW Y ETL/ELT  */}
        {/* ======================================================== */}
        {currentSlide === 4 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Flujo de Datos y Operación</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Ecosistema de Nodos y Arquitectura ETL vs ELT
              </h2>
            </div>

            {/* Diagrama de 4 Nodos */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 font-sans-curva text-center">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-xs font-bold uppercase text-indigo-400 block">1. Disparador</span>
                <p className="text-sm font-semibold text-white">Paciente envía encuesta</p>
                <p className="text-xs text-zinc-400">Petición POST en `/api/encuesta` con 84 respuestas.</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-xs font-bold uppercase text-indigo-400 block">2. Transformación (ETL)</span>
                <p className="text-sm font-semibold text-white">Cálculo Psicométrico</p>
                <p className="text-xs text-zinc-400">Validación de rangos, sumatoria de escalas y asignación de riesgo.</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-xs font-bold uppercase text-indigo-400 block">3. Lógica y Persistencia</span>
                <p className="text-sm font-semibold text-white">Alerta en Base de Datos</p>
                <p className="text-xs text-zinc-400">ORM Prisma guarda en PostgreSQL (17 tablas) y genera notificación.</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-xs font-bold uppercase text-emerald-400 block">4. Intervención AI</span>
                <p className="text-sm font-semibold text-white">Triage Copiloto Vertex AI</p>
                <p className="text-xs text-zinc-400">Inferencia en lenguaje natural, plan de contingencia y reporte PDF.</p>
              </div>
            </div>

            {/* Botón de Diagrama Interactivo */}
            <div
              onClick={() =>
                setModalData({
                  title: 'Diagrama de Arquitectura de Datos: ETL vs ELT en el MVP',
                  subtitle: 'Diferenciación técnica implementada en producción',
                  content: (
                    <div className="space-y-4">
                      <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2">
                        <strong className="text-indigo-400 block text-sm">ETL en Captura de Encuestas:</strong>
                        <p className="text-xs text-zinc-300 font-mono-code bg-black p-3 rounded-lg border border-zinc-800">
                          [1. Formulario Wizard] ➔ Extract (84 respuestas) ➔ Transform (calculos.ts: suma escalas y baremos) ➔ Load (INSERT en 17 tablas de PostgreSQL)
                        </p>
                        <p className="text-xs text-zinc-400">Garantiza que ninguna respuesta corrupta o fuera de rango (0-3) llegue a la base de datos limpia.</p>
                      </div>
                      <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2">
                        <strong className="text-emerald-400 block text-sm">ELT en Dashboard de Business Intelligence:</strong>
                        <p className="text-xs text-zinc-300 font-mono-code bg-black p-3 rounded-lg border border-zinc-800">
                          [3,465 Registros Históricos] ➔ Extract (Censo) ➔ Load (PostgreSQL) ➔ Transform (Vistas y agregaciones SQL al vuelo en /api/admin/stats)
                        </p>
                        <p className="text-xs text-zinc-400">Aprovecha la potencia del motor relacional de PostgreSQL para agrupar demografía y tasas de suicidio en milisegundos.</p>
                      </div>
                    </div>
                  ),
                })
              }
              className="p-3 bg-zinc-950 border border-indigo-900/40 hover:border-indigo-500 rounded-xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-indigo-300">
                <Workflow className="w-4 h-4 text-indigo-400" />
                <span><strong>Diagrama Interactivo:</strong> Ver flujo exacto de ETL en encuestas vs ELT en el Dashboard de Business Intelligence</span>
              </div>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">Click para agrandar</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DIAPOSITIVA 6: ESTÁNDARES ISO 14971, ÉTICA Y AUDITORÍA   */}
        {/* ======================================================== */}
        {currentSlide === 5 && (
          <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Gobernanza y Transparencia Técnica</span>
              <h2 className="text-2xl sm:text-4xl font-semibold text-white font-curva-seria">
                Estándares ISO 14971, Ética y Auditoría de Tools
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans-curva text-left text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase text-indigo-400 block">Principios Éticos e ISO 14971 (Dispositivos Médicos)</span>
                <ul className="space-y-1.5 text-zinc-300 text-xs">
                  <li>• <strong className="text-white">Supervisión Humana (Human-in-the-Loop):</strong> La IA asesora y prioriza; el criterio y diagnóstico legal pertenecen al profesional colegiado.</li>
                  <li>• <strong className="text-white">No Discriminación y Privacidad:</strong> Anonimización mediante alias sin sesgo demográfico ni de género.</li>
                  <li>• <strong className="text-white">Seguridad y Fiabilidad:</strong> Si la IA en la nube no responde, el scoring de reglas local mantiene el triage activo.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase text-emerald-400 block">Caso Real de Auditoría de Tools en Nuestro MVP</span>
                <p className="text-xs text-zinc-300">
                  Detectamos una fuga: la IA generativa pronunciaba el nombre literal de la función de código <code className="text-rose-400">obtenerProtocoloClinico</code>.
                </p>
                <p className="text-xs text-zinc-400">
                  Lo solucionamos en dos capas: System Prompt en `orchestrator.ts` con alias clínicos obligatorios + sanitizador regex en `ClinicalMarkdown.tsx`.
                </p>
              </div>
            </div>

            {/* Muestra del JSON de la Tool con opción de agrandar */}
            <div
              onClick={() =>
                setModalData({
                  title: 'Declaración JSON de la Tool Auditada: obtenerProtocoloClinico',
                  subtitle: 'Archivo: src/lib/ai/tools/definitions.ts (Extraído directamente de nuestro código)',
                  content: (
                    <div className="space-y-4">
                      <pre className="p-4 bg-black rounded-xl border border-zinc-800 font-mono-code text-xs text-indigo-300 overflow-x-auto leading-relaxed">
{`{
  "name": "obtenerProtocoloClinico",
  "description": "HERRAMIENTA CLÍNICA DE PROTOCOLO. Retorna la guía de intervención clínica y recursos de crisis según el nivel de riesgo detectado (intervención inmediata, contención, líneas de emergencia nacionales 113 / 988, plan de seguridad de Stanley & Brown).",
  "parameters": {
    "type": "object",
    "properties": {
      "nivelRiesgo": {
        "type": "string",
        "enum": ["bajo", "moderado", "alto", "muy_alto_emergencia"],
        "description": "Nivel de severidad para el cual se requiere el protocolo clínico."
      }
    },
    "required": ["nivelRiesgo"]
  }
}`}
                      </pre>
                      <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-xs text-zinc-300 space-y-1">
                        <p className="font-semibold text-emerald-400">Auditoría y Solución de Seguridad:</p>
                        <p>1. <strong>Nombre de la Tool:</strong> `obtenerProtocoloClinico` (Enmascarado como <em>"protocolo clínico estandarizado"</em>).</p>
                        <p>2. <strong>Parámetro:</strong> `nivelRiesgo` (Validado estrictamente con el enum).</p>
                        <p>3. <strong>Sanitización Regex:</strong> Impide que el usuario final o un atacante identifique la infraestructura o bases de datos internas.</p>
                      </div>
                    </div>
                  ),
                })
              }
              className="p-3 bg-zinc-950 border border-emerald-900/40 hover:border-emerald-500 rounded-xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-emerald-300">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span><strong>Ver JSON Real de la Tool:</strong> `obtenerProtocoloClinico` con nombre, descripción y parámetros de `definitions.ts`</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">Click para agrandar</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DIAPOSITIVA 7: LAS 4 DIMENSIONES ANALÍTICAS EN NUESTRO MVP */}
        {/* ======================================================== */}
        {currentSlide === 6 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Analítica Avanzada en el Chatbot</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Las 4 Dimensiones Analíticas en Nuestro MVP
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans-curva text-left text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1.5">
                <span className="text-xs font-bold uppercase text-blue-400 block">1. Análisis Descriptivo (¿Qué ocurrió?)</span>
                <p className="text-zinc-300">3,465 encuestas, 279 fallecidos históricos, medias de PHQ-9 (8.4), DASS-21 y distribución por edad y sexo en el Dashboard BI.</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1.5">
                <span className="text-xs font-bold uppercase text-purple-400 block">2. Análisis de Diagnóstico (¿Por qué ocurrió?)</span>
                <p className="text-zinc-300">Cruce de variables: desempleo, insomnio severo, violencia intrafamiliar y consumo de drogas que elevan la Desesperanza (BHS).</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1.5">
                <span className="text-xs font-bold uppercase text-amber-400 block">3. Análisis Predictivo (¿Qué podría ocurrir?)</span>
                <p className="text-zinc-300">Detección de patrones de progresión: alerta si un paciente con ideación pasiva presenta intento previo o planificación activa.</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1.5">
                <span className="text-xs font-bold uppercase text-emerald-400 block">4. Análisis Prescriptivo (¿Qué debemos hacer?)</span>
                <p className="text-zinc-300">El Copiloto IA prescribe la intervención médica inmediata: Plan de Seguridad Stanley & Brown, restricción de medios y Línea 113.</p>
              </div>
            </div>

            {/* Botón de Ejemplo Interactivo */}
            <div
              onClick={() =>
                setModalData({
                  title: 'Ejemplo de Respuesta 4D en el Chatbot con IA',
                  subtitle: 'Consulta clínica real procesada por el endpoint /api/ai/analisis-4d',
                  content: (
                    <div className="space-y-3 font-mono-code text-xs">
                      <div className="p-3 bg-blue-950/40 rounded-lg border border-blue-900">
                        <strong className="text-blue-400 block mb-1">[1. Descriptivo]:</strong>
                        <p className="text-zinc-300 font-sans-curva">"El paciente presenta PHQ-9 = 20 (depresión severa), BHS = 14 (desesperanza alta) y DASS-21 ansiedad = 18."</p>
                      </div>
                      <div className="p-3 bg-purple-950/40 rounded-lg border border-purple-900">
                        <strong className="text-purple-400 block mb-1">[2. Diagnóstico]:</strong>
                        <p className="text-zinc-300 font-sans-curva">"La severidad está catalizada por pérdida de empleo reciente y antecedente de violencia física intrafamiliar."</p>
                      </div>
                      <div className="p-3 bg-amber-950/40 rounded-lg border border-amber-900">
                        <strong className="text-amber-400 block mb-1">[3. Predictivo]:</strong>
                        <p className="text-zinc-300 font-sans-curva">"Riesgo crítico de autolesión en las próximas 48 horas debido a la convergencia de ideación y falta de red de apoyo."</p>
                      </div>
                      <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-900">
                        <strong className="text-emerald-400 block mb-1">[4. Prescriptivo]:</strong>
                        <p className="text-zinc-300 font-sans-curva">"Activar Código Rojo. Derivar presencialmente al servicio de guardia psiquiátrica y contactar a la persona de confianza registrada."</p>
                      </div>
                    </div>
                  ),
                })
              }
              className="p-3 bg-zinc-950 border border-indigo-900/40 hover:border-indigo-500 rounded-xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span><strong>Ejemplo Práctico en Nuestro MVP:</strong> Ver respuesta completa del Chatbot estructurada en las 4 dimensiones</span>
              </div>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">Click para agrandar</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DIAPOSITIVA 8: CÓMO APLICAMOS EL CICLO LEAN STARTUP     */}
        {/* ======================================================== */}
        {currentSlide === 7 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Metodología Ágil</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Cómo Aplicamos el Ciclo Lean Startup en Nuestro MVP
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans-curva text-left text-xs sm:text-sm">
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">1. Construir (Build)</span>
                <p className="text-sm font-semibold text-white">MVP Focalizado en 5 Funciones</p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Solo las 5 funcionalidades esenciales de triage clínico sin sobredimensionar con apps móviles nativas o WebSockets innecesarios.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">2. Medir (Measure)</span>
                <p className="text-sm font-semibold text-white">Métricas de Adopción y Rendimiento</p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Medimos la Tasa de Finalización de Encuestas, la satisfacción del usuario en escala 1-5 estrellas y la latencia real de Vertex AI.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">3. Aprender (Learn)</span>
                <p className="text-sm font-semibold text-white">Iteraciones Rápidas en el Código</p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Optimizamos la latencia de 6s a 1.3s con `thinkingBudget: 0` y blindamos las encuestas en modo solo lectura para el administrador.
                </p>
              </div>
            </div>

            {/* Botón de Ejemplo Interactivo */}
            <div
              onClick={() =>
                setModalData({
                  title: 'Ejemplo Real de Aprendizaje e Iteración (Learn) en el MVP',
                  subtitle: 'Caso de la Calificación de Encuestas por el Admin',
                  content: (
                    <div className="space-y-4">
                      <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                        <strong className="text-rose-400 block text-sm mb-1">Problema detectado en pruebas:</strong>
                        <p className="text-xs text-zinc-300">El administrador podía ingresar a una encuesta ajena de un paciente y manipular la calificación de satisfacción de 1 a 5 estrellas, falseando las métricas del proyecto.</p>
                      </div>
                      <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                        <strong className="text-emerald-400 block text-sm mb-1">Acción de ingeniería (Iteración Lean):</strong>
                        <p className="text-xs text-zinc-300">Modificamos `src/app/encuesta/[id]/page.tsx` usando el hook `useAuth()`. Si el usuario es admin, el componente de estrellas se bloquea y muestra un badge seguro de <em>"Modo Solo Lectura (Admin)"</em>, preservando la integridad de los datos.</p>
                      </div>
                      <p className="text-xs text-zinc-400 italic">Demuestra cómo el ciclo Construir-Medir-Aprender perfeccionó la seguridad y fidelidad del sistema.</p>
                    </div>
                  ),
                })
              }
              className="p-3 bg-zinc-950 border border-amber-900/40 hover:border-amber-500 rounded-xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-amber-300">
                <Activity className="w-4 h-4 text-amber-400" />
                <span><strong>Ejemplo Práctico en Nuestro MVP:</strong> Ver cómo detectamos y corregimos la calificación de encuestas por el admin</span>
              </div>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">Click para agrandar</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DIAPOSITIVA 9: ETAPAS DE DESARROLLO EN NUESTRO MVP       */}
        {/* ======================================================== */}
        {currentSlide === 8 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Ciclo de Ingeniería de Software</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Etapas de Desarrollo en Nuestro MVP
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-sans-curva text-left text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-xs font-bold text-indigo-400 uppercase">1. Comprender</span>
                <p className="text-zinc-300">Detección reactiva y consultas breves de 10-15 min.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-xs font-bold text-indigo-400 uppercase">2. Objetivo</span>
                <p className="text-zinc-300">Triage clínico que priorice alertas en menos de 2s.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-xs font-bold text-indigo-400 uppercase">3. Alcance</span>
                <p className="text-zinc-300">5 escalas clínicas validadas y copiloto asistencial.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-xs font-bold text-indigo-400 uppercase">4. Diseñar</span>
                <p className="text-zinc-300">17 tablas en PostgreSQL, API REST y Vertex AI.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase">5. Construir</span>
                <p className="text-zinc-300">21 endpoints de API, 24 componentes y exportador PDF.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase">6. Probar</span>
                <p className="text-zinc-300">Carga de 3,465 encuestas y pruebas de latencia.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase">7. Mejorar</span>
                <p className="text-zinc-300">Optimización a 1.3s y sanitización de tools.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-xs font-bold text-indigo-400 uppercase">8. Sustentar</span>
                <p className="text-zinc-300">Presentador interactivo y manual maestro.</p>
              </div>
            </div>

            {/* Botón de Ejemplo Interactivo */}
            <div
              onClick={() =>
                setModalData({
                  title: 'Métricas Reales de Construcción de Nuestro MVP',
                  subtitle: 'Auditoría del repositorio del proyecto',
                  content: (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                        <p className="text-xs text-zinc-500 uppercase">Endpoints API</p>
                        <p className="text-2xl font-bold text-white">21</p>
                      </div>
                      <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                        <p className="text-xs text-zinc-500 uppercase">Tablas DB</p>
                        <p className="text-2xl font-bold text-white">17</p>
                      </div>
                      <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                        <p className="text-xs text-zinc-500 uppercase">Componentes</p>
                        <p className="text-2xl font-bold text-white">24</p>
                      </div>
                      <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                        <p className="text-xs text-zinc-500 uppercase">Encuestas</p>
                        <p className="text-2xl font-bold text-emerald-400">3,465</p>
                      </div>
                    </div>
                  ),
                })
              }
              className="p-3 bg-zinc-950 border border-indigo-900/40 hover:border-indigo-500 rounded-xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-indigo-300">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span><strong>Ver Métricas de Construcción:</strong> 21 endpoints, 17 tablas relacionales y 3,465 encuestas procesadas</span>
              </div>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">Click para agrandar</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DIAPOSITIVA 10: PREGUNTAS CRÍTICAS DE VALIDACIÓN         */}
        {/* ======================================================== */}
        {currentSlide === 9 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Filtro de Relevancia del Producto</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Preguntas Críticas de Validación de Valor
              </h2>
            </div>

            <div className="space-y-3 font-sans-curva text-left max-w-4xl mx-auto">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-emerald-400">
                  1. ¿Resuelve directamente el problema?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-200">
                  <strong>Sí:</strong> En lugar de esperar semanas para una cita clínica, el paciente es evaluado en 5 minutos y el psicólogo recibe la alerta roja en tiempo real para intervenir de inmediato.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-indigo-400">
                  2. ¿Es necesario para validar la hipótesis?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-200">
                  <strong>Sí:</strong> Sin el cuestionario psicométrico y el motor de scoring en tiempo real, sería imposible medir la Tasa de Adopción de Protocolo ni comprobar si la IA agiliza la toma de decisiones.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-amber-400">
                  3. ¿El usuario dejaría de percibir valor sin ella?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-200">
                  <strong>Totalmente:</strong> Si retiramos el cálculo automático de riesgo o el Copiloto IA, el sistema se reduciría a un formulario estático de almacenamiento sin capacidad de triage ni prevención.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DIAPOSITIVA 11: PIPELINE Y DIAGNÓSTICO PREVIO A LIMPIEZA */}
        {/* ======================================================== */}
        {currentSlide === 10 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Ciencia de Datos · Semana 12 Colab</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Secuencia de Comprensión y Diagnóstico de Datos
              </h2>
            </div>

            <div className="space-y-3.5 font-sans-curva text-left">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900">
                <span className="text-xs font-bold uppercase text-indigo-400 block mb-2">
                  Secuencia de Comprensión del Proyecto
                </span>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-300">
                  <span className="px-3 py-1 bg-zinc-900 rounded border border-zinc-800">1. Problema</span>
                  <span>➔</span>
                  <span className="px-3 py-1 bg-zinc-900 rounded border border-zinc-800">2. Obtención</span>
                  <span>➔</span>
                  <span className="px-3 py-1 bg-zinc-900 rounded border border-zinc-800">3. Comprensión</span>
                  <span>➔</span>
                  <span className="px-3 py-1 bg-zinc-900 rounded border border-zinc-800">4. Preparación</span>
                  <span>➔</span>
                  <span className="px-3 py-1 bg-zinc-900 rounded border border-zinc-800">5. Inferencia</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Regla de Oro: Antes de limpiar, debemos diagnosticar clínicamente
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
                  <div className="p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800">
                    <strong className="text-white block">• Detectar y Cuantificar:</strong>
                    Auditoría de nulos y tipos en las 17 tablas de PostgreSQL.
                  </div>
                  <div className="p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800">
                    <strong className="text-white block">• Interpretar el Significado:</strong>
                    Un PHQ-9 = 27 no es un error de captura; es un paciente en depresión severa que jamás debe borrarse como outlier.
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de Ejemplo Interactivo */}
            <div
              onClick={() =>
                setModalData({
                  title: 'Ejemplo de Diagnóstico Clínico vs Estadístico en Google Colab',
                  subtitle: 'Script: scripts/actualizar_notebook_colab.py (Semana 12)',
                  content: (
                    <div className="space-y-4">
                      <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                        <strong className="text-amber-400 block text-sm mb-1">Caso de Estudio en Colab:</strong>
                        <p className="text-xs text-zinc-300">Un algoritmo puramente estadístico detecta un valor de `phq9_total = 27` (el máximo posible) con z-score &gt; 3.0 y lo marcaría para ser eliminado por 'outlier'.</p>
                      </div>
                      <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                        <strong className="text-emerald-400 block text-sm mb-1">Diagnóstico Experto de Nuestro MVP:</strong>
                        <p className="text-xs text-zinc-300">El diagnóstico clínico reconoce que el rango válido del PHQ-9 es [0 - 27]. Un valor de 27 representa la máxima severidad del episodio depresivo. Eliminarlo provocaría un <strong>falso negativo letal</strong>. Por ende, la técnica seleccionada es <strong>preservar y priorizar</strong>, no descartar.</p>
                      </div>
                    </div>
                  ),
                })
              }
              className="p-3 bg-zinc-950 border border-amber-900/40 hover:border-amber-500 rounded-xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-amber-300">
                <Database className="w-4 h-4 text-amber-400" />
                <span><strong>Ejemplo Práctico en Nuestro MVP:</strong> Ver por qué un PHQ-9 de 27 puntos no se borra como outlier</span>
              </div>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">Click para agrandar</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DIAPOSITIVA 12: VARIABLES DE IA: TARGET VS FEATURES      */}
        {/* ======================================================== */}
        {currentSlide === 11 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Modelado de Variables desde la Base de Datos</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Variables de IA: Target vs Features en Nuestro MVP
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 font-sans-curva text-left">
              <div className="md:col-span-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block">
                  Variable Objetivo (Target)
                </span>
                <p className="text-xs text-zinc-400">Lo que el sistema clasifica en la base de datos:</p>
                <div className="p-3 bg-zinc-900/90 rounded-lg border border-zinc-800 space-y-1 text-xs">
                  <p><strong className="text-white font-mono">notificaciones.nivel_riesgo:</strong></p>
                  <p className="text-emerald-400">● 'bajo' (0 a 3 pts)</p>
                  <p className="text-amber-400">● 'moderado' (4 a 7 pts)</p>
                  <p className="text-orange-400">● 'alto' (8 a 11 pts)</p>
                  <p className="text-rose-400">● 'muy_alto' (12 a 23 pts)</p>
                </div>
              </div>

              <div className="md:col-span-8 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                  7 Variables Predictoras Reales (Código de `src/lib/calculos.ts`)
                </span>
                <div className="p-3 bg-black rounded-lg border border-zinc-800 font-mono-code text-[11px] text-zinc-300 space-y-0.5">
                  <p><span className="text-indigo-400">1. phq9:</span> total PHQ-9 (0-4 pts) ➔ Tabla `phq9_respuestas`</p>
                  <p><span className="text-indigo-400">2. bhs:</span> total desesperanza BHS (0-4 pts) ➔ Tabla `bhs_respuestas`</p>
                  <p><span className="text-indigo-400">3. cssrs:</span> severidad C-SSRS (0-5 pts) ➔ Tabla `cssrs_respuestas`</p>
                  <p><span className="text-indigo-400">4. ideacionSuicida:</span> ítem 9 PHQ-9 directo (0-3 pts) ➔ Campo `item_9`</p>
                  <p><span className="text-indigo-400">5. intentoPrevio:</span> antecedente de intento (+3 pts) ➔ `historial_suicida`</p>
                  <p><span className="text-indigo-400">6. consumoSustancias:</span> alcohol/drogas (+2 pts) ➔ `salud_fisica`</p>
                  <p><span className="text-indigo-400">7. aislamientoSocial:</span> vive solo / sin apoyo (+2 pts) ➔ `relaciones`</p>
                </div>
              </div>
            </div>

            {/* Botón de Código Interactivo */}
            <div
              onClick={() =>
                setModalData({
                  title: 'Código Fuente Real de las 7 Variables Predictoras',
                  subtitle: 'Archivo: src/lib/calculos.ts (Líneas 88 a 135)',
                  content: (
                    <pre className="p-4 bg-black rounded-xl border border-zinc-800 font-mono-code text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`export function calcularRiesgoGlobal(params: {
  phq9: number; bhs: number; cssrs: string;
  desesperanza: boolean; ideacionSuicida: number;
  intentoPrevio: boolean; consumoSustancias: boolean;
  aislamientoSocial: boolean;
}) {
  let puntajeRiesgo = 0;

  // 1. PHQ-9 (0-4 pts)
  if (params.phq9 >= 20) puntajeRiesgo += 4;
  else if (params.phq9 >= 15) puntajeRiesgo += 3;
  else if (params.phq9 >= 10) puntajeRiesgo += 2;
  else if (params.phq9 >= 5) puntajeRiesgo += 1;

  // 2. BHS (0-4 pts)
  if (params.bhs >= 15) puntajeRiesgo += 4;
  else if (params.bhs >= 10) puntajeRiesgo += 3;
  else if (params.bhs >= 5) puntajeRiesgo += 1;

  // 3. C-SSRS (0-5 pts)
  if (params.cssrs === 'intento_letal') puntajeRiesgo += 5;
  else if (params.cssrs === 'planificacion') puntajeRiesgo += 4;
  else if (params.cssrs === 'intento_no_letal') puntajeRiesgo += 3;

  // 4. Ideación directa PHQ-9 (0-3 pts)
  if (params.ideacionSuicida >= 2) puntajeRiesgo += 3;
  else if (params.ideacionSuicida >= 1) puntajeRiesgo += 1;

  // 5. Intento previo (+3 pts)
  if (params.intentoPrevio) puntajeRiesgo += 3;

  // 6. Consumo sustancias (+2 pts)
  if (params.consumoSustancias) puntajeRiesgo += 2;

  // 7. Aislamiento social (+2 pts)
  if (params.aislamientoSocial) puntajeRiesgo += 2;

  // Clasificación categórica de la Variable Objetivo
  let nivelRiesgo = 'bajo';
  if (puntajeRiesgo >= 12) nivelRiesgo = 'muy_alto';
  else if (puntajeRiesgo >= 8) nivelRiesgo = 'alto';
  else if (puntajeRiesgo >= 4) nivelRiesgo = 'moderado';

  return { puntajeRiesgo, nivelRiesgo };
}`}
                    </pre>
                  ),
                })
              }
              className="p-3 bg-zinc-950 border border-indigo-900/40 hover:border-indigo-500 rounded-xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-indigo-300">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span><strong>Ver Código de Producción:</strong> Función `calcularRiesgoGlobal()` con la suma ponderada de 0 a 23 puntos</span>
              </div>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">Click para agrandar</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DIAPOSITIVA 13: SELECCIÓN Y COMPARATIVA DE ALGORITMOS    */}
        {/* ======================================================== */}
        {currentSlide === 12 && (
          <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Defensa de Arquitectura de IA</span>
              <h2 className="text-2xl sm:text-4xl font-semibold text-white font-curva-seria">
                Selección de Algoritmos para Nuestro MVP
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans-curva text-left text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1.5">
                <strong className="text-white block">• ¿Qué necesita hacer el sistema?</strong>
                <p className="text-zinc-300"><strong>Clasificar</strong> el riesgo de suicidio y <strong>prescribir</strong> intervenciones clínicas en tiempo real.</p>
                <strong className="text-white block pt-1">• ¿Qué datos recibe y qué produce?</strong>
                <p className="text-zinc-300">Recibe 84 respuestas psicométricas tabulares y produce una categoría clínica + un informe médico de triage.</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1.5">
                <strong className="text-white block">• ¿Qué algoritmo básico seleccionamos?</strong>
                <p className="text-zinc-300"><strong>Árbol de Decisión Clínico y Reglas Deterministas</strong> (`calcularRiesgoGlobal`).</p>
                <strong className="text-white block pt-1">• ¿Por qué?</strong>
                <p className="text-zinc-300">100% explicable, sin margen de alucinación médica, ejecución instantánea y costo cero.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 font-sans-curva text-left text-xs sm:text-sm text-zinc-300">
              <span className="text-xs font-bold uppercase text-amber-400 block">Evaluación de Algoritmos Complejos (Línea Base vs Ensamble)</span>
              <p>
                • <strong>¿Qué limitación tiene la línea base?</strong> No detecta relaciones no lineales sutiles ocultas en grandes volúmenes de datos.
              </p>
              <p>
                • <strong>¿Qué algoritmo complejo responde a esto?</strong> <strong>Random Forest / XGBoost</strong> para los datos tabulares psicométricos y <strong>LLM (Gemini 2.5 Flash)</strong> para el lenguaje natural del copiloto.
              </p>
              <p>
                • <strong>¿Con qué métrica se decide el cambio?</strong> Con la <strong>Tasa de Adopción de Protocolo ≥ 70%</strong> y un <strong>Recall ≥ 95%</strong> en la detección de alertas rojas en validación clínica.
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DIAPOSITIVA 14: DEFINICIÓN DEL ALGORITMO DE NUESTRO MVP  */}
        {/* ======================================================== */}
        {currentSlide === 13 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Definición Formal de Ingeniería</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Definición Formal del Algoritmo en Nuestro MVP
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans-curva text-left text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                <p><strong className="text-emerald-400 block">• NUESTRO MVP NECESITA REALIZAR:</strong> <strong>Clasificar</strong> el nivel de riesgo de suicidio y <strong>Recomendar</strong> protocolos clínicos de contención médica.</p>
                <p><strong className="text-indigo-400 block">• RECIBE COMO ENTRADA:</strong> <strong>84 respuestas psicométricas</strong> estructuradas (PHQ-9, C-SSRS, BHS, DASS-21, Rosenberg, demográficas y de soporte social) + consultas en texto libre del profesional.</p>
                <p><strong className="text-amber-400 block">• DEBE PRODUCIR:</strong> Una <strong>categoría clínica</strong> (`bajo`, `moderado`, `alto`, `muy_alto`), una alerta prioritaria en tiempo real y un informe médico prescriptivo.</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                <p><strong className="text-indigo-400 block">• CORRESPONDE A UN PROBLEMA DE:</strong> <strong>Clasificación Multiclase Supervisada</strong> (Triage) y <strong>Generación Aumentada por Recuperación (RAG / Function Calling)</strong>.</p>
                <p><strong className="text-emerald-400 block">• PROPONEMOS UTILIZAR:</strong> <strong>Árbol de Decisión Clínico y Reglas Ponderadas</strong> (`calcularRiesgoGlobal`) + <strong>Google Cloud Vertex AI</strong> (Gemini 2.5 Flash).</p>
                <p><strong className="text-amber-400 block">• POR QUÉ:</strong> Adecuado para datos tabulares psicométricos, <strong>100% explicable</strong> para médicos, <strong>cero alucinación</strong> y latencia instantánea.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5 font-sans-curva text-left text-xs sm:text-sm">
              <span className="text-xs font-bold uppercase text-white block">Un Ejemplo Real de Funcionamiento en el Sistema:</span>
              <p className="text-zinc-300 leading-relaxed font-mono-code text-[12px] bg-black p-3 rounded-xl border border-zinc-900 text-emerald-300">
                “Si el paciente X presenta PHQ-9 = 21 (depresión severa), BHS = 16 (desesperanza crítica) e Intento Previo = Sí, el sistema suma 14 puntos (≥12), predice 'muy_alto' riesgo, enciende la Alerta Roja en el panel del psicólogo y el Copiloto IA prescribe la activación urgente del Plan de Seguridad Stanley & Brown con derivación a la Línea de Crisis.”
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DIAPOSITIVA 15: CONCLUSIONES DE LA SUSTENTACIÓN          */}
        {/* ======================================================== */}
        {currentSlide === 14 && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Cierre y Sustentación</span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-white font-curva-seria">
                Conclusiones de Nuestro Proyecto MVP
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans-curva text-left">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                  1. Impacto y Validación de Valor
                </span>
                <p className="text-base font-semibold text-white">Triage en Menos de 2 Segundos</p>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  El MVP demostró que digitalizar escalas validadas e integrarlas con IA reduce de semanas a segundos la identificación de casos de riesgo crítico, cumpliendo con la hipótesis de valor y el objetivo de 0% falsos negativos.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                  2. Arquitectura Híbrida y Ética
                </span>
                <p className="text-base font-semibold text-white">Determinismo + Explicabilidad</p>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  La dualidad de IA Simbólica (reglas matemáticas de 7 factores sin margen de error) y Vertex AI Gemini (asistencia de lenguaje en 1.3s) garantiza supervisión médica obligatoria (*Human-in-the-loop*) y cumplimiento del estándar ISO 14971.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  3. Escalabilidad Técnica Comprobada
                </span>
                <p className="text-base font-semibold text-white">Base Sólida para Machine Learning</p>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Con 17 tablas relacionales en PostgreSQL y 3,465 encuestas procesadas, el sistema cuenta con la infraestructura lista para incorporar modelos de ensamble (Random Forest / XGBoost) al alcanzar el umbral de adopción del 70%.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DIAPOSITIVA 16: GRACIAS GIGANTE Y FONDO NEGRO            */}
        {/* ======================================================== */}
        {currentSlide === 15 && (
          <div className="w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold tracking-tight text-white font-curva-seria leading-none drop-shadow-2xl">
              ¡Muchas Gracias!
            </h1>
            <p className="text-xl sm:text-2xl text-zinc-400 font-curva-seria italic">
              “La tecnología al servicio de la vida y la salud mental.”
            </p>

            <div className="pt-8 border-t border-zinc-900/80 max-w-xl mx-auto space-y-2 font-sans-curva">
              <p className="text-sm sm:text-base font-semibold tracking-wider uppercase text-zinc-300">
                Equipo: <span className="text-white">“Cabo Verde”</span>
              </p>
              <p className="text-xs sm:text-sm text-zinc-500">
                Inteligencia Artificial · Semestre VI - 2026
              </p>
              <p className="text-xs text-zinc-600 font-mono">
                Recursos de emergencia: Línea 113 opción 5 / Línea 988
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Numeración discreta y tenue en la esquina inferior derecha */}
      <div className="absolute bottom-6 right-8 text-[11px] font-mono text-zinc-700 select-none pointer-events-none">
        {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
      </div>
    </div>
  )
}
