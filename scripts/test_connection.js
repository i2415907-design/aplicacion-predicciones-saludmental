const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const encuestas = await prisma.$queryRawUnsafe('SELECT COUNT(*) as total FROM encuestas');
    console.log('Encuestas:', encuestas[0].total);

    const usuarios = await prisma.$queryRawUnsafe('SELECT COUNT(*) as total FROM usuarios');
    console.log('Usuarios:', usuarios[0].total);

    const phq9 = await prisma.$queryRawUnsafe('SELECT COUNT(*) as total FROM phq9_respuestas');
    console.log('PHQ9:', phq9[0].total);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
