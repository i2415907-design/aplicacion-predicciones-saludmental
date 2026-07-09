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
      <div 
        className="relative w-full max-w-md bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-zinc-800 aspect-[4/5] sm:aspect-auto"
        style={{
          backgroundImage: `url(${characterImageUrl})`,
          backgroundSize: 'contain', // <--- Esto asegura que el personaje salga completo
          backgroundPosition: 'top center', // <--- Centrado arriba para dejar espacio al texto abajo
          backgroundRepeat: 'no-repeat'
        }}
      >
        
        {/* Degradado de abajo hacia arriba */}
        {/* Desde negro sólido abajo (para leer el texto) hasta transparente arriba (para ver al personaje limpio) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>

        {/* Contenido de la tarjeta */}
        <div className="relative z-10 mt-auto p-6 sm:p-8 flex flex-col items-center text-center">
          
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900/90 text-zinc-200 rounded-full text-xs font-medium mb-4 border border-zinc-800 backdrop-blur-sm">
            <Heart className="w-3.5 h-3.5 text-rose-400" fill="currentColor" />
            Proyecto en fase de pruebas
          </span>

          {/* Título */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight drop-shadow-md">
            Bienvenido
          </h2>

          {/* Descripción */}
          <p className="text-zinc-200 text-sm sm:text-base leading-relaxed mb-4 max-w-sm drop-shadow-md">
            Estás por usar un sistema de <strong className="text-white font-semibold">apoyo en salud mental</strong> todavía en fase de prueba. Los resultados que ves son generados con fines académicos.
          </p>

          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm drop-shadow-md">
            Si tú o alguien que conoces está pasando por un momento difícil, recuerda que <strong className="text-zinc-200 font-medium">no estás solo/a</strong>. Puedes contactar a un profesional o llamar a la línea de apoyo.
          </p>

          {/* Botón */}
          <button
            onClick={handleDismiss}
            className="w-full py-3.5 bg-zinc-200 text-black font-bold rounded-xl hover:bg-white active:scale-[0.98] transition-all shadow-xl text-base"
          >
            Entendido y continuar
          </button>
        </div>

      </div>
    </div>
  )
}
