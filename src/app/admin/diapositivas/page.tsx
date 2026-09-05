'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Activity, ShieldAlert, Sparkles, Database, Terminal,
  CheckCircle2, AlertTriangle, Workflow, X, Code2,
  Eye, UserCheck, Target, ArrowRight,
} from 'lucide-react'

/* ─────────────── COMPONENTE: NODO DEL DIAGRAMA ─────────────── */
function DiagramNode({ label, sub, color = 'zinc', highlight = false, icon }: {
  label: string; sub?: string; color?: string; highlight?: boolean; icon?: React.ReactNode
}) {
  const borderMap: Record<string, string> = {
    zinc: 'border-zinc-800', indigo: 'border-indigo-600', emerald: 'border-emerald-600',
    rose: 'border-rose-600', amber: 'border-amber-600',
  }
  const bgMap: Record<string, string> = {
    zinc: 'bg-zinc-950', indigo: 'bg-indigo-950/70', emerald: 'bg-emerald-950/70',
    rose: 'bg-rose-950/70', amber: 'bg-amber-950/70',
  }
  const textMap: Record<string, string> = {
    zinc: 'text-zinc-400', indigo: 'text-indigo-300', emerald: 'text-emerald-300',
    rose: 'text-rose-300', amber: 'text-amber-300',
  }
  return (
    <div className={`relative p-3 sm:p-4 rounded-xl ${bgMap[color]} border-2 ${borderMap[color]} text-center ${highlight ? 'shadow-lg shadow-indigo-950/60 ring-1 ring-indigo-500/30' : ''} transition-all`}>
      {icon && <div className="mb-1 flex justify-center">{icon}</div>}
      <p className="font-bold text-white text-xs sm:text-sm leading-tight">{label}</p>
      {sub && <p className={`text-[10px] sm:text-xs ${textMap[color]} mt-0.5`}>{sub}</p>}
    </div>
  )
}

/* ─────────────── COMPONENTE: FLECHA ENTRE NODOS ─────────────── */
function DiagramArrow() {
  return (
    <div className="flex items-center justify-center px-0.5">
      <svg width="28" height="16" viewBox="0 0 28 16" className="text-indigo-500/70">
        <line x1="0" y1="8" x2="20" y2="8" stroke="currentColor" strokeWidth="2" />
        <polygon points="20,3 28,8 20,13" fill="currentColor" />
      </svg>
    </div>
  )
}

/* ─────────────── COMPONENTE: ETIQUETA DE EVIDENCIA ─────────────── */
function EvidenciaTag({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-zinc-900/60">
      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
      <p className="text-[10px] sm:text-xs text-zinc-500 font-sans-curva italic">
        <strong className="text-zinc-400 not-italic">Evidencia:</strong> {text}
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
/* ═══════════   COMPONENTE PRINCIPAL DE DIAPOSITIVAS   ═══════ */
/* ═══════════════════════════════════════════════════════════════ */
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
    if (modalData) { setModalData(null); return }
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    router.push('/admin')
  }, [router, modalData])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); salir() }
      else if (!modalData) {
        if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide() }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide() }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide, salir, modalData])

  useEffect(() => {
    const pH = document.documentElement.style.overflow
    const pB = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = pH; document.body.style.overflow = pB }
  }, [])

  return (
    <div className="fixed inset-0 z-[99999] w-screen h-screen bg-[#030406] text-white flex flex-col justify-center items-center overflow-hidden select-none">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap');
        html,body{overflow:hidden!important;scrollbar-width:none!important;-ms-overflow-style:none!important}
        ::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}
        .font-curva-seria{font-family:'Playfair Display',Georgia,serif}
        .font-sans-curva{font-family:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif}
        .font-mono-code{font-family:'Fira Code',monospace}
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_70%)] pointer-events-none" />

      {/* ═══════ MODAL DE ZOOM ═══════ */}
      {modalData && (
        <div className="fixed inset-0 z-[100000] bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full max-w-5xl max-h-[88vh] bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block font-bold">Evidencia Técnica del PMV</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-curva-seria">{modalData.title}</h3>
                {modalData.subtitle && <p className="text-xs text-zinc-400 font-sans-curva mt-0.5">{modalData.subtitle}</p>}
              </div>
              <button onClick={() => setModalData(null)} className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto text-sm text-zinc-200 font-sans-curva space-y-4 pr-1">{modalData.content}</div>
            <div className="pt-4 mt-4 border-t border-zinc-900 flex justify-end">
              <button onClick={() => setModalData(null)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors">Cerrar (Esc)</button>
            </div>
          </div>
        </div>
      )}

      <main className="w-full max-w-6xl px-6 sm:px-10 lg:px-14 flex items-center justify-center relative z-10">

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 0: CITA INICIAL                                  */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 0 && (
          <div className="w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.35] text-zinc-100 font-curva-seria max-w-5xl mx-auto">
              "Cada 40 segundos, una persona en el mundo se quita la vida; más de 700,000 al año.
              La depresión no es tristeza pasajera ni debilidad: es un dolor invisible que destruye
              en silencio cuando nadie detecta las señales a tiempo."
            </h1>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 1: PRESENTACIÓN DEL PROYECTO                     */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 1 && (
          <div className="w-full max-w-5xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white font-curva-seria leading-tight pt-2">
              Sistema de Asistencia Clínica y Triage Preventivo en Salud Mental
            </h1>
            <p className="text-lg sm:text-2xl text-zinc-300 font-curva-seria italic max-w-4xl mx-auto leading-relaxed">
              "Identificación temprana y priorización automatizada del riesgo de depresión y conducta suicida mediante triage inteligente."
            </p>
            <div className="pt-6 border-t border-zinc-900 font-sans-curva space-y-3">
              <p className="text-base sm:text-lg tracking-wider uppercase text-zinc-400">
                Curso: <span className="text-zinc-100 font-bold">Inteligencia Artificial</span> · Docente: <span className="text-zinc-100 font-bold font-curva-seria">Mg. KAREM MERCEDES MALDONADO CORDOVA</span>
              </p>
              <p className="text-base font-bold tracking-wider uppercase text-zinc-400">Equipo: <span className="text-white underline decoration-indigo-500 underline-offset-8">"Cabo Verde"</span></p>
              <div className="grid grid-cols-2 gap-3 max-w-3xl mx-auto text-left">
                {['Arones Romani Henry', 'Inga Quispe Diego Anthony', 'Paucar Torres Gabriel Emerando', 'Ponce Otarola Jarem Antonio'].map(n => (
                  <div key={n} className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 transition-all">
                    <p className="text-sm sm:text-base font-semibold text-zinc-200">• {n}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 2: PROBLEMA IDENTIFICADO                         */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 2 && (
          <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold px-3 py-1 bg-indigo-950/60 rounded-full border border-indigo-800">PROBLEMA</span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-white font-curva-seria pt-2">Detección Tardía y Triage Reactivo</h2>
            </div>

            {/* Datos duros en tarjetas grandes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-sans-curva">
              <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-900/50">
                <p className="text-3xl sm:text-4xl font-bold text-white">720,000+</p>
                <p className="text-sm text-rose-300 mt-1">muertes anuales por suicidio (OMS)</p>
              </div>
              <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-900/50">
                <p className="text-3xl sm:text-4xl font-bold text-white">10 – 15 min</p>
                <p className="text-sm text-amber-300 mt-1">duración promedio de consulta médica</p>
              </div>
              <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-900/50">
                <p className="text-3xl sm:text-4xl font-bold text-white">84 ítems</p>
                <p className="text-sm text-indigo-300 mt-1">imposibles de aplicar manualmente</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans-curva text-sm">
              <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                <strong className="text-rose-400 text-xs uppercase block">¿Quién se ve afectado?</strong>
                <p className="text-zinc-200">Jóvenes de 15 a 29 años (4ta causa de muerte), estudiantes universitarios, personas sin red de apoyo y familias que pierden seres queridos de forma evitable.</p>
              </div>
              <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                <strong className="text-amber-400 text-xs uppercase block">¿Qué consecuencias produce?</strong>
                <p className="text-zinc-200">El paciente solo recibe auxilio cuando ya está en sala de emergencias tras un intento consumado. No existe un puente entre la primera señal y la intervención profesional.</p>
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 3: OBJETIVO DEL PMV                              */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 3 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold px-3 py-1 bg-indigo-950/60 rounded-full border border-indigo-800">PROBLEMA</span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-white font-curva-seria pt-2">Objetivo Concreto del PMV</h2>
            </div>

            <div className="p-7 rounded-2xl bg-zinc-950 border border-zinc-900 font-sans-curva max-w-4xl mx-auto flex items-start gap-5">
              <Target className="w-10 h-10 text-indigo-400 shrink-0 mt-1" />
              <p className="text-base sm:text-xl text-zinc-200 leading-relaxed">
                Desarrollar una plataforma web de triage clínico que <strong>clasifique automáticamente</strong> el nivel de riesgo de depresión y conducta suicida, y <strong>recomiende</strong> protocolos de intervención en tiempo real para apoyar la toma de decisiones del psicólogo.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 font-sans-curva text-sm max-w-4xl mx-auto">
              <div className="p-5 bg-zinc-900/50 rounded-xl border border-zinc-800 text-center space-y-1">
                <strong className="text-indigo-400 block uppercase text-xs">1. Automatizar</strong>
                <p className="text-zinc-300">Cálculo psicométrico de 5 escalas (PHQ-9, C-SSRS, BHS, DASS-21, Rosenberg).</p>
              </div>
              <div className="p-5 bg-zinc-900/50 rounded-xl border border-zinc-800 text-center space-y-1">
                <strong className="text-indigo-400 block uppercase text-xs">2. Clasificar</strong>
                <p className="text-zinc-300">Nivel de riesgo: Bajo, Moderado, Alto o Muy Alto.</p>
              </div>
              <div className="p-5 bg-zinc-900/50 rounded-xl border border-zinc-800 text-center space-y-1">
                <strong className="text-emerald-400 block uppercase text-xs">3. Apoyar</strong>
                <p className="text-zinc-300">Copiloto Clínico con IA que prescribe el Plan de Seguridad.</p>
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 4: USUARIO Y NECESIDAD                           */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 4 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold px-3 py-1 bg-indigo-950/60 rounded-full border border-indigo-800">PROBLEMA</span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-white font-curva-seria pt-2">Usuario y Necesidad</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans-curva text-sm">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
                <div className="flex items-center gap-2"><UserCheck className="w-6 h-6 text-indigo-400" /><span className="text-base font-bold text-white">Paciente / Encuestado</span></div>
                <p className="text-zinc-200">Estudiante o persona en riesgo que necesita autoevaluarse de forma anónima, confidencial y sin estigma desde cualquier dispositivo.</p>
                <p className="text-zinc-400 text-xs"><strong>Tarea que mejora:</strong> Completar tamizaje en 5 minutos y recibir contacto de crisis (Línea 113 / 988).</p>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
                <div className="flex items-center gap-2"><ShieldAlert className="w-6 h-6 text-emerald-400" /><span className="text-base font-bold text-white">Psicólogo / Médico de Turno</span></div>
                <p className="text-zinc-200">Profesional de salud mental que necesita priorizar casos críticos (Código Rojo) entre cientos de encuestas sin calcular puntajes a mano.</p>
                <p className="text-zinc-400 text-xs"><strong>Decisión que mejora:</strong> Recibir alerta roja inmediata y el copiloto IA contextual que redacta el informe.</p>
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 5: PROPUESTA DE SOLUCIÓN                         */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 5 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold px-3 py-1 bg-indigo-950/60 rounded-full border border-indigo-800">PROPUESTA</span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-white font-curva-seria pt-2">Propuesta de Solución</h2>
            </div>

            {/* Diagrama Flowchart SVG real */}
            <div className="w-full flex justify-center font-sans-curva">
              <svg viewBox="0 0 800 130" className="w-full max-w-4xl" style={{ height: 'auto' }}>
                <defs>
                  <linearGradient id="gPac" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#27272a" /><stop offset="100%" stopColor="#18181b" /></linearGradient>
                  <linearGradient id="gIA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#312e81" /><stop offset="100%" stopColor="#1e1b4b" /></linearGradient>
                  <linearGradient id="gBD" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#451a03" /><stop offset="100%" stopColor="#2a1608" /></linearGradient>
                  <linearGradient id="gOK" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#064e3b" /><stop offset="100%" stopColor="#022c22" /></linearGradient>
                  <marker id="arrP" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#6366f1" /></marker>
                </defs>
                {/* Nodo 1: Paciente */}
                <rect x="10" y="20" width="160" height="80" rx="14" fill="url(#gPac)" stroke="#3f3f46" strokeWidth="2" />
                <text x="90" y="52" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">👤 Paciente</text>
                <text x="90" y="72" textAnchor="middle" fill="#a1a1aa" fontSize="11">Completa encuesta</text>
                {/* Flecha 1→2 */}
                <line x1="170" y1="60" x2="200" y2="60" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrP)" />
                {/* Nodo 2: Motor IA */}
                <rect x="208" y="20" width="170" height="80" rx="14" fill="url(#gIA)" stroke="#6366f1" strokeWidth="2" />
                <text x="293" y="52" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">🧠 Motor Scoring</text>
                <text x="293" y="72" textAnchor="middle" fill="#a5b4fc" fontSize="11">Riesgo (0-27 pts)</text>
                {/* Flecha 2→3 */}
                <line x1="378" y1="60" x2="408" y2="60" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrP)" />
                {/* Nodo 3: BD */}
                <rect x="416" y="20" width="170" height="80" rx="14" fill="url(#gBD)" stroke="#b45309" strokeWidth="2" />
                <text x="501" y="52" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">🗄 Base de Datos</text>
                <text x="501" y="72" textAnchor="middle" fill="#fbbf24" fontSize="11">Alerta + Notificación</text>
                {/* Flecha 3→4 */}
                <line x1="586" y1="60" x2="616" y2="60" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrP)" />
                {/* Nodo 4: Copiloto */}
                <rect x="624" y="20" width="166" height="80" rx="14" fill="url(#gOK)" stroke="#059669" strokeWidth="2" />
                <text x="707" y="52" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">🤖 Copiloto IA</text>
                <text x="707" y="72" textAnchor="middle" fill="#6ee7b7" fontSize="11">Plan de Seguridad</text>
                {/* Etiquetas en las flechas */}
                <text x="185" y="50" textAnchor="middle" fill="#818cf8" fontSize="8" fontWeight="600">84 ítems</text>
                <text x="393" y="50" textAnchor="middle" fill="#818cf8" fontSize="8" fontWeight="600">Scoring</text>
                <text x="601" y="50" textAnchor="middle" fill="#818cf8" fontSize="8" fontWeight="600">Expediente</text>
                {/* Línea inferior de flujo */}
                <text x="400" y="120" textAnchor="middle" fill="#52525b" fontSize="10" fontStyle="italic">Flujo lineal: El dato viaja de izquierda a derecha sin retorno</text>
              </svg>
            </div>

            <div className="p-5 bg-zinc-950 rounded-xl border border-zinc-800 font-sans-curva text-sm max-w-4xl mx-auto space-y-2">
              <strong className="text-white block">Diferenciación Clave:</strong>
              <p className="text-zinc-300">• <strong>Solución Completa Imaginada:</strong> Seguimiento por años, wearables, predicción poblacional y app nativa.</p>
              <p className="text-zinc-200">• <strong>PMV Realmente Desarrollado:</strong> Detección temprana estandarizada + Alerta roja inmediata + Asistencia médica con IA.</p>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 6: ALCANCE DEL PMV                               */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 6 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold px-3 py-1 bg-indigo-950/60 rounded-full border border-indigo-800">PROPUESTA</span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-white font-curva-seria pt-2">Alcance del PMV</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans-curva text-sm">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-emerald-950/60 space-y-3">
                <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Incluye (En Producción)</span>
                <ul className="space-y-2 text-zinc-200">
                  <li>✔ Formulario wizard de 10 pasos (84 ítems).</li>
                  <li>✔ Cálculo de riesgo compuesto (7 factores, 0-23 pts).</li>
                  <li>✔ Alertas y notificaciones por gravedad clínica.</li>
                  <li>✔ Panel de administración con filtros de riesgo.</li>
                  <li>✔ Chatbot Copiloto IA con Function Calling.</li>
                  <li>✔ Exportación de informes médicos en PDF.</li>
                  <li>✔ Dashboard de indicadores epidemiológicos.</li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
                <span className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2"><X className="w-5 h-5" /> No Incluye (Futuras Versiones)</span>
                <ul className="space-y-2 text-zinc-400">
                  <li>✖ App móvil nativa (web responsive es suficiente).</li>
                  <li>✖ SMS / WhatsApp (costos externos).</li>
                  <li>✖ Chat en tiempo real por WebSockets.</li>
                  <li>✖ Sensores biométricos y wearables.</li>
                  <li>✖ Predicción longitudinal a meses.</li>
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 7: ARQUITECTURA DEL SISTEMA (DIAGRAMA VISUAL)    */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 7 && (
          <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold px-3 py-1 bg-indigo-950/60 rounded-full border border-indigo-800">PMV</span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-white font-curva-seria pt-2">Arquitectura del Sistema</h2>
            </div>

            {/* DIAGRAMA DE ARQUITECTURA SVG FLOWCHART — CLICKEABLE POR FILA */}
            <div className="w-full flex justify-center font-sans-curva">
              <svg viewBox="0 0 820 310" className="w-full max-w-5xl" style={{ height: 'auto' }}>
                <defs>
                  <linearGradient id="aZinc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#27272a" /><stop offset="100%" stopColor="#18181b" /></linearGradient>
                  <linearGradient id="aIndigo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#312e81" /><stop offset="100%" stopColor="#1e1b4b" /></linearGradient>
                  <linearGradient id="aRose" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4c0519" /><stop offset="100%" stopColor="#2a0211" /></linearGradient>
                  <linearGradient id="aEmerald" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#064e3b" /><stop offset="100%" stopColor="#022c22" /></linearGradient>
                  <marker id="arA" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#6366f1" /></marker>
                  <marker id="arR" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#f43f5e" /></marker>
                  <marker id="arG" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#10b981" /></marker>
                </defs>

                {/* ── FILA 1: Captura de Datos (CLICKEABLE) ── */}
                <g style={{ cursor: 'pointer' }} opacity="0.92"
                  onMouseEnter={(e) => e.currentTarget.setAttribute('opacity', '1')}
                  onMouseLeave={(e) => e.currentTarget.setAttribute('opacity', '0.92')}
                  onClick={() => setModalData({
                    title: 'Capa de Captura: Usuario → Formulario → API',
                    subtitle: 'Cómo viajan los 84 ítems desde el navegador hasta el servidor',
                    content: (
                      <div className="space-y-4">
                        <p className="text-sm text-zinc-300">El paciente completa un <strong>wizard de 10 pasos</strong> que recoge las 5 escalas clínicas (PHQ-9, BHS, C-SSRS, DASS-21, Rosenberg) en su navegador web. Al finalizar, el frontend envía un JSON al API Server.</p>
                        <p className="text-xs text-zinc-500 font-bold uppercase">Ejemplo de payload JSON enviado al endpoint POST /api/encuesta:</p>
                        <pre className="p-4 bg-black rounded-xl border border-zinc-800 font-mono-code text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`{
  "datos_personales": {
    "edad": 22, "genero": "Masculino",
    "ocupacion": "Estudiante universitario"
  },
  "phq9": {
    "interesActividades": 3, "estadoAnimo": 3,
    "sueno": 2, "energia": 3, "apetito": 2,
    "autoestima": 3, "concentracion": 2,
    "psicomotricidad": 1, "ideacionSuicida": 3
  },
  "bhs": [true, false, true, true, true, false, true, ...],
  "cssrs": {
    "deseosMorir": true, "pensamientosSuicidas": true,
    "metodoSinPlan": true, "planEspecifico": true,
    "intencionEjecutar": false
  },
  "factores_riesgo": {
    "intentoPrevio": true,
    "consumoSustancias": true,
    "aislamientoSocial": true
  }
}`}
                        </pre>
                        <p className="text-xs text-zinc-400">El servidor valida rangos (PHQ-9 ítems: 0-3, edad: 14-75), calcula los baremos de cada escala y pasa los resultados a la capa de IA.</p>
                      </div>
                    ),
                  })}
                >
                  {/* Hint clickeable */}

                  <rect x="20" y="15" width="140" height="65" rx="12" fill="url(#aZinc)" stroke="#3f3f46" strokeWidth="2" />
                  <text x="90" y="42" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">👤 Usuario</text>
                  <text x="90" y="58" textAnchor="middle" fill="#a1a1aa" fontSize="10">Navegador Web</text>
                  <line x1="160" y1="47" x2="208" y2="47" stroke="#6366f1" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#arA)" />
                  <text x="184" y="40" textAnchor="middle" fill="#818cf8" fontSize="8">HTTPS</text>
                  <rect x="216" y="15" width="160" height="65" rx="12" fill="url(#aZinc)" stroke="#3f3f46" strokeWidth="2" />
                  <text x="296" y="42" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">📋 Formulario</text>
                  <text x="296" y="58" textAnchor="middle" fill="#a1a1aa" fontSize="10">84 Ítems · 5 Escalas</text>
                  <line x1="376" y1="47" x2="424" y2="47" stroke="#6366f1" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#arA)" />
                  <text x="400" y="40" textAnchor="middle" fill="#818cf8" fontSize="8">JSON</text>
                  <rect x="432" y="15" width="160" height="65" rx="12" fill="url(#aZinc)" stroke="#52525b" strokeWidth="2" />
                  <text x="512" y="42" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">⚙️ API Server</text>
                  <text x="512" y="58" textAnchor="middle" fill="#a1a1aa" fontSize="10">Next.js · 21 Endpoints</text>
                </g>

                {/* ── Flechas hacia abajo (no clickeables) ── */}
                <line x1="472" y1="80" x2="472" y2="120" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arA)" />
                <line x1="552" y1="80" x2="552" y2="120" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arA)" />

                {/* ── FILA 2: Capa de IA (CLICKEABLE) ── */}
                <g style={{ cursor: 'pointer' }} opacity="0.92"
                  onMouseEnter={(e) => e.currentTarget.setAttribute('opacity', '1')}
                  onMouseLeave={(e) => e.currentTarget.setAttribute('opacity', '0.92')}
                  onClick={() => setModalData({
                    title: 'Capa de Inteligencia Artificial (Doble Motor)',
                    subtitle: 'IA Simbólica (calcularRiesgoGlobal) + IA Generativa (Function Calling)',
                    content: (
                      <div className="space-y-4">
                        <p className="text-xs text-zinc-500 font-bold uppercase">Motor 1 — IA Simbólica · Código real de src/lib/calculos.ts:</p>
                        <pre className="p-4 bg-black rounded-xl border border-zinc-800 font-mono-code text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`function calcularRiesgoGlobal(params) {
  let puntajeRiesgo = 0;

  // X₁: PHQ-9 (depresión) — peso máximo: 5 pts
  if (params.phq9 >= 20)      puntajeRiesgo += 5;  // Severa
  else if (params.phq9 >= 15) puntajeRiesgo += 3;  // Mod. severa

  // X₃: C-SSRS — peso máximo: 7 pts (el más alto)
  if (params.cssrs === 'intento_letal')  puntajeRiesgo += 7;
  else if (params.cssrs === 'planificacion') puntajeRiesgo += 5;

  // ... 5 factores más (BHS, ítem9, intento, drogas, aislamiento)

  // CLASIFICACIÓN FINAL
  if (puntajeRiesgo >= 12) return 'muy_alto';  // 🔴 SLA: 2h
  if (puntajeRiesgo >= 7)  return 'alto';       // 🟠 SLA: 12h
  if (puntajeRiesgo >= 4)  return 'moderado';   // 🟡 SLA: 24h
  return 'bajo';                                 // 🟢 SLA: 72h
}`}
                        </pre>
                        <p className="text-xs text-zinc-500 font-bold uppercase">Motor 2 — IA Generativa · Tool definition (Function Calling):</p>
                        <pre className="p-4 bg-black rounded-xl border border-zinc-800 font-mono-code text-xs text-indigo-300 overflow-x-auto leading-relaxed">
{`{
  "name": "obtenerDetalleCasoPaciente",
  "description": "Obtiene el informe detallado de una
    encuesta: puntajes PHQ-9, BHS, C-SSRS, DASS-21,
    Rosenberg, factores de riesgo y recomendaciones.",
  "parameters": {
    "type": "object",
    "properties": {
      "encuestaId": {
        "type": "integer",
        "description": "ID de la encuesta a consultar"
      },
      "buscarNombre": {
        "type": "string",
        "description": "Nombre del paciente a buscar"
      }
    }
  }
}`}
                        </pre>
                        <p className="text-xs text-zinc-400">La IA Simbólica ejecuta en 2ms sin error. La IA Generativa consulta la BD vía Function Calling y genera el plan clínico en 1.3s.</p>
                      </div>
                    ),
                  })}
                >

                  <rect x="365" y="118" width="30" height="14" rx="4" fill="#4f46e5" />
                  <text x="380" y="128" textAnchor="middle" fill="white" fontSize="7" fontWeight="800">IA</text>
                  <rect x="575" y="118" width="30" height="14" rx="4" fill="#4f46e5" />
                  <text x="590" y="128" textAnchor="middle" fill="white" fontSize="7" fontWeight="800">IA</text>

                  <rect x="370" y="132" width="190" height="60" rx="12" fill="url(#aIndigo)" stroke="#6366f1" strokeWidth="2.5" filter="drop-shadow(0 0 8px rgba(99,102,241,0.3))" />
                  <text x="465" y="157" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">🧠 IA Simbólica</text>
                  <text x="465" y="174" textAnchor="middle" fill="#a5b4fc" fontSize="10">calcularRiesgoGlobal() · 2ms</text>

                  <rect x="580" y="132" width="200" height="60" rx="12" fill="url(#aIndigo)" stroke="#818cf8" strokeWidth="2" />
                  <text x="680" y="157" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">🤖 IA Generativa</text>
                  <text x="680" y="174" textAnchor="middle" fill="#a5b4fc" fontSize="10">Function Calling · 1.3s</text>
                </g>

                {/* ── Flechas hacia abajo desde IA ── */}
                <line x1="465" y1="193" x2="465" y2="225" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arR)" />
                <line x1="680" y1="193" x2="680" y2="225" stroke="#10b981" strokeWidth="2" markerEnd="url(#arG)" />

                {/* ── FILA 3: Resultado y Acción (CLICKEABLE) ── */}
                <g style={{ cursor: 'pointer' }} opacity="0.92"
                  onMouseEnter={(e) => e.currentTarget.setAttribute('opacity', '1')}
                  onMouseLeave={(e) => e.currentTarget.setAttribute('opacity', '0.92')}
                  onClick={() => setModalData({
                    title: 'Capa de Resultado: Alerta Roja y Acción Clínica',
                    subtitle: 'Cómo el sistema notifica al psicólogo y activa el protocolo',
                    content: (
                      <div className="space-y-4">
                        <p className="text-sm text-zinc-300">Cuando el scoring produce un nivel <strong>muy_alto</strong>, el sistema inserta un registro de notificación en PostgreSQL con prioridad <strong>crítica</strong> y un SLA de 2 horas.</p>
                        <p className="text-xs text-zinc-500 font-bold uppercase">Ejemplo de registro de notificación insertado en la BD:</p>
                        <pre className="p-4 bg-black rounded-xl border border-zinc-800 font-mono-code text-xs text-rose-300 overflow-x-auto leading-relaxed">
{`-- Tabla: notificaciones
INSERT INTO notificaciones (
  encuesta_id, nivel_riesgo, prioridad_alerta,
  sla_horas, accion_requerida, factores_alarma
) VALUES (
  4042,
  'muy_alto',
  'critica',
  2,
  'Contacto de emergencia inmediato, contención
   clínica en crisis y activación de protocolo
   de seguridad.',
  ARRAY[
    'Depresión severa en PHQ-9 (≥ 20)',
    'Nivel crítico de desesperanza en BHS (≥ 15)',
    'C-SSRS: Plan específico de suicidio',
    'PHQ-9 ítem 9: Pensamientos frecuentes',
    'Historial de intentos previos'
  ]
);`}
                        </pre>
                        <p className="text-xs text-zinc-500 font-bold uppercase">Acción clínica generada por el Copiloto IA:</p>
                        <pre className="p-4 bg-black rounded-xl border border-zinc-800 font-mono-code text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`Plan de Seguridad (Stanley & Brown):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Señales de advertencia personales
2. Estrategias de afrontamiento internas
3. Contactos sociales de distracción
4. Familiares o amigos de confianza
5. Profesionales de salud: Línea 113 opción 5
6. Restricción de acceso a medios letales

→ Exportado como PDF médico para el expediente.
→ Derivación automática a Línea de Crisis 113.`}
                        </pre>
                      </div>
                    ),
                  })}
                >

                  <rect x="370" y="233" width="190" height="55" rx="12" fill="url(#aRose)" stroke="#e11d48" strokeWidth="2" />
                  <text x="465" y="255" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">🔴 Alerta Roja</text>
                  <text x="465" y="272" textAnchor="middle" fill="#fda4af" fontSize="10">PostgreSQL · Notificación</text>

                  <rect x="580" y="233" width="200" height="55" rx="12" fill="url(#aEmerald)" stroke="#059669" strokeWidth="2" />
                  <text x="680" y="255" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">🏥 Acción Clínica</text>
                  <text x="680" y="272" textAnchor="middle" fill="#6ee7b7" fontSize="10">Plan de Seguridad · PDF · 113</text>

                  <line x1="560" y1="260" x2="575" y2="260" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arA)" />
                </g>

                {/* ── BD lateral (CLICKEABLE) ── */}
                <g style={{ cursor: 'pointer' }} opacity="0.85"
                  onMouseEnter={(e) => e.currentTarget.setAttribute('opacity', '1')}
                  onMouseLeave={(e) => e.currentTarget.setAttribute('opacity', '0.85')}
                  onClick={() => setModalData({
                    title: 'Base de Datos: PostgreSQL con Prisma ORM',
                    subtitle: '17 tablas relacionales · 239 columnas · 3,465 encuestas procesadas',
                    content: (
                      <div className="space-y-4">
                        <p className="text-xs text-zinc-500 font-bold uppercase">Tablas principales del esquema:</p>
                        <pre className="p-4 bg-black rounded-xl border border-zinc-800 font-mono-code text-xs text-amber-300 overflow-x-auto leading-relaxed">
{`Tabla                  Columnas   Función
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
encuestas              12 cols    Registro maestro
phq9_respuestas        11 cols    Escala de depresión
bhs_respuestas         22 cols    Escala desesperanza
cssrs_respuestas        8 cols    Riesgo suicida
dass21_respuestas      24 cols    Estrés/ansiedad
rosenberg_respuestas   12 cols    Autoestima
historial_suicida       5 cols    Antecedentes
salud_fisica           8 cols    Consumo y sueño
relaciones             6 cols    Red de apoyo
notificaciones         8 cols    Alertas (variable y)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 17 tablas · 239 columnas`}
                        </pre>
                        <p className="text-xs text-zinc-400">Todas las tablas se gestionan mediante Prisma ORM con migraciones versionadas. La tabla <strong>notificaciones</strong> contiene la variable objetivo (y) del triage.</p>
                      </div>
                    ),
                  })}
                >
                  <rect x="30" y="140" width="140" height="55" rx="12" fill="url(#aZinc)" stroke="#52525b" strokeWidth="1.5" />
                  <text x="100" y="163" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">🗄 PostgreSQL</text>
                  <text x="100" y="179" textAnchor="middle" fill="#71717a" fontSize="9">17 tablas · 239 cols</text>
                </g>
                <line x1="170" y1="167" x2="366" y2="162" stroke="#52525b" strokeWidth="1.5" strokeDasharray="5,4" />

                {/* Hint general */}
                <text x="410" y="306" textAnchor="middle" fill="#3f3f46" fontSize="9" fontStyle="italic">Haz click en cada capa para ver ejemplos reales del código</text>
              </svg>
            </div>

            {/* Info compacta de las 2 capas IA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans-curva text-xs">
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 space-y-1">
                <span className="text-[10px] font-bold uppercase text-indigo-400 block">Capa 1: IA Simbólica Local</span>
                <p className="text-zinc-300">Motor determinista · 7 variables · Clasificación en <strong>2ms</strong> · Cero error.</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-400 block">Capa 2: IA Generativa en la Nube</span>
                <p className="text-zinc-200">Copiloto asistencial con Function Calling que consulta el expediente y formula el plan de seguridad en <strong>1.3 segundos</strong>.</p>
                <p className="text-xs text-zinc-500 font-mono-code">src/lib/ai/orchestrator.ts → Function Calling</p>
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 8: DATOS UTILIZADOS                              */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 8 && (
          <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold px-3 py-1 bg-indigo-950/60 rounded-full border border-indigo-800">DATOS</span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-white font-curva-seria pt-2">Datos Utilizados y Calidad</h2>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center font-sans-curva">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900"><p className="text-2xl font-bold text-white">4,000</p><p className="text-xs text-zinc-400">Registros Generados</p></div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900"><p className="text-2xl font-bold text-white">17</p><p className="text-xs text-zinc-400">Tablas Relacionales</p></div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900"><p className="text-2xl font-bold text-white">239</p><p className="text-xs text-zinc-400">Columnas Totales</p></div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900"><p className="text-2xl font-bold text-indigo-400">1</p><p className="text-xs text-zinc-400">Variable Objetivo (y)</p></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans-curva text-xs">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1.5">
                <strong className="text-indigo-400 text-xs uppercase block">Origen y Variable Objetivo</strong>
                <p className="text-zinc-200">• <strong>Origen:</strong> Dataset sintético clínico con errores inyectados a propósito para demostrar limpieza en Google Colab (Semana 12).</p>
                <p className="text-zinc-200">• <strong>Variable Objetivo (y):</strong> `nivel_riesgo_objetivo` → Bajo (65%), Moderado (20%), Alto (10%), Muy Alto (5%).</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1.5">
                <strong className="text-amber-400 text-xs uppercase block">Errores Inyectados y Limpieza</strong>
                <p className="text-zinc-300">• 350 textos con espacios extra y mayúsculas inconsistentes → <em>Trim y estandarización</em>.</p>
                <p className="text-zinc-300">• 240 nulos en ocupación + 180 en ingresos → <em>Imputación experta</em>.</p>
                <p className="text-zinc-300">• Edades de -5 y 999 → <em>Filtrado al rango [14-75]</em>.</p>
                <p className="text-zinc-300">• 150 duplicados artificiales → <em>Desduplicación por ID</em>.</p>
              </div>
            </div>

            {/* Modal con tabla de variables */}
            <div
              onClick={() => setModalData({
                title: 'Tabla de Variables Principales y Ejemplo de Registros',
                subtitle: 'Dataset: scripts/generar_dataset_sucio_demostracion.py (4,000 registros)',
                content: (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono-code border border-zinc-800">
                        <thead><tr className="bg-zinc-900 text-indigo-400 border-b border-zinc-800">
                          <th className="p-2">Variable</th><th className="p-2">Tipo</th><th className="p-2">Rango</th><th className="p-2">Rol</th>
                        </tr></thead>
                        <tbody className="text-zinc-300 divide-y divide-zinc-800">
                          <tr><td className="p-2 text-white">phq9_puntaje_total</td><td className="p-2">Numérica</td><td className="p-2">0 - 27</td><td className="p-2">Feature (X₁)</td></tr>
                          <tr><td className="p-2 text-white">bhs_desesperanza_total</td><td className="p-2">Numérica</td><td className="p-2">0 - 20</td><td className="p-2">Feature (X₂)</td></tr>
                          <tr><td className="p-2 text-white">cssrs_nivel_severidad</td><td className="p-2">Categórica</td><td className="p-2">ninguna → intento_letal</td><td className="p-2">Feature (X₃)</td></tr>
                          <tr><td className="p-2 text-white">phq9_item_9_ideacion</td><td className="p-2">Ordinal</td><td className="p-2">0 - 3</td><td className="p-2">Feature (X₄)</td></tr>
                          <tr><td className="p-2 text-white">consume_drogas</td><td className="p-2">Booleana</td><td className="p-2">True / False</td><td className="p-2">Feature (X₅)</td></tr>
                          <tr><td className="p-2 text-white">tiene_red_apoyo</td><td className="p-2">Booleana</td><td className="p-2">True / False</td><td className="p-2">Feature (X₆)</td></tr>
                          <tr><td className="p-2 text-white">edad</td><td className="p-2">Numérica</td><td className="p-2">14 - 75</td><td className="p-2">Demográfica</td></tr>
                          <tr className="bg-indigo-950/30"><td className="p-2 text-indigo-300 font-bold">nivel_riesgo_objetivo</td><td className="p-2 text-indigo-300">Categórica</td><td className="p-2 text-indigo-300">4 clases</td><td className="p-2 text-indigo-300 font-bold">Target (y)</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans-curva">Ejemplo de registro: USR_00042 | Edad: 22 | PHQ-9: 19 | BHS: 14 | C-SSRS: planificación | Drogas: Sí | Apoyo: No → <strong className="text-rose-400">nivel_riesgo: Muy Alto</strong></p>
                  </div>
                ),
              })}
              className="p-3 bg-zinc-950 border border-indigo-900/40 hover:border-indigo-500 rounded-xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-indigo-300"><Database className="w-4 h-4 text-indigo-400" /><span><strong>Ver Tabla de Variables:</strong> Variables principales, ejemplo de registros y resumen del dataset</span></div>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">Click</span>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 9: FORMULACIÓN DEL PROBLEMA DE IA                */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 9 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold px-3 py-1 bg-indigo-950/60 rounded-full border border-indigo-800">INTELIGENCIA ARTIFICIAL</span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-white font-curva-seria pt-2">Formulación del Problema de IA</h2>
            </div>

            {/* Diagramas SVG flowchart para Tarea 1 y Tarea 2 */}
            <div className="space-y-4 font-sans-curva">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <strong className="text-emerald-400 text-sm block">Tarea 1: Clasificación Multiclase Supervisada (Triage)</strong>
                <div className="flex justify-center">
                  <svg viewBox="0 0 700 90" className="w-full max-w-3xl" style={{ height: 'auto' }}>
                    <defs>
                      <linearGradient id="f9z" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#27272a" /><stop offset="100%" stopColor="#18181b" /></linearGradient>
                      <linearGradient id="f9i" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#312e81" /><stop offset="100%" stopColor="#1e1b4b" /></linearGradient>
                      <linearGradient id="f9e" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#064e3b" /><stop offset="100%" stopColor="#022c22" /></linearGradient>
                      <marker id="f9a" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#6366f1" /></marker>
                    </defs>
                    <rect x="10" y="12" width="185" height="60" rx="12" fill="url(#f9z)" stroke="#3f3f46" strokeWidth="2" />
                    <text x="102" y="38" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">📥 Entrada</text>
                    <text x="102" y="55" textAnchor="middle" fill="#a1a1aa" fontSize="10">84 respuestas psicométricas</text>
                    <line x1="195" y1="42" x2="250" y2="42" stroke="#6366f1" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#f9a)" />
                    <text x="222" y="35" textAnchor="middle" fill="#818cf8" fontSize="8">X₁...X₇</text>
                    <rect x="258" y="12" width="185" height="60" rx="12" fill="url(#f9i)" stroke="#6366f1" strokeWidth="2.5" filter="drop-shadow(0 0 6px rgba(99,102,241,0.25))" />
                    <text x="350" y="38" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">⚙️ Clasificación</text>
                    <text x="350" y="55" textAnchor="middle" fill="#a5b4fc" fontSize="10">Multiclase · 4 niveles</text>
                    <line x1="443" y1="42" x2="498" y2="42" stroke="#6366f1" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#f9a)" />
                    <text x="470" y="35" textAnchor="middle" fill="#818cf8" fontSize="8">y</text>
                    <rect x="506" y="12" width="185" height="60" rx="12" fill="url(#f9e)" stroke="#059669" strokeWidth="2" />
                    <text x="598" y="38" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">📤 Salida</text>
                    <text x="598" y="55" textAnchor="middle" fill="#6ee7b7" fontSize="10">Bajo · Mod · Alto · Muy Alto</text>
                  </svg>
                </div>
                <p className="text-xs text-zinc-400 p-3 bg-black rounded-lg border border-zinc-800">
                  <strong className="text-white">¿Por qué corresponde al problema?</strong> Porque el objetivo clínico es priorizar pacientes asignando una categoría de urgencia predefinida. No corresponde a regresión (no se estima un número continuo), ni a clustering (las categorías ya existen).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <strong className="text-indigo-400 text-sm block">Tarea 2: IA Generativa Asistencial (RAG con Function Calling)</strong>
                <div className="flex justify-center">
                  <svg viewBox="0 0 700 90" className="w-full max-w-3xl" style={{ height: 'auto' }}>
                    <rect x="10" y="12" width="185" height="60" rx="12" fill="url(#f9z)" stroke="#3f3f46" strokeWidth="2" />
                    <text x="102" y="38" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">📥 Entrada</text>
                    <text x="102" y="55" textAnchor="middle" fill="#a1a1aa" fontSize="10">Expediente + consulta</text>
                    <line x1="195" y1="42" x2="250" y2="42" stroke="#6366f1" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#f9a)" />
                    <text x="222" y="35" textAnchor="middle" fill="#818cf8" fontSize="8">Tools</text>
                    <rect x="258" y="12" width="185" height="60" rx="12" fill="url(#f9i)" stroke="#818cf8" strokeWidth="2.5" filter="drop-shadow(0 0 6px rgba(99,102,241,0.25))" />
                    <text x="350" y="38" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">🤖 Generación</text>
                    <text x="350" y="55" textAnchor="middle" fill="#a5b4fc" fontSize="10">Síntesis + Prescripción</text>
                    <line x1="443" y1="42" x2="498" y2="42" stroke="#6366f1" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#f9a)" />
                    <text x="470" y="35" textAnchor="middle" fill="#818cf8" fontSize="8">Plan</text>
                    <rect x="506" y="12" width="185" height="60" rx="12" fill="url(#f9e)" stroke="#059669" strokeWidth="2" />
                    <text x="598" y="38" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">📤 Salida</text>
                    <text x="598" y="55" textAnchor="middle" fill="#6ee7b7" fontSize="10">Plan de Seguridad · PDF</text>
                  </svg>
                </div>
                <p className="text-xs text-zinc-400 p-3 bg-black rounded-lg border border-zinc-800">
                  <strong className="text-white">¿Por qué corresponde al problema?</strong> Porque los psicólogos sobrecargados necesitan sintetizar 84 respuestas en segundos y recibir un plan de contención basado en evidencia, consultando la BD en tiempo real.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 10: ALGORITMO O MODELO UTILIZADO                 */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 10 && (
          <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold px-3 py-1 bg-indigo-950/60 rounded-full border border-indigo-800">INTELIGENCIA ARTIFICIAL</span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-white font-curva-seria pt-2">Algoritmo Utilizado: X → y</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans-curva text-sm">
              <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                <strong className="text-indigo-400 text-xs uppercase block">Modelo Seleccionado</strong>
                <p className="text-lg text-white font-bold font-curva-seria">Árbol de Decisión Clínico con Reglas de Puntuación Ponderada</p>
                <p className="text-zinc-300 text-xs">Función: <code className="text-indigo-300">calcularRiesgoGlobal()</code></p>
              </div>
              <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
                <strong className="text-emerald-400 text-xs uppercase block">Criterio de Selección</strong>
                <ul className="space-y-1 text-zinc-300 text-xs">
                  <li>• <strong>Explicabilidad médica obligatoria:</strong> El médico audita cada regla.</li>
                  <li>• <strong>Cero alucinación:</strong> Sin estocasticidad en la capa crítica.</li>
                  <li>• <strong>Velocidad:</strong> 2 milisegundos por paciente, costo cero.</li>
                </ul>
              </div>
            </div>

            {/* Mapeo X → y visual */}
            <div
              onClick={() => setModalData({
                title: 'Mapeo Completo de Variables X → Salida y',
                subtitle: 'Código real: src/lib/calculos.ts → calcularRiesgoGlobal()',
                content: (
                  <pre className="p-4 bg-black rounded-xl border border-zinc-800 font-mono-code text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`// === VARIABLES DE ENTRADA X (7 factores ponderados) ===
X₁: PHQ-9 total         →  0-5 pts  (Depresión)
X₂: BHS total           →  0-4 pts  (Desesperanza)
X₃: C-SSRS severidad    →  0-7 pts  (Ideación/Conducta suicida)
X₄: PHQ-9 ítem 9        →  0-3 pts  (Ideación directa)
X₅: Intento previo      →  0-4 pts  (Historial clínico)
X₆: Consumo sustancias  →  0-2 pts  (Alcohol/drogas)
X₇: Aislamiento social  →  0-2 pts  (Sin red de apoyo)

// === FUNCIÓN DE AGREGACIÓN ===
Puntaje = Σ Puntos(X_i)     // Rango: [0 - 27 pts]

// === VARIABLE OBJETIVO DE SALIDA y ===
y = nivel_riesgo:
    'muy_alto'   SI Puntaje ≥ 12 o C-SSRS = planificación/intento letal
    'alto'       SI Puntaje ≥ 7  o C-SSRS = intento no letal
    'moderado'   SI Puntaje ≥ 4  o C-SSRS = ideación
    'bajo'       SI Puntaje < 4

// === EJEMPLO REAL ===
Paciente USR_00042:
  PHQ-9=21(5pts) + BHS=16(4pts) + C-SSRS=planificación(5pts)
  + Ítem9=3(3pts) + Intento=Sí(4pts) + Drogas=Sí(2pts) + Aislado=Sí(2pts)
  = 25 pts → y = 'muy_alto' → CÓDIGO ROJO → SLA: 2 horas`}
                  </pre>
                ),
              })}
              className="p-3 bg-zinc-950 border border-emerald-900/40 hover:border-emerald-500 rounded-xl flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-emerald-300"><Code2 className="w-4 h-4 text-emerald-400" /><span><strong>Ver Código X → y:</strong> Las 7 variables, pesos, umbrales y un ejemplo de paciente real</span></div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">Click</span>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 11: DEMOSTRACIÓN FUNCIONAL (7 PASOS)             */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 11 && (
          <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold px-3 py-1 bg-indigo-950/60 rounded-full border border-indigo-800">RESULTADOS</span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-white font-curva-seria pt-2">Demostración Funcional en Vivo</h2>
            </div>

            {/* Diagrama de los 7 pasos con flechas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans-curva text-xs">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900"><span className="text-indigo-400 font-bold block">1. Caso Nuevo</span><p className="text-zinc-300">Paciente ingresa a la encuesta con depresión e ideación.</p></div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900"><span className="text-indigo-400 font-bold block">2. Captura</span><p className="text-zinc-300">Wizard de 10 pasos captura 84 variables psicométricas.</p></div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900"><span className="text-indigo-400 font-bold block">3. Validar</span><p className="text-zinc-300">Backend valida rangos y calcula baremos de 5 escalas.</p></div>
              <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-700"><span className="text-indigo-300 font-bold block">4. IA</span><p className="text-zinc-200">Scoring: 25 pts + Copiloto recibe el expediente.</p></div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900"><span className="text-emerald-400 font-bold block">5. Resultado</span><p className="text-zinc-300">Nivel 'muy_alto', Alerta Roja + Plan de Seguridad.</p></div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900"><span className="text-emerald-400 font-bold block">6. Presentar</span><p className="text-zinc-300">Semáforo de crisis en pantalla del paciente y admin.</p></div>
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700 col-span-2"><span className="text-emerald-300 font-bold block">7. Acción</span><p className="text-zinc-200">Psicólogo activa protocolo, exporta PDF y deriva a Línea 113.</p></div>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-center text-sm text-zinc-300 font-sans-curva font-semibold">
              🎯 El equipo ejecutará este recorrido completo en la aplicación web.
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 12: RESULTADOS Y VALOR GENERADO                  */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 12 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold px-3 py-1 bg-indigo-950/60 rounded-full border border-indigo-800">RESULTADOS</span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-white font-curva-seria pt-2">Resultados: Antes vs Después</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans-curva text-sm">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-rose-950/60 space-y-3">
                <span className="text-xs font-bold uppercase text-rose-400 block">Antes (Proceso Manual)</span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-rose-950/20 rounded-lg border border-rose-900/30"><span className="text-zinc-300">Tiempo de Triage</span><span className="font-bold text-rose-300">15 – 20 min</span></div>
                  <div className="flex justify-between items-center p-2 bg-rose-950/20 rounded-lg border border-rose-900/30"><span className="text-zinc-300">Espera para Cita</span><span className="font-bold text-rose-300">Días / Semanas</span></div>
                  <div className="flex justify-between items-center p-2 bg-rose-950/20 rounded-lg border border-rose-900/30"><span className="text-zinc-300">Falsos Negativos</span><span className="font-bold text-rose-300">Riesgo alto</span></div>
                  <div className="flex justify-between items-center p-2 bg-rose-950/20 rounded-lg border border-rose-900/30"><span className="text-zinc-300">Soporte IA</span><span className="font-bold text-rose-300">Inexistente</span></div>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-950 border border-emerald-950/60 space-y-3">
                <span className="text-xs font-bold uppercase text-emerald-400 block">Después (Con Nuestro PMV)</span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-emerald-950/20 rounded-lg border border-emerald-900/30"><span className="text-zinc-200">Tiempo de Triage</span><span className="font-bold text-emerald-300">&lt; 2 segundos</span></div>
                  <div className="flex justify-between items-center p-2 bg-emerald-950/20 rounded-lg border border-emerald-900/30"><span className="text-zinc-200">Alerta al Médico</span><span className="font-bold text-emerald-300">Tiempo real</span></div>
                  <div className="flex justify-between items-center p-2 bg-emerald-950/20 rounded-lg border border-emerald-900/30"><span className="text-zinc-200">Falsos Negativos</span><span className="font-bold text-emerald-300">0% ideación</span></div>
                  <div className="flex justify-between items-center p-2 bg-emerald-950/20 rounded-lg border border-emerald-900/30"><span className="text-zinc-200">Latencia IA</span><span className="font-bold text-emerald-300">1.3 segundos</span></div>
                </div>
              </div>
            </div>

            <EvidenciaTag text="Indicadores antes/después con resultados cuantificables y medidos." />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 13: LIMITACIONES Y MEJORAS FUTURAS               */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 13 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold px-3 py-1 bg-indigo-950/60 rounded-full border border-indigo-800">CONCLUSIÓN</span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-white font-curva-seria pt-2">Limitaciones y Mejoras Futuras</h2>
            </div>

            <div className="space-y-4 font-sans-curva max-w-4xl mx-auto">
              {[
                { n: '1', lim: 'Dataset sintético con errores controlados para proteger privacidad.', mejora: 'Piloto en centro de salud universitario con consentimiento informado.' },
                { n: '2', lim: 'Línea base simbólica con reglas ponderadas fijas.', mejora: 'Entrenar ensambles (Random Forest / XGBoost) con +10,000 registros validados.' },
                { n: '3', lim: 'Fuga detectada: IA pronunciaba nombres de funciones internas.', mejora: 'Doble barrera: System Prompt con alias + sanitizador regex en frontend.' },
              ].map(item => (
                <div key={item.n} className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-start gap-4">
                  <span className="p-2 bg-amber-950/60 rounded-lg text-amber-400 font-bold shrink-0 text-sm">{item.n}</span>
                  <div className="text-sm">
                    <p className="text-zinc-200"><strong>Limitación:</strong> {item.lim}</p>
                    <p className="text-zinc-400"><strong>Mejora:</strong> {item.mejora}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 14: CONCLUSIÓN (3 IDEAS FINALES)                 */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 14 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold px-3 py-1 bg-indigo-950/60 rounded-full border border-indigo-800">CONCLUSIÓN</span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-white font-curva-seria pt-2">Tres Ideas Finales</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans-curva text-sm">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
                <span className="text-xs font-bold uppercase text-emerald-400 block">1. Logro del Objetivo</span>
                <p className="text-lg font-semibold text-white font-curva-seria">Triage en &lt; Segundos</p>
                <p className="text-zinc-300">El PMV demostró que reduce el tiempo de detección, con bajo porcentaje de falsos negativos.</p>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
                <span className="text-xs font-bold uppercase text-indigo-400 block">2. Aprendizaje Técnico</span>
                <p className="text-lg font-semibold text-white font-curva-seria">Arquitectura Híbrida</p>
                <p className="text-zinc-300">La IA simbólica aporta determinismo sin error; la IA generativa aporta prescripción empática bajo supervisión médica obligatoria.</p>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
                <span className="text-xs font-bold uppercase text-amber-400 block">3. Siguiente Paso</span>
                <p className="text-lg font-semibold text-white font-curva-seria">Escalar al Piloto Clínico</p>
                <p className="text-zinc-300">La infraestructura está lista puede ser mejorada y validada para poder medir la TAP con profesionales en campo.</p>
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SLIDE 15: ¡MUCHAS GRACIAS!                             */}
        {/* ═══════════════════════════════════════════════════════ */}
        {currentSlide === 15 && (
          <div className="w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold tracking-tight text-white font-curva-seria leading-none drop-shadow-2xl">
              ¡Muchas Gracias!
            </h1>
            <p className="text-xl sm:text-3xl text-zinc-400 font-curva-seria italic">
              "La tecnología al servicio de la vida y la salud mental."
            </p>
            <div className="pt-8 border-t border-zinc-900/80 max-w-xl mx-auto space-y-2 font-sans-curva">
              <p className="text-base sm:text-lg font-semibold tracking-wider uppercase text-zinc-300">Equipo: <span className="text-white">"Cabo Verde"</span></p>
            </div>
          </div>
        )}

      </main>

      <div className="absolute bottom-6 right-8 text-[11px] font-mono text-zinc-700 select-none pointer-events-none">
        {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
      </div>
    </div>
  )
}
