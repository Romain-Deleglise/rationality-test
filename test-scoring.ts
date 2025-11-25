/**
 * Script de test automatisé pour vérifier le scoring de toutes les questions
 * Ce script simule toutes les réponses et vérifie que le scoring fonctionne correctement
 */

import testComplet from './src/data/test-complet.json';
import { scoreTest, scoreQuestion, scoreModule } from './src/lib/scoring';
import type { TestData, Module, Question, Answer } from './src/types';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

interface TestReport {
  totalQuestions: number;
  questionsWithIssues: number;
  issues: Array<{
    moduleId: string;
    moduleName: string;
    questionId: string;
    questionType: string;
    issue: string;
  }>;
  moduleReports: Array<{
    moduleId: string;
    moduleName: string;
    expectedPoints: number;
    calculatedPoints: number;
    questionCount: number;
    allCorrectScore: number;
    allWrongScore: number;
  }>;
}

/**
 * Génère une réponse correcte pour une question donnée
 */
function generateCorrectAnswer(question: Question): Answer {
  const value = (() => {
    switch (question.type) {
      case 'multiple-choice':
        return question.correct;

      case 'number':
        return question.correct;

      case 'confidence-interval':
        const target = Number(question.correct);
        // Donner un intervalle qui contient la bonne réponse
        return { min: target - 5, max: target + 5 };

      case 'ranking':
        // Si correct est défini, l'utiliser
        if (Array.isArray(question.correct)) {
          return question.correct;
        }
        // Sinon, pour les questions avec scoring.rule, on doit parser la règle
        if (question.scoring?.rule) {
          const match = question.scoring.rule.match(/option-(\d+)\s*>\s*option-(\d+)/);
          if (match && question.options) {
            const higher = parseInt(match[1], 10);
            const lower = parseInt(match[2], 10);
            // Créer un classement qui respecte la règle
            const ranking = Array.from({ length: question.options.length }, (_, i) => i);
            // S'assurer que higher vient avant lower
            const higherIdx = ranking.indexOf(higher);
            const lowerIdx = ranking.indexOf(lower);
            if (higherIdx > lowerIdx) {
              [ranking[higherIdx], ranking[lowerIdx]] = [ranking[lowerIdx], ranking[higherIdx]];
            }
            return ranking;
          }
        }
        // Par défaut, retourner l'ordre normal
        return question.options ? question.options.map((_, i) => i) : [];

      case 'likert':
        // Pour Likert (échelle 1-6), la bonne réponse dépend de reverse
        // reverse: true → correct = 6 (fortement d'accord avec affirmation rationnelle)
        // reverse: false → correct = 1 (fortement en désaccord avec affirmation irrationnelle)
        if (question.correct !== undefined && question.correct !== null) {
          return question.correct;
        }
        return question.reverse ? 6 : 1;

      case 'multiple-choice-confidence':
        return {
          choice: question.correct,
          confidence: 100 // Perfect calibration: 100% confidence for correct answers
        };

      case 'aggregate-estimate':
        // Pour les questions d'estimation agrégée avec toutes bonnes réponses,
        // on estime exactement ou légèrement en dessous pour être parfaitement calibré
        return question.aggregateTotal ? question.aggregateTotal : 0;

      default:
        console.warn(`${YELLOW}Type de question non géré: ${question.type}${RESET}`);
        return null;
    }
  })();

  return {
    questionId: question.id,
    value,
    timestamp: new Date()
  };
}

/**
 * Génère une réponse incorrecte pour une question donnée
 */
function generateWrongAnswer(question: Question): Answer {
  const value = (() => {
    switch (question.type) {
      case 'multiple-choice':
        // Choisir une réponse différente de la correcte
        const correctAnswer = question.correct as number;
        const optionsCount = question.options?.length || 2;
        return (correctAnswer + 1) % optionsCount;

      case 'number':
        // Donner une réponse complètement fausse
        const correctNum = Number(question.correct);
        return correctNum * 10 + 999;

      case 'confidence-interval':
        // Donner un intervalle qui ne contient pas la bonne réponse
        const target = Number(question.correct);
        return { min: target + 100, max: target + 200 };

      case 'ranking':
        // Inverser complètement l'ordre
        if (question.options) {
          return question.options.map((_, i) => question.options!.length - 1 - i);
        }
        return [];

      case 'likert':
        // Réponse opposée (échelle 1-6)
        if (question.correct !== undefined && question.correct !== null) {
          const correctLikert = Number(question.correct);
          return correctLikert === 1 ? 6 : 1;
        }
        return question.reverse ? 1 : 6;

      case 'multiple-choice-confidence':
        const correctAnswer2 = question.correct as number;
        const optionsCount2 = question.options?.length || 2;
        return {
          choice: (correctAnswer2 + 1) % optionsCount2,
          confidence: 50
        };

      case 'aggregate-estimate':
        // Donner une surestimation
        return question.aggregateTotal ? question.aggregateTotal * 2 : 100;

      default:
        return null;
    }
  })();

  return {
    questionId: question.id,
    value,
    timestamp: new Date()
  };
}

/**
 * Teste toutes les questions et génère un rapport
 */
function testAllQuestions(): TestReport {
  const data = testComplet as TestData;
  const report: TestReport = {
    totalQuestions: 0,
    questionsWithIssues: 0,
    issues: [],
    moduleReports: []
  };

  console.log(`${BOLD}${BLUE}=== TEST DE SCORING COMPLET ===${RESET}\n`);

  data.modules.forEach((module) => {
    console.log(`${BOLD}Module: ${module.name} (${module.id})${RESET}`);
    console.log(`Points annoncés: ${module.points}`);

    let totalPoints = 0;
    const moduleIssues: typeof report.issues = [];

    // Tester chaque question individuellement
    module.questions.forEach((question) => {
      report.totalQuestions++;
      totalPoints += question.points;

      // Ignorer les questions avec points: 0 (questions d'opinion, références)
      if (question.points === 0) {
        return;
      }

      // Vérifier que la question a une correction définie
      const hasCorrect = question.correct !== undefined && question.correct !== null;
      const hasScoringRule = question.scoring?.rule !== undefined;
      const isAggregate = question.type === 'aggregate-estimate';

      if (!hasCorrect && !hasScoringRule && !isAggregate) {
        const issue = {
          moduleId: module.id,
          moduleName: module.name,
          questionId: question.id,
          questionType: question.type,
          issue: "Pas de 'correct' ou 'scoring.rule' défini"
        };
        report.issues.push(issue);
        moduleIssues.push(issue);
        report.questionsWithIssues++;
        console.log(`  ${RED}✗${RESET} ${question.id} (${question.type}): ${issue.issue}`);
      }

      // Tester avec une bonne réponse
      const correctAnswer = generateCorrectAnswer(question);
      const correctScore = scoreQuestion(question, correctAnswer);

      // Tester avec une mauvaise réponse
      const wrongAnswer = generateWrongAnswer(question);
      const wrongScore = scoreQuestion(question, wrongAnswer);

      // Vérifier que le scoring a du sens
      if (correctScore.earned < 0 || correctScore.earned > correctScore.possible) {
        const issue = {
          moduleId: module.id,
          moduleName: module.name,
          questionId: question.id,
          questionType: question.type,
          issue: `Score invalide: earned=${correctScore.earned}, possible=${correctScore.possible}`
        };
        report.issues.push(issue);
        moduleIssues.push(issue);
        report.questionsWithIssues++;
        console.log(`  ${RED}✗${RESET} ${question.id}: ${issue.issue}`);
      }

      // Pour les questions non-Likert et non-aggregate, vérifier que bonne réponse > mauvaise réponse
      if (question.type !== 'likert' && question.type !== 'aggregate-estimate') {
        if (correctScore.earned <= wrongScore.earned && correctScore.earned < correctScore.possible) {
          const issue = {
            moduleId: module.id,
            moduleName: module.name,
            questionId: question.id,
            questionType: question.type,
            issue: `Bonne réponse (${correctScore.earned}) <= Mauvaise réponse (${wrongScore.earned})`
          };
          report.issues.push(issue);
          moduleIssues.push(issue);
          report.questionsWithIssues++;
          console.log(`  ${RED}✗${RESET} ${question.id}: ${issue.issue}`);
        }
      }
    });

    // Vérifier que la somme des points correspond
    if (Math.abs(totalPoints - module.points) > 0.1) {
      console.log(`  ${YELLOW}⚠${RESET} Somme des points (${totalPoints.toFixed(2)}) != points annoncés (${module.points})`);
    }

    // Tester le scoring du module complet avec toutes bonnes réponses
    const allCorrectAnswers = module.questions.map(q => generateCorrectAnswer(q));
    const moduleScoreCorrect = scoreModule(module, allCorrectAnswers);

    // Tester avec toutes mauvaises réponses
    const allWrongAnswers = module.questions.map(q => generateWrongAnswer(q));
    const moduleScoreWrong = scoreModule(module, allWrongAnswers);

    report.moduleReports.push({
      moduleId: module.id,
      moduleName: module.name,
      expectedPoints: module.points,
      calculatedPoints: totalPoints,
      questionCount: module.questions.length,
      allCorrectScore: moduleScoreCorrect.earned,
      allWrongScore: moduleScoreWrong.earned
    });

    console.log(`  Questions: ${module.questions.length}`);
    console.log(`  Somme des points: ${totalPoints.toFixed(2)}`);
    console.log(`  Score (toutes correctes): ${moduleScoreCorrect.earned.toFixed(2)}/${moduleScoreCorrect.possible.toFixed(2)} (${moduleScoreCorrect.percentage.toFixed(1)}%)`);
    console.log(`  Score (toutes fausses): ${moduleScoreWrong.earned.toFixed(2)}/${moduleScoreWrong.possible.toFixed(2)} (${moduleScoreWrong.percentage.toFixed(1)}%)`);

    if (moduleIssues.length > 0) {
      console.log(`  ${RED}${moduleIssues.length} problème(s) détecté(s)${RESET}`);
    } else {
      console.log(`  ${GREEN}✓ Aucun problème détecté${RESET}`);
    }
    console.log();
  });

  // Tester le scoring global
  console.log(`${BOLD}${BLUE}=== TEST GLOBAL ===${RESET}`);

  const allQuestions = data.modules.flatMap(m => m.questions);
  const allCorrectAnswers = allQuestions.map(q => generateCorrectAnswer(q));
  const globalScoreCorrect = scoreTest(data.modules, allCorrectAnswers, 'fr');

  const allWrongAnswers = allQuestions.map(q => generateWrongAnswer(q));
  const globalScoreWrong = scoreTest(data.modules, allWrongAnswers, 'fr');

  console.log(`Total questions: ${report.totalQuestions}`);
  console.log(`Points totaux annoncés: ${data.totalPoints}`);
  console.log(`Points totaux calculés: ${globalScoreCorrect.totalPossible.toFixed(2)}`);
  console.log(`Score (toutes correctes): ${globalScoreCorrect.totalEarned.toFixed(2)}/${globalScoreCorrect.totalPossible.toFixed(2)} (${globalScoreCorrect.percentage.toFixed(1)}%)`);
  console.log(`Score (toutes fausses): ${globalScoreWrong.totalEarned.toFixed(2)}/${globalScoreWrong.totalPossible.toFixed(2)} (${globalScoreWrong.percentage.toFixed(1)}%)`);
  console.log();

  // Résumé final
  console.log(`${BOLD}${BLUE}=== RÉSUMÉ ===${RESET}`);
  if (report.questionsWithIssues === 0) {
    console.log(`${GREEN}${BOLD}✓ TOUS LES TESTS SONT PASSÉS !${RESET}`);
    console.log(`${GREEN}Toutes les ${report.totalQuestions} questions sont correctement scorées.${RESET}`);
  } else {
    console.log(`${RED}${BOLD}✗ ${report.questionsWithIssues} PROBLÈME(S) DÉTECTÉ(S)${RESET}`);
    console.log();
    console.log(`${BOLD}Liste des problèmes:${RESET}`);
    report.issues.forEach((issue, i) => {
      console.log(`${i + 1}. ${YELLOW}[${issue.moduleId}]${RESET} ${issue.questionId} (${issue.questionType}): ${issue.issue}`);
    });
  }
  console.log();

  return report;
}

// Exécuter les tests
try {
  const report = testAllQuestions();

  // Exit code pour CI/CD
  process.exit(report.questionsWithIssues > 0 ? 1 : 0);
} catch (error) {
  console.error(`${RED}${BOLD}ERREUR:${RESET}`, error);
  process.exit(1);
}
