#!/usr/bin/env node

const fs = require('fs');

const testFiles = [
  { path: 'src/data/test-complet.json', name: 'Version Complète FR' },
  { path: 'src/data/test-complet-en.json', name: 'Version Complète EN' }
];

console.log('📝 VÉRIFICATION DES EXPLICATIONS\n');
console.log('═══════════════════════════════════════════════════════════════════════════════════════\n');

testFiles.forEach(({ path, name }) => {
  console.log(`\n${name}:`);
  console.log('─'.repeat(90));

  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  const allQ = data.modules.flatMap(m => m.questions);
  const noExpl = allQ.filter(q => q.points > 0.5 && (!q.explanation || q.explanation.trim() === ''));

  console.log(`Questions avec points > 0.5 SANS explication: ${noExpl.length}\n`);

  noExpl.forEach(q => {
    console.log(`  ${q.id} (type: ${q.type}, points: ${q.points})`);
    console.log(`    Texte: ${q.text.substring(0, 80)}...`);
    console.log('');
  });

  if (noExpl.length === 0) {
    console.log('  ✅ Toutes les questions ont des explications');
  }
});

console.log('═══════════════════════════════════════════════════════════════════════════════════════\n');
