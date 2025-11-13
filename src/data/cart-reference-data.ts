/**
 * CART (Comprehensive Assessment of Rational Thinking) Reference Data
 * Based on official empirical studies from Stanovich et al.
 */

export interface CARTNorms {
  study: string;
  sampleSize: number;
  sampleDescription: string;
  totalPoints: number;
  mean: number;
  sd: number;
  percentiles?: Record<number, number>;
}

export interface CARTModuleNorms {
  moduleName: string;
  points: number;
  mean: number;
  sd: number;
  alpha?: number; // Cronbach's alpha reliability
}

/**
 * RT59 Study: Short-Form CART (100 points)
 * Sample: 372 university students
 */
export const CART_SHORT_FORM_NORMS: CARTNorms = {
  study: 'RT59',
  sampleSize: 372,
  sampleDescription: 'University students',
  totalPoints: 100,
  mean: 43.6,
  sd: 13.0,
  percentiles: {
    10: 26,
    20: 33,
    25: 35,
    30: 37,
    40: 40,
    50: 44,
    60: 47,
    70: 51,
    75: 53,
    80: 55,
    90: 60,
  },
};

/**
 * RT60 Study: Full-Form CART (148 points)
 * Sample: 747 mixed (Turk + Lab)
 */
export const CART_FULL_FORM_NORMS: CARTNorms = {
  study: 'RT60',
  sampleSize: 747,
  sampleDescription: 'Mixed sample (online + lab)',
  totalPoints: 148,
  mean: 75.6,
  sd: 23.2,
  percentiles: {
    10: 45,
    20: 57,
    25: 61,
    30: 64,
    40: 70,
    50: 76,
    60: 82,
    70: 88,
    75: 91,
    80: 95,
    90: 103,
  },
};

/**
 * Module-level norms from RT60 Full-Form CART
 */
export const CART_MODULE_NORMS: CARTModuleNorms[] = [
  {
    moduleName: 'Probabilistic and Statistical Reasoning',
    points: 7,
    mean: 3.5,
    sd: 1.8,
    alpha: 0.58,
  },
  {
    moduleName: 'Scientific Reasoning',
    points: 9,
    mean: 5.2,
    sd: 2.3,
    alpha: 0.67,
  },
  {
    moduleName: 'Reflection vs. Intuition (CRT-7)',
    points: 7,
    mean: 3.8,
    sd: 2.4,
    alpha: 0.79,
  },
  {
    moduleName: 'Belief Bias Syllogisms',
    points: 10,
    mean: 5.9,
    sd: 2.5,
    alpha: 0.72,
  },
  {
    moduleName: 'Argument Analysis',
    points: 4,
    mean: 2.1,
    sd: 1.3,
    alpha: 0.52,
  },
  {
    moduleName: 'Disjunctive Reasoning',
    points: 6,
    mean: 2.8,
    sd: 1.9,
    alpha: 0.61,
  },
  {
    moduleName: 'Causal Reasoning',
    points: 4,
    mean: 2.4,
    sd: 1.2,
    alpha: 0.48,
  },
  {
    moduleName: 'Anchoring',
    points: 4,
    mean: 1.8,
    sd: 1.3,
    alpha: 0.54,
  },
  {
    moduleName: 'Framing',
    points: 10,
    mean: 5.3,
    sd: 2.4,
    alpha: 0.68,
  },
  {
    moduleName: 'Knowledge Calibration',
    points: 20,
    mean: 10.2,
    sd: 4.8,
    alpha: 0.82,
  },
  {
    moduleName: 'Probabilistic Numeracy',
    points: 7,
    mean: 4.1,
    sd: 2.0,
    alpha: 0.62,
  },
  {
    moduleName: 'Sensitivity to Expected Value',
    points: 6,
    mean: 3.2,
    sd: 1.8,
    alpha: 0.59,
  },
  {
    moduleName: 'Sunk Cost',
    points: 6,
    mean: 3.4,
    sd: 1.9,
    alpha: 0.63,
  },
  {
    moduleName: 'Resistance to Miserly Information Processing',
    points: 6,
    mean: 3.1,
    sd: 1.7,
    alpha: 0.56,
  },
  {
    moduleName: 'Superstitious Thinking',
    points: 8,
    mean: 5.8,
    sd: 2.1,
    alpha: 0.76,
  },
  {
    moduleName: 'Antiscience Attitudes',
    points: 6,
    mean: 4.3,
    sd: 1.8,
    alpha: 0.71,
  },
  {
    moduleName: 'Financial Literacy and Economic Biases',
    points: 10,
    mean: 5.6,
    sd: 2.6,
    alpha: 0.69,
  },
  {
    moduleName: 'Dysfunctional Personal Beliefs',
    points: 6,
    mean: 4.1,
    sd: 1.7,
    alpha: 0.64,
  },
  {
    moduleName: 'Conspiracist Ideation',
    points: 6,
    mean: 4.2,
    sd: 1.9,
    alpha: 0.79,
  },
  {
    moduleName: 'Other Questionable Beliefs',
    points: 6,
    mean: 4.2,
    sd: 1.8,
    alpha: 0.72,
  },
];

/**
 * Mapping between our module names and CART module names
 */
export const MODULE_NAME_MAPPING: Record<string, string> = {
  'Raisonnement Probabiliste': 'Probabilistic and Statistical Reasoning',
  'Probabilistic Reasoning': 'Probabilistic and Statistical Reasoning',
  'Raisonnement Scientifique': 'Scientific Reasoning',
  'Scientific Reasoning': 'Scientific Reasoning',
  'Réflexion vs Intuition': 'Reflection vs. Intuition (CRT-7)',
  'Reflection vs Intuition': 'Reflection vs. Intuition (CRT-7)',
  'Résistance au Traitement Avare': 'Resistance to Miserly Information Processing',
  'Resistance to Miserly Processing': 'Resistance to Miserly Information Processing',
  'Biais de Croyance': 'Belief Bias Syllogisms',
  'Belief Bias': 'Belief Bias Syllogisms',
  'Raisonnement Disjonctif': 'Disjunctive Reasoning',
  'Disjunctive Reasoning': 'Disjunctive Reasoning',
  'Ancrage': 'Anchoring',
  'Anchoring': 'Anchoring',
  'Calibration des Connaissances': 'Knowledge Calibration',
  'Knowledge Calibration': 'Knowledge Calibration',
  'Numératie Probabiliste': 'Probabilistic Numeracy',
  'Probabilistic Numeracy': 'Probabilistic Numeracy',
  'Pensée Superstitieuse': 'Superstitious Thinking',
  'Superstitious Thinking': 'Superstitious Thinking',
  'Attitudes Anti-Science': 'Antiscience Attitudes',
  'Anti-Science Attitudes': 'Antiscience Attitudes',
  'Croyances Conspirationnistes': 'Conspiracist Ideation',
  'Conspiracist Beliefs': 'Conspiracist Ideation',
  'Croyances Dysfonctionnelles': 'Dysfunctional Personal Beliefs',
  'Dysfunctional Beliefs': 'Dysfunctional Personal Beliefs',
  'Évaluation d\'Arguments': 'Argument Analysis',
  'Argument Evaluation': 'Argument Analysis',
  'Raisonnement Causal': 'Causal Reasoning',
  'Causal Reasoning': 'Causal Reasoning',
  'Effets de Cadrage': 'Framing',
  'Framing Effects': 'Framing',
  'Sensibilité à la Valeur Espérée': 'Sensitivity to Expected Value',
  'Sensitivity to Expected Value': 'Sensitivity to Expected Value',
  'Coûts Irrécupérables': 'Sunk Cost',
  'Sunk Cost Fallacy': 'Sunk Cost',
};

/**
 * Calculate percentile based on CART norms
 * @param score User's score
 * @param maxScore Maximum possible score
 * @param norms CART norms to use for comparison
 * @returns Estimated percentile (0-100)
 */
export function calculatePercentile(
  score: number,
  maxScore: number,
  norms: CARTNorms
): number {
  // Normalize score to CART scale
  const normalizedScore = (score / maxScore) * norms.totalPoints;

  // Calculate z-score
  const zScore = (normalizedScore - norms.mean) / norms.sd;

  // Convert z-score to percentile using standard normal distribution approximation
  // Using the error function approximation
  const percentile = Math.round(50 * (1 + erf(zScore / Math.sqrt(2))) * 100) / 100;

  return Math.max(0, Math.min(100, percentile));
}

/**
 * Error function approximation for normal distribution
 */
function erf(x: number): number {
  // Abramowitz and Stegun approximation
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

/**
 * Get interpretation message based on percentile
 */
export function getPercentileInterpretation(
  percentile: number,
  locale: 'en' | 'fr' = 'en'
): string {
  if (locale === 'fr') {
    if (percentile >= 90)
      return 'Excellent ! Vous êtes dans le top 10% des participants.';
    if (percentile >= 75)
      return 'Très bien ! Vous êtes dans le top 25% des participants.';
    if (percentile >= 60)
      return 'Bon résultat, au-dessus de la moyenne.';
    if (percentile >= 40)
      return 'Dans la moyenne des participants.';
    if (percentile >= 25)
      return 'Légèrement en-dessous de la moyenne.';
    return 'Il y a une marge de progression importante.';
  } else {
    if (percentile >= 90)
      return 'Excellent! You are in the top 10% of participants.';
    if (percentile >= 75)
      return 'Very good! You are in the top 25% of participants.';
    if (percentile >= 60) return 'Good result, above average.';
    if (percentile >= 40) return 'Average performance.';
    if (percentile >= 25) return 'Slightly below average.';
    return 'There is significant room for improvement.';
  }
}
