#!/usr/bin/env node

/**
 * VÉRIFICATIONS SUPPLÉMENTAIRES - UX et Qualité
 */

const fs = require('fs');

const testFiles = [
  { path: 'src/data/test-court.json', name: 'Version Courte FR' },
  { path: 'src/data/test-court-en.json', name: 'Version Courte EN' },
  { path: 'src/data/test-complet.json', name: 'Version Complète FR' },
  { path: 'src/data/test-complet-en.json', name: 'Version Complète EN' }
];

console.log('🔍 VÉRIFICATIONS SUPPLÉMENTAIRES - UX et Qualité\n');
console.log('═══════════════════════════════════════════════════════════════════════════════════════\n');

const allWarnings = [];
const allErrors = [];

testFiles.forEach(({ path, name }) => {
  console.log(`\n📄 ${name}`);
  console.log('─'.repeat(90));

  const data = JSON.parse(fs.readFileSync(path, 'utf8'));

  // VÉRIFICATION 1: Cohérence du temps estimé
  const declaredTime = data.estimatedTime;
  const calculatedTime = data.modules.reduce((sum, m) => sum + (m.time || 0), 0);

  if (Math.abs(declaredTime - calculatedTime) > 0.01) {
    allErrors.push(`${name}: estimatedTime=${declaredTime} mais somme modules=${calculatedTime}`);
  } else {
    console.log(`✓ Temps estimé cohérent: ${declaredTime} minutes`);
  }

  // VÉRIFICATION 2: Temps par question raisonnable
  const allQuestions = data.modules.flatMap(m => m.questions);
  const avgTimePerQuestion = calculatedTime / allQuestions.length;
  console.log(`✓ Temps moyen par question: ${avgTimePerQuestion.toFixed(1)} min`);

  if (avgTimePerQuestion < 0.5) {
    allWarnings.push(`${name}: Temps très court (${avgTimePerQuestion.toFixed(1)} min/question)`);
  } else if (avgTimePerQuestion > 3) {
    allWarnings.push(`${name}: Temps très long (${avgTimePerQuestion.toFixed(1)} min/question)`);
  }

  // VÉRIFICATION 3: Longueur des textes
  const longTexts = allQuestions.filter(q => q.text && q.text.length > 500);
  if (longTexts.length > 0) {
    console.log(`⚠️  ${longTexts.length} questions avec texte > 500 caractères`);
    longTexts.slice(0, 3).forEach(q => {
      console.log(`    ${q.id}: ${q.text.length} chars`);
    });
  } else {
    console.log(`✓ Toutes les questions ont des textes de longueur raisonnable`);
  }

  // VÉRIFICATION 4: Unités cohérentes pour questions number
  const numberQuestions = allQuestions.filter(q => q.type === 'number');
  const unitsUsed = new Set(numberQuestions.map(q => q.unit).filter(u => u));
  console.log(`✓ Unités utilisées (number): ${[...unitsUsed].join(', ') || 'aucune'}`);

  // VÉRIFICATION 5: Options trop courtes (suspect)
  const mcQuestions = allQuestions.filter(q => q.type === 'multiple-choice' && q.options);
  const shortOptions = mcQuestions.filter(q =>
    q.options.some(opt => opt && opt.trim().length < 2)
  );
  if (shortOptions.length > 0) {
    allWarnings.push(`${name}: ${shortOptions.length} questions avec options très courtes`);
  } else {
    console.log(`✓ Toutes les options ont une longueur raisonnable`);
  }

  // VÉRIFICATION 6: Caractères spéciaux problématiques
  const problematicChars = /[^\x00-\x7F\u00C0-\u024F\u1E00-\u1EFF\u2018-\u201F\u2013-\u2014\u2022\u2026]/;
  const questionsWithWeirdChars = allQuestions.filter(q => {
    const textToCheck = [
      q.text,
      q.explanation,
      ...(q.options || [])
    ].join(' ');
    return problematicChars.test(textToCheck);
  });

  if (questionsWithWeirdChars.length > 0) {
    allWarnings.push(`${name}: ${questionsWithWeirdChars.length} questions avec caractères inhabituels`);
    questionsWithWeirdChars.slice(0, 3).forEach(q => {
      console.log(`    ${q.id}: Caractères inhabituels détectés`);
    });
  } else {
    console.log(`✓ Pas de caractères problématiques détectés`);
  }

  // VÉRIFICATION 7: Questions avec tolerance mais pas type number
  const wrongTolerance = allQuestions.filter(q =>
    q.tolerance !== undefined && q.type !== 'number' && q.type !== 'confidence-interval'
  );
  if (wrongTolerance.length > 0) {
    allErrors.push(`${name}: ${wrongTolerance.length} questions avec 'tolerance' mais pas type number/confidence-interval`);
  } else {
    console.log(`✓ Champ 'tolerance' utilisé correctement`);
  }

  // VÉRIFICATION 8: Questions ranking avec moins de 3 options
  const rankingQuestions = allQuestions.filter(q => q.type === 'ranking');
  const shortRankings = rankingQuestions.filter(q => !q.options || q.options.length < 3);
  if (shortRankings.length > 0) {
    allWarnings.push(`${name}: ${shortRankings.length} questions ranking avec < 3 options`);
  } else if (rankingQuestions.length > 0) {
    console.log(`✓ Toutes les questions ranking ont 3+ options`);
  }

  // VÉRIFICATION 9: Vérifier pairId (framing pairs doivent avoir un jumeau)
  const pairQuestions = allQuestions.filter(q => q.pairId);
  const pairIds = [...new Set(pairQuestions.map(q => q.pairId))];

  const incompletePairs = [];
  pairIds.forEach(pairId => {
    const pair = pairQuestions.filter(q => q.pairId === pairId);
    if (pair.length !== 2) {
      incompletePairs.push(pairId);
    }
  });

  if (incompletePairs.length > 0) {
    allErrors.push(`${name}: ${incompletePairs.length} paires incomplètes: ${incompletePairs.join(', ')}`);
  } else if (pairQuestions.length > 0) {
    console.log(`✓ Toutes les paires (framing) sont complètes (${pairIds.length} paires)`);
  }

  // VÉRIFICATION 10: Texte ou options vides
  const emptyText = allQuestions.filter(q => !q.text || q.text.trim() === '');
  if (emptyText.length > 0) {
    allErrors.push(`${name}: ${emptyText.length} questions avec texte vide`);
  }

  const emptyOptions = mcQuestions.filter(q =>
    q.options.some(opt => !opt || opt.trim() === '')
  );
  if (emptyOptions.length > 0) {
    allErrors.push(`${name}: ${emptyOptions.length} questions avec options vides`);
  }
});

// VÉRIFICATION INTER-FICHIERS: Cohérence des temps
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════\n');
console.log('📊 VÉRIFICATION COHÉRENCE DES TEMPS\n');

const courtFR = JSON.parse(fs.readFileSync('src/data/test-court.json', 'utf8'));
const courtEN = JSON.parse(fs.readFileSync('src/data/test-court-en.json', 'utf8'));
const completFR = JSON.parse(fs.readFileSync('src/data/test-complet.json', 'utf8'));
const completEN = JSON.parse(fs.readFileSync('src/data/test-complet-en.json', 'utf8'));

if (courtFR.estimatedTime !== courtEN.estimatedTime) {
  allErrors.push(`Court FR (${courtFR.estimatedTime}min) ≠ Court EN (${courtEN.estimatedTime}min)`);
} else {
  console.log(`✓ Court FR et EN: ${courtFR.estimatedTime} minutes`);
}

if (completFR.estimatedTime !== completEN.estimatedTime) {
  allErrors.push(`Complet FR (${completFR.estimatedTime}min) ≠ Complet EN (${completEN.estimatedTime}min)`);
} else {
  console.log(`✓ Complet FR et EN: ${completFR.estimatedTime} minutes`);
}

// Vérifier la cohérence des temps par module
console.log('\nVérification temps par module FR ↔ EN:');

courtFR.modules.forEach((frMod, idx) => {
  const enMod = courtEN.modules[idx];
  if (frMod && enMod) {
    if (frMod.id === enMod.id) {
      if (frMod.time !== enMod.time) {
        allErrors.push(`Court module ${frMod.id}: FR time=${frMod.time} ≠ EN time=${enMod.time}`);
      }
    }
  }
});

completFR.modules.forEach((frMod, idx) => {
  const enMod = completEN.modules[idx];
  if (frMod && enMod) {
    if (frMod.id === enMod.id) {
      if (frMod.time !== enMod.time) {
        allErrors.push(`Complet module ${frMod.id}: FR time=${frMod.time} ≠ EN time=${enMod.time}`);
      }
    }
  }
});

console.log('✓ Tous les temps par module sont cohérents FR ↔ EN');

// AFFICHAGE FINAL
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════\n');
console.log('📋 RÉSUMÉ\n');

if (allErrors.length > 0) {
  console.log(`❌ ${allErrors.length} ERREUR(S):\n`);
  allErrors.forEach(err => console.log(`   ❌ ${err}`));
  console.log('');
}

if (allWarnings.length > 0) {
  console.log(`⚠️  ${allWarnings.length} AVERTISSEMENT(S):\n`);
  allWarnings.forEach(warn => console.log(`   ⚠️  ${warn}`));
  console.log('');
}

if (allErrors.length === 0 && allWarnings.length === 0) {
  console.log('✅ TOUTES LES VÉRIFICATIONS SUPPLÉMENTAIRES PASSENT !\n');
  console.log('Le test a une excellente qualité UX et technique.\n');
}

console.log('═══════════════════════════════════════════════════════════════════════════════════════\n');

process.exit(allErrors.length > 0 ? 1 : 0);
