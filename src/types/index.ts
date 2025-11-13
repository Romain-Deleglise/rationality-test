// Types pour les questions
export type QuestionType =
  | 'multiple-choice'
  | 'number'
  | 'confidence-interval'
  | 'ranking'
  | 'likert'
  | 'multiple-choice-confidence';

export interface QuestionRandomization {
  variables: {
    [key: string]: {
      type: 'simple' | 'percentage_pair' | 'calculated' | 'sequence';
      min?: number;
      max?: number;
      step?: number;
      percentageOptions?: number[][];
      formula?: string;
      dependencies?: string[];
      sequenceMin?: number;
      sequenceMax?: number;
    };
  };
  textTemplate?: string;
  correctTemplate?: string;
  explanationTemplate?: string;
  optionsTemplates?: string[];
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  unit?: string;
  options?: string[];
  correct?: number | string;
  tolerance?: number;
  points: number;
  explanation?: string;
  confidenceLevels?: number[];
  reverse?: boolean;
  anchorType?: 'low' | 'high';
  randomization?: QuestionRandomization;
}

export interface Module {
  id: string;
  name: string;
  points: number;
  time: number;
  questions: Question[];
}

export interface TestData {
  version: string;
  totalPoints: number;
  estimatedTime: number;
  modules: Module[];
}

export interface Answer {
  questionId: string;
  value: any;
  confidence?: number;
  timestamp: Date;
}

export interface TestSession {
  id: string;
  version: 'courte' | 'complète';
  startedAt: Date;
  completedAt?: Date;
  answers: Answer[];
  currentModuleIndex: number;
  currentQuestionIndex: number;
  randomizedValues?: {
    [questionId: string]: {
      [variable: string]: number | string;
    };
  };
}

export interface TestResult {
  sessionId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  moduleScores: ModuleScore[];
  completedAt: Date;
}

export interface ModuleScore {
  moduleId: string;
  moduleName: string;
  score: number;
  maxScore: number;
  percentage: number;
}