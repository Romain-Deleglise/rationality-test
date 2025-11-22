#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Charger le fichier test-complet.json
const testCompletPath = path.join(__dirname, 'src/data/test-complet.json');
const testComplet = JSON.parse(fs.readFileSync(testCompletPath, 'utf8'));

console.log('# TOUTES LES QUESTIONS DU TEST LONG (test-complet.json)');
console.log();
console.log(`**Version:** ${testComplet.version}`);
console.log(`**Total de points:** ${testComplet.totalPoints}`);
console.log(`**Temps estimé:** ${testComplet.estimatedTime} minutes`);
console.log();
console.log('---');
console.log();

let questionGlobale = 0;

// Parcourir tous les modules
testComplet.modules.forEach((module, modIndex) => {
  console.log(`\n## MODULE ${modIndex + 1}: ${module.name}`);
  console.log();
  console.log(`**Points du module:** ${module.points}`);
  console.log(`**Temps estimé:** ${module.time} minutes`);
  console.log();

  module.questions.forEach((question, qIndex) => {
    questionGlobale++;
    console.log(`### Question ${questionGlobale} (ID: ${question.id})`);
    console.log();
    console.log(`**Type:** ${question.type}`);
    console.log();
    console.log(`**Question:**`);
    console.log(question.text || question.question || '(pas de texte)');
    console.log();

    // Afficher selon le type
    if (question.type === 'multiple-choice') {
      console.log(`**Options:**`);
      if (Array.isArray(question.options)) {
        if (typeof question.options[0] === 'string') {
          // Options simples (array de strings)
          question.options.forEach((opt, i) => {
            const marker = question.correct === i ? '**✓**' : '';
            console.log(`${String.fromCharCode(65 + i)}. ${opt} ${marker}`);
          });
        } else {
          // Options avec objets
          question.options.forEach((opt, i) => {
            const marker = opt.correct ? '**✓**' : '';
            console.log(`${String.fromCharCode(65 + i)}. ${opt.text} ${marker}`);
          });
        }
      }
      console.log();
      console.log(`**Réponse correcte:** ${question.correct !== undefined ? String.fromCharCode(65 + question.correct) : 'voir options marquées ci-dessus'}`);
      console.log();
      console.log(`**Points:** ${question.points}`);

    } else if (question.type === 'likert') {
      console.log(`**Échelle:**`);
      if (question.min !== undefined && question.max !== undefined) {
        console.log(`De ${question.min} à ${question.max}`);
      } else {
        console.log('Échelle Likert');
      }
      if (question.leftLabel) {
        console.log(`- Gauche: "${question.leftLabel}"`);
      }
      if (question.rightLabel) {
        console.log(`- Droite: "${question.rightLabel}"`);
      }
      console.log();
      console.log(`**Réponse optimale:** ${question.optimal !== undefined ? question.optimal : '(non définie)'}`);
      console.log();
      console.log(`**Points:** ${question.points}`);

    } else if (question.type === 'ranking') {
      console.log(`**Items à classer:**`);
      if (question.items) {
        question.items.forEach((item, i) => {
          const itemText = typeof item === 'string' ? item : item.text;
          console.log(`${i + 1}. ${itemText}`);
        });
      }
      console.log();
      if (question.correctOrder) {
        console.log(`**Ordre correct:** ${question.correctOrder.map((idx, pos) => `Position ${pos + 1} → Item ${idx + 1}`).join(', ')}`);
      } else {
        console.log(`**Ordre correct:** (non défini)`);
      }
      console.log();
      console.log(`**Points:** ${question.points}`);

    } else if (question.type === 'number' || question.type === 'numeric') {
      console.log(`**Type de réponse:** Numérique`);
      console.log();
      if (question.correctAnswer !== undefined) {
        console.log(`**Réponse correcte:** ${question.correctAnswer}`);
      } else {
        console.log(`**Réponse correcte:** (non définie)`);
      }
      if (question.tolerance !== undefined) {
        console.log(`**Tolérance:** ±${question.tolerance}`);
      }
      console.log();
      console.log(`**Points:** ${question.points}`);
    }

    console.log();
    console.log(`**Explication:**`);
    console.log(question.explanation || '(pas d\'explication)');
    console.log();
    console.log('---');
    console.log();
  });
});

console.log();
console.log(`**Total de questions:** ${questionGlobale}`);
