import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Test de Rationalité
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Évaluez votre capacité à raisonner rationnellement.
          </p>
          <Link
            href="/test"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg 
                     hover:bg-blue-700 transition text-lg font-semibold"
          >
            Commencer le test
          </Link>
        </div>
      </div>
    </main>
  )
}