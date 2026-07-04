"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BarraProgreso } from "@/components/encuesta/BarraProgreso"
import { PreguntaEscala } from "@/components/encuesta/PreguntaEscala"
import { PreguntaSeleccion } from "@/components/encuesta/PreguntaSeleccion"
import { PreguntaSiNo } from "@/components/encuesta/PreguntaSiNo"
import { PreguntaCheckbox } from "@/components/encuesta/PreguntaCheckbox"

const PASOS = [
  "Demográficos",
  "Depresión (PHQ-9)",
  "Ideación Suicida",
  "Desesperanza",
  "Autoestima",
  "Regulación Emocional",
  "Socioeconómico",
  "Relaciones",
  "Salud Física",
  "Eventos Vitales",
]

interface FormData {
  // Paso 1: Demográficos (opcionales excepto edad y sexo)
  nombre: string
  apellido: string
  edad: number
  sexo: string
  estadoCivil: string
  nivelEducativo: string
  ocupacion: string
  ingresoMensual: string
  zonaResidencia: string
  estadoUsuario: string
  mostrarDatosAdicionales: boolean
  // Paso 2: PHQ-9
  phq9: {
    interesActividades: number
    estadoAnimo: number
    sueno: number
    energia: number
    apetito: number
    autoestima: number
    concentracion: number
    psicomotricidad: number
    ideacionSuicida: number
  }
  // Paso 3: C-SSRS
  cssrs: {
    deseosMorir: boolean
    pensamientosSuicidas: boolean
    metodoSinPlan: boolean
    intencionSinPlan: boolean
    planEspecifico: boolean
    intencionEjecutar: boolean
    intentoPrevio: boolean
  }
  // Paso 4: BHS
  bhs: boolean[]
  // Paso 5: Rosenberg
  rosenberg: number[]
  // Paso 6: DASS-21
  dass21: number[]
  // Paso 7: Socioeconómico
  socioeconomicos: {
    estadoLaboral: string
    satisfaccionLaboral: number
    estresLaboral: number
    nivelDeudas: string
    dificultadEconomica: boolean
    calidadVivienda: number
  }
  // Paso 8: Relaciones
  relaciones: {
    calidadRelacionesFamiliares: number
    apoyoSocialPercibido: number
    numPersonasConfianza: number
    viveSolo: boolean
    seSienteSolo: number
  }
  // Paso 9: Salud Física
  saludFisica: {
    enfermedadCronica: boolean
    dolorCronico: boolean
    calidadSueno: number
    horasSuenoPromedio: number
    insomnio: boolean
    consumeAlcohol: boolean
    frecuenciaAlcohol: string
    consumeTabaco: boolean
    frecuenciaTabaco: string
    consumeDrogas: boolean
    tipoDrogas: string
  }
  // Paso 10: Eventos Vitales
  psicologicos: {
    eventos: string[]
    tieneRedApoyo: boolean
    percibeVidaConSentido: boolean
    haBuscadoAyudaProfesional: boolean
  }
}

const initialFormData: FormData = {
  nombre: "",
  apellido: "",
  edad: 25,
  sexo: "",
  estadoCivil: "",
  nivelEducativo: "",
  ocupacion: "",
  ingresoMensual: "",
  zonaResidencia: "",
  estadoUsuario: "vivo",
  mostrarDatosAdicionales: false,
  phq9: {
    interesActividades: 0,
    estadoAnimo: 0,
    sueno: 0,
    energia: 0,
    apetito: 0,
    autoestima: 0,
    concentracion: 0,
    psicomotricidad: 0,
    ideacionSuicida: 0,
  },
  cssrs: {
    deseosMorir: false,
    pensamientosSuicidas: false,
    metodoSinPlan: false,
    intencionSinPlan: false,
    planEspecifico: false,
    intencionEjecutar: false,
    intentoPrevio: false,
  },
  bhs: Array(20).fill(false),
  rosenberg: Array(10).fill(2),
  dass21: Array(21).fill(0),
  socioeconomicos: {
    estadoLaboral: "",
    satisfaccionLaboral: 3,
    estresLaboral: 3,
    nivelDeudas: "",
    dificultadEconomica: false,
    calidadVivienda: 3,
  },
  relaciones: {
    calidadRelacionesFamiliares: 3,
    apoyoSocialPercibido: 3,
    numPersonasConfianza: 0,
    viveSolo: false,
    seSienteSolo: 3,
  },
  saludFisica: {
    enfermedadCronica: false,
    dolorCronico: false,
    calidadSueno: 3,
    horasSuenoPromedio: 7,
    insomnio: false,
    consumeAlcohol: false,
    frecuenciaAlcohol: "nunca",
    consumeTabaco: false,
    frecuenciaTabaco: "nunca",
    consumeDrogas: false,
    tipoDrogas: "",
  },
  psicologicos: {
    eventos: [],
    tieneRedApoyo: true,
    percibeVidaConSentido: true,
    haBuscadoAyudaProfesional: false,
  },
}

export default function EncuestaPage() {
  const router = useRouter()
  const [pasoActual, setPasoActual] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updatePHQ9 = (campo: keyof FormData["phq9"], valor: number) => {
    setFormData((prev) => ({
      ...prev,
      phq9: { ...prev.phq9, [campo]: valor },
    }))
  }

  const updateCSSRS = (campo: keyof FormData["cssrs"], valor: boolean) => {
    setFormData((prev) => ({
      ...prev,
      cssrs: { ...prev.cssrs, [campo]: valor },
    }))
  }

  const updateBHS = (index: number, valor: boolean) => {
    setFormData((prev) => {
      const newBHS = [...prev.bhs]
      newBHS[index] = valor
      return { ...prev, bhs: newBHS }
    })
  }

  const updateRosenberg = (index: number, valor: number) => {
    setFormData((prev) => {
      const newRosenberg = [...prev.rosenberg]
      newRosenberg[index] = valor
      return { ...prev, rosenberg: newRosenberg }
    })
  }

  const updateDASS21 = (index: number, valor: number) => {
    setFormData((prev) => {
      const newDASS21 = [...prev.dass21]
      newDASS21[index] = valor
      return { ...prev, dass21: newDASS21 }
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Get user session
      let usuarioId = null
      try {
        const sessionRes = await fetch("/api/auth/session")
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json()
          if (sessionData.authenticated) {
            usuarioId = sessionData.usuario.id
          }
        }
      } catch {
        // Not logged in, continue without user ID
      }

      const submitData = {
        ...formData,
        usuarioId,
      }

      const response = await fetch("/api/encuesta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })
      if (response.ok) {
        const result = await response.json()
        router.push(`/encuesta/${result.id}`)
      }
    } catch (error) {
      console.error("Error al enviar encuesta:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderPaso = () => {
    switch (pasoActual) {
      case 0: // Demográficos
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Datos Demográficos</h3>
            <p className="text-sm text-gray-500">
              Solo edad y género son requeridos. Los demás datos son opcionales y ayudan a un mejor análisis.
            </p>
            
            {/* Campos opcionales de identificación */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <p className="text-sm font-medium text-gray-700">Información opcional de identificación</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nombre (opcional)</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Tu nombre"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Apellido (opcional)</label>
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    placeholder="Tu apellido"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Campos requeridos */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuál es su edad? *
              </label>
              <select
                value={formData.edad}
                onChange={(e) => setFormData({ ...formData, edad: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                {Array.from({ length: 91 }, (_, i) => i + 10).map((age) => (
                  <option key={age} value={age}>{age} años</option>
                ))}
              </select>
            </div>
            <PreguntaSeleccion
              label="¿Con qué género se identifica? *"
              value={formData.sexo}
              onChange={(v) => setFormData({ ...formData, sexo: v })}
              options={[
                { value: "masculino", label: "Masculino" },
                { value: "femenino", label: "Femenino" },
                { value: "no_binario", label: "No binario" },
                { value: "otro", label: "Otro" },
              ]}
            />

            {/* Sección expandible de datos adicionales */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mostrarDatosAdicionales: !formData.mostrarDatosAdicionales })}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  ¿Quieres agregar más datos? (opcional)
                </span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${formData.mostrarDatosAdicionales ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {formData.mostrarDatosAdicionales && (
                <div className="p-4 space-y-4 bg-white">
                  <p className="text-xs text-gray-500">
                    Estos datos son completamente opcionales y ayudan a un análisis más preciso.
                  </p>
                  <PreguntaSeleccion
                    label="Estado civil"
                    value={formData.estadoCivil}
                    onChange={(v) => setFormData({ ...formData, estadoCivil: v })}
                    options={[
                      { value: "soltero", label: "Soltero(a)" },
                      { value: "casado", label: "Casado(a)" },
                      { value: "divorciado", label: "Divorciado(a)" },
                      { value: "viudo", label: "Viudo(a)" },
                      { value: "union_libre", label: "Unión libre" },
                    ]}
                  />
                  <PreguntaSeleccion
                    label="Nivel educativo"
                    value={formData.nivelEducativo}
                    onChange={(v) => setFormData({ ...formData, nivelEducativo: v })}
                    options={[
                      { value: "primaria", label: "Primaria" },
                      { value: "secundaria", label: "Secundaria" },
                      { value: "tecnico", label: "Técnico" },
                      { value: "universitario", label: "Universitario" },
                      { value: "posgrado", label: "Posgrado" },
                    ]}
                  />
                  <PreguntaSeleccion
                    label="Situación laboral"
                    value={formData.socioeconomicos.estadoLaboral}
                    onChange={(v) => setFormData({
                      ...formData,
                      socioeconomicos: { ...formData.socioeconomicos, estadoLaboral: v }
                    })}
                    options={[
                      { value: "empleado", label: "Empleado" },
                      { value: "desempleado", label: "Desempleado" },
                      { value: "estudiante", label: "Estudiante" },
                      { value: "jubilado", label: "Jubilado" },
                      { value: "ama_casa", label: "Ama de casa" },
                    ]}
                  />
                  <PreguntaSeleccion
                    label="Rango de ingresos"
                    value={formData.ingresoMensual}
                    onChange={(v) => setFormData({ ...formData, ingresoMensual: v })}
                    options={[
                      { value: "menos_1_smlv", label: "Menos de 1 SMLV" },
                      { value: "1_2_smlv", label: "1-2 SMLV" },
                      { value: "2_4_smlv", label: "2-4 SMLV" },
                      { value: "4_8_smlv", label: "4-8 SMLV" },
                      { value: "mas_8_smlv", label: "Más de 8 SMLV" },
                    ]}
                  />
                  <PreguntaSeleccion
                    label="Zona de residencia"
                    value={formData.zonaResidencia}
                    onChange={(v) => setFormData({ ...formData, zonaResidencia: v })}
                    options={[
                      { value: "urbana", label: "Urbana" },
                      { value: "rural", label: "Rural" },
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
        )

      case 1: // PHQ-9
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">PHQ-9: Escala de Depresión</h3>
              <p className="text-sm text-gray-600">
                Durante las últimas 2 semanas, ¿con qué frecuencia le han molestado los siguientes problemas?
              </p>
              <p className="text-xs text-gray-500 mt-2">
                0 = Nada en absoluto | 1 = Varios días | 2 = Más de la mitad | 3 = Casi todos los días
              </p>
            </div>
            <PreguntaEscala label="1. Poco interés o placer en hacer cosas" value={formData.phq9.interesActividades} onChange={(v) => updatePHQ9("interesActividades", v)} min={0} max={3} />
            <PreguntaEscala label="2. Sentirse deprimido, triste o sin esperanza" value={formData.phq9.estadoAnimo} onChange={(v) => updatePHQ9("estadoAnimo", v)} min={0} max={3} />
            <PreguntaEscala label="3. Dificultad para dormir o dormir demasiado" value={formData.phq9.sueno} onChange={(v) => updatePHQ9("sueno", v)} min={0} max={3} />
            <PreguntaEscala label="4. Sentirse cansado o sin energía" value={formData.phq9.energia} onChange={(v) => updatePHQ9("energia", v)} min={0} max={3} />
            <PreguntaEscala label="5. Poco apetito o comer en exceso" value={formData.phq9.apetito} onChange={(v) => updatePHQ9("apetito", v)} min={0} max={3} />
            <PreguntaEscala label="6. Sentirse mal consigo mismo o sentir que es un fracaso" value={formData.phq9.autoestima} onChange={(v) => updatePHQ9("autoestima", v)} min={0} max={3} />
            <PreguntaEscala label="7. Dificultad para concentrarse en actividades" value={formData.phq9.concentracion} onChange={(v) => updatePHQ9("concentracion", v)} min={0} max={3} />
            <PreguntaEscala label="8. Moverse o hablar lentamente, o estar agitado" value={formData.phq9.psicomotricidad} onChange={(v) => updatePHQ9("psicomotricidad", v)} min={0} max={3} />
            <PreguntaEscala label="9. Pensamientos de que sería mejor estar muerto o de hacerse daño" value={formData.phq9.ideacionSuicida} onChange={(v) => updatePHQ9("ideacionSuicida", v)} min={0} max={3} />
          </div>
        )

      case 2: // C-SSRS
        return (
          <div className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">C-SSRS: Columbia Suicide Severity Rating Scale</h3>
              <p className="text-sm text-gray-600">
                Evaluación de ideación y comportamiento suicida
              </p>
            </div>
            <PreguntaSiNo label="1. ¿Ha deseado estar muerto o haber ido a dormir y no despertar?" value={formData.cssrs.deseosMorir} onChange={(v) => updateCSSRS("deseosMorir", v)} />
            <PreguntaSiNo label="2. ¿Ha tenido pensamientos de quitarse la vida?" value={formData.cssrs.pensamientosSuicidas} onChange={(v) => updateCSSRS("pensamientosSuicidas", v)} />
            {formData.cssrs.pensamientosSuicidas && (
              <>
                <PreguntaSiNo label="2a. ¿Ha pensado en cómo podría hacerlo?" value={formData.cssrs.metodoSinPlan} onChange={(v) => updateCSSRS("metodoSinPlan", v)} />
                <PreguntaSiNo label="2b. ¿Ha tenido esos pensamientos con intención de actuar?" value={formData.cssrs.intencionSinPlan} onChange={(v) => updateCSSRS("intencionSinPlan", v)} />
                <PreguntaSiNo label="2c. ¿Ha elaborado un plan específico e intención de ejecutarlo?" value={formData.cssrs.planEspecifico} onChange={(v) => updateCSSRS("planEspecifico", v)} />
              </>
            )}
            <PreguntaSiNo label="3. ¿Ha hecho algo o se ha preparado para terminar con su vida?" value={formData.cssrs.intentoPrevio} onChange={(v) => updateCSSRS("intentoPrevio", v)} />
          </div>
        )

      case 3: // BHS
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">BHS: Escala de Desesperanza de Beck</h3>
              <p className="text-sm text-gray-600">
                Para cada afirmación, indique si <strong>Sí</strong> o <strong>No</strong> se aplica a cómo se siente HOY
              </p>
            </div>
            {[
              "Me siento triste",
              "Estoy especialmente desanimado con el futuro",
              "Siento que nada tiene sentido",
              "No puedo imaginar que mi futuro sea mejor",
              "No tengo expectativas de cambiar lo peor",
              "No tengo ganas de intentar lograr mis metas",
              "Mi futuro es incierto",
              "No espero obtener lo que quiero",
              "No veo razón para continuar",
              "Mi vida carece de propósito",
              "No tengo esperanza",
              "Me siento un fracaso",
              "No he sido exitoso",
              "No merezco una vida buena",
              "Mi futuro es sombrío",
              "No puedo cambiar nada",
              "No valgo nada",
              "No puedo hacer nada",
              "No hay nada que esperar",
              "El futuro es incierto",
            ].map((texto, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-800 mb-2">{`${index + 1}. ${texto}`}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateBHS(index, false)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.bhs[index] === false
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => updateBHS(index, true)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.bhs[index] === true
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Sí
                  </button>
                </div>
              </div>
            ))}
          </div>
        )

      case 4: // Rosenberg
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Escala de Autoestima de Rosenberg</h3>
              <p className="text-sm text-gray-600">
                1 = Totalmente de acuerdo | 2 = De acuerdo | 3 = En desacuerdo | 4 = Totalmente en desacuerdo
              </p>
            </div>
            {[
              "Me siento bien conmigo mismo",
              "Tengo tendencia a sentirme fracasado",
              "Siento que tengo varias cualidades",
              "Soy capaz de hacer cosas tan bien como la mayoría",
              "Siento que no tengo mucho de qué estar orgulloso",
              "Me acepto a mí mismo",
              "Definitivamente me quiero a mí mismo",
              "Me siento inútil en muchos momentos",
              "Siento que soy una persona valiosa, al menos a la par de otros",
              "Me sería difícil estar más satisfecho conmigo mismo",
            ].map((texto, index) => (
              <PreguntaEscala
                key={index}
                label={`${index + 1}. ${texto}`}
                value={formData.rosenberg[index]}
                onChange={(v) => updateRosenberg(index, v)}
                min={1}
                max={4}
              />
            ))}
          </div>
        )

      case 5: // DASS-21
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">DASS-21: Depresión, Ansiedad y Estrés</h3>
              <p className="text-sm text-gray-600">
                Por favor lea cada afirmación y seleccione cuánto le ha ocurrido durante la semana pasada
              </p>
              <p className="text-xs text-gray-500 mt-2">
                0 = No / En absoluto | 1 = Algo / Parte del tiempo | 2 = Mucho / Buena parte del tiempo | 3 = Enormemente / Casi todo el tiempo
              </p>
            </div>
            {[
              "No puedo calmarme",
              "Me resulta difícil relajarme",
              "Me siento tenso/a",
              "Sufro por insomnio",
              "Me resulta difícil disfrutar de las cosas",
              "Me siento irritable",
              "Piero la tolerancia hacia mí mismo y los demás",
              "Siento que me cuesta iniciar actividades",
              "Temo que pueda suceder algo terrible",
              "Me siento asustado/a",
              "No puedo encontrar ningún sentido a mi vida",
              "Me siento abrumado/a",
              "No puedo soportar tener cosas nuevas que hacer",
              "Me siento inquieto/a",
              "No me resulta fácil relajarme",
              "Me siento triste y deprimido/a",
              "Me resulta tolerar cualquier interrupción de mis planes",
              "Siento que soy una persona muy sensible",
              "Me siento que no valgo nada",
              "Siento que he perdido el control de mi vida",
              "Siento que la vida no tiene sentido",
            ].map((texto, index) => (
              <PreguntaEscala
                key={index}
                label={`${index + 1}. ${texto}`}
                value={formData.dass21[index]}
                onChange={(v) => updateDASS21(index, v)}
                min={0}
                max={3}
              />
            ))}
          </div>
        )

      case 6: // Socioeconómico
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Situación Socioeconómica</h3>
            <PreguntaSeleccion
              label="¿Cuál es su nivel de deudas?"
              value={formData.socioeconomicos.nivelDeudas}
              onChange={(v) => setFormData({
                ...formData,
                socioeconomicos: { ...formData.socioeconomicos, nivelDeudas: v }
              })}
              options={[
                { value: "sin_deudas", label: "Sin deudas" },
                { value: "bajo", label: "Bajo" },
                { value: "medio", label: "Medio" },
                { value: "alto", label: "Alto" },
                { value: "muy_alto", label: "Muy alto" },
              ]}
            />
            <PreguntaSiNo
              label="¿Tiene dificultades económicas para cubrir necesidades básicas?"
              value={formData.socioeconomicos.dificultadEconomica}
              onChange={(v) => setFormData({
                ...formData,
                socioeconomicos: { ...formData.socioeconomicos, dificultadEconomica: v }
              })}
            />
            <PreguntaEscala
              label="¿Cuán satisfecho está con su trabajo?"
              value={formData.socioeconomicos.satisfaccionLaboral}
              onChange={(v) => setFormData({
                ...formData,
                socioeconomicos: { ...formData.socioeconomicos, satisfaccionLaboral: v }
              })}
              min={1}
              max={5}
              minLabel="Nada satisfecho"
              maxLabel="Muy satisfecho"
            />
            <PreguntaEscala
              label="¿Cuánto estrés laboral percibe?"
              value={formData.socioeconomicos.estresLaboral}
              onChange={(v) => setFormData({
                ...formData,
                socioeconomicos: { ...formData.socioeconomicos, estresLaboral: v }
              })}
              min={1}
              max={5}
              minLabel="Nada de estrés"
              maxLabel="Mucho estrés"
            />
            <PreguntaEscala
              label="¿Cómo califica su vivienda?"
              value={formData.socioeconomicos.calidadVivienda}
              onChange={(v) => setFormData({
                ...formData,
                socioeconomicos: { ...formData.socioeconomicos, calidadVivienda: v }
              })}
              min={1}
              max={5}
              minLabel="Muy mala"
              maxLabel="Excelente"
            />
          </div>
        )

      case 7: // Relaciones
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Relaciones y Apoyo Social</h3>
            <PreguntaEscala
              label="¿Cómo califica la calidad de sus relaciones familiares?"
              value={formData.relaciones.calidadRelacionesFamiliares}
              onChange={(v) => setFormData({
                ...formData,
                relaciones: { ...formData.relaciones, calidadRelacionesFamiliares: v }
              })}
              min={1}
              max={5}
              minLabel="Muy malas"
              maxLabel="Excelentes"
            />
            <PreguntaEscala
              label="¿Cuánto apoyo social percibe?"
              value={formData.relaciones.apoyoSocialPercibido}
              onChange={(v) => setFormData({
                ...formData,
                relaciones: { ...formData.relaciones, apoyoSocialPercibido: v }
              })}
              min={1}
              max={5}
              minLabel="Nada de apoyo"
              maxLabel="Mucho apoyo"
            />
            <PreguntaEscala
              label="¿Cuántas personas de confianza tiene?"
              value={formData.relaciones.numPersonasConfianza}
              onChange={(v) => setFormData({
                ...formData,
                relaciones: { ...formData.relaciones, numPersonasConfianza: v }
              })}
              min={0}
              max={10}
            />
            <PreguntaSiNo
              label="¿Vive solo(a)?"
              value={formData.relaciones.viveSolo}
              onChange={(v) => setFormData({
                ...formData,
                relaciones: { ...formData.relaciones, viveSolo: v }
              })}
            />
            <PreguntaEscala
              label="¿Se siente solo(a)?"
              value={formData.relaciones.seSienteSolo}
              onChange={(v) => setFormData({
                ...formData,
                relaciones: { ...formData.relaciones, seSienteSolo: v }
              })}
              min={1}
              max={5}
              minLabel="Nada solo"
              maxLabel="Muy solo"
            />
          </div>
        )

      case 8: // Salud Física
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Salud Física y Consumo de Sustancias</h3>
            <PreguntaSiNo
              label="¿Tiene alguna enfermedad crónica diagnosticada?"
              value={formData.saludFisica.enfermedadCronica}
              onChange={(v) => setFormData({
                ...formData,
                saludFisica: { ...formData.saludFisica, enfermedadCronica: v }
              })}
            />
            <PreguntaSiNo
              label="¿Experimenta dolor crónico?"
              value={formData.saludFisica.dolorCronico}
              onChange={(v) => setFormData({
                ...formData,
                saludFisica: { ...formData.saludFisica, dolorCronico: v }
              })}
            />
            <PreguntaEscala
              label="¿Cómo califica la calidad de su sueño?"
              value={formData.saludFisica.calidadSueno}
              onChange={(v) => setFormData({
                ...formData,
                saludFisica: { ...formData.saludFisica, calidadSueno: v }
              })}
              min={1}
              max={5}
              minLabel="Muy mala"
              maxLabel="Excelente"
            />
            <PreguntaEscala
              label="¿Cuántas horas duerme en promedio por noche?"
              value={formData.saludFisica.horasSuenoPromedio}
              onChange={(v) => setFormData({
                ...formData,
                saludFisica: { ...formData.saludFisica, horasSuenoPromedio: v }
              })}
              min={0}
              max={12}
            />
            <PreguntaSiNo
              label="¿Tiene dificultades para conciliar el sueño?"
              value={formData.saludFisica.insomnio}
              onChange={(v) => setFormData({
                ...formData,
                saludFisica: { ...formData.saludFisica, insomnio: v }
              })}
            />
            <PreguntaSiNo
              label="¿Consume alcohol?"
              value={formData.saludFisica.consumeAlcohol}
              onChange={(v) => setFormData({
                ...formData,
                saludFisica: { ...formData.saludFisica, consumeAlcohol: v }
              })}
            />
            {formData.saludFisica.consumeAlcohol && (
              <PreguntaSeleccion
                label="¿Con qué frecuencia consume alcohol?"
                value={formData.saludFisica.frecuenciaAlcohol}
                onChange={(v) => setFormData({
                  ...formData,
                  saludFisica: { ...formData.saludFisica, frecuenciaAlcohol: v }
                })}
                options={[
                  { value: "ocasional", label: "Ocasional" },
                  { value: "moderado", label: "Moderado" },
                  { value: "frecuente", label: "Frecuente" },
                  { value: "diario", label: "Diario" },
                ]}
              />
            )}
            <PreguntaSiNo
              label="¿Consume tabaco?"
              value={formData.saludFisica.consumeTabaco}
              onChange={(v) => setFormData({
                ...formData,
                saludFisica: { ...formData.saludFisica, consumeTabaco: v }
              })}
            />
            <PreguntaSiNo
              label="¿Consume drogas ilícitas?"
              value={formData.saludFisica.consumeDrogas}
              onChange={(v) => setFormData({
                ...formData,
                saludFisica: { ...formData.saludFisica, consumeDrogas: v }
              })}
            />
          </div>
        )

      case 9: // Eventos Vitales
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Eventos Vitales y Factores Psicológicos</h3>
            <PreguntaCheckbox
              label="Marque todas las situaciones que haya experimentado en los últimos 12 meses:"
              options={[
                { value: "perdida_familiar", label: "Pérdida de un ser querido" },
                { value: "violencia_fisica", label: "Violencia física" },
                { value: "violencia_psicologica", label: "Violencia psicológica/maltrato" },
                { value: "abuso_sexual", label: "Abuso sexual" },
                { value: "bullying", label: "Bullying o ciberbullying" },
                { value: "desempleo", label: "Desempleo o pérdida de empleo" },
                { value: "ruptura_pareja", label: "Ruptura de relación sentimental" },
                { value: "problemas_legales", label: "Problemas legales" },
                { value: "enfermedad_grave", label: "Enfermedad grave propia" },
                { value: "problemas_pareja", label: "Problemas graves de pareja/familia" },
              ]}
              selectedValues={formData.psicologicos.eventos}
              onChange={(v) => setFormData({
                ...formData,
                psicologicos: { ...formData.psicologicos, eventos: v }
              })}
            />
            <PreguntaSiNo
              label="¿Cuenta con una red de apoyo que pueda ayudarle en momentos difíciles?"
              value={formData.psicologicos.tieneRedApoyo}
              onChange={(v) => setFormData({
                ...formData,
                psicologicos: { ...formData.psicologicos, tieneRedApoyo: v }
              })}
            />
            <PreguntaSiNo
              label="¿Percibe que su vida tiene sentido o propósito?"
              value={formData.psicologicos.percibeVidaConSentido}
              onChange={(v) => setFormData({
                ...formData,
                psicologicos: { ...formData.psicologicos, percibeVidaConSentido: v }
              })}
            />
            <PreguntaSiNo
              label="¿Ha buscado ayuda profesional de salud mental?"
              value={formData.psicologicos.haBuscadoAyudaProfesional}
              onChange={(v) => setFormData({
                ...formData,
                psicologicos: { ...formData.psicologicos, haBuscadoAyudaProfesional: v }
              })}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Encuesta de Evaluación</h1>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        Formulario de evaluación multidimensional para la prevención de depresión y suicidio
      </p>

      <BarraProgreso pasoActual={pasoActual} totalPasos={PASOS.length} pasos={PASOS} />

      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-6 overflow-hidden">
        {renderPaso()}
      </div>

      <div className="flex justify-between gap-2">
        <button
          type="button"
          onClick={() => setPasoActual(Math.max(0, pasoActual - 1))}
          disabled={pasoActual === 0}
          className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        {pasoActual < PASOS.length - 1 ? (
          <button
            type="button"
            onClick={() => setPasoActual(Math.min(PASOS.length - 1, pasoActual + 1))}
            className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Siguiente
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? "Enviando..." : "Enviar Encuesta"}
          </button>
        )}
      </div>
    </div>
  )
}
