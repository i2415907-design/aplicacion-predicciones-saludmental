'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, Filter, ChevronLeft, ChevronRight, Eye, AlertTriangle, Download, Archive, Tag } from 'lucide-react'
import Link from 'next/link'
import { generarPdf } from '@/lib/pdf-generator'
import { ArchivarModal } from '@/components/admin/archivar-modal'

interface Categoria {
  id: number
  nombre: string
  color: string | null
}

interface Encuesta {
  id: number
  nombre: string | null
  apellido: string | null
  edad: number
  sexo: string
  fechaCreacion: string
  usuario: string
  phq9: number
  nivelDepresion: string
  nivelIdeacion: string
  nivelDesesperanza: string
  nivelRiesgo: string
  categorias: Array<{ id: number; nombre: string; color: string | null; casoId: number }>
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function AdminEncuestasPage() {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [riesgoFilter, setRiesgoFilter] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState('')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [archiveModal, setArchiveModal] = useState<{ encuestaId: number; casos: Encuesta['categorias'] } | null>(null)

  useEffect(() => {
    fetch('/api/admin/categorias')
      .then(r => r.json())
      .then(data => setCategorias(data.categorias || []))
  }, [])

  const loadEncuestas = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(riesgoFilter && { riesgo: riesgoFilter }),
        ...(categoriaFilter && { categoriaId: categoriaFilter }),
      })

      const res = await fetch(`/api/admin/encuestas?${params}`)
      if (res.ok) {
        const data = await res.json()
        setEncuestas(data.encuestas)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error loading encuestas:', error)
    } finally {
      setLoading(false)
    }
  }, [search, riesgoFilter, categoriaFilter])

  useEffect(() => {
    loadEncuestas()
  }, [loadEncuestas])

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo) {
      case 'muy_alto': return 'bg-red-100 text-red-700 border-red-200'
      case 'alto': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'moderado': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  const getDepresionColor = (nivel: string) => {
    switch (nivel) {
      case 'severo': return 'text-red-600'
      case 'moderadamente_severo': return 'text-orange-600'
      case 'moderado': return 'text-yellow-600'
      case 'leve': return 'text-blue-600'
      default: return 'text-green-600'
    }
  }

  const handleDownloadPdf = async (encuesta: Encuesta) => {
    try {
      const res = await fetch(`/api/encuesta/${encuesta.id}`)
      if (res.ok) {
        const data = await res.json()
        generarPdf({
          id: data.id,
          nombre: data.nombre,
          apellido: data.apellido,
          edad: data.edad,
          sexo: data.sexo,
          estadoCivil: data.estadoCivil,
          nivelEducativo: data.nivelEducativo,
          fechaCreacion: data.createdAt,
          phq9: data.phq9?.[0] || data.phq9,
          cssrs: data.cssrs?.[0] || data.cssrs,
          bhs: data.bhs?.[0] || data.bhs,
          rosenberg: data.rosenberg?.[0] || data.rosenberg,
          dass21: data.dass21?.[0] || data.dass21,
        })
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Historial de Encuestas</h1>
        <p className="text-sm text-gray-500">
          {pagination?.total || 0} encuestas en total
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={riesgoFilter}
              onChange={(e) => setRiesgoFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todos los niveles</option>
              <option value="bajo">Bajo riesgo</option>
              <option value="moderado">Riesgo moderado</option>
              <option value="alto">Alto riesgo</option>
              <option value="muy_alto">Muy alto riesgo</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-gray-400" />
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todas las categorias</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : encuestas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No se encontraron encuestas
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sexo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PHQ-9</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Depresion</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Riesgo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {encuestas.map((encuesta) => (
                  <tr key={encuesta.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">#{encuesta.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {encuesta.nombre || 'Anonimo'} {encuesta.apellido || ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{encuesta.edad}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{encuesta.sexo}</td>
                    <td className="px-4 py-3 text-sm text-purple-600">{encuesta.usuario}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{encuesta.phq9}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${getDepresionColor(encuesta.nivelDepresion)}`}>
                      {encuesta.nivelDepresion.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiesgoColor(encuesta.nivelRiesgo)}`}>
                        {encuesta.nivelRiesgo === 'muy_alto' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                        {encuesta.nivelRiesgo.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {encuesta.categorias.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {encuesta.categorias.map(cat => (
                            <span
                              key={cat.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: cat.color || '#6B7280' }}
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {cat.nombre}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Sin archivar</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(encuesta.fechaCreacion).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/encuesta/${encuesta.id}`}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDownloadPdf(encuesta)}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          title="Descargar PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setArchiveModal({ encuestaId: encuesta.id, casos: encuesta.categorias })}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Archivar caso"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Pagina {pagination.page} de {pagination.pages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadEncuestas(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => loadEncuestas(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Archive Modal */}
      {archiveModal && (
        <ArchivarModal
          encuestaId={archiveModal.encuestaId}
          adminAlias="admin"
          categorias={categorias}
          casosExistentes={archiveModal.casos.map(c => ({
            id: c.casoId,
            categoriaId: c.id,
            categoria: { nombre: c.nombre, color: c.color },
          }))}
          onSaved={() => loadEncuestas(pagination?.page || 1)}
          onClose={() => setArchiveModal(null)}
        />
      )}
    </div>
  )
}
