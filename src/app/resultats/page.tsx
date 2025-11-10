'use client';

import { useEffect, useState } from 'react';
import { useTestStore } from '@/store/useTestStore';
import Link from 'next/link';

export default function ResultatsPage() {
  const { session } = useTestStore();
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (session?.answers) {
      // Calcul basique du score (on affinera plus tard)
      setScore(session.answers.length);
    }
  }, [session]);

  if (!session?.completedAt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Aucun test complété</h1>
          <Link href="/test" className="text-blue-600 hover:underline">
            → Commencer le test
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Test Complété !
          </h1>
          
          <div className="my-8">
            <div className="text-6xl font-bold text-blue-600">
              {score}
            </div>
            <p className="text-gray-600 mt-2">Questions répondues</p>
          </div>

          <p className="text-gray-600 mb-8">
            Votre test a été complété avec succès. Le système de scoring 
            détaillé sera implémenté prochainement.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Retour à l'accueil
            </Link>
            <Link
              href="/test"
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
            >
              Recommencer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}