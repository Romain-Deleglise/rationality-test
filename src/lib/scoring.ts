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
  const possible = question.points ?? 1; // Défaut à 1 si null/undefined, mais 0 reste 0
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

  // Si pas de correction définie ET pas de scoring.rule, on ne peut pas scorer
  // Exception : les questions de type "ranking" peuvent utiliser scoring.rule au lieu de correct
  if ((effectiveQuestion.correct === undefined || effectiveQuestion.correct === null) &&
      !(question.type === 'ranking' && question.scoring && question.scoring.rule)) {
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
        // Support for multiple correct answers (correctAnswers array) or single correct answer
        if (effectiveQuestion.correctAnswers && Array.isArray(effectiveQuestion.correctAnswers)) {
          correct = effectiveQuestion.correctAnswers.includes(answer.value);
        } else {
          correct = answer.value === effectiveQuestion.correct;
        }
        earned = correct ? possible : 0;
        break;

      case 'number':
        const userAnswer = Number(answer.value);
        const correctAnswer = Number(effectiveQuestion.correct);

        if (isNaN(userAnswer) || isNaN(correctAnswer)) {
          console.warn(`Question ${question.id}: réponse ou correction invalide`);
          break;
        }

        // Special scoring for anchoring questions
        if (effectiveQuestion.anchorType) {
          // For anchoring questions, we measure resistance to the anchor, not accuracy
          // We extract the anchor value from the question text (e.g., "500 miles" or "1500 jours")
          // Try matching with various patterns: "X unit", "avant X", "before X"
          let anchorMatch = effectiveQuestion.text.match(/(\d+)\s*(miles|jours|days|mètres|meters|habitants|millions?\s+d'habitants|million\s+inhabitants|°C|année|year)/i);

          // Special case for years without explicit unit (e.g., "avant 1750" or "before 1750")
          if (!anchorMatch) {
            anchorMatch = effectiveQuestion.text.match(/(?:avant|before)\s+(\d+)/i);
          }

          if (anchorMatch) {
            const anchorValue = Number(anchorMatch[1]);

            if (effectiveQuestion.anchorType === 'low') {
              // Low anchor: user should give an answer far from the anchor
              // They resist if: answer < anchor/2 OR answer > anchor*2
              // This shows they're not influenced by the anchor in either direction
              const resistedAnchor = userAnswer < (anchorValue / 2) || userAnswer > (anchorValue * 2);
              earned = resistedAnchor ? possible : 0;
              correct = resistedAnchor;
            } else if (effectiveQuestion.anchorType === 'high') {
              // High anchor: user should give an answer far from the anchor
              // They resist if: answer < anchor/2 OR answer > anchor*2
              // This shows they're not influenced by the anchor in either direction
              const resistedAnchor = userAnswer < (anchorValue / 2) || userAnswer > (anchorValue * 2);
              earned = resistedAnchor ? possible : 0;
              correct = resistedAnchor;
            }
          } else {
            // Fallback to standard tolerance-based scoring if anchor not found
            const tolerance = effectiveQuestion.tolerance || 0;
            correct = Math.abs(userAnswer - correctAnswer) <= tolerance;
            earned = correct ? possible : 0;
          }
        } else {
          // Standard number question scoring
          const tolerance = effectiveQuestion.tolerance || 0;
          correct = Math.abs(userAnswer - correctAnswer) <= tolerance;
          earned = correct ? possible : 0;
        }
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

        // CART Appendix scoring: measure calibration, not precision
        // If the interval contains the true value → full points
        // If not → 0 points
        // No penalty for wide intervals (shows good calibration if uncertain)
        const contains = min <= target && target <= max;
        earned = contains ? possible : 0;
        correct = contains;
        break;

      case 'ranking':
        const userRanking = answer.value as number[];

        if (!Array.isArray(userRanking) || userRanking.length === 0) {
          break;
        }

        // Pour les questions de ranking, on utilise soit 'correct' soit 'scoring.rule'
        if (Array.isArray(effectiveQuestion.correct) && effectiveQuestion.correct.length > 0) {
          // Méthode 1: Si 'correct' est défini (ordre exact attendu)
          const correctRanking = effectiveQuestion.correct as number[];
          let matches = 0;
          for (let i = 0; i < Math.min(userRanking.length, correctRanking.length); i++) {
            if (userRanking[i] === correctRanking[i]) matches++;
          }
          const accuracy = userRanking.length > 0 ? matches / userRanking.length : 0;
          earned = possible * accuracy;
          correct = accuracy >= 0.8;
        } else if (question.scoring && question.scoring.rule) {
          // Méthode 2: Si 'scoring.rule' est défini (règle de comparaison)
          // Format de la règle: "option-1 > option-3" signifie option-1 doit être classé avant option-3
          const rule = question.scoring.rule as string;
          const match = rule.match(/option-(\d+)\s*>\s*option-(\d+)/);

          if (match) {
            const higherOption = parseInt(match[1], 10);
            const lowerOption = parseInt(match[2], 10);

            // Trouver les positions dans le classement de l'utilisateur
            const higherPos = userRanking.indexOf(higherOption);
            const lowerPos = userRanking.indexOf(lowerOption);

            // Vérifier que les deux options sont présentes et dans le bon ordre
            if (higherPos !== -1 && lowerPos !== -1 && higherPos < lowerPos) {
              earned = possible;
              correct = true;
            } else {
              earned = 0;
              correct = false;
            }
          }
        }
        break;

      case 'likert':
        const likertAnswer = Number(answer.value);

        // Pour les questions Likert, la bonne réponse est déterminée par le champ 'reverse'
        // reverse: false (affirmation irrationnelle) → correct = 1 (fortement en désaccord)
        // reverse: true (affirmation rationnelle) → correct = 7 (fortement d'accord)
        let correctLikert: number;
        if (effectiveQuestion.correct !== undefined && effectiveQuestion.correct !== null) {
          // Si 'correct' est explicitement défini, l'utiliser
          correctLikert = Number(effectiveQuestion.correct);
        } else {
          // Sinon, calculer basé sur 'reverse'
          correctLikert = question.reverse ? 7 : 1;
        }

        if (isNaN(likertAnswer) || isNaN(correctLikert)) {
          break;
        }

        // Calculer la distance entre la réponse et la réponse correcte
        // Pas besoin d'inverser : correctLikert est déjà 7 pour reverse:true et 1 pour reverse:false
        const distance = Math.abs(likertAnswer - correctLikert);

        // Score basé sur la distance : plus on est proche, plus on a de points
        // Distance max = 6 (entre 1 et 7), on normalise sur 5 pour être généreux
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

        // For now, just mark correct/incorrect with proportional points
        // The CART calibration scoring will be applied at the module level
        earned = choiceCorrect ? possible : 0;
        correct = choiceCorrect;
        break;

      case 'aggregate-estimate':
        // This will be scored by scoreCalibrationModule based on actual performance
        // For now, store 0 and let the module-level function calculate it
        earned = 0;
        correct = false;
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


/**
 * Special scoring function for Superstitious Thinking using CART methodology
 * CART: 12 items, our version: 10 items
 * Composite sum range: 10-60 (scale 1-6)
 * CART thresholds adapted proportionally (10/12 = 0.833)
 */
function scoreSuperstitionModule(
  module: Module,
  answers: Answer[]
): ModuleScore {
  const questionScores: QuestionScore[] = [];
  let compositeSum = 0;
  let itemCount = 0;

  module.questions.forEach((question) => {
    const answer = answers.find((a) => a.questionId === question.id);
    if (answer && answer.value !== null && answer.value !== undefined) {
      const likertValue = Number(answer.value);
      if (!isNaN(likertValue) && likertValue >= 1 && likertValue <= 6) {
        // Reverse scoring if needed
        const scoredValue = question.reverse ? (7 - likertValue) : likertValue;
        compositeSum += scoredValue;
        itemCount++;
      }
    }

    // Store individual question scores (will be distributed later)
    questionScores.push({
      questionId: question.id,
      earned: 0,
      possible: question.points || 0.42,
      correct: false,
    });
  });

  // Calculate CART score based on composite sum (adapted thresholds)
  let cartScore = 0;
  if (compositeSum <= 17) {
    cartScore = 5;
  } else if (compositeSum <= 23) {
    cartScore = 4;
  } else if (compositeSum <= 27) {
    cartScore = 3;
  } else if (compositeSum <= 31) {
    cartScore = 2;
  } else if (compositeSum <= 35) {
    cartScore = 1;
  } else {
    cartScore = 0;
  }

  // Distribute CART score proportionally across questions
  const totalPossible = questionScores.reduce((sum, qs) => sum + qs.possible, 0);
  questionScores.forEach(qs => {
    qs.earned = totalPossible > 0 ? (qs.possible / totalPossible) * cartScore : 0;
    qs.correct = cartScore >= 3; // Arbitrary threshold for display
  });

  const earned = questionScores.reduce((sum, qs) => sum + (qs.earned || 0), 0);
  const possible = totalPossible;
  const percentage = possible > 0 ? (earned / possible) * 100 : 0;

  return {
    moduleId: module.id,
    moduleName: module.name,
    earned,
    possible,
    percentage,
    questions: questionScores,
  };
}

/**
 * Special scoring function for Antiscience Attitudes using CART methodology
 * CART: 13 items, our version: 11 items
 * Composite sum range: 11-66 (scale 1-6)
 * CART thresholds adapted proportionally (11/13 = 0.846)
 */
function scoreAntiscienceModule(
  module: Module,
  answers: Answer[]
): ModuleScore {
  const questionScores: QuestionScore[] = [];
  let compositeSum = 0;

  module.questions.forEach((question) => {
    const answer = answers.find((a) => a.questionId === question.id);
    if (answer && answer.value !== null && answer.value !== undefined) {
      const likertValue = Number(answer.value);
      if (!isNaN(likertValue) && likertValue >= 1 && likertValue <= 6) {
        const scoredValue = question.reverse ? (7 - likertValue) : likertValue;
        compositeSum += scoredValue;
      }
    }

    questionScores.push({
      questionId: question.id,
      earned: 0,
      possible: question.points || 0.38,
      correct: false,
    });
  });

  // Calculate CART score (adapted thresholds)
  let cartScore = 0;
  if (compositeSum <= 27) {
    cartScore = 5;
  } else if (compositeSum <= 31) {
    cartScore = 4;
  } else if (compositeSum <= 34) {
    cartScore = 3;
  } else if (compositeSum <= 36) {
    cartScore = 2;
  } else if (compositeSum <= 39) {
    cartScore = 1;
  } else {
    cartScore = 0;
  }

  // Distribute CART score proportionally
  const totalPossible = questionScores.reduce((sum, qs) => sum + qs.possible, 0);
  questionScores.forEach(qs => {
    qs.earned = totalPossible > 0 ? (qs.possible / totalPossible) * cartScore : 0;
    qs.correct = cartScore >= 3;
  });

  const earned = questionScores.reduce((sum, qs) => sum + (qs.earned || 0), 0);
  const percentage = totalPossible > 0 ? (earned / totalPossible) * 100 : 0;

  return {
    moduleId: module.id,
    moduleName: module.name,
    earned,
    possible: totalPossible,
    percentage,
    questions: questionScores,
  };
}

/**
 * Special scoring function for Conspiracy Beliefs using CART methodology
 * CART: 24 items, our version: 11 items
 * Composite sum range: 11-66 (scale 1-6)
 * CART thresholds adapted proportionally (11/24 = 0.458)
 */
function scoreConspiracyModule(
  module: Module,
  answers: Answer[]
): ModuleScore {
  const questionScores: QuestionScore[] = [];
  let compositeSum = 0;

  module.questions.forEach((question) => {
    const answer = answers.find((a) => a.questionId === question.id);
    if (answer && answer.value !== null && answer.value !== undefined) {
      const likertValue = Number(answer.value);
      if (!isNaN(likertValue) && likertValue >= 1 && likertValue <= 6) {
        const scoredValue = question.reverse ? (7 - likertValue) : likertValue;
        compositeSum += scoredValue;
      }
    }

    questionScores.push({
      questionId: question.id,
      earned: 0,
      possible: question.points || 0.42,
      correct: false,
    });
  });

  // Calculate CART score (adapted thresholds for 10 points max)
  let cartScore = 0;
  if (compositeSum <= 17) {
    cartScore = 10;
  } else if (compositeSum <= 19) {
    cartScore = 9;
  } else if (compositeSum <= 21) {
    cartScore = 8;
  } else if (compositeSum <= 23) {
    cartScore = 7;
  } else if (compositeSum <= 26) {
    cartScore = 6;
  } else if (compositeSum <= 28) {
    cartScore = 5;
  } else if (compositeSum <= 31) {
    cartScore = 4;
  } else if (compositeSum <= 34) {
    cartScore = 3;
  } else if (compositeSum <= 36) {
    cartScore = 2;
  } else if (compositeSum <= 38) {
    cartScore = 1;
  } else {
    cartScore = 0;
  }

  // Distribute CART score proportionally
  const totalPossible = questionScores.reduce((sum, qs) => sum + qs.possible, 0);
  questionScores.forEach(qs => {
    qs.earned = totalPossible > 0 ? (qs.possible / totalPossible) * cartScore : 0;
    qs.correct = cartScore >= 5;
  });

  const earned = questionScores.reduce((sum, qs) => sum + (qs.earned || 0), 0);
  const percentage = totalPossible > 0 ? (earned / totalPossible) * 100 : 0;

  return {
    moduleId: module.id,
    moduleName: module.name,
    earned,
    possible: totalPossible,
    percentage,
    questions: questionScores,
  };
}

/**
 * Special scoring function for Dysfunctional Beliefs using CART methodology
 * CART: 9 items, our version: 9 items (exact match!)
 * Composite sum range: 9-54 (scale 1-6)
 * Using exact CART thresholds
 */
function scoreDysfunctionalModule(
  module: Module,
  answers: Answer[]
): ModuleScore {
  const questionScores: QuestionScore[] = [];
  let compositeSum = 0;

  module.questions.forEach((question) => {
    const answer = answers.find((a) => a.questionId === question.id);
    if (answer && answer.value !== null && answer.value !== undefined) {
      const likertValue = Number(answer.value);
      if (!isNaN(likertValue) && likertValue >= 1 && likertValue <= 6) {
        const scoredValue = question.reverse ? (7 - likertValue) : likertValue;
        compositeSum += scoredValue;
      }
    }

    questionScores.push({
      questionId: question.id,
      earned: 0,
      possible: question.points || 0.56,
      correct: false,
    });
  });

  // Calculate CART score (exact CART thresholds)
  let cartScore = 0;
  if (compositeSum <= 24) {
    cartScore = 5;
  } else if (compositeSum <= 28) {
    cartScore = 4;
  } else if (compositeSum <= 31) {
    cartScore = 3;
  } else if (compositeSum <= 34) {
    cartScore = 2;
  } else if (compositeSum <= 38) {
    cartScore = 1;
  } else {
    cartScore = 0;
  }

  // Distribute CART score proportionally
  const totalPossible = questionScores.reduce((sum, qs) => sum + qs.possible, 0);
  questionScores.forEach(qs => {
    qs.earned = totalPossible > 0 ? (qs.possible / totalPossible) * cartScore : 0;
    qs.correct = cartScore >= 3;
  });

  const earned = questionScores.reduce((sum, qs) => sum + (qs.earned || 0), 0);
  const percentage = totalPossible > 0 ? (earned / totalPossible) * 100 : 0;

  return {
    moduleId: module.id,
    moduleName: module.name,
    earned,
    possible: totalPossible,
    percentage,
    questions: questionScores,
  };
}

/**
 * Special scoring function for Belief Bias using CART methodology
 * CART: 16 items (8 consistent + 8 inconsistent), our version: 12 items
 * Raw score range: 0-12
 * CART curve transformation adapted proportionally (12/16 = 0.75)
 */
function scoreBeliefBiasModule(
  module: Module,
  answers: Answer[]
): ModuleScore {
  const questionScores: QuestionScore[] = [];
  let rawScore = 0;

  module.questions.forEach((question) => {
    const answer = answers.find((a) => a.questionId === question.id);
    let correct = false;

    if (answer && answer.value !== null && answer.value !== undefined) {
      correct = answer.value === question.correct;
      if (correct) rawScore++;
    }

    questionScores.push({
      questionId: question.id,
      earned: 0, // Will be distributed later
      possible: question.points || 0.5,
      correct,
    });
  });

  // Apply CART transformation curve (adapted thresholds)
  let cartScore = 0;
  if (rawScore >= 12) {
    cartScore = 8;
  } else if (rawScore >= 11) {
    cartScore = 7;
  } else if (rawScore >= 10) {
    cartScore = 6;
  } else if (rawScore >= 9) {
    cartScore = 5;
  } else if (rawScore >= 8) {
    cartScore = 4;
  } else if (rawScore >= 7) {
    cartScore = 2;
  } else {
    cartScore = 0;
  }

  // Distribute CART score proportionally
  const totalPossible = questionScores.reduce((sum, qs) => sum + qs.possible, 0);
  questionScores.forEach(qs => {
    qs.earned = totalPossible > 0 ? (qs.possible / totalPossible) * cartScore : 0;
  });

  const earned = questionScores.reduce((sum, qs) => sum + (qs.earned || 0), 0);
  const percentage = totalPossible > 0 ? (earned / totalPossible) * 100 : 0;

  return {
    moduleId: module.id,
    moduleName: module.name,
    earned,
    possible: totalPossible,
    percentage,
    questions: questionScores,
  };
}

/**
 * Special scoring function for the Knowledge Calibration module using CART methodology
 */
function scoreCalibrationModule(
  module: Module,
  answers: Answer[],
  randomizedValues?: { [questionId: string]: { [key: string]: number | string } }
): ModuleScore {
  const questionScores: QuestionScore[] = [];

  // Separate questions by type
  const mcQuestions = module.questions.filter(q => q.type === 'multiple-choice-confidence');
  const intervalQuestions = module.questions.filter(q => q.type === 'confidence-interval');
  const aggregateQuestions = module.questions.filter(q => q.type === 'aggregate-estimate');

  // PART 1: Multiple-choice with confidence (CART item-by-item calibration)
  let totalConfidence = 0;
  let correctCount = 0;
  const mcScores: QuestionScore[] = [];

  mcQuestions.forEach((question) => {
    const answer = answers.find((a) => a.questionId === question.id);
    if (answer && answer.value?.choice !== undefined && answer.value?.confidence !== undefined) {
      const isCorrect = answer.value.choice === question.correct;
      if (isCorrect) correctCount++;
      totalConfidence += answer.value.confidence;

      // Store temporary score (will be adjusted by CART scoring)
      mcScores.push({
        questionId: question.id,
        earned: 0, // Will be calculated below
        possible: question.points || 0.2,
        correct: isCorrect,
      });
    } else {
      mcScores.push({
        questionId: question.id,
        earned: 0,
        possible: question.points || 0.2,
        correct: false,
      });
    }
  });

  // Calculate CART Part 1 score (0-2 points)
  let part1Score = 0;
  if (mcQuestions.length > 0) {
    const avgConfidence = totalConfidence / mcQuestions.length;
    const percentCorrect = (correctCount / mcQuestions.length) * 100;
    const calibrationDiff = Math.abs(avgConfidence - percentCorrect);

    if (calibrationDiff <= 2) {
      part1Score = 2;
    } else if (calibrationDiff < 10) {
      part1Score = 1;
    } else {
      part1Score = 0;
    }
  }

  // Distribute Part 1 score proportionally across MC questions
  const part1TotalPossible = mcScores.reduce((sum, qs) => sum + qs.possible, 0);
  mcScores.forEach(qs => {
    qs.earned = part1TotalPossible > 0 ? (qs.possible / part1TotalPossible) * part1Score : 0;
  });
  questionScores.push(...mcScores);

  // PART 1 AGGREGATE: Score the aggregate estimate for Part 1
  const aggregate1 = aggregateQuestions.find(q => q.aggregateScope === 'part1-mc');
  if (aggregate1) {
    const answer = answers.find((a) => a.questionId === aggregate1.id);
    let earned = 0;
    if (answer && answer.value !== null && answer.value !== undefined) {
      const userEstimate = Number(answer.value);
      const actualCorrect = correctCount;
      const difference = userEstimate - actualCorrect;

      // CART: difference ≤ 0 means not overconfident → 1 point
      // difference > 0 means overconfident → 0 points
      earned = difference <= 0 ? (aggregate1.points || 1) : 0;
    }
    questionScores.push({
      questionId: aggregate1.id,
      earned,
      possible: aggregate1.points || 1,
      correct: earned > 0,
    });
  }

  // PART 2: Confidence intervals (CART item-by-item calibration)
  let hitCount = 0;
  const intervalScores: QuestionScore[] = [];

  intervalQuestions.forEach((question) => {
    const answer = answers.find((a) => a.questionId === question.id);
    if (answer && answer.value?.min !== undefined && answer.value?.max !== undefined) {
      const min = Number(answer.value.min);
      const max = Number(answer.value.max);
      const target = Number(question.correct);

      const contains = !isNaN(min) && !isNaN(max) && !isNaN(target) && min <= target && target <= max;
      if (contains) hitCount++;

      intervalScores.push({
        questionId: question.id,
        earned: 0, // Will be calculated below
        possible: question.points || 0.2,
        correct: contains,
      });
    } else {
      intervalScores.push({
        questionId: question.id,
        earned: 0,
        possible: question.points || 0.2,
        correct: false,
      });
    }
  });

  // Calculate CART Part 2 score (0-2 points)
  // Adapted thresholds: ≥6/10 (60%) → 2pts, 4-5/10 (40-50%) → 1pt, <4/10 (<40%) → 0pts
  let part2Score = 0;
  if (intervalQuestions.length > 0) {
    if (hitCount >= 6) {
      part2Score = 2;
    } else if (hitCount >= 4) {
      part2Score = 1;
    } else {
      part2Score = 0;
    }
  }

  // Distribute Part 2 score proportionally across interval questions
  const part2TotalPossible = intervalScores.reduce((sum, qs) => sum + qs.possible, 0);
  intervalScores.forEach(qs => {
    qs.earned = part2TotalPossible > 0 ? (qs.possible / part2TotalPossible) * part2Score : 0;
  });
  questionScores.push(...intervalScores);

  // PART 2 AGGREGATE: Score the aggregate estimate for Part 2
  const aggregate2 = aggregateQuestions.find(q => q.aggregateScope === 'part2-interval');
  if (aggregate2) {
    const answer = answers.find((a) => a.questionId === aggregate2.id);
    let earned = 0;
    if (answer && answer.value !== null && answer.value !== undefined) {
      const userEstimate = Number(answer.value);
      const actualHits = hitCount;
      const difference = userEstimate - actualHits;

      // CART: difference ≤ 0 means not overconfident → 1 point
      // difference > 0 means overconfident → 0 points
      earned = difference <= 0 ? (aggregate2.points || 1) : 0;
    }
    questionScores.push({
      questionId: aggregate2.id,
      earned,
      possible: aggregate2.points || 1,
      correct: earned > 0,
    });
  }

  // Calculate total scores
  const earned = questionScores.reduce((sum, qs) => sum + (qs.earned || 0), 0);
  const possible = questionScores.reduce((sum, qs) => sum + (qs.possible || 0), 0);
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

export function scoreModule(
  module: Module,
  answers: Answer[],
  randomizedValues?: { [questionId: string]: { [key: string]: number | string } }
): ModuleScore {
  // Use special CART scoring for modules that require it
  if (module.id === 'calibration-full') {
    return scoreCalibrationModule(module, answers, randomizedValues);
  }

  if (module.id === 'superstition') {
    return scoreSuperstitionModule(module, answers);
  }

  if (module.id === 'anti-science') {
    return scoreAntiscienceModule(module, answers);
  }

  if (module.id === 'conspiracy') {
    return scoreConspiracyModule(module, answers);
  }

  if (module.id === 'dysfunctional-beliefs') {
    return scoreDysfunctionalModule(module, answers);
  }

  if (module.id === 'belief-bias') {
    return scoreBeliefBiasModule(module, answers);
  }

  const questionScores = module.questions.map((question) => {
    const answer = answers.find((a) => a.questionId === question.id);
    if (!answer) {
      return {
        questionId: question.id,
        earned: 0,
        possible: question.points ?? 1,
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
      belowAverage: 'Score sous la moyenne. Plusieurs biais cognitifs importants affectent votre raisonnement. La recherche montre que l\'amélioration est possible mais modeste (10-25% sur 6-12 mois avec pratique intensive). Complétez votre apprentissage par l\'usage d\'outils externes (checklists, protocoles de décision, consultations) pour vos choix importants.',
      limited: 'Score limité. Vos résultats suggèrent une forte susceptibilité aux biais cognitifs courants. Cela ne reflète pas votre intelligence générale - même des personnes très intelligentes obtiennent des scores similaires. La rationalité se travaille différemment de l\'intelligence. La recherche indique que l\'amélioration nécessite une pratique soutenue sur le long terme. Privilégiez l\'usage d\'outils externes (checklists, consultations) pour compenser ces biais dans vos décisions importantes.',
      veryLimited: 'Score très limité. Vous présentez une forte susceptibilité aux biais cognitifs courants. Cela ne reflète pas votre intelligence générale - de nombreuses personnes intelligentes obtiennent des scores similaires. La recherche montre que l\'amélioration est possible mais modeste, et nécessite une pratique soutenue. Plutôt que de compter uniquement sur l\'amélioration personnelle, privilégiez l\'usage d\'outils externes (checklists, protocoles de décision, consultations) pour vos choix importants.'
    },
    en: {
      veryHigh: 'Very high score. You demonstrate excellent mastery of rational reasoning principles. However, keep in mind that knowing biases does not guarantee resistance to them in real situations (fatigue, stress, emotions).',
      high: 'High score. You have gained a good understanding of common reasoning errors. However, note that biases persist even among experts. The use of decision-making protocols remains recommended for important choices.',
      average: 'Average score. You correctly identify some biases, but others still escape you. This is normal: rationality is not intuitive. Focus on your specific weaknesses rather than trying to improve everything at once.',
      belowAverage: 'Below average score. Several important cognitive biases affect your reasoning. Research shows that improvement is possible but modest (10-25% over 6-12 months with intensive practice). Complement your learning with external tools (checklists, decision protocols, consultations) for your important choices.',
      limited: 'Limited score. Your results suggest strong susceptibility to common cognitive biases. This does not reflect your general intelligence - even very intelligent people get similar scores. Rationality works differently from intelligence. Research indicates that improvement requires sustained long-term practice. Prioritize the use of external tools (checklists, consultations) to compensate for these biases in your important decisions.',
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