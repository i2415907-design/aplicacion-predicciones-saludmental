'use client'

import { useEffect, useState, useCallback } from 'react'
import { FileText, Bell, AlertTriangle, TrendingUp, Activity } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalEncuestas: number
  encuestasHoy: number
  notificacionesPendientes: number
  riesgoAlto: number
  riesgoCritico: number
}

interface NotificacionReciente {
  id: number
  tipoRiesgo: string
  titulo: string
  fechaCreacion: string
  leida: boolean
  encuesta: {
    id: number
    nombre: string | null
    apellido: string | null
    edad: number
    sexo: string
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [notificaciones, setNotificaciones] = useState<NotificacionReciente[]>([])
  const [loading, setLoading] = useState(true)

  const loadDashboard = useCallback(async () => {
    try {
      const [statsRes, notifRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/notificaciones?limit=5')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (notifRes.ok) {
        const notifData = await notifRes.json()
        setNotificaciones(notifData.notificaciones || [])
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo) {
      case 'muy_alto': return 'bg-red-100 text-red-700 border-red-200'
      case 'alto': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'moderado': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  const getRiesgoIcon = (riesgo: string) => {
    switch (riesgo) {
      case 'muy_alto': return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'alto': return <AlertTriangle className="w-5 h-5 text-orange-600" />
      default: return <Activity className="w-5 h-5 text-yellow-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard de Administración</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Encuestas</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalEncuestas || 0}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Nuevas Hoy</p>
              <p className="text-3xl font-bold text-green-600">{stats?.encuestasHoy || 0}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>

        <Link href="/admin/notificaciones" className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Notificaciones Pendientes</p>
              <p className="text-3xl font-bold text-orange-600">{stats?.notificacionesPendientes || 0}</p>
            </div>
            <Bell className="w-10 h-10 text-orange-500 opacity-50" />
          </div>
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Riesgo Crítico</p>
              <p className="text-3xl font-bold text-red-600">{stats?.riesgoCritico || 0}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Notificaciones Recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Notificaciones Recientes</h2>
          <Link href="/admin/notificaciones" className="text-sm text-purple-600 hover:text-purple-700">
            Ver todas →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {notificaciones.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-500">
              No hay notificaciones pendientes
            </div>
          ) : (
            notificaciones.map((notif) => (
              <div key={notif.id} className={`px-5 py-4 flex items-center gap-4 ${!notif.leida ? 'bg-purple-50/50' : ''}`}>
                {getRiesgoIcon(notif.tipoRiesgo)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{notif.titulo}</p>
                  <p className="text-sm text-gray-500">
                    {notif.encuesta.nombre || 'Anónimo'} {notif.encuesta.apellido || ''} 
                    · {notif.encuesta.edad} años · {new Date(notif.fechaCreacion).toLocaleDateString('es-CO')}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRiesgoColor(notif.tipoRiesgo)}`}>
                  {notif.tipoRiesgo}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
