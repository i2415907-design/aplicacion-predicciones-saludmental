'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { FileText, AlertTriangle, Calendar, ChevronRight } from 'lucide-react'

interface EncuestaResumen {
  id: number
  nombre: string | null
  apellido: string | null
  edad: number
  sexo: string
  fechaCreacion: string
  phq9: number
  nivelDepresion: string
  nivelRiesgo: string
  cssrsNivel: string
  bhsNivel: string
}

export default function MisEncuestasPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [encuestas, setEncuestas] = useState<EncuestaResumen[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetch('/api/usuario/encuestas')
        .then((res) => res.json())
        .then((data) => {
          setEncuestas(data.encuestas || [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="space-y-3 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo) {
      case 'muy_alto': return 'bg-red-100 text-red-700 border-red-200'
      case 'alto': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'moderado': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Encuestas</h1>
        <p className="text-gray-600">
          Historial de todas las encuestas que has completado.
        </p>
      </div>

      {encuestas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes encuestas ainda</h3>
          <p className="text-gray-500 mb-4">Completa tu primera encuesta para ver tus resultados aqui.</p>
          <Link
            href="/encuesta"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ir a Encuesta
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {encuestas.map((encuesta) => (
            <div
              key={encuesta.id}
              className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-gray-500">#{encuesta.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getRiesgoColor(encuesta.nivelRiesgo)}`}>
                      {encuesta.nivelRiesgo === 'muy_alto' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                      Riesgo {encuesta.nivelRiesgo.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(encuesta.fechaCreacion).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span>{encuesta.edad} anos</span>
                    <span className="capitalize">{encuesta.sexo}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>PHQ-9: <strong className="text-gray-700">{encuesta.phq9}/27</strong></span>
                    <span>Depresion: <strong className="text-gray-700">{encuesta.nivelDepresion.replace('_', ' ')}</strong></span>
                    <span>C-SSRS: <strong className="text-gray-700">{encuesta.cssrsNivel.replace('_', ' ')}</strong></span>
                    <span>BHS: <strong className="text-gray-700">{encuesta.bhsNivel}</strong></span>
                  </div>
                </div>
                <Link
                  href={`/encuesta/${encuesta.id}`}
                  className="flex items-center gap-1 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                >
                  Ver Resultados
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
