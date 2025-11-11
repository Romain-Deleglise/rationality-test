'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTestStore } from '@/store/useTestStore';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Question from '@/components/Question';
import testCourtData from '@/data/test-court.json';
import testCompletData from '@/data/test-complet.json';
import { Module } from '@/types';

export default function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    session,
    modules,
    startTest,
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

    // Si paramètre reset=true, on reset et redirige
    if (reset === 'true') {
      resetTest();

      // Construire l'URL de redirection en préservant la version
      const redirectUrl = version === 'full' ? '/test?version=full' : '/test';
      router.replace(redirectUrl);
      return;
    }

    // Démarrer le test seulement s'il n'y a pas de session et qu'on est initialisé
    if (!session && !reset) {
      // Charger les bonnes données selon la version
      const testData = version === 'full' ? testCompletData : testCourtData;
      const selectedModules = testData.modules as Module[];
      const versionLabel = version === 'full' ? 'complète' : 'courte';

      startTest(selectedModules, versionLabel);
      setIsInitialized(true);
    } else if (session && !isInitialized) {
      // Si une session existe déjà (depuis localStorage), marquer comme initialisé
      setIsInitialized(true);
    }
  }, [searchParams, session, isInitialized, resetTest, startTest, router]);

  if (!isInitialized || !session || !modules.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du test...</p>
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
      router.push('/resultats');
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
    <div className="min-h-screen bg-gray-50">
      {/* Barre de progression */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Module {session.currentModuleIndex + 1}/{modules.length}:{' '}
                  {currentModule.name}
                </p>
                <p className="text-xs text-gray-500">
                  Question {questionNumber}/{totalQuestions}
                </p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                session.version === 'complète'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                Version {session.version}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">
                ⏱️ ~{timeRemaining} min restantes
              </p>
              <p className="text-xs text-gray-500">
                Durée totale : ~{totalTestTime} min
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
              ← Question précédente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}