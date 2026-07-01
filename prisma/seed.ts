import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper: random int between min and max inclusive
function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Helper: pick random from array
function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)]
}

// Helper: random date between two dates
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function calcularPHQ9(items: number[]): { total: number; nivel: string } {
  const total = items.reduce((a, b) => a + b, 0)
  let nivel = 'minimo'
  if (total <= 4) nivel = 'minimo'
  else if (total <= 9) nivel = 'leve'
  else if (total <= 14) nivel = 'moderado'
  else if (total <= 19) nivel = 'moderadamente_severo'
  else nivel = 'severo'
  return { total, nivel }
}

function calcularCSSRS(d: {
  deseosMorir: boolean
  pensamientosSuicidas: boolean
  metodoSinPlan: boolean
  intencionSinPlan: boolean
  planEspecifico: boolean
  intencionEjecutar: boolean
}): string {
  if (d.intencionEjecutar) return 'intento_letal'
  if (d.planEspecifico) return 'planificacion'
  if (d.intencionSinPlan || d.metodoSinPlan) return 'intento_no_letal'
  return 'ideacion'
}

function calcularBHS(items: boolean[]): { total: number; nivel: string } {
  const total = items.filter(Boolean).length
  let nivel = 'bajo'
  if (total >= 15) nivel = 'alto'
  else if (total >= 10) nivel = 'moderado'
  return { total, nivel }
}

function calcularDASS21(items: number[]): { estres: number; ansiedad: number; depresion: number } {
  const estres = (items[0] + items[5] + items[7] + items[10] + items[11] + items[13] + items[17]) * 2
  const ansiedad = (items[1] + items[3] + items[6] + items[8] + items[14] + items[18] + items[19]) * 2
  const depresion = (items[2] + items[4] + items[9] + items[12] + items[15] + items[16] + items[20]) * 2
  return { estres, ansiedad, depresion }
}

// Profile definitions for realistic variation
interface Profile {
  edad: number
  sexo: string
  estadoCivil: string
  nivelEducativo: string
  ocupacion: string
  ingresoMensual: string
  zonaResidencia: string
  estadoUsuario: string
  causaFallecimiento?: string | null
  fallecimientoVoluntario?: boolean | null
  fechaFallecimiento?: Date | null
  phq9Level: 'minimo' | 'leve' | 'moderado' | 'moderadamente_severo' | 'severo'
  cssrsLevel: 'sin_ideacion' | 'ideacion' | 'planificacion' | 'intento_no_letal' | 'intento_letal'
  bhsLevel: 'bajo' | 'moderado' | 'alto'
  hasDebt: boolean
  hasSupport: boolean
  hasMeaning: boolean
  soughtHelp: boolean
}

const profiles: Profile[] = [
  // Young teens 14-17
  { edad: 16, sexo: 'femenino', estadoCivil: 'soltero', nivelEducativo: 'secundaria', ocupacion: 'estudiante', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'moderado', cssrsLevel: 'ideacion', bhsLevel: 'moderado', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 15, sexo: 'masculino', estadoCivil: 'soltero', nivelEducativo: 'secundaria', ocupacion: 'estudiante', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'minimo', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 17, sexo: 'femenino', estadoCivil: 'soltero', nivelEducativo: 'secundaria', ocupacion: 'estudiante', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'rural', estadoUsuario: 'vivo', phq9Level: 'severo', cssrsLevel: 'intento_no_letal', bhsLevel: 'alto', hasDebt: false, hasSupport: false, hasMeaning: false, soughtHelp: true },
  { edad: 14, sexo: 'femenino', estadoCivil: 'soltero', nivelEducativo: 'secundaria', ocupacion: 'estudiante', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'severo', cssrsLevel: 'intento_letal', bhsLevel: 'alto', hasDebt: false, hasSupport: false, hasMeaning: false, soughtHelp: true },
  { edad: 17, sexo: 'masculino', estadoCivil: 'soltero', nivelEducativo: 'secundaria', ocupacion: 'estudiante', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'rural', estadoUsuario: 'vivo', phq9Level: 'leve', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 16, sexo: 'no_binario', estadoCivil: 'soltero', nivelEducativo: 'universitario', ocupacion: 'estudiante', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'moderadamente_severo', cssrsLevel: 'planificacion', bhsLevel: 'moderado', hasDebt: false, hasSupport: false, hasMeaning: true, soughtHelp: true },

  // Young adults 18-25
  { edad: 19, sexo: 'masculino', estadoCivil: 'soltero', nivelEducativo: 'tecnico', ocupacion: 'estudiante', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'leve', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 23, sexo: 'femenino', estadoCivil: 'soltero', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '1_2_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'moderado', cssrsLevel: 'ideacion', bhsLevel: 'moderado', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 22, sexo: 'femenino', estadoCivil: 'soltero', nivelEducativo: 'universitario', ocupacion: 'desempleado', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'severo', cssrsLevel: 'intento_no_letal', bhsLevel: 'alto', hasDebt: true, hasSupport: false, hasMeaning: false, soughtHelp: true },
  { edad: 20, sexo: 'masculino', estadoCivil: 'soltero', nivelEducativo: 'tecnico', ocupacion: 'empleado', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'rural', estadoUsuario: 'vivo', phq9Level: 'leve', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 21, sexo: 'femenino', estadoCivil: 'soltero', nivelEducativo: 'universitario', ocupacion: 'estudiante', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'moderado', cssrsLevel: 'ideacion', bhsLevel: 'moderado', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 25, sexo: 'femenino', estadoCivil: 'union_libre', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '1_2_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'moderadamente_severo', cssrsLevel: 'ideacion', bhsLevel: 'moderado', hasDebt: true, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 18, sexo: 'femenino', estadoCivil: 'soltero', nivelEducativo: 'universitario', ocupacion: 'estudiante', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'moderado', cssrsLevel: 'ideacion', bhsLevel: 'moderado', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 24, sexo: 'femenino', estadoCivil: 'soltero', nivelEducativo: 'tecnico', ocupacion: 'empleado', ingresoMensual: '1_2_smlv', zonaResidencia: 'rural', estadoUsuario: 'vivo', phq9Level: 'moderado', cssrsLevel: 'ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },

  // Adults 26-35
  { edad: 27, sexo: 'masculino', estadoCivil: 'casado', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '2_4_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'minimo', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 29, sexo: 'masculino', estadoCivil: 'soltero', nivelEducativo: 'tecnico', ocupacion: 'empleado', ingresoMensual: '2_4_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'leve', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 30, sexo: 'masculino', estadoCivil: 'divorciado', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '2_4_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'moderado', cssrsLevel: 'ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: true },
  { edad: 26, sexo: 'masculino', estadoCivil: 'casado', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '4_8_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'minimo', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 28, sexo: 'femenino', estadoCivil: 'soltero', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '1_2_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'severo', cssrsLevel: 'intento_no_letal', bhsLevel: 'alto', hasDebt: true, hasSupport: false, hasMeaning: false, soughtHelp: true },
  { edad: 32, sexo: 'masculino', estadoCivil: 'divorciado', nivelEducativo: 'tecnico', ocupacion: 'desempleado', ingresoMensual: 'sin_ingresos', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'severo', cssrsLevel: 'intento_letal', bhsLevel: 'alto', hasDebt: true, hasSupport: false, hasMeaning: false, soughtHelp: true },

  // Adults 36-45
  { edad: 35, sexo: 'femenino', estadoCivil: 'casado', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '4_8_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'leve', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 38, sexo: 'masculino', estadoCivil: 'casado', nivelEducativo: 'tecnico', ocupacion: 'empleado', ingresoMensual: '2_4_smlv', zonaResidencia: 'rural', estadoUsuario: 'vivo', phq9Level: 'moderado', cssrsLevel: 'ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 42, sexo: 'femenino', estadoCivil: 'divorciado', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '2_4_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'moderadamente_severo', cssrsLevel: 'planificacion', bhsLevel: 'moderado', hasDebt: true, hasSupport: true, hasMeaning: true, soughtHelp: true },
  { edad: 40, sexo: 'femenino', estadoCivil: 'casado', nivelEducativo: 'secundaria', ocupacion: 'empleado', ingresoMensual: '1_2_smlv', zonaResidencia: 'rural', estadoUsuario: 'vivo', phq9Level: 'severo', cssrsLevel: 'intento_letal', bhsLevel: 'alto', hasDebt: true, hasSupport: false, hasMeaning: false, soughtHelp: true },
  { edad: 33, sexo: 'masculino', estadoCivil: 'soltero', nivelEducativo: 'posgrado', ocupacion: 'empleado', ingresoMensual: '4_8_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'leve', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 37, sexo: 'masculino', estadoCivil: 'casado', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: 'mas_8_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'minimo', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 36, sexo: 'masculino', estadoCivil: 'casado', nivelEducativo: 'secundaria', ocupacion: 'empleado', ingresoMensual: '1_2_smlv', zonaResidencia: 'rural', estadoUsuario: 'vivo', phq9Level: 'moderadamente_severo', cssrsLevel: 'ideacion', bhsLevel: 'moderado', hasDebt: true, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 45, sexo: 'femenino', estadoCivil: 'viudo', nivelEducativo: 'primaria', ocupacion: 'desempleado', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'rural', estadoUsuario: 'vivo', phq9Level: 'severo', cssrsLevel: 'intento_letal', bhsLevel: 'alto', hasDebt: false, hasSupport: false, hasMeaning: false, soughtHelp: false },

  // Adults 46-65
  { edad: 52, sexo: 'femenino', estadoCivil: 'casado', nivelEducativo: 'secundaria', ocupacion: 'empleado', ingresoMensual: '1_2_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'moderado', cssrsLevel: 'ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 58, sexo: 'masculino', estadoCivil: 'casado', nivelEducativo: 'tecnico', ocupacion: 'empleado', ingresoMensual: '2_4_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'leve', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 48, sexo: 'femenino', estadoCivil: 'divorciado', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '2_4_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'moderadamente_severo', cssrsLevel: 'ideacion', bhsLevel: 'moderado', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 62, sexo: 'masculino', estadoCivil: 'viudo', nivelEducativo: 'primaria', ocupacion: 'jubilado', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'rural', estadoUsuario: 'vivo', phq9Level: 'severo', cssrsLevel: 'planificacion', bhsLevel: 'alto', hasDebt: false, hasSupport: false, hasMeaning: false, soughtHelp: false },
  { edad: 55, sexo: 'femenino', estadoCivil: 'casado', nivelEducativo: 'tecnico', ocupacion: 'empleado', ingresoMensual: '4_8_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'minimo', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 65, sexo: 'masculino', estadoCivil: 'casado', nivelEducativo: 'secundaria', ocupacion: 'jubilado', ingresoMensual: '1_2_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'moderado', cssrsLevel: 'ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 50, sexo: 'femenino', estadoCivil: 'soltero', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: 'mas_8_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'minimo', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 47, sexo: 'masculino', estadoCivil: 'casado', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '4_8_smlv', zonaResidencia: 'rural', estadoUsuario: 'vivo', phq9Level: 'leve', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },

  // Elderly 66+
  { edad: 70, sexo: 'femenino', estadoCivil: 'viudo', nivelEducativo: 'primaria', ocupacion: 'jubilado', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'rural', estadoUsuario: 'vivo', phq9Level: 'moderadamente_severo', cssrsLevel: 'ideacion', bhsLevel: 'moderado', hasDebt: false, hasSupport: false, hasMeaning: false, soughtHelp: false },
  { edad: 68, sexo: 'masculino', estadoCivil: 'casado', nivelEducativo: 'secundaria', ocupacion: 'jubilado', ingresoMensual: '1_2_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'leve', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 75, sexo: 'femenino', estadoCivil: 'viudo', nivelEducativo: 'primaria', ocupacion: 'jubilado', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'rural', estadoUsuario: 'vivo', phq9Level: 'severo', cssrsLevel: 'planificacion', bhsLevel: 'alto', hasDebt: false, hasSupport: false, hasMeaning: false, soughtHelp: false },
  { edad: 72, sexo: 'masculino', estadoCivil: 'casado', nivelEducativo: 'tecnico', ocupacion: 'jubilado', ingresoMensual: '2_4_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'leve', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 67, sexo: 'femenino', estadoCivil: 'casado', nivelEducativo: 'universitario', ocupacion: 'jubilado', ingresoMensual: '2_4_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'moderado', cssrsLevel: 'ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: true },

  // High risk profiles
  { edad: 21, sexo: 'masculino', estadoCivil: 'soltero', nivelEducativo: 'universitario', ocupacion: 'estudiante', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'severo', cssrsLevel: 'intento_letal', bhsLevel: 'alto', hasDebt: false, hasSupport: false, hasMeaning: false, soughtHelp: true },
  { edad: 19, sexo: 'femenino', estadoCivil: 'soltero', nivelEducativo: 'universitario', ocupacion: 'estudiante', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'severo', cssrsLevel: 'intento_letal', bhsLevel: 'alto', hasDebt: false, hasSupport: false, hasMeaning: false, soughtHelp: true },
  { edad: 24, sexo: 'femenino', estadoCivil: 'union_libre', nivelEducativo: 'tecnico', ocupacion: 'empleado', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'severo', cssrsLevel: 'intento_no_letal', bhsLevel: 'alto', hasDebt: true, hasSupport: false, hasMeaning: false, soughtHelp: true },
  { edad: 34, sexo: 'masculino', estadoCivil: 'union_libre', nivelEducativo: 'tecnico', ocupacion: 'empleado', ingresoMensual: '1_2_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'moderadamente_severo', cssrsLevel: 'ideacion', bhsLevel: 'moderado', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },

  // Deceased - suicide
  { edad: 18, sexo: 'masculino', estadoCivil: 'soltero', nivelEducativo: 'secundaria', ocupacion: 'estudiante', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'urbana', estadoUsuario: 'fallecido', causaFallecimiento: 'ahoramiento', fallecimientoVoluntario: true, fechaFallecimiento: new Date('2025-03-15T22:30:00'), phq9Level: 'severo', cssrsLevel: 'intento_letal', bhsLevel: 'alto', hasDebt: false, hasSupport: false, hasMeaning: false, soughtHelp: false },
  { edad: 25, sexo: 'femenino', estadoCivil: 'soltero', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '1_2_smlv', zonaResidencia: 'urbana', estadoUsuario: 'fallecido', causaFallecimiento: 'caida_de_altura', fallecimientoVoluntario: true, fechaFallecimiento: new Date('2025-07-01T15:00:00'), phq9Level: 'severo', cssrsLevel: 'intento_letal', bhsLevel: 'alto', hasDebt: false, hasSupport: false, hasMeaning: false, soughtHelp: false },
  { edad: 42, sexo: 'masculino', estadoCivil: 'divorciado', nivelEducativo: 'tecnico', ocupacion: 'desempleado', ingresoMensual: 'sin_ingresos', zonaResidencia: 'rural', estadoUsuario: 'fallecido', causaFallecimiento: 'intoxicacion', fallecimientoVoluntario: true, fechaFallecimiento: new Date('2025-09-20T23:00:00'), phq9Level: 'severo', cssrsLevel: 'intento_letal', bhsLevel: 'alto', hasDebt: true, hasSupport: false, hasMeaning: false, soughtHelp: false },
  { edad: 16, sexo: 'femenino', estadoCivil: 'soltero', nivelEducativo: 'secundaria', ocupacion: 'estudiante', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'urbana', estadoUsuario: 'fallecido', causaFallecimiento: 'caida_de_altura', fallecimientoVoluntario: true, fechaFallecimiento: new Date('2025-12-10T18:00:00'), phq9Level: 'severo', cssrsLevel: 'intento_letal', bhsLevel: 'alto', hasDebt: false, hasSupport: false, hasMeaning: false, soughtHelp: false },
  // Deceased - natural causes
  { edad: 30, sexo: 'masculino', estadoCivil: 'casado', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '2_4_smlv', zonaResidencia: 'urbana', estadoUsuario: 'fallecido', causaFallecimiento: 'enfermedad cardiaca', fallecimientoVoluntario: false, fechaFallecimiento: new Date('2026-02-28T04:15:00'), phq9Level: 'moderado', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 55, sexo: 'femenino', estadoCivil: 'viudo', nivelEducativo: 'secundaria', ocupacion: 'jubilado', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'rural', estadoUsuario: 'fallecido', causaFallecimiento: 'enfermedad cronica', fallecimientoVoluntario: false, fechaFallecimiento: new Date('2026-04-15T06:00:00'), phq9Level: 'moderado', cssrsLevel: 'ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },

  // Additional healthy profiles
  { edad: 40, sexo: 'femenino', estadoCivil: 'casado', nivelEducativo: 'posgrado', ocupacion: 'empleado', ingresoMensual: 'mas_8_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'minimo', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 45, sexo: 'masculino', estadoCivil: 'casado', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '4_8_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'leve', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 29, sexo: 'femenino', estadoCivil: 'soltero', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '2_4_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'leve', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 63, sexo: 'femenino', estadoCivil: 'casado', nivelEducativo: 'primaria', ocupacion: 'jubilado', ingresoMensual: 'menos_1_smlv', zonaResidencia: 'rural', estadoUsuario: 'vivo', phq9Level: 'moderadamente_severo', cssrsLevel: 'ideacion', bhsLevel: 'moderado', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 51, sexo: 'masculino', estadoCivil: 'casado', nivelEducativo: 'tecnico', ocupacion: 'empleado', ingresoMensual: '2_4_smlv', zonaResidencia: 'rural', estadoUsuario: 'vivo', phq9Level: 'minimo', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 26, sexo: 'femenino', estadoCivil: 'soltero', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '1_2_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'moderado', cssrsLevel: 'ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
  { edad: 33, sexo: 'masculino', estadoCivil: 'casado', nivelEducativo: 'universitario', ocupacion: 'empleado', ingresoMensual: '4_8_smlv', zonaResidencia: 'urbana', estadoUsuario: 'vivo', phq9Level: 'minimo', cssrsLevel: 'sin_ideacion', bhsLevel: 'bajo', hasDebt: false, hasSupport: true, hasMeaning: true, soughtHelp: false },
]

function generatePHQ9(level: string): number[] {
  const ranges: Record<string, [number, number]> = {
    minimo: [0, 0], leve: [0, 1], moderado: [1, 2], moderadamente_severo: [2, 3], severo: [2, 3]
  }
  const [lo, hi] = ranges[level] || [0, 1]
  return Array.from({ length: 9 }, () => rand(lo, hi))
}

function generateCSSRS(level: string) {
  const base = { deseosMorir: false, pensamientosSuicidas: false, metodoSinPlan: false, intencionSinPlan: false, planEspecifico: false, intencionEjecutar: false, intentoPrevio: false }
  if (level === 'intento_letal') return { ...base, deseosMorir: true, pensamientosSuicidas: true, metodoSinPlan: true, intencionSinPlan: true, planEspecifico: true, intencionEjecutar: true, intentoPrevio: true }
  if (level === 'planificacion') return { ...base, deseosMorir: true, pensamientosSuicidas: true, metodoSinPlan: true, intencionSinPlan: true, planEspecifico: true }
  if (level === 'intento_no_letal') return { ...base, deseosMorir: true, pensamientosSuicidas: true, metodoSinPlan: true, intencionSinPlan: true, intentoPrevio: true }
  if (level === 'ideacion') return { ...base, deseosMorir: true, pensamientosSuicidas: true }
  return base
}

function generateBHS(level: string): boolean[] {
  const count = level === 'alto' ? rand(15, 20) : level === 'moderado' ? rand(10, 14) : rand(0, 9)
  const items = Array(20).fill(false)
  const indices = Array.from({ length: 20 }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) { const j = rand(0, i); [indices[i], indices[j]] = [indices[j], indices[i]] }
  for (let i = 0; i < count; i++) items[indices[i]] = true
  return items
}

function generateRosenberg(level: string): number[] {
  if (level === 'severo') return Array.from({ length: 10 }, () => rand(1, 1))
  if (level === 'moderado') return Array.from({ length: 10 }, () => rand(1, 2))
  if (level === 'leve') return Array.from({ length: 10 }, () => rand(2, 3))
  return Array.from({ length: 10 }, () => rand(3, 4))
}

function generateDASS21(phq9Level: string): number[] {
  const ranges: Record<string, [number, number]> = {
    minimo: [0, 0], leve: [0, 1], moderado: [1, 2], moderadamente_severo: [2, 3], severo: [2, 3]
  }
  const [lo, hi] = ranges[phq9Level] || [0, 1]
  return Array.from({ length: 21 }, () => rand(lo, hi))
}

async function main() {
  console.log('Iniciando seed de 60 encuestas...')

  // Delete existing seed data (IDs > 6)
  await prisma.$executeRaw`DELETE FROM chat_mensajes WHERE sesion_id IN (SELECT id FROM chat_sesiones WHERE encuesta_id > 6)`
  await prisma.$executeRaw`DELETE FROM chat_sesiones WHERE encuesta_id > 6`
  await prisma.$executeRaw`DELETE FROM analisis_ia WHERE encuesta_id > 6`
  await prisma.$executeRaw`DELETE FROM historial_intentos WHERE encuesta_id > 6`
  await prisma.$executeRaw`DELETE FROM salud_fisica WHERE encuesta_id > 6`
  await prisma.$executeRaw`DELETE FROM factores_psicologicos WHERE encuesta_id > 6`
  await prisma.$executeRaw`DELETE FROM factores_socioeconomicos WHERE encuesta_id > 6`
  await prisma.$executeRaw`DELETE FROM dass21_respuestas WHERE encuesta_id > 6`
  await prisma.$executeRaw`DELETE FROM rosenberg_respuestas WHERE encuesta_id > 6`
  await prisma.$executeRaw`DELETE FROM bhs_respuestas WHERE encuesta_id > 6`
  await prisma.$executeRaw`DELETE FROM cssrs_respuestas WHERE encuesta_id > 6`
  await prisma.$executeRaw`DELETE FROM phq9_respuestas WHERE encuesta_id > 6`
  await prisma.$executeRaw`DELETE FROM encuestas WHERE id > 6`

  let encId = 7
  const startDate = new Date('2025-01-01')
  const endDate = new Date('2026-06-23')

  for (const p of profiles) {
    const fecha = randomDate(startDate, endDate)
    const encuesta = await prisma.encuesta.create({
      data: {
        edad: p.edad,
        sexo: p.sexo,
        estadoCivil: p.estadoCivil,
        nivelEducativo: p.nivelEducativo,
        ocupacion: p.ocupacion,
        ingresoMensual: p.ingresoMensual,
        zonaResidencia: p.zonaResidencia,
        estadoUsuario: p.estadoUsuario,
        causaFallecimiento: p.causaFallecimiento || null,
        fallecimientoVoluntario: p.fallecimientoVoluntario || null,
        fechaFallecimiento: p.fechaFallecimiento || null,
        createdAt: fecha,
      }
    })

    const id = encuesta.id

    // PHQ-9
    const phq9Items = generatePHQ9(p.phq9Level)
    const phq9 = calcularPHQ9(phq9Items)
    await prisma.phq9Respuesta.create({
      data: {
        encuestaId: id,
        interesActividades: phq9Items[0], estadoAnimo: phq9Items[1], sueno: phq9Items[2],
        energia: phq9Items[3], apetito: phq9Items[4], autoestima: phq9Items[5],
        concentracion: phq9Items[6], psicomotricidad: phq9Items[7], ideacionSuicida: phq9Items[8],
        dificultadFuncionamiento: rand(0, 3), puntajeTotal: phq9.total, nivelGravedad: phq9.nivel,
      }
    })

    // C-SSRS
    const cssrs = generateCSSRS(p.cssrsLevel)
    await prisma.cssrsRespuesta.create({
      data: {
        encuestaId: id, ...cssrs,
        nivelSeveridad: calcularCSSRS(cssrs),
      }
    })

    // BHS
    const bhsItems = generateBHS(p.bhsLevel)
    const bhs = calcularBHS(bhsItems)
    const bhsData: Record<string, any> = { encuestaId: id, puntajeTotal: bhs.total, nivelRiesgo: bhs.nivel }
    bhsItems.forEach((v, i) => { bhsData[`item${i + 1}`] = v })
    await prisma.bhsRespuesta.create({ data: bhsData })

    // Rosenberg
    const rosenbergItems = generateRosenberg(p.phq9Level === 'severo' ? 'bajo' : p.phq9Level === 'minimo' ? 'alto' : 'medio')
    await prisma.rosenbergRespuesta.create({
      data: {
        encuestaId: id,
        item1: rosenbergItems[0], item2: rosenbergItems[1], item3: rosenbergItems[2],
        item4: rosenbergItems[3], item5: rosenbergItems[4], item6: rosenbergItems[5],
        item7: rosenbergItems[6], item8: rosenbergItems[7], item9: rosenbergItems[8],
        item10: rosenbergItems[9],
      }
    })

    // DASS-21
    const dass21Items = generateDASS21(p.phq9Level)
    const dass21 = calcularDASS21(dass21Items)
    const dassData: Record<string, any> = {
      encuestaId: id,
      puntajeEstres: dass21.estres, puntajeAnsiedad: dass21.ansiedad, puntajeDepresion: dass21.depresion,
    }
    dass21Items.forEach((v, i) => { dassData[`item${i + 1}`] = v })
    await prisma.dass21Respuesta.create({ data: dassData })

    // Factores socioeconomicos
    const nivelDeudas = p.hasDebt ? pick(['medio', 'alto', 'muy_alto']) : pick(['sin_deudas', 'bajo'])
    await prisma.factoresSocioeconomicos.create({
      data: {
        encuestaId: id,
        estadoLaboral: p.ocupacion,
        satisfaccionLaboral: p.phq9Level === 'severo' ? rand(1, 2) : rand(3, 5),
        horasTrabajoSemanal: p.ocupacion === 'empleado' ? rand(35, 55) : null,
        estresLaboral: p.phq9Level === 'severo' ? rand(4, 5) : p.phq9Level === 'minimo' ? rand(1, 2) : rand(2, 4),
        nivelDeudas,
        dificultadEconomica: p.hasDebt,
        calidadRelacionesFamiliares: p.hasSupport ? rand(3, 5) : rand(1, 2),
        calidadRelacionesPareja: p.estadoCivil === 'casado' || p.estadoCivil === 'union_libre' ? (p.hasSupport ? rand(3, 5) : rand(1, 2)) : null,
        apoyoSocialPercibido: p.hasSupport ? rand(3, 5) : rand(1, 2),
        numPersonasConfianza: p.hasSupport ? rand(2, 5) : rand(0, 1),
        viveSolo: p.estadoCivil === 'soltero' ? pick([true, false]) : false,
        tipoVivienda: p.zonaResidencia === 'rural' ? pick(['casa_familiar', 'propia']) : pick(['arriendo', 'propia', 'casa_familiar']),
        calidadVivienda: p.edad >= 65 && p.zonaResidencia === 'rural' ? rand(2, 3) : rand(3, 5),
        accesoSaludMental: p.soughtHelp,
        tipoAfiliacionSalud: p.soughtHelp ? 'contributivo' : pick(['subsidiado', 'contributivo', 'nulo']),
        distanciaServicioSalud: p.zonaResidencia === 'rural' ? pick(['lejos', 'muy_lejos']) : pick(['cerca', 'medio']),
      }
    })

    // Factores psicologicos
    await prisma.factoresPsicologicos.create({
      data: {
        encuestaId: id,
        erqReevaluacionCognitiva: p.hasSupport ? rand(18, 26) : rand(8, 14),
        erqSupresionExpresiva: p.hasSupport ? rand(10, 14) : rand(18, 24),
        impulsividadMotora: p.phq9Level === 'severo' ? rand(22, 30) : rand(12, 18),
        impulsividadNoPlanificada: p.phq9Level === 'severo' ? rand(20, 26) : rand(10, 16),
        impulsividadAtencional: p.phq9Level === 'severo' ? rand(18, 22) : rand(10, 16),
        perdidaFamiliarReciente: p.bhsLevel === 'alto' ? pick([true, true, false]) : false,
        violenciaFisica: p.phq9Level === 'severo' ? pick([true, false]) : false,
        violenciaPsicologica: p.phq9Level === 'severo' || p.cssrsLevel !== 'sin_ideacion' ? pick([true, false]) : false,
        abusoSexual: p.cssrsLevel === 'intento_letal' ? pick([true, false]) : false,
        bullying: p.edad <= 20 && p.phq9Level !== 'minimo' ? pick([true, false]) : false,
        desempleoReciente: p.ocupacion === 'desempleado',
        ruptureParejaReciente: (p.estadoCivil === 'divorciado' || p.estadoCivil === 'soltero') && p.phq9Level !== 'minimo' ? pick([true, false]) : false,
        problemaLegalReciente: p.cssrsLevel === 'intento_letal' ? pick([true, false]) : false,
        tieneRedApoyo: p.hasSupport,
        percibeVidaConSentido: p.hasMeaning,
        haBuscadoAyudaProfesional: p.soughtHelp,
        tipoAyudaProfesional: p.soughtHelp ? pick(['psicologia', 'psiquiatria']) : null,
      }
    })

    // Salud fisica
    const chronicIllness = p.edad >= 50 ? pick([true, false]) : false
    await prisma.saludFisica.create({
      data: {
        encuestaId: id,
        enfermedadCronica: chronicIllness,
        tipoEnfermedadCronica: chronicIllness ? pick(['diabetes', 'hipertension', 'artritis', 'asma']) : null,
        dolorCronico: p.phq9Level !== 'minimo' ? pick([true, false]) : false,
        tratamientoMedicoActual: chronicIllness,
        medicamentosActuales: chronicIllness ? pick(['metformina', 'losartan', 'ibuprofeno']) : null,
        calidadSueno: p.phq9Level === 'severo' ? rand(1, 2) : p.phq9Level === 'minimo' ? rand(4, 5) : rand(2, 4),
        horasSuenoPromedio: p.phq9Level === 'severo' ? rand(3, 5) : rand(5, 8),
        insomnio: p.phq9Level === 'severo' || p.bhsLevel === 'alto',
        consumeAlcohol: p.edad >= 18 ? pick([true, false, false]) : false,
        frecuenciaAlcohol: p.edad >= 18 ? pick(['nunca', 'ocasional', 'moderado', 'frecuente']) : 'nunca',
        consumeTabaco: p.edad >= 18 ? pick([true, false, false, false]) : false,
        frecuenciaTabaco: p.edad >= 18 ? pick(['nunca', 'ocasional', 'moderado']) : 'nunca',
        consumeDrogas: p.edad >= 18 && p.cssrsLevel === 'intento_letal' ? pick([true, false]) : false,
        tipoDrogas: null,
        frecuenciaDrogas: null,
      }
    })

    // Historial de intentos (for those with attempts)
    if (p.cssrsLevel === 'intento_no_letal' || p.cssrsLevel === 'intento_letal') {
      await prisma.historialIntentos.create({
        data: {
          encuestaId: id,
          numIntentosPrevios: rand(1, 3),
          primerIntentoEdad: rand(Math.max(14, p.edad - 5), p.edad - 1),
          ultimoIntentoFecha: randomDate(new Date('2024-01-01'), fecha),
          metodoIntento: pick(['intoxicacion', 'corte de venas', 'ahoramiento', 'caida de altura']),
          hospitalizacionPorIntento: pick([true, false]),
          tratamientoPsiquiatricoPrevio: p.soughtHelp,
          antecedentesFamiliaresSuicidio: pick([true, false, false]),
          antecedentesFamiliaresEnfermedadMental: pick([true, true, false]),
        }
      })
    }

    encId++
    process.stdout.write(`\r  Creada encuesta ${encId - 7}/60 (ID: ${id})`)
  }

  console.log(`\n\nSeed completado: ${profiles.length} encuestas creadas con todas las respuestas asociadas.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
