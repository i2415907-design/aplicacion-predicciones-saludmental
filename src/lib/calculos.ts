// Cálculos de escalas clínicas

export function calcularPHQ9(respuestas: {
  interesActividades: number
  estadoAnimo: number
  sueno: number
  energia: number
  apetito: number
  autoestima: number
  concentracion: number
  psicomotricidad: number
  ideacionSuicida: number
}) {
  const puntajeTotal =
    respuestas.interesActividades +
    respuestas.estadoAnimo +
    respuestas.sueno +
    respuestas.energia +
    respuestas.apetito +
    respuestas.autoestima +
    respuestas.concentracion +
    respuestas.psicomotricidad +
    respuestas.ideacionSuicida

  let nivelGravedad: string
  if (puntajeTotal <= 4) nivelGravedad = 'minimo'
  else if (puntajeTotal <= 9) nivelGravedad = 'leve'
  else if (puntajeTotal <= 14) nivelGravedad = 'moderado'
  else if (puntajeTotal <= 19) nivelGravedad = 'moderadamente_severo'
  else nivelGravedad = 'severo'

  return { puntajeTotal, nivelGravedad }
}

export function calcularDASS21(respuestas: {
  item1: number; item2: number; item3: number; item4: number; item5: number
  item6: number; item7: number; item8: number; item9: number; item10: number
  item11: number; item12: number; item13: number; item14: number; item15: number
  item16: number; item17: number; item18: number; item19: number; item20: number
  item21: number
}) {
  // Estrés: ítems 1, 6, 8, 11, 12, 14, 18
  const puntajeEstres = (respuestas.item1 + respuestas.item6 + respuestas.item8 +
    respuestas.item11 + respuestas.item12 + respuestas.item14 + respuestas.item18) * 2

  // Ansiedad: ítems 2, 4, 7, 9, 15, 19, 20
  const puntajeAnsiedad = (respuestas.item2 + respuestas.item4 + respuestas.item7 +
    respuestas.item9 + respuestas.item15 + respuestas.item19 + respuestas.item20) * 2

  // Depresión: ítems 3, 5, 10, 13, 16, 17, 21
  const puntajeDepresion = (respuestas.item3 + respuestas.item5 + respuestas.item10 +
    respuestas.item13 + respuestas.item16 + respuestas.item17 + respuestas.item21) * 2

  return { puntajeEstres, puntajeAnsiedad, puntajeDepresion }
}

export function calcularBHS(items: boolean[]) {
  if (items.length !== 20) throw new Error('BHS requiere exactamente 20 ítems')

  const puntajeTotal = items.filter(Boolean).length

  let nivelRiesgo: string
  if (puntajeTotal <= 9) nivelRiesgo = 'bajo'
  else if (puntajeTotal <= 14) nivelRiesgo = 'moderado'
  else nivelRiesgo = 'alto'

  return { puntajeTotal, nivelRiesgo }
}

export function calcularCSSRS(respuestas: {
  deseosMorir: boolean
  pensamientosSuicidas: boolean
  metodoSinPlan: boolean
  intencionSinPlan: boolean
  planEspecifico: boolean
  intencionEjecutar: boolean
}) {
  let nivelSeveridad: string
  if (respuestas.intencionEjecutar) nivelSeveridad = 'intento_letal'
  else if (respuestas.planEspecifico) nivelSeveridad = 'planificacion'
  else if (respuestas.intencionSinPlan || respuestas.metodoSinPlan) nivelSeveridad = 'intento_no_letal'
  else if (respuestas.pensamientosSuicidas) nivelSeveridad = 'ideacion'
  else nivelSeveridad = 'ideacion'

  return { nivelSeveridad }
}

export function calcularRiesgoGlobal(params: {
  phq9: number
  bhs: number
  cssrs: string
  desesperanza: boolean
  ideacionSuicida: number
  intentoPrevio: boolean
  consumoSustancias: boolean
  aislamientoSocial: boolean
}) {
  let puntajeRiesgo = 0

  // PHQ-9
  if (params.phq9 >= 20) puntajeRiesgo += 4
  else if (params.phq9 >= 15) puntajeRiesgo += 3
  else if (params.phq9 >= 10) puntajeRiesgo += 2
  else if (params.phq9 >= 5) puntajeRiesgo += 1

  // BHS (desesperanza)
  if (params.bhs >= 15) puntajeRiesgo += 4
  else if (params.bhs >= 10) puntajeRiesgo += 3
  else if (params.bhs >= 5) puntajeRiesgo += 1

  // C-SSRS
  if (params.cssrs === 'intento_letal') puntajeRiesgo += 5
  else if (params.cssrs === 'planificacion') puntajeRiesgo += 4
  else if (params.cssrs === 'intento_no_letal') puntajeRiesgo += 3

  // Ideación suicida PHQ-9
  if (params.ideacionSuicida >= 2) puntajeRiesgo += 3
  else if (params.ideacionSuicida >= 1) puntajeRiesgo += 1

  // Intento previo
  if (params.intentoPrevio) puntajeRiesgo += 3

  // Consumo de sustancias
  if (params.consumoSustancias) puntajeRiesgo += 2

  // Aislamiento
  if (params.aislamientoSocial) puntajeRiesgo += 2

  // Determinar nivel
  let nivelRiesgo: string
  if (puntajeRiesgo >= 12) nivelRiesgo = 'muy_alto'
  else if (puntajeRiesgo >= 8) nivelRiesgo = 'alto'
  else if (puntajeRiesgo >= 4) nivelRiesgo = 'moderado'
  else nivelRiesgo = 'bajo'

  return { puntajeRiesgo, nivelRiesgo }
}

export function interpretarPHQ9(puntaje: number): string {
  if (puntaje <= 4) return 'Depresión mínima'
  if (puntaje <= 9) return 'Depresión leve'
  if (puntaje <= 14) return 'Depresión moderada'
  if (puntaje <= 19) return 'Depresión moderadamente severa'
  return 'Depresión severa'
}

export function interpretarDASS21(puntaje: number, tipo: 'depresion' | 'ansiedad' | 'estres'): string {
  const umbrales = {
    depresion: [
      { max: 9, label: 'Normal' },
      { max: 13, label: 'Leve' },
      { max: 20, label: 'Moderada' },
      { max: 27, label: 'Severa' },
      { max: 42, label: 'Extremadamente severa' },
    ],
    ansiedad: [
      { max: 7, label: 'Normal' },
      { max: 9, label: 'Leve' },
      { max: 14, label: 'Moderada' },
      { max: 19, label: 'Severa' },
      { max: 42, label: 'Extremadamente severa' },
    ],
    estres: [
      { max: 14, label: 'Normal' },
      { max: 18, label: 'Leve' },
      { max: 25, label: 'Moderado' },
      { max: 33, label: 'Severo' },
      { max: 42, label: 'Extremadamente severo' },
    ],
  }

  const escala = umbrales[tipo]
  for (const umbral of escala) {
    if (puntaje <= umbral.max) return umbral.label
  }
  return 'Extremadamente severo'
}
