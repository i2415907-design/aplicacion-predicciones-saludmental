const fs = require('fs');
const sql = fs.readFileSync('sistema_ia_postgres.sql', 'utf-8');

// Find where parenDepth gets stuck
let parenDepth = 0;
let inString = false;
let stringChar = null;
let lastParenChange = [];

for (let i = 0; i < Math.min(sql.length, 50000); i++) {
  const ch = sql[i];

  if (inString) {
    if (ch === stringChar && sql[i - 1] !== '\\') {
      inString = false;
    }
    continue;
  }

  if (ch === "'" || ch === '"') {
    inString = true;
    stringChar = ch;
    continue;
  }

  if (ch === '(') {
    parenDepth++;
    if (parenDepth <= 2) {
      lastParenChange.push({ pos: i, type: 'open', depth: parenDepth, context: sql.substring(Math.max(0, i-20), i+5).replace(/\n/g, '\\n') });
    }
    continue;
  }

  if (ch === ')') {
    if (parenDepth <= 2) {
      lastParenChange.push({ pos: i, type: 'close', depth: parenDepth - 1, context: sql.substring(Math.max(0, i-20), i+5).replace(/\n/g, '\\n') });
    }
    parenDepth--;
    continue;
  }
}

console.log('Last paren changes:');
lastParenChange.slice(-20).forEach(p => {
  console.log(`  pos=${p.pos} ${p.type} depth=${p.depth} "${p.context}"`);
});
