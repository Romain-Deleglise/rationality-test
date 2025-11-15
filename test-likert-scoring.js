#!/usr/bin/env node

/**
 * TEST DU SCORING LIKERT
 * Vérifie si le code de scoring fonctionne correctement pour reverse:true
 */

// Simuler le code de scoring actuel
function scoreLikert(userAnswer, question, possible = 1) {
  const likertAnswer = Number(userAnswer);

  // Logique actuelle du code
  let correctLikert;
  if (question.correct !== undefined && question.correct !== null) {
    correctLikert = Number(question.correct);
  } else {
    correctLikert = question.reverse ? 7 : 1;
  }

  // NOUVELLE LOGIQUE CORRIGÉE
  const distance = Math.abs(likertAnswer - correctLikert);

  const earned = possible * Math.max(0, 1 - distance / 5);
  const correct = earned >= possible * 0.7;

  return { earned, correct, correctLikert, distance };
}

console.log('🧪 TEST DU SCORING LIKERT\n');
console.log('═══════════════════════════════════════════════════════════════════════════════════════\n');

// TEST 1: Question reverse:false (affirmation irrationnelle)
console.log('TEST 1: Question reverse:false (affirmation irrationnelle)');
console.log('Question: "L\'astrologie peut être utile"');
console.log('Réponse correcte attendue: 1 (fortement en désaccord)\n');

const q1 = { reverse: false };

for (let answer = 1; answer <= 7; answer++) {
  const result = scoreLikert(answer, q1, 1);
  console.log(`  Utilisateur répond ${answer} → Points: ${result.earned.toFixed(2)}, Correct: ${result.correct}, Distance: ${result.distance}`);
}

console.log('\n✅ Attendu: Répondre 1 = 1.00 point, Répondre 7 = 0.00 point');

// TEST 2: Question reverse:true (affirmation rationnelle)
console.log('\n─'.repeat(90));
console.log('\nTEST 2: Question reverse:true (affirmation rationnelle)');
console.log('Question: "Les fantômes n\'existent pas"');
console.log('Réponse correcte attendue: 7 (fortement d\'accord)\n');

const q2 = { reverse: true };

for (let answer = 1; answer <= 7; answer++) {
  const result = scoreLikert(answer, q2, 1);
  console.log(`  Utilisateur répond ${answer} → Points: ${result.earned.toFixed(2)}, Correct: ${result.correct}, Distance: ${result.distance}`);
}

console.log('\n✅ Attendu: Répondre 7 = 1.00 point, Répondre 1 = 0.00 point');

// VÉRIFICATION
console.log('\n═══════════════════════════════════════════════════════════════════════════════════════\n');
console.log('📊 VÉRIFICATION:\n');

const test1_1 = scoreLikert(1, { reverse: false }, 1);
const test1_7 = scoreLikert(7, { reverse: false }, 1);
const test2_7 = scoreLikert(7, { reverse: true }, 1);
const test2_1 = scoreLikert(1, { reverse: true }, 1);

let bugDetected = false;

if (test1_1.earned < 0.95) {
  console.log('❌ BUG: reverse:false, réponse 1 devrait donner ~1.00 point, obtient ' + test1_1.earned.toFixed(2));
  bugDetected = true;
} else {
  console.log('✅ reverse:false, réponse 1 = ' + test1_1.earned.toFixed(2) + ' point');
}

if (test1_7.earned > 0.05) {
  console.log('❌ BUG: reverse:false, réponse 7 devrait donner ~0.00 point, obtient ' + test1_7.earned.toFixed(2));
  bugDetected = true;
} else {
  console.log('✅ reverse:false, réponse 7 = ' + test1_7.earned.toFixed(2) + ' point');
}

if (test2_7.earned < 0.95) {
  console.log('❌ BUG CRITIQUE: reverse:true, réponse 7 devrait donner ~1.00 point, obtient ' + test2_7.earned.toFixed(2));
  bugDetected = true;
} else {
  console.log('✅ reverse:true, réponse 7 = ' + test2_7.earned.toFixed(2) + ' point');
}

if (test2_1.earned > 0.05) {
  console.log('❌ BUG CRITIQUE: reverse:true, réponse 1 devrait donner ~0.00 point, obtient ' + test2_1.earned.toFixed(2));
  bugDetected = true;
} else {
  console.log('✅ reverse:true, réponse 1 = ' + test2_1.earned.toFixed(2) + ' point');
}

console.log('\n═══════════════════════════════════════════════════════════════════════════════════════\n');

if (bugDetected) {
  console.log('❌ BUG DÉTECTÉ DANS LE SCORING LIKERT !\n');
  console.log('Le code actuel inverse incorrectement les réponses pour reverse:true.\n');
  process.exit(1);
} else {
  console.log('✅ LE SCORING LIKERT FONCTIONNE CORRECTEMENT\n');
  process.exit(0);
}
