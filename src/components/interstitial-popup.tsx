'use client'

import { useState, useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'

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
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-white" />
          <h2 className="text-xl font-bold text-white">Aviso Importante</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-gray-800 text-base leading-relaxed">
            Esta es una <strong>aplicacion en fase de prueba</strong>. Los resultados mostrados por el sistema de Inteligencia Artificial son generados con fines academicos y de demostracion.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            No debe tomarse los diagnosticos o recomendaciones de forma literal. Si usted o alguien que conoce esta experimentando una crisis de salud mental, contacte directamente a un profesional de salud mental o llame a la linea de emergencia.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-amber-800 text-sm font-medium">
              En caso de crisis, llame al 988 (Linea de Prevencion del Suicidio) o acuda a la sala de emergencias mas cercana.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={handleDismiss}
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
