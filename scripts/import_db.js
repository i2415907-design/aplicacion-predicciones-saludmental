#!/usr/bin/env node
/**
 * Import PostgreSQL dump into Supabase.
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const connectionString = process.argv[2];
  const sqlFile = process.argv[3] || 'sistema_ia_postgres.sql';

  if (!connectionString) {
    console.error('Usage: node import_db.js "CONNECTION_STRING" SQL_FILE');
    process.exit(1);
  }

  console.log(`SQL file: ${sqlFile}`);

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected!\n');

    const sql = fs.readFileSync(path.resolve(sqlFile), 'utf-8');

    // Split by semicolons followed by newline
    const rawParts = sql.split(/;\s*\r?\n/);

    // Clean each part: remove leading comment lines, keep the actual SQL
    const statements = rawParts
      .map(p => {
        // Remove leading comment lines (lines starting with --)
        const lines = p.split('\n');
        const sqlLines = lines.filter(l => !l.trim().startsWith('--'));
        return sqlLines.join('\n').trim();
      })
      .filter(p => p.length > 0)
      .map(p => p.endsWith(';') ? p : p + ';');

    console.log(`Found ${statements.length} statements\n`);

    let success = 0;
    let errors = 0;

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const firstLine = stmt.split('\n')[0].substring(0, 80);

      try {
        await client.query(stmt);
        success++;
        if (stmt.startsWith('CREATE TABLE') || success % 50 === 0) {
          console.log(`[${success}] OK: ${firstLine}`);
        }
      } catch (err) {
        errors++;
        if (errors <= 10) {
          console.error(`[ERROR] ${err.message.substring(0, 80)}`);
          console.error(`  ${firstLine}`);
        }
      }
    }

    console.log(`\nDone! Success: ${success}, Errors: ${errors}`);
  } catch (err) {
    console.error('Connection error:', err.message);
  } finally {
    await client.end();
  }
}

main();
