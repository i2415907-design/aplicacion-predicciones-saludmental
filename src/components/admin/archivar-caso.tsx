'use client'

import { useEffect, useState } from 'react'
import { Archive, Plus, X, Tag } from 'lucide-react'

interface Categoria {
  id: number
  nombre: string
  descripcion: string | null
  color: string | null
  icono: string | null
}

interface CasoArchivado {
  id: number
  categoriaId: number
  notas: string | null
  archivadoPor: string | null
  fechaArchivo: string
  categoria: Categoria
}

interface Props {
  encuestaId: number
  adminAlias: string
}

export function ArchivarCaso({ encuestaId, adminAlias }: Props) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [casosExistentes, setCasosExistentes] = useState<CasoArchivado[]>([])
  const [loading, setLoading] = useState(true)
  const [notas, setNotas] = useState('')
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null)
  const [showNewCat, setShowNewCat] = useState(false)
  const [newCat, setNewCat] = useState({ nombre: '', descripcion: '', color: '#6B7280' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/categorias').then(r => r.json()),
      fetch(`/api/admin/archivado?encuestaId=${encuestaId}`).then(r => r.json()),
    ]).then(([catData, casoData]) => {
      setCategorias(catData.categorias || [])
      setCasosExistentes(casoData.casos || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [encuestaId])

  const handleArchivar = async (categoriaId: number) => {
    setSaving(true)
    try {
      await fetch('/api/admin/archivado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encuestaId,
          categoriaId,
          notas: notas || null,
          archivadoPor: adminAlias,
        }),
      })
      // Refresh
      const casoData = await fetch(`/api/admin/archivado?encuestaId=${encuestaId}`).then(r => r.json())
      setCasosExistentes(casoData.casos || [])
      setNotas('')
      setSelectedCatId(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDesarchivar = async (casoId: number) => {
    await fetch(`/api/admin/archivado?id=${casoId}`, { method: 'DELETE' })
    const casoData = await fetch(`/api/admin/archivado?encuestaId=${encuestaId}`).then(r => r.json())
    setCasosExistentes(casoData.casos || [])
  }

  const handleCrearCategoria = async () => {
    if (!newCat.nombre) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat),
      })
      if (res.ok) {
        const cat = await res.json()
        setCategorias(prev => [...prev, cat])
        setNewCat({ nombre: '', descripcion: '', color: '#6B7280' })
        setShowNewCat(false)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse h-24 bg-gray-100 rounded-lg"></div>
  }

  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex items-center gap-2 mb-3">
        <Archive className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Archivar Caso</h3>
      </div>

      {/* Existing archives */}
      {casosExistentes.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-xs text-gray-500 uppercase font-medium">Archivado en:</p>
          {casosExistentes.map((caso) => (
            <div key={caso.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: caso.categoria.color || '#6B7280' }}
                ></span>
                <span className="text-sm font-medium">{caso.categoria.nombre}</span>
                {caso.notas && (
                  <span className="text-xs text-gray-500 hidden sm:inline">— {caso.notas}</span>
                )}
              </div>
              <button
                onClick={() => handleDesarchivar(caso.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Notas */}
      <textarea
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        placeholder="Notas sobre el archivado (opcional)..."
        className="w-full px-3 py-2 text-sm border rounded-lg mb-3 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        rows={2}
      />

      {/* Categories */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 uppercase font-medium">Seleccionar categoria:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {categorias.map((cat) => {
            const alreadyArchived = casosExistentes.some(c => c.categoriaId === cat.id)
            return (
              <button
                key={cat.id}
                onClick={() => !alreadyArchived && handleArchivar(cat.id)}
                disabled={alreadyArchived || saving}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
                  alreadyArchived
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100'
                    : 'hover:bg-purple-50 hover:border-purple-200 border-gray-200'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color || '#6B7280' }}
                ></span>
                <span className="font-medium">{cat.nombre}</span>
                {alreadyArchived && <Tag className="w-3 h-3 ml-auto text-gray-400" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* New category */}
      <div className="mt-3">
        {!showNewCat ? (
          <button
            onClick={() => setShowNewCat(true)}
            className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700"
          >
            <Plus className="w-3 h-3" />
            Crear categoria personalizada
          </button>
        ) : (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCat.nombre}
                onChange={(e) => setNewCat(p => ({ ...p, nombre: e.target.value }))}
                placeholder="Nombre"
                className="flex-1 px-2 py-1 text-sm border rounded"
              />
              <input
                type="color"
                value={newCat.color}
                onChange={(e) => setNewCat(p => ({ ...p, color: e.target.value }))}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>
            <input
              type="text"
              value={newCat.descripcion}
              onChange={(e) => setNewCat(p => ({ ...p, descripcion: e.target.value }))}
              placeholder="Descripcion (opcional)"
              className="w-full px-2 py-1 text-sm border rounded"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCrearCategoria}
                disabled={!newCat.nombre || saving}
                className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:opacity-50"
              >
                Crear
              </button>
              <button
                onClick={() => { setShowNewCat(false); setNewCat({ nombre: '', descripcion: '', color: '#6B7280' }) }}
                className="px-3 py-1 text-gray-600 text-xs rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
