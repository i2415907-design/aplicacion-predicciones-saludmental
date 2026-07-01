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

    if (alias.length < 3) {
      return NextResponse.json(
        { error: 'El alias debe tener al menos 3 caracteres' },
        { status: 400 }
      )
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 4 caracteres' },
        { status: 400 }
      )
    }

    // Check if alias already exists
    const existing = await prisma.usuario.findUnique({
      where: { alias: alias.toLowerCase().trim() }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Este alias ya está en uso. Elige otro.' },
        { status: 409 }
      )
    }

    // Create user
    const usuario = await prisma.usuario.create({
      data: {
        alias: alias.toLowerCase().trim(),
        password: hashPassword(password),
        tipo: 'usuario'
      }
    })

    return NextResponse.json({
      success: true,
      usuario: {
        id: usuario.id,
        alias: usuario.alias,
        tipo: usuario.tipo
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
