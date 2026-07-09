'use client'

import { useState, useEffect } from 'react'
import { Heart, X } from 'lucide-react'

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      
      {/* Contenedor del Pop-up (Tarjeta) */}
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-gray-100">
        
        {/* Botón opcional para cerrar arriba a la derecha */}
        <button 
          onClick={handleDismiss} 
          className="absolute top-3 right-3 z-20 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sección de la Imagen (Controlada para que se vea el personaje) */}
        <div className="relative w-full h-56 bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4 overflow-hidden">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmOH_GfXQiSAOChYDMGZEIdx-Hlhie-sLsWjQVMx8KdJh9e7FpsQydoHo&s=10"
            alt="Personaje de soporte"
            className="w-full h-full object-contain transform scale-105" 
          />
        </div>

        {/* Contenido de Texto */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center bg-white">
          
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-semibold mb-4 border border-rose-100">
            <Heart className="w-3.5 h-3.5" fill="currentColor" />
            Proyecto en fase de pruebas
          </span>

          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            ¡Bienvenido/a!
          </h2>

          {/* Descripción Principal */}
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
            Estás por usar un sistema de <strong className="text-gray-900 font-semibold">apoyo en salud mental</strong> todavía en fase de prueba. Los resultados que ves son generados estrictamente con fines académicos.
          </p>

          {/* Nota de ayuda */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 w-full">
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              Si tú o alguien que conoces está pasando por un momento difícil, recuerda que <strong className="text-gray-700 font-medium">no estás solo/a</strong>. Puedes contactar a un profesional o llamar a la línea de apoyo de tu país.
            </p>
          </div>

          {/* Botón de Acción */}
          <button
            onClick={handleDismiss}
            className="w-full py-3.5 bg-gray-900 text-white font-medium rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all shadow-md text-base"
          >
            Entendido y continuar
          </button>
        </div>

      </div>
    </div>
  )
}
