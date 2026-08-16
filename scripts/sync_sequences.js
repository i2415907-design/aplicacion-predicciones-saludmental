const { Client } = require('pg');
require('dotenv').config();

async function syncSequences() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('🔄 Sincronizando secuencias de PostgreSQL en Supabase...');

  const sequences = [
    { seq: 'encuestas_id_seq', table: 'encuestas' },
    { seq: 'phq9_respuestas_id_seq', table: 'phq9_respuestas' },
    { seq: 'cssrs_respuestas_id_seq', table: 'cssrs_respuestas' },
    { seq: 'bhs_respuestas_id_seq', table: 'bhs_respuestas' },
    { seq: 'rosenberg_respuestas_id_seq', table: 'rosenberg_respuestas' },
    { seq: 'dass21_respuestas_id_seq', table: 'dass21_respuestas' },
    { seq: 'factores_socioeconomicos_id_seq', table: 'factores_socioeconomicos' },
    { seq: 'salud_fisica_id_seq', table: 'salud_fisica' },
    { seq: 'factores_psicologicos_id_seq', table: 'factores_psicologicos' },
    { seq: 'historial_intentos_id_seq', table: 'historial_intentos' },
    { seq: 'notificaciones_id_seq', table: 'notificaciones' },
    { seq: 'usuarios_id_seq', table: 'usuarios' },
    { seq: 'categorias_casos_id_seq', table: 'categorias_casos' },
  ];

  for (const { seq, table } of sequences) {
    try {
      const query = `SELECT setval('${seq}', COALESCE((SELECT MAX(id) FROM ${table}), 1));`;
      const res = await client.query(query);
      console.log(`  ✓ ${seq} sincronizada en: ${res.rows[0].setval}`);
    } catch (e) {
      console.log(`  ⚠️ Secuencia ${seq}: ${e.message}`);
    }
  }

  console.log('✨ Todas las secuencias de Supabase están sincronizadas y listas.');
  await client.end();
}

syncSequences();
