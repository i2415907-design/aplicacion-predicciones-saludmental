import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { prisma } from '@/lib/prisma'

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { alias, password } = body

    if (!alias || !password) {
      return NextResponse.json(
        { error: 'Alias y contraseña son requeridos' },
        { status: 400 }
      )
    }

    const usuario = await prisma.usuario.findUnique({
      where: { alias: alias.toLowerCase().trim() }
    })

    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    const hashedPassword = hashPassword(password)
    if (usuario.password !== hashedPassword) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      success: true,
      usuario: {
        id: usuario.id,
        alias: usuario.alias,
        tipo: usuario.tipo
      }
    })

    // Set cookie for session
    response.cookies.set('session', JSON.stringify({
      id: usuario.id,
      alias: usuario.alias,
      tipo: usuario.tipo
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
