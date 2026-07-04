"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { interpretarPHQ9, interpretarDASS21 } from "@/lib/calculos"
import { generarPdf } from "@/lib/pdf-generator"
import { useAuth } from "@/lib/auth-context"
import { ArchivarCaso } from "@/components/admin/archivar-caso"
import { Download } from "lucide-react"

interface EncuestaData {
  id: number
  nombre: string | null
  apellido: string | null
  edad: number
  sexo: string
  estadoCivil?: string
  nivelEducativo?: string
  estadoUsuario: string
  createdAt: string
  phq9?: {
    puntajeTotal: number
    nivelGravedad: string
    ideacionSuicida: number
  }
  cssrs?: {
    nivelSeveridad: string
    deseosMorir: boolean
    pensamientosSuicidas: boolean
    intentoPrevio: boolean
  }
  bhs?: {
    puntajeTotal: number
    nivelRiesgo: string
  }
  rosenberg?: {
    item1: number
    item2: number
    item3: number
    item4: number
    item5: number
    item6: number
    item7: number
    item8: number
    item9: number
    item10: number
  }
  dass21?: {
    puntajeEstres: number
    puntajeAnsiedad: number
    puntajeDepresion: number
  }
}

export default function EncuestaResultadoPage() {
  const params = useParams()
  const [encuesta, setEncuesta] = useState<EncuestaData | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    const fetchEncuesta = async () => {
      try {
        const response = await fetch(`/api/encuesta/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setEncuesta(data)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEncuesta()
  }, [params.id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!encuesta) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Encuesta no encontrada</h2>
        <Link href="/encuesta" className="text-blue-600 hover:underline">
          Volver al formulario
        </Link>
      </div>
    )
  }

  // Rosenberg: items 2,5,6,8,9 son negativos (se invierten: 5 - valor)
  const NEGATIVE_ROSENBERG = [2, 5, 6, 8, 9]
  const rosenbergScore = encuesta.rosenberg
    ? Object.entries(encuesta.rosenberg).reduce((sum, [key, val]) => {
        if (key === 'id' || key === 'encuestaId') return sum
        const itemNum = parseInt(key.replace('item', ''))
        if (NEGATIVE_ROSENBERG.includes(itemNum)) {
          return sum + (5 - (val as number))
        }
        return sum + (val as number)
      }, 0)
    : 0

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "bajo":
      case "minimo":
        return "bg-green-100 text-green-800"
      case "leve":
      case "moderado":
        return "bg-yellow-100 text-yellow-800"
      case "alto":
      case "moderadamente_severo":
        return "bg-orange-100 text-orange-800"
      case "muy_alto":
      case "severo":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resultados de la Encuesta #{encuesta.id}
        </h1>
        <p className="text-gray-600">
          Completada el {new Date(encuesta.createdAt).toLocaleDateString("es-ES")} | 
          {encuesta.edad} años | {encuesta.sexo}
        </p>
      </div>

      {/* Alerta de riesgo alto */}
      {(encuesta.cssrs?.nivelSeveridad === "planificacion" || 
        encuesta.cssrs?.nivelSeveridad === "intento_letal" ||
        (encuesta.phq9?.ideacionSuicida ?? 0) >= 2) && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-semibold text-red-800">Alerta de Riesgo Alto</p>
              <p className="text-sm text-red-700">
                Se han detectado indicadores de riesgo que requieren atención profesional inmediata.
                Si usted o alguien que conoce está en crisis, llame al 988 (Línea de Prevención del Suicidio).
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* PHQ-9 */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">PHQ-9: Depresión</h3>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-blue-600">
              {encuesta.phq9?.puntajeTotal || 0}
            </div>
            <div className="text-sm text-gray-500">/ 27 puntos</div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getNivelColor(encuesta.phq9?.nivelGravedad || "")}`}>
            {interpretarPHQ9(encuesta.phq9?.puntajeTotal || 0)}
          </div>
          {encuesta.phq9?.ideacionSuicida !== undefined && encuesta.phq9.ideacionSuicida > 0 && (
            <div className="mt-3 p-2 bg-yellow-50 rounded text-sm">
              <span className="font-medium">Ítem 9 (ideación suicida):</span> {encuesta.phq9.ideacionSuicida}/3
            </div>
          )}
        </div>

        {/* C-SSRS */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">C-SSRS: Ideación Suicida</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium mb-4 ${getNivelColor(
            encuesta.cssrs?.nivelSeveridad === "intento_letal" ? "alto" :
            encuesta.cssrs?.nivelSeveridad === "planificacion" ? "alto" :
            encuesta.cssrs?.nivelSeveridad === "intento_no_letal" ? "moderado" : "bajo"
          )}`}>
            {encuesta.cssrs?.nivelSeveridad === "ideacion" && "Ideación"}
            {encuesta.cssrs?.nivelSeveridad === "planificacion" && "Planificación"}
            {encuesta.cssrs?.nivelSeveridad === "intento_no_letal" && "Intento previo"}
            {encuesta.cssrs?.nivelSeveridad === "intento_letal" && "Riesgo muy alto"}
          </div>
          <div className="space-y-2 text-sm">
            <p>Deseos de morir: {encuesta.cssrs?.deseosMorir ? "Sí" : "No"}</p>
            <p>Pensamientos suicidas: {encuesta.cssrs?.pensamientosSuicidas ? "Sí" : "No"}</p>
            <p>Intento previo: {encuesta.cssrs?.intentoPrevio ? "Sí" : "No"}</p>
          </div>
        </div>

        {/* BHS */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">BHS: Desesperanza</h3>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-purple-600">
              {encuesta.bhs?.puntajeTotal || 0}
            </div>
            <div className="text-sm text-gray-500">/ 20 puntos</div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getNivelColor(encuesta.bhs?.nivelRiesgo || "")}`}>
            Desesperanza {encuesta.bhs?.nivelRiesgo === "bajo" ? "Baja" : 
                         encuesta.bhs?.nivelRiesgo === "moderado" ? "Moderada" : "Alta"}
          </div>
        </div>

        {/* Rosenberg */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rosenberg: Autoestima</h3>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-green-600">
              {rosenbergScore}
            </div>
            <div className="text-sm text-gray-500">/ 40 puntos</div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getNivelColor(
            rosenbergScore <= 15 ? "alto" : rosenbergScore <= 25 ? "moderado" : "bajo"
          )}`}>
            Autoestima {rosenbergScore <= 15 ? "Baja" : rosenbergScore <= 25 ? "Media" : "Alta"}
          </div>
        </div>

        {/* DASS-21 */}
        <div className="bg-white rounded-xl shadow-sm border p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">DASS-21: Depresión, Ansiedad y Estrés</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {encuesta.dass21?.puntajeDepresion || 0}
              </div>
              <div className="text-sm text-gray-500">Depresión</div>
              <div className="text-xs text-gray-600 mt-1">
                {interpretarDASS21(encuesta.dass21?.puntajeDepresion || 0, "depresion")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {encuesta.dass21?.puntajeAnsiedad || 0}
              </div>
              <div className="text-sm text-gray-500">Ansiedad</div>
              <div className="text-xs text-gray-600 mt-1">
                {interpretarDASS21(encuesta.dass21?.puntajeAnsiedad || 0, "ansiedad")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {encuesta.dass21?.puntajeEstres || 0}
              </div>
              <div className="text-sm text-gray-500">Estrés</div>
              <div className="text-xs text-gray-600 mt-1">
                {interpretarDASS21(encuesta.dass21?.puntajeEstres || 0, "estres")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nota Importante</h3>
        <p className="text-sm text-gray-700">
          Estos resultados son una evaluación preliminar y no constituyen un diagnóstico clínico.
          Si usted está experimentando síntomas de depresión o pensamientos suicidas, por favor
          contacte a un profesional de salud mental. En caso de crisis, llame al 988.
        </p>
      </div>

      {/* Admin: Archivar caso */}
      {isAdmin && user && (
        <div className="mb-6">
          <ArchivarCaso encuestaId={encuesta.id} adminAlias={user.alias} />
        </div>
      )}

      <div className="flex flex-wrap justify-between gap-3">
        <Link
          href="/encuesta"
          className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Nueva Encuesta
        </Link>
        <div className="flex gap-3">
          <button
            onClick={() => {
              generarPdf({
                id: encuesta.id,
                nombre: encuesta.nombre,
                apellido: encuesta.apellido,
                edad: encuesta.edad,
                sexo: encuesta.sexo,
                estadoCivil: encuesta.estadoCivil,
                nivelEducativo: encuesta.nivelEducativo,
                fechaCreacion: encuesta.createdAt,
                phq9: encuesta.phq9,
                cssrs: encuesta.cssrs,
                bhs: encuesta.bhs,
                rosenberg: encuesta.rosenberg,
                dass21: encuesta.dass21,
              })
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Ver Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
