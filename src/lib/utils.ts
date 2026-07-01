import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getNivelRiesgoColor(nivel: string): string {
  switch (nivel) {
    case 'bajo': return 'text-green-600 bg-green-50'
    case 'moderado': return 'text-yellow-600 bg-yellow-50'
    case 'alto': return 'text-orange-600 bg-orange-50'
    case 'muy_alto': return 'text-red-600 bg-red-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

export function getNivelRiesgoLabel(nivel: string): string {
  switch (nivel) {
    case 'bajo': return 'Riesgo Bajo'
    case 'moderado': return 'Riesgo Moderado'
    case 'alto': return 'Riesgo Alto'
    case 'muy_alto': return 'Riesgo Muy Alto'
    default: return 'Sin evaluar'
  }
}

export function getPHQ9Color(puntaje: number): string {
  if (puntaje <= 4) return 'text-green-600'
  if (puntaje <= 9) return 'text-yellow-600'
  if (puntaje <= 14) return 'text-orange-600'
  if (puntaje <= 19) return 'text-red-500'
  return 'text-red-700'
}
