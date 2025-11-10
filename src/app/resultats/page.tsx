'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTestStore } from '@/store/useTestStore';
import { scoreTest, calculatePercentile, TestScore } from '@/lib/scoring';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function ResultatsPage() {
  const router = useRouter();
  const { session, modules, resetTest } = useTestStore();
  const [testScore, setTestScore] = useState<TestScore | null>(null);

  useEffect(() => {
    if (!session?.completedAt || !modules.length) {
      router.push('/test');
      return;
    }

    // Calculer les scores
    const scores = scoreTest(modules, session.answers);
    const percentile = calculatePercentile(scores.percentage);
    setTestScore({ ...scores, percentile });
  }, [session, modules, router]);

  if (!testScore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Calcul des résultats...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Résultats de votre Test
          </h1>
          <p className="text-gray-600">
            Complété le {new Date(session!.completedAt!).toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Score Global */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Score Global</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {testScore.percentage.toFixed(1)}%
              </div>
              <div className="text-2xl text-gray-600 mb-4">
                {testScore.totalEarned.toFixed(1)} / {testScore.totalPossible} points
              </div>
              {testScore.percentile && (
                <p className="text-lg text-gray-600">
                  Vous êtes dans le <strong>{testScore.percentile}ème percentile</strong>
                </p>
              )}
            </div>

            <Progress value={testScore.percentage} className="h-4 mb-4" />

            <p className="text-center text-gray-700 bg-blue-50 p-4 rounded-lg">
              {testScore.interpretation}
            </p>
          </CardContent>
        </Card>

        {/* Scores par Module */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Détail par Module</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testScore.modules.map((moduleScore) => (
                <div key={moduleScore.moduleId} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{moduleScore.moduleName}</h3>
                    <span className="text-lg font-bold text-blue-600">
                      {moduleScore.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={moduleScore.percentage} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">
                    {moduleScore.earned.toFixed(1)} / {moduleScore.possible} points
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Forces et Faiblesses */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Forces */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">💪 Points Forts</CardTitle>
            </CardHeader>
            <CardContent>
              {testScore.strengths.length > 0 ? (
                <ul className="space-y-2">
                  {testScore.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{strength}</span>
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

          {/* Faiblesses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">🎯 À Améliorer</CardTitle>
            </CardHeader>
            <CardContent>
              {testScore.weaknesses.length > 0 ? (
                <ul className="space-y-2">
                  {testScore.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-orange-500">→</span>
                      <span>{weakness}</span>
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

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Retour à l'accueil
          </Link>
          <button
            onClick={() => {
              resetTest();
              router.push('/test');
            }}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            Recommencer
          </button>
        </div>
      </div>
    </div>
  );
}