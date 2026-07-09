import Link from "next/link"

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Sistema de BI e IA para Prevención de Depresión y Suicidio
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Plataforma integral que combina inteligencia artificial y análisis de datos
          para comprender, predecir y prevenir la depresión y el suicidio.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Encuesta Clínica</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Formulario de 10 pasos con escalas clínicas validadas (PHQ-9, C-SSRS, BHS, Rosenberg, DASS-21).
          </p>
          <Link
            href="/encuesta"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Iniciar Encuesta
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Dashboard BI</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Visualización de datos históricos, tendencias, análisis de factores de riesgo y distribución poblacional.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Ver Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Chat con IA</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Consultas en lenguaje natural sobre datos de depresión y suicidio, con análisis impulsado por GPT-4.
          </p>
          <Link
            href="/chat"
            className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Abrir Chat
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">¿Por qué este sistema?</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">El Problema</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Más de 720,000 muertes por suicidio anualmente (OMS)</li>
              <li>• 3ra causa de muerte en personas de 15-29 años</li>
              <li>• 73% ocurren en países de ingresos bajos y medianos</li>
              <li>• Factores multifactoriales: depresión, ansiedad, aislamiento</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">La Solución</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• BI para visualizar tendencias y patrones</li>
              <li>• IA para análisis predictivo y prescriptivo</li>
              <li>• Escalas clínicas validadas internacionalmente</li>
              <li>• Chat interactivo para consultas en tiempo real</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
