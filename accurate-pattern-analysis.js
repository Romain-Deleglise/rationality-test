#!/usr/bin/env node

/**
 * ANALYSE PRÉCISE DES PATTERNS
 * Ne compte QUE les questions qui donnent des points (exclu framing pairs avec points=0.42)
 */

const fs = require('fs');

const testFiles = [
  { path: 'src/data/test-court.json', name: 'Version Courte FR' },
  { path: 'src/data/test-court-en.json', name: 'Version Courte EN' },
  { path: 'src/data/test-complet.json', name: 'Version Complète FR' },
  { path: 'src/data/test-complet-en.json', name: 'Version Complète EN' }
];

console.log('🔍 ANALYSE PRÉCISE DES PATTERNS (Questions qui comptent uniquement)\n');
console.log('═══════════════════════════════════════════════════════════════════════════════════════\n');

const globalStats = {
  multipleChoice: { positions: {}, total: 0 },
  likert: { values: {}, reversePattern: { true: 0, false: 0 }, total: 0 },
  ranking: { rules: [], total: 0 },
  number: { total: 0 },
  confidenceInterval: { total: 0 }
};

const warnings = [];
const errors = [];

testFiles.forEach(({ path, name }) => {
  console.log(`\n📄 ${name}`);
  console.log('─'.repeat(90));

  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  const allQuestions = data.modules.flatMap(m => m.questions);

  // FILTRER: Exclure questions avec points <= 0.5 (framing pairs, opinion questions)
  const scoringQuestions = allQuestions.filter(q => q.points > 0.5);

  console.log(`\nQuestions totales: ${allQuestions.length}`);
  console.log(`Questions qui comptent (points > 0.5): ${scoringQuestions.length}`);
  console.log(`Questions exclues (opinion/framing): ${allQuestions.length - scoringQuestions.length}`);

  // Stats locales
  const stats = {
    multipleChoice: { positions: {}, total: 0 },
    likert: { values: {}, reversePattern: { true: 0, false: 0 }, total: 0 },
  };

  scoringQuestions.forEach(q => {
    // ANALYSE CHOIX MULTIPLES
    if (q.type === 'multiple-choice') {
      const correctIndex = q.correct;
      if (correctIndex !== undefined && correctIndex !== null) {
        stats.multipleChoice.positions[correctIndex] = (stats.multipleChoice.positions[correctIndex] || 0) + 1;
        globalStats.multipleChoice.positions[correctIndex] = (globalStats.multipleChoice.positions[correctIndex] || 0) + 1;
        stats.multipleChoice.total++;
        globalStats.multipleChoice.total++;
      }
    }

    // ANALYSE LIKERT (UNIQUEMENT celles qui comptent)
    if (q.type === 'likert') {
      let expectedAnswer;
      if (q.correct !== undefined && q.correct !== null) {
        expectedAnswer = Number(q.correct);
      } else if (q.reverse !== undefined) {
        expectedAnswer = q.reverse ? 7 : 1;
        stats.likert.reversePattern[q.reverse] = (stats.likert.reversePattern[q.reverse] || 0) + 1;
        globalStats.likert.reversePattern[q.reverse] = (globalStats.likert.reversePattern[q.reverse] || 0) + 1;
      }

      if (expectedAnswer !== undefined) {
        stats.likert.values[expectedAnswer] = (stats.likert.values[expectedAnswer] || 0) + 1;
        globalStats.likert.values[expectedAnswer] = (globalStats.likert.values[expectedAnswer] || 0) + 1;
        stats.likert.total++;
        globalStats.likert.total++;
      }
    }

    // ANALYSE RANKING
    if (q.type === 'ranking') {
      globalStats.ranking.total++;
      if (q.scoring && q.scoring.rule) {
        globalStats.ranking.rules.push(q.scoring.rule);
      } else if (Array.isArray(q.correct)) {
        globalStats.ranking.rules.push(`exact: [${q.correct.join(',')}]`);
      }
    }

    if (q.type === 'number') globalStats.number.total++;
    if (q.type === 'confidence-interval') globalStats.confidenceInterval.total++;
  });

  // Afficher stats locales
  if (stats.multipleChoice.total > 0) {
    console.log(`\n📊 Choix multiples (${stats.multipleChoice.total} questions):`);
    const positions = Object.entries(stats.multipleChoice.positions).sort(([a], [b]) => Number(a) - Number(b));
    positions.forEach(([pos, count]) => {
      const percentage = ((count / stats.multipleChoice.total) * 100).toFixed(1);
      const bar = '█'.repeat(Math.round(count / 2));
      console.log(`   Position ${pos}: ${count.toString().padStart(3)} (${percentage.padStart(5)}%) ${bar}`);
    });
  }

  if (stats.likert.total > 0) {
    console.log(`\n📊 Likert qui comptent (${stats.likert.total} questions):`);
    const values = Object.entries(stats.likert.values).sort(([a], [b]) => Number(a) - Number(b));
    values.forEach(([val, count]) => {
      const percentage = ((count / stats.likert.total) * 100).toFixed(1);
      const bar = '█'.repeat(Math.round(count / 2));
      console.log(`   Valeur ${val}: ${count.toString().padStart(3)} (${percentage.padStart(5)}%) ${bar}`);
    });

    const reverseTrue = stats.likert.reversePattern[true] || 0;
    const reverseFalse = stats.likert.reversePattern[false] || 0;
    if (reverseTrue + reverseFalse > 0) {
      console.log(`\n   Patterns reverse:`);
      console.log(`   - reverse: true  (réponse = 7): ${reverseTrue}`);
      console.log(`   - reverse: false (réponse = 1): ${reverseFalse}`);
    }
  }
});

// ANALYSE GLOBALE
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════\n');
console.log('📊 STATISTIQUES GLOBALES (Questions qui comptent uniquement)\n');

// Choix multiples global
console.log(`\n🎯 Choix multiples (${globalStats.multipleChoice.total} questions):`);
if (globalStats.multipleChoice.total > 0) {
  const globalPositions = Object.entries(globalStats.multipleChoice.positions).sort(([a], [b]) => Number(a) - Number(b));
  globalPositions.forEach(([pos, count]) => {
    const percentage = ((count / globalStats.multipleChoice.total) * 100).toFixed(1);
    const bar = '█'.repeat(Math.round(count / 5));
    console.log(`   Position ${pos}: ${count.toString().padStart(3)} (${percentage.padStart(5)}%) ${bar}`);
  });

  const expectedPerPosition = globalStats.multipleChoice.total / globalPositions.length;
  const chiSquare = globalPositions.reduce((sum, [_, count]) => {
    return sum + Math.pow(count - expectedPerPosition, 2) / expectedPerPosition;
  }, 0);

  console.log(`\n   Test d'uniformité (chi-carré): ${chiSquare.toFixed(2)}`);
  if (chiSquare > 20) {
    warnings.push(`⚠️  Distribution des réponses multiples NON uniforme (chi² = ${chiSquare.toFixed(2)})`);
  } else {
    console.log(`   ✅ Distribution acceptable`);
  }
}

// Likert global
console.log(`\n📊 Likert qui comptent (${globalStats.likert.total} questions):`);
if (globalStats.likert.total > 0) {
  const globalLikertValues = Object.entries(globalStats.likert.values).sort(([a], [b]) => Number(a) - Number(b));
  globalLikertValues.forEach(([val, count]) => {
    const percentage = ((count / globalStats.likert.total) * 100).toFixed(1);
    const bar = '█'.repeat(Math.round(count / 5));
    console.log(`   Valeur ${val}: ${count.toString().padStart(3)} (${percentage.padStart(5)}%) ${bar}`);
  });

  const extremeValues = (globalStats.likert.values[1] || 0) + (globalStats.likert.values[7] || 0);
  const extremePercentage = (extremeValues / globalStats.likert.total) * 100;
  console.log(`\n   Réponses extrêmes (1 ou 7): ${extremePercentage.toFixed(1)}%`);

  if (extremePercentage > 95) {
    errors.push(`❌ PATTERN CRITIQUE: ${extremePercentage.toFixed(1)}% des réponses Likert sont 1 ou 7`);
  } else if (extremePercentage > 80) {
    warnings.push(`⚠️  ${extremePercentage.toFixed(1)}% des réponses Likert sont 1 ou 7`);
  } else {
    console.log(`   ✅ Distribution acceptable (pas trop d'extrêmes)`);
  }
}

// AFFICHAGE FINAL
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════\n');

if (errors.length > 0) {
  console.log('❌ ERREURS CRITIQUES:\n');
  errors.forEach(err => console.log(err));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  AVERTISSEMENTS:\n');
  warnings.forEach(warn => console.log(warn));
  console.log('');
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ PATTERNS ACCEPTABLES !\n');
  console.log('Les distributions sont suffisamment variées pour éviter que les utilisateurs');
  console.log('devinent facilement les bonnes réponses.\n');
}

console.log('═══════════════════════════════════════════════════════════════════════════════════════\n');

process.exit(errors.length > 0 ? 1 : 0);
