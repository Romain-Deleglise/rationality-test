#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Charger le fichier test-complet.json
const testCompletPath = path.join(__dirname, 'src/data/test-complet.json');
const testComplet = JSON.parse(fs.readFileSync(testCompletPath, 'utf8'));

console.log('AJOUT DES EXPLICATIONS POUR LES QUESTIONS CONSPIRATIONNISTES\n');

// Explications pour les questions de croyances conspirationnistes
const conspiracyExplanations = {
  'conspiracy-1': "Il n'existe aucune preuve scientifique liant les vaccins à l'autisme. L'étude frauduleuse de Wakefield (1998) a été rétractée. De nombreuses études à grande échelle ont démontré l'absence de lien. Cette théorie du complot met en danger la santé publique.",
  'conspiracy-2': "Malgré des décennies d'observation du ciel par des millions de personnes, il n'existe aucune preuve vérifiable de visites extraterrestres. Les 'preuves cachées' relèvent de la pensée conspirationniste sans fondement empirique.",
  'conspiracy-3': "L'alunissage d'Apollo est l'un des événements les mieux documentés de l'histoire, avec des preuves multiples : témoignages, photos, échantillons lunaires, réflecteurs laser toujours utilisés. Les arguments conspirationnistes ont tous été réfutés scientifiquement.",
  'conspiracy-4': "Le consensus scientifique sur le changement climatique anthropique est écrasant (97%+ des climatologues). Les preuves proviennent de multiples sources indépendantes et convergentes. Cette théorie du complot ignore des décennies de recherche rigoureuse.",
  'conspiracy-5': "Les traînées d'avion (contrails) sont de la vapeur d'eau condensée, un phénomène atmosphérique bien compris. Il n'existe aucune preuve de 'chemtrails' chimiques. Cette théorie repose sur une incompréhension de la météorologie.",
  'conspiracy-6': "La forme sphérique de la Terre est établie depuis l'Antiquité et confirmée par des preuves convergentes : navigation, astrophysique, photos satellites, voyages spatiaux. La théorie de la Terre plate ignore des millénaires de preuves scientifiques.",
  'conspiracy-7': "Bien que des organisations internationales existent (ONU, UE), il n'existe aucune preuve d'un complot secret pour un gouvernement mondial unique. Cette théorie relève de la pensée conspirationniste paranoïaque sans fondement factuel.",
  'conspiracy-8': "Il n'existe aucune preuve scientifique de technologies de contrôle mental à grande échelle. Les neurosciences montrent que le contrôle mental tel que décrit par les conspirationnistes est scientifiquement impossible avec la technologie actuelle.",
  'conspiracy-9': "Les entreprises pharmaceutiques ont un intérêt économique à développer des remèdes efficaces (brevets lucratifs). Cacher un remède contre le cancer serait impossible (trop de personnes impliquées) et contre-productif économiquement. Cette théorie ignore la réalité de la recherche médicale.",
  'conspiracy-10': "Il n'existe aucune preuve de l'existence des Illuminati comme organisation contrôlant secrètement le monde. Cette théorie du complot confond coïncidences, symbolisme artistique et réalité politique complexe.",
  'conspiracy-11': "Bien que des expérimentations contraires à l'éthique aient existé historiquement (Tuskegee, MKUltra), les cadres éthiques modernes et la surveillance rendent de telles pratiques extrêmement difficiles. Généraliser cela en complot massif actuel est injustifié et relève de la pensée conspirationniste."
};

let corrections = 0;

// Parcourir tous les modules
testComplet.modules.forEach((module) => {
  if (module.id === 'conspiracy') {
    console.log(`Module trouvé: ${module.name}\n`);

    module.questions.forEach((question) => {
      if (!question.explanation && conspiracyExplanations[question.id]) {
        question.explanation = conspiracyExplanations[question.id];
        corrections++;
        console.log(`✓ Ajout explication pour ${question.id}`);
      }
    });
  }
});

// Sauvegarder le fichier modifié
fs.writeFileSync(testCompletPath, JSON.stringify(testComplet, null, 2), 'utf8');

console.log(`\n✅ TERMINÉ - ${corrections} explications ajoutées`);
console.log(`Fichier sauvegardé: ${testCompletPath}`);
