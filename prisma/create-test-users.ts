import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

async function main() {
  const testUsers = [
    { alias: 'mariposa_123', password: 'test123' },
    { alias: 'estrella_456', password: 'test123' },
    { alias: 'luna_789', password: 'test123' },
  ]

  for (const user of testUsers) {
    const existing = await prisma.usuario.findUnique({
      where: { alias: user.alias }
    })

    if (!existing) {
      const created = await prisma.usuario.create({
        data: {
          alias: user.alias,
          password: hashPassword(user.password),
          tipo: 'usuario'
        }
      })
      console.log(`Usuario creado: ${created.alias} (ID: ${created.id})`)
    } else {
      console.log(`Usuario ${user.alias} ya existe.`)
    }
  }

  // Vincular algunas encuestas existentes a usuarios de prueba
  const encuestas = await prisma.encuesta.findMany({
    where: { usuarioId: null },
    take: 3,
    orderBy: { id: 'asc' }
  })

  const usuarios = await prisma.usuario.findMany({
    where: { tipo: 'usuario' }
  })

  for (let i = 0; i < encuestas.length && i < usuarios.length; i++) {
    await prisma.encuesta.update({
      where: { id: encuestas[i].id },
      data: { usuarioId: usuarios[i].id }
    })
    console.log(`Encuesta ${encuestas[i].id} vinculada a usuario ${usuarios[i].alias}`)
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
