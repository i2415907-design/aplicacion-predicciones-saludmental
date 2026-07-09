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
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-700">
        {/* Image section */}
        <div className="relative w-full h-72 sm:h-80 bg-black flex items-center justify-center overflow-hidden">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmOH_GfXQiSAOChYDMGZEIdx-Hlhie-sLsWjQVMx8KdJh9e7FpsQydoHo&s=10"
            alt="Mascota del sistema"
            className="h-full w-auto object-contain"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">
              <Heart className="w-3 h-3 text-pink-400" fill="currentColor" />
              Proyecto en fase de prueba
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Bienvenido
          </h2>

          <p className="text-gray-300 text-base leading-relaxed max-w-md mx-auto">
            Estas por usar un sistema de <strong className="text-white">apoyo en salud mental</strong> todavia en fase de prueba. Los resultados que ves son generados con fines academicos.
          </p>

          <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
            Si tu o alguien que conoces esta pasando por un momento dificil, recuerda que <strong className="text-gray-200">no estas solo/a</strong>. Puedes contacting a un profesional de salud mental o llamar a la linea de apoyo.
          </p>

          {/* Crisis line */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 max-w-sm mx-auto">
            <p className="text-sm text-gray-300">
              Linea de Prevencion del Suicidio
            </p>
            <p className="text-2xl font-bold text-white mt-1">
              988
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Disponible 24 horas, 7 dias a la semana
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 flex justify-center">
          <button
            onClick={handleDismiss}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25 text-base"
          >
            Entendido, continuar
          </button>
        </div>
      </div>
    </div>
  )
}
