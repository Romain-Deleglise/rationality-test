#!/usr/bin/env node

const court = require('./src/data/test-court.json');
const complet = require('./src/data/test-complet.json');

console.log('=== TEST COURT ===');
const likertCourt = court.modules.flatMap(m => m.questions).filter(q => q.type === 'likert');
console.log('Total Likert:', likertCourt.length);
console.log('Avec points > 0.5:', likertCourt.filter(q => q.points > 0.5).length);
console.log('Avec points <= 0.5:', likertCourt.filter(q => q.points <= 0.5).length);

console.log('\n=== TEST COMPLET ===');
const likertComplet = complet.modules.flatMap(m => m.questions).filter(q => q.type === 'likert');
console.log('Total Likert:', likertComplet.length);
console.log('Avec points > 0.5:', likertComplet.filter(q => q.points > 0.5).length);
console.log('Avec points <= 0.5:', likertComplet.filter(q => q.points <= 0.5).length);

const likertAvecPoints = likertComplet.filter(q => q.points > 0.5);
if (likertAvecPoints.length > 0) {
  console.log('\n=== EXEMPLES LIKERT AVEC POINTS > 0.5 ===');
  likertAvecPoints.slice(0, 3).forEach(q => {
    console.log(`\nID: ${q.id}`);
    console.log(`Text: ${q.text.substring(0, 80)}...`);
    console.log(`Reverse: ${q.reverse}`);
    console.log(`Points: ${q.points}`);
  });
}

// Chercher les questions "paranormal" mentionnées dans mon analyse
const allQuestions = complet.modules.flatMap(m => m.questions);
console.log('\n=== RECHERCHE QUESTIONS PARANORMAL ===');
const paranormal = allQuestions.filter(q =>
  q.text && (
    q.text.toLowerCase().includes('astrologie') ||
    q.text.toLowerCase().includes('fantôme') ||
    q.text.toLowerCase().includes('pensée')
  )
);
console.log('Questions trouvées:', paranormal.length);
paranormal.forEach(q => {
  console.log(`\nID: ${q.id}, Type: ${q.type}, Points: ${q.points}`);
  console.log(`Text: ${q.text.substring(0, 100)}...`);
  if (q.reverse !== undefined) console.log(`Reverse: ${q.reverse}`);
});
