#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Charger le fichier test-complet.json
const testCompletPath = path.join(__dirname, 'src/data/test-complet.json');
const testComplet = JSON.parse(fs.readFileSync(testCompletPath, 'utf8'));

console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
console.log('║         TOUTES LES QUESTIONS DU TEST LONG (test-complet.json)                ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
console.log();
console.log(`Version: ${testComplet.version}`);
console.log(`Total de points: ${testComplet.totalPoints}`);
console.log(`Temps estimé: ${testComplet.estimatedTime} minutes`);
console.log();

let questionGlobale = 0;

// Parcourir tous les modules
testComplet.modules.forEach((module, modIndex) => {
  console.log('\n' + '═'.repeat(80));
  console.log(`MODULE ${modIndex + 1}: ${module.name}`);
  console.log(`Points: ${module.points} | Temps: ${module.time} minutes`);
  console.log('═'.repeat(80));

  module.questions.forEach((question, qIndex) => {
    questionGlobale++;

    console.log('\n' + '─'.repeat(80));
    console.log(`QUESTION ${questionGlobale} (ID: ${question.id})`);
    console.log('─'.repeat(80));
    console.log(`Type: ${question.type} | Points: ${question.points}`);
    console.log();
    console.log('QUESTION:');
    console.log(question.text || question.question || '(pas de texte)');
    console.log();

    // Afficher selon le type
    if (question.type === 'multiple-choice' || question.type === 'multiple-choice-confidence') {
      console.log('OPTIONS:');
      if (Array.isArray(question.options)) {
        question.options.forEach((opt, i) => {
          const optText = typeof opt === 'string' ? opt : opt.text;
          const marker = question.correct === i ? ' ✓ CORRECT' : '';
          console.log(`  ${String.fromCharCode(65 + i)}. ${optText}${marker}`);
        });
      }

      if (question.correct !== undefined) {
        console.log();
        console.log(`RÉPONSE CORRECTE: ${String.fromCharCode(65 + question.correct)}`);
      } else if (question.pairId) {
        console.log();
        console.log('RÉPONSE: Question de framing pair - teste la cohérence entre paires');
      }

      if (question.type === 'multiple-choice-confidence' && question.confidenceLevels) {
        console.log();
        console.log(`Niveaux de confiance: ${question.confidenceLevels.join('%, ')}%`);
      }

    } else if (question.type === 'likert') {
      const min = question.min || 1;
      const max = question.max || 7;
      console.log(`ÉCHELLE LIKERT: ${min} à ${max}`);

      if (question.leftLabel) {
        console.log(`  ${min}: ${question.leftLabel}`);
      }
      if (question.rightLabel) {
        console.log(`  ${max}: ${question.rightLabel}`);
      }

      console.log();
      console.log(`RÉPONSE OPTIMALE: ${question.optimal}`);
      console.log(`(reverse: ${question.reverse})`);

    } else if (question.type === 'ranking') {
      console.log('ITEMS À CLASSER:');
      const items = question.items || question.options;
      if (items) {
        items.forEach((item, i) => {
          const itemText = typeof item === 'string' ? item : item.text;
          console.log(`  ${i + 1}. ${itemText}`);
        });
      }

      console.log();
      if (question.correctOrder) {
        console.log(`ORDRE CORRECT: ${question.correctOrder.map((idx, pos) => `Position ${pos + 1} = Item ${idx + 1}`).join(', ')}`);
      } else if (question.scoring && question.scoring.rule) {
        console.log(`RÈGLE DE SCORING: ${question.scoring.rule}`);
      }

    } else if (question.type === 'number' || question.type === 'numeric') {
      console.log('TYPE: Réponse numérique');
      if (question.correctAnswer !== undefined) {
        console.log();
        console.log(`RÉPONSE CORRECTE: ${question.correctAnswer}`);
      }
      if (question.tolerance !== undefined) {
        console.log(`TOLÉRANCE: ±${question.tolerance}`);
      }

    } else if (question.type === 'confidence-interval') {
      console.log('TYPE: Intervalle de confiance');
      if (question.correctAnswer !== undefined) {
        console.log();
        console.log(`RÉPONSE CORRECTE: ${question.correctAnswer}`);
      }
    }

    // Afficher l'explication
    console.log();
    console.log('EXPLICATION:');
    if (question.explanation) {
      // Formater l'explication avec retours à la ligne pour améliorer la lisibilité
      const explanation = question.explanation;
      const maxWidth = 78;
      const words = explanation.split(' ');
      let line = '';

      words.forEach(word => {
        if ((line + word).length > maxWidth) {
          console.log(line);
          line = word + ' ';
        } else {
          line += word + ' ';
        }
      });
      if (line.length > 0) {
        console.log(line);
      }
    } else if (question.type === 'multiple-choice-confidence') {
      console.log('(Question de calibration - fait objectif, pas d\'explication nécessaire)');
    } else {
      console.log('(Pas d\'explication disponible)');
    }
  });
});

console.log('\n' + '═'.repeat(80));
console.log(`TOTAL: ${questionGlobale} questions`);
console.log('═'.repeat(80));
