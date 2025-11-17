'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getTestResultByToken } from '@/lib/supabase';
import { translateModuleName } from '@/lib/moduleMapping';
import { ChevronDown, ChevronUp, Database, Home, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { RadarChartComponent, BarChartComponent } from '@/components/ResultsCharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SocialShare from '@/components/SocialShare';
import { getCartNorms } from '@/data/cart-reference-data';
import React from 'react';

// Composant Accordéon
const AccordionItem = ({ title, children, defaultOpen = false }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-700 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="font-semibold text-left text-gray-900 dark:text-white flex-1">
            {title}
          </span>
          <div className="flex-shrink-0">
            {isOpen ?
              <ChevronUp className="w-5 h-5 text-blue-600" /> :
              <ChevronDown className="w-5 h-5 text-gray-400" />
            }
          </div>
        </div>
      </button>
      <div className={`${isOpen ? 'block' : 'hidden'} px-6 py-5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 leading-relaxed border-t-2 border-gray-100 dark:border-gray-700`}>
        {children}
      </div>
    </div>
  );
};

export default function SavedResultsPage({ params }: { params: Promise<{ token: string; locale: string }> }) {
  const router = useRouter();
  const t = useTranslations('results');
  const tCommon = useTranslations('common');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string>('');
  const [locale, setLocale] = useState<string>('fr');
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    params.then(({ token: t, locale: l }) => {
      setToken(t);
      setLocale(l);
    });
  }, [params]);

  // Construire l'URL de partage côté client uniquement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, [token, locale]);

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
    if (score >= 76) return 'text-green-600';
    if (score >= 61) return 'text-blue-600';
    if (score >= 42) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    // Seuils calibrés sur la moyenne CART réelle (54.2%)
    // Distribution : mean=54.2%, sd=13%
    if (score >= 85) return t('scoreLabels.exceptional');  // >mean+2.33sd (top 1%)
    if (score >= 76) return t('scoreLabels.veryHigh');     // >mean+1.65sd (top 5%)
    if (score >= 68) return t('scoreLabels.high');         // >mean+1sd (top 16%)
    if (score >= 61) return t('scoreLabels.aboveAverage'); // >mean+0.5sd (top 32%)
    if (score >= 48) return t('scoreLabels.average');      // mean±0.5sd (40th-60th)
    if (score >= 42) return t('scoreLabels.slightlyBelow');// mean-1sd (25th-40th)
    if (score >= 30) return t('scoreLabels.belowAverage'); // mean-1.5sd (10th-25th)
    return t('scoreLabels.limited');                       // <mean-1.87sd (bottom 10%)
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
              {locale === 'fr'
                ? `${t('rationality')} ${getScoreLabel(result.percentage)}`
                : `${getScoreLabel(result.percentage)} ${t('rationality')}`
              }
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
              <RadarChartComponent moduleScores={moduleScores} locale={locale} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('barChart')}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[600px]">
                <BarChartComponent moduleScores={moduleScores} locale={locale} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribution Histogram - Only for complete version */}
        {result.test_version === 'complète' && (() => {
          const cartNorms = getCartNorms(result.test_version, result.total_points, result.total_possible);
          if (!cartNorms || cartNorms.sd <= 0) return null;

          const mean = (cartNorms.mean / cartNorms.totalPoints) * 100;
          const sd = Math.max(1, (cartNorms.sd / cartNorms.totalPoints) * 100); // Éviter sd trop petit
          const userScore = result.percentage;

          // Create histogram bins (approximating normal distribution)
          const bins = [];
          const numBins = 15;
          const minScore = Math.max(0, mean - 3 * sd);
          const maxScore = Math.min(100, mean + 3 * sd);
          const binWidth = (maxScore - minScore) / numBins;

          // Calculate height for each bin using normal distribution formula
          for (let i = 0; i < numBins; i++) {
            const binCenter = minScore + (i + 0.5) * binWidth;
            const z = (binCenter - mean) / sd;
            const height = Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
            bins.push({
              center: binCenter,
              height: height,
              start: minScore + i * binWidth,
              end: minScore + (i + 1) * binWidth
            });
          }

          const maxHeight = Math.max(...bins.map((b: any) => b.height));

          return (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  {locale === 'fr' ? 'Distribution des scores CART' : 'CART Score Distribution'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-justify">
                  {locale === 'fr'
                    ? `Distribution des scores de l'étude ${cartNorms.study} (N=${cartNorms.sampleSize}) avec votre position marquée. Notre test couvre 17 des 20 modules du CART complet, la comparaison est donc indicative.`
                    : `Score distribution from ${cartNorms.study} study (N=${cartNorms.sampleSize}) with your position marked. Our test covers 17 out of 20 CART modules, so this comparison is indicative.`}
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    {/* Histogram bars */}
                    <div className="relative h-56 flex items-end justify-center gap-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      {bins.map((bin: any, idx: number) => {
                        // Calculate height in pixels (h-56 = 224px, minus padding)
                        const heightInPixels = (bin.height / maxHeight) * 160;
                        const isUserBin = userScore >= bin.start && userScore < bin.end;

                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center justify-end relative">
                            {/* User position marker */}
                            {isUserBin && (
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                <div className="bg-purple-600 dark:bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                                  {locale === 'fr' ? 'VOUS' : 'YOU'}
                                </div>
                              </div>
                            )}
                            <div
                              className={`w-full rounded-t transition-all duration-200 ${
                                isUserBin
                                  ? 'bg-purple-600 dark:bg-purple-500 shadow-xl ring-2 ring-purple-400 dark:ring-purple-300'
                                  : 'bg-blue-400 dark:bg-blue-500'
                              }`}
                              style={{ height: `${heightInPixels}px`, minHeight: '4px' }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 px-2">
                      <span>{minScore.toFixed(0)}%</span>
                      <span className="font-semibold">{mean.toFixed(1)}%</span>
                      <span>{maxScore.toFixed(0)}%</span>
                    </div>

                    {/* Legend and statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3">
                        <div className="font-semibold text-gray-900 dark:text-white mb-1">
                          {locale === 'fr' ? 'Moyenne' : 'Mean'}
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 font-bold">
                          {mean.toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3">
                        <div className="font-semibold text-gray-900 dark:text-white mb-1">
                          {locale === 'fr' ? 'Écart-type' : 'Standard Deviation'}
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 font-bold">
                          ±{sd.toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-3">
                        <div className="font-semibold text-gray-900 dark:text-white mb-1">
                          {locale === 'fr' ? 'Votre score' : 'Your Score'}
                        </div>
                        <div className="text-purple-600 dark:text-purple-400 font-bold">
                          {userScore.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Z-score interpretation */}
                    <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded p-3">
                      {(() => {
                        const z = (userScore - mean) / sd;
                        const absZ = Math.abs(z);
                        let interpretation = '';

                        if (locale === 'fr') {
                          if (absZ < 0.5) interpretation = 'Votre score est très proche de la moyenne.';
                          else if (absZ < 1) interpretation = z > 0 ? 'Votre score est légèrement au-dessus de la moyenne.' : 'Votre score est légèrement en-dessous de la moyenne.';
                          else if (absZ < 1.5) interpretation = z > 0 ? 'Votre score est nettement au-dessus de la moyenne.' : 'Votre score est nettement en-dessous de la moyenne.';
                          else if (absZ < 2) interpretation = z > 0 ? 'Votre score est bien au-dessus de la moyenne (top 16%).' : 'Votre score se situe en-dessous de la moyenne (16e percentile).';
                          else interpretation = z > 0 ? 'Votre score est exceptionnellement élevé (top 2%).' : 'Votre score se situe dans les 2% les plus bas.';
                        } else {
                          if (absZ < 0.5) interpretation = 'Your score is very close to the mean.';
                          else if (absZ < 1) interpretation = z > 0 ? 'Your score is slightly above the mean.' : 'Your score is slightly below the mean.';
                          else if (absZ < 1.5) interpretation = z > 0 ? 'Your score is notably above the mean.' : 'Your score is notably below the mean.';
                          else if (absZ < 2) interpretation = z > 0 ? 'Your score is well above the mean (top 16%).' : 'Your score is below the mean (16th percentile).';
                          else interpretation = z > 0 ? 'Your score is exceptionally high (top 2%).' : 'Your score is in the lowest 2%.';
                        }

                        return <><strong>{locale === 'fr' ? 'Interprétation :' : 'Interpretation:'}</strong> {interpretation}</>;
                      })()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}

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

        {/* Sources scientifiques */}
        <AccordionItem title={t('scientificSources.title')}>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t('scientificSources.mainFoundations')}</h4>
              <ul className="space-y-2">
                <li>
                  <strong>Stanovich, K. E., West, R. F., & Toplak, M. E. (2016).</strong><br />
                  <em>{t('scientificSources.stanovich2016')}</em>
                </li>
                <li>
                  <strong>Kahneman, D., & Tversky, A. (1974).</strong><br />
                  <em>{t('scientificSources.kahneman1974')}</em>
                </li>
                <li>
                  <strong>Frederick, S. (2005).</strong><br />
                  <em>{t('scientificSources.frederick2005')}</em>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t('scientificSources.onImprovement')}</h4>
              <ul className="space-y-2">
                <li>
                  <strong>Morewedge et al. (2015).</strong><br />
                  <em>{t('scientificSources.morewedge2015')}</em><br />
                  <span className="text-gray-600 dark:text-gray-400">{t('scientificSources.morewedge2015Desc')}</span>
                </li>
                <li>
                  <strong>Kahneman, D. (2011).</strong><br />
                  <em>{t('scientificSources.kahneman2011')}</em><br />
                  <span className="text-gray-600 dark:text-gray-400 italic">{t('scientificSources.kahneman2011Quote')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t('scientificSources.testLimitations')}</h4>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>{t('scientificSources.limitation1')}</li>
                <li>{t('scientificSources.limitation2')}</li>
                <li>{t('scientificSources.limitation3')}</li>
                <li>{t('scientificSources.limitation4')}</li>
              </ul>
            </div>
          </div>
        </AccordionItem>

        {/* State of Research */}
        <AccordionItem title={t('stateOfResearch.title')} defaultOpen={false}>
          <div className="space-y-6">
            <p className="text-gray-700 dark:text-gray-300 italic text-justify">
              {t('stateOfResearch.intro')}
            </p>

            {/* What We Know */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✅</span>
                {t('stateOfResearch.whatWeKnow')}
              </h4>
              <div className="space-y-3 pl-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.finding1')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.finding1Text')}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.finding2')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.finding2Text')}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.finding3')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.finding3Text')}</p>
                </div>
              </div>
            </div>

            {/* What We Don't Know */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-yellow-600 dark:text-yellow-400">❓</span>
                {t('stateOfResearch.whatWeDontKnow')}
              </h4>
              <div className="space-y-3 pl-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.question1')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.question1Text')}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.question2')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.question2Text')}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.question3')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.question3Text')}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.question4')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.question4Text')}</p>
                </div>
              </div>
            </div>

            {/* Active Controversies */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-red-600 dark:text-red-400">⚡</span>
                {t('stateOfResearch.activeControversies')}
              </h4>
              <div className="space-y-3 pl-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.controversy1')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.controversy1Text')}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.controversy2')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.controversy2Text')}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.controversy3')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.controversy3Text')}</p>
                </div>
              </div>
            </div>

            {/* Bottom Line */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-600 p-4 rounded">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">{t('stateOfResearch.honestBottomLine')}</h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <li>{t('stateOfResearch.bottomLine1')}</li>
                <li>{t('stateOfResearch.bottomLine2')}</li>
                <li>{t('stateOfResearch.bottomLine3')}</li>
                <li>{t('stateOfResearch.bottomLine4')}</li>
                <li>{t('stateOfResearch.bottomLine5')}</li>
              </ul>
            </div>

            {/* Recent Work */}
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.recentWork')}</strong>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.recentWorkText')}</p>
            </div>
          </div>
        </AccordionItem>

        {/* Social Share */}
        {shareUrl && (
          <div className="flex flex-col items-center gap-3 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{locale === 'fr' ? 'Partager ces résultats' : 'Share these results'}</h3>
            <SocialShare
              url={shareUrl}
              title={locale === 'fr'
                ? `Résultats du test de rationalité CART - ${result?.global_percentage?.toFixed(1)}%`
                : `CART rationality test results - ${result?.global_percentage?.toFixed(1)}%`}
              description={locale === 'fr'
                ? 'Découvrez ces résultats détaillés au test CART de rationalité'
                : 'Discover these detailed results on the CART rationality test'}
              locale={locale}
            />
          </div>
        )}

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
