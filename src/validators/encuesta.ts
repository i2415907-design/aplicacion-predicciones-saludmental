import { z } from 'zod'

export const PHQ9Schema = z.object({
  interesActividades: z.number().min(0).max(3),
  estadoAnimo: z.number().min(0).max(3),
  sueno: z.number().min(0).max(3),
  energia: z.number().min(0).max(3),
  apetito: z.number().min(0).max(3),
  autoestima: z.number().min(0).max(3),
  concentracion: z.number().min(0).max(3),
  psicomotricidad: z.number().min(0).max(3),
  ideacionSuicida: z.number().min(0).max(3),
  dificultadFuncionamiento: z.number().min(0).max(3).optional(),
})

export const CSSRSSchema = z.object({
  deseosMorir: z.boolean(),
  pensamientosSuicidas: z.boolean(),
  metodoSinPlan: z.boolean(),
  intencionSinPlan: z.boolean(),
  planEspecifico: z.boolean(),
  intencionEjecutar: z.boolean(),
  intentoPrevio: z.boolean(),
  fechaUltimoIntento: z.string().optional(),
  metodoIntento: z.string().optional(),
})

export const BHSSchema = z.object({
  item1: z.boolean(),
  item2: z.boolean(),
  item3: z.boolean(),
  item4: z.boolean(),
  item5: z.boolean(),
  item6: z.boolean(),
  item7: z.boolean(),
  item8: z.boolean(),
  item9: z.boolean(),
  item10: z.boolean(),
  item11: z.boolean(),
  item12: z.boolean(),
  item13: z.boolean(),
  item14: z.boolean(),
  item15: z.boolean(),
  item16: z.boolean(),
  item17: z.boolean(),
  item18: z.boolean(),
  item19: z.boolean(),
  item20: z.boolean(),
})

export const RosenbergSchema = z.object({
  item1: z.number().min(1).max(4),
  item2: z.number().min(1).max(4),
  item3: z.number().min(1).max(4),
  item4: z.number().min(1).max(4),
  item5: z.number().min(1).max(4),
  item6: z.number().min(1).max(4),
  item7: z.number().min(1).max(4),
  item8: z.number().min(1).max(4),
  item9: z.number().min(1).max(4),
  item10: z.number().min(1).max(4),
})

export const DASS21Schema = z.object({
  item1: z.number().min(0).max(3),
  item2: z.number().min(0).max(3),
  item3: z.number().min(0).max(3),
  item4: z.number().min(0).max(3),
  item5: z.number().min(0).max(3),
  item6: z.number().min(0).max(3),
  item7: z.number().min(0).max(3),
  item8: z.number().min(0).max(3),
  item9: z.number().min(0).max(3),
  item10: z.number().min(0).max(3),
  item11: z.number().min(0).max(3),
  item12: z.number().min(0).max(3),
  item13: z.number().min(0).max(3),
  item14: z.number().min(0).max(3),
  item15: z.number().min(0).max(3),
  item16: z.number().min(0).max(3),
  item17: z.number().min(0).max(3),
  item18: z.number().min(0).max(3),
  item19: z.number().min(0).max(3),
  item20: z.number().min(0).max(3),
  item21: z.number().min(0).max(3),
})

export const SocioeconomicosSchema = z.object({
  estadoLaboral: z.string().optional(),
  satisfaccionLaboral: z.number().min(1).max(5).optional(),
  horasTrabajoSemanal: z.number().optional(),
  estresLaboral: z.number().min(1).max(5).optional(),
  nivelDeudas: z.string().optional(),
  dificultadEconomica: z.boolean().optional(),
  calidadRelacionesFamiliares: z.number().min(1).max(5).optional(),
  calidadRelacionesPareja: z.number().min(1).max(5).optional(),
  apoyoSocialPercibido: z.number().min(1).max(5).optional(),
  numPersonasConfianza: z.number().optional(),
  viveSolo: z.boolean().optional(),
  tipoVivienda: z.string().optional(),
  calidadVivienda: z.number().min(1).max(5).optional(),
  accesoSaludMental: z.boolean().optional(),
  tipoAfiliacionSalud: z.string().optional(),
  distanciaServicioSalud: z.string().optional(),
})

export const SaludFisicaSchema = z.object({
  enfermedadCronica: z.boolean(),
  tipoEnfermedadCronica: z.string().optional(),
  dolorCronico: z.boolean(),
  tratamientoMedicoActual: z.boolean(),
  medicamentosActuales: z.string().optional(),
  calidadSueno: z.number().min(1).max(5),
  horasSuenoPromedio: z.number().optional(),
  insomnio: z.boolean(),
  consumeAlcohol: z.boolean(),
  frecuenciaAlcohol: z.string().optional(),
  consumeTabaco: z.boolean(),
  frecuenciaTabaco: z.string().optional(),
  consumeDrogas: z.boolean(),
  tipoDrogas: z.string().optional(),
  frecuenciaDrogas: z.string().optional(),
})

export const PsicologicosSchema = z.object({
  erqReevaluacionCognitiva: z.number().min(1).max(7).optional(),
  erqSupresionExpresiva: z.number().min(1).max(7).optional(),
  impulsividadMotora: z.number().min(1).max(5).optional(),
  impulsividadNoPlanificada: z.number().min(1).max(5).optional(),
  impulsividadAtencional: z.number().min(1).max(5).optional(),
  perdidaFamiliarReciente: z.boolean(),
  violenciaFisica: z.boolean(),
  violenciaPsicologica: z.boolean(),
  abusoSexual: z.boolean(),
  bullying: z.boolean(),
  desempleoReciente: z.boolean(),
  ruptureParejaReciente: z.boolean(),
  problemaLegalReciente: z.boolean(),
  tieneRedApoyo: z.boolean(),
  percibeVidaConSentido: z.boolean(),
  haBuscadoAyudaProfesional: z.boolean(),
  tipoAyudaProfesional: z.string().optional(),
})

export const HistorialSchema = z.object({
  numIntentosPrevios: z.number().min(0),
  primerIntentoEdad: z.number().optional(),
  ultimoIntentoFecha: z.string().optional(),
  metodoIntento: z.string().optional(),
  hospitalizacionPorIntento: z.boolean(),
  tratamientoPsiquiatricoPrevio: z.boolean(),
  antecedentesFamiliaresSuicidio: z.boolean(),
  antecedentesFamiliaresEnfermedadMental: z.boolean(),
})

export const EncuestaSchema = z.object({
  edad: z.number().min(10).max(100),
  sexo: z.string(),
  estadoCivil: z.string().optional(),
  nivelEducativo: z.string().optional(),
  ocupacion: z.string().optional(),
  ingresoMensual: z.string().optional(),
  zonaResidencia: z.string().optional(),
  estadoUsuario: z.string().default('vivo'),
  causaFallecimiento: z.string().optional(),
  fallecimientoVoluntario: z.boolean().optional(),
  fechaFallecimiento: z.string().optional(),
  phq9: PHQ9Schema.optional(),
  cssrs: CSSRSSchema.optional(),
  bhs: BHSSchema.optional(),
  rosenberg: RosenbergSchema.optional(),
  dass21: DASS21Schema.optional(),
  socioeconomicos: SocioeconomicosSchema.optional(),
  saludFisica: SaludFisicaSchema.optional(),
  psicologicos: PsicologicosSchema.optional(),
  historial: HistorialSchema.optional(),
})

export type EncuestaInput = z.infer<typeof EncuestaSchema>
export type PHQ9Input = z.infer<typeof PHQ9Schema>
export type CSSRSInput = z.infer<typeof CSSRSSchema>
export type BHSInput = z.infer<typeof BHSSchema>
