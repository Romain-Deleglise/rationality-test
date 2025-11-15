#!/usr/bin/env node

/**
 * ANALYSE AVANCÉE DES PATTERNS
 * Détecte les patterns prévisibles qui permettraient de deviner les réponses
 */

const fs = require('fs');

const testFiles = [
  { path: 'src/data/test-court.json', name: 'Version Courte FR' },
  { path: 'src/data/test-court-en.json', name: 'Version Courte EN' },
  { path: 'src/data/test-complet.json', name: 'Version Complète FR' },
  { path: 'src/data/test-complet-en.json', name: 'Version Complète EN' }
];

console.log('🔍 ANALYSE AVANCÉE DES PATTERNS PRÉVISIBLES\n');
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

  // Stats locales
  const stats = {
    multipleChoice: { positions: {}, total: 0 },
    likert: { values: {}, reversePattern: { true: 0, false: 0 }, total: 0 },
    ranking: { total: 0 },
    totalQuestions: allQuestions.length
  };

  allQuestions.forEach(q => {
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

    // ANALYSE LIKERT
    if (q.type === 'likert') {
      // Calculer la "bonne réponse" attendue
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
      stats.ranking.total++;
      globalStats.ranking.total++;

      if (q.scoring && q.scoring.rule) {
        globalStats.ranking.rules.push(q.scoring.rule);
      } else if (Array.isArray(q.correct)) {
        globalStats.ranking.rules.push(`exact: [${q.correct.join(',')}]`);
      }
    }

    // ANALYSE NUMBER
    if (q.type === 'number') {
      globalStats.number.total++;
    }

    // ANALYSE CONFIDENCE-INTERVAL
    if (q.type === 'confidence-interval') {
      globalStats.confidenceInterval.total++;
    }
  });

  // Afficher stats locales
  console.log(`\n📊 Choix multiples (${stats.multipleChoice.total} questions):`);
  if (stats.multipleChoice.total > 0) {
    const positions = Object.entries(stats.multipleChoice.positions)
      .sort(([a], [b]) => Number(a) - Number(b));

    positions.forEach(([pos, count]) => {
      const percentage = ((count / stats.multipleChoice.total) * 100).toFixed(1);
      const bar = '█'.repeat(Math.round(count / 2));
      console.log(`   Position ${pos}: ${count.toString().padStart(3)} (${percentage.padStart(5)}%) ${bar}`);
    });

    // Vérifier si un pattern dominant existe
    const maxCount = Math.max(...Object.values(stats.multipleChoice.positions));
    const maxPercentage = (maxCount / stats.multipleChoice.total) * 100;

    if (maxPercentage > 50) {
      warnings.push(`⚠️  ${name}: ${maxPercentage.toFixed(1)}% des réponses sont à la même position !`);
    }
  }

  console.log(`\n📊 Likert (${stats.likert.total} questions):`);
  if (stats.likert.total > 0) {
    const values = Object.entries(stats.likert.values)
      .sort(([a], [b]) => Number(a) - Number(b));

    values.forEach(([val, count]) => {
      const percentage = ((count / stats.likert.total) * 100).toFixed(1);
      const bar = '█'.repeat(Math.round(count / 2));
      console.log(`   Valeur ${val}: ${count.toString().padStart(3)} (${percentage.padStart(5)}%) ${bar}`);
    });

    // Vérifier pattern reverse
    const reverseTrue = stats.likert.reversePattern[true] || 0;
    const reverseFalse = stats.likert.reversePattern[false] || 0;
    if (reverseTrue > 0 || reverseFalse > 0) {
      console.log(`\n   Patterns reverse:`);
      console.log(`   - reverse: true  (réponse = 7): ${reverseTrue}`);
      console.log(`   - reverse: false (réponse = 1): ${reverseFalse}`);

      // Vérifier déséquilibre
      const total = reverseTrue + reverseFalse;
      if (total > 0) {
        const truePercentage = (reverseTrue / total) * 100;
        if (truePercentage > 70 || truePercentage < 30) {
          warnings.push(`⚠️  ${name}: Déséquilibre dans les questions Likert (${truePercentage.toFixed(1)}% reverse:true)`);
        }
      }
    }
  }

  console.log(`\n📊 Ranking (${stats.ranking.total} questions)`);
  console.log(`📊 Number (${globalStats.number.total} questions dans tout le test)`);
  console.log(`📊 Confidence-interval (${globalStats.confidenceInterval.total} questions dans tout le test)`);
});

// ANALYSE GLOBALE
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════\n');
console.log('📊 STATISTIQUES GLOBALES (TOUTES VERSIONS CONFONDUES)\n');

// Choix multiples global
console.log(`\n🎯 Choix multiples (${globalStats.multipleChoice.total} questions au total):`);
const globalPositions = Object.entries(globalStats.multipleChoice.positions)
  .sort(([a], [b]) => Number(a) - Number(b));

globalPositions.forEach(([pos, count]) => {
  const percentage = ((count / globalStats.multipleChoice.total) * 100).toFixed(1);
  const bar = '█'.repeat(Math.round(count / 5));
  console.log(`   Position ${pos}: ${count.toString().padStart(3)} (${percentage.padStart(5)}%) ${bar}`);
});

// Test chi-carré simple pour uniformité
const expectedPerPosition = globalStats.multipleChoice.total / globalPositions.length;
const chiSquare = globalPositions.reduce((sum, [_, count]) => {
  return sum + Math.pow(count - expectedPerPosition, 2) / expectedPerPosition;
}, 0);

console.log(`\n   Test d'uniformité (chi-carré): ${chiSquare.toFixed(2)}`);
if (chiSquare > 20) {
  warnings.push(`⚠️  Distribution des réponses multiples NON uniforme (chi² = ${chiSquare.toFixed(2)})`);
} else {
  console.log(`   ✅ Distribution relativement uniforme (pas de pattern évident)`);
}

// Likert global
console.log(`\n📊 Likert (${globalStats.likert.total} questions au total):`);
const globalLikertValues = Object.entries(globalStats.likert.values)
  .sort(([a], [b]) => Number(a) - Number(b));

globalLikertValues.forEach(([val, count]) => {
  const percentage = ((count / globalStats.likert.total) * 100).toFixed(1);
  const bar = '█'.repeat(Math.round(count / 5));
  console.log(`   Valeur ${val}: ${count.toString().padStart(3)} (${percentage.padStart(5)}%) ${bar}`);
});

// Vérifier si toujours 1 ou 7
const extremeValues = (globalStats.likert.values[1] || 0) + (globalStats.likert.values[7] || 0);
const extremePercentage = (extremeValues / globalStats.likert.total) * 100;
console.log(`\n   Réponses extrêmes (1 ou 7): ${extremePercentage.toFixed(1)}%`);
if (extremePercentage > 95) {
  errors.push(`❌ PATTERN CRITIQUE: ${extremePercentage.toFixed(1)}% des réponses Likert sont 1 ou 7 (trop prévisible !)`);
} else if (extremePercentage > 80) {
  warnings.push(`⚠️  ${extremePercentage.toFixed(1)}% des réponses Likert sont 1 ou 7 (peut-être prévisible)`);
}

// Ranking patterns
console.log(`\n📊 Ranking (${globalStats.ranking.total} questions au total):`);
console.log(`   Types de règles détectées: ${globalStats.ranking.rules.length}`);

// Vérifier si toutes les règles sont identiques
const uniqueRulePatterns = new Set();
globalStats.ranking.rules.forEach(rule => {
  // Extraire le pattern (ex: "option-X > option-Y")
  const pattern = rule.replace(/\d+/g, 'N');
  uniqueRulePatterns.add(pattern);
});

console.log(`   Patterns uniques: ${uniqueRulePatterns.size}`);
uniqueRulePatterns.forEach(pattern => {
  console.log(`     - ${pattern}`);
});

if (uniqueRulePatterns.size === 1) {
  warnings.push(`⚠️  Toutes les questions ranking utilisent le même type de règle (prévisible)`);
}

// AFFICHAGE DES AVERTISSEMENTS ET ERREURS
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════\n');

if (errors.length > 0) {
  console.log('❌ ERREURS CRITIQUES DÉTECTÉES:\n');
  errors.forEach(err => console.log(err));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  AVERTISSEMENTS:\n');
  warnings.forEach(warn => console.log(warn));
  console.log('');
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ AUCUN PATTERN PRÉVISIBLE DÉTECTÉ !\n');
  console.log('Les réponses sont suffisamment distribuées pour éviter que les utilisateurs');
  console.log('puissent deviner les bonnes réponses par pattern.\n');
}

console.log('═══════════════════════════════════════════════════════════════════════════════════════\n');

// Exit code
process.exit(errors.length > 0 ? 1 : 0);
