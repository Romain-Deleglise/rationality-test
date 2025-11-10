'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTestStore } from '@/store/useTestStore';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Question from '@/components/Question';
import testData from '@/data/test-court.json';
import { Module } from '@/types';

export default function TestPage() {
  const router = useRouter();
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
  } = useTestStore();

  useEffect(() => {
    if (!session) {
      startTest(testData.modules as Module[]);
    }
  }, [session, startTest]);

  if (!session || !modules.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement du test...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Module {session.currentModuleIndex + 1}/{modules.length}:{' '}
                {currentModule.name}
              </p>
              <p className="text-xs text-gray-500">
                Question {questionNumber} / {totalQuestions}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                ⏱️ ~{currentModule.time} min restantes
              </p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Question question={currentQuestion} onAnswer={handleAnswer} />

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