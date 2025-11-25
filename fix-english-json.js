const fs = require('fs');

// Charger le fichier JSON anglais
const testDataEn = JSON.parse(fs.readFileSync('src/data/test-complet-en.json', 'utf8'));

console.log('=== CORRECTION DU FICHIER ANGLAIS ===\n');

let corrections = 0;

// 1. Corriger les points totaux de chaque module
console.log('1. CORRECTION DES POINTS TOTAUX DES MODULES\n');

testDataEn.modules.forEach(module => {
  const calculatedPoints = module.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  const roundedCalculated = Math.round(calculatedPoints * 100) / 100;
  const declaredPoints = module.points || 0;
  const diff = Math.abs(roundedCalculated - declaredPoints);

  if (diff > 0.01) {
    console.log(`✏️  ${module.name}:`);
    console.log(`   Before: ${declaredPoints} → After: ${roundedCalculated}`);
    module.points = roundedCalculated;
    corrections++;
  }
});

// 2. Corriger les questions de coûts irrécupérables
console.log('\n2. CORRECTION DES QUESTIONS SUNK COST\n');

const sunkModule = testDataEn.modules.find(m => m.id === 'sunk-cost');
if (sunkModule) {
  // Question sunk-1
  const sunk1 = sunkModule.questions.find(q => q.id === 'sunk-1');
  if (sunk1) {
    console.log('✏️  sunk-1 (Concert):');
    console.log('   Change: correct: 1 → correctAnswers: [1, 2]');
    console.log('   Both "Stay home" and "Sell the ticket" are accepted');

    sunk1.correctAnswers = [1, 2];
    delete sunk1.correct;

    sunk1.explanation = "The 80€ is a sunk cost. The rational decision only considers the future. Two options are rational: (1) Stay home to rest and recover, or (2) Try to sell the ticket to recover the money. The key is NOT to go to the concert just because you paid.";
    corrections++;
  }

  // Question sunk-3
  const sunk3 = sunkModule.questions.find(q => q.id === 'sunk-3');
  if (sunk3) {
    console.log('\n✏️  sunk-3 (Dish):');
    console.log('   Change: correct: 1 → correctAnswers: [1, 2]');
    console.log('   Both "Order food" and "Try to fix the dish" are accepted');

    sunk3.correctAnswers = [1, 2];
    delete sunk3.correct;

    sunk3.explanation = "The 3 hours of cooking is a sunk cost. Two options are rational: (1) Order food to have a good meal, or (2) Try to fix the dish if possible (e.g., dilute with unsalted ingredients). The key is NOT to force yourself to eat something inedible just to 'not waste' the time spent.";
    corrections++;
  }
}

// 3. Recalculer le total de points du test
const newTotalPoints = testDataEn.modules.reduce((sum, m) => sum + (m.points || 0), 0);
const roundedTotal = Math.round(newTotalPoints * 100) / 100;

console.log('\n3. UPDATING TOTAL POINTS\n');
console.log(`   Before: ${testDataEn.totalPoints} → After: ${roundedTotal}`);
testDataEn.totalPoints = roundedTotal;

// 4. Sauvegarder le fichier corrigé
fs.writeFileSync('src/data/test-complet-en.json', JSON.stringify(testDataEn, null, 2), 'utf8');

console.log(`\n✅ ${corrections} corrections made`);
console.log('✅ File src/data/test-complet-en.json updated');
