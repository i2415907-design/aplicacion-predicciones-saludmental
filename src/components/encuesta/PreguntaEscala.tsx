"use client"

interface PreguntaEscalaProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  minLabel?: string
  maxLabel?: string
}

export function PreguntaEscala({
  label,
  value,
  onChange,
  min = 1,
  max = 5,
  minLabel,
  maxLabel,
}: PreguntaEscalaProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {label}
      </label>
      <div className="flex justify-between items-center space-x-2">
        {minLabel && (
          <span className="text-xs text-gray-500 dark:text-gray-400 w-16">{minLabel}</span>
        )}
        <div className="flex space-x-2">
          {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                value === num
                  ? "bg-blue-600 text-white border-blue-600"
                   : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        {maxLabel && (
          <span className="text-xs text-gray-500 dark:text-gray-400 w-16">{maxLabel}</span>
        )}
      </div>
    </div>
  )
}
