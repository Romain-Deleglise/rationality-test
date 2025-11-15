#!/usr/bin/env node

/**
 * ANALYSE APPROFONDIE DU CONTENU DES QUESTIONS
 * Vérifie la cohérence logique et détecte les vrais problèmes
 */

const fs = require('fs');

console.log('🔍 ANALYSE APPROFONDIE DU CONTENU\n');
console.log('═══════════════════════════════════════════════════════════════════════════════════════\n');

const data = JSON.parse(fs.readFileSync('src/data/test-complet.json', 'utf8'));
const allQuestions = data.modules.flatMap(m => m.questions);

// ANALYSE LIKERT EN DÉTAIL
console.log('📊 ANALYSE DÉTAILLÉE DES QUESTIONS LIKERT\n');
console.log('─'.repeat(90));

const likertQuestions = allQuestions.filter(q => q.type === 'likert' && q.points > 0);

console.log(`\nTotal questions Likert (avec points): ${likertQuestions.length}\n`);

// Afficher échantillon de questions pour chaque réponse attendue
console.log('Exemples de questions avec réponse attendue = 1 (Fortement en désaccord):');
const likert1Examples = likertQuestions.filter(q => {
  const expected = q.correct !== undefined ? q.correct : (q.reverse ? 7 : 1);
  return expected === 1;
}).slice(0, 5);

likert1Examples.forEach((q, i) => {
  console.log(`\n${i + 1}. ${q.text.substring(0, 100)}${q.text.length > 100 ? '...' : ''}`);
  console.log(`   Reverse: ${q.reverse || false}`);
});

console.log('\n\nExemples de questions avec réponse attendue = 7 (Fortement d\'accord):');
const likert7Examples = likertQuestions.filter(q => {
  const expected = q.correct !== undefined ? q.correct : (q.reverse ? 7 : 1);
  return expected === 7;
}).slice(0, 5);

likert7Examples.forEach((q, i) => {
  console.log(`\n${i + 1}. ${q.text.substring(0, 100)}${q.text.length > 100 ? '...' : ''}`);
  console.log(`   Reverse: ${q.reverse || false}`);
});

// ANALYSE CHOIX MULTIPLES
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════\n');
console.log('📊 ANALYSE DÉTAILLÉE DES CHOIX MULTIPLES\n');
console.log('─'.repeat(90));

const mcQuestions = allQuestions.filter(q => q.type === 'multiple-choice');

// Grouper par position de réponse correcte
[0, 1, 2, 3, 4].forEach(pos => {
  const questionsAtPos = mcQuestions.filter(q => q.correct === pos);
  if (questionsAtPos.length > 0) {
    console.log(`\n\nPosition ${pos} (${questionsAtPos.length} questions) - Exemples:`);
    questionsAtPos.slice(0, 3).forEach((q, i) => {
      console.log(`\n${i + 1}. ${q.text.substring(0, 80)}${q.text.length > 80 ? '...' : ''}`);
      console.log(`   Options: ${q.options.length} choix`);
      console.log(`   Bonne réponse: "${q.options[q.correct].substring(0, 60)}${q.options[q.correct].length > 60 ? '...' : ''}"`);
    });
  }
});

// ANALYSE RANKING
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════\n');
console.log('📊 ANALYSE DÉTAILLÉE DES RANKINGS\n');
console.log('─'.repeat(90));

const rankingQuestions = allQuestions.filter(q => q.type === 'ranking');

console.log(`\nTotal questions ranking: ${rankingQuestions.length}\n`);

rankingQuestions.forEach((q, i) => {
  console.log(`\n${i + 1}. ID: ${q.id}`);
  console.log(`   Question: ${q.text.substring(0, 100)}${q.text.length > 100 ? '...' : ''}`);
  console.log(`   Options: ${q.options.length} choix`);

  if (q.scoring && q.scoring.rule) {
    console.log(`   Règle: ${q.scoring.rule}`);
  } else if (Array.isArray(q.correct)) {
    console.log(`   Ordre correct: [${q.correct.join(', ')}]`);
  }

  console.log(`   Explication: ${q.explanation ? q.explanation.substring(0, 80) + '...' : 'N/A'}`);
});

// VÉRIFIER LA LOGIQUE DES RÉPONSES
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════\n');
console.log('🧠 VÉRIFICATION DE LA COHÉRENCE LOGIQUE\n');
console.log('─'.repeat(90));

const issues = [];

// Vérifier que les questions Likert avec reverse:false sont bien irrationnelles
console.log('\nVérification questions Likert (reverse: false = affirmation irrationnelle):');
const likertIrrational = likertQuestions.filter(q => q.reverse === false).slice(0, 5);
likertIrrational.forEach((q, i) => {
  console.log(`\n${i + 1}. ${q.text}`);
  console.log(`   → Réponse attendue: 1 (Fortement en désaccord)`);
  console.log(`   → Est-ce cohérent ? (devrait être une affirmation irrationnelle)`);

  // Mots-clés irrationnels
  const irrationalKeywords = ['astrologie', 'horoscope', 'numérologie', 'paranormal', 'télépathie', 'prémonition'];
  const hasIrrationalKeyword = irrationalKeywords.some(kw => q.text.toLowerCase().includes(kw));

  if (!hasIrrationalKeyword && !q.text.includes('peut') && !q.text.includes('capable')) {
    console.log(`   ⚠️  Vérifier: ne contient pas de mots-clés irrationnels évidents`);
  }
});

console.log('\n\nVérification questions Likert (reverse: true = affirmation rationnelle):');
const likertRational = likertQuestions.filter(q => q.reverse === true).slice(0, 5);
likertRational.forEach((q, i) => {
  console.log(`\n${i + 1}. ${q.text}`);
  console.log(`   → Réponse attendue: 7 (Fortement d'accord)`);
  console.log(`   → Est-ce cohérent ? (devrait être une affirmation rationnelle)`);
});

// CONCLUSION
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════\n');
console.log('📋 ANALYSE DES PATTERNS:\n');

console.log('1. LIKERT - Toutes réponses à 1 ou 7:');
console.log('   - Est-ce un problème ? Cela dépend de la NATURE des questions');
console.log('   - Si les questions sont des affirmations claires (irrationnelles ou rationnelles),');
console.log('     il est NORMAL que la réponse soit aux extrêmes');
console.log('   - MAIS si un utilisateur devine ce pattern, il peut scorer haut sans réfléchir\n');

console.log('2. CHOIX MULTIPLES - 48% à la position 1:');
console.log('   - Distribution non-uniforme (chi² = 165.90)');
console.log('   - Un utilisateur pourrait deviner "toujours choisir la 2ème option"');
console.log('   - RECOMMANDATION: Vérifier si c\'est évitable ou si c\'est dû au contenu\n');

console.log('3. LIKERT - 80% de réponses "fortement en désaccord":');
console.log('   - Déséquilibre fort vers le désaccord');
console.log('   - Un utilisateur pourrait deviner "toujours être en désaccord"');
console.log('   - QUESTION: Est-ce que la majorité des questions testent des croyances irrationnelles ?\n');

console.log('═══════════════════════════════════════════════════════════════════════════════════════\n');
