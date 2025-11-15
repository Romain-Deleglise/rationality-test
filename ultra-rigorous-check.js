#!/usr/bin/env node

/**
 * VÉRIFICATION ULTRA-RIGOUREUSE
 * Détecte les incohérences logiques, erreurs de données, et problèmes subtils
 */

const fs = require('fs');

const testFiles = [
  { path: 'src/data/test-court.json', name: 'Version Courte FR' },
  { path: 'src/data/test-court-en.json', name: 'Version Courte EN' },
  { path: 'src/data/test-complet.json', name: 'Version Complète FR' },
  { path: 'src/data/test-complet-en.json', name: 'Version Complète EN' }
];

console.log('🔬 VÉRIFICATION ULTRA-RIGOUREUSE\n');
console.log('═══════════════════════════════════════════════════════════════════════════════════════\n');

const allErrors = [];
const allWarnings = [];
const allInfo = [];

testFiles.forEach(({ path, name }) => {
  console.log(`\n📄 ${name}`);
  console.log('─'.repeat(90));

  const data = JSON.parse(fs.readFileSync(path, 'utf8'));

  // VÉRIFICATION 1: Structure du fichier
  if (!data.version) {
    allErrors.push(`${name}: Pas de champ 'version'`);
  }

  if (!data.totalPoints || typeof data.totalPoints !== 'number') {
    allErrors.push(`${name}: 'totalPoints' manquant ou invalide`);
  }

  if (!data.modules || !Array.isArray(data.modules)) {
    allErrors.push(`${name}: 'modules' manquant ou pas un tableau`);
    return;
  }

  // VÉRIFICATION 2: Cohérence des points totaux
  const calculatedPoints = data.modules.reduce((sum, m) => {
    if (!m.points || typeof m.points !== 'number') {
      allErrors.push(`${name}: Module ${m.id} n'a pas de points définis`);
      return sum;
    }
    return sum + m.points;
  }, 0);

  if (Math.abs(calculatedPoints - data.totalPoints) > 0.01) {
    allErrors.push(`${name}: totalPoints=${data.totalPoints} mais somme modules=${calculatedPoints.toFixed(2)}`);
  } else {
    console.log(`✓ Points totaux cohérents: ${data.totalPoints}`);
  }

  // VÉRIFICATION 3: Cohérence des points par module
  data.modules.forEach(module => {
    if (!module.questions || !Array.isArray(module.questions)) {
      allErrors.push(`${name}: Module ${module.id} n'a pas de questions`);
      return;
    }

    const moduleCalculatedPoints = module.questions.reduce((sum, q) => {
      if (q.points === undefined || q.points === null) {
        allErrors.push(`${name}: Question ${q.id} dans module ${module.id} n'a pas de points`);
        return sum;
      }
      return sum + q.points;
    }, 0);

    if (Math.abs(moduleCalculatedPoints - module.points) > 0.01) {
      allErrors.push(`${name}: Module ${module.id}: points=${module.points} mais somme questions=${moduleCalculatedPoints.toFixed(2)}`);
    }
  });

  console.log(`✓ Points par module cohérents`);

  // VÉRIFICATION 4: IDs uniques
  const allQuestions = data.modules.flatMap(m => m.questions);
  const questionIds = allQuestions.map(q => q.id);
  const uniqueIds = new Set(questionIds);

  if (questionIds.length !== uniqueIds.size) {
    const duplicates = questionIds.filter((id, index) => questionIds.indexOf(id) !== index);
    allErrors.push(`${name}: IDs dupliqués: ${[...new Set(duplicates)].join(', ')}`);
  } else {
    console.log(`✓ Tous les IDs sont uniques (${questionIds.length} questions)`);
  }

  // VÉRIFICATION 5: Cohérence multiple-choice
  const mcQuestions = allQuestions.filter(q => q.type === 'multiple-choice');
  mcQuestions.forEach(q => {
    if (!q.options || !Array.isArray(q.options)) {
      allErrors.push(`${name}: Question ${q.id} (multiple-choice) n'a pas d'options`);
      return;
    }

    if (q.options.length === 0) {
      allErrors.push(`${name}: Question ${q.id} (multiple-choice) a 0 options`);
      return;
    }

    if (q.correct === undefined || q.correct === null) {
      // Les questions de framing pairs n'ont pas de "bonne réponse"
      if (q.points > 0 && !q.pairId) {
        allErrors.push(`${name}: Question ${q.id} (multiple-choice) n'a pas de réponse correcte`);
      }
      return;
    }

    if (q.correct < 0 || q.correct >= q.options.length) {
      allErrors.push(`${name}: Question ${q.id} (multiple-choice) correct=${q.correct} hors limites (${q.options.length} options)`);
    }

    // Vérifier que les options ne sont pas vides
    q.options.forEach((opt, i) => {
      if (!opt || opt.trim() === '') {
        allErrors.push(`${name}: Question ${q.id} option ${i} est vide`);
      }
    });
  });

  console.log(`✓ Questions multiple-choice vérifiées (${mcQuestions.length})`);

  // VÉRIFICATION 6: Cohérence number
  const numberQuestions = allQuestions.filter(q => q.type === 'number');
  numberQuestions.forEach(q => {
    if (q.correct === undefined || q.correct === null) {
      if (q.points > 0) {
        allErrors.push(`${name}: Question ${q.id} (number) n'a pas de réponse correcte`);
      }
      return;
    }

    const correctNum = Number(q.correct);
    if (isNaN(correctNum)) {
      allErrors.push(`${name}: Question ${q.id} (number) correct='${q.correct}' n'est pas un nombre`);
    }

    if (q.tolerance !== undefined && q.tolerance !== null) {
      const tol = Number(q.tolerance);
      if (isNaN(tol) || tol < 0) {
        allErrors.push(`${name}: Question ${q.id} (number) tolerance='${q.tolerance}' invalide`);
      }
    }
  });

  console.log(`✓ Questions number vérifiées (${numberQuestions.length})`);

  // VÉRIFICATION 7: Cohérence likert
  const likertQuestions = allQuestions.filter(q => q.type === 'likert');
  likertQuestions.forEach(q => {
    // Vérifier qu'il y a soit 'correct' soit 'reverse'
    const hasCorrect = q.correct !== undefined && q.correct !== null;
    const hasReverse = q.reverse !== undefined && q.reverse !== null;
    const isOpinion = q.points === 0 || q.points <= 0.5;

    if (!hasCorrect && !hasReverse && !isOpinion) {
      allErrors.push(`${name}: Question ${q.id} (likert) n'a ni 'correct' ni 'reverse' (points=${q.points})`);
    }

    if (hasCorrect) {
      const correctNum = Number(q.correct);
      if (isNaN(correctNum) || correctNum < 1 || correctNum > 7) {
        allErrors.push(`${name}: Question ${q.id} (likert) correct=${q.correct} invalide (doit être 1-7)`);
      }
    }

    if (hasReverse && typeof q.reverse !== 'boolean') {
      allErrors.push(`${name}: Question ${q.id} (likert) reverse='${q.reverse}' n'est pas un boolean`);
    }
  });

  console.log(`✓ Questions likert vérifiées (${likertQuestions.length})`);

  // VÉRIFICATION 8: Cohérence ranking
  const rankingQuestions = allQuestions.filter(q => q.type === 'ranking');
  rankingQuestions.forEach(q => {
    if (!q.options || !Array.isArray(q.options)) {
      allErrors.push(`${name}: Question ${q.id} (ranking) n'a pas d'options`);
      return;
    }

    const hasCorrectArray = Array.isArray(q.correct) && q.correct.length > 0;
    const hasScoringRule = q.scoring && q.scoring.rule;

    if (!hasCorrectArray && !hasScoringRule && q.points > 0) {
      allErrors.push(`${name}: Question ${q.id} (ranking) n'a ni 'correct' ni 'scoring.rule'`);
    }

    if (hasCorrectArray) {
      // Vérifier que tous les indices sont valides
      q.correct.forEach(idx => {
        if (typeof idx !== 'number' || idx < 0 || idx >= q.options.length) {
          allErrors.push(`${name}: Question ${q.id} (ranking) correct contient index ${idx} invalide`);
        }
      });
    }

    if (hasScoringRule) {
      const rule = q.scoring.rule;
      const match = rule.match(/option-(\d+)\s*>\s*option-(\d+)/);
      if (!match) {
        allWarnings.push(`${name}: Question ${q.id} (ranking) scoring.rule='${rule}' format non reconnu`);
      } else {
        const idx1 = parseInt(match[1], 10);
        const idx2 = parseInt(match[2], 10);
        if (idx1 < 0 || idx1 >= q.options.length) {
          allErrors.push(`${name}: Question ${q.id} (ranking) rule contient option-${idx1} invalide`);
        }
        if (idx2 < 0 || idx2 >= q.options.length) {
          allErrors.push(`${name}: Question ${q.id} (ranking) rule contient option-${idx2} invalide`);
        }
      }
    }
  });

  console.log(`✓ Questions ranking vérifiées (${rankingQuestions.length})`);

  // VÉRIFICATION 9: Cohérence confidence-interval
  const ciQuestions = allQuestions.filter(q => q.type === 'confidence-interval');
  ciQuestions.forEach(q => {
    if (q.correct === undefined || q.correct === null) {
      if (q.points > 0) {
        allErrors.push(`${name}: Question ${q.id} (confidence-interval) n'a pas de réponse correcte`);
      }
      return;
    }

    const correctNum = Number(q.correct);
    if (isNaN(correctNum)) {
      allErrors.push(`${name}: Question ${q.id} (confidence-interval) correct='${q.correct}' n'est pas un nombre`);
    }
  });

  console.log(`✓ Questions confidence-interval vérifiées (${ciQuestions.length})`);

  // VÉRIFICATION 10: Textes de questions
  allQuestions.forEach(q => {
    if (!q.text || q.text.trim() === '') {
      allErrors.push(`${name}: Question ${q.id} n'a pas de texte`);
    }

    if (q.text && q.text.length > 1000) {
      allWarnings.push(`${name}: Question ${q.id} a un texte très long (${q.text.length} chars)`);
    }
  });

  console.log(`✓ Textes de questions vérifiés`);

  // VÉRIFICATION 11: Explications
  const questionsWithPoints = allQuestions.filter(q => q.points > 0.5);
  const questionsWithoutExplanation = questionsWithPoints.filter(q => !q.explanation || q.explanation.trim() === '');

  if (questionsWithoutExplanation.length > 0) {
    allWarnings.push(`${name}: ${questionsWithoutExplanation.length} questions avec points mais sans explication`);
  } else {
    console.log(`✓ Toutes les questions importantes ont des explications`);
  }

  // VÉRIFICATION 12: Framing pairs
  const framingPairs = allQuestions.filter(q => q.pairId !== undefined);
  if (framingPairs.length > 0) {
    console.log(`✓ ${framingPairs.length} questions font partie de paires (framing effect)`);

    // Vérifier que chaque paire a bien 2 questions
    const pairIds = [...new Set(framingPairs.map(q => q.pairId))];
    pairIds.forEach(pairId => {
      const pair = framingPairs.filter(q => q.pairId === pairId);
      if (pair.length !== 2) {
        allWarnings.push(`${name}: Paire ${pairId} a ${pair.length} questions (attendu: 2)`);
      }
    });
  }
});

// VÉRIFICATION 13: Cohérence FR vs EN
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════\n');
console.log('📊 VÉRIFICATION COHÉRENCE FR ↔ EN\n');

const courtFR = JSON.parse(fs.readFileSync('src/data/test-court.json', 'utf8'));
const courtEN = JSON.parse(fs.readFileSync('src/data/test-court-en.json', 'utf8'));
const completFR = JSON.parse(fs.readFileSync('src/data/test-complet.json', 'utf8'));
const completEN = JSON.parse(fs.readFileSync('src/data/test-complet-en.json', 'utf8'));

// Comparer court FR vs EN
const courtFRIds = courtFR.modules.flatMap(m => m.questions).map(q => q.id).sort();
const courtENIds = courtEN.modules.flatMap(m => m.questions).map(q => q.id).sort();

if (JSON.stringify(courtFRIds) !== JSON.stringify(courtENIds)) {
  allErrors.push('Court FR et Court EN n\'ont pas les mêmes IDs de questions');
} else {
  console.log(`✓ Court FR et EN ont les mêmes ${courtFRIds.length} questions`);
}

// Comparer complet FR vs EN
const completFRIds = completFR.modules.flatMap(m => m.questions).map(q => q.id).sort();
const completENIds = completEN.modules.flatMap(m => m.questions).map(q => q.id).sort();

if (JSON.stringify(completFRIds) !== JSON.stringify(completENIds)) {
  allErrors.push('Complet FR et Complet EN n\'ont pas les mêmes IDs de questions');
} else {
  console.log(`✓ Complet FR et EN ont les mêmes ${completFRIds.length} questions`);
}

// Vérifier que les réponses correctes sont identiques FR vs EN
console.log('\nVérification des réponses correctes FR ↔ EN...');

function compareCorrectAnswers(frData, enData, versionName) {
  const frQuestions = frData.modules.flatMap(m => m.questions);
  const enQuestions = enData.modules.flatMap(m => m.questions);

  const differences = [];

  frQuestions.forEach(frQ => {
    const enQ = enQuestions.find(q => q.id === frQ.id);
    if (!enQ) return;

    // Comparer 'correct'
    if (JSON.stringify(frQ.correct) !== JSON.stringify(enQ.correct)) {
      differences.push(`${frQ.id}: FR correct=${JSON.stringify(frQ.correct)} vs EN correct=${JSON.stringify(enQ.correct)}`);
    }

    // Comparer 'reverse'
    if (frQ.reverse !== enQ.reverse) {
      differences.push(`${frQ.id}: FR reverse=${frQ.reverse} vs EN reverse=${enQ.reverse}`);
    }

    // Comparer 'points'
    if (Math.abs((frQ.points || 0) - (enQ.points || 0)) > 0.01) {
      differences.push(`${frQ.id}: FR points=${frQ.points} vs EN points=${enQ.points}`);
    }

    // Comparer 'scoring.rule'
    const frRule = frQ.scoring?.rule;
    const enRule = enQ.scoring?.rule;
    if (frRule !== enRule) {
      differences.push(`${frQ.id}: FR scoring.rule=${frRule} vs EN scoring.rule=${enRule}`);
    }
  });

  if (differences.length > 0) {
    differences.forEach(diff => {
      allErrors.push(`${versionName}: ${diff}`);
    });
  } else {
    console.log(`✓ ${versionName}: Toutes les réponses correctes sont identiques FR ↔ EN`);
  }
}

compareCorrectAnswers(courtFR, courtEN, 'Court');
compareCorrectAnswers(completFR, completEN, 'Complet');

// AFFICHAGE FINAL
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════\n');
console.log('📋 RÉSUMÉ FINAL\n');

if (allErrors.length > 0) {
  console.log(`❌ ${allErrors.length} ERREUR(S) CRITIQUE(S):\n`);
  allErrors.forEach(err => console.log(`   ❌ ${err}`));
  console.log('');
}

if (allWarnings.length > 0) {
  console.log(`⚠️  ${allWarnings.length} AVERTISSEMENT(S):\n`);
  allWarnings.forEach(warn => console.log(`   ⚠️  ${warn}`));
  console.log('');
}

if (allErrors.length === 0 && allWarnings.length === 0) {
  console.log('✅ AUCUNE ERREUR OU AVERTISSEMENT !\n');
  console.log('Toutes les vérifications sont passées avec succès.\n');
  console.log('Le test est prêt pour la production.\n');
}

console.log('═══════════════════════════════════════════════════════════════════════════════════════\n');

process.exit(allErrors.length > 0 ? 1 : 0);
