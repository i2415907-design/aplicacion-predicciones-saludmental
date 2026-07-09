'use client'

import { useEffect, useState } from 'react'
import {
  Bell, BellOff, AlertTriangle, AlertCircle, Info, Clock,
  MessageSquare, ChevronLeft, ChevronRight, User, FileText, Eye
} from 'lucide-react'

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

const RIESGO_CONFIG = {
  muy_alto: {
    icon: AlertTriangle,
    dot: 'bg-red-500',
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    badge: 'bg-red-100 text-red-700',
    label: 'CRITICO',
  },
  alto: {
    icon: AlertCircle,
    dot: 'bg-orange-500',
    border: 'border-l-orange-500',
    bg: 'bg-orange-50',
    badge: 'bg-orange-100 text-orange-700',
    label: 'ALTO',
  },
  critico: {
    icon: AlertTriangle,
    dot: 'bg-red-500',
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    badge: 'bg-red-100 text-red-700',
    label: 'CRITICO',
  },
  moderado: {
    icon: Bell,
    dot: 'bg-yellow-500',
    border: 'border-l-yellow-500',
    bg: 'bg-yellow-50',
    badge: 'bg-yellow-100 text-yellow-700',
    label: 'MODERADO',
  },
  bajo: {
    icon: Info,
    dot: 'bg-green-500',
    border: 'border-l-green-500',
    bg: 'bg-green-50',
    badge: 'bg-green-100 text-green-700',
    label: 'BAJO',
  },
}

function getRiesgoConfig(riesgo: string) {
  return RIESGO_CONFIG[riesgo as keyof typeof RIESGO_CONFIG] || RIESGO_CONFIG.bajo
}

function timeAgo(fecha: string) {
  const now = new Date()
  const diff = now.getTime() - new Date(fecha).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return new Date(fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

export default function AdminNotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'todas' | 'no_leidas' | 'leidas'>('todas')
  const [selectedNotif, setSelectedNotif] = useState<Notificacion | null>(null)
  const [respuesta, setRespuesta] = useState('')
  const [pagina, setPagina] = useState(1)
  const porPagina = 8

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          limit: '200',
          ...(filtro === 'no_leidas' && { soloNoLeidas: 'true' }),
        })
        const res = await fetch(`/api/admin/notificaciones?${params}`)
        if (res.ok && !cancelled) {
          const data = await res.json()
          setNotificaciones(data.notificaciones || [])
        }
      } catch (error) {
        console.error('Error loading notificaciones:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [filtro])

  const marcarLeida = async (id: number) => {
    try {
      await fetch('/api/admin/notificaciones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, leida: true }),
      })
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true, fechaLectura: new Date().toISOString() } : n))
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
        body: JSON.stringify({ id, respuesta: respuesta.trim(), leida: true }),
      })
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, respuesta: respuesta.trim(), leida: true, fechaLectura: n.fechaLectura || new Date().toISOString() } : n))
      )
      setRespuesta('')
      if (selectedNotif?.id === id) {
        setSelectedNotif((prev) => (prev ? { ...prev, respuesta: respuesta.trim(), leida: true } : null))
      }
    } catch (error) {
      console.error('Error responding:', error)
    }
  }

  const notificacionesFiltradas = notificaciones.filter((n) => {
    if (filtro === 'no_leidas') return !n.leida
    if (filtro === 'leidas') return n.leida
    return true
  })

  const totalPaginas = Math.ceil(notificacionesFiltradas.length / porPagina)
  const notificacionesPagina = notificacionesFiltradas.slice((pagina - 1) * porPagina, pagina * porPagina)

  const countNoLeidas = notificaciones.filter((n) => !n.leida).length
  const countCritico = notificaciones.filter((n) => !n.leida && (n.tipoRiesgo === 'muy_alto' || n.tipoRiesgo === 'critico')).length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-sm text-gray-500 mt-0.5">Alertas de riesgo y seguimiento de pacientes</p>
        </div>
        <div className="flex items-center gap-3">
          {countCritico > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700">{countCritico} Critico{countCritico > 1 ? 's' : ''}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
            <Bell className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">{countNoLeidas} sin leer</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {([
          { key: 'todas' as const, label: 'Todas', count: notificaciones.length },
          { key: 'no_leidas' as const, label: 'Sin leer', count: countNoLeidas },
          { key: 'leidas' as const, label: 'Leidas', count: notificaciones.length - countNoLeidas },
        ]).map((f) => (
          <button
            key={f.key}
            onClick={() => { setFiltro(f.key); setPagina(1) }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filtro === f.key
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {f.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              filtro === f.key ? 'bg-purple-500 text-purple-100' : 'bg-gray-100 text-gray-500'
            }`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex gap-5 items-start">
        {/* Notification list */}
        <div className="flex-1 min-w-0 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-3" />
              <p className="text-sm text-gray-500">Cargando notificaciones...</p>
            </div>
          ) : notificacionesFiltradas.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BellOff className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-700 font-medium">Sin notificaciones</p>
              <p className="text-sm text-gray-500 mt-1">
                {filtro === 'no_leidas' ? 'Todas las notificaciones han sido leidas' : 'No hay notificaciones para mostrar'}
              </p>
            </div>
          ) : (
            <>
              {notificacionesPagina.map((notif) => {
                const config = getRiesgoConfig(notif.tipoRiesgo)
                const Icon = config.icon
                const isSelected = selectedNotif?.id === notif.id
                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setSelectedNotif(notif)
                      if (!notif.leida) marcarLeida(notif.id)
                    }}
                    className={`
                      bg-white rounded-xl border border-gray-100 cursor-pointer
                      transition-all duration-150 hover:shadow-md
                      border-l-4 ${config.border}
                      ${isSelected ? 'ring-2 ring-purple-400 shadow-md' : ''}
                      ${!notif.leida ? 'bg-gradient-to-r from-gray-50/50 to-white' : ''}
                    `}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                          <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className={`text-sm font-semibold truncate ${!notif.leida ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notif.titulo}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${config.badge}`}>
                              {config.label}
                            </span>
                          </div>

                          <p className="text-sm text-gray-500 line-clamp-1 mb-2">{notif.descripcion}</p>

                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {notif.encuesta.nombre || 'Anonimo'} {notif.encuesta.apellido || ''}
                            </span>
                            <span>{notif.encuesta.edad} años</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {timeAgo(notif.fechaCreacion)}
                            </span>
                            {notif.respuesta && (
                              <span className="flex items-center gap-1 text-purple-500">
                                <MessageSquare className="w-3 h-3" />
                                Respondida
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Unread indicator */}
                        {!notif.leida && (
                          <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Pagination */}
              {totalPaginas > 1 && (
                <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
                  <p className="text-xs text-gray-500">
                    Pagina {pagina} de {totalPaginas} · {notificacionesFiltradas.length} notificaciones
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPagina((p) => Math.max(1, p - 1))}
                      disabled={pagina === 1}
                      className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                      let pageNum: number
                      if (totalPaginas <= 5) {
                        pageNum = i + 1
                      } else if (pagina <= 3) {
                        pageNum = i + 1
                      } else if (pagina >= totalPaginas - 2) {
                        pageNum = totalPaginas - 4 + i
                      } else {
                        pageNum = pagina - 2 + i
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagina(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                            pagina === pageNum
                              ? 'bg-purple-600 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                      disabled={pagina === totalPaginas}
                      className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Detail panel */}
        <div className="w-80 shrink-0 hidden lg:block">
          {selectedNotif ? (
            <DetailPanel
              notif={selectedNotif}
              respuesta={respuesta}
              setRespuesta={setRespuesta}
              onSend={() => responderNotificacion(selectedNotif.id)}
            />
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center sticky top-20">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-700">Detalle de notificacion</p>
              <p className="text-xs text-gray-400 mt-1">Selecciona una notificacion de la lista</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailPanel({
  notif,
  respuesta,
  setRespuesta,
  onSend,
}: {
  notif: Notificacion
  respuesta: string
  setRespuesta: (v: string) => void
  onSend: () => void
}) {
  const config = getRiesgoConfig(notif.tipoRiesgo)
  const Icon = config.icon

  return (
    <div className="bg-white rounded-xl border border-gray-100 sticky top-20 overflow-hidden">
      {/* Header */}
      <div className={`px-5 py-4 border-b border-gray-100 ${config.bg}`}>
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4" />
          <span className={`text-xs font-bold uppercase tracking-wide ${config.badge.split(' ')[1]}`}>
            Riesgo {config.label}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug">{notif.titulo}</h3>
      </div>

      <div className="p-5 space-y-4">
        {/* Patient info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {notif.encuesta.nombre || 'Anonimo'} {notif.encuesta.apellido || ''}
            </p>
            <p className="text-xs text-gray-500">
              {notif.encuesta.edad} años · {notif.encuesta.sexo}
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Descripcion</p>
          <p className="text-sm text-gray-700 leading-relaxed">{notif.descripcion}</p>
        </div>

        {/* Required action */}
        {notif.accionRequerida && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-1">Accion requerida</p>
            <p className="text-sm text-amber-800">{notif.accionRequerida}</p>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-gray-400">
          {new Date(notif.fechaCreacion).toLocaleString('es-CO', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </div>

        {/* Link to survey */}
        <a
          href={`/encuesta/${notif.encuesta.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          <FileText className="w-4 h-4" />
          Ver encuesta completa
        </a>

        {/* Response */}
        <div className="border-t border-gray-100 pt-4">
          {notif.respuesta ? (
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
              <p className="text-[11px] font-semibold text-purple-500 uppercase tracking-wider mb-1">Tu respuesta</p>
              <p className="text-sm text-purple-800">{notif.respuesta}</p>
            </div>
          ) : (
            <>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Responder</p>
              <textarea
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder="Escribe una respuesta o accion tomada..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400"
                rows={3}
              />
              <button
                onClick={onSend}
                disabled={!respuesta.trim()}
                className="mt-2 w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Enviar Respuesta
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
