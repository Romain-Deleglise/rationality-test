import { Module, Question, Answer } from '@/types';
import { getRandomizedQuestion } from './randomization';

// Types de scores
export interface QuestionScore {
  questionId: string;
  earned: number;
  possible: number;
  correct: boolean;
}

export interface ModuleScore {
  moduleId: string;
  moduleName: string;
  earned: number;
  possible: number;
  percentage: number;
  questions: QuestionScore[];
}

export interface TestScore {
  totalEarned: number;
  totalPossible: number;
  percentage: number;
  percentile?: number;
  modules: ModuleScore[];
  strengths: string[];
  weaknesses: string[];
  interpretation: string;
}

/**
 * Calcule le score pour une question
 * @param question The question to score
 * @param answer The user's answer
 * @param randomizedValues Optional randomized values from session (for questions with randomization)
 */
export function scoreQuestion(
  question: Question,
  answer: Answer,
  randomizedValues?: { [questionId: string]: { [key: string]: number | string } }
): QuestionScore {
  // Apply randomization if available
  const effectiveQuestion = getRandomizedQuestion(question, randomizedValues);
  let earned = 0;
  const possible = question.points || 1; // Défaut à 1 si pas défini
  let correct = false;

  // Si pas de réponse, score = 0
  if (!answer || answer.value === null || answer.value === undefined || answer.value === '') {
    return {
      questionId: question.id,
      earned: 0,
      possible,
      correct: false,
    };
  }

  // Si pas de correction définie, on ne peut pas scorer
  if (effectiveQuestion.correct === undefined || effectiveQuestion.correct === null) {
    console.warn(`Question ${question.id} n'a pas de correction définie`);
    return {
      questionId: question.id,
      earned: 0,
      possible,
      correct: false,
    };
  }

  try {
    switch (question.type) {
      case 'multiple-choice':
        correct = answer.value === effectiveQuestion.correct;
        earned = correct ? possible : 0;
        break;

      case 'number':
        const userAnswer = Number(answer.value);
        const correctAnswer = Number(effectiveQuestion.correct);

        if (isNaN(userAnswer) || isNaN(correctAnswer)) {
          console.warn(`Question ${question.id}: réponse ou correction invalide`);
          break;
        }

        const tolerance = effectiveQuestion.tolerance || 0;
        correct = Math.abs(userAnswer - correctAnswer) <= tolerance;
        earned = correct ? possible : 0;
        break;

      case 'confidence-interval':
        const interval = answer.value;
        if (!interval || !interval.min || !interval.max) {
          break;
        }

        const min = Number(interval.min);
        const max = Number(interval.max);
        const target = Number(effectiveQuestion.correct);

        if (isNaN(min) || isNaN(max) || isNaN(target)) {
          break;
        }

        const contains = min <= target && target <= max;

        if (contains) {
          const width = max - min;
          const expectedWidth = Number(effectiveQuestion.tolerance || 100);
          const wellCalibrated = width <= expectedWidth * 2;
          earned = wellCalibrated ? possible : possible * 0.5;
          correct = true;
        }
        break;

      case 'ranking':
        const userRanking = answer.value as number[];
        // Corriger le cast pour gérer string | number
        const correctRanking = Array.isArray(effectiveQuestion.correct)
          ? effectiveQuestion.correct as number[]
          : [];

        if (!Array.isArray(userRanking) || !Array.isArray(correctRanking) || correctRanking.length === 0) {
          break;
        }

        let matches = 0;
        for (let i = 0; i < Math.min(userRanking.length, correctRanking.length); i++) {
          if (userRanking[i] === correctRanking[i]) matches++;
        }
        const accuracy = userRanking.length > 0 ? matches / userRanking.length : 0;
        earned = possible * accuracy;
        correct = accuracy >= 0.8;
        break;

      case 'likert':
        const likertAnswer = Number(answer.value);
        const correctLikert = Number(effectiveQuestion.correct);
        
        if (isNaN(likertAnswer) || isNaN(correctLikert)) {
          break;
        }
        
        let distance: number;
        if (question.reverse) {
          const reversed = 7 - likertAnswer;
          distance = Math.abs(reversed - correctLikert);
        } else {
          distance = Math.abs(likertAnswer - correctLikert);
        }
        
        earned = possible * Math.max(0, 1 - distance / 5);
        correct = earned >= possible * 0.7;
        break;

      case 'multiple-choice-confidence':
        const choice = answer.value?.choice;
        const confidence = answer.value?.confidence;

        if (choice === undefined || confidence === undefined) {
          break;
        }

        const choiceCorrect = choice === effectiveQuestion.correct;
        
        if (choiceCorrect) {
          const confidenceBonus = confidence >= 80 ? 0.2 : 0;
          earned = possible * (1 + confidenceBonus);
        } else {
          const confidencePenalty = confidence >= 80 ? -0.2 : 0;
          earned = Math.max(0, confidencePenalty);
        }
        correct = choiceCorrect;
        break;

      default:
        console.warn(`Type de question non géré pour le scoring: ${question.type}`);
        break;
    }
  } catch (error) {
    console.error(`Erreur lors du scoring de la question ${question.id}:`, error);
  }

  // S'assurer que earned est un nombre valide
  const finalEarned = isNaN(earned) ? 0 : Math.max(0, Math.min(earned, possible));
  
  return {
    questionId: question.id,
    earned: finalEarned,
    possible,
    correct,
  };
}


export function scoreModule(
  module: Module,
  answers: Answer[],
  randomizedValues?: { [questionId: string]: { [key: string]: number | string } }
): ModuleScore {
  const questionScores = module.questions.map((question) => {
    const answer = answers.find((a) => a.questionId === question.id);
    if (!answer) {
      return {
        questionId: question.id,
        earned: 0,
        possible: question.points || 1,
        correct: false,
      };
    }
    return scoreQuestion(question, answer, randomizedValues);
  });

  const earned = questionScores.reduce((sum, qs) => sum + (qs.earned || 0), 0);
  const possible = questionScores.reduce((sum, qs) => sum + (qs.possible || 0), 0);

  // Protection contre division par zéro
  const percentage = possible > 0 ? (earned / possible) * 100 : 0;

  return {
    moduleId: module.id,
    moduleName: module.name,
    earned: isNaN(earned) ? 0 : earned,
    possible: isNaN(possible) ? 0 : possible,
    percentage: isNaN(percentage) ? 0 : percentage,
    questions: questionScores,
  };
}


 

export function scoreTest(
  modules: Module[],
  answers: Answer[],
  locale: string = 'fr',
  randomizedValues?: { [questionId: string]: { [key: string]: number | string } }
): TestScore {
  const moduleScores = modules.map((module) => scoreModule(module, answers, randomizedValues));

  const totalEarned = moduleScores.reduce((sum, ms) => sum + (ms.earned || 0), 0);
  const totalPossible = moduleScores.reduce((sum, ms) => sum + (ms.possible || 0), 0);

  // Protection contre division par zéro
  const percentage = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;

  // Identifier les forces et faiblesses
  const strengths = moduleScores
    .filter((ms) => ms.percentage >= 75 && ms.possible > 0)
    .map((ms) => ms.moduleName);

  const weaknesses = moduleScores
    .filter((ms) => ms.percentage < 50 && ms.possible > 0)
    .map((ms) => ms.moduleName);

  // Interprétation du score
  const interpretation = getInterpretation(percentage, locale);

  return {
    totalEarned: isNaN(totalEarned) ? 0 : totalEarned,
    totalPossible: isNaN(totalPossible) ? 0 : totalPossible,
    percentage: isNaN(percentage) ? 0 : percentage,
    modules: moduleScores,
    strengths,
    weaknesses,
    interpretation,
  };
}

/**
 * Interprétation du score global
 */
function getInterpretation(percentage: number, locale: string = 'fr'): string {
  const interpretations = {
    fr: {
      veryHigh: 'Score très élevé. Vous démontrez une excellente maîtrise des principes de raisonnement rationnel. Cependant, gardez à l\'esprit que connaître les biais ne garantit pas d\'y résister en situation réelle (fatigue, stress, émotions).',
      high: 'Score élevé. Vous avez acquis une bonne compréhension des erreurs de raisonnement courantes. Attention toutefois : les biais persistent même chez les experts. L\'utilisation de protocoles décisionnels reste recommandée pour les choix importants.',
      average: 'Score dans la moyenne. Vous identifiez correctement certains biais, mais d\'autres vous échappent encore. C\'est normal : la rationalité n\'est pas intuitive. Concentrez-vous sur vos faiblesses spécifiques plutôt que d\'essayer de tout améliorer à la fois.',
      belowAverage: 'Score sous la moyenne. Plusieurs biais cognitifs importants affectent votre raisonnement. L\'amélioration est possible mais modeste (10-25% sur 6-12 mois avec pratique intensive). Privilégiez l\'usage d\'outils externes (checklists, consultations) plutôt que de compter sur votre intuition améliorée.',
      limited: 'Score limité. Vos résultats suggèrent une forte susceptibilité aux biais cognitifs courants. Ne vous découragez pas : même des personnes très intelligentes obtiennent des scores similaires. La rationalité se travaille différemment de l\'intelligence générale. Commencez par comprendre les concepts de base avant d\'attendre une amélioration mesurable.',
      veryLimited: 'Score très limité. Vous présentez une forte susceptibilité aux biais cognitifs courants. Cela ne reflète pas votre intelligence générale - de nombreuses personnes intelligentes obtiennent des scores similaires. La recherche montre que l\'amélioration est possible mais modeste, et nécessite une pratique soutenue. Plutôt que de compter uniquement sur l\'amélioration personnelle, privilégiez l\'usage d\'outils externes (checklists, protocoles de décision, consultations) pour vos choix importants.'
    },
    en: {
      veryHigh: 'Very high score. You demonstrate excellent mastery of rational reasoning principles. However, keep in mind that knowing biases does not guarantee resistance to them in real situations (fatigue, stress, emotions).',
      high: 'High score. You have gained a good understanding of common reasoning errors. However, note that biases persist even among experts. The use of decision-making protocols remains recommended for important choices.',
      average: 'Average score. You correctly identify some biases, but others still escape you. This is normal: rationality is not intuitive. Focus on your specific weaknesses rather than trying to improve everything at once.',
      belowAverage: 'Below average score. Several important cognitive biases affect your reasoning. Improvement is possible but modest (10-25% over 6-12 months with intensive practice). Prioritize the use of external tools (checklists, consultations) rather than relying on improved intuition.',
      limited: 'Limited score. Your results suggest strong susceptibility to common cognitive biases. Don\'t be discouraged: even very intelligent people get similar scores. Rationality works differently from general intelligence. Start by understanding the basic concepts before expecting measurable improvement.',
      veryLimited: 'Very limited score. You show strong susceptibility to common cognitive biases. This does not reflect your general intelligence - many intelligent people get similar scores. Research shows that improvement is possible but modest, and requires sustained practice. Rather than relying solely on personal improvement, prioritize the use of external tools (checklists, decision protocols, consultations) for your important choices.'
    }
  };

  const lang = (locale === 'en' ? 'en' : 'fr') as 'fr' | 'en';
  const texts = interpretations[lang];

  if (percentage >= 90) {
    return texts.veryHigh;
  } else if (percentage >= 75) {
    return texts.high;
  } else if (percentage >= 60) {
    return texts.average;
  } else if (percentage >= 45) {
    return texts.belowAverage;
  } else if (percentage >= 30) {
    return texts.limited;
  } else {
    return texts.veryLimited;
  }
}

/**
 * Calcule le percentile approximatif (basé sur des données synthétiques)
 * TODO: Remplacer par des vraies données une fois qu'on a une base de données
 */
export function calculatePercentile(percentage: number): number {
  // Distribution approximative basée sur la littérature CART
  // Moyenne ~60%, écart-type ~15%
  
  if (percentage >= 90) return 99;
  if (percentage >= 80) return 95;
  if (percentage >= 75) return 85;
  if (percentage >= 70) return 75;
  if (percentage >= 65) return 65;
  if (percentage >= 60) return 50;
  if (percentage >= 55) return 40;
  if (percentage >= 50) return 30;
  if (percentage >= 45) return 20;
  if (percentage >= 40) return 10;
  return 5;
}