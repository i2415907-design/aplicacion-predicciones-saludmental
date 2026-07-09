'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

export function InterstitialPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // URL de la imagen del personaje
  const characterImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmOH_GfXQiSAOChYDMGZEIdx-Hlhie-sLsWjQVMx8KdJh9e7FpsQydoHo&s=10";

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem('interstitial_seen')
    if (!alreadySeen) {
      setShow(true)
    }
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    setShow(false)
    sessionStorage.setItem('interstitial_seen', 'true')
  }

  if (!show || dismissed) return null

  return (
    // Fondo oscuro exterior (Overlay)
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      
      {/* Contenedor del Pop-up */}
      <div className="relative w-full max-w-md h-[580px] bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-zinc-800 animate-slide-up">
        
        {/* Capa de la Imagen: Ahora es independiente y ocupa la mayor parte de la tarjeta */}
        <div className="absolute top-0 left-0 w-full h-[75%] z-0 p-4">
          <img 
            src={characterImageUrl} 
            alt="Personaje completo" 
            className="w-full h-full object-contain object-top transform scale-110" 
            // 'scale-110' le da un extra de tamaño al personaje sin recortarlo
          />
        </div>

        {/* Capa de degradado de abajo hacia arriba */}
        {/* Sube un poco más para cubrir el cuerpo del personaje de forma suave y permitir leer el texto */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/85 to-transparent"></div>

        {/* Sección de Contenido (Texto y Botón) */}
        {/* 'mt-auto' empuja el texto al fondo, y el tamaño del texto se mantiene compacto */}
        <div className="relative z-20 mt-auto p-6 sm:p-8 flex flex-col items-center text-center">
          
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900/90 text-zinc-200 rounded-full text-xs font-medium mb-4 border border-zinc-800 backdrop-blur-sm">
            <Heart className="w-3.5 h-3.5 text-rose-400" fill="currentColor" />
            Proyecto en fase de pruebas
          </span>

          {/* Título */}
          <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
            Bienvenido
          </h2>

          {/* Descripción */}
          <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed mb-3 max-w-xs drop-shadow-md">
            Estás por usar un sistema de <strong className="text-white font-semibold">apoyo en salud mental</strong> todavía en fase de prueba. Los resultados que ves son generados con fines académicos.
          </p>

          <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed mb-5 max-w-xs drop-shadow-md">
            Si tú o alguien que conoces está pasando por un momento difícil, recuerda que <strong className="text-zinc-200 font-medium">no estás solo/a</strong>. Puedes contactar a un profesional o llamar a la línea de apoyo.
          </p>

          {/* Botón */}
          <button
            onClick={handleDismiss}
            className="w-full py-3 bg-zinc-200 text-black font-bold rounded-xl hover:bg-white active:scale-[0.98] transition-all shadow-xl text-sm sm:text-base"
          >
            Entendido y continuar
          </button>
        </div>

      </div>
    </div>
  )
}
