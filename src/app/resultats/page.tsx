'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTestStore } from '@/store/useTestStore';
import { scoreTest, calculatePercentile, TestScore } from '@/lib/scoring';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RadarChartComponent, BarChartComponent } from '@/components/ResultsCharts';
import { Recommendations } from '@/components/Recommendations';

export default function ResultatsPage() {
  const router = useRouter();
  const { session, modules, resetTest } = useTestStore();
  const [testScore, setTestScore] = useState<TestScore | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'recommendations'>('overview');

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Résultats de votre Test de Rationalité
          </h1>
          <p className="text-gray-600">
            Complété le {new Date(session!.completedAt!).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Score Global */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-block">
                <div className="text-7xl font-bold text-blue-600 mb-2">
                  {testScore.percentage.toFixed(1)}%
                </div>
                <div className="text-xl text-gray-600 mb-1">
                  {testScore.totalEarned.toFixed(1)} / {testScore.totalPossible.toFixed(1)} points
                </div>
                {testScore.percentile && (
                  <div className="text-lg text-gray-500">
                    {testScore.percentile}ème percentile
                  </div>
                )}
              </div>
            </div>

            <Progress value={testScore.percentage} className="h-4 my-6" />

            <p className="text-center text-lg text-gray-700 bg-blue-50 p-4 rounded-lg">
              {testScore.interpretation}
            </p>
          </CardContent>
        </Card>

        {/* Onglets */}
        <div className="mb-6">
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'details'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Détails par module
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'recommendations'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Recommandations
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Graphiques */}
            <div className="grid md:grid-cols-2 gap-6">
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

            {/* Forces et Faiblesses */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">💪 Points Forts</CardTitle>
                </CardHeader>
                <CardContent>
                  {testScore.strengths.length > 0 ? (
                    <ul className="space-y-2">
                      {testScore.strengths.map((strength, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-500 text-xl">✓</span>
                          <span className="text-gray-700">{strength.split(' (')[0]}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      Continuez à travailler pour identifier vos points forts.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">🎯 À Améliorer</CardTitle>
                </CardHeader>
                <CardContent>
                  {testScore.weaknesses.length > 0 ? (
                    <ul className="space-y-2">
                      {testScore.weaknesses.map((weakness, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-orange-500 text-xl">→</span>
                          <span className="text-gray-700">{weakness.split(' (')[0]}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      Excellent ! Aucune faiblesse majeure détectée.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <Card>
            <CardHeader>
              <CardTitle>Détail par Module</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {testScore.modules
                  .filter(m => m.possible > 0)
                  .sort((a, b) => b.percentage - a.percentage)
                  .map((moduleScore) => (
                    <div key={moduleScore.moduleId} className="border-b pb-6 last:border-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {moduleScore.moduleName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {moduleScore.earned.toFixed(1)} / {moduleScore.possible.toFixed(1)} points
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {moduleScore.percentage.toFixed(0)}%
                          </div>
                        </div>
                      </div>
                      <Progress value={moduleScore.percentage} className="h-2" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'recommendations' && (
          <Recommendations moduleScores={testScore.modules} />
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center mt-8">
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="lg"
            className="print:hidden"
          >
            📄 Imprimer / Sauvegarder PDF
          </Button>
          <Link href="/">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Retour à l'accueil
            </Button>
          </Link>
          <Button
            onClick={() => {
              resetTest();
              router.push('/test');
            }}
            variant="outline"
            size="lg"
          >
            Recommencer
          </Button>
        </div>

        {/* Print styles */}
        <style jsx global>{`
          @media print {
            body {
              background: white;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}