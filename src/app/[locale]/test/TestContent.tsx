'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTestStore } from '@/store/useTestStore';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Question from '@/components/Question';
import testCourtDataFr from '@/data/test-court.json';
import testCompletDataFr from '@/data/test-complet.json';
import testCourtDataEn from '@/data/test-court-en.json';
import testCompletDataEn from '@/data/test-complet-en.json';
import { Module } from '@/types';
import { track } from '@vercel/analytics';

export default function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('test');
  const tCommon = useTranslations('common');
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    session,
    modules,
    startTest,
    updateModules,
    saveAnswer,
    nextQuestion,
    previousQuestion,
    completeTest,
    getCurrentModule,
    getCurrentQuestion,
    getProgress,
    resetTest,
  } = useTestStore();

  useEffect(() => {
    const reset = searchParams.get('reset');
    const version = searchParams.get('version');

    // Si le test est déjà complété, rediriger vers les résultats
    if (session?.completedAt && !reset) {
      router.replace(`/${locale}/resultats`);
      return;
    }

    // Si paramètre reset=true, on reset et redirige
    if (reset === 'true') {
      resetTest();

      // Construire l'URL de redirection en préservant la version
      const redirectUrl = version === 'full' ? `/${locale}/test?version=full` : `/${locale}/test`;
      router.replace(redirectUrl);
      return;
    }

    // Démarrer le test seulement s'il n'y a pas de session et qu'on est initialisé
    if (!session && !reset) {
      // Charger les bonnes données selon la version et la langue
      let testData;
      if (locale === 'en') {
        testData = version === 'full' ? testCompletDataEn : testCourtDataEn;
      } else {
        testData = version === 'full' ? testCompletDataFr : testCourtDataFr;
      }

      const selectedModules = testData.modules as Module[];
      // Store version in French for consistency, translate only for display
      const versionLabel = version === 'full' ? 'complète' : 'courte';

      startTest(selectedModules, versionLabel);
      setIsInitialized(true);
    } else if (session && !isInitialized) {
      // Si une session existe déjà (depuis localStorage), marquer comme initialisé
      setIsInitialized(true);

      // Mettre à jour les modules pour correspondre à la langue actuelle
      const versionParam = searchParams.get('version');
      let testData;
      if (locale === 'en') {
        testData = versionParam === 'full' ? testCompletDataEn : testCourtDataEn;
      } else {
        testData = versionParam === 'full' ? testCompletDataFr : testCourtDataFr;
      }
      const selectedModules = testData.modules as Module[];
      updateModules(selectedModules);
    }
  }, [searchParams, session, isInitialized, resetTest, startTest, updateModules, router, locale]);

  if (!isInitialized || !session || !modules.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  const currentModule = getCurrentModule();
  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();

  if (!currentModule || !currentQuestion) {
    return null;
  }

  const isLastModule = session.currentModuleIndex === modules.length - 1;
  const isLastQuestion =
    session.currentQuestionIndex >= currentModule.questions.length - 1;

  const handleAnswer = (value: any) => {
    saveAnswer({
      questionId: currentQuestion.id,
      value,
      timestamp: new Date(),
    });

    if (isLastQuestion && isLastModule) {
      completeTest();

      // Track test completion
      const testDuration = session.startedAt
        ? Math.round((Date.now() - new Date(session.startedAt).getTime()) / 1000 / 60) // en minutes
        : 0;

      track('test_completed', {
        version: session.version,
        locale,
        duration_minutes: testDuration,
        total_questions: totalQuestions,
      });

      router.push(`/${locale}/resultats`);
    } else {
      nextQuestion();
    }
  };

  const questionNumber =
    modules
      .slice(0, session.currentModuleIndex)
      .reduce((sum: number, m: Module) => sum + m.questions.length, 0) +
    session.currentQuestionIndex +
    1;

  const totalQuestions = modules.reduce(
    (sum: number, m: Module) => sum + m.questions.length,
    0
  );

  // Calculer le temps restant estimé
  const totalTestTime = modules.reduce((sum: number, m: Module) => sum + m.time, 0);
  const timePerQuestion = totalTestTime / totalQuestions;
  const questionsRemaining = totalQuestions - questionNumber + 1; // +1 car on compte la question actuelle
  const timeRemaining = Math.ceil(timePerQuestion * questionsRemaining);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Barre de progression */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Module {session.currentModuleIndex + 1}/{modules.length}:{' '}
                  {currentModule.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('question')} {questionNumber} {t('of')} {totalQuestions}
                </p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                session.version === 'complète'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
              }`}>
                {tCommon('version')} {session.version === 'complète' ? tCommon('full') : tCommon('short')}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                ⏱️ ~{timeRemaining} {t('minutes')} {t('timeRemaining')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {locale === 'fr' ? 'Durée totale' : 'Total duration'} : ~{totalTestTime} {t('minutes')}
              </p>
            </div>
          </div>

          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <div className="container mx-auto px-4 py-12">
        <Question question={currentQuestion} onAnswer={handleAnswer} />

        {/* Bouton Précédent */}
        {(session.currentQuestionIndex > 0 || session.currentModuleIndex > 0) && (
          <div className="max-w-3xl mx-auto mt-4">
            <Button
              variant="outline"
              onClick={previousQuestion}
              className="w-full"
            >
              ← {t('previous')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}