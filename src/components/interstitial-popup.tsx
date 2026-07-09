'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

export function InterstitialPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Fullscreen image background */}
      <div className="absolute inset-0 bg-black">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmOH_GfXQiSAOChYDMGZEIdx-Hlhie-sLsWjQVMx8KdJh9e7FpsQydoHo&s=10"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>

      {/* Content overlaid on image */}
      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-12 px-6 text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-white text-sm font-medium mb-4 border border-white/10">
          <Heart className="w-3.5 h-3.5 text-pink-400" fill="currentColor" />
          Proyecto en fase de pruebas
        </span>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 drop-shadow-lg">
          Bienvenido
        </h2>

        {/* Description */}
        <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-md mb-2 drop-shadow-md">
          Estas por usar un sistema de <strong className="text-white">apoyo en salud mental</strong> todavia en fase de prueba. Los resultados que ves son generados con fines academicos.
        </p>

        <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-md mb-6 drop-shadow-md">
          Si tu o alguien que conoces esta pasando por un momento dificil, recuerda que <strong className="text-white/90">no estas solo/a</strong>. Puedes contactar a un profesional de salud mental o llamar a la linea de apoyo.
        </p>

        {/* Button */}
        <button
          onClick={handleDismiss}
          className="px-10 py-3.5 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all shadow-2xl text-base sm:text-lg"
        >
          Entendido y continuar
        </button>
      </div>
    </div>
  )
}
