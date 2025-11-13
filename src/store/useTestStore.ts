import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TestSession, Answer, Module, Question } from '@/types';
import { generateRandomizedValues, hasRandomization, getRandomizedQuestion } from '@/lib/randomization';

interface TestStore {
  session: TestSession | null;
  modules: Module[];

  // Actions
  startTest: (modules: Module[], version: 'courte' | 'complète') => void;
  updateModules: (modules: Module[]) => void;
  saveAnswer: (answer: Answer) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeTest: () => void;
  resetTest: () => void;

  // Getters
  getCurrentModule: () => Module | null;
  getCurrentQuestion: () => any;
  getProgress: () => number;
}

export const useTestStore = create<TestStore>()(
  persist(
    (set, get) => ({
      session: null,
      modules: [],

      startTest: (modules, version) => {
        // Generate randomized values for all questions with randomization rules
        const randomizedValues: TestSession['randomizedValues'] = {};

        modules.forEach((module) => {
          module.questions.forEach((question: Question) => {
            if (question.randomization && hasRandomization(question)) {
              randomizedValues[question.id] = generateRandomizedValues(
                question.randomization
              );
            }
          });
        });

        const newSession: TestSession = {
          id: crypto.randomUUID(),
          version: version,
          startedAt: new Date(),
          answers: [],
          currentModuleIndex: 0,
          currentQuestionIndex: 0,
          randomizedValues,
        };
        set({ session: newSession, modules });
      },

      updateModules: (modules) => {
        set({ modules });
      },

      saveAnswer: (answer) => {
        const session = get().session;
        if (!session) return;

        const newAnswers = [...session.answers];
        const existingIndex = newAnswers.findIndex(
          (a) => a.questionId === answer.questionId
        );

        if (existingIndex >= 0) {
          newAnswers[existingIndex] = answer;
        } else {
          newAnswers.push(answer);
        }

        set({
          session: { ...session, answers: newAnswers },
        });
      },

      nextQuestion: () => {
        const session = get().session;
        const modules = get().modules;
        if (!session) return;

        const currentModule = modules[session.currentModuleIndex];
        const isLastQuestionInModule = 
          session.currentQuestionIndex >= currentModule.questions.length - 1;

        if (isLastQuestionInModule) {
          // Passer au module suivant
          if (session.currentModuleIndex < modules.length - 1) {
            set({
              session: {
                ...session,
                currentModuleIndex: session.currentModuleIndex + 1,
                currentQuestionIndex: 0,
              },
            });
          }
        } else {
          // Question suivante dans le même module
          set({
            session: {
              ...session,
              currentQuestionIndex: session.currentQuestionIndex + 1,
            },
          });
        }
      },

      previousQuestion: () => {
        const session = get().session;
        if (!session) return;

        if (session.currentQuestionIndex > 0) {
          set({
            session: {
              ...session,
              currentQuestionIndex: session.currentQuestionIndex - 1,
            },
          });
        } else if (session.currentModuleIndex > 0) {
          const modules = get().modules;
          const prevModule = modules[session.currentModuleIndex - 1];
          set({
            session: {
              ...session,
              currentModuleIndex: session.currentModuleIndex - 1,
              currentQuestionIndex: prevModule.questions.length - 1,
            },
          });
        }
      },

      completeTest: () => {
        const session = get().session;
        if (!session) return;

        set({
          session: {
            ...session,
            completedAt: new Date(),
          },
        });
      },

      resetTest: () => {
        set({ session: null, modules: [] });
      },

      getCurrentModule: () => {
        const { session, modules } = get();
        if (!session || !modules.length) return null;
        return modules[session.currentModuleIndex];
      },

      getCurrentQuestion: () => {
        const { session } = get();
        const currentModule = get().getCurrentModule();
        if (!session || !currentModule) return null;
        const question = currentModule.questions[session.currentQuestionIndex];
        // Apply randomization if available
        return getRandomizedQuestion(question, session.randomizedValues);
      },

      getProgress: () => {
        const { session, modules } = get();
        if (!session || !modules.length) return 0;

        let totalQuestions = 0;
        let answeredQuestions = 0;

        modules.forEach((module, moduleIndex) => {
          module.questions.forEach((_question, qIndex) => {
            totalQuestions++;
            if (
              moduleIndex < session.currentModuleIndex ||
              (moduleIndex === session.currentModuleIndex && 
               qIndex <= session.currentQuestionIndex)
            ) {
              answeredQuestions++;
            }
          });
        });

        return (answeredQuestions / totalQuestions) * 100;
      },
    }),
    {
      name: 'rationality-test-storage',
    }
  )
);