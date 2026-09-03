import { ToolDeclaration } from '../vertex-provider'

export const CLINICAL_AND_BI_TOOLS: ToolDeclaration[] = [
  {
    name: 'obtenerDetalleCasoPaciente',
    description:
      'HERRAMIENTA CLÍNICA. Obtiene el informe detallado de una encuesta específica por su ID o nombre de paciente: puntajes completos de PHQ-9 (depresión e ítem 9 de suicidio), C-SSRS (ideación e intentos), BHS (desesperanza), DASS-21 (estrés/ansiedad/depresión), Rosenberg (autoestima), salud física, factores de riesgo psicosociales e historial de intentos previos.',
    parameters: {
      type: 'object',
      properties: {
        encuestaId: {
          type: 'integer',
          description: 'ID de la encuesta del paciente.',
        },
        buscarNombre: {
          type: 'string',
          description: 'Nombre o apellido del paciente para buscar su encuesta si no se conoce el ID.',
        },
      },
    },
  },
  {
    name: 'consultarMetricasGeneralesBI',
    description:
      'HERRAMIENTA DE BUSINESS INTELLIGENCE. Retorna estadísticas poblacionales agregadas de las encuestas registradas: total de encuestas, distribución por sexo, rangos de edad, niveles de riesgo calculados (bajo, moderado, alto, muy alto), promedio global de PHQ-9, casos de ideación suicida activa y total de fallecimientos.',
    parameters: {
      type: 'object',
      properties: {
        filtroSexo: {
          type: 'string',
          enum: ['todos', 'masculino', 'femenino', 'otro'],
          description: 'Filtrar métricas por sexo específico.',
        },
        filtroZona: {
          type: 'string',
          enum: ['todas', 'urbana', 'rural'],
          description: 'Filtrar métricas por zona de residencia.',
        },
      },
    },
  },
  {
    name: 'consultarAlertasCriticas',
    description:
      'HERRAMIENTA DE VIGILANCIA EPIDEMIOLÓGICA / TRIAGE. Retorna las notificaciones y alertas clínicas pendientes de atención, filtrando por nivel de gravedad (alto, crítico/muy_alto) o estado de lectura.',
    parameters: {
      type: 'object',
      properties: {
        tipoRiesgo: {
          type: 'string',
          enum: ['todos', 'bajo', 'moderado', 'alto', 'critico'],
          description: 'Nivel de riesgo de la alerta a consultar.',
        },
        soloNoLeidas: {
          type: 'boolean',
          description: 'Si es true, retorna solo las notificaciones aún no revisadas por el equipo clínico.',
        },
        limite: {
          type: 'integer',
          description: 'Cantidad máxima de alertas a retornar (por defecto 10, máx 25).',
        },
      },
    },
  },
  {
    name: 'analizarCrucesFactoresRiesgo',
    description:
      'HERRAMIENTA ANALÍTICA. Analiza la correlación entre severidad de depresión/ideación suicida y factores específicos: consumo de alcohol/drogas, violencia física/psicológica, desempleo reciente, duelo/pérdida familiar o ausencia de red de apoyo social.',
    parameters: {
      type: 'object',
      properties: {
        factor: {
          type: 'string',
          enum: ['drogas', 'alcohol_frecuente', 'violencia', 'desempleo', 'sin_red_apoyo', 'perdida_reciente'],
          description: 'Factor psicosocial o de salud a correlacionar con los puntajes clínicos.',
        },
      },
      required: ['factor'],
    },
  },
  {
    name: 'obtenerProtocoloClinico',
    description:
      'HERRAMIENTA CLÍNICA DE PROTOCOLO. Retorna la guía de intervención clínica y recursos de crisis según el nivel de riesgo detectado (intervención inmediata, contención, líneas de emergencia nacionales 113 / 988, plan de seguridad de Stanley & Brown).',
    parameters: {
      type: 'object',
      properties: {
        nivelRiesgo: {
          type: 'string',
          enum: ['bajo', 'moderado', 'alto', 'muy_alto_emergencia'],
          description: 'Nivel de severidad para el cual se requiere el protocolo clínico.',
        },
      },
      required: ['nivelRiesgo'],
    },
  },
]
