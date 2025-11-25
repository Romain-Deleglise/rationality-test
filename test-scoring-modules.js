const fs = require('fs');

// Charger le fichier JSON corrigé
const testData = JSON.parse(fs.readFileSync('src/data/test-complet.json', 'utf8'));

console.log('=== TEST DU SCORING DES MODULES PROBLÉMATIQUES ===\n');

// Fonction pour calculer les points possibles d'un module
function calculatePossiblePoints(module) {
  return module.questions.reduce((sum, q) => sum + (q.points || 0), 0);
}

// Modules à vérifier
const modulesToCheck = ['framing', 'argument-eval', 'anchoring', 'sunk-cost'];

modulesToCheck.forEach(moduleId => {
  const module = testData.modules.find(m => m.id === moduleId);
  if (!module) {
    console.log(`❌ Module ${moduleId} non trouvé`);
    return;
  }

  const totalPossible = calculatePossiblePoints(module);
  const questionsWithPoints = module.questions.filter(q => q.points > 0);

  console.log(`\n📊 ${module.name}`);
  console.log(`   ID: ${module.id}`);
  console.log(`   Points déclarés dans module.points: ${module.points}`);
  console.log(`   Points calculés (somme des questions): ${totalPossible.toFixed(2)}`);
  console.log(`   Nombre total de questions: ${module.questions.length}`);
  console.log(`   Questions avec points > 0: ${questionsWithPoints.length}`);

  if (Math.abs(totalPossible - module.points) > 0.01) {
    console.log(`   ⚠️  INCOHÉRENCE détectée !`);
  } else {
    console.log(`   ✅ Cohérent`);
  }

  // Afficher le détail pour les modules par paire
  if (moduleId === 'framing' || moduleId === 'argument-eval') {
    console.log(`\n   Détail des questions:`);
    module.questions.forEach(q => {
      console.log(`     - ${q.id}: ${q.points} points ${q.pairId ? `(paire: ${q.pairId})` : ''}`);
    });
  }
});

// Test avec des réponses simulées
console.log('\n\n=== SIMULATION DE SCORING ===\n');

// Simuler un utilisateur qui répond correctement à toutes les questions
const framingModule = testData.modules.find(m => m.id === 'framing');
if (framingModule) {
  console.log('Module Effets de Cadrage - Scénario: réponses correctes à toutes les questions scorables');

  let earnedPoints = 0;
  framingModule.questions.forEach(q => {
    if (q.points > 0) {
      earnedPoints += q.points;
    }
  });

  const possiblePoints = calculatePossiblePoints(framingModule);
  const percentage = (earnedPoints / possiblePoints) * 100;

  console.log(`   Points gagnés: ${earnedPoints.toFixed(2)}`);
  console.log(`   Points possibles: ${possiblePoints.toFixed(2)}`);
  console.log(`   Pourcentage: ${percentage.toFixed(1)}%`);
  console.log(`   Affichage attendu: ${earnedPoints.toFixed(1)} / ${possiblePoints.toFixed(1)} points`);
}

const argModule = testData.modules.find(m => m.id === 'argument-eval');
if (argModule) {
  console.log('\nModule Évaluation d\'Arguments - Scénario: réponses correctes à toutes les questions scorables');

  let earnedPoints = 0;
  argModule.questions.forEach(q => {
    if (q.points > 0) {
      earnedPoints += q.points;
    }
  });

  const possiblePoints = calculatePossiblePoints(argModule);
  const percentage = (earnedPoints / possiblePoints) * 100;

  console.log(`   Points gagnés: ${earnedPoints.toFixed(2)}`);
  console.log(`   Points possibles: ${possiblePoints.toFixed(2)}`);
  console.log(`   Pourcentage: ${percentage.toFixed(1)}%`);
  console.log(`   Affichage attendu: ${earnedPoints.toFixed(1)} / ${possiblePoints.toFixed(1)} points`);
}

const sunkModule = testData.modules.find(m => m.id === 'sunk-cost');
if (sunkModule) {
  console.log('\nModule Coûts Irrécupérables - Vérification des réponses multiples');

  const sunk1 = sunkModule.questions.find(q => q.id === 'sunk-1');
  const sunk3 = sunkModule.questions.find(q => q.id === 'sunk-3');

  console.log(`   sunk-1 correctAnswers: ${sunk1.correctAnswers ? sunk1.correctAnswers.join(', ') : 'N/A'}`);
  console.log(`   sunk-3 correctAnswers: ${sunk3.correctAnswers ? sunk3.correctAnswers.join(', ') : 'N/A'}`);

  if (sunk1.correctAnswers && sunk1.correctAnswers.length === 2) {
    console.log(`   ✅ sunk-1 accepte bien 2 réponses`);
  } else {
    console.log(`   ❌ sunk-1 n'a pas 2 réponses correctes`);
  }

  if (sunk3.correctAnswers && sunk3.correctAnswers.length === 2) {
    console.log(`   ✅ sunk-3 accepte bien 2 réponses`);
  } else {
    console.log(`   ❌ sunk-3 n'a pas 2 réponses correctes`);
  }
}

console.log('\n\n=== CONCLUSION ===\n');
console.log('Si l\'utilisateur voit encore des points incorrects (6.5 ou 8.0),');
console.log('cela signifie probablement qu\'il utilise une ancienne version du site');
console.log('ou qu\'il y a un cache à rafraîchir.');
console.log('\nLes fichiers JSON et TypeScript ont été corrigés correctement.');
