const fs = require('fs');

// Charger le fichier JSON corrigé
const testData = JSON.parse(fs.readFileSync('src/data/test-complet.json', 'utf8'));

console.log('=== RÉGÉNÉRATION DU MARKDOWN ===\n');

let markdown = '# Test de Rationalité - Questions Complètes (Version Mise à Jour)\n\n';
markdown += `**Version:** ${testData.version}\n`;
markdown += `**Points totaux:** ${testData.totalPoints}\n`;
markdown += `**Temps estimé:** ${testData.estimatedTime} minutes\n\n`;
markdown += '---\n\n';

let questionCounter = 0;

testData.modules.forEach((module, moduleIndex) => {
  // En-tête du module
  markdown += `## ${module.name}\n\n`;
  markdown += `**Points:** ${module.points} | **Temps:** ${module.time} min\n\n`;

  // Questions du module
  module.questions.forEach((question, questionIndex) => {
    questionCounter++;

    markdown += `### Question ${questionCounter} (ID: ${question.id})\n\n`;
    markdown += `**Type:** ${getQuestionTypeName(question.type)}\n\n`;
    markdown += `**Question:**\n\n${question.text}\n\n`;

    // Options (pour les questions à choix multiples)
    if (question.options && question.options.length > 0) {
      markdown += `**Options:**\n\n`;
      question.options.forEach((option, i) => {
        markdown += `${String.fromCharCode(97 + i)}. ${option}\n`;
      });
      markdown += '\n';
    }

    // Réponse correcte
    if (question.correctAnswers && Array.isArray(question.correctAnswers)) {
      // Plusieurs réponses correctes
      const correctLetters = question.correctAnswers.map(i => String.fromCharCode(97 + i));
      markdown += `**Réponses correctes:** ${correctLetters.join(', ')}\n\n`;
    } else if (question.correct !== undefined && question.correct !== null) {
      if (typeof question.correct === 'number' && question.options) {
        // Choix multiple avec une seule réponse
        markdown += `**Réponse correcte:** ${String.fromCharCode(97 + question.correct)}\n\n`;
      } else if (Array.isArray(question.correct)) {
        // Ranking
        markdown += `**Ordre correct:** ${question.correct.join(', ')}\n\n`;
      } else {
        // Autre type (nombre, etc.)
        markdown += `**Réponse correcte:** ${question.correct}${question.unit ? ' ' + question.unit : ''}\n\n`;
      }
    }

    // Explication
    if (question.explanation) {
      markdown += `**Explication:**\n\n${question.explanation}\n\n`;
    }

    // Points
    markdown += `**Points:** ${question.points}\n\n`;

    // Informations supplémentaires selon le type
    if (question.type === 'confidence-interval') {
      markdown += `*Vous devez donner un intervalle de confiance à 80% (min - max).*\n\n`;
    }

    if (question.type === 'likert') {
      markdown += `*Échelle : 1 (Fortement en désaccord) à ${question.reverse ? 7 : 6} (Fortement d'accord)*\n\n`;
    }

    if (question.anchorType) {
      markdown += `*Question d'ancrage (${question.anchorType === 'low' ? 'ancre basse' : 'ancre haute'})*\n\n`;
    }

    markdown += '---\n\n';
  });
});

// Sauvegarder le fichier
fs.writeFileSync('questions-test-complet-updated.md', markdown, 'utf8');

console.log('✅ Markdown régénéré avec succès !');
console.log(`   ${testData.modules.length} modules`);
console.log(`   ${questionCounter} questions`);
console.log(`   ${testData.totalPoints} points totaux`);

function getQuestionTypeName(type) {
  const typeNames = {
    'multiple-choice': 'Choix multiple',
    'number': 'Numérique',
    'confidence-interval': 'Intervalle de confiance',
    'ranking': 'Classement',
    'likert': 'Échelle de Likert',
    'multiple-choice-confidence': 'Choix multiple avec confiance',
    'aggregate-estimate': 'Estimation agrégée'
  };
  return typeNames[type] || type;
}
