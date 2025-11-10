'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ModuleScore } from '@/lib/scoring';

interface RecommendationsProps {
  moduleScores: ModuleScore[];
}

const recommendations: Record<string, {
  description: string;
  resources: { title: string; url: string }[];
  tips: string[];
}> = {
  'Raisonnement Probabiliste': {
    description: 'Le raisonnement probabiliste est crucial pour prendre des décisions rationnelles.',
    resources: [
      { 
        title: 'Thinking, Fast and Slow (Kahneman)', 
        url: 'https://www.lesswrong.com' 
      },
      { 
        title: 'LessWrong - Probability Theory', 
        url: 'https://www.lesswrong.com/tag/probability' 
      },
    ],
    tips: [
      'Pratiquez le calcul des probabilités simples',
      'Utilisez des fréquences naturelles',
      'Calibrez vos prédictions',
    ],
  },
  'Raisonnement Scientifique': {
    description: 'Le raisonnement scientifique permet de tester les hypothèses.',
    resources: [
      { 
        title: 'The Sequences (Eliezer Yudkowsky)', 
        url: 'https://www.lesswrong.com/rationality' 
      },
      { 
        title: 'Scout Mindset (Julia Galef)', 
        url: 'https://www.goodreads.com/book/show/42041926-the-scout-mindset' 
      },
    ],
    tips: [
      'Cherchez à falsifier vos hypothèses',
      'Distinguez corrélation et causalité',
      'Méfiez-vous du biais de confirmation',
    ],
  },
  'Réflexion vs Intuition': {
    description: 'La capacité à surmonter les intuitions immédiates.',
    resources: [
      { 
        title: 'Cognitive Reflection Test', 
        url: 'https://www.lesswrong.com/tag/cognitive-reflection-test' 
      },
      { 
        title: 'System 1 vs System 2', 
        url: 'https://www.lesswrong.com/tag/system-1' 
      },
    ],
    tips: [
      'Prenez le temps de réfléchir',
      'Questionnez vos intuitions',
      'Pratiquez des puzzles logiques',
    ],
  },
};

export function Recommendations({ moduleScores }: RecommendationsProps) {
  const weakestModules = moduleScores
    .filter(m => m.possible > 0)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Recommandations Personnalisées
        </h2>
        <p className="text-gray-600">
          Ressources pour améliorer vos domaines les plus faibles
        </p>
      </div>

      {weakestModules.map((module) => {
        const moduleName = module.moduleName.split(' (')[0];
        const rec = recommendations[moduleName];

        if (!rec) return null;

        return (
          <Card key={module.moduleId}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{moduleName}</span>
                <span className="text-sm font-normal text-orange-600">
                  Score actuel : {Math.round(module.percentage)}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{rec.description}</p>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  📚 Ressources recommandées
                </h4>
                <ul className="space-y-1">
                  {rec.resources.map((resource, i) => (
                    <li key={i}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  💡 Conseils pratiques
                </h4>
                <ul className="space-y-1">
                  {rec.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-gray-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}