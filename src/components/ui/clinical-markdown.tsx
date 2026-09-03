'use client'

import React from 'react'

interface ClinicalMarkdownProps {
  content: string
  className?: string
}

export function ClinicalMarkdown({ content, className = '' }: ClinicalMarkdownProps) {
  if (!content) return null

  // Sanitizar cualquier intento de fuga técnica antes de renderizar
  const sanitized = content
    .replace(/sistema_ia_depresion/gi, 'Censo de Salud Mental')
    .replace(/fuente de datos:\s*`?[^`\n]+`?/gi, 'Fuente: Registro Oficial del Censo de Salud Mental')
    .replace(/herramienta\s+obtenerProtocoloClinico/gi, 'guía de intervención clínica')
    .replace(/la herramienta\s+[a-zA-Z_]+/gi, 'el módulo clínico')
    .replace(/obtenerProtocoloClinico/g, 'protocolo clínico de intervención')
    .replace(/obtenerDetalleCasoPaciente/g, 'expediente clínico del paciente')
    .replace(/consultarMetricasGeneralesBI/g, 'estadísticas del sistema de salud')
    .replace(/consultarAlertasCriticas/g, 'sistema de alertas clínicas')
    .replace(/analizarCrucesFactoresRiesgo/g, 'análisis de cruces de riesgo')
    .replace(/en la base de datos/gi, 'en el censo poblacional')
    .replace(/de la base de datos/gi, 'del censo poblacional')
    .replace(/a la base de datos/gi, 'al censo poblacional')
    .replace(/base de datos/gi, 'censo epidemiológico')
    .replace(/bases de datos/gi, 'censos epidemiológicos')
    .replace(/tabla\s+[a-z_]+/gi, 'registro clínico')
    .replace(/query\s+sql/gi, 'evaluación epidemiológica')
    .replace(/function call/gi, 'procedimiento clínico')
    .replace(/tool\s+[a-zA-Z_]+/gi, 'protocolo de triage')

  const lines = sanitized.split('\n')
  const elements: React.ReactNode[] = []
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null
  let currentTable: { headers: string[]; rows: string[][] } | null = null

  const flushList = (keyPrefix: string) => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`${keyPrefix}-ul`} className="my-2 space-y-1.5 pl-1">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                <div>{formatInline(item)}</div>
              </li>
            ))}
          </ul>
        )
      } else {
        elements.push(
          <ol key={`${keyPrefix}-ol`} className="my-2 space-y-1.5 pl-1 list-decimal list-inside text-xs sm:text-sm leading-relaxed">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="pl-1">
                <span>{formatInline(item)}</span>
              </li>
            ))}
          </ol>
        )
      }
      currentList = null
    }
  }

  const flushTable = (keyPrefix: string) => {
    if (currentTable) {
      elements.push(
        <div key={`${keyPrefix}-tbl`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold">
              <tr>
                {currentTable.headers.map((h, i) => (
                  <th key={i} className="px-3 py-2">{formatInline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/50">
              {currentTable.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 text-slate-700 dark:text-slate-300">
                      {formatInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      currentTable = null
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const trimmed = rawLine.trim()

    // 1. Detección de Tablas Markdown (| col1 | col2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList(`pre-tbl-${i}`)
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim())

      // Separador (|---|---|)
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        continue
      }

      if (!currentTable) {
        currentTable = { headers: cells, rows: [] }
      } else {
        currentTable.rows.push(cells)
      }
      continue
    } else {
      flushTable(`post-tbl-${i}`)
    }

    // 2. Línea vacía
    if (!trimmed) {
      flushList(`empty-${i}`)
      elements.push(<div key={`gap-${i}`} className="h-1.5" />)
      continue
    }

    // 3. Separador horizontal (---)
    if (/^---+$/.test(trimmed)) {
      flushList(`hr-${i}`)
      elements.push(<hr key={`hr-${i}`} className="my-3 border-slate-200 dark:border-slate-800" />)
      continue
    }

    // 4. Encabezados (###, ##, #)
    if (trimmed.startsWith('### ')) {
      flushList(`h3-${i}`)
      elements.push(
        <h4 key={`h3-${i}`} className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 mt-3 mb-1.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-xs bg-indigo-500" />
          {formatInline(trimmed.substring(4))}
        </h4>
      )
      continue
    }
    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      flushList(`h2-${i}`)
      const text = trimmed.replace(/^#+\s*/, '')
      elements.push(
        <h3 key={`h2-${i}`} className="font-bold text-base sm:text-lg text-indigo-900 dark:text-indigo-200 mt-4 mb-2 pb-1 border-b border-indigo-100 dark:border-indigo-950/60">
          {formatInline(text)}
        </h3>
      )
      continue
    }

    // 5. Citas o Bloques de Alerta (> ...)
    if (trimmed.startsWith('> ')) {
      flushList(`quote-${i}`)
      elements.push(
        <div key={`quote-${i}`} className="my-2 p-2.5 bg-amber-50 dark:bg-amber-950/30 border-l-3 border-amber-500 rounded-r-lg text-xs sm:text-sm text-amber-900 dark:text-amber-200">
          {formatInline(trimmed.substring(2))}
        </div>
      )
      continue
    }

    // 6. Listas no ordenadas (- , * , • )
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)/)
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList(`switch-ul-${i}`)
        currentList = { type: 'ul', items: [] }
      }
      currentList.items.push(bulletMatch[1])
      continue
    }

    // 7. Listas numeradas (1. , 2. )
    const numMatch = trimmed.match(/^\d+\.\s+(.+)/)
    if (numMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList(`switch-ol-${i}`)
        currentList = { type: 'ol', items: [] }
      }
      currentList.items.push(numMatch[1])
      continue
    }

    // 8. Párrafo estándar
    flushList(`p-${i}`)
    elements.push(
      <p key={`p-${i}`} className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 mb-1.5 last:mb-0">
        {formatInline(trimmed)}
      </p>
    )
  }

  flushList('final-list')
  flushTable('final-tbl')

  return <div className={`clinical-markdown space-y-1 ${className}`}>{elements}</div>
}

/**
 * Parsea formato inline: **negrita**, *cursiva*, `código`
 */
function formatInline(text: string): React.ReactNode {
  if (!text) return null

  // Dividir por tokens: **bold**, *italic*, `code`
  const parts: React.ReactNode[] = []
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    const token = match[0]
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold text-slate-950 dark:text-slate-50">
          {token.slice(2, -2)}
        </strong>
      )
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-slate-700 dark:text-slate-300">
          {token.slice(1, -1)}
        </em>
      )
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-[11px] font-mono text-indigo-700 dark:text-indigo-300">
          {token.slice(1, -1)}
        </code>
      )
    }

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? parts : text
}
