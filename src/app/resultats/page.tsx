'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTestStore } from '@/store/useTestStore';
import { scoreTest, calculatePercentile, TestScore } from '@/lib/scoring';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadarChartComponent, BarChartComponent } from '@/components/ResultsCharts';
import { ChevronDown, ChevronUp, BookOpen, TrendingUp, AlertCircle, Award, Brain, Mail } from 'lucide-react';
import React from 'react';

// Composant Accordéon avec jauge dans le titre
const AccordionItem = ({ title, children, defaultOpen = false, scorePercentage }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  scorePercentage?: number;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-blue-600';
    if (score >= 35) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-blue-500';
    if (score >= 35) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Titre - largeur fixe pour alignement */}
          <span className="font-semibold text-left text-gray-900 flex-1 min-w-0">
            {title}
          </span>
          
          {/* Jauge - largeur fixe pour alignement */}
          {scorePercentage !== undefined && (
            <div className="flex items-center gap-3 w-64 flex-shrink-0">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`${getBarColor(scorePercentage)} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${scorePercentage}%` }}
                  />
                </div>
              </div>
              <span className={`${getScoreColor(scorePercentage)} font-bold text-sm w-12 text-right`}>
                {scorePercentage.toFixed(0)}%
              </span>
            </div>
          )}
          
          {/* Icône chevron */}
          <div className="flex-shrink-0">
            {isOpen ? 
              <ChevronUp className="w-5 h-5 text-blue-600" /> : 
              <ChevronDown className="w-5 h-5 text-gray-400" />
            }
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="px-6 py-5 bg-white text-gray-700 leading-relaxed border-t-2 border-gray-100">
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
  const [email, setEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!session?.completedAt || !modules.length) {
      router.push('/test');
      return;
    }

    const scores = scoreTest(modules, session.answers);
    const percentile = calculatePercentile(scores.percentage);
    setTestScore({ ...scores, percentile });
  }, [session, modules, router]);

  const handleSendEmail = async () => {
    if (!email || !testScore) return;
    
    setSendingEmail(true);
    try {
      const response = await fetch('/api/send-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          testScore,
        }),
      });

      if (response.ok) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 5000);
      } else {
        alert('Erreur lors de l\'envoi. Veuillez réessayer.');
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setSendingEmail(false);
    }
  };

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
    if (score >= 85) return 'Très Élevée';
    if (score >= 70) return 'Élevée';
    if (score >= 55) return 'Moyenne';
    if (score >= 40) return 'Sous la Moyenne';
    return 'Limitée';
  };

  // Descriptions COMPLÈTES avec liens hypertextes
  const moduleDescriptions: Record<string, {
    what: React.ReactElement;
    why: React.ReactElement;
    example: React.ReactElement;
    canImprove: React.ReactElement;
  }> = {
    'Raisonnement Probabiliste': {
      what: (
        <p>Ce module évalue votre capacité à raisonner avec les probabilités : comprendre les{' '}
          <a href="https://fr.wikipedia.org/wiki/N%C3%A9gligence_du_taux_de_base" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            taux de base
          </a>, éviter l'{' '}
          <a href="https://fr.wikipedia.org/wiki/Erreur_du_parieur" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            erreur du parieur
          </a>{' '}
          (croire que les résultats passés influencent le hasard futur), et l'{' '}
          <a href="https://fr.wikipedia.org/wiki/Erreur_de_conjonction" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            erreur de conjonction
          </a>{' '}
          (penser que A+B est plus probable que A seul).
        </p>
      ),
      why: (
        <p>Dans les années 1970,{' '}
          <a href="https://fr.wikipedia.org/wiki/Daniel_Kahneman" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            Kahneman
          </a>{' '}
          et{' '}
          <a href="https://fr.wikipedia.org/wiki/Amos_Tversky" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            Tversky
          </a>{' '}
          ont découvert que même des experts en statistiques violent régulièrement les principes de base des probabilités. 
          Ces erreurs ont des conséquences réelles : diagnostics médicaux erronés, bulles financières, mauvaise évaluation des risques.
        </p>
      ),
      example: (
        <p>Problème médical classique : Un test détecte une maladie avec 95% de précision. La maladie touche 1% de la population. 
          Votre test est positif. Probabilité d'être malade ? La plupart disent 95%, mais c'est ~9% (à cause des faux positifs 
          nombreux dans une population où la maladie est rare).</p>
      ),
      canImprove: (
        <p>Amélioration possible : modérée (10-25%). Pratiquez avec des fréquences naturelles plutôt que des pourcentages. 
          Mais même après formation, les erreurs persistent sous pression ou fatigue.</p>
      )
    },
    'Raisonnement Scientifique': {
      what: (
        <p>Votre capacité à tester rigoureusement des hypothèses : chercher à{' '}
          <a href="https://fr.wikipedia.org/wiki/Falsifiabilit%C3%A9" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            falsifier
          </a>{' '}
          plutôt que confirmer, distinguer{' '}
          <a href="https://fr.wikipedia.org/wiki/Corr%C3%A9lation_n%27implique_pas_causalit%C3%A9" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            corrélation et causation
          </a>, comprendre l'importance des groupes contrôles.
        </p>
      ),
      why: (
        <p>Le{' '}
          <a href="https://fr.wikipedia.org/wiki/Biais_de_confirmation" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            biais de confirmation
          </a>{' '}
          (chercher uniquement ce qui confirme nos croyances) est un des plus robustes. Il explique pourquoi des gens 
          intelligents croient des choses fausses et pourquoi les débats tournent en rond.
        </p>
      ),
      example: (
        <p>
          <a href="https://fr.wikipedia.org/wiki/Test_de_s%C3%A9lection_de_Wason" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            Test de Wason
          </a>{' '}
          (1966) : Cartes E, K, 4, 7. Règle : "Si voyelle, alors nombre pair". Quelles cartes retourner ? 
          Réponse intuitive : E et 4 (confirmation). Correct : E et 7 (falsification). Seulement ~10% réussissent, 
          même chez des scientifiques.
        </p>
      ),
      canImprove: (
        <p>Amélioration possible : modérée (15-30%). La falsification peut s'apprendre, mais notre instinct reste 
          de chercher la confirmation. Utilisez des protocoles systématiques plutôt que votre intuition.</p>
      )
    },
    'Réflexion vs Intuition': {
      what: (
        <p>Mesuré par le{' '}
          <a href="https://fr.wikipedia.org/wiki/Test_de_r%C3%A9flexion_cognitive" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            Cognitive Reflection Test
          </a>{' '}
          (Frederick, 2005) : votre capacité à inhiber la réponse intuitive immédiate et engager une réflexion analytique.
        </p>
      ),
      why: (
        <p>Notre{' '}
          <a href="https://www.lesswrong.com/tag/system-1" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            Système 1
          </a>{' '}
          (intuitif) répond instantanément mais se trompe de façon prévisible sur les problèmes non-triviaux. 
          Le Système 2 (analytique) peut corriger, mais il est paresseux et coûteux cognitivement.
        </p>
      ),
      example: (
        <p>Batte et balle = 1,10€. Batte coûte 1€ de plus que balle. Combien coûte la balle ? Système 1 crie "10 centimes !" 
          Système 2 calcule : 5 centimes. 50% d'étudiants MIT échouent.</p>
      ),
      canImprove: (
        <p><strong>ATTENTION</strong> : Les améliorations du CRT sont souvent dues à la mémorisation des questions, 
          pas à une vraie amélioration de la réflexion. Le gain réel est probablement &lt;20%.</p>
      )
    },
    'Biais de Croyance': {
      what: (
        <p>Votre capacité à évaluer la validité logique d'un raisonnement indépendamment de vos croyances sur la conclusion 
          (éviter que le contenu interfère avec la logique).</p>
      ),
      why: (
        <p>Nous acceptons des arguments logiquement invalides si la conclusion nous plaît, et rejetons des arguments valides 
          si elle nous déplaît. Cela empêche tout débat rationnel.</p>
      ),
      example: (
        <p>Syllogisme : "Toutes les choses rares sont chères. Les diamants sont rares. Donc les diamants sont chers." 
          Logiquement valide. Mais "Toutes les choses rares sont chères. L'eau bon marché est rare. Donc l'eau bon marché 
          est chère" - même structure, rejeté car absurde.</p>
      ),
      canImprove: (
        <p>Amélioration : difficile (&lt;10%). C'est un biais profond. Mieux vaut utiliser des protocoles : 
          faire évaluer la logique par quelqu'un sans connaître le sujet.</p>
      )
    },
    'Calibration': {
      what: (
        <p>Votre capacité à estimer avec précision votre niveau de certitude. Une personne bien{' '}
          <a href="https://www.lesswrong.com/tag/calibration" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            calibrée
          </a>{' '}
          qui dit "70% certain" a raison ~70% du temps.
        </p>
      ),
      why: (
        <p>L'{' '}
          <a href="https://fr.wikipedia.org/wiki/Biais_de_surconfiance" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            overconfidence
          </a>{' '}
          est un des biais les plus universels et dangereux : projets qui dépassent budget/délais, investissements hasardeux, 
          diagnostics médicaux erronés.
        </p>
      ),
      example: (
        <p>Quand les gens disent être "99% certains", ils se trompent environ 40% du temps. Leur intervalle de confiance 
          devrait être 5-10× plus large.</p>
      ),
      canImprove: (
        <p>Amélioration possible : modérée (15-25%). La calibration s'améliore avec pratique intensive (100+ prédictions sur{' '}
          <a href="https://www.metaculus.com" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            Metaculus
          </a>), mais régresse sans pratique continue. Nécessite un feedback immédiat et répété.
        </p>
      )
    },
    'Effets de Cadrage': {
      what: (
        <p>Votre résistance au{' '}
          <a href="https://fr.wikipedia.org/wiki/Effet_de_cadrage" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            framing
          </a>{' '}
          : changer de préférence selon la formulation d'une option identique (ex: "85% maigre" vs "15% gras").
        </p>
      ),
      why: (
        <p>Viole le principe d'invariance descriptive. Utilisé massivement en publicité, politique, négociation pour 
          manipuler nos choix.</p>
      ),
      example: (
        <p>Programme de santé : (A) "200 personnes seront sauvées" vs (B) "400 personnes mourront". Même programme, 
          mais le premier est préféré. Notre cerveau traite gains et pertes asymétriquement.</p>
      ),
      canImprove: (
        <p>Amélioration : difficile (&lt;10%). Le cadrage agit au niveau préconscient. Solution : reformuler systématiquement 
          les options dans les deux sens avant de décider.</p>
      )
    },
    'Pensée Superstitieuse': {
      what: (
        <p>Votre capacité à rejeter les croyances non-fondées empiriquement (paranormal, astrologie, etc.) et respecter 
          le principe : "croyance proportionnée aux preuves".</p>
      ),
      why: (
        <p>La pensée superstitieuse ouvre la porte aux arnaques, aux décisions de santé dangereuses, et au rejet de la science. 
          Elle reflète une incompréhension de la causalité et du hasard.</p>
      ),
      example: (
        <p>
          <a href="https://fr.wikipedia.org/wiki/Astrologie" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            Astrologie
          </a>{' '}
          : Étude contrôlée (Carlson, 1985, Nature) - 28 astrologues professionnels devaient matcher cartes astrales et 
          profils de personnalité. Résultat : pas mieux que le hasard (33%).
        </p>
      ),
      canImprove: (
        <p>Amélioration : modérée (10-20%). L'éducation scientifique aide, mais la pensée magique est profondément ancrée 
          (biais évolutif de détection de patterns).</p>
      )
    },
    'Théories du Complot': {
      what: (
        <p>Votre résistance aux{' '}
          <a href="https://fr.wikipedia.org/wiki/Th%C3%A9orie_du_complot" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            explications complotistes
          </a>{' '}
          et capacité à appliquer le{' '}
          <a href="https://fr.wikipedia.org/wiki/Rasoir_d%27Ockham" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            Rasoir d'Occam
          </a>{' '}
          (privilégier les explications simples).
        </p>
      ),
      why: (
        <p>Les théories du complot sont imperméables aux preuves ("l'absence de preuve EST la preuve"), créent de la méfiance, 
          et mènent à des décisions dangereuses (anti-vaccins).</p>
      ),
      example: (
        <p>
          <a href="https://fr.wikipedia.org/wiki/Controverse_sur_le_r%C3%B4le_de_la_vaccination_dans_l%27autisme" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            Vaccins et autisme
          </a>{' '}
          : Étude frauduleuse de Wakefield (1998). 10+ méta-analyses sur 1,2M+ enfants : aucun lien. Mais certains croient 
          encore à un complot de "Big Pharma" impliquant des millions de médecins dans tous les pays.
        </p>
      ),
      canImprove: (
        <p>Amélioration : difficile (&lt;10%). La pensée complotiste satisfait des besoins psychologiques profonds 
          (besoin de contrôle, de sens). Mieux vaut prévenir que guérir.</p>
      )
    },
    'Raisonnement Disjonctif': {
      what: (
        <p>Votre capacité à raisonner correctement avec des énoncés "OU" et à comprendre qu'il suffit qu'une seule 
          condition soit vraie.</p>
      ),
      why: (
        <p>Les erreurs de raisonnement disjonctif mènent à sous-estimer des risques (il suffit qu'UN système échoue 
          pour que tout échoue) et à mal évaluer des opportunités.</p>
      ),
      example: (
        <p>Un projet peut échouer pour 5 raisons indépendantes (A, B, C, D, E), chacune avec 20% de chance. 
          Beaucoup pensent que la chance d'échec = 20%. Correct : ~67% (1 - 0.8^5).</p>
      ),
      canImprove: (
        <p>Amélioration : modérée (15-25%). Peut s'améliorer avec entraînement en logique formelle, mais les erreurs 
          persistent dans des contextes complexes.</p>
      )
    },
    'Ancrage': {
      what: (
        <p>Votre résistance à l'{' '}
          <a href="https://fr.wikipedia.org/wiki/Ancrage_(psychologie)" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            ancrage
          </a>{' '}
          : être trop influencé par la première information reçue (un "anchor") lors d'une estimation.
        </p>
      ),
      why: (
        <p>L'ancrage affecte les négociations (prix initial), les jugements (sentences judiciaires), et les estimations 
          (prévisions budgétaires). Même des experts y sont sensibles.</p>
      ),
      example: (
        <p>Étude : Des juges expérimentés lancent des dés (truqués) avant de décider d'une sentence. Résultat : 
          les sentences suivent les dés ! L'anchor (même absurde) influence.</p>
      ),
      canImprove: (
        <p>Amélioration : très difficile (&lt;5%). L'ancrage agit inconsciemment. Solution : générer plusieurs estimations 
          indépendantes avant de voir des chiffres externes.</p>
      )
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
            Test de Rationalité (CART adapté)
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-sm text-gray-500">
              Complété le {new Date(session!.completedAt!).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <span className="text-gray-400">•</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              session!.version === 'complète'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              Version {session!.version}
            </span>
          </div>
        </div>

        {/* Score Global */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center border-t-4 border-blue-600">
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
                Percentile estimé : <strong className="text-blue-600">{testScore.percentile}e</strong>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (basé sur une distribution théorique, pas encore sur des données réelles)
              </p>
            </div>
          )}
        </div>

        {/* Interprétation Réaliste */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Interprétation</h3>
              <p className="text-gray-700 text-justify mb-3">
                {testScore.interpretation}
              </p>
              <p className="text-gray-600 text-sm text-justify italic">
                <strong>Note critique :</strong> Connaître vos biais ne les élimine pas. 
                Même Daniel Kahneman (Prix Nobel 2002 pour ses travaux sur les biais) admettait : 
                <em>"J'ai énormément appris sur les biais cognitifs, mais je ne suis pas sûr d'être 
                devenu moins susceptible à ces biais."</em> La vraie solution ? Changer votre environnement 
                de décision (checklists, protocoles, consultation de tiers), pas juste vous-même.
              </p>
            </div>
          </div>
        </div>

        {/* Histoire du CART */}
        <AccordionItem title="📖 D'où vient ce test ? Histoire du CART" defaultOpen={false}>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                40 ans de recherche
              </h4>
              <p className="text-justify mb-3">
                Dans les années 1970, deux psychologues israéliens, <strong>Daniel Kahneman</strong> et 
                <strong> Amos Tversky</strong> (Université Hébraïque de Jérusalem), ont commencé à documenter 
                quelque chose de troublant : des gens intelligents, éduqués, prenaient régulièrement des 
                décisions qui violaient les principes de base de la logique et des probabilités.
              </p>
              <p className="text-justify mb-3">
                Leur découverte la plus surprenante ? <strong>Ces erreurs n'étaient pas des accidents 
                aléatoires, mais des patterns systématiques.</strong> Les humains semblaient utiliser des 
                "raccourcis mentaux" (heuristiques) qui, bien qu'utiles dans certains contextes, menaient 
                à des erreurs prévisibles et répétées.
              </p>
              <p className="text-justify">
                Pour ce travail pionnier, Kahneman a reçu le <strong>Prix Nobel d'Économie en 2002</strong> 
                (Tversky était décédé en 1996, sinon il l'aurait partagé).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">Le problème : Intelligence ≠ Rationalité</h4>
              <p className="text-justify mb-3">
                Pendant des décennies, on a supposé que les tests de QI mesuraient "la bonne pensée". 
                Mais <strong>Keith E. Stanovich</strong> (Université de Toronto) a remarqué quelque chose 
                d'étrange dans les années 1990 : <strong>des personnes avec des QI très élevés commettaient 
                quand même des erreurs de raisonnement systématiques.</strong>
              </p>
              <p className="text-justify">
                Stanovich a réalisé que le QI mesure la puissance de calcul du cerveau, mais pas 
                nécessairement la sagesse de son utilisation. C'est comme avoir une Ferrari (QI élevé) 
                mais ne pas savoir conduire (faible rationalité).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Award className="w-5 h-5" />
                La naissance du CART (2013-2016)
              </h4>
              <p className="text-justify mb-3">
                Stanovich, avec ses collègues <strong>Richard F. West</strong> (James Madison University) 
                et <strong>Maggie E. Toplak</strong> (York University), ont passé 3 ans à développer le 
                <strong> CART (Comprehensive Assessment of Rational Thinking)</strong> - le premier test 
                complet de pensée rationnelle.
              </p>
              <p className="text-justify mb-3">
                Le projet, financé par la John Templeton Foundation, a impliqué plus de 1000 participants, 
                20 sous-tests différents, et une validation statistique rigoureuse.
              </p>
              <p className="text-justify text-sm bg-blue-50 p-3 rounded">
                <strong>Ce test en ligne</strong> est une adaptation éducative libre du CART original. 
                Il utilise des questions du domaine public et des variantes inspirées de la littérature 
                scientifique. Ce n'est PAS le CART officiel (qui nécessite une administration contrôlée), 
                mais une approximation pédagogique gratuite.
              </p>
            </div>
          </div>
        </AccordionItem>

        {/* Graphiques (VERTICAUX) */}
        <div className="space-y-6 mb-8">
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

        {/* Détail par Module avec Jauges */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-t-4 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Analyse Détaillée par Module
          </h2>
          <p className="text-gray-600 mb-6">
            Cliquez sur chaque module pour comprendre ce qui est mesuré, pourquoi c'est important, 
            et si c'est améliorable.
          </p>

          <div className="space-y-3">
            {testScore.modules
              .filter(m => m.possible > 0)
              .sort((a, b) => b.percentage - a.percentage)
              .map((moduleScore) => {
                const moduleName = moduleScore.moduleName.split(' (')[0];
                const desc = moduleDescriptions[moduleName];

                return (
                  <AccordionItem 
                    key={moduleScore.moduleId} 
                    title={moduleName}
                    scorePercentage={moduleScore.percentage}
                  >
                    <div className="mb-4 text-sm text-gray-600">
                      <strong>{moduleScore.earned.toFixed(1)}</strong> / {moduleScore.possible.toFixed(1)} points
                    </div>
                    
                    {desc ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">
                            🎯 Ce qui est mesuré
                          </h4>
                          <div className="text-justify">{desc.what}</div>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">
                            💡 Pourquoi c'est important
                          </h4>
                          <div className="text-justify">{desc.why}</div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-900 mb-2">
                            📌 Exemple classique
                          </h4>
                          <div className="text-sm text-justify">{desc.example}</div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                          <h4 className="font-bold text-gray-900 mb-2">
                            📈 Peut-on s'améliorer ?
                          </h4>
                          <div className="text-sm text-justify">{desc.canImprove}</div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        Description en cours de rédaction...
                      </p>
                    )}
                  </AccordionItem>
                );
              })}
          </div>
        </div>

        {/* Approche de Kahneman : Outils Externes */}
        <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-3 text-xl">
            🛠️ La Solution Pragmatique (Recommandée par Kahneman)
          </h3>
          <p className="text-gray-700 mb-4 text-justify">
            Plutôt que d'essayer de changer votre cerveau (difficile, incertain), 
            <strong> changez votre environnement de décision :</strong>
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Checklists pré-décision :</strong> "Quel est le taux de base ? Suis-je ancré ? 
              Qu'est-ce qui pourrait prouver que j'ai tort ?"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Consultations structurées :</strong> Avant toute décision majeure, 
              demander l'avis de 2-3 personnes avec perspectives différentes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Ralentissement forcé :</strong> Règle des 24-48h pour les décisions importantes (investissements, achats majeurs, changements de carrière)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Pré-mortem :</strong> Avant de lancer un projet, imaginer qu'il a échoué 
              dans 1 an. Pourquoi ?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Journal de décision :</strong> Noter prédictions + confiance + raisonnement. 
              Revue mensuelle.</span>
            </li>
          </ul>
          <p className="text-sm text-gray-600 mt-4 italic">
            Exemple concret : En chirurgie, imposer une checklist obligatoire a réduit les complications 
            de 47% (Haynes et al., 2009) - bien plus efficace que "former les chirurgiens à être moins overconfidents".
          </p>
        </div>

        {/* Ressources */}
        <div className="bg-blue-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📚 Ressources pour approfondir
          </h2>

          <AccordionItem title="Lectures essentielles">
            <ul className="space-y-3">
              <li>
                <a href="https://www.goodreads.com/book/show/11468377" target="_blank" rel="noopener" className="text-blue-600 hover:underline font-semibold">
                  Thinking, Fast and Slow
                </a> - Daniel Kahneman<br />
                <span className="text-sm text-gray-600">LE livre fondateur (Prix Nobel 2002)</span>
              </li>
              <li>
                <a href="https://mitpress.mit.edu/9780262034845/" target="_blank" rel="noopener" className="text-blue-600 hover:underline font-semibold">
                  The Rationality Quotient
                </a> - Stanovich, West & Toplak<br />
                <span className="text-sm text-gray-600">Le livre académique sur le CART</span>
              </li>
              <li>
                <a href="https://www.goodreads.com/book/show/23995360" target="_blank" rel="noopener" className="text-blue-600 hover:underline font-semibold">
                  Superforecasting
                </a> - Philip Tetlock<br />
                <span className="text-sm text-gray-600">Comment améliorer votre calibration (avec preuves)</span>
              </li>
              <li>
                <a href="https://www.goodreads.com/book/show/42041926" target="_blank" rel="noopener" className="text-blue-600 hover:underline font-semibold">
                  The Scout Mindset
                </a> - Julia Galef<br />
                <span className="text-sm text-gray-600">Chercher la vérité plutôt qu'avoir raison</span>
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title="Pratique calibration">
            <ul className="space-y-2">
              <li>
                <a href="https://www.metaculus.com" target="_blank" rel="noopener" className="text-blue-600 hover:underline font-semibold">
                  Metaculus.com
                </a> - Plateforme de prédictions (amélioration prouvée de la calibration)
              </li>
              <li>
                <a href="https://www.lesswrong.com" target="_blank" rel="noopener" className="text-blue-600 hover:underline font-semibold">
                  LessWrong.com
                </a> - Communauté et articles sur la rationalité
              </li>
            </ul>
          </AccordionItem>
        </div>

        {/* Sources scientifiques */}
        <AccordionItem title="📖 Sources scientifiques complètes">
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Fondements principaux</h4>
              <ul className="space-y-2">
                <li>
                  <strong>Stanovich, K. E., West, R. F., & Toplak, M. E. (2016).</strong><br />
                  <em>The Rationality Quotient: Toward a Test of Rational Thinking.</em> MIT Press.
                </li>
                <li>
                  <strong>Kahneman, D., & Tversky, A. (1974).</strong><br />
                  <em>Judgment under Uncertainty: Heuristics and Biases.</em> Science, 185(4157), 1124-1131.
                </li>
                <li>
                  <strong>Frederick, S. (2005).</strong><br />
                  <em>Cognitive Reflection and Decision Making.</em> Journal of Economic Perspectives, 19(4), 25-42.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">Sur l'amélioration (ou non) des biais</h4>
              <ul className="space-y-2">
                <li>
                  <strong>Morewedge et al. (2015).</strong><br />
                  <em>Debiasing Decisions.</em> Policy Insights from Behavioral and Brain Sciences.<br />
                  <span className="text-gray-600">Méta-analyse : réduction moyenne des biais de ~29%, mais déclin sans pratique</span>
                </li>
                <li>
                  <strong>Kahneman, D. (2011).</strong><br />
                  <em>Thinking, Fast and Slow.</em> Citation p. 417 :<br />
                  <span className="text-gray-600 italic">"The way to block errors that originate in System 1 is 
                  simple in principle: recognize the signs that you are in a cognitive minefield, slow down, 
                  and ask for reinforcement from System 2."</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-3 rounded">
              <h4 className="font-bold text-gray-900 mb-2">Limites de ce test</h4>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Mesure certains aspects de la rationalité, pas tous (créativité, sagesse pratique, etc.)</li>
                <li>Score peut varier selon fatigue, stress, contexte</li>
                <li>Amélioration modeste et difficile à maintenir</li>
                <li>Percentile basé sur distribution théorique, pas encore données réelles</li>
              </ul>
            </div>
          </div>
        </AccordionItem>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Prochaines étapes</h2>
          
          {/* Recevoir par email */}
          <div className="mb-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📧 Recevoir vos résultats par email
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail || !email}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {sendingEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Envoi...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Envoyer
                  </>
                )}
              </button>
            </div>
            {emailSent && (
              <p className="text-green-600 text-sm mt-2">✓ Email envoyé avec succès !</p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
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
            💡 Conseil : Pour mesurer de vrais progrès, repassez le test dans 6-12 mois 
            (pas avant, sinon c'est juste de la mémorisation)
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            Ce test est un projet open-source, gratuit, et dans l'intérêt général.
          </p>
          <p className="mt-1">
            Basé sur la recherche scientifique en psychologie cognitive (1970-2024).
          </p>
        </div>
      </div>
    </div>
  );
}