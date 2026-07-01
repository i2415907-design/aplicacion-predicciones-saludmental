import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@/lib/openai"
import { CHAT_SYSTEM_PROMPT, ANALISIS_PROMPTS } from "@/lib/prompts"
import { prisma } from "@/lib/prisma"

export interface AnalisisDimension {
  titulo: string
  contenido: string
}

export interface ChatResponse {
  response: string
  analisis?: {
    descriptivo: AnalisisDimension
    diagnostico: AnalisisDimension
    predictivo: AnalisisDimension
    prescriptivo: AnalisisDimension
  }
}

async function obtenerContextoBD() {
  const totalEncuestas = await prisma.encuesta.count()

  const q = async <T>(sql: string): Promise<T[]> => prisma.$queryRawUnsafe<T[]>(sql)

  // === DEMOGRAFÍA ===
  const distribucionSexo = await q<{ sexo: string; cantidad: bigint }>(
    `SELECT sexo, COUNT(*) as cantidad FROM encuestas GROUP BY sexo`)
  const distribucionEdad = await q<{ rango: string; cantidad: bigint }>(
    `SELECT CASE WHEN edad<18 THEN '<18' WHEN edad<26 THEN '18-25' WHEN edad<36 THEN '26-35' WHEN edad<46 THEN '36-45' WHEN edad<66 THEN '46-65' ELSE '65+' END as rango, COUNT(*) as cantidad FROM encuestas GROUP BY rango ORDER BY rango`)
  const distribucionEstadoCivil = await q<{ estado: string; cantidad: bigint }>(
    `SELECT estado_civil as estado, COUNT(*) as cantidad FROM encuestas GROUP BY estado_civil`)
  const distribucionEducacion = await q<{ nivel: string; cantidad: bigint }>(
    `SELECT nivel_educativo as nivel, COUNT(*) as cantidad FROM encuestas GROUP BY nivel_educativo`)
  const distribucionOcupacion = await q<{ ocupacion: string; cantidad: bigint }>(
    `SELECT ocupacion, COUNT(*) as cantidad FROM encuestas GROUP BY ocupacion ORDER BY cantidad DESC LIMIT 15`)
  const distribucionIngreso = await q<{ ingreso: string; cantidad: bigint }>(
    `SELECT ingreso_mensual as ingreso, COUNT(*) as cantidad FROM encuestas GROUP BY ingreso_mensual`)
  const distribucionZona = await q<{ zona: string; cantidad: bigint }>(
    `SELECT zona_residencia as zona, COUNT(*) as cantidad FROM encuestas GROUP BY zona_residencia`)

  // === ESCALAS CLÍNICAS POR SEXO ===
  const phq9PorSexo = await q<{ sexo: string; nivel: string; cantidad: bigint }>(
    `SELECT e.sexo, p.nivel_gravedad as nivel, COUNT(*) as cantidad FROM encuestas e JOIN phq9_respuestas p ON p.encuesta_id=e.id GROUP BY e.sexo, p.nivel_gravedad`)
  const cssrsPorSexo = await q<{ sexo: string; nivel: string; cantidad: bigint }>(
    `SELECT e.sexo, c.nivel_severidad as nivel, COUNT(*) as cantidad FROM encuestas e JOIN cssrs_respuestas c ON c.encuesta_id=e.id GROUP BY e.sexo, c.nivel_severidad`)
  const bhsPorSexo = await q<{ sexo: string; nivel: string; cantidad: bigint }>(
    `SELECT e.sexo, b.nivel_riesgo as nivel, COUNT(*) as cantidad FROM encuestas e JOIN bhs_respuestas b ON b.encuesta_id=e.id GROUP BY e.sexo, b.nivel_riesgo`)
  const promediosPorSexo = await q<{ sexo: string; phq9: number; dass21_estres: number; dass21_ansiedad: number; dass21_depresion: number; rosenberg: number; total: bigint }>(
    `SELECT e.sexo, ROUND(AVG(p.puntaje_total),2) as phq9, ROUND(AVG(d.puntaje_estres),2) as dass21_estres, ROUND(AVG(d.puntaje_ansiedad),2) as dass21_ansiedad, ROUND(AVG(d.puntaje_depresion),2) as dass21_depresion, ROUND(AVG(r.item1+r.item2+r.item3+r.item4+r.item5+r.item6+r.item7+r.item8+r.item9+r.item10),2) as rosenberg, COUNT(*) as total FROM encuestas e JOIN phq9_respuestas p ON p.encuesta_id=e.id JOIN dass21_respuestas d ON d.encuesta_id=e.id JOIN rosenberg_respuestas r ON r.encuesta_id=e.id GROUP BY e.sexo`)

  // === DASS-21 POR SEXO ===
  const dass21PorSexo = await q<{ sexo: string; estres_nivel: string; ansiedad_nivel: string; depresion_nivel: string; cantidad: bigint }>(
    `SELECT e.sexo,
      CASE WHEN d.puntaje_estres<=14 THEN 'normal' WHEN d.puntaje_estres<=18 THEN 'leve' WHEN d.puntaje_estres<=25 THEN 'moderado' WHEN d.puntaje_estres<=33 THEN 'severo' ELSE 'extremo' END as estres_nivel,
      CASE WHEN d.puntaje_ansiedad<=9 THEN 'normal' WHEN d.puntaje_ansiedad<=14 THEN 'leve' WHEN d.puntaje_ansiedad<=19 THEN 'moderado' WHEN d.puntaje_ansiedad<=25 THEN 'severo' ELSE 'extremo' END as ansiedad_nivel,
      CASE WHEN d.puntaje_depresion<=13 THEN 'normal' WHEN d.puntaje_depresion<=20 THEN 'leve' WHEN d.puntaje_depresion<=27 THEN 'moderado' WHEN d.puntaje_depresion<=34 THEN 'severo' ELSE 'extremo' END as depresion_nivel,
      COUNT(*) as cantidad
    FROM encuestas e JOIN dass21_respuestas d ON d.encuesta_id=e.id GROUP BY e.sexo, estres_nivel, ansiedad_nivel, depresion_nivel`)

  // === ROSENBERG POR SEXO ===
  const rosenbergPorSexo = await q<{ sexo: string; nivel: string; cantidad: bigint }>(
    `SELECT e.sexo,
      CASE WHEN (r.item1+r.item2+r.item3+r.item4+r.item5+r.item6+r.item7+r.item8+r.item9+r.item10)<=15 THEN 'baja' WHEN (r.item1+r.item2+r.item3+r.item4+r.item5+r.item6+r.item7+r.item8+r.item9+r.item10)<=25 THEN 'media' ELSE 'alta' END as nivel,
      COUNT(*) as cantidad
    FROM encuestas e JOIN rosenberg_respuestas r ON r.encuesta_id=e.id GROUP BY e.sexo, nivel`)

  // === CRUCES CLAVE: ESCALAS × FACTORES ===
  const depresionxFactor = await q<{ factor: string; nivel: string; cantidad: bigint }>(
    `SELECT 'drogas' as factor, p.nivel_gravedad as nivel, COUNT(*) as cantidad FROM encuestas e JOIN salud_fisica s ON s.encuesta_id=e.id JOIN phq9_respuestas p ON p.encuesta_id=e.id WHERE s.consume_drogas = TRUE GROUP BY p.nivel_gravedad
    UNION ALL
    SELECT 'alcohol_frecuente', p.nivel_gravedad, COUNT(*) FROM encuestas e JOIN salud_fisica s ON s.encuesta_id=e.id JOIN phq9_respuestas p ON p.encuesta_id=e.id WHERE s.frecuencia_alcohol IN ('frecuente','diario') GROUP BY p.nivel_gravedad
    UNION ALL
    SELECT 'tabaco', p.nivel_gravedad, COUNT(*) FROM encuestas e JOIN salud_fisica s ON s.encuesta_id=e.id JOIN phq9_respuestas p ON p.encuesta_id=e.id WHERE s.consume_tabaco = TRUE GROUP BY p.nivel_gravedad
    UNION ALL
    SELECT 'violencia', p.nivel_gravedad, COUNT(*) FROM encuestas e JOIN factores_psicologicos f ON f.encuesta_id=e.id JOIN phq9_respuestas p ON p.encuesta_id=e.id WHERE f.violencia_fisica = TRUE OR f.violencia_psicologica = TRUE GROUP BY p.nivel_gravedad
    UNION ALL
    SELECT 'desempleo', p.nivel_gravedad, COUNT(*) FROM encuestas e JOIN factores_psicologicos f ON f.encuesta_id=e.id JOIN phq9_respuestas p ON p.encuesta_id=e.id WHERE f.desempleo_reciente = TRUE GROUP BY p.nivel_gravedad
    UNION ALL
    SELECT 'sin_apoyo', p.nivel_gravedad, COUNT(*) FROM encuestas e JOIN factores_psicologicos f ON f.encuesta_id=e.id JOIN phq9_respuestas p ON p.encuesta_id=e.id WHERE f.tiene_red_apoyo = FALSE GROUP BY p.nivel_gravedad`)

  const ideacionxFactor = await q<{ factor: string; nivel: string; cantidad: bigint }>(
    `SELECT 'drogas' as factor, c.nivel_severidad as nivel, COUNT(*) as cantidad FROM encuestas e JOIN salud_fisica s ON s.encuesta_id=e.id JOIN cssrs_respuestas c ON c.encuesta_id=e.id WHERE s.consume_drogas = TRUE GROUP BY c.nivel_severidad
    UNION ALL
    SELECT 'alcohol_frecuente', c.nivel_severidad, COUNT(*) FROM encuestas e JOIN salud_fisica s ON s.encuesta_id=e.id JOIN cssrs_respuestas c ON c.encuesta_id=e.id WHERE s.frecuencia_alcohol IN ('frecuente','diario') GROUP BY c.nivel_severidad
    UNION ALL
    SELECT 'violencia', c.nivel_severidad, COUNT(*) FROM encuestas e JOIN factores_psicologicos f ON f.encuesta_id=e.id JOIN cssrs_respuestas c ON c.encuesta_id=e.id WHERE f.violencia_fisica = TRUE OR f.violencia_psicologica = TRUE GROUP BY c.nivel_severidad
    UNION ALL
    SELECT 'sin_apoyo', c.nivel_severidad, COUNT(*) FROM encuestas e JOIN factores_psicologicos f ON f.encuesta_id=e.id JOIN cssrs_respuestas c ON c.encuesta_id=e.id WHERE f.tiene_red_apoyo = FALSE GROUP BY c.nivel_severidad
    UNION ALL
    SELECT 'abuso_sexual', c.nivel_severidad, COUNT(*) FROM encuestas e JOIN factores_psicologicos f ON f.encuesta_id=e.id JOIN cssrs_respuestas c ON c.encuesta_id=e.id WHERE f.abuso_sexual = TRUE GROUP BY c.nivel_severidad`)

  // === CONSUMO SUSTANCIAS ===
  const consumoDrogas = await q<{ sexo: string; consume: string; cantidad: bigint }>(
    `SELECT e.sexo, CASE WHEN s.consume_drogas = TRUE THEN 'si' ELSE 'no' END as consume, COUNT(*) as cantidad FROM encuestas e JOIN salud_fisica s ON s.encuesta_id=e.id GROUP BY e.sexo, s.consume_drogas`)
  const tipoDrogas = await q<{ tipo: string; cantidad: bigint }>(
    `SELECT s.tipo_drogas as tipo, COUNT(*) as cantidad FROM salud_fisica s WHERE s.consume_drogas = TRUE AND s.tipo_drogas IS NOT NULL GROUP BY s.tipo_drogas`)
  const consumoAlcohol = await q<{ sexo: string; frecuencia: string; cantidad: bigint }>(
    `SELECT e.sexo, s.frecuencia_alcohol as frecuencia, COUNT(*) as cantidad FROM encuestas e JOIN salud_fisica s ON s.encuesta_id=e.id GROUP BY e.sexo, s.frecuencia_alcohol`)
  const consumoTabaco = await q<{ sexo: string; frecuencia: string; cantidad: bigint }>(
    `SELECT e.sexo, s.frecuencia_tabaco as frecuencia, COUNT(*) as cantidad FROM encuestas e JOIN salud_fisica s ON s.encuesta_id=e.id GROUP BY e.sexo, s.frecuencia_tabaco`)

  // === SALUD FÍSICA ===
  const saludFisica = await q<{ campo: string; valor: string; cantidad: bigint }>(
    `SELECT 'enfermedad_cronica' as campo, CASE WHEN enfermedad_cronica = TRUE THEN 'si' ELSE 'no' END as valor, COUNT(*) as cantidad FROM salud_fisica GROUP BY enfermedad_cronica
    UNION ALL SELECT 'dolor_cronico', CASE WHEN dolor_cronico = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM salud_fisica GROUP BY dolor_cronico
    UNION ALL SELECT 'tratamiento_medico', CASE WHEN tratamiento_medico_actual = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM salud_fisica GROUP BY tratamiento_medico_actual
    UNION ALL SELECT 'insomnio', CASE WHEN insomnio = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM salud_fisica GROUP BY insomnio`)

  const calidadSueno = await q<{ nivel: string; cantidad: bigint }>(
    `SELECT CASE WHEN calidad_sueno<=2 THEN 'mala' WHEN calidad_sueno<=3 THEN 'regular' ELSE 'buena' END as nivel, COUNT(*) as cantidad FROM salud_fisica GROUP BY nivel`)

  // === FACTORES PSICOLÓGICOS ===
  const factoresPsicologicos = await q<{ campo: string; valor: string; cantidad: bigint }>(
    `SELECT 'perdida_familiar', CASE WHEN perdida_familiar_reciente = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM factores_psicologicos GROUP BY perdida_familiar_reciente
    UNION ALL SELECT 'violencia_fisica', CASE WHEN violencia_fisica = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM factores_psicologicos GROUP BY violencia_fisica
    UNION ALL SELECT 'violencia_psicologica', CASE WHEN violencia_psicologica = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM factores_psicologicos GROUP BY violencia_psicologica
    UNION ALL SELECT 'abuso_sexual', CASE WHEN abuso_sexual = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM factores_psicologicos GROUP BY abuso_sexual
    UNION ALL SELECT 'bullying', CASE WHEN bullying = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM factores_psicologicos GROUP BY bullying
    UNION ALL SELECT 'desempleo', CASE WHEN desempleo_reciente = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM factores_psicologicos GROUP BY desempleo_reciente
    UNION ALL SELECT 'ruptura_pareja', CASE WHEN rupture_pareja_reciente = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM factores_psicologicos GROUP BY rupture_pareja_reciente
    UNION ALL SELECT 'problema_legal', CASE WHEN problema_legal_reciente = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM factores_psicologicos GROUP BY problema_legal_reciente
    UNION ALL SELECT 'tiene_red_apoyo', CASE WHEN tiene_red_apoyo = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM factores_psicologicos GROUP BY tiene_red_apoyo
    UNION ALL SELECT 'vida_con_sentido', CASE WHEN percibe_vida_con_sentido = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM factores_psicologicos GROUP BY percibe_vida_con_sentido
    UNION ALL SELECT 'busco_ayuda', CASE WHEN ha_buscado_ayuda_profesional = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM factores_psicologicos GROUP BY ha_buscado_ayuda_profesional`)

  const impulsividad = await q<{ tipo: string; promedio: number }>(
    `SELECT 'motora' as tipo, ROUND(AVG(impulsividad_motora),2) as promedio FROM factores_psicologicos
    UNION ALL SELECT 'no_planificada', ROUND(AVG(impulsividad_no_planificada),2) FROM factores_psicologicos
    UNION ALL SELECT 'atencional', ROUND(AVG(impulsividad_atencional),2) FROM factores_psicologicos`)

  // === FACTORES SOCIOECONÓMICOS ===
  const factoresSocio = await q<{ campo: string; valor: string; cantidad: bigint }>(
    `SELECT 'nivel_deudas', nivel_deudas, COUNT(*) FROM factores_socioeconomicos GROUP BY nivel_deudas
    UNION ALL SELECT 'dificultad_economica', CASE WHEN dificultad_economica = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM factores_socioeconomicos GROUP BY dificultad_economica
    UNION ALL SELECT 'vive_solo', CASE WHEN vive_solo = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM factores_socioeconomicos GROUP BY vive_solo
    UNION ALL SELECT 'tipo_vivienda', tipo_vivienda, COUNT(*) FROM factores_socioeconomicos GROUP BY tipo_vivienda
    UNION ALL SELECT 'acceso_salud_mental', CASE WHEN acceso_salud_mental = TRUE THEN 'si' ELSE 'no' END, COUNT(*) FROM factores_socioeconomicos GROUP BY acceso_salud_mental
    UNION ALL SELECT 'afiliacion_salud', tipo_afiliacion_salud, COUNT(*) FROM factores_socioeconomicos GROUP BY tipo_afiliacion_salud
    UNION ALL SELECT 'distancia_salud', distancia_servicio_salud, COUNT(*) FROM factores_socioeconomicos GROUP BY distancia_servicio_salud`)

  const apoyoSocial = await q<{ promedio: number }>(
    `SELECT ROUND(AVG(apoyo_social_percibido),2) as promedio FROM factores_socioeconomicos`)
  const satisfaccionLaboral = await q<{ promedio: number }>(
    `SELECT ROUND(AVG(satisfaccion_laboral),2) as promedio FROM factores_socioeconomicos WHERE satisfaccion_laboral IS NOT NULL`)
  const estresLaboral = await q<{ promedio: number }>(
    `SELECT ROUND(AVG(estres_laboral),2) as promedio FROM factores_socioeconomicos WHERE estres_laboral IS NOT NULL`)

  // === HISTORIAL DE INTENTOS ===
  const historial = await q<{ total: bigint; con_tratamiento: bigint; antecedentes_familiares: bigint; promedio_intentos: number }>(
    `SELECT COUNT(*) as total, SUM(CASE WHEN tratamiento_psiquiatrico_previo = TRUE THEN 1 ELSE 0 END) as con_tratamiento, SUM(CASE WHEN antecedentes_familiares_suicidio = TRUE THEN 1 ELSE 0 END) as antecedentes_familiares, ROUND(AVG(num_intentos_previos),2) as promedio_intentos FROM historial_intentos`)

  const metodosIntento = await q<{ metodo: string; cantidad: bigint }>(
    `SELECT metodo_intento as metodo, COUNT(*) as cantidad FROM historial_intentos WHERE metodo_intento IS NOT NULL GROUP BY metodo_intento`)

  // === FALLECIDOS ===
  const fallecidos = await q<{ total: bigint; voluntarios: bigint }>(
    `SELECT COUNT(*) as total, SUM(CASE WHEN fallecimiento_voluntario = TRUE THEN 1 ELSE 0 END) as voluntarios FROM encuestas WHERE estado_usuario='fallecido'`)

  // === FORMATEO ===
  const fmt = <T extends Record<string, any>>(rows: T[], keyFn: (r: T) => string, valFn: (r: T) => number) => {
    const out: Record<string, number> = {}
    rows.forEach(r => { out[keyFn(r)] = valFn(r) })
    return out
  }
  const fmt2d = <T extends Record<string, any>>(rows: T[], k1: string, k2: string) => {
    const out: Record<string, Record<string, number>> = {}
    rows.forEach(r => { const a = String(r[k1]); const b = String(r[k2]); if (!out[a]) out[a] = {}; out[a][b] = Number(r.cantidad) })
    return out
  }

  const f = fallecidos[0]
  const h = historial[0]

  return `
CONTEXTO COMPLETO DE LA BASE DE DATOS (sistema_ia_depresion):
- Total de encuestas: ${totalEncuestas}
- Fallecidos: ${Number(f.total)} total (${Number(f.voluntarios)} voluntarios)

DEMOGRAFÍA:
- Sexo: ${JSON.stringify(fmt(distribucionSexo, r=>r.sexo, r=>Number(r.cantidad)))}
- Edad: ${JSON.stringify(fmt(distribucionEdad, r=>r.rango, r=>Number(r.cantidad)))}
- Estado civil: ${JSON.stringify(fmt(distribucionEstadoCivil, r=>r.estado, r=>Number(r.cantidad)))}
- Educación: ${JSON.stringify(fmt(distribucionEducacion, r=>r.nivel, r=>Number(r.cantidad)))}
- Ocupación (top 15): ${JSON.stringify(fmt(distribucionOcupacion, r=>r.ocupacion, r=>Number(r.cantidad)))}
- Ingresos: ${JSON.stringify(fmt(distribucionIngreso, r=>r.ingreso, r=>Number(r.cantidad)))}
- Zona: ${JSON.stringify(fmt(distribucionZona, r=>r.zona, r=>Number(r.cantidad)))}

PROMEDIOS POR SEXO (PHQ-9, DASS-21, Rosenberg): ${JSON.stringify(promediosPorSexo.map(r=>({sexo:r.sexo, phq9:Number(r.phq9), dass21_estres:Number(r.dass21_estres), dass21_ansiedad:Number(r.dass21_ansiedad), dass21_depresion:Number(r.dass21_depresion), rosenberg:Number(r.rosenberg), total:Number(r.total)})))}

PHQ-9 POR SEXO Y NIVEL: ${JSON.stringify(fmt2d(phq9PorSexo, 'sexo', 'nivel'))}
C-SSRS POR SEXO Y NIVEL: ${JSON.stringify(fmt2d(cssrsPorSexo, 'sexo', 'nivel'))}
BHS POR SEXO Y NIVEL: ${JSON.stringify(fmt2d(bhsPorSexo, 'sexo', 'nivel'))}
DASS-21 POR SEXO: ${JSON.stringify(fmt2d(dass21PorSexo, 'sexo', 'estres_nivel'))}
ROSENBERG POR SEXO: ${JSON.stringify(fmt2d(rosenbergPorSexo, 'sexo', 'nivel'))}

CONSUMO SUSTANCIAS:
- Drogas por sexo: ${JSON.stringify(fmt(consumoDrogas, r=>`${r.sexo}_${r.consume}`, r=>Number(r.cantidad)))}
- Tipos de drogas: ${JSON.stringify(fmt(tipoDrogas, r=>r.tipo||'otro', r=>Number(r.cantidad)))}
- Alcohol por sexo: ${JSON.stringify(fmt(consumoAlcohol, r=>`${r.sexo}_${r.frecuencia}`, r=>Number(r.cantidad)))}
- Tabaco por sexo: ${JSON.stringify(fmt(consumoTabaco, r=>`${r.sexo}_${r.frecuencia}`, r=>Number(r.cantidad)))}

CRUCES DEPRESIÓN (PHQ-9) × FACTORES: ${JSON.stringify(fmt2d(depresionxFactor, 'factor', 'nivel'))}
CRUCES IDEACIÓN (C-SSRS) × FACTORES: ${JSON.stringify(fmt2d(ideacionxFactor, 'factor', 'nivel'))}

SALUD FÍSICA: ${JSON.stringify(fmt(saludFisica, r=>`${r.campo}_${r.valor}`, r=>Number(r.cantidad)))}
CALIDAD DE SUEÑO: ${JSON.stringify(fmt(calidadSueno, r=>r.nivel, r=>Number(r.cantidad)))}

FACTORES PSICOLÓGICOS: ${JSON.stringify(fmt(factoresPsicologicos, r=>`${r.campo}_${r.valor}`, r=>Number(r.cantidad)))}
IMPULSIVIDAD (promedio): ${JSON.stringify(impulsividad.map(r=>({tipo:r.tipo, promedio:Number(r.promedio)})))}

FACTORES SOCIOECONÓMICOS: ${JSON.stringify(fmt(factoresSocio, r=>`${r.campo}_${r.valor}`, r=>Number(r.cantidad)))}
Apoyo social promedio: ${Number(apoyoSocial[0]?.promedio || 0)}
Satisfacción laboral promedio: ${Number(satisfaccionLaboral[0]?.promedio || 0)}
Estrés laboral promedio: ${Number(estresLaboral[0]?.promedio || 0)}

HISTORIAL DE INTENTOS:
- Total con historial: ${Number(h.total)}
- Con tratamiento psiquiátrico previo: ${Number(h.con_tratamiento)}
- Antecedentes familiares de suicidio: ${Number(h.antecedentes_familiares)}
- Promedio de intentos previos: ${Number(h.promedio_intentos)}
- Métodos más comunes: ${JSON.stringify(fmt(metodosIntento, r=>r.metodo, r=>Number(r.cantidad)))}
`
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        response: "No hay API key configurada. Agrega tu API key de Groq en el archivo `.env`.",
      })
    }

    const contextData = await obtenerContextoBD()
    const model = process.env.OPENAI_MODEL || "llama-3.3-70b-versatile"

    console.log(`[Chat] Llamando a modelo: ${model}`)

    // 1. Respuesta conversacional normal (sin cambios)
    const { text: respuestaNormal } = await generateText({
      model: openai(model),
      system: CHAT_SYSTEM_PROMPT + "\n\n" + contextData,
      prompt: message,
    })

    console.log(`[Chat] Respuesta normal: ${respuestaNormal.length} chars`)

    // 2. Análisis de 4 dimensiones (una sola llamada estructurada)
    const promptAnalisis = `
Eres un analista de datos de salud mental. Debes analizar la PREGUNTA DEL USUARIO usando los DATOS DISPONIBLES.

PREGUNTA DEL USUARIO: "${message}"

DATOS DE LA BASE DE DATOS:
${contextData}

INSTRUCCIÓN CRÍTICA: Cada una de las 4 dimensiones debe responder ESPECÍFICAMENTE a la pregunta del usuario. NO des respuestas genéricas. Usa los datos reales de la base de datos para responder.

Responde EXACTAMENTE con este formato:

###DESCRIPTIVO
Responde a la pregunta del usuario con datos concretos: estadísticas, porcentajes, cantidades, distribuciones. Menciona los números exactos de la base de datos que responden a su pregunta.

###DIAGNOSTICO
Interpreta los datos relacionados con la pregunta: qué significan los resultados, qué escalas clínicas indican, qué factores se relacionan. Explica el por qué detrás de los números.

###PREDICTIVO
Basándote en los datos de la pregunta, ¿qué tendencias se observan? ¿Qué podría ocurrir si no se interviene? ¿Qué patrones sugieren riesgo futuro?

###PRESCRIPTIVO
Dando respuesta concreta a la pregunta: ¿qué acciones se recomiendan? ¿Qué intervenciones aplican? ¿Qué recursos existen? Prioriza por urgencia.

###PREDICTIVO
Basándote en los datos de la pregunta, ¿qué tendencias se observan? ¿Qué podría ocurrir si no se interviene? ¿Qué patrones sugieren riesgo futuro?

###PRESCRIPTIVO
Dando respuesta concreta a la pregunta: ¿qué acciones se recomiendan? ¿Qué intervenciones aplican? ¿Qué recursos existen? Prioriza por urgencia.
`

    const { text: textoAnalisis } = await generateText({
      model: openai(model),
      system: `Eres un analista de datos de salud mental. Genera análisis estructurados en 4 dimensiones. Sé conciso pero completo. Responde SIEMPRE en español.
REGLAS:
- Nunca hagas diagnósticos definitivos
- Sugiere consultar a profesionales
- En riesgo inmediato, prioriza recursos de crisis
- Usa terminología clínica accesible`,
      prompt: promptAnalisis,
    })

    console.log(`[Chat] Análisis generado: ${textoAnalisis.length} chars`)
    console.log(`[Chat] Análisis raw (primeros 500): ${textoAnalisis.substring(0, 500)}`)

    // Parsear las 4 dimensiones del texto
    const analisis = parsearAnalisis(textoAnalisis)

    return NextResponse.json({
      response: respuestaNormal || "No pude generar una respuesta.",
      analisis,
    })
  } catch (error: unknown) {
    console.error("[Chat] Error completo:", error)
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: "Error al procesar el mensaje", details: msg },
      { status: 500 }
    )
  }
}

function parsearAnalisis(texto: string): ChatResponse["analisis"] {
  const normalizar = (t: string) => t.replace(/\r/g, "").trim()

  const extraerSeccion = (textoLimpio: string, marcador: string, siguienteMarcador?: string): string => {
    // Buscar variaciones: ###DESCRIPTIVO, ## DESCRIPTIVO, **DESCRIPTIVO**, DESCRIPTIVO:, etc.
    const variaciones = [
      `${marcador}`,
      `## ${marcador}`,
      `**${marcador}**`,
      `${marcador}:`,
      `${marcador}\n`,
    ]

    for (const v of variaciones) {
      const idx = textoLimpio.indexOf(v)
      if (idx !== -1) {
        const inicio = idx + v.length
        let fin = textoLimpio.length
        if (siguienteMarcador) {
          const sigVariaciones = [
            siguienteMarcador, `## ${siguienteMarcador}`,
            `**${siguienteMarcador}**`, `${siguienteMarcador}:`,
          ]
          for (const sv of sigVariaciones) {
            const idxSig = textoLimpio.indexOf(sv, inicio)
            if (idxSig !== -1 && idxSig < fin) {
              fin = idxSig
            }
          }
        }
        return textoLimpio.substring(inicio, fin).trim()
      }
    }
    return ""
  }

  const textoLimpio = normalizar(texto)

  const descriptivo = extraerSeccion(textoLimpio, "DESCRIPTIVO", "DIAGNOSTICO")
  const diagnostico = extraerSeccion(textoLimpio, "DIAGNOSTICO", "PREDICTIVO")
  const predictivo = extraerSeccion(textoLimpio, "PREDICTIVO", "PRESCRIPTIVO")
  const prescriptivo = extraerSeccion(textoLimpio, "PRESCRIPTIVO")

  // Si el parsing falló, intentar dividir por líneasvacías en 4 partes
  if (!descriptivo && !diagnostico && textoLimpio.length > 100) {
    const partes = textoLimpio.split(/\n{2,}/).filter(p => p.trim().length > 20)
    if (partes.length >= 4) {
      return {
        descriptivo: { titulo: "Análisis Descriptivo", contenido: partes[0].trim() },
        diagnostico: { titulo: "Análisis Diagnóstico", contenido: partes[1].trim() },
        predictivo: { titulo: "Análisis Predictivo", contenido: partes[2].trim() },
        prescriptivo: { titulo: "Análisis Prescriptivo", contenido: partes[3].trim() },
      }
    }
    // Si hay al menos 2 partes, distribuir
    if (partes.length >= 2) {
      const mitad = Math.ceil(partes.length / 2)
      return {
        descriptivo: { titulo: "Análisis Descriptivo", contenido: partes.slice(0, mitad).join("\n\n").trim() },
        diagnostico: { titulo: "Análisis Diagnóstico", contenido: partes.slice(mitad).join("\n\n").trim() },
        predictivo: { titulo: "Análisis Predictivo", contenido: "Consulte los datos descriptivos para tendencias." },
        prescriptivo: { titulo: "Análisis Prescriptivo", contenido: "Consulte a un profesional para recomendaciones específicas." },
      }
    }
  }

  return {
    descriptivo: { titulo: "Análisis Descriptivo", contenido: descriptivo || "Análisis no disponible." },
    diagnostico: { titulo: "Análisis Diagnóstico", contenido: diagnostico || "Análisis no disponible." },
    predictivo: { titulo: "Análisis Predictivo", contenido: predictivo || "Análisis no disponible." },
    prescriptivo: { titulo: "Análisis Prescriptivo", contenido: prescriptivo || "Análisis no disponible." },
  }
}
