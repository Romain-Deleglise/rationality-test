'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTestStore } from '@/store/useTestStore';
import { scoreTest, calculatePercentile, TestScore } from '@/lib/scoring';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadarChartComponent, BarChartComponent } from '@/components/ResultsCharts';
import { ChevronDown, ChevronUp, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';

// Composant Accordéon réutilisable
const AccordionItem = ({ title, children, defaultOpen = false }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-left text-gray-900">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white text-gray-700 leading-relaxed text-justify">
          {children}
        </div>
      )}
    </div>
  );
};

export default function ResultatsPage() {
  const router = useRouter();
  const { session, modules, resetTest } = useTestStore();
  const [testScore, setTestScore] = useState<TestScore | null>(null);

  useEffect(() => {
    if (!session?.completedAt || !modules.length) {
      router.push('/test');
      return;
    }

    const scores = scoreTest(modules, session.answers);
    const percentile = calculatePercentile(scores.percentage);
    setTestScore({ ...scores, percentile });
  }, [session, modules, router]);

  if (!testScore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calcul des résultats...</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Exceptionnelle';
    if (score >= 70) return 'Solide';
    if (score >= 55) return 'Moyenne';
    return 'À améliorer';
  };

  // Descriptions détaillées pour chaque module
  const moduleDescriptions: Record<string, {
    what: string;
    why: string;
    example: string;
    improve: string;
  }> = {
    'Raisonnement Probabiliste': {
      what: "Votre capacité à raisonner correctement avec les probabilités et à éviter les erreurs classiques comme la négligence des taux de base, l'erreur du parieur, ou l'erreur de conjonction.",
      why: "Dans la vie réelle, nous devons constamment évaluer des probabilités : risque d'accident, chances de succès d'un projet, fiabilité d'un test médical. Une mauvaise compréhension des probabilités mène à de mauvaises décisions.",
      example: "Le fameux 'Problème de Linda' : Linda est militante féministe. Qu'est-ce qui est plus probable : (A) Linda est banquière, ou (B) Linda est banquière ET féministe ? La plupart choisissent B, mais c'est mathématiquement impossible : B est un sous-ensemble de A.",
      improve: "Pratiquez sur Metaculus.com (prédictions calibrées), lisez 'Thinking, Fast and Slow' chapitres 10-18, et utilisez des fréquences naturelles au lieu de pourcentages."
    },
    'Raisonnement Scientifique': {
      what: "Votre capacité à tester des hypothèses rigoureusement, distinguer corrélation et causation, et comprendre l'importance des groupes contrôles.",
      why: "Le raisonnement scientifique est la base de toute connaissance fiable. Sans lui, nous sommes victimes de nos biais de confirmation et croyons ce qui nous arrange plutôt que ce qui est vrai.",
      example: "Test de Wason : Cartes E, K, 4, 7. Règle : 'Si voyelle, alors nombre pair'. Quelles cartes retourner ? Réponse intuitive : E et 4. Correct : E et 7 (pour falsifier). Seulement 10% réussissent !",
      improve: "Lisez 'The Scout Mindset' de Julia Galef, pratiquez la falsification active (chercher ce qui prouve que vous avez tort), et étudiez des cas de réplication crisis en science."
    },
    'Réflexion vs Intuition': {
      what: "Votre capacité à surmonter les réponses intuitives immédiates (Système 1) et engager une réflexion analytique (Système 2). Mesuré par le Cognitive Reflection Test.",
      why: "Notre cerveau préfère les raccourcis rapides. Mais pour les problèmes non-triviaux, ces raccourcis mènent systématiquement à l'erreur. La capacité à 'freiner' et réfléchir est cruciale.",
      example: "Batte + balle = 1,10€. Batte coûte 1€ de plus que balle. Combien coûte la balle ? Intuition : 10 centimes. Réflexion : 5 centimes (car 1,05€ + 0,05€ = 1,10€).",
      improve: "Pratiquez des puzzles logiques quotidiennement, prenez l'habitude de 'pause' avant de répondre, et lisez 'Thinking in Bets' d'Annie Duke."
    },
    'Biais de Croyance': {
      what: "Votre capacité à évaluer la validité logique d'un argument indépendamment de vos croyances sur le sujet.",
      why: "Nous avons tendance à accepter des arguments fallacieux s'ils confirment nos croyances, et rejeter des arguments valides s'ils les contredisent. C'est un obstacle majeur au débat rationnel.",
      example: "Syllogisme : 'Tous les chiens sont des animaux. Tous les chats sont des animaux. Donc tous les chats sont des chiens.' Logiquement invalide, mais si on remplace par 'Toutes les tulipes sont des fleurs', beaucoup l'acceptent car c'est vrai.",
      improve: "Étudiez la logique formelle, pratiquez l'argumentation en 'steel-manning' (renforcer la position adverse), et lisez 'How to Think About Weird Things' de Schick & Vaughn."
    },
    'Calibration': {
      what: "Votre capacité à évaluer précisément votre niveau de certitude. Une personne bien calibrée qui dit '70% certain' a raison environ 70% du temps.",
      why: "L'overconfidence est un des biais les plus dangereux. Elle mène à des erreurs de planification (projets qui dépassent budget/délais), des erreurs d'investissement, et des décisions médicales hasardeuses.",
      example: "Quand les gens disent être '99% certains', ils se trompent ~40% du temps ! Leur intervalle de confiance devrait être beaucoup plus large.",
      improve: "Pratiquez intensivement sur Metaculus ou PredictionBook (100+ prédictions), tenez un journal de décisions avec post-mortems, lisez 'Superforecasting' de Tetlock."
    },
    'Effets de Cadrage': {
      what: "Votre résistance au 'framing' : changer d'avis selon comment l'information est présentée (alors que c'est la même information).",
      why: "Le framing est utilisé massivement en publicité, politique, et négociation pour manipuler nos décisions. Y résister est crucial pour l'autonomie intellectuelle.",
      example: "Viande '85% maigre' vs '15% grasse'. Même viande, mais le premier cadrage augmente les ventes de 20%. Ou programme médical : '200 personnes sauvées' vs '400 personnes mourront' change complètement les préférences.",
      improve: "Pratiquez la reformulation systématique (dire la même chose autrement), lisez 'Influence' de Cialdini, et soyez conscient des cadres par défaut dans les choix."
    },
    'Pensée Superstitieuse': {
      what: "Votre capacité à rejeter les croyances sans fondement empirique (paranormal, pseudoscience, etc.).",
      why: "La pensée superstitieuse viole le principe de 'croyances proportionnées aux preuves'. Elle ouvre la porte à l'exploitation (arnaques), aux mauvaises décisions de santé, et au rejet de la science.",
      example: "L'astrologie : Des études contrôlées montrent que des astrologues professionnels ne font pas mieux que le hasard pour matcher profils de personnalité et cartes astrales. Pourtant 25% de la population y croit.",
      improve: "Lisez 'The Demon-Haunted World' de Carl Sagan, étudiez l'histoire des fraudes paranormales, et apprenez le rasoir d'Occam (privilégier les explications simples)."
    },
    'Théories du Complot': {
      what: "Votre résistance aux explications complotistes non-fondées et capacité à privilégier les explications parcimonieuses (Rasoir d'Occam).",
      why: "Les théories du complot sont imperméables aux preuves ('l'absence de preuve est la preuve du complot'), créent de la méfiance sociale, et mènent à des décisions dangereuses (anti-vaccins, etc.).",
      example: "Le mythe des vaccins et de l'autisme : L'étude originale (Wakefield 1998) était frauduleuse. 10+ méta-analyses sur 1,2M+ enfants n'ont trouvé aucun lien. Mais certains y croient encore car 'Big Pharma cache la vérité'.",
      improve: "Lisez 'The Conspiracy Theory Handbook', étudiez l'épistémologie (comment on sait ce qu'on sait), et pratiquez l'analyse critique des sources."
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vos Résultats
          </h1>
          <p className="text-xl text-gray-600">
            Test de Rationalité - Analyse Complète
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Complété le {new Date(session!.completedAt!).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Score Global */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Score Global</h2>
          <div className="mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(testScore.percentage)}`}>
              {testScore.percentage.toFixed(1)}%
            </div>
            <div className={`text-2xl font-semibold mb-2 ${getScoreColor(testScore.percentage)}`}>
              Rationalité {getScoreLabel(testScore.percentage)}
            </div>
            <div className="text-lg text-gray-600">
              {testScore.totalEarned.toFixed(1)} / {testScore.totalPossible.toFixed(1)} points
            </div>
          </div>
          {testScore.percentile && (
            <div className="bg-gray-100 rounded-lg p-4 inline-block">
              <p className="text-gray-700">
                Vous êtes plus rationnel que <strong className="text-blue-600">{testScore.percentile}%</strong> des participants
              </p>
            </div>
          )}
        </div>

        {/* Interprétation Globale */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Que signifie votre score ?</h3>
              <p className="text-gray-700 text-justify">
                {testScore.interpretation}
              </p>
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Profil de Rationalité</CardTitle>
            </CardHeader>
            <CardContent>
              <RadarChartComponent moduleScores={testScore.modules} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Classement par Module</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent moduleScores={testScore.modules} />
            </CardContent>
          </Card>
        </div>

        {/* Détail par Module avec Accordéons */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Analyse Détaillée par Module
          </h2>
          <p className="text-gray-600 mb-6">
            Cliquez sur chaque module pour comprendre ce qui est mesuré et comment progresser
          </p>

          <div className="space-y-3">
            {testScore.modules
              .filter(m => m.possible > 0)
              .map((moduleScore) => {
                const moduleName = moduleScore.moduleName.split(' (')[0];
                const desc = moduleDescriptions[moduleName];
                
                const scoreColor = 
                  moduleScore.percentage >= 75 ? 'text-green-600' :
                  moduleScore.percentage >= 50 ? 'text-blue-600' :
                  moduleScore.percentage >= 35 ? 'text-yellow-600' :
                  'text-red-600';

                return (
                  <AccordionItem 
                    key={moduleScore.moduleId} 
                    title={
                      <div className="flex items-center justify-between w-full">
                        <span>{moduleName}</span>
                        <span className={`font-bold ${scoreColor} ml-4`}>
                          {moduleScore.percentage.toFixed(0)}% ({moduleScore.earned.toFixed(1)}/{moduleScore.possible.toFixed(1)})
                        </span>
                      </div>
                    }
                  >
                    {desc && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Ce qui est mesuré
                          </h4>
                          <p>{desc.what}</p>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">
                            💡 Pourquoi c'est important
                          </h4>
                          <p>{desc.why}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-900 mb-2">
                            📌 Exemple classique
                          </h4>
                          <p className="text-sm">{desc.example}</p>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Comment s'améliorer
                          </h4>
                          <p className="text-sm">{desc.improve}</p>
                        </div>
                      </div>
                    )}
                  </AccordionItem>
                );
              })}
          </div>
        </div>

        {/* Forces & Faiblesses */}
        {(testScore.strengths.length > 0 || testScore.weaknesses.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {testScore.strengths.length > 0 && (
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2 text-xl">
                  ✓ Vos Forces
                </h3>
                <ul className="space-y-2">
                  {testScore.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-gray-700">{strength.split(' (')[0]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {testScore.weaknesses.length > 0 && (
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="font-bold text-orange-700 mb-4 flex items-center gap-2 text-xl">
                  ⚠ Points à améliorer
                </h3>
                <ul className="space-y-2">
                  {testScore.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span className="text-gray-700">{weakness.split(' (')[0]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Ressources */}
        <div className="bg-blue-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📚 Ressources pour progresser
          </h2>

          <AccordionItem title="Lectures recommandées" defaultOpen={true}>
            <ul className="space-y-3">
              <li>
                <a href="https://www.goodreads.com/book/show/11468377" target="_blank" rel="noopener" className="text-blue-600 hover:underline font-semibold">
                  Thinking, Fast and Slow
                </a> - Daniel Kahneman<br />
                <span className="text-sm text-gray-600">Le livre fondateur sur les deux systèmes de pensée. Prix Nobel d'Économie 2002.</span>
              </li>
              <li>
                <a href="https://www.goodreads.com/book/show/23995360" target="_blank" rel="noopener" className="text-blue-600 hover:underline font-semibold">
                  Superforecasting
                </a> - Philip Tetlock<br />
                <span className="text-sm text-gray-600">Comment améliorer vos prédictions et votre calibration.</span>
              </li>
              <li>
                <a href="https://mitpress.mit.edu/9780262034845/" target="_blank" rel="noopener" className="text-blue-600 hover:underline font-semibold">
                  The Rationality Quotient
                </a> - Stanovich, West & Toplak<br />
                <span className="text-sm text-gray-600">Le livre académique sur lequel ce test est basé.</span>
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title="Pratique en ligne">
            <ul className="space-y-3">
              <li>
                <a href="https://www.metaculus.com" target="_blank" rel="noopener" className="text-blue-600 hover:underline font-semibold">
                  Metaculus.com
                </a><br />
                <span className="text-sm text-gray-600">Plateforme de prédictions pour améliorer votre calibration</span>
              </li>
              <li>
                <a href="https://www.lesswrong.com" target="_blank" rel="noopener" className="text-blue-600 hover:underline font-semibold">
                  LessWrong.com
                </a><br />
                <span className="text-sm text-gray-600">Communauté et articles sur la rationalité</span>
              </li>
              <li>
                <a href="https://www.clearerthinking.org" target="_blank" rel="noopener" className="text-blue-600 hover:underline font-semibold">
                  ClearerThinking.org
                </a><br />
                <span className="text-sm text-gray-600">Outils et mini-cours gratuits</span>
              </li>
            </ul>
          </AccordionItem>
        </div>

        {/* Sources scientifiques */}
        <AccordionItem title="📖 Sources scientifiques et méthodologie">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Fondements principaux</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Stanovich, K. E., West, R. F., & Toplak, M. E. (2016).</strong><br />
                  <em>The Rationality Quotient: Toward a Test of Rational Thinking.</em> MIT Press.
                </li>
                <li>
                  <strong>Kahneman, D., & Tversky, A. (1974-1983).</strong><br />
                  <em>Travaux sur les heuristiques et biais cognitifs</em> - Prix Nobel 2002
                </li>
                <li>
                  <strong>Frederick, S. (2005).</strong><br />
                  <em>Cognitive Reflection and Decision Making.</em> Journal of Economic Perspectives.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">Limites</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Ce test mesure des compétences cognitives spécifiques</li>
                <li>Un score élevé n'implique pas automatiquement de meilleures décisions</li>
                <li>La performance peut varier selon votre état (fatigue, stress)</li>
              </ul>
            </div>
          </div>
        </AccordionItem>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Prochaines étapes</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              📄 Télécharger (PDF)
            </button>
            <button
              onClick={() => {
                resetTest();
                router.push('/test?reset=true');
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              🔄 Refaire le test
            </button>
            <Link href="/">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors">
                🏠 Retour à l'accueil
              </button>
            </Link>
          </div>
          <p className="text-sm text-gray-600 mt-6">
            💡 Pour mesurer vos progrès, repassez le test dans 3-6 mois
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            Ce test est un projet open-source et gratuit.
          </p>
        </div>
      </div>
    </div>
  );
}