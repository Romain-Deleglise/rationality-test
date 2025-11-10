'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTestStore } from '@/store/useTestStore';
import { scoreTest, calculatePercentile, TestScore } from '@/lib/scoring';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadarChartComponent, BarChartComponent } from '@/components/ResultsCharts';
import { Recommendations } from '@/components/Recommendations';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AccordionItem = ({ title, children, defaultOpen = false }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-left text-gray-900">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white text-gray-700 leading-relaxed text-justify">
          {children}
        </div>
      )}
    </div>
  );
};

export default function ResultatsPage() {
  const router = useRouter();
  const { session, modules, resetTest } = useTestStore();
  const [testScore, setTestScore] = useState<TestScore | null>(null);

  useEffect(() => {
    if (!session?.completedAt || !modules.length) {
      router.push('/test');
      return;
    }

    const scores = scoreTest(modules, session.answers);
    const percentile = calculatePercentile(scores.percentage);
    setTestScore({ ...scores, percentile });
  }, [session, modules, router]);

  if (!testScore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calcul des résultats...</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Exceptionnelle';
    if (score >= 70) return 'Solide';
    if (score >= 55) return 'Moyenne';
    return 'À améliorer';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vos Résultats
          </h1>
          <p className="text-xl text-gray-600">
            Test de Rationalité - Analyse Complète
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Complété le {new Date(session!.completedAt!).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Score Global */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Score Global</h2>
          <div className="mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(testScore.percentage)}`}>
              {testScore.percentage.toFixed(1)}%
            </div>
            <div className={`text-2xl font-semibold mb-2 ${getScoreColor(testScore.percentage)}`}>
              Rationalité {getScoreLabel(testScore.percentage)}
            </div>
            <div className="text-lg text-gray-600">
              {testScore.totalEarned.toFixed(1)} / {testScore.totalPossible.toFixed(1)} points
            </div>
          </div>
          {testScore.percentile && (
            <div className="bg-gray-100 rounded-lg p-4 inline-block">
              <p className="text-gray-700">
                Vous êtes plus rationnel que <strong className="text-blue-600">{testScore.percentile}%</strong> des participants
              </p>
            </div>
          )}
        </div>

        {/* Détail par Module */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Détail par Module</h2>

          <div className="space-y-4">
            {testScore.modules
              .filter(m => m.possible > 0)
              .sort((a, b) => b.percentage - a.percentage)
              .map((moduleScore) => {
                const scoreColor = 
                  moduleScore.percentage >= 75 ? 'text-green-600' :
                  moduleScore.percentage >= 50 ? 'text-blue-600' :
                  moduleScore.percentage >= 35 ? 'text-yellow-600' :
                  'text-red-600';
                
                const barColor =
                  moduleScore.percentage >= 75 ? 'bg-green-600' :
                  moduleScore.percentage >= 50 ? 'bg-blue-600' :
                  moduleScore.percentage >= 35 ? 'bg-yellow-600' :
                  'bg-red-600';

                return (
                  <div key={moduleScore.moduleId}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">
                        {moduleScore.moduleName.split(' (')[0]}
                      </span>
                      <span className={`font-bold ${scoreColor}`}>
                        {moduleScore.earned.toFixed(1)}/{moduleScore.possible.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`${barColor} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${moduleScore.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {moduleScore.percentage.toFixed(0)}% - {
                        moduleScore.percentage >= 75 ? 'Excellent ✓' :
                        moduleScore.percentage >= 50 ? 'Bien' :
                        moduleScore.percentage >= 35 ? 'Moyen' :
                        'À améliorer ⚠️'
                      }
                    </p>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Profil de Rationalité</CardTitle>
            </CardHeader>
            <CardContent>
              <RadarChartComponent moduleScores={testScore.modules} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Classement par Module</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent moduleScores={testScore.modules} />
            </CardContent>
          </Card>
        </div>

        {/* Interprétation */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interprétation</h2>

          <p className="text-gray-700 mb-6 text-justify">
            {testScore.interpretation}
          </p>

          {testScore.strengths.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                ✓ Vos Forces
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                {testScore.strengths.map((strength, i) => (
                  <li key={i}>{strength.split(' (')[0]}</li>
                ))}
              </ul>
            </div>
          )}

          {testScore.weaknesses.length > 0 && (
            <div>
              <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                ⚠ Points à améliorer
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                {testScore.weaknesses.map((weakness, i) => (
                  <li key={i}>{weakness.split(' (')[0]}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Ressources */}
        <div className="bg-blue-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ressources pour progresser
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">📚 Lectures recommandées</h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <a href="https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                    Système 1 / Système 2
                  </a> - Daniel Kahneman<br />
                  <span className="text-sm text-gray-600">Le livre fondateur sur les deux systèmes de pensée</span>
                </li>
                <li>
                  <a href="https://www.goodreads.com/book/show/23995360-superforecasting" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                    Superforecasting
                  </a> - Philip Tetlock<br />
                  <span className="text-sm text-gray-600">Comment améliorer vos prédictions et votre calibration</span>
                </li>
                <li>
                  <a href="https://mitpress.mit.edu/9780262034845/the-rationality-quotient/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                    The Rationality Quotient
                  </a> - Stanovich, West & Toplak<br />
                  <span className="text-sm text-gray-600">Le livre académique sur lequel ce test est basé</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">🎯 Pratique</h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <a href="https://www.metaculus.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                    Metaculus.com
                  </a><br />
                  <span className="text-sm text-gray-600">Plateforme de prédictions pour améliorer votre calibration</span>
                </li>
                <li>
                  <a href="https://www.lesswrong.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                    LessWrong.com
                  </a><br />
                  <span className="text-sm text-gray-600">Communauté et articles sur la rationalité</span>
                </li>
                <li>
                  <a href="https://www.clearerthinking.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                    ClearerThinking.org
                  </a><br />
                  <span className="text-sm text-gray-600">Outils et mini-cours gratuits sur la pensée rationnelle</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sources scientifiques */}
        <AccordionItem title="📖 Sources scientifiques et méthodologie">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Fondements principaux</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Stanovich, K. E., West, R. F., & Toplak, M. E. (2016).</strong><br />
                  <em>The Rationality Quotient: Toward a Test of Rational Thinking.</em> MIT Press.
                </li>
                <li>
                  <strong>Kahneman, D., & Tversky, A. (1974-1983).</strong><br />
                  <em>Divers articles sur les heuristiques et biais cognitifs.</em><br />
                  <span className="text-gray-600">Travaux ayant mené au Prix Nobel d'Économie 2002</span>
                </li>
                <li>
                  <strong>Frederick, S. (2005).</strong><br />
                  <em>Cognitive Reflection and Decision Making.</em> Journal of Economic Perspectives, 19(4), 25-42.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">Validité scientifique</h4>
              <p className="text-sm text-gray-700 mb-2">
                Ce test utilise des questions validées par des décennies de recherche en psychologie cognitive.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                <li>Corrélation modérée avec le QI (r ≈ 0.40)</li>
                <li>Corrélation forte avec les dispositions de pensée</li>
                <li>Capacité prédictive sur la prise de décision réelle</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">Limites</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                <li>Ce test mesure des compétences cognitives spécifiques</li>
                <li>Un score élevé n'implique pas automatiquement de meilleures décisions</li>
                <li>La performance peut varier selon votre état</li>
              </ul>
            </div>
          </div>
        </AccordionItem>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Prochaines étapes</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              📄 Télécharger (PDF)
            </button>
            <button
              onClick={() => {
                resetTest();
                router.push('/test?reset=true');
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              🔄 Refaire le test
            </button>
            <Link href="/">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors">
                🏠 Retour à l'accueil
              </button>
            </Link>
          </div>
          <p className="text-sm text-gray-600 mt-6">
            💡 Pour mesurer vos progrès, repassez le test dans 3-6 mois
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            Ce test est un projet open-source et gratuit.
          </p>
        </div>
      </div>
    </div>
  );
}