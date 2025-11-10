import { Module, Question, Answer } from '@/types';

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
 */
/**
 * Calcule le score pour une question
 */
export function scoreQuestion(
  question: Question,
  answer: Answer
): QuestionScore {
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
  if (question.correct === undefined || question.correct === null) {
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
        correct = answer.value === question.correct;
        earned = correct ? possible : 0;
        break;

      case 'number':
        const userAnswer = Number(answer.value);
        const correctAnswer = Number(question.correct);
        
        if (isNaN(userAnswer) || isNaN(correctAnswer)) {
          console.warn(`Question ${question.id}: réponse ou correction invalide`);
          break;
        }
        
        const tolerance = question.tolerance || 0;
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
        const target = Number(question.correct);
        
        if (isNaN(min) || isNaN(max) || isNaN(target)) {
          break;
        }
        
        const contains = min <= target && target <= max;
        
        if (contains) {
          const width = max - min;
          const expectedWidth = Number(question.tolerance || 100);
          const wellCalibrated = width <= expectedWidth * 2;
          earned = wellCalibrated ? possible : possible * 0.5;
          correct = true;
        }
        break;

      case 'ranking':
        const userRanking = answer.value as number[];
        // Corriger le cast pour gérer string | number
        const correctRanking = Array.isArray(question.correct) 
          ? question.correct as number[]
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
        const correctLikert = Number(question.correct);
        
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
        
        const choiceCorrect = choice === question.correct;
        
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
  answers: Answer[]
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
    return scoreQuestion(question, answer);
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
  answers: Answer[]
): TestScore {
  const moduleScores = modules.map((module) => scoreModule(module, answers));

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
  const interpretation = getInterpretation(percentage);

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
function getInterpretation(percentage: number): string {
  if (percentage >= 90) {
    return 'Excellent - Raisonnement hautement rationnel avec très peu de biais cognitifs détectés.';
  } else if (percentage >= 75) {
    return 'Très bon - Bon niveau de raisonnement rationnel avec quelques biais mineurs.';
  } else if (percentage >= 60) {
    return 'Bon - Raisonnement généralement rationnel mais avec des domaines à améliorer.';
  } else if (percentage >= 45) {
    return 'Moyen - Présence de plusieurs biais cognitifs importants. Formation recommandée.';
  } else {
    return 'Faible - Nombreux biais cognitifs détectés. Une formation approfondie est fortement recommandée.';
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