const fs = require('fs');

// Charger les fichiers JSON
const testDataFr = JSON.parse(fs.readFileSync('src/data/test-complet.json', 'utf8'));
const testDataEn = JSON.parse(fs.readFileSync('src/data/test-complet-en.json', 'utf8'));

console.log('=== REFORMULATION DES QUESTIONS POUR UNE SEULE RÉPONSE ===\n');

// FRANÇAIS
const sunkModuleFr = testDataFr.modules.find(m => m.id === 'sunk-cost');
if (sunkModuleFr) {
  const sunk1 = sunkModuleFr.questions.find(q => q.id === 'sunk-1');
  const sunk3 = sunkModuleFr.questions.find(q => q.id === 'sunk-3');

  // Question sunk-1 : Clarifier que c'est trop tard pour vendre
  if (sunk1) {
    console.log('✏️  sunk-1 (Concert) - FRANÇAIS');
    console.log('   Ancienne question : "Le jour du concert, vous tombez malade..."');
    console.log('   Nouvelle question : "Le concert commence dans 1 heure, vous tombez malade..."');

    sunk1.text = "Vous avez acheté un billet de concert à 80€. Le concert commence dans 1 heure, et vous tombez malade (fièvre, fatigue). Le concert ne vous remboursera pas, et il est trop tard pour vendre le billet.\n\nQue devriez-vous faire ?";

    sunk1.options = [
      "Aller au concert quand même pour ne pas perdre les 80€",
      "Rester chez vous vous reposer, les 80€ sont déjà perdus"
    ];

    sunk1.correct = 1;
    delete sunk1.correctAnswers;

    sunk1.explanation = "Les 80€ sont un coût irrécupérable (sunk cost). La décision rationnelle considère uniquement le futur : aller malade au concert vs rester chez vous pour guérir. Le passé (les 80€ déjà dépensés) ne doit pas influencer cette décision. Il est trop tard pour vendre le billet, donc cette option n'est pas disponible.";

    console.log('   ✅ Reformulée avec une seule bonne réponse (option b)\n');
  }

  // Question sunk-3 : Clarifier que le plat est vraiment immangeable
  if (sunk3) {
    console.log('✏️  sunk-3 (Plat cuisiné) - FRANÇAIS');
    console.log('   Ancienne question : "trop salé, immangeable"');
    console.log('   Nouvelle question : "BEAUCOUP trop salé, absolument immangeable"');

    sunk3.text = "Vous avez passé 3 heures à cuisiner un plat élaboré. En le goûtant, vous réalisez qu'il est complètement raté (BEAUCOUP trop salé, absolument immangeable, impossible à corriger). Vous pourriez commander à manger (15€, délicieux).\n\nQue faire ?";

    sunk3.options = [
      "Manger le plat raté pour ne pas gâcher les 3 heures de travail",
      "Commander à manger, les 3 heures sont déjà perdues"
    ];

    sunk3.correct = 1;
    delete sunk3.correctAnswers;

    sunk3.explanation = "Les 3 heures de cuisine sont un sunk cost. La décision rationnelle considère uniquement le futur : se forcer à manger quelque chose d'immangeable vs payer 15€ pour un bon repas. Le temps déjà passé ne doit pas influencer cette décision. Le plat étant impossible à corriger, cette option n'est pas disponible.";

    console.log('   ✅ Reformulée avec une seule bonne réponse (option b)\n');
  }
}

// ANGLAIS - Mêmes modifications
const sunkModuleEn = testDataEn.modules.find(m => m.id === 'sunk-cost');
if (sunkModuleEn) {
  const sunk1 = sunkModuleEn.questions.find(q => q.id === 'sunk-1');
  const sunk3 = sunkModuleEn.questions.find(q => q.id === 'sunk-3');

  if (sunk1) {
    console.log('✏️  sunk-1 (Concert) - ENGLISH');

    sunk1.text = "You bought a concert ticket for €80. The concert starts in 1 hour, and you fall ill (fever, fatigue). The concert won't refund you, and it's too late to sell the ticket.\n\nWhat should you do?";

    sunk1.options = [
      "Go to the concert anyway to not lose the €80",
      "Stay home to rest, the €80 are already lost"
    ];

    sunk1.correct = 1;
    delete sunk1.correctAnswers;

    sunk1.explanation = "The €80 is a sunk cost. The rational decision only considers the future: going to the concert while sick vs staying home to recover. The past (the €80 already spent) should not influence this decision. It's too late to sell the ticket, so that option is not available.";

    console.log('   ✅ Reformulated with single correct answer (option b)\n');
  }

  if (sunk3) {
    console.log('✏️  sunk-3 (Dish) - ENGLISH');

    sunk3.text = "You spent 3 hours cooking an elaborate dish. Upon tasting it, you realize it's completely ruined (WAY too salty, absolutely inedible, impossible to fix). You could order food (€15, delicious).\n\nWhat to do?";

    sunk3.options = [
      "Eat the ruined dish to not waste the 3 hours of work",
      "Order food, the 3 hours are already lost"
    ];

    sunk3.correct = 1;
    delete sunk3.correctAnswers;

    sunk3.explanation = "The 3 hours of cooking is a sunk cost. The rational decision only considers the future: forcing yourself to eat something inedible vs paying €15 for a good meal. The time already spent should not influence this decision. Since the dish is impossible to fix, that option is not available.";

    console.log('   ✅ Reformulated with single correct answer (option b)\n');
  }
}

// Sauvegarder les fichiers
fs.writeFileSync('src/data/test-complet.json', JSON.stringify(testDataFr, null, 2), 'utf8');
fs.writeFileSync('src/data/test-complet-en.json', JSON.stringify(testDataEn, null, 2), 'utf8');

console.log('✅ Fichiers JSON mis à jour');
console.log('✅ Questions reformulées avec une seule bonne réponse');
console.log('\n📝 Les options "vendre le billet" et "corriger le plat" ont été retirées');
console.log('📝 Le contexte a été clarifié pour qu\'une seule réponse soit rationnelle');
