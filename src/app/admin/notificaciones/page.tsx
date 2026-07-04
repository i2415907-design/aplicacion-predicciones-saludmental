'use client'

import { useEffect, useState, useCallback } from 'react'
import { Bell, BellOff, AlertTriangle, AlertCircle, Info, Clock, MessageSquare } from 'lucide-react'

interface Notificacion {
  id: number
  tipoRiesgo: string
  titulo: string
  descripcion: string
  leida: boolean
  accionRequerida: string | null
  respuesta: string | null
  fechaCreacion: string
  fechaLectura: string | null
  encuesta: {
    id: number
    nombre: string | null
    apellido: string | null
    edad: number
    sexo: string
  }
}

export default function AdminNotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'todas' | 'no_leidas' | 'leidas'>('todas')
  const [selectedNotif, setSelectedNotif] = useState<Notificacion | null>(null)
  const [respuesta, setRespuesta] = useState('')
  const [pagina, setPagina] = useState(1)
  const porPagina = 10

  const loadNotificaciones = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: '100',
        ...(filtro === 'no_leidas' && { soloNoLeidas: 'true' })
      })

      const res = await fetch(`/api/admin/notificaciones?${params}`)
      if (res.ok) {
        const data = await res.json()
        setNotificaciones(data.notificaciones || [])
      }
    } catch (error) {
      console.error('Error loading notificaciones:', error)
    } finally {
      setLoading(false)
    }
  }, [filtro])

  useEffect(() => {
    loadNotificaciones()
  }, [loadNotificaciones])

  const marcarLeida = async (id: number) => {
    try {
      await fetch('/api/admin/notificaciones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, leida: true })
      })
      setNotificaciones(prev =>
        prev.map(n => n.id === id ? { ...n, leida: true, fechaLectura: new Date().toISOString() } : n)
      )
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const responderNotificacion = async (id: number) => {
    if (!respuesta.trim()) return

    try {
      await fetch('/api/admin/notificaciones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, respuesta: respuesta.trim(), leida: true })
      })
      setNotificaciones(prev =>
        prev.map(n => n.id === id ? { ...n, respuesta: respuesta.trim(), leida: true } : n)
      )
      setRespuesta('')
      setSelectedNotif(null)
    } catch (error) {
      console.error('Error responding:', error)
    }
  }

  const getRiesgoConfig = (riesgo: string) => {
    switch (riesgo) {
      case 'muy_alto':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
          bg: 'bg-red-50 border-red-200',
          badge: 'bg-red-100 text-red-700 border-red-200',
          label: 'CRÍTICO'
        }
      case 'alto':
        return {
          icon: <AlertCircle className="w-5 h-5 text-orange-600" />,
          bg: 'bg-orange-50 border-orange-200',
          badge: 'bg-orange-100 text-orange-700 border-orange-200',
          label: 'ALTO'
        }
      case 'moderado':
        return {
          icon: <Bell className="w-5 h-5 text-yellow-600" />,
          bg: 'bg-yellow-50 border-yellow-200',
          badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          label: 'MODERADO'
        }
      default:
        return {
          icon: <Info className="w-5 h-5 text-green-600" />,
          bg: 'bg-green-50 border-green-200',
          badge: 'bg-green-100 text-green-700 border-green-200',
          label: 'BAJO'
        }
    }
  }

  const notificacionesFiltradas = notificaciones.filter(n => {
    if (filtro === 'no_leidas') return !n.leida
    if (filtro === 'leidas') return n.leida
    return true
  })

  const totalPaginas = Math.ceil(notificacionesFiltradas.length / porPagina)
  const notificacionesPagina = notificacionesFiltradas.slice((pagina - 1) * porPagina, pagina * porPagina)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {notificaciones.filter(n => !n.leida).length} sin leer
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['todas', 'no_leidas', 'leidas'] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFiltro(f); setPagina(1) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === f
                ? 'bg-purple-100 text-purple-700'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {f === 'todas' ? 'Todas' : f === 'no_leidas' ? 'Sin leer' : 'Leídas'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de notificaciones */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : notificacionesFiltradas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <BellOff className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay notificaciones {filtro === 'no_leidas' ? 'pendientes' : ''}</p>
            </div>
          ) : (
            notificacionesPagina.map((notif) => {
              const config = getRiesgoConfig(notif.tipoRiesgo)
              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    setSelectedNotif(notif)
                    if (!notif.leida) marcarLeida(notif.id)
                  }}
                  className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow ${
                    !notif.leida ? config.bg : 'border-gray-100'
                  } ${selectedNotif?.id === notif.id ? 'ring-2 ring-purple-500' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {config.icon}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">{notif.titulo}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${config.badge}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{notif.descripcion}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{notif.encuesta.nombre || 'Anónimo'} {notif.encuesta.apellido || ''}</span>
                        <span>·</span>
                        <span>{notif.encuesta.edad} años</span>
                        <span>·</span>
                        <Clock className="w-3 h-3" />
                        <span>{new Date(notif.fechaCreacion).toLocaleString('es-CO')}</span>
                      </div>
                      {notif.respuesta && (
                        <div className="mt-2 p-2 bg-purple-50 rounded-lg text-sm text-purple-700">
                          <MessageSquare className="w-4 h-4 inline mr-1" />
                          {notif.respuesta}
                        </div>
                      )}
                    </div>
                    {!notif.leida && (
                      <div className="w-3 h-3 bg-purple-500 rounded-full shrink-0"></div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Pagination */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">
            <p className="text-sm text-gray-500">
              Pagina {pagina} de {totalPaginas} ({notificacionesFiltradas.length} notificaciones)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagina(p => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Panel de detalle */}
        <div className="lg:col-span-1">
          {selectedNotif ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">Detalle de Notificación</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Paciente</p>
                  <p className="font-medium">
                    {selectedNotif.encuesta.nombre || 'Anónimo'} {selectedNotif.encuesta.apellido || ''}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedNotif.encuesta.edad} años · {selectedNotif.encuesta.sexo}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase">Tipo de Riesgo</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getRiesgoConfig(selectedNotif.tipoRiesgo).badge}`}>
                    {getRiesgoConfig(selectedNotif.tipoRiesgo).label}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase">Descripción</p>
                  <p className="text-sm text-gray-700">{selectedNotif.descripcion}</p>
                </div>

                {selectedNotif.accionRequerida && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Acción Requerida</p>
                    <p className="text-sm text-gray-700">{selectedNotif.accionRequerida}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 uppercase">Ver encuesta completa</p>
                  <a
                    href={`/encuesta/${selectedNotif.encuesta.id}`}
                    target="_blank"
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Abrir encuesta →
                  </a>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 uppercase mb-2">Tu respuesta</p>
                  <textarea
                    value={respuesta}
                    onChange={(e) => setRespuesta(e.target.value)}
                    placeholder="Escribe una respuesta o acción tomada..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                  <button
                    onClick={() => responderNotificacion(selectedNotif.id)}
                    disabled={!respuesta.trim()}
                    className="mt-2 w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Enviar Respuesta
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Selecciona una notificación para ver detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
