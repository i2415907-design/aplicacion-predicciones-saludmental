'use client'

import { useState, useEffect } from 'react'
import { Heart, X } from 'lucide-react'

export function InterstitialPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Verificar si el usuario ya ha visto el pop-up en esta sesión
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

  // Si no se debe mostrar o ya se cerró, no renderizar nada
  if (!show || dismissed) return null

  return (
    // Overlay de pantalla completa (fondo oscurecido)
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      
      {/* Contenedor principal del Pop-up (la tarjeta modal) */}
      <div className="relative w-full max-w-lg bg-gray-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-gray-800 animate-slide-up">
        
        {/* Botón de cierre (esquina superior derecha) */}
        <button 
          onClick={handleDismiss} 
          className="absolute top-4 right-4 z-20 p-2 bg-gray-800/60 text-gray-400 rounded-full hover:bg-gray-700/80 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sección de Fondo de Personaje con Degradado Integrado */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Imagen del personaje (reemplaza 'character_bg.jpg' con tu ruta) */}
          <img
            src="/character_bg.jpg" // Asegúrate de que esta ruta sea correcta en tu carpeta /public
            alt="Fondo de personaje de apoyo"
            className="w-full h-full object-cover object-center opacity-30 transform scale-110 blur-sm"
          />
          {/* Degradado Superpuesto (de negro opaco abajo a negro transparente arriba) */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/70 to-gray-950"></div>
          {/* Toque de luz superior adicional */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900/40 to-transparent"></div>
        </div>

        {/* Sección de Contenido (sobre el fondo) */}
        <div className="relative z-10 p-6 sm:p-10 flex flex-col items-center text-center">
          
          {/* Badge: "Proyecto en fase de pruebas" */}
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-800/80 text-white rounded-full text-sm font-medium mb-6 border border-gray-700">
            <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />
            Proyecto en fase de pruebas
          </span>

          {/* Título: "¡Bienvenido/a!" */}
          <h2 className="text-3xl font-extrabold text-white mb-4 drop-shadow-md">
            ¡Bienvenido/a!
          </h2>

          {/* Primer Párrafo de Descripción */}
          <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-6 max-w-md drop-shadow-md">
            Estás por usar un sistema de <strong className="text-white font-semibold">apoyo en salud mental</strong> todavía en fase de prueba. Los resultados que ves son generados con fines académicos.
          </p>

          {/* Segundo Párrafo de Descripción */}
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-10 max-w-md drop-shadow-md">
            Si tú o alguien que conoces está pasando por un momento difícil, recuerda que <strong className="text-gray-200 font-medium">no estás solo/a</strong>. Puedes contactar a un profesional de salud mental o llamar a la línea de apoyo de tu país.
          </p>

          {/* Botón de Acción Principal */}
          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto px-12 py-4 bg-white text-gray-950 font-bold rounded-2xl hover:bg-gray-100 active:scale-[0.97] transition-all shadow-lg text-lg"
          >
            Entendido y continuar
          </button>
        </div>

      </div>
    </div>
  )
}
