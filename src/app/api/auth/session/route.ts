import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')

  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    return NextResponse.json({
      authenticated: true,
      usuario: session
    })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
