"use client"

import { cn } from "@/lib/utils"

interface BarraProgresoProps {
  pasoActual: number
  totalPasos: number
  pasos: string[]
}

export function BarraProgreso({ pasoActual, totalPasos, pasos }: BarraProgresoProps) {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex justify-between items-center mb-2 min-w-0">
        <span className="text-sm font-medium text-gray-700">
          Paso {pasoActual + 1} de {totalPasos}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round(((pasoActual + 1) / totalPasos) * 100)}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((pasoActual + 1) / totalPasos) * 100}%` }}
        />
      </div>

      <div className="flex justify-between min-w-[600px]">
        {pasos.map((paso, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col items-center flex-1",
              index <= pasoActual ? "text-blue-600" : "text-gray-400"
            )}
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mb-1",
                index < pasoActual && "bg-green-500 text-white",
                index === pasoActual && "bg-blue-600 text-white",
                index > pasoActual && "bg-gray-200 text-gray-500"
              )}
            >
              {index < pasoActual ? "✓" : index + 1}
            </div>
            <span className="text-[10px] text-center leading-tight px-1 hidden lg:block">
              {paso}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
