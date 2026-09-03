import fs from 'fs'
import crypto from 'crypto'

interface TokenCache {
  token: string
  expiresAt: number
}

let cachedToken: TokenCache | null = null

export class VertexAuth {
  /**
   * Codifica un string o buffer a Base64URL (RFC 7515)
   */
  private static base64Url(data: string | Buffer): string {
    const base64 = Buffer.isBuffer(data)
      ? data.toString('base64')
      : Buffer.from(data, 'utf8').toString('base64')

    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }

  /**
   * Obtiene un Access Token de Google Cloud mediante el flujo de cuenta de servicio (JWT -> OAuth2).
   * El token se cachea durante 50 minutos (expira en 60 minutos en Google Cloud).
   */
  public static async obtenerAccessToken(serviceAccountPath?: string): Promise<string | null> {
    if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
      return null
    }

    const now = Math.floor(Date.now() / 1000)

    // Si ya existe un token en memoria válido por al menos 5 minutos más, reusarlo
    if (cachedToken && cachedToken.expiresAt > now + 300) {
      return cachedToken.token
    }

    try {
      const fileContent = fs.readFileSync(serviceAccountPath, 'utf8')
      const json = JSON.parse(fileContent)

      if (!json.client_email || !json.private_key) {
        console.error('[VertexAuth] Archivo JSON de Service Account inválido: falta client_email o private_key')
        return null
      }

      const clientEmail = json.client_email
      const privateKey = json.private_key

      const header = { alg: 'RS256', typ: 'JWT' }
      const claims = {
        iss: clientEmail,
        scope: 'https://www.googleapis.com/auth/cloud-platform',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
      }

      const base64Header = this.base64Url(JSON.stringify(header))
      const base64Claims = this.base64Url(JSON.stringify(claims))
      const signingInput = `${base64Header}.${base64Claims}`

      const signer = crypto.createSign('RSA-SHA256')
      signer.update(signingInput)
      signer.end()

      const signature = signer.sign(privateKey)
      const base64Signature = this.base64Url(signature)

      const jwt = `${signingInput}.${base64Signature}`

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[VertexAuth] Error obteniendo Access Token de Google OAuth2:', errorText)
        return null
      }

      const tokenData = await response.json()
      const accessToken = tokenData.access_token

      if (accessToken) {
        cachedToken = {
          token: accessToken,
          expiresAt: now + 3600,
        }
        return accessToken
      }

      return null
    } catch (error) {
      console.error('[VertexAuth] Excepción al generar Access Token:', error)
      return null
    }
  }
}
