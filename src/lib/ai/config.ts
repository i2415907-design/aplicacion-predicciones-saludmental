import path from 'path'

export interface AIConfig {
  provider: 'vertex' | 'gemini' | 'openai'
  vertex: {
    projectId: string
    location: string
    model: string
    maxTokens: number
    temperature: number
    serviceAccountPath?: string
  }
  gemini: {
    apiKey: string
    model: string
    maxTokens: number
    temperature: number
  }
  openai: {
    apiKey: string
    baseUrl: string
    model: string
    maxTokens: number
    temperature: number
  }
}

export function getAIConfig(): AIConfig {
  const provider = (process.env.AI_PROVIDER || 'vertex').toLowerCase() as AIConfig['provider']

  const serviceAccountPathRaw = process.env.VERTEX_SERVICE_ACCOUNT_PATH
  let serviceAccountPath: string | undefined = undefined

  if (serviceAccountPathRaw) {
    if (path.isAbsolute(serviceAccountPathRaw)) {
      serviceAccountPath = serviceAccountPathRaw
    } else {
      serviceAccountPath = path.resolve(/* turbopackIgnore: true */ process.cwd(), serviceAccountPathRaw)
    }
  }

  return {
    provider,
    vertex: {
      projectId: process.env.VERTEX_PROJECT_ID || 'gen-lang-client-0446348073',
      location: process.env.VERTEX_LOCATION || 'global',
      model: process.env.VERTEX_CHAT_MODEL || 'gemini-2.5-flash',
      maxTokens: Number(process.env.VERTEX_CHAT_MAX_TOKENS) || 2048,
      temperature: Number(process.env.VERTEX_CHAT_TEMPERATURE) || 0.2,
      serviceAccountPath,
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY || '',
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      maxTokens: Number(process.env.GEMINI_MAX_TOKENS) || 2048,
      temperature: Number(process.env.GEMINI_TEMPERATURE) || 0.2,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      baseUrl: process.env.OPENAI_BASE_URL || 'https://api.groq.com/openai/v1',
      model: process.env.OPENAI_MODEL || 'llama-3.3-70b-versatile',
      maxTokens: Number(process.env.OPENAI_MAX_TOKENS) || 2048,
      temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.2,
    },
  }
}
