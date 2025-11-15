#!/usr/bin/env node

/**
 * CORRECTION AUTOMATIQUE DES INCOHÉRENCES DE POINTS
 * Recalcule et corrige les points des modules et totaux
 */

const fs = require('fs');

const testFiles = [
  'src/data/test-court.json',
  'src/data/test-court-en.json',
  'src/data/test-complet.json',
  'src/data/test-complet-en.json'
];

console.log('🔧 CORRECTION DES INCOHÉRENCES DE POINTS\n');
console.log('═══════════════════════════════════════════════════════════════════════════════════════\n');

testFiles.forEach(filePath => {
  console.log(`\n📄 ${filePath}`);
  console.log('─'.repeat(90));

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let modified = false;

  // CORRECTION 1: Recalculer les points de chaque module
  data.modules.forEach(module => {
    const calculatedPoints = module.questions.reduce((sum, q) => {
      return sum + (q.points || 0);
    }, 0);

    const roundedPoints = Math.round(calculatedPoints * 100) / 100;

    if (Math.abs(module.points - roundedPoints) > 0.01) {
      console.log(`  Module ${module.id}:`);
      console.log(`    Avant: ${module.points} points`);
      console.log(`    Après: ${roundedPoints} points (calculé)`);
      module.points = roundedPoints;
      modified = true;
    }
  });

  // CORRECTION 2: Recalculer totalPoints
  const calculatedTotal = data.modules.reduce((sum, m) => sum + m.points, 0);
  const roundedTotal = Math.round(calculatedTotal * 100) / 100;

  if (Math.abs(data.totalPoints - roundedTotal) > 0.01) {
    console.log(`  totalPoints:`);
    console.log(`    Avant: ${data.totalPoints} points`);
    console.log(`    Après: ${roundedTotal} points (calculé)`);
    data.totalPoints = roundedTotal;
    modified = true;
  }

  // CORRECTION 3: Nettoyer les "correct: null" explicites
  let nullCorrectedCount = 0;
  data.modules.forEach(module => {
    module.questions.forEach(q => {
      if (q.correct === null) {
        delete q.correct;
        nullCorrectedCount++;
        console.log(`  Question ${q.id}: Suppression de "correct: null"`);
        modified = true;
      }
    });
  });

  if (nullCorrectedCount > 0) {
    console.log(`  ${nullCorrectedCount} question(s) avec "correct: null" corrigées`);
  }

  if (modified) {
    // Sauvegarder avec indentation cohérente
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`  ✅ Fichier sauvegardé`);
  } else {
    console.log(`  ✅ Aucune modification nécessaire`);
  }
});

console.log('\n═══════════════════════════════════════════════════════════════════════════════════════\n');
console.log('✅ Corrections terminées\n');
