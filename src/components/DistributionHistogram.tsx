'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface HistogramProps {
  cartNorms: {
    study: string;
    sampleSize: number;
    mean: number;
    sd: number;
    totalPoints: number;
  };
  userScore: number;
  locale: string;
  showCard?: boolean;
  showTitle?: boolean;
}

export function DistributionHistogram({ cartNorms, userScore, locale, showCard = true, showTitle = true }: HistogramProps) {
  const { bins, mean, sd, minScore, maxScore } = useMemo(() => {
    const mean = (cartNorms.mean / cartNorms.totalPoints) * 100;
    const sd = (cartNorms.sd / cartNorms.totalPoints) * 100;

    const numBins = 15;
    const minScore = Math.max(0, mean - 3 * sd);
    const maxScore = Math.min(100, mean + 3 * sd);
    const binWidth = (maxScore - minScore) / numBins;

    const bins = [];
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

    return { bins, mean, sd, minScore, maxScore };
  }, [cartNorms, userScore]);

  const maxHeight = Math.max(...bins.map(b => b.height));

  const content = (
    <>
      {showTitle && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-justify">
          {locale === 'fr'
            ? `Distribution des scores de l'étude ${cartNorms.study} (N=${cartNorms.sampleSize}) avec votre position marquée.`
            : `Score distribution from ${cartNorms.study} study (N=${cartNorms.sampleSize}) with your position marked.`}
        </p>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            {/* Histogram bars */}
            <div className="relative h-48 flex items-end justify-center gap-0.5">
              {bins.map((bin, idx) => {
                const normalizedHeight = (bin.height / maxHeight) * 100;
                const isUserBin = userScore >= bin.start && userScore < bin.end;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end">
                    <div
                      className={`w-full rounded-t transition-colors ${
                        isUserBin
                          ? 'bg-purple-500 dark:bg-purple-400'
                          : 'bg-blue-300 dark:bg-blue-600'
                      }`}
                      style={{ height: `${normalizedHeight}%` }}
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
                  else if (absZ < 2) interpretation = z > 0 ? 'Votre score est bien au-dessus de la moyenne (top 16%).' : 'Votre score est bien en-dessous de la moyenne (bottom 16%).';
                  else interpretation = z > 0 ? 'Votre score est exceptionnellement élevé (top 2%).' : 'Votre score est exceptionnellement bas (bottom 2%).';
                } else {
                  if (absZ < 0.5) interpretation = 'Your score is very close to the mean.';
                  else if (absZ < 1) interpretation = z > 0 ? 'Your score is slightly above the mean.' : 'Your score is slightly below the mean.';
                  else if (absZ < 1.5) interpretation = z > 0 ? 'Your score is notably above the mean.' : 'Your score is notably below the mean.';
                  else if (absZ < 2) interpretation = z > 0 ? 'Your score is well above the mean (top 16%).' : 'Your score is well below the mean (bottom 16%).';
                  else interpretation = z > 0 ? 'Your score is exceptionally high (top 2%).' : 'Your score is exceptionally low (bottom 2%).';
                }

                return <><strong>{locale === 'fr' ? 'Interprétation :' : 'Interpretation:'}</strong> {interpretation}</>;
              })()}
            </div>
          </div>
        </div>
      </>
    );

  if (showCard) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {locale === 'fr' ? 'Distribution des scores CART' : 'CART Score Distribution'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    );
  }

  return content;
}
