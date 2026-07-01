"use client"

interface PreguntaSiNoProps {
  label: string
  value: boolean | null
  onChange: (value: boolean) => void
}

export function PreguntaSiNo({ label, value, onChange }: PreguntaSiNoProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-6 py-2 rounded-lg border text-sm font-medium transition-colors ${
            value === true
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
          }`}
        >
          Sí
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-6 py-2 rounded-lg border text-sm font-medium transition-colors ${
            value === false
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
          }`}
        >
          No
        </button>
      </div>
    </div>
  )
}
