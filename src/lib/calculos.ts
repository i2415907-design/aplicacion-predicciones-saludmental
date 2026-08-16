// Cálculos de escalas clínicas y triaje para el Sistema de Salud Mental

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
    (respuestas.interesActividades || 0) +
    (respuestas.estadoAnimo || 0) +
    (respuestas.sueno || 0) +
    (respuestas.energia || 0) +
    (respuestas.apetito || 0) +
    (respuestas.autoestima || 0) +
    (respuestas.concentracion || 0) +
    (respuestas.psicomotricidad || 0) +
    (respuestas.ideacionSuicida || 0)

  let nivelGravedad: 'minimo' | 'leve' | 'moderado' | 'moderadamente_severo' | 'severo'
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
  // Estrés: ítems 1, 6, 8, 11, 12, 14, 18 (multiplicado x2 para escala 42)
  const puntajeEstres = ((respuestas.item1 || 0) + (respuestas.item6 || 0) + (respuestas.item8 || 0) +
    (respuestas.item11 || 0) + (respuestas.item12 || 0) + (respuestas.item14 || 0) + (respuestas.item18 || 0)) * 2

  // Ansiedad: ítems 2, 4, 7, 9, 15, 19, 20
  const puntajeAnsiedad = ((respuestas.item2 || 0) + (respuestas.item4 || 0) + (respuestas.item7 || 0) +
    (respuestas.item9 || 0) + (respuestas.item15 || 0) + (respuestas.item19 || 0) + (respuestas.item20 || 0)) * 2

  // Depresión: ítems 3, 5, 10, 13, 16, 17, 21
  const puntajeDepresion = ((respuestas.item3 || 0) + (respuestas.item5 || 0) + (respuestas.item10 || 0) +
    (respuestas.item13 || 0) + (respuestas.item16 || 0) + (respuestas.item17 || 0) + (respuestas.item21 || 0)) * 2

  return { puntajeEstres, puntajeAnsiedad, puntajeDepresion }
}

export function calcularBHS(items: boolean[]) {
  const safeItems = Array.isArray(items) ? items : []
  const puntajeTotal = safeItems.filter(Boolean).length

  let nivelRiesgo: 'bajo' | 'moderado' | 'alto'
  if (puntajeTotal <= 8) nivelRiesgo = 'bajo'
  else if (puntajeTotal <= 14) nivelRiesgo = 'moderado'
  else nivelRiesgo = 'alto'

  return { puntajeTotal, nivelRiesgo }
}

export function calcularRosenberg(respuestas: {
  item1: number; item2: number; item3: number; item4: number; item5: number
  item6: number; item7: number; item8: number; item9: number; item10: number
}) {
  // Ítems directos: 1, 3, 4, 7, 10
  // Ítems invertidos: 2, 5, 6, 8, 9 (en escala 1-4, invertido es 5 - valor)
  const puntajeTotal =
    (respuestas.item1 || 2) +
    (5 - (respuestas.item2 || 2)) +
    (respuestas.item3 || 2) +
    (respuestas.item4 || 2) +
    (5 - (respuestas.item5 || 2)) +
    (5 - (respuestas.item6 || 2)) +
    (respuestas.item7 || 2) +
    (5 - (respuestas.item8 || 2)) +
    (5 - (respuestas.item9 || 2)) +
    (respuestas.item10 || 2)

  let nivelAutoestima: 'baja' | 'media' | 'alta'
  if (puntajeTotal < 25) nivelAutoestima = 'baja'
  else if (puntajeTotal <= 35) nivelAutoestima = 'media'
  else nivelAutoestima = 'alta'

  return { puntajeTotal, nivelAutoestima }
}

export function calcularCSSRS(respuestas: {
  deseosMorir?: boolean
  pensamientosSuicidas?: boolean
  metodoSinPlan?: boolean
  intencionSinPlan?: boolean
  planEspecifico?: boolean
  intencionEjecutar?: boolean
  intentoPrevio?: boolean
}) {
  let nivelSeveridad: 'ninguna' | 'ideacion' | 'intento_no_letal' | 'planificacion' | 'intento_letal'
  if (respuestas.intencionEjecutar) nivelSeveridad = 'intento_letal'
  else if (respuestas.planEspecifico) nivelSeveridad = 'planificacion'
  else if (respuestas.intencionSinPlan || respuestas.metodoSinPlan) nivelSeveridad = 'intento_no_letal'
  else if (respuestas.pensamientosSuicidas || respuestas.deseosMorir) nivelSeveridad = 'ideacion'
  else nivelSeveridad = 'ninguna'

  return { nivelSeveridad }
}

export function calcularRiesgoGlobal(params: {
  phq9: number
  bhs: number
  cssrs: string
  ideacionSuicidaPhq9?: number
  intentoPrevio?: boolean
  consumoSustancias?: boolean
  aislamientoSocial?: boolean
  violenciaReciente?: boolean
  perdidaReciente?: boolean
}) {
  let puntajeRiesgo = 0
  const factoresAlarma: string[] = []
  const inconsistencias: string[] = []

  // Ponderación PHQ-9
  if (params.phq9 >= 20) {
    puntajeRiesgo += 5
    factoresAlarma.push('Depresión severa en PHQ-9 (≥ 20)')
  } else if (params.phq9 >= 15) {
    puntajeRiesgo += 3
    factoresAlarma.push('Depresión moderadamente severa en PHQ-9 (15-19)')
  } else if (params.phq9 >= 10) {
    puntajeRiesgo += 2
  } else if (params.phq9 >= 5) {
    puntajeRiesgo += 1
  }

  // Ponderación BHS (Desesperanza)
  if (params.bhs >= 15) {
    puntajeRiesgo += 4
    factoresAlarma.push('Nivel crítico de desesperanza en BHS (≥ 15)')
  } else if (params.bhs >= 9) {
    puntajeRiesgo += 2
    factoresAlarma.push('Desesperanza moderada en BHS')
  }

  // Ponderación C-SSRS (Ideación y Conducta Suicida)
  if (params.cssrs === 'intento_letal') {
    puntajeRiesgo += 7
    factoresAlarma.push('C-SSRS: Intención activa de ejecución / método definido')
  } else if (params.cssrs === 'planificacion') {
    puntajeRiesgo += 5
    factoresAlarma.push('C-SSRS: Plan específico de suicidio identificado')
  } else if (params.cssrs === 'intento_no_letal') {
    puntajeRiesgo += 4
    factoresAlarma.push('C-SSRS: Ideación con método o intención sin plan')
  } else if (params.cssrs === 'ideacion') {
    puntajeRiesgo += 2
    factoresAlarma.push('C-SSRS: Ideación suicida pasiva o pensamientos de muerte')
  }

  // Ideación suicida directa en PHQ-9 (ítem 9)
  if ((params.ideacionSuicidaPhq9 || 0) >= 2) {
    puntajeRiesgo += 3
    factoresAlarma.push('PHQ-9 ítem 9: Pensamientos frecuentes de autolesión o muerte')
  } else if ((params.ideacionSuicidaPhq9 || 0) === 1) {
    puntajeRiesgo += 1
  }

  // Factores de riesgo psicosociales y clínicos
  if (params.intentoPrevio) {
    puntajeRiesgo += 4
    factoresAlarma.push('Historial de intentos previos de suicidio')
  }
  if (params.consumoSustancias) {
    puntajeRiesgo += 2
    factoresAlarma.push('Consumo frecuente de alcohol o drogas')
  }
  if (params.aislamientoSocial) {
    puntajeRiesgo += 2
    factoresAlarma.push('Carencia de red de apoyo social / aislamiento')
  }
  if (params.violenciaReciente) {
    puntajeRiesgo += 2
    factoresAlarma.push('Exposición reciente a violencia o abuso')
  }
  if (params.perdidaReciente) {
    puntajeRiesgo += 1
    factoresAlarma.push('Pérdida familiar o duelo reciente')
  }

  // Detección de inconsistencias psicométricas
  if (params.phq9 <= 4 && (params.cssrs === 'planificacion' || params.cssrs === 'intento_letal')) {
    inconsistencias.push('Discrepancia: PHQ-9 mínimo reportado pero C-SSRS con planificación/intento.')
  }
  if (params.bhs >= 15 && params.phq9 <= 3) {
    inconsistencias.push('Discrepancia: Desesperanza extrema con baja sintomatología depresiva manifiesta.')
  }

  // Clasificación final de riesgo, prioridad y SLA clínico
  let nivelRiesgo: 'bajo' | 'moderado' | 'alto' | 'muy_alto'
  let prioridadAlerta: 'baja' | 'media' | 'alta' | 'critica'
  let slaHoras: number
  let accionRequerida: string

  if (puntajeRiesgo >= 12 || params.cssrs === 'intento_letal' || params.cssrs === 'planificacion') {
    nivelRiesgo = 'muy_alto'
    prioridadAlerta = 'critica'
    slaHoras = 2
    accionRequerida = 'Contacto de emergencia inmediato, contención clínica en crisis y activación de protocolo de seguridad.'
  } else if (puntajeRiesgo >= 7 || params.cssrs === 'intento_no_letal') {
    nivelRiesgo = 'alto'
    prioridadAlerta = 'alta'
    slaHoras = 12
    accionRequerida = 'Evaluación prioritaria por psicólogo/médico de turno dentro de las 12 horas.'
  } else if (puntajeRiesgo >= 4 || params.cssrs === 'ideacion') {
    nivelRiesgo = 'moderado'
    prioridadAlerta = 'media'
    slaHoras = 24
    accionRequerida = 'Seguimiento clínico programado y entrega de recursos psicoeducativos.'
  } else {
    nivelRiesgo = 'bajo'
    prioridadAlerta = 'baja'
    slaHoras = 72
    accionRequerida = 'Recomendaciones de bienestar preventivo y acceso libre a línea de ayuda.'
  }

  return {
    puntajeRiesgo,
    nivelRiesgo,
    prioridadAlerta,
    slaHoras,
    accionRequerida,
    factoresAlarma,
    inconsistencias,
  }
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
