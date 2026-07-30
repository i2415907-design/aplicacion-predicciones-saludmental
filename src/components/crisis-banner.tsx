'use client'

import { useState, useEffect } from 'react'
import { Phone, X } from 'lucide-react'

export function CrisisBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('crisis_banner_dismissed')
    if (!dismissed) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const handleDismiss = () => {
    setVisible(false)
    sessionStorage.setItem('crisis_banner_dismissed', 'true')
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
            <Phone className="w-3.5 h-3.5" />
            Línea de Crisis:
          </span>
          <a
            href="tel:116"
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-200 dark:bg-amber-800 rounded-full text-amber-900 dark:text-amber-100 font-bold hover:bg-amber-300 dark:hover:bg-amber-700 transition-colors"
          >
            SAMU 116
          </a>
          <a
            href="tel:100"
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-200 dark:bg-amber-800 rounded-full text-amber-900 dark:text-amber-100 font-bold hover:bg-amber-300 dark:hover:bg-amber-700 transition-colors"
          >
            Línea 100
          </a>
          <span className="text-amber-700 dark:text-amber-400 hidden sm:inline">
            | Si estás en crisis, llám ahora. No estás solo/a.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-600 dark:text-amber-500 hidden md:inline">
            App en fase de pruebas
          </span>
          <button
            onClick={handleDismiss}
            className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 p-0.5"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
