#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fichiers de test à vérifier
const testFiles = [
  'src/data/test-court.json',
  'src/data/test-court-en.json',
  'src/data/test-complet.json',
  'src/data/test-complet-en.json',
];

let totalErrors = 0;
let totalWarnings = 0;
let totalQuestions = 0;

console.log('🔍 Vérification des questions et réponses...\n');

testFiles.forEach((filePath) => {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return;
  }

  console.log(`\n📄 ${filePath}`);
  console.log('─'.repeat(80));

  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

  // Le fichier peut être soit un tableau direct, soit un objet avec {modules: [...]}
  let modules = [];
  if (Array.isArray(data)) {
    modules = data;
  } else if (data.modules && Array.isArray(data.modules)) {
    modules = data.modules;
  } else {
    console.log(`❌ Format invalide: le fichier doit contenir un tableau de modules ou {modules: [...]}`);
    totalErrors++;
    return;
  }

  modules.forEach((module, moduleIndex) => {
    if (!module.questions || !Array.isArray(module.questions)) {
      console.log(`❌ Module ${moduleIndex} (${module.name || 'Sans nom'}): pas de questions`);
      totalErrors++;
      return;
    }

    module.questions.forEach((question, qIndex) => {
      totalQuestions++;
      const qId = question.id || `${moduleIndex}-${qIndex}`;

      // Vérifications essentielles
      const errors = [];
      const warnings = [];

      // 1. Vérifier que la question a un type
      if (!question.type) {
        errors.push('Pas de type défini');
      }

      // 2. Vérifier que la question a une bonne réponse (sauf pour certains types)
      if (question.correct === undefined || question.correct === null) {
        errors.push('Pas de réponse correcte définie (champ "correct" manquant)');
      }

      // 3. Vérifier selon le type de question
      switch (question.type) {
        case 'multiple-choice':
          if (question.correct === undefined) {
            errors.push('Type multiple-choice mais pas de "correct"');
          }
          if (!question.options || !Array.isArray(question.options)) {
            errors.push('Type multiple-choice mais pas d\'options');
          }
          // Vérifier que la réponse correcte existe dans les options
          if (question.options && Array.isArray(question.options)) {
            const correctIndex = question.correct;
            if (correctIndex < 0 || correctIndex >= question.options.length) {
              errors.push(`Index correct (${correctIndex}) hors limites (0-${question.options.length - 1})`);
            }
          }
          break;

        case 'number':
          if (typeof question.correct !== 'number' && typeof question.correct !== 'string') {
            errors.push('Type number mais "correct" n\'est pas un nombre');
          }
          break;

        case 'confidence-interval':
          if (typeof question.correct !== 'number' && typeof question.correct !== 'string') {
            errors.push('Type confidence-interval mais "correct" n\'est pas un nombre');
          }
          break;

        case 'ranking':
          if (!Array.isArray(question.correct)) {
            errors.push('Type ranking mais "correct" n\'est pas un tableau');
          }
          break;

        case 'likert':
          if (typeof question.correct !== 'number' && typeof question.correct !== 'string') {
            errors.push('Type likert mais "correct" n\'est pas un nombre');
          }
          break;

        case 'multiple-choice-confidence':
          if (question.correct === undefined) {
            errors.push('Type multiple-choice-confidence mais pas de "correct"');
          }
          break;
      }

      // 4. Vérifier que la question a des points
      if (!question.points || question.points <= 0) {
        warnings.push(`Pas de points définis (défaut: 1 point)`);
      }

      // Afficher les résultats
      if (errors.length > 0) {
        console.log(`\n❌ Question ${qId} (${question.type || 'type?'})`);
        errors.forEach(e => console.log(`   • ${e}`));
        totalErrors += errors.length;
      } else if (warnings.length > 0) {
        console.log(`\n⚠️  Question ${qId} (${question.type})`);
        warnings.forEach(w => console.log(`   • ${w}`));
        totalWarnings += warnings.length;
      }
    });
  });
});

// Résumé
console.log('\n' + '='.repeat(80));
console.log('\n📊 RÉSUMÉ:');
console.log(`   Total questions vérifiées: ${totalQuestions}`);
console.log(`   ❌ Erreurs critiques: ${totalErrors}`);
console.log(`   ⚠️  Avertissements: ${totalWarnings}`);

if (totalErrors === 0 && totalWarnings === 0) {
  console.log('\n✅ Toutes les questions sont correctement configurées!');
  process.exit(0);
} else if (totalErrors === 0) {
  console.log('\n✅ Aucune erreur critique (les avertissements sont OK)');
  process.exit(0);
} else {
  console.log('\n❌ Des erreurs critiques ont été trouvées. Vérifiez les fichiers.');
  process.exit(1);
}
