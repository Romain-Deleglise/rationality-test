#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Charger le fichier test-complet.json
const testCompletPath = path.join(__dirname, 'src/data/test-complet.json');
const testComplet = JSON.parse(fs.readFileSync(testCompletPath, 'utf8'));

console.log('='.repeat(80));
console.log('VÉRIFICATION COMPLÈTE DU TEST LONG (test-complet.json)');
console.log('='.repeat(80));
console.log();

let totalQuestions = 0;
let totalProblemes = 0;
const problemesParCategorie = {};

// Parcourir tous les modules
testComplet.modules.forEach((module, modIndex) => {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`MODULE ${modIndex + 1}: ${module.name}`);
  console.log(`${'='.repeat(80)}`);

  const problemesModule = [];

  module.questions.forEach((question, qIndex) => {
    totalQuestions++;
    const questionNum = qIndex + 1;
    const questionId = question.id;

    console.log(`\n${'-'.repeat(80)}`);
    console.log(`Question ${questionNum} (ID: ${questionId}) - Type: ${question.type}`);
    console.log(`${'-'.repeat(80)}`);
    console.log(`Question: ${question.text || question.question || '(pas de texte)'}`);

    const problemes = [];

    // Vérifier selon le type
    if (question.type === 'multiple-choice') {
      console.log(`\nOptions:`);
      if (Array.isArray(question.options)) {
        if (typeof question.options[0] === 'string') {
          // Options simples (array de strings)
          question.options.forEach((opt, i) => {
            const marker = question.correct === i ? '✓' : ' ';
            console.log(`  [${marker}] ${String.fromCharCode(65 + i)}. ${opt}`);
          });

          // Exception : les questions de framing pairs peuvent ne pas avoir de "correct"
          const isFramingPair = question.pairId && question.framingType;
          if (question.correct === undefined && !isFramingPair) {
            problemes.push('❌ ERREUR: Aucune réponse correcte définie (question.correct manquant)');
          } else if (question.correct === undefined && isFramingPair) {
            console.log(`  Note: Question de framing pair - pas de réponse "correcte" unique (teste la cohérence)`);
          }
        } else {
          // Options avec objets
          question.options.forEach((opt, i) => {
            const marker = opt.correct ? '✓' : ' ';
            console.log(`  [${marker}] ${String.fromCharCode(65 + i)}. ${opt.text}`);
          });

          const correctOptions = question.options.filter(o => o.correct);
          if (correctOptions.length === 0) {
            problemes.push('❌ ERREUR: Aucune réponse correcte définie');
          } else if (correctOptions.length > 1) {
            problemes.push(`⚠️  ATTENTION: ${correctOptions.length} réponses correctes`);
          }
        }
      }

      // Afficher les points
      if (question.points !== undefined) {
        console.log(`\nPoints: ${question.points}`);
      } else {
        problemes.push('⚠️  ATTENTION: Pas de points définis');
      }

    } else if (question.type === 'multiple-choice-confidence') {
      console.log(`\nQuestion de calibration avec niveaux de confiance`);
      if (Array.isArray(question.options)) {
        question.options.forEach((opt, i) => {
          const marker = question.correct === i ? '✓' : ' ';
          console.log(`  [${marker}] ${String.fromCharCode(65 + i)}. ${opt}`);
        });
      }

      if (question.correct !== undefined) {
        console.log(`\nRéponse correcte: ${String.fromCharCode(65 + question.correct)}`);
      }

      if (question.points !== undefined) {
        console.log(`Points: ${question.points}`);
      }

      // Note: Les questions de calibration n'ont pas besoin d'explication (faits objectifs)

    } else if (question.type === 'likert') {
      console.log(`\nÉchelle Likert`);
      if (question.min !== undefined && question.max !== undefined) {
        console.log(`  Échelle: ${question.min} à ${question.max}`);
      }
      if (question.leftLabel) {
        console.log(`  Label gauche: ${question.leftLabel}`);
      }
      if (question.rightLabel) {
        console.log(`  Label droite: ${question.rightLabel}`);
      }
      if (question.optimal !== undefined) {
        console.log(`  Valeur optimale: ${question.optimal}`);
      } else {
        problemes.push('⚠️  ATTENTION: Pas de valeur optimale définie');
      }
      if (question.points !== undefined) {
        console.log(`  Points: ${question.points}`);
      }

    } else if (question.type === 'ranking') {
      console.log(`\nRanking - Items à classer:`);
      if (question.items || question.options) {
        const items = question.items || question.options;
        items.forEach((item, i) => {
          const itemText = typeof item === 'string' ? item : item.text;
          console.log(`  ${i + 1}. ${itemText}`);
        });
      }

      // Vérifier le système de scoring
      if (question.correctOrder) {
        console.log(`\nOrdre correct: [${question.correctOrder.join(', ')}]`);
      } else if (question.scoring && question.scoring.rule) {
        console.log(`\nSystème de scoring: ${question.scoring.rule}`);
        console.log(`  (basé sur des règles de comparaison, pas un ordre complet)`);
      } else {
        problemes.push('⚠️  ATTENTION: Pas de système de scoring défini (ni correctOrder ni scoring.rule)');
      }

      if (question.points !== undefined) {
        console.log(`Points: ${question.points}`);
      }

    } else if (question.type === 'numeric') {
      console.log(`\nRéponse numérique attendue`);
      if (question.correctAnswer !== undefined) {
        console.log(`  Réponse correcte: ${question.correctAnswer}`);
      } else {
        problemes.push('⚠️  ATTENTION: Pas de réponse correcte définie');
      }
      if (question.tolerance !== undefined) {
        console.log(`  Tolérance: ${question.tolerance}`);
      }
      if (question.points !== undefined) {
        console.log(`  Points: ${question.points}`);
      }
    }

    // Vérifier l'explication
    if (question.explanation) {
      console.log(`\n📝 Explication: ${question.explanation.substring(0, 150)}${question.explanation.length > 150 ? '...' : ''}`);
    } else {
      // Les questions de calibration (culture générale) n'ont pas besoin d'explication
      const isCalibration = question.type === 'multiple-choice-confidence';
      if (!isCalibration) {
        problemes.push('⚠️  ATTENTION: Pas d\'explication');
      } else {
        console.log(`\n📝 Note: Question de calibration - pas d'explication nécessaire (fait objectif)`);
      }
    }

    // Afficher les problèmes
    if (problemes.length > 0) {
      console.log(`\n⚠️  PROBLÈMES DÉTECTÉS:`);
      problemes.forEach(p => console.log(`   ${p}`));
      totalProblemes += problemes.length;
      problemesModule.push({
        questionNum,
        questionId,
        problemes
      });
    } else {
      console.log(`\n✅ Question OK`);
    }
  });

  if (problemesModule.length > 0) {
    problemesParCategorie[module.name] = problemesModule;
  }
});

// Résumé final
console.log('\n\n');
console.log('='.repeat(80));
console.log('RÉSUMÉ DE LA VÉRIFICATION');
console.log('='.repeat(80));
console.log(`Total de questions: ${totalQuestions}`);
console.log(`Total de problèmes détectés: ${totalProblemes}`);

if (Object.keys(problemesParCategorie).length > 0) {
  console.log('\nPROBLÈMES PAR CATÉGORIE:');
  Object.entries(problemesParCategorie).forEach(([cat, probs]) => {
    console.log(`\n${cat}:`);
    probs.forEach(p => {
      console.log(`  - Question ${p.questionNum} (${p.questionId}):`);
      p.problemes.forEach(prob => console.log(`    ${prob}`));
    });
  });
} else {
  console.log('\n✅ Aucun problème détecté !');
}

console.log('\n' + '='.repeat(80));
