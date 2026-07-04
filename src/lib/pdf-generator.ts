import jsPDF from 'jspdf'

interface PdfData {
  id: number
  nombre?: string | null
  apellido?: string | null
  edad: number
  sexo: string
  estadoCivil?: string | null
  nivelEducativo?: string | null
  fechaCreacion: string
  phq9?: {
    puntajeTotal: number
    nivelGravedad: string
    ideacionSuicida: number
  } | null
  cssrs?: {
    nivelSeveridad: string
    deseosMorir: boolean
    pensamientosSuicidas: boolean
    intentoPrevio: boolean
  } | null
  bhs?: {
    puntajeTotal: number
    nivelRiesgo: string
  } | null
  rosenberg?: {
    item1: number; item2: number; item3: number; item4: number; item5: number
    item6: number; item7: number; item8: number; item9: number; item10: number
  } | null
  dass21?: {
    puntajeEstres: number
    puntajeAnsiedad: number
    puntajeDepresion: number
  } | null
}

function interpretarPHQ9(puntaje: number): string {
  if (puntaje <= 4) return 'Depresion minima'
  if (puntaje <= 9) return 'Depresion leve'
  if (puntaje <= 14) return 'Depresion moderada'
  if (puntaje <= 19) return 'Depresion moderadamente severa'
  return 'Depresion severa'
}

function interpretarDASS21(puntaje: number, tipo: 'depresion' | 'ansiedad' | 'estres'): string {
  const umbrales: Record<string, { max: number; label: string }[]> = {
    depresion: [
      { max: 9, label: 'Normal' }, { max: 13, label: 'Leve' },
      { max: 20, label: 'Moderada' }, { max: 27, label: 'Severa' }, { max: 42, label: 'Extremadamente severa' },
    ],
    ansiedad: [
      { max: 7, label: 'Normal' }, { max: 9, label: 'Leve' },
      { max: 14, label: 'Moderada' }, { max: 19, label: 'Severa' }, { max: 42, label: 'Extremadamente severa' },
    ],
    estres: [
      { max: 14, label: 'Normal' }, { max: 18, label: 'Leve' },
      { max: 25, label: 'Moderado' }, { max: 33, label: 'Severo' }, { max: 42, label: 'Extremadamente severo' },
    ],
  }
  for (const umbral of umbrales[tipo]) {
    if (puntaje <= umbral.max) return umbral.label
  }
  return 'Extremadamente severo'
}

function calcularRosenberg(r: { item1: number; item2: number; item3: number; item4: number; item5: number; item6: number; item7: number; item8: number; item9: number; item10: number }): number {
  const NEG = [2, 5, 6, 8, 9]
  let total = 0
  for (let i = 1; i <= 10; i++) {
    const val = r[`item${i}` as keyof typeof r]
    total += NEG.includes(i) ? (5 - val) : val
  }
  return total
}

function getNivelRiesgo(data: PdfData): string {
  let puntos = 0
  if ((data.phq9?.puntajeTotal || 0) >= 20) puntos += 4
  else if ((data.phq9?.puntajeTotal || 0) >= 15) puntos += 3
  else if ((data.phq9?.puntajeTotal || 0) >= 10) puntos += 2
  if ((data.bhs?.puntajeTotal || 0) >= 15) puntos += 4
  else if ((data.bhs?.puntajeTotal || 0) >= 10) puntos += 3
  if (data.cssrs?.nivelSeveridad === 'intento_letal') puntos += 5
  else if (data.cssrs?.nivelSeveridad === 'planificacion') puntos += 4
  else if (data.cssrs?.nivelSeveridad === 'intento_no_letal') puntos += 3
  if ((data.phq9?.ideacionSuicida || 0) >= 2) puntos += 3
  if (data.cssrs?.intentoPrevio) puntos += 3
  if (puntos >= 12) return 'MUY ALTO'
  if (puntos >= 8) return 'ALTO'
  if (puntos >= 4) return 'MODERADO'
  return 'BAJO'
}

function getRiesgoColor(nivel: string): [number, number, number] {
  switch (nivel) {
    case 'MUY ALTO': return [220, 38, 38]
    case 'ALTO': return [234, 88, 12]
    case 'MODERADO': return [202, 138, 4]
    default: return [22, 163, 74]
  }
}

export function generarPdf(data: PdfData) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginLeft = 20
  const marginRight = 20
  const contentWidth = pageWidth - marginLeft - marginRight
  let y = 20

  const addText = (text: string, fontSize: number, isBold = false, color: [number, number, number] = [0, 0, 0]) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, contentWidth)
    doc.text(lines, marginLeft, y)
    y += lines.length * (fontSize * 0.4)
  }

  const addLine = () => {
    doc.setDrawColor(200, 200, 200)
    doc.line(marginLeft, y, pageWidth - marginRight, y)
    y += 5
  }

  const addSpacing = (h = 5) => { y += h }

  // Header
  doc.setFillColor(59, 130, 246)
  doc.rect(0, 0, pageWidth, 35, 'F')
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('REPORTE DE EVALUACION - SALUD MENTAL', marginLeft, 15)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, marginLeft, 23)
  doc.text(`Sistema de Inteligencia Artificial - Salud Mental`, marginLeft, 29)
  y = 45

  // Patient info
  addText('DATOS DEL PACIENTE', 12, true)
  addSpacing(2)
  const nombre = `${data.nombre || 'Anonimo'} ${data.apellido || ''}`.trim()
  addText(`Nombre: ${nombre}`, 10)
  addText(`Edad: ${data.edad} anos | Sexo: ${data.sexo}`, 10)
  if (data.estadoCivil) addText(`Estado Civil: ${data.estadoCivil}`, 10)
  if (data.nivelEducativo) addText(`Nivel Educativo: ${data.nivelEducativo}`, 10)
  addText(`Fecha de Evaluacion: ${new Date(data.fechaCreacion).toLocaleDateString('es-ES')}`, 10)
  addSpacing(3)
  addLine()
  addSpacing(3)

  // Global risk
  const nivelRiesgo = getNivelRiesgo(data)
  const colorRiesgo = getRiesgoColor(nivelRiesgo)
  doc.setFillColor(...colorRiesgo)
  doc.roundedRect(marginLeft, y, contentWidth, 18, 3, 3, 'F')
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text(`NIVEL DE RIESGO GLOBAL: ${nivelRiesgo}`, pageWidth / 2, y + 11, { align: 'center' })
  y += 25
  addSpacing(3)
  addLine()
  addSpacing(3)

  // PHQ-9
  if (data.phq9) {
    addText('PHQ-9: Cuestionario de Depresion', 12, true)
    addSpacing(2)
    addText(`Puntaje: ${data.phq9.puntajeTotal} / 27`, 10)
    addText(`Interpretacion: ${interpretarPHQ9(data.phq9.puntajeTotal)}`, 10)
    addText(`Ideacion Suicida (item 9): ${data.phq9.ideacionSuicida}/3`, 10)
    addSpacing(3)
    addLine()
    addSpacing(3)
  }

  // C-SSRS
  if (data.cssrs) {
    addText('C-SSRS: Escala de Ideacion Suicida', 12, true)
    addSpacing(2)
    const severidadMap: Record<string, string> = {
      ideacion: 'Ideacion', planificacion: 'Planificacion',
      intento_no_letal: 'Intento previo no letal', intento_letal: 'Riesgo muy alto'
    }
    addText(`Severidad: ${severidadMap[data.cssrs.nivelSeveridad] || data.cssrs.nivelSeveridad}`, 10)
    addText(`Deseos de morir: ${data.cssrs.deseosMorir ? 'Si' : 'No'}`, 10)
    addText(`Pensamientos suicidas: ${data.cssrs.pensamientosSuicidas ? 'Si' : 'No'}`, 10)
    addText(`Intento previo: ${data.cssrs.intentoPrevio ? 'Si' : 'No'}`, 10)
    addSpacing(3)
    addLine()
    addSpacing(3)
  }

  // BHS
  if (data.bhs) {
    addText('BHS: Escala de Desesperanza', 12, true)
    addSpacing(2)
    addText(`Puntaje: ${data.bhs.puntajeTotal} / 20`, 10)
    addText(`Nivel: Desesperanza ${data.bhs.nivelRiesgo === 'bajo' ? 'Baja' : data.bhs.nivelRiesgo === 'moderado' ? 'Moderada' : 'Alta'}`, 10)
    addSpacing(3)
    addLine()
    addSpacing(3)
  }

  // Rosenberg
  if (data.rosenberg) {
    addText('ROSENBERG: Escala de Autoestima', 12, true)
    addSpacing(2)
    const rosenbergScore = calcularRosenberg(data.rosenberg)
    addText(`Puntaje: ${rosenbergScore} / 40`, 10)
    addText(`Autoestima: ${rosenbergScore <= 15 ? 'Baja' : rosenbergScore <= 25 ? 'Media' : 'Alta'}`, 10)
    addSpacing(3)
    addLine()
    addSpacing(3)
  }

  // DASS-21
  if (data.dass21) {
    addText('DASS-21: Depresion, Ansiedad y Estres', 12, true)
    addSpacing(2)
    addText(`Depresion: ${data.dass21.puntajeDepresion} (${interpretarDASS21(data.dass21.puntajeDepresion, 'depresion')})`, 10)
    addText(`Ansiedad: ${data.dass21.puntajeAnsiedad} (${interpretarDASS21(data.dass21.puntajeAnsiedad, 'ansiedad')})`, 10)
    addText(`Estres: ${data.dass21.puntajeEstres} (${interpretarDASS21(data.dass21.puntajeEstres, 'estres')})`, 10)
    addSpacing(3)
    addLine()
    addSpacing(3)
  }

  // Page break check
  if (y > 240) {
    doc.addPage()
    y = 20
  }

  // Disclaimer
  addText('NOTA IMPORTANTE', 11, true, [180, 50, 50])
  addSpacing(2)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(100, 100, 100)
  const disclaimer = doc.splitTextToSize(
    'Estos resultados son una evaluacion preliminar y no constituyen un diagnostico clinico. Si usted esta experimentando sintomas de depresion o pensamientos suicidas, por favor contacte a un profesional de salud mental. En caso de crisis, llame a la Linea de Prevencion del Suicidio: 988.',
    contentWidth
  )
  doc.text(disclaimer, marginLeft, y)
  y += disclaimer.length * 4 + 5

  // Footer
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 150, 150)
  doc.text(`ID Encuesta: #${data.id} | Sistema de Salud Mental IA`, marginLeft, 285)

  // Save
  doc.save(`encuesta_${data.id}_${nombre.replace(/\s+/g, '_')}.pdf`)
}
