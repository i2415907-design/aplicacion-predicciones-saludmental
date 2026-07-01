import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

async function main() {
  const adminAlias = 'admin'
  const adminPassword = 'admin123'

  const existingAdmin = await prisma.usuario.findUnique({
    where: { alias: adminAlias }
  })

  if (existingAdmin) {
    console.log('Usuario admin ya existe.')
    return
  }

  const admin = await prisma.usuario.create({
    data: {
      alias: adminAlias,
      password: hashPassword(adminPassword),
      tipo: 'admin'
    }
  })

  console.log(`Usuario admin creado: ${admin.alias} (ID: ${admin.id})`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
