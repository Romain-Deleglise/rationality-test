'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getTestResultByToken } from '@/lib/supabase';
import { translateModuleName } from '@/lib/moduleMapping';
import { ChevronDown, ChevronUp, Database, Home } from 'lucide-react';
import Link from 'next/link';
import { RadarChartComponent, BarChartComponent } from '@/components/ResultsCharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SocialShare from '@/components/SocialShare';

export default function SavedResultsPage({ params }: { params: Promise<{ token: string; locale: string }> }) {
  const router = useRouter();
  const t = useTranslations('results');
  const tCommon = useTranslations('common');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string>('');
  const [locale, setLocale] = useState<string>('fr');

  useEffect(() => {
    params.then(({ token: t, locale: l }) => {
      setToken(t);
      setLocale(l);
    });
  }, [params]);

  useEffect(() => {
    if (!token) return;

    const loadResult = async () => {
      try {
        console.log('Loading result for token:', token);
        const data = await getTestResultByToken(token);
        console.log('Result data:', data);
        if (!data) {
          setError(t('notFound'));
          return;
        }
        setResult(data);
      } catch (err) {
        console.error('Error loading result:', err);
        setError(tCommon('error'));
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [token]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return t('scoreLabels.veryHigh');
    if (score >= 70) return t('scoreLabels.high');
    if (score >= 55) return t('scoreLabels.average');
    if (score >= 40) return t('scoreLabels.belowAverage');
    return t('scoreLabels.limited');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t('loadingResults')}</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md p-8">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('notFound')}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('notFoundDescription')}
          </p>
          <Link href={`/${locale}`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto">
              <Home className="w-5 h-5" />
              {t('backHome')}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const moduleScores = result.module_scores;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {t('savedResultsTitle')}
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('completedOn')} {new Date(result.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              result.test_version === 'complète'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {tCommon('version')} {result.test_version === 'complète' ? tCommon('full') : tCommon('short')}
            </span>
          </div>
        </div>

        {/* Score Global */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 text-center border-t-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('globalScore')}</h2>
          <div className="mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.percentage)}`}>
              {result.percentage.toFixed(1)}%
            </div>
            <div className={`text-2xl font-semibold mb-2 ${getScoreColor(result.percentage)}`}>
              {t('rationality')} {getScoreLabel(result.percentage)}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-300">
              {result.total_points.toFixed(1)} / {result.total_possible.toFixed(1)} {t('points')}
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="space-y-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('radarChart')}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadarChartComponent moduleScores={moduleScores} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('barChart')}</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent moduleScores={moduleScores} />
            </CardContent>
          </Card>
        </div>

        {/* Test Origin Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-8 mb-8 border-t-4 border-indigo-600">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('testOrigin.title')}
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('testOrigin.whatIsCart')}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {t('testOrigin.cartDescription')}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t('testOrigin.basedOnResearch')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('testOrigin.thisAdaptation')}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {t('testOrigin.adaptationDescription')}
              </p>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">
                💡 {t('testOrigin.keyDifference')}
              </p>
            </div>
          </div>
        </div>

        {/* Détail par Module */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border-t-4 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('moduleDetails')}
          </h2>

          <div className="space-y-3">
            {moduleScores
              .filter((m: any) => m.possible > 0)
              .sort((a: any, b: any) => b.percentage - a.percentage)
              .map((moduleScore: any) => {
                const rawModuleName = moduleScore.moduleName.split(' (')[0];
                // Translate module name to current locale for display
                const displayName = translateModuleName(rawModuleName, locale as 'en' | 'fr');
                const getBarColor = (score: number) => {
                  if (score >= 75) return 'bg-green-500';
                  if (score >= 50) return 'bg-blue-500';
                  if (score >= 35) return 'bg-yellow-500';
                  return 'bg-red-500';
                };

                const description = t(`moduleDescriptions.${displayName}`);

                return (
                  <div key={moduleScore.moduleId} className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">{displayName}</span>
                      <span className={`font-bold ${getScoreColor(moduleScore.percentage)}`}>
                        {moduleScore.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2">
                      <div
                        className={`${getBarColor(moduleScore.percentage)} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${moduleScore.percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {moduleScore.earned.toFixed(1)} / {moduleScore.possible.toFixed(1)} points
                    </div>
                    {description && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 italic mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        {description}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Social Share */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{locale === 'fr' ? 'Partager ces résultats' : 'Share these results'}</h3>
          <SocialShare
            url={`${typeof window !== 'undefined' ? window.location.href : ''}`}
            title={locale === 'fr'
              ? `Résultats du test de rationalité - ${result?.global_percentage?.toFixed(1)}%`
              : `Rationality test results - ${result?.global_percentage?.toFixed(1)}%`}
            description={locale === 'fr'
              ? 'Découvrez les résultats de ce test de rationalité basé sur CART'
              : 'Check out these rationality test results based on CART'}
            locale={locale}
          />
        </div>

        {/* Actions */}
        <div className="text-center">
          <Link href={`/${locale}`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto">
              <Home className="w-5 h-5" />
              {t('backHome')}
            </button>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            {t('wantToTest')}
          </p>
        </div>
      </div>
    </div>
  );
}
