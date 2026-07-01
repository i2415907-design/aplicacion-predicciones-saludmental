export interface EncuestaCompleta {
  id: number
  fechaCreacion: Date
  edad: number
  sexo: string
  estadoCivil?: string
  nivelEducativo?: string
  ocupacion?: string
  ingresoMensual?: string
  zonaResidencia?: string
  estadoUsuario: string
  causaFallecimiento?: string
  fallecimientoVoluntario?: boolean
  fechaFallecimiento?: Date
  phq9?: Phq9Data
  cssrs?: CssrsData
  bhs?: BhsData
  rosenberg?: RosenbergData
  dass21?: Dass21Data
  socioeconomicos?: SocioeconomicosData
  saludFisica?: SaludFisicaData
  psicologicos?: PsicologicosData
  historial?: HistorialData
  analisis?: AnalisisIa[]
}

export interface Phq9Data {
  id: number
  interesActividades: number
  estadoAnimo: number
  sueno: number
  energia: number
  apetito: number
  autoestima: number
  concentracion: number
  psicomotricidad: number
  ideacionSuicida: number
  dificultadFuncionamiento?: number
  puntajeTotal: number
  nivelGravedad: string
}

export interface CssrsData {
  id: number
  deseosMorir: boolean
  pensamientosSuicidas: boolean
  metodoSinPlan: boolean
  intencionSinPlan: boolean
  planEspecifico: boolean
  intencionEjecutar: boolean
  intentoPrevio: boolean
  fechaUltimoIntento?: Date
  metodoIntento?: string
  nivelSeveridad: string
}

export interface BhsData {
  id: number
  item1: boolean
  item2: boolean
  item3: boolean
  item4: boolean
  item5: boolean
  item6: boolean
  item7: boolean
  item8: boolean
  item9: boolean
  item10: boolean
  item11: boolean
  item12: boolean
  item13: boolean
  item14: boolean
  item15: boolean
  item16: boolean
  item17: boolean
  item18: boolean
  item19: boolean
  item20: boolean
  puntajeTotal: number
  nivelRiesgo: string
}

export interface RosenbergData {
  id: number
  item1: number
  item2: number
  item3: number
  item4: number
  item5: number
  item6: number
  item7: number
  item8: number
  item9: number
  item10: number
}

export interface Dass21Data {
  id: number
  item1: number
  item2: number
  item3: number
  item4: number
  item5: number
  item6: number
  item7: number
  item8: number
  item9: number
  item10: number
  item11: number
  item12: number
  item13: number
  item14: number
  item15: number
  item16: number
  item17: number
  item18: number
  item19: number
  item20: number
  item21: number
  puntajeEstres: number
  puntajeAnsiedad: number
  puntajeDepresion: number
}

export interface SocioeconomicosData {
  id: number
  estadoLaboral?: string
  satisfaccionLaboral?: number
  horasTrabajoSemanal?: number
  estresLaboral?: number
  nivelDeudas?: string
  dificultadEconomica?: boolean
  calidadRelacionesFamiliares?: number
  calidadRelacionesPareja?: number
  apoyoSocialPercibido?: number
  numPersonasConfianza?: number
  viveSolo?: boolean
  tipoVivienda?: string
  calidadVivienda?: number
  accesoSaludMental?: boolean
  tipoAfiliacionSalud?: string
  distanciaServicioSalud?: string
}

export interface SaludFisicaData {
  id: number
  enfermedadCronica: boolean
  tipoEnfermedadCronica?: string
  dolorCronico: boolean
  tratamientoMedicoActual: boolean
  medicamentosActuales?: string
  calidadSueno: number
  horasSuenoPromedio?: number
  insomnio: boolean
  consumeAlcohol: boolean
  frecuenciaAlcohol?: string
  consumeTabaco: boolean
  frecuenciaTabaco?: string
  consumeDrogas: boolean
  tipoDrogas?: string
  frecuenciaDrogas?: string
}

export interface PsicologicosData {
  id: number
  erqReevaluacionCognitiva?: number
  erqSupresionExpresiva?: number
  impulsividadMotora?: number
  impulsividadNoPlanificada?: number
  impulsividadAtencional?: number
  perdidaFamiliarReciente: boolean
  violenciaFisica: boolean
  violenciaPsicologica: boolean
  abusoSexual: boolean
  bullying: boolean
  desempleoReciente: boolean
  ruptureParejaReciente: boolean
  problemaLegalReciente: boolean
  tieneRedApoyo: boolean
  percibeVidaConSentido: boolean
  haBuscadoAyudaProfesional: boolean
  tipoAyudaProfesional?: string
}

export interface HistorialData {
  id: number
  numIntentosPrevios: number
  primerIntentoEdad?: number
  ultimoIntentoFecha?: Date
  metodoIntento?: string
  hospitalizacionPorIntento: boolean
  tratamientoPsiquiatricoPrevio: boolean
  antecedentesFamiliaresSuicidio: boolean
  antecedentesFamiliaresEnfermedadMental: boolean
}

export interface AnalisisIa {
  id: number
  tipoAnalisis: string
  resultadoAnalisis: Record<string, unknown>
  nivelRiesgoCalculado?: string
  recomendaciones?: Record<string, unknown>
  fechaAnalisis: Date
  modeloIa: string
}

export interface DashboardResumen {
  totalEncuestas: number
  promedioPHQ9: number
  distribucionRiesgo: Record<string, number>
  totalFallecidos: number
  fallecimientosVoluntarios: number
  encuestasUltimoMes: number
}

export interface ChatMensaje {
  id: number
  rol: 'usuario' | 'asistente' | 'sistema'
  contenido: string
  fechaMensaje: Date
}
