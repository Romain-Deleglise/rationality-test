#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification manuelle de la logique des réponses\n');
console.log('═'.repeat(80));

const testFile = 'src/data/test-complet.json';
const data = JSON.parse(fs.readFileSync(testFile, 'utf8'));

// Fonction pour afficher une question et sa bonne réponse calculée
function displayQuestion(q, moduleId) {
  console.log(`\n📝 ${q.id} (${q.type}) - Module: ${moduleId}`);
  console.log('─'.repeat(80));
  console.log(`Question: ${q.text.substring(0, 120)}${q.text.length > 120 ? '...' : ''}`);

  if (q.options) {
    q.options.forEach((opt, i) => {
      console.log(`  ${i}. ${opt.substring(0, 70)}${opt.length > 70 ? '...' : ''}`);
    });
  }

  // Calculer et afficher la bonne réponse
  let correctAnswer = 'N/A';
  let explanation = '';

  switch (q.type) {
    case 'multiple-choice':
      if (q.correct !== undefined && q.correct !== null) {
        correctAnswer = `Option ${q.correct}`;
        if (q.options && q.options[q.correct]) {
          correctAnswer += `: "${q.options[q.correct].substring(0, 50)}"`;
        }
      }
      break;

    case 'number':
      correctAnswer = q.correct + (q.unit || '');
      if (q.tolerance) correctAnswer += ` (±${q.tolerance})`;
      break;

    case 'likert':
      if (q.correct !== undefined && q.correct !== null) {
        correctAnswer = q.correct;
      } else {
        correctAnswer = q.reverse ? 7 : 1;
        explanation = q.reverse
          ? '(reverse=true → fortement d\'accord = rationnel)'
          : '(reverse=false → fortement en désaccord = rationnel)';
      }
      break;

    case 'ranking':
      if (q.correct) {
        correctAnswer = JSON.stringify(q.correct);
      } else if (q.scoring && q.scoring.rule) {
        correctAnswer = q.scoring.rule;
        explanation = '(vérification de la règle de conjonction)';
      }
      break;

    case 'confidence-interval':
      correctAnswer = q.correct + (q.unit || '');
      break;
  }

  console.log(`✓ Bonne réponse: ${correctAnswer} ${explanation}`);

  if (q.explanation) {
    console.log(`💡 Explication: ${q.explanation.substring(0, 150)}${q.explanation.length > 150 ? '...' : ''}`);
  }
}

// Vérifier un échantillon représentatif de chaque type
console.log('\n\n🧪 ÉCHANTILLON DE VÉRIFICATION\n');

let samples = {
  'multiple-choice': [],
  'number': [],
  'likert-reverse-false': [],
  'likert-reverse-true': [],
  'ranking': [],
  'confidence-interval': []
};

data.modules.forEach(module => {
  module.questions.forEach(q => {
    // Prendre max 3 exemples de chaque type
    if (q.type === 'multiple-choice' && samples['multiple-choice'].length < 3 && q.correct !== null) {
      samples['multiple-choice'].push({ q, moduleId: module.id });
    } else if (q.type === 'number' && samples['number'].length < 3) {
      samples['number'].push({ q, moduleId: module.id });
    } else if (q.type === 'likert' && !q.reverse && samples['likert-reverse-false'].length < 3 && q.points > 0) {
      samples['likert-reverse-false'].push({ q, moduleId: module.id });
    } else if (q.type === 'likert' && q.reverse && samples['likert-reverse-true'].length < 3 && q.points > 0) {
      samples['likert-reverse-true'].push({ q, moduleId: module.id });
    } else if (q.type === 'ranking' && samples['ranking'].length < 3) {
      samples['ranking'].push({ q, moduleId: module.id });
    } else if (q.type === 'confidence-interval' && samples['confidence-interval'].length < 2) {
      samples['confidence-interval'].push({ q, moduleId: module.id });
    }
  });
});

// Afficher les échantillons
Object.keys(samples).forEach(type => {
  if (samples[type].length > 0) {
    console.log(`\n\n▼ TYPE: ${type.toUpperCase()}`);
    console.log('═'.repeat(80));
    samples[type].forEach(({ q, moduleId }) => {
      displayQuestion(q, moduleId);
    });
  }
});

console.log('\n\n═'.repeat(80));
console.log('✅ Vérification terminée. Vérifiez que les réponses sont logiques.');
console.log('═'.repeat(80));
