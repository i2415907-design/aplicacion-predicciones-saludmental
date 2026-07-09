'use client'

import { useEffect, useState } from 'react'
import { X, Archive } from 'lucide-react'

interface Categoria {
  id: number
  nombre: string
  color: string | null
}

interface Props {
  encuestaId: number
  adminAlias: string
  categorias: Categoria[]
  casosExistentes: Array<{ id: number; categoriaId: number; categoria: { nombre: string; color: string | null } }>
  onSaved: () => void
  onClose: () => void
}

export function ArchivarModal({ encuestaId, adminAlias, categorias, casosExistentes, onSaved, onClose }: Props) {
  const [notas, setNotas] = useState('')
  const [saving, setSaving] = useState(false)

  const handleArchivar = async (categoriaId: number) => {
    setSaving(true)
    try {
      await fetch('/api/admin/archivado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encuestaId, categoriaId, notas: notas || null, archivadoPor: adminAlias }),
      })
      onSaved()
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const handleDesarchivar = async (casoId: number) => {
    await fetch(`/api/admin/archivado?id=${casoId}`, { method: 'DELETE' })
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Archivar Caso #{encuestaId}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {casosExistentes.length > 0 && (
          <div className="mb-4 space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Ya archivado en:</p>
            {casosExistentes.map(caso => (
              <div key={caso.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: caso.categoria.color || '#6B7280' }}></span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{caso.categoria.nombre}</span>
                </div>
                <button onClick={() => handleDesarchivar(caso.id)} className="text-xs text-red-500 hover:text-red-700">Quitar</button>
              </div>
            ))}
          </div>
        )}

        <textarea
          value={notas}
          onChange={e => setNotas(e.target.value)}
          placeholder="Notas (opcional)..."
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg mb-3 resize-none"
          rows={2}
        />

        <div className="grid grid-cols-2 gap-2">
          {categorias.map(cat => {
            const already = casosExistentes.some(c => c.categoriaId === cat.id)
            return (
              <button
                key={cat.id}
                onClick={() => !already && handleArchivar(cat.id)}
                disabled={already || saving}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
                  already
                    ? 'bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed border-gray-100 dark:border-gray-700'
                    : 'hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-200 dark:hover:border-purple-700 border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color || '#6B7280' }}></span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{cat.nombre}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
