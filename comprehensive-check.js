#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 VÉRIFICATION EXHAUSTIVE DE TOUTES LES QUESTIONS\n');
console.log('═'.repeat(100));

const files = [
  { path: 'src/data/test-court.json', name: 'Version Courte FR' },
  { path: 'src/data/test-court-en.json', name: 'Version Courte EN' },
  { path: 'src/data/test-complet.json', name: 'Version Complète FR' },
  { path: 'src/data/test-complet-en.json', name: 'Version Complète EN' },
];

let totalQuestions = 0;
let totalIssues = 0;
const issues = [];

files.forEach(file => {
  console.log(`\n\n📄 ${file.name} (${file.path})`);
  console.log('─'.repeat(100));

  const data = JSON.parse(fs.readFileSync(file.path, 'utf8'));
  const modules = data.modules || [];

  modules.forEach(module => {
    module.questions.forEach(q => {
      totalQuestions++;
      const problems = [];

      // 1. Vérifier que la question a un texte
      if (!q.text || q.text.trim().length === 0) {
        problems.push('❌ Pas de texte de question');
      }

      // 2. Vérifier selon le type
      switch (q.type) {
        case 'multiple-choice':
          // Doit avoir des options
          if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
            problems.push('❌ Pas d\'options pour question à choix multiples');
          }

          // Doit avoir une réponse correcte (sauf questions spéciales)
          if (q.correct === undefined || q.correct === null) {
            if (q.points !== 0 && !q.pairId) {
              problems.push('⚠️  Pas de réponse correcte définie');
            }
          } else {
            // Vérifier que l'index correct est valide
            if (q.options && (q.correct < 0 || q.correct >= q.options.length)) {
              problems.push(`❌ Index correct (${q.correct}) hors limites (0-${q.options.length - 1})`);
            }

            // Vérifier cohérence avec l'explication
            if (q.explanation && q.options && q.options[q.correct]) {
              const correctText = q.options[q.correct].toLowerCase();
              const explanation = q.explanation.toLowerCase();

              // Détecter incohérences évidentes
              if (explanation.includes('toujours') && !correctText.includes('toujours') && correctText.includes('environ')) {
                problems.push('⚠️  Incohérence possible entre réponse et explication');
              }
            }
          }
          break;

        case 'number':
          if (q.correct === undefined || q.correct === null) {
            problems.push('❌ Pas de réponse correcte pour question numérique');
          } else {
            const correctNum = Number(q.correct);
            if (isNaN(correctNum) && typeof q.correct !== 'string') {
              problems.push('❌ Réponse correcte n\'est pas un nombre valide');
            }
          }
          break;

        case 'likert':
          const hasCorrect = q.correct !== undefined && q.correct !== null;
          const hasReverse = q.reverse !== undefined && q.reverse !== null;
          const isOpinion = q.points === 0;

          if (!hasCorrect && !hasReverse && !isOpinion) {
            problems.push('❌ Question likert sans "correct" ni "reverse"');
          }

          // Vérifier cohérence reverse avec le texte
          if (hasReverse && q.text) {
            const text = q.text.toLowerCase();
            const hasNegation = text.includes('n\'est pas') || text.includes('ne sont pas') ||
                                text.includes('isn\'t') || text.includes('aren\'t') ||
                                text.includes('cannot') || text.includes('ne peut pas');

            // Si reverse=true, le texte devrait souvent contenir une négation (mais pas toujours)
            if (q.reverse && !hasNegation && q.points > 0) {
              // Juste une note, pas forcément une erreur
            }
          }
          break;

        case 'ranking':
          const hasCorrectArray = Array.isArray(q.correct);
          const hasScoring = q.scoring && q.scoring.rule;

          if (!hasCorrectArray && !hasScoring) {
            problems.push('❌ Question ranking sans "correct" ni "scoring.rule"');
          }

          if (hasScoring && q.scoring.rule) {
            // Vérifier format de la règle
            const rule = q.scoring.rule;
            if (!rule.match(/option-\d+\s*>\s*option-\d+/)) {
              problems.push(`❌ Format de règle invalide: "${rule}"`);
            }

            // Vérifier que les indices référencés existent
            const matches = rule.match(/option-(\d+)/g);
            if (matches && q.options) {
              matches.forEach(m => {
                const idx = parseInt(m.split('-')[1], 10);
                if (idx >= q.options.length) {
                  problems.push(`❌ Règle référence option-${idx} mais seulement ${q.options.length} options`);
                }
              });
            }
          }

          if (!q.options || q.options.length < 2) {
            problems.push('❌ Question ranking avec moins de 2 options');
          }
          break;

        case 'confidence-interval':
          if (q.correct === undefined || q.correct === null) {
            problems.push('❌ Pas de réponse correcte pour intervalle de confiance');
          }
          break;
      }

      // 3. Vérifier points
      if (q.points === undefined || q.points === null) {
        problems.push('⚠️  Pas de points définis');
      } else if (q.points < 0) {
        problems.push('❌ Points négatifs');
      }

      // 4. Vérifier cohérence entre question FR et EN (si applicable)
      // (on fera ça dans une passe séparée)

      // Enregistrer les problèmes
      if (problems.length > 0) {
        totalIssues += problems.length;
        issues.push({
          file: file.name,
          module: module.name,
          questionId: q.id,
          questionType: q.type,
          questionText: q.text.substring(0, 80) + '...',
          problems: problems
        });

        console.log(`\n🔴 ${q.id} (${q.type})`);
        problems.forEach(p => console.log(`   ${p}`));
      }
    });
  });

  console.log(`\n✓ Vérifié ${modules.reduce((sum, m) => sum + m.questions.length, 0)} questions`);
});

console.log('\n\n' + '═'.repeat(100));
console.log(`\n📊 RÉSUMÉ FINAL:`);
console.log(`   Total questions vérifiées: ${totalQuestions}`);
console.log(`   Problèmes détectés: ${totalIssues}`);

if (totalIssues === 0) {
  console.log('\n✅ PARFAIT ! Toutes les questions sont cohérentes et correctement configurées.');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${totalIssues} problème(s) détecté(s). Voir détails ci-dessus.`);

  // Grouper par type de problème
  const byType = {};
  issues.forEach(issue => {
    issue.problems.forEach(p => {
      const key = p.split(' ')[0]; // Prendre le premier mot (❌ ou ⚠️)
      if (!byType[key]) byType[key] = [];
      byType[key].push(issue);
    });
  });

  console.log('\n📋 Problèmes par catégorie:');
  Object.keys(byType).forEach(key => {
    console.log(`   ${key} ${byType[key].length} occurrence(s)`);
  });

  process.exit(1);
}
