const fs = require('fs');

// Charger le fichier JSON
const testData = JSON.parse(fs.readFileSync('src/data/test-complet.json', 'utf8'));
const markdown = fs.readFileSync('questions-test-complet-updated.md', 'utf8');

console.log('=== VÉRIFICATION COMPLÈTE DES PROBLÈMES ===\n');

// 1. Vérifier les points totaux de chaque module
console.log('1. VÉRIFICATION DES POINTS TOTAUX PAR MODULE\n');
testData.modules.forEach(module => {
  const totalPoints = module.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  const declaredPoints = module.points || 0;
  const diff = Math.abs(totalPoints - declaredPoints);

  if (diff > 0.01) {
    console.log(`❌ ${module.name}:`);
    console.log(`   Déclaré: ${declaredPoints} points`);
    console.log(`   Calculé: ${totalPoints.toFixed(2)} points`);
    console.log(`   Différence: ${diff.toFixed(2)}\n`);
  } else {
    console.log(`✓ ${module.name}: ${totalPoints.toFixed(2)} points`);
  }
});

// 2. Vérifier les modules avec scoring par paire
console.log('\n2. MODULES AVEC SCORING PAR PAIRE (framing, argument-eval)\n');

const framingModule = testData.modules.find(m => m.id === 'framing');
if (framingModule) {
  console.log('Module Effets de Cadrage:');
  console.log(`  Total questions: ${framingModule.questions.length}`);
  console.log(`  Questions avec points > 0: ${framingModule.questions.filter(q => q.points > 0).length}`);
  console.log(`  Total points: ${framingModule.questions.reduce((s, q) => s + (q.points || 0), 0)}`);

  // Vérifier les paires
  const pairs = {};
  framingModule.questions.forEach(q => {
    if (q.pairId) {
      if (!pairs[q.pairId]) pairs[q.pairId] = [];
      pairs[q.pairId].push(q);
    }
  });
  console.log(`  Paires détectées: ${Object.keys(pairs).length}`);
  Object.entries(pairs).forEach(([pairId, questions]) => {
    if (questions.length !== 2) {
      console.log(`  ❌ ${pairId} a ${questions.length} questions au lieu de 2`);
    }
  });
}

const argModule = testData.modules.find(m => m.id === 'argument-eval');
if (argModule) {
  console.log('\nModule Évaluation d\'Arguments:');
  console.log(`  Total questions: ${argModule.questions.length}`);
  console.log(`  Questions avec points > 0: ${argModule.questions.filter(q => q.points > 0).length}`);
  console.log(`  Total points: ${argModule.questions.reduce((s, q) => s + (q.points || 0), 0)}`);
}

// 3. Vérifier les questions de coûts irrécupérables
console.log('\n3. QUESTIONS DE COÛTS IRRÉCUPÉRABLES\n');

const sunkModule = testData.modules.find(m => m.id === 'sunk-cost');
if (sunkModule) {
  const sunk1 = sunkModule.questions.find(q => q.id === 'sunk-1');
  const sunk3 = sunkModule.questions.find(q => q.id === 'sunk-3');

  console.log('Question sunk-1 (Concert):');
  console.log(`  Options: ${sunk1.options.join(' | ')}`);
  console.log(`  Réponse correcte actuelle: ${sunk1.correct} (${sunk1.options[sunk1.correct]})`);
  console.log(`  ❌ PROBLÈME: "Essayer de vendre le billet" (option ${sunk1.options.indexOf('Essayer de vendre le billet')}) devrait aussi être correcte\n`);

  console.log('Question sunk-3 (Plat):');
  console.log(`  Options: ${sunk3.options.join(' | ')}`);
  console.log(`  Réponse correcte actuelle: ${sunk3.correct} (${sunk3.options[sunk3.correct]})`);
  console.log(`  ❌ PROBLÈME: "Essayer de corriger le plat" (option ${sunk3.options.indexOf('Essayer de corriger le plat')}) devrait aussi être correcte\n`);
}

// 4. Vérifier la cohérence JSON <-> Markdown
console.log('4. VÉRIFICATION COHÉRENCE JSON <-> MARKDOWN\n');

let mdErrors = 0;
testData.modules.forEach(module => {
  // Vérifier que le module existe dans le markdown
  const modulePattern = new RegExp(`## ${module.name.replace(/[()]/g, '\\$&')}`);
  if (!modulePattern.test(markdown)) {
    console.log(`❌ Module "${module.name}" non trouvé dans le markdown`);
    mdErrors++;
  }

  // Vérifier chaque question
  module.questions.forEach(q => {
    const idPattern = new RegExp(`\\(ID: ${q.id}\\)`);
    if (!idPattern.test(markdown)) {
      console.log(`❌ Question ${q.id} (${module.name}) non trouvée dans le markdown`);
      mdErrors++;
    }
  });
});

if (mdErrors === 0) {
  console.log('✓ Tous les modules et questions du JSON sont dans le markdown');
} else {
  console.log(`\n❌ ${mdErrors} erreurs de cohérence détectées`);
}

// 5. Compter les questions dans le markdown
console.log('\n5. STATISTIQUES DU MARKDOWN\n');

const mdModules = markdown.match(/## .+ \(\d+ items\)/g) || [];
console.log(`Modules trouvés dans le markdown: ${mdModules.length}`);

const mdQuestions = markdown.match(/### Question \d+ \(ID: [^\)]+\)/g) || [];
console.log(`Questions trouvées dans le markdown: ${mdQuestions.length}`);

const totalJsonQuestions = testData.modules.reduce((sum, m) => sum + m.questions.length, 0);
console.log(`Questions dans le JSON: ${totalJsonQuestions}`);

if (mdQuestions.length !== totalJsonQuestions) {
  console.log(`❌ Incohérence: ${totalJsonQuestions - mdQuestions.length} questions manquantes dans le markdown`);
}
