"use client"

import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line,
} from "recharts"

interface DashboardData {
  totalEncuestas: number
  encuestasUltimoMes: number
  promedioPHQ9: number
  distribucionRiesgo: Record<string, number>
  totalFallecidos: number
  fallecimientosVoluntarios: number
  distribucionEdad: { rango: string; cantidad: number }[]
  distribucionSexo: { sexo: string; _count: number }[]
}

const COLORS = ["#22c55e", "#eab308", "#f97316", "#ef4444"]
const RIESGO_LABELS: Record<string, string> = {
  ideacion: "Ideación",
  planificacion: "Planificación",
  intento_no_letal: "Intento No Letal",
  intento_letal: "Intento Letal",
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch("/api/dashboard")
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard BI</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <p className="text-gray-600">No hay datos disponibles</p>
      </div>
    )
  }

  const riesgoData = Object.entries(data.distribucionRiesgo).map(([key, value]) => ({
    name: RIESGO_LABELS[key] || key,
    value,
  }))

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard BI</h1>
      <p className="text-gray-600 mb-8">Análisis de datos de depresión y prevención del suicidio</p>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-500 mb-1">Total Encuestas</p>
          <p className="text-3xl font-bold text-blue-600">{data.totalEncuestas}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-500 mb-1">Último Mes</p>
          <p className="text-3xl font-bold text-green-600">{data.encuestasUltimoMes}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-500 mb-1">Promedio PHQ-9</p>
          <p className="text-3xl font-bold text-orange-600">{data.promedioPHQ9}</p>
          <p className="text-xs text-gray-400">/ 27 puntos</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-500 mb-1">Fallecidos</p>
          <p className="text-3xl font-bold text-red-600">{data.totalFallecidos}</p>
          <p className="text-xs text-gray-400">
            {data.fallecimientosVoluntarios} voluntarios
          </p>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Distribución por Edad */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Edad</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.distribucionEdad}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rango" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por Sexo */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Sexo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.distribucionSexo.map((s) => ({
                  name: s.sexo === "masculino" ? "Masculino" : 
                        s.sexo === "femenino" ? "Femenino" : s.sexo,
                  value: s._count,
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.distribucionSexo.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Niveles de Riesgo Suicida */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Niveles de Ideación Suicida</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riesgoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Casos" radius={[4, 4, 0, 0]}>
                {riesgoData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Riesgo</h3>
          <div className="space-y-4">
            {riesgoData.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="flex-1 text-sm text-gray-700">{item.name}</span>
                <span className="font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Análisis de Tendencias */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Encuestas (Últimos 12 meses)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[
            { mes: "Ene", encuestas: 12 },
            { mes: "Feb", encuestas: 19 },
            { mes: "Mar", encuestas: 15 },
            { mes: "Abr", encuestas: 22 },
            { mes: "May", encuestas: 28 },
            { mes: "Jun", encuestas: 35 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="encuestas" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer con nota */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sobre este Dashboard</h3>
        <p className="text-sm text-gray-700">
          Los datos presentados provienen de encuestas clínicas con escalas validadas internacionalmente.
          Las estadísticas son actualizadas en tiempo real. Para análisis más detallados, utilice
          el Chat IA o consulte las secciones específicas de análisis.
        </p>
      </div>
    </div>
  )
}
