const fs = require('fs');

// Charger le fichier JSON
const testData = JSON.parse(fs.readFileSync('src/data/test-complet.json', 'utf8'));

console.log('=== CORRECTION DE TOUS LES PROBLÈMES DU JSON ===\n');

let corrections = 0;

// 1. Corriger les points totaux de chaque module
console.log('1. CORRECTION DES POINTS TOTAUX DES MODULES\n');

testData.modules.forEach(module => {
  const calculatedPoints = module.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  const roundedCalculated = Math.round(calculatedPoints * 100) / 100;
  const declaredPoints = module.points || 0;
  const diff = Math.abs(roundedCalculated - declaredPoints);

  if (diff > 0.01) {
    console.log(`✏️  ${module.name}:`);
    console.log(`   Avant: ${declaredPoints} → Après: ${roundedCalculated}`);
    module.points = roundedCalculated;
    corrections++;
  }
});

// 2. Corriger les questions de coûts irrécupérables
console.log('\n2. CORRECTION DES QUESTIONS DE COÛTS IRRÉCUPÉRABLES\n');

const sunkModule = testData.modules.find(m => m.id === 'sunk-cost');
if (sunkModule) {
  // Question sunk-1: Accepter réponses 1 et 2 (rester chez soi ET vendre le billet)
  const sunk1 = sunkModule.questions.find(q => q.id === 'sunk-1');
  if (sunk1) {
    console.log('✏️  sunk-1 (Concert):');
    console.log('   Changement: correct: 1 → correctAnswers: [1, 2]');
    console.log('   Les deux réponses "Rester chez vous" et "Vendre le billet" sont acceptées');

    // Modifier la question pour accepter plusieurs réponses
    sunk1.correctAnswers = [1, 2]; // Accepter les deux réponses
    delete sunk1.correct; // Retirer l'ancienne propriété

    // Mettre à jour l'explication
    sunk1.explanation = "Les 80€ sont un coût irrécupérable (sunk cost). La décision rationnelle considère uniquement le futur. Deux options sont rationnelles : (1) Rester chez vous pour vous reposer et guérir, ou (2) Essayer de vendre le billet pour récupérer l'argent. L'important est de ne PAS aller au concert juste parce que vous avez payé.";
    corrections++;
  }

  // Question sunk-3: Accepter réponses 1 et 2 (commander ET corriger le plat)
  const sunk3 = sunkModule.questions.find(q => q.id === 'sunk-3');
  if (sunk3) {
    console.log('\n✏️  sunk-3 (Plat cuisiné):');
    console.log('   Changement: correct: 1 → correctAnswers: [1, 2]');
    console.log('   Les deux réponses "Commander" et "Corriger le plat" sont acceptées');

    sunk3.correctAnswers = [1, 2];
    delete sunk3.correct;

    sunk3.explanation = "Les 3 heures de cuisine sont un sunk cost. Deux options sont rationnelles : (1) Commander à manger pour avoir un bon repas, ou (2) Essayer de corriger le plat si c'est possible (par exemple, diluer avec des ingrédients non salés). L'important est de ne PAS se forcer à manger quelque chose d'immangeable juste pour \"ne pas gaspiller\" le temps passé.";
    corrections++;
  }
}

// 3. Recalculer le total de points du test
const newTotalPoints = testData.modules.reduce((sum, m) => sum + (m.points || 0), 0);
const roundedTotal = Math.round(newTotalPoints * 100) / 100;

console.log('\n3. MISE À JOUR DU TOTAL DE POINTS\n');
console.log(`   Avant: ${testData.totalPoints} → Après: ${roundedTotal}`);
testData.totalPoints = roundedTotal;

// 4. Sauvegarder le fichier corrigé
fs.writeFileSync('src/data/test-complet.json', JSON.stringify(testData, null, 2), 'utf8');

console.log(`\n✅ ${corrections} corrections effectuées`);
console.log('✅ Fichier src/data/test-complet.json mis à jour');
