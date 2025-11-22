#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Charger le fichier test-complet.json
const testCompletPath = path.join(__dirname, 'src/data/test-complet.json');
const testComplet = JSON.parse(fs.readFileSync(testCompletPath, 'utf8'));

console.log('CORRECTION DU TEST COMPLET\n');

let corrections = 0;

// Explications pour les questions de pensée superstitieuse
const superExplanations = {
  'super-1': "La télékinésie (influencer des objets par la pensée) n'a jamais été démontrée scientifiquement malgré de nombreuses études. C'est une croyance superstitieuse sans fondement empirique.",
  'super-2': "L'astrologie n'a aucun fondement scientifique. Les études contrôlées montrent que les prédictions astrologiques ne sont pas plus précises que le hasard.",
  'super-3': "En effet, la télépathie (lecture de pensée) n'a jamais été démontrée de manière reproductible dans des conditions contrôlées. C'est une croyance pseudoscientifique.",
  'super-4': "La précognition (prédire l'avenir de manière précise et systématique) n'a jamais été validée scientifiquement. Les prédictions correctes peuvent s'expliquer par le hasard, le biais de confirmation ou des prédictions vagues.",
  'super-5': "Il n'existe aucune preuve scientifique de l'existence de fantômes ou d'esprits. Les phénomènes paranormaux rapportés peuvent s'expliquer par des causes naturelles, des hallucinations ou des erreurs de perception.",
  'super-6': "Les porte-bonheur n'ont aucun effet causal sur les événements. L'impression qu'ils fonctionnent relève du biais de confirmation et de l'illusion de contrôle.",
  'super-7': "La communication avec les morts n'a jamais été démontrée scientifiquement. Les médiums utilisent des techniques de lecture froide et d'autres astuces psychologiques.",
  'super-8': "Les rêves prémonitoires apparents sont effectivement des coïncidences. Nous rêvons de nombreuses choses chaque nuit, et occasionnellement certaines correspondent à des événements futurs par pur hasard.",
  'super-9': "Les pouvoirs psychiques (ESP, télékinésie, etc.) n'ont jamais été démontrés dans des conditions contrôlées malgré des décennies de recherche. Les effets apparents relèvent de biais cognitifs ou de fraude.",
  'super-10': "Les cristaux et pierres n'ont aucun pouvoir de guérison démontré au-delà de l'effet placebo. C'est une croyance New Age sans fondement scientifique."
};

// Explications pour les questions d'attitudes anti-science
const scienceExplanations = {
  'science-1': "La méthode scientifique est le meilleur outil dont nous disposons pour comprendre la réalité objective. Elle repose sur l'observation, l'expérimentation et la falsifiabilité.",
  'science-2': "La connaissance scientifique est la forme de connaissance la plus fiable car elle est testée empiriquement, reproductible et auto-correctrice. Faire confiance à la science est rationnel.",
  'science-3': "Les scientifiques peuvent avoir des opinions personnelles, mais la méthode scientifique intègre des garde-fous (revue par les pairs, reproductibilité) pour minimiser les biais. La science est plus fiable que l'opinion personnelle.",
  'science-4': "La science progresse en questionnant et en révisant ses théories face à de nouvelles preuves. Ce processus d'auto-correction est une force, pas une faiblesse.",
  'science-5': "Les vaccins sont l'une des interventions médicales les mieux étudiées et les plus sûres. Le consensus scientifique sur leur sécurité et efficacité est écrasant.",
  'science-6': "Le consensus scientifique reflète l'accumulation de preuves empiriques convergentes. Bien qu'il puisse évoluer, il représente notre meilleure compréhension actuelle.",
  'science-7': "Les théories scientifiques (comme l'évolution ou la gravité) sont des explications bien établies et testées, pas de simples suppositions. Le terme 'théorie' en science signifie un cadre explicatif robuste.",
  'science-8': "Les études scientifiques à grande échelle et bien contrôlées sont plus fiables que l'expérience personnelle, qui est sujette à de nombreux biais cognitifs (confirmation, disponibilité, etc.).",
  'science-9': "Les médicaments modernes sont testés rigoureusement par des essais cliniques contrôlés. Bien qu'imparfaits, ils sont beaucoup plus fiables et sûrs que les remèdes traditionnels non testés.",
  'science-10': "Le consensus scientifique sur le changement climatique anthropique est écrasant (97%+ des climatologues). Les preuves proviennent de multiples sources indépendantes et convergentes.",
  'science-11': "La biologie évolutive est l'un des domaines scientifiques les mieux établis, avec des preuves convergentes de la paléontologie, la génétique, la biologie moléculaire, etc."
};

// Explications pour les questions de pensée dysfonctionnelle
const dysfuncExplanations = {
  'dysfunc-1': "Cette croyance est irrationnelle car il est impossible d'être aimé par tous. Les personnes rationnelles acceptent qu'il est normal de ne pas plaire à tout le monde.",
  'dysfunc-2': "Exiger la perfection dans tout est irréaliste et source d'anxiété. Il est plus rationnel d'accepter que l'erreur est humaine et de viser l'excellence plutôt que la perfection.",
  'dysfunc-3': "Cette généralisation excessive est irrationnelle. Un échec dans un domaine ne signifie pas l'échec total. Il est plus rationnel de voir les échecs comme des opportunités d'apprentissage spécifiques.",
  'dysfunc-4': "Blâmer sévèrement les autres pour leurs erreurs est contre-productif et ignore la complexité des comportements humains. Une approche plus rationnelle reconnaît que les comportements ont des causes multiples.",
  'dysfunc-5': "Cette croyance reflète une pensée catastrophique irrationnelle. Les problèmes ont des degrés de gravité variables, et tout voir comme 'terrible' empêche une évaluation réaliste.",
  'dysfunc-6': "Cette croyance reflète un locus de contrôle externe excessif. Bien que les circonstances influencent notre vie, nous avons un certain degré de contrôle et de responsabilité.",
  'dysfunc-7': "Éviter les difficultés est plus facile à court terme mais empêche la croissance et la résolution de problèmes. Il est plus rationnel d'affronter les défis.",
  'dysfunc-8': "Cette dépendance excessive aux autres est irrationnelle. Les adultes rationnels développent leur autonomie tout en maintenant des relations saines.",
  'dysfunc-9': "Cette croyance reflète une pensée dichotomique (tout ou rien) irrationnelle. La réalité est plus nuancée, et une solution imparfaite vaut mieux que l'inaction."
};

// Explications pour les questions d'évaluation d'arguments
const argEvalExplanations = {
  'arg-eval-1a': "Un argument fort repose sur des preuves empiriques, pas seulement sur l'autorité ou la tradition. La qualité d'un raisonnement se mesure à la solidité de ses preuves et de sa logique.",
  'arg-eval-2a': "La pensée critique implique d'évaluer les arguments sur leur mérite intrinsèque (preuves, logique) plutôt que sur qui les présente. L'appel à l'autorité est un biais cognitif.",
  'arg-eval-2b': "Évaluer la force d'un argument nécessite d'examiner ses preuves et sa structure logique, indépendamment de la source. C'est un principe fondamental de la pensée rationnelle.",
  'arg-eval-3a': "Un raisonnement solide peut être jugé indépendamment de nos émotions personnelles sur le sujet. La pensée rationnelle sépare l'évaluation logique des réactions émotionnelles.",
  'arg-eval-3b': "La capacité à évaluer objectivement un argument même quand sa conclusion nous déplaît est une marque de pensée rationnelle et critique.",
  'arg-eval-4a': "La cohérence logique et les preuves sont les critères essentiels pour évaluer un argument, pas notre accord avec la conclusion. C'est le fondement de la pensée critique.",
  'arg-eval-4b': "Reconnaître la validité d'un argument avec lequel on n'est pas d'accord démontre une pensée rationnelle mature et la capacité de séparer logique et préférences personnelles."
};

// Explications pour les questions de cadrage (framing)
const framingExplanations = {
  'frame-1a': "Un produit décrit comme '95% efficace' et '5% d'échec' est mathématiquement identique. Les personnes rationnelles ne devraient pas être influencées par le cadrage positif ou négatif.",
  'frame-1b': "Un produit décrit comme '95% efficace' et '5% d'échec' est mathématiquement identique. Le cadrage négatif ne devrait pas changer votre évaluation rationnelle.",
  'frame-2a': "Cette question teste l'effet de cadrage (framing effect). La formulation en termes de vies sauvées influence vers l'option certaine (aversion au risque en contexte de gain).",
  'frame-2b': "Cette question est mathématiquement équivalente à la version 'cadre gain' mais formulée en termes de pertes. Les personnes rationnelles devraient faire le même choix dans les deux cas.",
  'frame-3a': "Un véhicule qui 'fonctionne 94% du temps' est identique à un véhicule qui 'dysfonctionne 6% du temps'. Le cadrage positif ne devrait pas influencer une évaluation rationnelle.",
  'frame-3b': "Cette formulation négative décrit exactement la même réalité que la version positive (94% de fonctionnement). Les personnes rationnelles évaluent la fiabilité indépendamment du cadrage.",
  'frame-4a': "Une viande décrite comme '75% maigre' est identique à '25% de matière grasse'. Le cadrage positif ne devrait pas influencer votre perception de la qualité.",
  'frame-4b': "Cette formulation en termes de matière grasse décrit le même produit que '75% maigre'. Une évaluation rationnelle devrait être identique dans les deux cas.",
  'frame-5a': "Un programme avec '90% de réussite' est identique à '10% d'échec'. Le cadrage positif ne devrait pas affecter votre jugement sur son efficacité.",
  'frame-5b': "Cette formulation en termes d'échec décrit le même taux de succès (90%). Les personnes rationnelles résistent à l'effet de cadrage et évaluent objectivement."
};

// Parcourir tous les modules et appliquer les corrections
testComplet.modules.forEach((module, modIndex) => {
  module.questions.forEach((question, qIndex) => {
    let modified = false;

    // Ajouter 'optimal' aux questions Likert qui n'en ont pas
    if (question.type === 'likert') {
      if (question.optimal === undefined) {
        // reverse: false -> optimal = 1 (fortement en désaccord avec affirmation irrationnelle)
        // reverse: true -> optimal = 7 (fortement d'accord avec affirmation rationnelle)
        question.optimal = question.reverse ? 7 : 1;
        modified = true;
        corrections++;
        console.log(`✓ Ajout optimal=${question.optimal} pour ${question.id} (reverse=${question.reverse})`);
      }

      // Ajouter les explications manquantes
      if (!question.explanation) {
        if (superExplanations[question.id]) {
          question.explanation = superExplanations[question.id];
          modified = true;
          corrections++;
          console.log(`✓ Ajout explication pour ${question.id}`);
        } else if (scienceExplanations[question.id]) {
          question.explanation = scienceExplanations[question.id];
          modified = true;
          corrections++;
          console.log(`✓ Ajout explication pour ${question.id}`);
        } else if (dysfuncExplanations[question.id]) {
          question.explanation = dysfuncExplanations[question.id];
          modified = true;
          corrections++;
          console.log(`✓ Ajout explication pour ${question.id}`);
        }
      }
    }

    // Ajouter explications aux questions d'évaluation d'arguments
    if (question.id && question.id.startsWith('arg-eval-') && !question.explanation) {
      if (argEvalExplanations[question.id]) {
        question.explanation = argEvalExplanations[question.id];
        modified = true;
        corrections++;
        console.log(`✓ Ajout explication pour ${question.id}`);
      }
    }

    // Ajouter explications aux questions de cadrage
    if (question.id && question.id.startsWith('frame-') && !question.explanation) {
      if (framingExplanations[question.id]) {
        question.explanation = framingExplanations[question.id];
        modified = true;
        corrections++;
        console.log(`✓ Ajout explication pour ${question.id}`);
      }
    }
  });
});

// Sauvegarder le fichier modifié
fs.writeFileSync(testCompletPath, JSON.stringify(testComplet, null, 2), 'utf8');

console.log(`\n✅ TERMINÉ - ${corrections} corrections appliquées`);
console.log(`Fichier sauvegardé: ${testCompletPath}`);
