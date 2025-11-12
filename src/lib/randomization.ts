/**
 * Utility for randomizing numerical values in test questions
 * to prevent memorization while maintaining logical coherence
 */

/**
 * Randomization rule types
 */
export interface RandomizationRule {
  // Type of randomization
  type: 'simple' | 'percentage_pair' | 'calculated' | 'sequence';

  // For simple randomization
  min?: number;
  max?: number;
  step?: number; // e.g., 5 for multiples of 5

  // For percentage pairs (must sum to 100)
  percentageOptions?: number[][]; // e.g., [[60, 40], [70, 30], [80, 20]]

  // For calculated values (depends on other randomized values)
  formula?: string; // e.g., "a + b", "a * b / 100"
  dependencies?: string[]; // Variable names this depends on

  // For sequences
  sequenceMin?: number;
  sequenceMax?: number;
}

export interface QuestionRandomization {
  variables: {
    [key: string]: RandomizationRule;
  };
  textTemplate?: string; // Template with {{var}} placeholders
  correctTemplate?: string; // Template for correct answer
  explanationTemplate?: string; // Template for explanation
  optionsTemplates?: string[]; // Templates for options
}

export interface RandomizedValues {
  [key: string]: number | string;
}

/**
 * Generates a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number, step: number = 1): number {
  const range = Math.floor((max - min) / step) + 1;
  return min + Math.floor(Math.random() * range) * step;
}

/**
 * Generates randomized values based on rules
 */
export function generateRandomizedValues(
  rules: QuestionRandomization
): RandomizedValues {
  const values: RandomizedValues = {};

  // First pass: Generate independent values
  for (const [varName, rule] of Object.entries(rules.variables)) {
    if (rule.type === 'simple') {
      values[varName] = randomInt(
        rule.min ?? 0,
        rule.max ?? 100,
        rule.step ?? 1
      );
    } else if (rule.type === 'percentage_pair' && rule.percentageOptions) {
      // Choose a random percentage pair
      const pair = rule.percentageOptions[
        Math.floor(Math.random() * rule.percentageOptions.length)
      ];
      // Store both values
      const [first, second] = pair;
      values[varName] = first;
      values[`${varName}_complement`] = second;
    } else if (rule.type === 'sequence') {
      values[varName] = randomInt(
        rule.sequenceMin ?? 3,
        rule.sequenceMax ?? 10,
        rule.step ?? 1
      );
    }
  }

  // Second pass: Calculate dependent values
  for (const [varName, rule] of Object.entries(rules.variables)) {
    if (rule.type === 'calculated' && rule.formula) {
      values[varName] = evaluateFormula(rule.formula, values);
    }
  }

  return values;
}

/**
 * Simple formula evaluator for calculated values
 */
function evaluateFormula(formula: string, values: RandomizedValues): number {
  let expression = formula;

  // Replace variable names with their values
  for (const [key, value] of Object.entries(values)) {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    expression = expression.replace(regex, String(value));
  }

  try {
    // Use Function constructor for safe evaluation
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${expression}`)();
    return typeof result === 'number' ? Math.round(result * 100) / 100 : 0;
  } catch (e) {
    console.error('Formula evaluation error:', e);
    return 0;
  }
}

/**
 * Applies randomized values to a template string
 */
export function applyTemplate(
  template: string,
  values: RandomizedValues
): string {
  let result = template;

  for (const [key, value] of Object.entries(values)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, String(value));
  }

  return result;
}

/**
 * Generates randomized question data
 */
export function randomizeQuestion(
  questionId: string,
  randomization: QuestionRandomization
) {
  const values = generateRandomizedValues(randomization);

  return {
    questionId,
    values,
    text: randomization.textTemplate
      ? applyTemplate(randomization.textTemplate, values)
      : null,
    correct: randomization.correctTemplate
      ? applyTemplate(randomization.correctTemplate, values)
      : null,
    explanation: randomization.explanationTemplate
      ? applyTemplate(randomization.explanationTemplate, values)
      : null,
    options: randomization.optionsTemplates
      ? randomization.optionsTemplates.map(t => applyTemplate(t, values))
      : null,
  };
}

/**
 * Predefined randomization rules for common question types
 */
export const RANDOMIZATION_PRESETS = {
  // Probability matching (e.g., 60-40, 70-30, 80-20)
  probabilityPair: {
    variables: {
      prob_high: {
        type: 'percentage_pair' as const,
        percentageOptions: [
          [60, 40],
          [70, 30],
          [75, 25],
          [80, 20],
        ],
      },
    },
  },

  // Gambler's fallacy (3-10 times in a row)
  sequenceCount: {
    variables: {
      count: {
        type: 'sequence' as const,
        sequenceMin: 3,
        sequenceMax: 10,
      },
    },
  },

  // Age randomization (18-65)
  age: {
    variables: {
      age: {
        type: 'simple' as const,
        min: 18,
        max: 65,
        step: 1,
      },
    },
  },

  // Sample sizes
  sampleSize: {
    variables: {
      large: {
        type: 'simple' as const,
        min: 40,
        max: 60,
        step: 5,
      },
      small: {
        type: 'calculated' as const,
        formula: 'large / 3',
        dependencies: ['large'],
      },
    },
  },

  // CRT-style problems (prices, quantities)
  price: {
    variables: {
      total: {
        type: 'simple' as const,
        min: 100,
        max: 200,
        step: 10,
      },
      difference: {
        type: 'simple' as const,
        min: 50,
        max: 150,
        step: 10,
      },
      answer: {
        type: 'calculated' as const,
        formula: '(total - difference) / 2',
        dependencies: ['total', 'difference'],
      },
    },
  },
};

/**
 * Check if a question has randomization rules
 */
export function hasRandomization(question: any): boolean {
  return !!(question.randomization && Object.keys(question.randomization.variables || {}).length > 0);
}

/**
 * Apply randomized values to a question
 * Returns a new question object with randomized text, options, correct answer, and explanation
 */
export function applyRandomizationToQuestion<T extends {
  id: string;
  text: string;
  options?: string[];
  correct?: number | string;
  explanation?: string;
  randomization?: QuestionRandomization;
}>(
  question: T,
  randomizedValues: RandomizedValues
): T {
  // If no randomization or no values, return original
  if (!question.randomization || !randomizedValues) {
    return question;
  }

  const { randomization } = question;
  const result = { ...question };

  // Apply templates
  if (randomization.textTemplate) {
    result.text = applyTemplate(randomization.textTemplate, randomizedValues);
  }

  if (randomization.correctTemplate) {
    const correctStr = applyTemplate(randomization.correctTemplate, randomizedValues);
    // Try to parse as number if possible
    const correctNum = parseFloat(correctStr);
    result.correct = isNaN(correctNum) ? correctStr : correctNum;
  }

  if (randomization.explanationTemplate) {
    result.explanation = applyTemplate(
      randomization.explanationTemplate,
      randomizedValues
    );
  }

  if (randomization.optionsTemplates && result.options) {
    result.options = randomization.optionsTemplates.map(template =>
      applyTemplate(template, randomizedValues)
    );
  }

  return result;
}

/**
 * Get a question with randomized values applied from session
 */
export function getRandomizedQuestion<T extends {
  id: string;
  text: string;
  options?: string[];
  correct?: number | string;
  explanation?: string;
  randomization?: QuestionRandomization;
}>(
  question: T,
  sessionRandomizedValues?: { [questionId: string]: RandomizedValues }
): T {
  if (!sessionRandomizedValues || !sessionRandomizedValues[question.id]) {
    return question;
  }

  return applyRandomizationToQuestion(question, sessionRandomizedValues[question.id]);
}
