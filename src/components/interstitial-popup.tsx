'use client'

import { useState, useEffect } from 'react'
import { Heart, Phone } from 'lucide-react'

export function InterstitialPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)

  const characterImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmOH_GfXQiSAOChYDMGZEIdx-Hlhie-sLsWjQVMx8KdJh9e7FpsQydoHo&s=10";

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem('interstitial_seen')
    if (!alreadySeen) {
      setShow(true)
    }
  }, [])

  const handleDismiss = () => {
    if (!consentChecked) return
    setDismissed(true)
    setShow(false)
    sessionStorage.setItem('interstitial_seen', 'true')
    sessionStorage.setItem('consentimiento_aceptado', 'true')
  }

  if (!show || dismissed) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      
      <div className="relative w-full max-w-md h-[720px] bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-zinc-800 animate-slide-up">
        
        {/* Capa de la Imagen */}
        <div className="absolute top-0 left-0 w-full h-[75%] z-0 p-2">
          <img 
            src={characterImageUrl} 
            alt="Personaje gigante" 
            className="w-full h-full object-contain object-top transform scale-125 transition-transform duration-300" 
          />
        </div>

        {/* Degradado protector */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent"></div>

        {/* Sección de Contenido */}
        <div className="relative z-20 mt-auto p-6 sm:p-8 flex flex-col items-center text-center text-white">
          
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/90 !text-white rounded-full text-xs font-semibold mb-3 border border-zinc-600 backdrop-blur-sm">
            <Heart className="w-3.5 h-3.5 text-rose-400" fill="currentColor" />
            Proyecto en fase de pruebas
          </span>

          {/* Título */}
          <h2 className="text-2xl sm:text-3xl font-black !text-white mb-2 tracking-tight drop-shadow-xl">
            Bienvenido
          </h2>

          {/* Descripción Principal */}
          <p className="!text-white text-xs sm:text-sm leading-relaxed mb-2 max-w-xs drop-shadow-xl font-normal">
            Estás por usar un sistema de <strong className="!text-white font-extrabold underline decoration-rose-500/50">apoyo en salud mental</strong> todavía en fase de prueba. Los resultados son generados con fines <strong className="!text-white font-extrabold">académicos</strong>.
          </p>

          {/* Disclaimer */}
          <div className="w-full bg-zinc-800/60 rounded-lg p-2.5 mb-3 border border-zinc-700">
            <p className="!text-white/80 text-[10px] sm:text-[11px] leading-relaxed">
              <strong className="!text-white">Aviso importante:</strong> Esta aplicación <strong className="!text-white">NO</strong> es un servicio de salud mental profesional. Los resultados <strong className="!text-white">NO</strong> constituyen un diagnóstico clínico y <strong className="!text-white">NO</strong> deben tomarse como definitorios. Si necesitas ayuda, contacta a un profesional.
            </p>
          </div>

          {/* Línea de crisis inline */}
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span className="!text-white/80 text-[11px]">Crisis:</span>
            <a href="tel:116" className="!text-white text-[11px] font-bold bg-zinc-800 px-2 py-0.5 rounded hover:bg-zinc-700 transition-colors">SAMU 116</a>
            <a href="tel:100" className="!text-white text-[11px] font-bold bg-zinc-800 px-2 py-0.5 rounded hover:bg-zinc-700 transition-colors">Línea 100</a>
          </div>

          {/* Consentimiento */}
          <label className="flex items-start gap-2.5 w-full mb-4 cursor-pointer group">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-rose-500 focus:ring-rose-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="!text-white/80 text-[10px] sm:text-[11px] leading-relaxed text-left group-hover:!text-white transition-colors">
              He leído y comprendo que esta es una aplicación <strong className="!text-white">académica en fase de pruebas</strong>. Acepto que los resultados son orientativos y <strong className="!text-white">no reemplazan una evaluación clínica profesional</strong>. Consiento el uso de mis respuestas con fines académicos de investigación.
            </span>
          </label>

          {/* Botón de Acción */}
          <button
            onClick={handleDismiss}
            disabled={!consentChecked}
            className="w-full py-3.5 bg-white !text-black font-black rounded-xl hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-2xl text-sm sm:text-base tracking-wide disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            Entendido y continuar
          </button>
        </div>

      </div>
    </div>
  )
}
