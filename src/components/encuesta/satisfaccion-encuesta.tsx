"use client"

import { useState } from "react"

interface SatisfaccionEncuestaProps {
  encuestaId: number
  onGuardado?: () => void
}

export function SatisfaccionEncuesta({ encuestaId, onGuardado }: SatisfaccionEncuestaProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGuardar = async () => {
    if (rating === null) return

    try {
      const res = await fetch("/api/metricas/satisfaccion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encuestaId, satisfaccion: rating }),
      })

      if (res.ok) {
        setGuardado(true)
        onGuardado?.()
      } else {
        setError("No se pudo guardar tu respuesta")
      }
    } catch {
      setError("Error de conexión")
    }
  }

  if (guardado) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 text-center">
        <p className="text-green-700 dark:text-green-300 font-medium">
          ¡Gracias por tu feedback!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        ¿Qué tan útil te resultó esta evaluación?
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Tu respuesta es anónima y opcional. Ayuda a mejorar la herramienta.
      </p>

      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className={`w-12 h-12 rounded-lg text-lg font-bold transition-all ${
              rating === value
                ? "bg-indigo-600 text-white scale-110"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            aria-label={`${value} estrella${value > 1 ? "s" : ""}`}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 px-1 mb-4">
        <span>Nada útil</span>
        <span>Muy útil</span>
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-3 text-center">{error}</p>
      )}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleGuardar}
          disabled={rating === null}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}
