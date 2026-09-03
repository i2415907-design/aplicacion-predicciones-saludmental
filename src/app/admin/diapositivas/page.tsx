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
  UserCheck,
  Target,
  ArrowRight,
  ListChecks,
  Sliders,
  PlayCircle,
  HelpCircle,
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
      {/* MODAL INTERACTIVO DE ZOOM PARA DETALLES TÉCNICOS         */}
      {/* ======================================================== */}
      {modalData && (
        <div className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 sm:p-12 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full max-w-4xl max-h-[85vh] bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block">Evidencia y Detalle Técnico del PMV</span>
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
        {/* DIAPOSITIVA 0: FRASE REALISTA Y DATOS (CITA INICIAL)     */}
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
        {/* PARTE 1: PRESENTACIÓN DEL PROYECTO (PORTADA DEL PMV)     */}
        {/* ======================================================== */}
        {currentSlide === 1 && (
          <div className="w-full max-w-5xl text-center space-y-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="space-y-3">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Rúbrica Oficial · Parte 1: Presentación</span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white font-curva-seria leading-tight">
                Sistema de Asistencia Clínica y Triage Preventivo en Salud Mental
              </h1>
              <p className="text-base sm:text-xl text-zinc-300 font-curva-seria italic max-w-3xl mx-auto pt-2">
                “Identificación temprana y priorización automatizada del riesgo de depresión y conducta suicida mediante triage inteligente para psicólogos y profesionales de salud.”
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-zinc-900 font-sans-curva">
              <p className="text-base font-semibold tracking-wider uppercase text-zinc-500">
                Curso: <span className="text-zinc-200 font-bold">Inteligencia Artificial</span> · Docente: <span className="text-zinc-100 font-bold font-curva-seria">Mg. KAREM MERCEDES MALDONADO CORDOVA</span>
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-900 font-sans-curva">
              <p className="text-base font-bold tracking-wider uppercase text-zinc-400">
                Equipo: <span className="text-white underline decoration-indigo-500 underline-offset-8">“Cabo Verde”</span> (Semestre VI - 2026)
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto text-left">
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 transition-all">
                  <p className="text-sm sm:text-base font-semibold text-zinc-200">• Arones Romani Henry</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 transition-all">
                  <p className="text-sm sm:text-base font-semibold text-zinc-200">• Inga Quispe Diego Anthony</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 transition-all">
                  <p className="text-sm sm:text-base font-semibold text-zinc-200">• Paucar Torres Gabriel Emerando</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 transition-all">
                  <p className="text-sm sm:text-base font-semibold text-zinc-200">• Ponce Otarola Jarem Antonio</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PARTE 2: PROBLEMA IDENTIFICADO                           */}
        {/* ======================================================== */}
        {currentSlide === 2 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Secuencia: Problema · Parte 2</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                El Problema: Detección Tardía y Triage Reactivo
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans-curva text-left text-xs sm:text-sm">
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase text-rose-400 block">Situación Actual y Consecuencias</span>
                <p className="text-zinc-200 leading-relaxed">
                  • <strong>+720,000 muertes por suicidio anuales (OMS)</strong>; causa #1 de discapacidad mundial por depresión.
                </p>
                <p className="text-zinc-300 leading-relaxed">
                  • <strong>4ta causa de muerte en jóvenes de 15 a 29 años</strong>, con aumento del 17% en América Latina.
                </p>
                <p className="text-zinc-400">
                  Consecuencia: Pérdida evitable de vidas por falta de detección oportuna de ideación y desesperanza.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase text-amber-400 block">Dificultad Concreta en el Proceso de Atención</span>
                <p className="text-zinc-200 leading-relaxed">
                  • <strong>Consultas saturadas de 10 a 15 minutos:</strong> Tiempo insuficiente para aplicar manualmente 5 escalas clínicas (84 ítems).
                </p>
                <p className="text-zinc-300 leading-relaxed">
                  • <strong>Detección reactiva:</strong> El paciente solo recibe auxilio cuando ya consumó una autolesión o está en sala de urgencias.
                </p>
                <p className="text-zinc-400">
                  Brecha: Falta de un mecanismo digital estandarizado de tamizaje previo a la consulta.
                </p>
              </div>
            </div>

            {/* Evidencia interactiva */}
            <div
              onClick={() =>
                setModalData({
                  title: 'Evidencia del Problema: Datos Epidemiológicos y Triage Manual',
                  subtitle: 'Fuentes: OMS / Censo Epidemiológico de Salud Mental',
                  content: (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                        <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-900">
                          <p className="text-xs text-rose-400 uppercase">Mortalidad Anual</p>
                          <p className="text-2xl font-bold text-white">720,000+</p>
                          <p className="text-[10px] text-zinc-400">1 cada 40 segundos</p>
                        </div>
                        <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-900">
                          <p className="text-xs text-amber-400 uppercase">Tiempo Consulta Médica</p>
                          <p className="text-2xl font-bold text-white">10 - 15 min</p>
                          <p className="text-[10px] text-zinc-400">Insuficiente para 84 ítems</p>
                        </div>
                        <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-900">
                          <p className="text-xs text-indigo-400 uppercase">Señales Previas</p>
                          <p className="text-2xl font-bold text-white">&gt; 70%</p>
                          <p className="text-[10px] text-zinc-400">Emiten avisos no detectados</p>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-300">En nuestro dataset histórico se registraron 279 fallecimientos (277 por causas voluntarias de suicidio), evidenciando que sin herramientas preventivas, el sistema de salud llega siempre tarde.</p>
                    </div>
                  ),
                })
              }
              className="p-3 bg-zinc-950 border border-rose-900/40 hover:border-rose-500 rounded-xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span><strong>Evidencia del Problema:</strong> Ver datos de saturación de consultas de 10-15 min y brecha de detección</span>
              </div>
              <span className="text-[11px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">Click para agrandar</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PARTE 3: OBJETIVO DEL PMV                                */}
        {/* ======================================================== */}
        {currentSlide === 3 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Secuencia: Problema · Parte 3</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Objetivo Concreto del PMV
              </h2>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-4 font-sans-curva text-left max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <Target className="w-8 h-8 text-indigo-400 shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white font-curva-seria">
                    Objetivo General del PMV
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                    Desarrollar una plataforma web de triage clínico que <strong>clasifique automáticamente</strong> el nivel de riesgo de depresión y conducta suicida en <strong>menos de 2 segundos</strong>, y <strong>recomiende</strong> protocolos de intervención asistencial en tiempo real para apoyar la toma de decisiones del psicólogo de turno.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-900 text-xs">
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1">
                  <strong className="text-indigo-400 block uppercase">1. Automatizar</strong>
                  <p className="text-zinc-300">Cálculo de puntajes en 5 escalas psicométricas (PHQ-9, C-SSRS, BHS, DASS-21, Rosenberg).</p>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1">
                  <strong className="text-indigo-400 block uppercase">2. Clasificar</strong>
                  <p className="text-zinc-300">Asignar nivel de riesgo compuesto: Bajo (0-3), Moderado (4-7), Alto (8-11), Muy Alto (12+).</p>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1">
                  <strong className="text-emerald-400 block uppercase">3. Apoyar</strong>
                  <p className="text-zinc-300">Copiloto Clínico de IA que prescribe el plan de seguridad y recursos de crisis en 1.3s.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PARTE 4: USUARIO Y NECESIDAD                             */}
        {/* ======================================================== */}
        {currentSlide === 4 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Secuencia: Problema · Parte 4</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Usuario y Necesidad: Los Dos Actores del Sistema
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans-curva text-left text-xs sm:text-sm">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
                <span className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" /> Actor 1: Paciente / Encuestado
                </span>
                <p className="text-sm font-semibold text-white">Estudiante o persona en riesgo psicológico</p>
                <ul className="space-y-1.5 text-zinc-300 text-xs">
                  <li>• <strong>Necesidad:</strong> Autoevaluación confidencial, anónima y sin estigma.</li>
                  <li>• <strong>Tarea que mejora:</strong> Completar el tamizaje en 5 minutos en cualquier dispositivo.</li>
                  <li>• <strong>Respuesta recibida:</strong> Acceso inmediato y visible a la Línea de Crisis 113 / 988 y reporte en PDF descargable.</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
                <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Actor 2: Psicólogo / Médico de Turno
                </span>
                <p className="text-sm font-semibold text-white">Profesional de salud mental administrador</p>
                <ul className="space-y-1.5 text-zinc-300 text-xs">
                  <li>• <strong>Necesidad:</strong> Priorización inmediata de casos críticos para no perder tiempo.</li>
                  <li>• <strong>Decisión que mejora:</strong> Código Rojo automático ante ideación suicida activa.</li>
                  <li>• <strong>Respuesta recibida:</strong> Copiloto Clínico IA contextual que analiza factores de riesgo y redacta el informe en 1.3s.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PARTE 5: PROPUESTA DE SOLUCIÓN                           */}
        {/* ======================================================== */}
        {currentSlide === 5 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Secuencia: Propuesta · Parte 5</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Propuesta de Solución: Funcionamiento General
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 font-sans-curva text-left space-y-4 max-w-4xl mx-auto">
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                El PMV implementa un <strong>flujo continuo de 4 pasos</strong>: el paciente completa el formulario wizard digital (10 pasos, 84 ítems); el backend calcula los baremos psicométricos y pondera el riesgo (0-23 pts); la base de datos genera una notificación prioritaria en tiempo real; y el psicólogo recibe el apoyo del Copiloto IA con Function Calling.
              </p>

              <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 text-xs text-zinc-300 space-y-1">
                <strong className="text-white block font-semibold mb-1">Diferenciación Clave:</strong>
                <p>• <strong>Solución Completa Imaginada:</strong> Seguimiento longitudinal por años, sensores wearables, predicción poblacional y app nativa.</p>
                <p>• <strong>PMV Realmente Desarrollado:</strong> Validación de la propuesta central ➔ <em>Detección temprana estandarizada + Alerta roja inmediata + Asistencia médica con IA</em>.</p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PARTE 6: ALCANCE DEL PMV (INCLUYE / NO INCLUYE)          */}
        {/* ======================================================== */}
        {currentSlide === 6 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Secuencia: Propuesta · Parte 6</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Alcance del PMV: Funcionalidades Implementadas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans-curva text-left text-xs sm:text-sm">
              <div className="p-5 rounded-2xl bg-zinc-950 border border-emerald-950/60 space-y-3">
                <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Funcionalidades Incluidas (En Producción)
                </span>
                <ul className="space-y-1.5 text-zinc-300 text-xs">
                  <li>✔ Formulario wizard de 10 pasos (84 ítems psicométricos).</li>
                  <li>✔ Cálculo de riesgo compuesto (7 factores, 0-23 puntos).</li>
                  <li>✔ Sistema de alertas y notificaciones por gravedad clínica.</li>
                  <li>✔ Panel de administración con filtros por nivel de riesgo.</li>
                  <li>✔ Chatbot Copiloto IA (Vertex AI) con Function Calling.</li>
                  <li>✔ Generación y descarga de reportes clínicos en PDF.</li>
                  <li>✔ Dashboard BI con gráficos y medias epidemiológicas.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
                <span className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                  <X className="w-4 h-4" /> Excluidas del PMV (Versiones Posteriores)
                </span>
                <ul className="space-y-1.5 text-zinc-400 text-xs">
                  <li>✖ App móvil nativa (se resolvió con web responsive en Next.js).</li>
                  <li>✖ Notificaciones por SMS o WhatsApp (requiere Twilio/costos externos).</li>
                  <li>✖ Chat en tiempo real por WebSockets (polling actual es suficiente).</li>
                  <li>✖ Integración con sensores biométricos y wearables.</li>
                  <li>✖ Predicción longitudinal a meses (requiere historial previo).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PARTE 7: ARQUITECTURA DEL SISTEMA (¿DÓNDE ESTÁ LA IA?)   */}
        {/* ======================================================== */}
        {currentSlide === 7 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Secuencia: PMV · Parte 7</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Arquitectura del Sistema: ¿Dónde está la IA?
              </h2>
            </div>

            {/* Diagrama de Flujo Arquitectural */}
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 font-sans-curva text-center text-xs">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                <span className="text-[10px] text-zinc-500 uppercase block">1. Usuario</span>
                <p className="font-semibold text-white">Paciente</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                <span className="text-[10px] text-zinc-500 uppercase block">2. Entrada</span>
                <p className="font-semibold text-white">84 Ítems</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                <span className="text-[10px] text-zinc-500 uppercase block">3. Backend</span>
                <p className="font-semibold text-white">Next.js API</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-700">
                <span className="text-[10px] text-indigo-400 uppercase font-bold block">4. IA (Núcleo)</span>
                <p className="font-bold text-white">Simbólica + Vertex</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                <span className="text-[10px] text-zinc-500 uppercase block">5. Resultado</span>
                <p className="font-semibold text-white">Código Rojo</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">6. Acción</span>
                <p className="font-bold text-white">Protocolo 113</p>
              </div>
            </div>

            {/* Dónde se encuentra exactamente la IA */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-zinc-300 font-sans-curva text-left space-y-2">
              <strong className="text-white block font-semibold">Ubicación Precisa de la Inteligencia Artificial en el Repositorio:</strong>
              <p>• <strong>Capa 1 (IA Simbólica Local):</strong> En `src/lib/calculos.ts` dentro de `calcularRiesgoGlobal()`, procesando en 2ms los 7 factores de riesgo psicométrico.</p>
              <p>• <strong>Capa 2 (IA Generativa Cloud):</strong> En `src/lib/ai/orchestrator.ts` con Google Vertex AI (Gemini 2.5 Flash), ejecutando Function Calling para consultar la base de datos relacional y prescribir intervenciones en 1.3s.</p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PARTE 8: DATOS UTILIZADOS Y CALIDAD                      */}
        {/* ======================================================== */}
        {currentSlide === 8 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Secuencia: Datos · Parte 8</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Datos Utilizados, Variables y Calidad (Semana 12)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans-curva text-left text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase text-indigo-400 block">Origen y Volumen del Dataset</span>
                <ul className="space-y-1 text-zinc-300 text-xs">
                  <li>• <strong>3,465 encuestas procesadas</strong> con esquema relacional en PostgreSQL.</li>
                  <li>• <strong>17 tablas relacionales y 239 columnas totales</strong> vinculadas por foreign keys.</li>
                  <li>• Censo epidemiológico con 279 fallecimientos históricos registrados.</li>
                  <li>• 5 escalas clínicas validadas internacionalmente (PHQ-9, C-SSRS, BHS, DASS-21, Rosenberg).</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase text-amber-400 block">Diagnóstico Clínico de Calidad (Semana 12 Colab)</span>
                <p className="text-zinc-300 text-xs">
                  Regla de oro aprendida en Google Colab: <em>"Antes de limpiar, debemos diagnosticar clínicamente"</em>.
                </p>
                <p className="text-zinc-400 text-xs">
                  Un puntaje de `PHQ-9 = 27` (máximo posible) no es un outlier que deba eliminarse como ruido; representa un paciente en depresión severa al borde de la crisis que debe preservarse.
                </p>
              </div>
            </div>

            {/* Botón interactivo de resumen del dataset */}
            <div
              onClick={() =>
                setModalData({
                  title: 'Estructura de Datos: Las 17 Tablas de PostgreSQL en el MVP',
                  subtitle: 'Archivo: prisma/schema.prisma (Esquema relacional en producción)',
                  content: (
                    <div className="space-y-3 font-mono-code text-xs">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div className="p-2.5 bg-black rounded border border-zinc-800"><span className="text-indigo-400">encuestas</span> (17 cols)</div>
                        <div className="p-2.5 bg-black rounded border border-zinc-800"><span className="text-indigo-400">phq9_respuestas</span> (13 cols)</div>
                        <div className="p-2.5 bg-black rounded border border-zinc-800"><span className="text-indigo-400">cssrs_respuestas</span> (11 cols)</div>
                        <div className="p-2.5 bg-black rounded border border-zinc-800"><span className="text-indigo-400">bhs_respuestas</span> (23 cols)</div>
                        <div className="p-2.5 bg-black rounded border border-zinc-800"><span className="text-indigo-400">rosenberg_respuestas</span> (12 cols)</div>
                        <div className="p-2.5 bg-black rounded border border-zinc-800"><span className="text-indigo-400">dass21_respuestas</span> (25 cols)</div>
                        <div className="p-2.5 bg-black rounded border border-zinc-800"><span className="text-indigo-400">historial_suicida</span> (8 cols)</div>
                        <div className="p-2.5 bg-black rounded border border-zinc-800"><span className="text-indigo-400">salud_fisica</span> (12 cols)</div>
                        <div className="p-2.5 bg-black rounded border border-zinc-800"><span className="text-emerald-400 font-bold">notificaciones</span> (14 cols)</div>
                      </div>
                      <p className="text-xs text-zinc-400 font-sans-curva">Todas las escalas cuentan con validación estricta de rangos para evitar datos inconsistentes en la inferencia de IA.</p>
                    </div>
                  ),
                })
              }
              className="p-3 bg-zinc-950 border border-indigo-900/40 hover:border-indigo-500 rounded-xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-indigo-300">
                <Database className="w-4 h-4 text-indigo-400" />
                <span><strong>Ver Resumen del Dataset:</strong> 17 tablas relacionales y validaciones de rango psicométrico</span>
              </div>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">Click para agrandar</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PARTE 9: FORMULACIÓN DEL PROBLEMA DE IA                  */}
        {/* ======================================================== */}
        {currentSlide === 9 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Secuencia: Inteligencia Artificial · Parte 9</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Formulación Técnica del Problema de IA
              </h2>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 font-sans-curva text-left space-y-4 max-w-4xl mx-auto">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-indigo-400 block">Definición de la Tarea Técnica</span>
                <p className="text-sm sm:text-base text-zinc-200">
                  El problema se formula como una combinación de dos tareas fundamentales:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2">
                  <strong className="text-emerald-400 block text-sm">1. Clasificación Multiclase Supervisada (Triage)</strong>
                  <p className="text-zinc-300">
                    <strong>Entrada:</strong> Vector de 84 respuestas psicométricas tabulares.
                  </p>
                  <p className="text-zinc-300">
                    <strong>Tarea:</strong> Asignar a cada caso una de 4 categorías de riesgo conocidas (`bajo`, `moderado`, `alto`, `muy_alto`).
                  </p>
                  <p className="text-zinc-300">
                    <strong>Salida:</strong> Código de urgencia y alerta inmediata en la base de datos.
                  </p>
                </div>

                <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2">
                  <strong className="text-indigo-400 block text-sm">2. Generación Aumentada con Herramientas (RAG / Tools)</strong>
                  <p className="text-zinc-300">
                    <strong>Entrada:</strong> Expediente del paciente + consulta del médico en lenguaje natural.
                  </p>
                  <p className="text-zinc-300">
                    <strong>Tarea:</strong> Inferencia de contexto, invocación de Function Calling y formulación clínica.
                  </p>
                  <p className="text-zinc-300">
                    <strong>Salida:</strong> Plan de Seguridad de Stanley & Brown estructurado en PDF.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PARTE 10: ALGORITMO O MODELO UTILIZADO (X e y)           */}
        {/* ======================================================== */}
        {currentSlide === 10 && (
          <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Secuencia: Inteligencia Artificial · Parte 10</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Algoritmo y Variables: X (Entradas) ➔ y (Salida)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans-curva text-left text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase text-indigo-400 block">Variables de Entrada (X) y Salida (y)</span>
                <p className="text-zinc-300 text-xs">
                  <strong>Entradas X (7 features de `calculos.ts`):</strong> PHQ-9 total (0-4 pts), BHS (0-4 pts), C-SSRS (0-5 pts), PHQ-9 ítem 9 (0-3 pts), intento previo (3 pts), sustancias (2 pts), aislamiento (2 pts).
                </p>
                <p className="text-zinc-300 text-xs">
                  <strong>Variable Objetivo y:</strong> `notificaciones.nivel_riesgo` (`bajo`, `moderado`, `alto`, `muy_alto`).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase text-emerald-400 block">Criterio de Selección del Modelo</span>
                <p className="text-zinc-300 text-xs">
                  • <strong>Explicabilidad médica obligatoria:</strong> Un psicólogo debe conocer la regla exacta que motivó la alerta roja; no se admiten cajas negras opacas en salud.
                </p>
                <p className="text-zinc-300 text-xs">
                  • <strong>Determinismo y Cero Alucinación:</strong> Las reglas simbólicas aseguran que ningún caso severo sea subestimado por estocasticidad.
                </p>
              </div>
            </div>

            {/* Muestra de código X -> y */}
            <div
              onClick={() =>
                setModalData({
                  title: 'Mapeo Matemático de Variables: X ➔ y en calculos.ts',
                  subtitle: 'Función: calcularRiesgoGlobal() (Puntaje de 0 a 23 puntos)',
                  content: (
                    <pre className="p-4 bg-black rounded-xl border border-zinc-800 font-mono-code text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`// Mapeo formal de Variables: Entrada X -> Salida y
X = [phq9, bhs, cssrs, ideacionSuicida, intentoPrevio, consumoSustancias, aislamientoSocial]

Puntaje = Σ Puntos(X_i)   // Rango: [0 - 23 puntos]

y (nivelRiesgo) =
    'muy_alto'   SI Puntaje >= 12
    'alto'       SI 8 <= Puntaje < 12
    'moderado'   SI 4 <= Puntaje < 8
    'bajo'       SI Puntaje < 4`}
                    </pre>
                  ),
                })
              }
              className="p-3 bg-zinc-950 border border-emerald-900/40 hover:border-emerald-500 rounded-xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-emerald-300">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span><strong>Ver Mapeo X ➔ y:</strong> Reglas ponderadas de las 7 variables y determinación de salida</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">Click para agrandar</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PARTE 11: DEMOSTRACIÓN FUNCIONAL (LOS 7 PASOS OBLIGATORIOS) */}
        {/* ======================================================== */}
        {currentSlide === 11 && (
          <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Secuencia Obligatoria de Demostración · Parte 11</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Demostración Funcional en Vivo (Los 7 Pasos)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-sans-curva text-left text-xs">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <strong className="text-indigo-400 block">Paso 1: Caso Nuevo</strong>
                <p className="text-zinc-300">Paciente ingresa a `/encuesta` con ideación activa y depresión severa.</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <strong className="text-indigo-400 block">Paso 2: Captura de Datos</strong>
                <p className="text-zinc-300">Wizard de 10 pasos captura 84 respuestas estructuradas.</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <strong className="text-indigo-400 block">Paso 3: Validar y Preparar</strong>
                <p className="text-zinc-300">Backend valida tipos y calcula baremos de las 5 escalas.</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-700 space-y-1">
                <strong className="text-indigo-300 block font-bold">Paso 4: Ejecutar IA</strong>
                <p className="text-zinc-200">Motor de scoring calcula 14 pts + Vertex AI recibe el caso.</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <strong className="text-emerald-400 block">Paso 5: Obtener Resultado</strong>
                <p className="text-zinc-300">Nivel 'muy_alto', Alerta Roja generada y plan de seguridad.</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <strong className="text-emerald-400 block">Paso 6: Presentar Salida</strong>
                <p className="text-zinc-300">Semáforo de crisis visible para el usuario y panel admin.</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700 space-y-1 col-span-1 sm:col-span-2">
                <strong className="text-emerald-300 block font-bold">Paso 7: Acción Concreta</strong>
                <p className="text-zinc-200">Psicólogo activa protocolo de contención, exporta PDF médico y activa derivación a Línea 113.</p>
              </div>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-center text-xs text-zinc-400 font-sans-curva">
              <strong className="text-white">Punto de Demostración:</strong> El equipo ejecutará este recorrido exacto en la aplicación web en tiempo real.
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PARTE 12: RESULTADOS Y VALOR GENERADO (ANTES VS DESPUÉS) */}
        {/* ======================================================== */}
        {currentSlide === 12 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Secuencia: Resultados · Parte 12</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Resultados y Valor Generado: Antes vs Después
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans-curva text-left text-xs sm:text-sm">
              <div className="p-5 rounded-2xl bg-zinc-950 border border-rose-950/60 space-y-3">
                <span className="text-xs font-bold uppercase text-rose-400 block">Proceso Anterior (Tradicional)</span>
                <ul className="space-y-2 text-zinc-300 text-xs">
                  <li>• <strong>Tiempo de Triage:</strong> 15 a 20 minutos de cálculo manual por paciente.</li>
                  <li>• <strong>Tiempo de Espera:</strong> Días o semanas para conseguir una cita clínica.</li>
                  <li>• <strong>Riesgo de Omisión:</strong> Pacientes con ideación pasiva no detectados.</li>
                  <li>• <strong>Soporte al Médico:</strong> Registro manual sin recomendaciones inmediatas.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-emerald-950/60 space-y-3">
                <span className="text-xs font-bold uppercase text-emerald-400 block">Con Nuestro PMV (Medido en Producción)</span>
                <ul className="space-y-2 text-zinc-200 text-xs">
                  <li>• <strong>Tiempo de Triage:</strong> <strong>&lt; 2 segundos</strong> (scoring determinista en milisegundos).</li>
                  <li>• <strong>Alerta Roja Inmediata:</strong> Notificación en tiempo real al psicólogo de turno.</li>
                  <li>• <strong>Sensibilidad de Detección:</strong> <strong>0% de falsos negativos</strong> en ideación activa.</li>
                  <li>• <strong>Latencia de IA Optimizada:</strong> Reducida de 6.0s a <strong>1.3s</strong> en Vertex AI.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PARTE 13: LIMITACIONES Y MEJORAS FUTURAS                 */}
        {/* ======================================================== */}
        {currentSlide === 13 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Secuencia: Conclusión · Parte 13</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Limitaciones Actuales y Mejoras Futuras
              </h2>
            </div>

            <div className="space-y-3 font-sans-curva text-left max-w-4xl mx-auto text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-start gap-4">
                <span className="p-2 bg-amber-950/60 rounded-lg text-amber-400 font-bold shrink-0">1</span>
                <div>
                  <strong className="text-white block">Limitación: Dataset inicial generado sintéticamente</strong>
                  <p className="text-zinc-400 text-xs">Mejora propuesta: Ejecutar un piloto controlado con centros de salud aliados para validar con historiales clínicos reales.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-start gap-4">
                <span className="p-2 bg-indigo-950/60 rounded-lg text-indigo-400 font-bold shrink-0">2</span>
                <div>
                  <strong className="text-white block">Limitación: Línea base de reglas rígidas en el motor inicial</strong>
                  <p className="text-zinc-400 text-xs">Mejora propuesta: Entrenar ensambles de Random Forest / XGBoost al acumular un volumen representativo de encuestas etiquetadas.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-start gap-4">
                <span className="p-2 bg-emerald-950/60 rounded-lg text-emerald-400 font-bold shrink-0">3</span>
                <div>
                  <strong className="text-white block">Auditoría Resuelta: Fuga de nombres técnicos de tools</strong>
                  <p className="text-zinc-400 text-xs">Solución aplicada: Doble barrera con System Prompt estricto (alias institucionales) y sanitizador regex en el frontend.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PARTE 14: CONCLUSIÓN (TRES IDEAS FINALES)                 */}
        {/* ======================================================== */}
        {currentSlide === 14 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Secuencia: Conclusión · Parte 14</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-curva-seria">
                Conclusiones: Tres Ideas Finales del Proyecto
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans-curva text-left text-xs sm:text-sm">
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase text-emerald-400 block">1. Logro del Objetivo</span>
                <p className="text-sm font-semibold text-white">Triage en Menos de 2 Segundos</p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  El PMV demostró con evidencia que digitalizar escalas validadas e integrarlas con IA reduce de semanas a segundos el tiempo de respuesta, con 0% de falsos negativos en ideación activa.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase text-indigo-400 block">2. Aprendizaje Técnico</span>
                <p className="text-sm font-semibold text-white">Arquitectura Híbrida y Ética</p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  La IA tradicional determinista garantiza cero fallas numéricas, mientras que Vertex AI aporta asistencia empática y estructuración prescriptiva, cumpliendo con la norma médica ISO 14971.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-2">
                <span className="text-xs font-bold uppercase text-amber-400 block">3. Siguiente Paso</span>
                <p className="text-sm font-semibold text-white">Escalar al Piloto Clínico</p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Con 17 tablas relacionales y 3,465 encuestas procesadas, el sistema cuenta con la infraestructura lista para medir la Tasa de Adopción de Protocolo (TAP) con profesionales en un centro de salud.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PARTE 15: GRACIAS GIGANTE Y FONDO NEGRO                  */}
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
