'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTestResultByToken } from '@/lib/supabase';
import { ChevronDown, ChevronUp, Database, Home } from 'lucide-react';
import Link from 'next/link';
import { RadarChartComponent, BarChartComponent } from '@/components/ResultsCharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SavedResultsPage({ params }: { params: { token: string; locale: string } }) {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { locale } = params;

  useEffect(() => {
    const loadResult = async () => {
      try {
        const data = await getTestResultByToken(params.token);
        if (!data) {
          setError('Résultats introuvables');
          return;
        }
        setResult(data);
      } catch (err) {
        setError('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [params.token]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Très Élevée';
    if (score >= 70) return 'Élevée';
    if (score >= 55) return 'Moyenne';
    if (score >= 40) return 'Sous la Moyenne';
    return 'Limitée';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center max-w-md p-8">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Résultats introuvables</h1>
          <p className="text-gray-600 mb-6">
            Ce lien de résultats n'existe pas ou a expiré.
          </p>
          <Link href={`/${locale}`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto">
              <Home className="w-5 h-5" />
              Retour à l'accueil
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const moduleScores = result.module_scores;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Résultats Sauvegardés
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Test de Rationalité (CART adapté)
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-sm text-gray-500">
              Complété le {new Date(result.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <span className="text-gray-400">•</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              result.test_version === 'complète'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              Version {result.test_version}
            </span>
          </div>
        </div>

        {/* Score Global */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center border-t-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Score Global</h2>
          <div className="mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.percentage)}`}>
              {result.percentage.toFixed(1)}%
            </div>
            <div className={`text-2xl font-semibold mb-2 ${getScoreColor(result.percentage)}`}>
              Rationalité {getScoreLabel(result.percentage)}
            </div>
            <div className="text-lg text-gray-600">
              {result.total_points.toFixed(1)} / {result.total_possible.toFixed(1)} points
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="space-y-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Profil de Rationalité</CardTitle>
            </CardHeader>
            <CardContent>
              <RadarChartComponent moduleScores={moduleScores} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Classement par Module</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent moduleScores={moduleScores} />
            </CardContent>
          </Card>
        </div>

        {/* Détail par Module */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-t-4 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Détail par Module
          </h2>

          <div className="space-y-3">
            {moduleScores
              .filter((m: any) => m.possible > 0)
              .sort((a: any, b: any) => b.percentage - a.percentage)
              .map((moduleScore: any) => {
                const moduleName = moduleScore.moduleName.split(' (')[0];
                const getBarColor = (score: number) => {
                  if (score >= 75) return 'bg-green-500';
                  if (score >= 50) return 'bg-blue-500';
                  if (score >= 35) return 'bg-yellow-500';
                  return 'bg-red-500';
                };

                return (
                  <div key={moduleScore.moduleId} className="border-2 border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{moduleName}</span>
                      <span className={`font-bold ${getScoreColor(moduleScore.percentage)}`}>
                        {moduleScore.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className={`${getBarColor(moduleScore.percentage)} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${moduleScore.percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      {moduleScore.earned.toFixed(1)} / {moduleScore.possible.toFixed(1)} points
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Actions */}
        <div className="text-center">
          <Link href={`/${locale}`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto">
              <Home className="w-5 h-5" />
              Retour à l'accueil
            </button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Envie de tester votre rationalité ? Passez le test !
          </p>
        </div>
      </div>
    </div>
  );
}
