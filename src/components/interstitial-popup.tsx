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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      
      {/* Contenedor del Pop-up con altura ampliada para el personaje */}
      <div className="relative w-full max-w-md h-[620px] bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-zinc-800 animate-slide-up">
        
        {/* Capa de la Imagen: Ocupa el 85% de la tarjeta y con un scale mayor para que sea gigante */}
        <div className="absolute top-0 left-0 w-full h-[85%] z-0 p-2">
          <img 
            src={characterImageUrl} 
            alt="Personaje gigante" 
            className="w-full h-full object-contain object-top transform scale-125 transition-transform duration-300" 
          />
        </div>

        {/* Degradado de abajo hacia arriba más denso para proteger la lectura de las letras claras */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent"></div>

        {/* Sección de Contenido (Letras en Blanco Puro / Claro) */}
        <div className="relative z-20 mt-auto p-6 sm:p-8 flex flex-col items-center text-center">
          
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900/90 text-white rounded-full text-xs font-semibold mb-4 border border-zinc-700 backdrop-blur-sm">
            <Heart className="w-3.5 h-3.5 text-rose-400" fill="currentColor" />
            Proyecto en fase de pruebas
          </span>

          {/* Título: Blanco Puro */}
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight drop-shadow-xl">
            Bienvenido
          </h2>

          {/* Descripción Principal: Blanco Brillante */}
          <p className="text-white text-xs sm:text-sm leading-relaxed mb-3 max-w-xs drop-shadow-xl font-normal">
            Estás por usar un sistema de <strong className="text-white font-extrabold underline decoration-rose-500/50">apoyo en salud mental</strong> todavía en fase de prueba. Los resultados que ves son generados con fines académicos.
          </p>

          {/* Nota Secundaria: Gris ultra claro */}
          <p className="text-zinc-200 text-[11px] sm:text-xs leading-relaxed mb-6 max-w-xs drop-shadow-xl">
            Si tú o alguien que conoces está pasando por un momento difícil, recuerda que <strong className="text-white font-bold">no estás solo/a</strong>. Puedes contactar a un profesional o llamar a la línea de apoyo.
          </p>

          {/* Botón de Acción */}
          <button
            onClick={handleDismiss}
            className="w-full py-3.5 bg-white text-black font-black rounded-xl hover:bg-zinc-100 active:scale-[0.98] transition-all shadow-2xl text-sm sm:text-base tracking-wide"
          >
            Entendido y continuar
          </button>
        </div>

      </div>
    </div>
  )
}
