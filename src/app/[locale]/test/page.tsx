import { Suspense } from 'react';
import TestContent from './TestContent';

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement du test...</p>
        </div>
      </div>
    }>
      <TestContent />
    </Suspense>
  );
}