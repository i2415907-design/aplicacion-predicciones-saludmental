/**
 * Script de importación directa a Supabase por bloques para evitar lag o límites de memoria.
 * Lee database/supabase_data_limpia.sql y ejecuta cada bloque con reporte de progreso.
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const sqlPath = path.join(__dirname, '..', 'database', 'supabase_data_limpia.sql');
  
  if (!fs.existsSync(sqlPath)) {
    console.error('❌ No se encontró el archivo:', sqlPath);
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ No se encontró DATABASE_URL en el archivo .env');
    process.exit(1);
  }

  console.log('🔄 Conectando a Supabase...');
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    statement_timeout: 120000, // 2 minutos por bloque
  });

  try {
    await client.connect();
    console.log('✅ Conexión establecida con Supabase con éxito.\n');

    console.log('📖 Leyendo archivo SQL...');
    const fullSql = fs.readFileSync(sqlPath, 'utf8');

    // Dividir en bloques de sentencias INSERT / SELECT / etc.
    const statements = fullSql
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`🚀 Iniciando ejecución de ${statements.length} bloques de sentencias...\n`);

    let ejecutados = 0;
    const inicio = Date.now();

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (!stmt) continue;

      try {
        await client.query(stmt);
        ejecutados++;

        // Mostrar progreso cada 5 bloques o en el último
        if (ejecutados % 5 === 0 || ejecutados === statements.length) {
          const pct = ((ejecutados / statements.length) * 100).toFixed(1);
          const transcurrido = ((Date.now() - inicio) / 1000).toFixed(1);
          process.stdout.write(`\r⏳ Progreso: ${ejecutados}/${statements.length} bloques (${pct}%) en ${transcurrido}s`);
        }
      } catch (err) {
        // Si es un error de BEGIN/COMMIT fuera de transacción no es crítico
        if (stmt.includes('BEGIN') || stmt.includes('COMMIT')) {
          continue;
        }
        console.error(`\n⚠️ Error en bloque ${i + 1}:`, err.message);
      }
    }

    const duracionTotal = ((Date.now() - inicio) / 1000).toFixed(1);
    console.log(`\n\n🎉 ¡Importación masiva completada con éxito en ${duracionTotal} segundos!`);

    // Verificación final rápida de conteos
    console.log('\n📊 Verificando registros en Supabase:');
    const { rows: enc } = await client.query('SELECT COUNT(*) as total FROM encuestas');
    const { rows: phq } = await client.query('SELECT COUNT(*) as total FROM phq9_respuestas');
    const { rows: notif } = await client.query('SELECT COUNT(*) as total FROM notificaciones');

    console.log(`  • Total Encuestas: ${enc[0].total}`);
    console.log(`  • Total PHQ-9: ${phq[0].total}`);
    console.log(`  • Total Notificaciones: ${notif[0].total}`);
    console.log('\n✨ Todo listo para usar la app web y el Dashboard.');

  } catch (error) {
    console.error('❌ Error general durante la importación:', error);
  } finally {
    await client.end();
  }
}

main();
