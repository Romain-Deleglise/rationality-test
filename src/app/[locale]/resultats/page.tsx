'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTestStore } from '@/store/useTestStore';
import { scoreTest, calculatePercentile, TestScore } from '@/lib/scoring';
import { saveTestResult, calculateRealPercentile, generateResultToken, getGlobalStats } from '@/lib/supabase';
import { getModuleTranslationKey, translateModuleName } from '@/lib/moduleMapping';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadarChartComponent, BarChartComponent } from '@/components/ResultsCharts';
import { ChevronDown, ChevronUp, BookOpen, TrendingUp, AlertCircle, Award, Brain, Mail, Share2, Database } from 'lucide-react';
import SocialShare from '@/components/SocialShare';
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
    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border print:border-gray-300 print:break-inside-avoid">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-700 transition-colors print:bg-gray-50 print:cursor-default"
      >
        <div className="flex items-center gap-4">
          {/* Titre - largeur fixe pour alignement */}
          <span className="font-semibold text-left text-gray-900 dark:text-white flex-1 min-w-0">
            {title}
          </span>

          {/* Jauge - largeur fixe pour alignement */}
          {scorePercentage !== undefined && (
            <div className="flex items-center gap-3 w-64 flex-shrink-0">
              <div className="flex-1">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
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

          {/* Icône chevron - caché en print */}
          <div className="flex-shrink-0 print:hidden">
            {isOpen ?
              <ChevronUp className="w-5 h-5 text-blue-600" /> :
              <ChevronDown className="w-5 h-5 text-gray-400" />
            }
          </div>
        </div>
      </button>
      {/* Toujours visible en mode impression */}
      <div className={`${isOpen ? 'block' : 'hidden'} print:block px-6 py-5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 leading-relaxed border-t-2 border-gray-100 dark:border-gray-700 print:border-t print:border-gray-200`}>
        {children}
      </div>
    </div>
  );
};

export default function ResultatsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('results');
  const tCommon = useTranslations('common');
  const { session, modules, resetTest } = useTestStore();
  const [testScore, setTestScore] = useState<TestScore | null>(null);
  const [email, setEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Nouveaux états pour Supabase
  const [resultToken, setResultToken] = useState<string | null>(null);
  const [realPercentile, setRealPercentile] = useState<number | null>(null);
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [savingToDb, setSavingToDb] = useState(false);
  const [savedToDb, setSavedToDb] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Déduire la version si elle n'est pas définie (pour les anciennes sessions)
  const version = session?.version || (modules.length > 6 ? 'complète' : 'courte');

  useEffect(() => {
    if (!session?.completedAt || !modules.length) {
      router.push(`/${locale}/test`);
      return;
    }

    const scores = scoreTest(modules, session.answers, locale, session.randomizedValues);
    const percentile = calculatePercentile(scores.percentage);
    setTestScore({ ...scores, percentile });

    // Sauvegarder automatiquement dans Supabase
    const saveToSupabase = async () => {
      try {
        setSavingToDb(true);
        const token = generateResultToken();

        await saveTestResult({
          result_token: token,
          test_version: version,
          total_points: scores.totalEarned,
          total_possible: scores.totalPossible,
          percentage: scores.percentage,
          module_scores: scores.modules,
          answers: session.answers,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        });

        setResultToken(token);
        setSavedToDb(true);

        // Calculer le vrai percentile basé sur toutes les données
        const realPerc = await calculateRealPercentile(scores.percentage, version);
        setRealPercentile(realPerc);

        // Charger les stats globales
        const stats = await getGlobalStats(version);
        setGlobalStats(stats);

      } catch (error) {
        console.error('Error saving to Supabase:', error);
        // On continue même si la sauvegarde échoue
      } finally {
        setSavingToDb(false);
      }
    };

    saveToSupabase();
  }, [session, modules, router, version]);

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
          locale,
          resultToken,
        }),
      });

      if (response.ok) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 5000);
      } else {
        alert(t('errorSending'));
      }
    } catch (error) {
      alert(t('errorSending'));
    } finally {
      setSendingEmail(false);
    }
  };

  if (!testScore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
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
    if (score >= 85) return t('scoreLabels.veryHigh');
    if (score >= 70) return t('scoreLabels.high');
    if (score >= 55) return t('scoreLabels.average');
    if (score >= 40) return t('scoreLabels.belowAverage');
    return t('scoreLabels.limited');
  };

  // Descriptions COMPLÈTES avec liens hypertextes - FRANÇAIS
  const moduleDescriptionsFR: Record<string, {
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
    'Calibration des Connaissances': {
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
    'Croyances Conspirationnistes': {
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
    },
    'Numératie Probabiliste': {
      what: (
        <p>Votre capacité à manipuler et comprendre les nombres dans des contextes probabilistes :
          calculs de probabilités, transformations entre fractions/pourcentages/fréquences,
          compréhension des grands nombres.</p>
      ),
      why: (
        <p>La numératie probabiliste est fondamentale pour interpréter correctement les statistiques médicales,
          financières, et scientifiques. Sans elle, on est vulnérable aux manipulations statistiques et aux
          mauvaises décisions basées sur des chiffres mal compris.</p>
      ),
      example: (
        <p>Question typique : "Si 1 personne sur 1000 a une maladie, et un test détecte la maladie avec
          95% de précision, quelle est la probabilité qu'une personne avec un test positif soit vraiment malade ?"
          Beaucoup répondent 95%, mais c'est environ 2% (à cause des faux positifs).</p>
      ),
      canImprove: (
        <p>Amélioration : modérée (15-30%). La pratique avec des exercices de probabilités aide,
          surtout en utilisant des fréquences naturelles plutôt que des pourcentages.
          Mais les erreurs persistent sous pression ou avec des nombres complexes.</p>
      )
    },
    'Attitudes Anti-Science': {
      what: (
        <p>Votre résistance aux attitudes de rejet de la science et de la méthode scientifique :
          croire que l'intuition personnelle vaut mieux que les études scientifiques, rejeter
          le consensus scientifique, ou penser que la science est "juste une opinion".</p>
      ),
      why: (
        <p>Les attitudes anti-science mènent au rejet des vaccins, du changement climatique, de l'évolution,
          et d'autres faits scientifiques bien établis. Elles créent une vulnérabilité aux pseudosciences
          et aux théories du complot.</p>
      ),
      example: (
        <p>Attitude anti-science typique : "Les scientifiques changent constamment d'avis, donc on ne peut
          pas leur faire confiance." Cette incompréhension du processus scientifique (qui progresse par
          raffinements successifs) conduit au rejet de découvertes bien établies.</p>
      ),
      canImprove: (
        <p>Amélioration : difficile (&lt;15%). Les attitudes anti-science sont souvent liées à l'identité
          sociale et aux croyances politiques/religieuses. L'éducation scientifique aide, mais insuffisant
          sans adresser les facteurs sociaux et émotionnels.</p>
      )
    },
    'Croyances Dysfonctionnelles': {
      what: (
        <p>Adhésion à des croyances irrationnelles qui peuvent nuire à la prise de décision et au bien-être :
          pensée magique, croyances paranormales, affirmations de santé non fondées, pratiques pseudoscientifiques.</p>
      ),
      why: (
        <p>Les croyances dysfonctionnelles conduisent à de mauvaises décisions : argent gaspillé sur des traitements
          inefficaces, rejet de solutions fondées sur des preuves, vulnérabilité aux arnaques, et comportements
          potentiellement dangereux.</p>
      ),
      example: (
        <p>Croire que les cristaux guérissent les maladies, que l'astrologie prédit la personnalité, ou que les
          régimes détox éliminent les "toxines". Ces croyances persistent malgré l'absence de preuves et peuvent
          empêcher les gens de chercher un traitement efficace.</p>
      ),
      canImprove: (
        <p>Amélioration : modeste (10-20%). L'éducation à la pensée critique aide, mais ces croyances remplissent
          souvent des besoins émotionnels (contrôle, sens, communauté). Adresser les besoins sous-jacents est plus
          efficace que la logique pure.</p>
      )
    }
  };

  // English module descriptions - COMPLETE
  const moduleDescriptionsEN: Record<string, {
    what: React.ReactElement;
    why: React.ReactElement;
    example: React.ReactElement;
    canImprove: React.ReactElement;
  }> = {
    'Probabilistic Reasoning': {
      what: (
        <p>This module assesses your ability to reason with probabilities: understanding{' '}
          <a href="https://en.wikipedia.org/wiki/Base_rate_fallacy" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">
            base rates
          </a>, avoiding the{' '}
          <a href="https://en.wikipedia.org/wiki/Gambler%27s_fallacy" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">
            gambler's fallacy
          </a>{' '}
          (believing past random outcomes influence future ones), and the{' '}
          <a href="https://en.wikipedia.org/wiki/Conjunction_fallacy" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">
            conjunction fallacy
          </a>{' '}
          (thinking A+B is more probable than A alone).
        </p>
      ),
      why: (
        <p>In the 1970s,{' '}
          <a href="https://en.wikipedia.org/wiki/Daniel_Kahneman" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">
            Kahneman
          </a>{' '}
          and{' '}
          <a href="https://en.wikipedia.org/wiki/Amos_Tversky" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">
            Tversky
          </a>{' '}
          discovered that even statistics experts regularly violate basic principles of probability.
          These errors have real consequences: misdiagnoses, financial bubbles, poor risk assessment.
        </p>
      ),
      example: (
        <p>Classic medical problem: A test detects a disease with 95% accuracy. The disease affects 1% of the population.
          Your test is positive. Probability of being sick? Most say 95%, but it's ~9% (due to numerous false positives
          in a population where the disease is rare).</p>
      ),
      canImprove: (
        <p>Improvement potential: moderate (10-25%). Practice with natural frequencies rather than percentages.
          However, even after training, errors persist under pressure or fatigue.</p>
      )
    },
    'Scientific Reasoning': {
      what: (
        <p>Your ability to rigorously test hypotheses: seeking to{' '}
          <a href="https://en.wikipedia.org/wiki/Falsifiability" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">
            falsify
          </a>{' '}
          rather than confirm, distinguishing{' '}
          <a href="https://en.wikipedia.org/wiki/Correlation_does_not_imply_causation" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">
            correlation from causation
          </a>, understanding the importance of control groups.
        </p>
      ),
      why: (
        <p>The{' '}
          <a href="https://en.wikipedia.org/wiki/Confirmation_bias" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">
            confirmation bias
          </a>{' '}
          (seeking only what confirms our beliefs) is one of the most robust. It explains why intelligent people
          believe false things and why debates go in circles.
        </p>
      ),
      example: (
        <p>
          <a href="https://en.wikipedia.org/wiki/Wason_selection_task" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">
            Wason's test
          </a>{' '}
          (1966): Cards E, K, 4, 7. Rule: "If vowel, then even number". Which cards to turn?
          Intuitive answer: E and 4 (confirmation). Correct: E and 7 (falsification). Only ~10% succeed,
          even among scientists.
        </p>
      ),
      canImprove: (
        <p>Improvement potential: moderate (15-30%). Falsification can be learned, but our instinct remains
          to seek confirmation. Use systematic protocols rather than your intuition.</p>
      )
    },
    'Reflection vs Intuition': {
      what: (
        <p>Measured by the{' '}
          <a href="https://en.wikipedia.org/wiki/Cognitive_Reflection_Test" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">
            Cognitive Reflection Test
          </a>{' '}
          (Frederick, 2005): your ability to inhibit the immediate intuitive response and engage analytical thinking.
        </p>
      ),
      why: (
        <p>Our{' '}
          <a href="https://www.lesswrong.com/tag/system-1" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">
            System 1
          </a>{' '}
          (intuitive) responds instantly but predictably errs on non-trivial problems.
          System 2 (analytical) can correct, but it's lazy and cognitively expensive.
        </p>
      ),
      example: (
        <p>Bat and ball = $1.10. Bat costs $1 more than ball. How much is the ball? System 1 shouts "10 cents!"
          System 2 calculates: 5 cents. 50% of MIT students fail.</p>
      ),
      canImprove: (
        <p><strong>WARNING</strong>: CRT improvements are often due to memorizing questions,
          not genuine reflection improvement. Real gain is probably &lt;20%.</p>
      )
    },
    'Belief Bias': {
      what: (
        <p>Your ability to evaluate logical validity of reasoning independently of your beliefs about the conclusion
          (avoiding content interference with logic).</p>
      ),
      why: (
        <p>We accept logically invalid arguments if we like the conclusion, and reject valid arguments
          if we dislike it. This prevents rational debate.</p>
      ),
      example: (
        <p>Syllogism: "All rare things are expensive. Diamonds are rare. Therefore diamonds are expensive."
          Logically valid. But "All rare things are expensive. Cheap water is rare. Therefore cheap water
          is expensive" - same structure, rejected because absurd.</p>
      ),
      canImprove: (
        <p>Improvement: difficult (&lt;10%). This is a deep bias. Better to use protocols:
          have someone evaluate logic without knowing the subject.</p>
      )
    },
    'Knowledge Calibration': {
      what: (
        <p>Your ability to accurately estimate your level of certainty. A well-{' '}
          <a href="https://www.lesswrong.com/tag/calibration" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">
            calibrated
          </a>{' '}
          person who says "70% certain" is right ~70% of the time.
        </p>
      ),
      why: (
        <p>The{' '}
          <a href="https://en.wikipedia.org/wiki/Overconfidence_effect" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">
            overconfidence bias
          </a>{' '}
          is one of the most universal and dangerous: projects exceeding budget/deadlines, risky investments,
          medical misdiagnoses.
        </p>
      ),
      example: (
        <p>When people say they're "99% certain" of general knowledge facts, they're wrong ~40% of the time.
          Experts are particularly vulnerable: 80% of doctors overestimate their diagnostic accuracy.</p>
      ),
      canImprove: (
        <p><strong>Promising</strong>: Calibration is one of the FEW biases that improves with practice (20-40%).
          Philip Tetlock's superforecasters show sustained improvement through systematic feedback.</p>
      )
    },
    'Superstitious Thinking': {
      what: (
        <p>Tendency to see patterns, causes, or relationships where none exist: lucky numbers, rituals,
          "hot streaks" in random games, post hoc ergo propter hoc fallacy.</p>
      ),
      why: (
        <p>Our brain is a pattern-detection machine optimized for survival, not truth. Better to see 10 false
          patterns than miss 1 real predator. Result: we see faces in clouds, causes in coincidences.</p>
      ),
      example: (
        <p>Basketball "hot hand": players and fans are convinced a shooter who's made several shots is more likely
          to make the next one. Statistical analyses show it's an illusion - past successes don't predict future ones.</p>
      ),
      canImprove: (
        <p>Improvement: difficult (&lt;15%). Superstitious thinking is deeply rooted in our need for control
          and meaning. Education about randomness helps, but emotional appeal of patterns persists.</p>
      )
    },
    'Conspiracy Beliefs': {
      what: (
        <p>Tendency to accept conspiratorial explanations: distrust of official narratives, preference for
          secret plots, seeing connections between unrelated events, rejection of contradictory evidence.</p>
      ),
      why: (
        <p>Conspiracism provides simple explanations for complex events, restores sense of control ("it's not
          chaos, someone's in control"), and reinforces group identity. Extremely resistant to evidence.</p>
      ),
      example: (
        <p>Classic conspiracy: "Moon landing was faked." Every debunking (shadows, flags, rocks) generates new
          theories ("that's what THEY want you to believe"). Unfalsifiable = unscientific.</p>
      ),
      canImprove: (
        <p>Improvement: very difficult (&lt;10%). Conspiracism is often linked to anxiety, loss of control, distrust
          of institutions. Pure logic rarely helps. Need to address underlying emotional and social factors.</p>
      )
    },
    'Disjunctive Reasoning': {
      what: (
        <p>Ability to correctly reason with "OR" statements and understand that disproving one alternative
          doesn't prove another. Avoiding false dilemmas ("either A or B" when C, D, E exist).</p>
      ),
      why: (
        <p>Disjunctive reasoning errors enable manipulation through false choices. Politics and advertising
          constantly present false dilemmas: "Either you're with us or against us."</p>
      ),
      example: (
        <p>Statement: "John went to beach OR mountains." Learning he didn't go to beach doesn't mean he went
          to mountains (could have stayed home, gone elsewhere). Yet people confidently conclude "then mountains!"</p>
      ),
      canImprove: (
        <p>Improvement: moderate (15-25%). Systematic training in formal logic helps. Key: always ask
          "What other options exist?" before concluding.</p>
      )
    },
    'Anchoring': {
      what: (
        <p>The{' '}
          <a href="https://en.wikipedia.org/wiki/Anchoring_(cognitive_bias)" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">
            anchoring effect
          </a>: being influenced by an initial number, even if completely arbitrary and irrelevant, when making
          numerical estimates.</p>
      ),
      why: (
        <p>Anchoring is exploited in negotiations, sales, justice (sentencing). Initial "suggested price" heavily
          influences final price, even for experts. One of the most robust and hardest to resist biases.</p>
      ),
      example: (
        <p>Kahneman & Tversky: Spin a wheel (1-100), then estimate % of African countries in UN. Wheel shows 10:
          average estimate 25%. Wheel shows 65: average 45%. The random number influenced the estimate!</p>
      ),
      canImprove: (
        <p><strong>Very difficult</strong> (&lt;5%). Even experts aware of anchoring remain affected. Best strategy:
          refuse initial numbers, deliberately consider opposite extremes before estimating.</p>
      )
    },
    'Probabilistic Numeracy': {
      what: (
        <p>Basic understanding of probabilities, percentages, frequencies: calculating odds, comparing risks,
          understanding concepts like independence, conditional probability, expected value.</p>
      ),
      why: (
        <p>Modern life requires probability decisions: medical tests, insurance, investments, everyday risks.
          Without basic numeracy, you're vulnerable to manipulation and poor decisions.</p>
      ),
      example: (
        <p>Which kills more: sharks or falling airplane parts? Intuition says sharks (dramatic, memorized).
          Reality: airplane parts cause more deaths. We systematically misjudge familiar vs rare risks.</p>
      ),
      canImprove: (
        <p>Improvement: <strong>good</strong> (30-50%). Unlike other biases, basic numeracy improves well with
          education and practice. Concrete exercises with feedback are effective.</p>
      )
    },
    'Anti-Science Attitudes': {
      what: (
        <p>Distrust of scientific method, preference for intuition/tradition over evidence, rejection of
          scientific consensus on climate, vaccines, evolution, etc.</p>
      ),
      why: (
        <p>Anti-science attitudes are often linked to values conflicts (science appears to threaten identity,
          religion, politics). It's not usually an intelligence problem, but values problem.</p>
      ),
      example: (
        <p>Climate change: 97% of climate scientists agree human activities cause warming. Yet 30-40% of public
          rejects it. Not due to lack of evidence, but identity ("environmentalism = left-wing") and mistrust.</p>
      ),
      canImprove: (
        <p>Improvement: difficult (&lt;15%). Anti-science attitudes are often linked to social identity
          and political/religious beliefs. Science education helps, but insufficient without addressing
          social and emotional factors.</p>
      )
    },
    'Dysfunctional Beliefs': {
      what: (
        <p>Adherence to irrational beliefs that can negatively impact decision-making and well-being: magical thinking,
          paranormal beliefs, unfounded health claims, pseudoscientific practices.</p>
      ),
      why: (
        <p>Dysfunctional beliefs lead to poor decisions: wasted money on ineffective treatments, rejection of
          evidence-based solutions, vulnerability to scams, and potentially harmful behaviors.</p>
      ),
      example: (
        <p>Believing crystals cure diseases, astrology predicts personality, or detox diets eliminate "toxins."
          These beliefs persist despite lack of evidence and can prevent people from seeking effective treatment.</p>
      ),
      canImprove: (
        <p>Improvement: modest (10-20%). Critical thinking education helps, but these beliefs often fulfill
          emotional needs (control, meaning, community). Addressing underlying needs is more effective than pure logic.</p>
      )
    }
  };

  const moduleDescriptions = locale === 'fr' ? moduleDescriptionsFR : moduleDescriptionsEN;

  return (
    <>
      {/* Styles CSS pour l'impression */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 1.5cm 2cm;
            size: A4;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            color: #000 !important;
          }

          /* Cacher les éléments non nécessaires à l'impression */
          .print\\:hidden,
          button:not(.print\\:block),
          nav,
          .no-print {
            display: none !important;
          }

          /* Forcer les accordéons à être ouverts */
          .print\\:block {
            display: block !important;
          }

          /* Éviter les sauts de page à l'intérieur des éléments */
          .print\\:break-inside-avoid,
          .border-2 {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          /* Améliorer l'affichage des graphiques */
          svg {
            max-height: 350px !important;
          }

          /* Espacements pour print */
          h1 {
            font-size: 28px !important;
            margin-bottom: 8px !important;
            color: #000 !important;
          }

          h2 {
            font-size: 20px !important;
            margin-top: 20px !important;
            margin-bottom: 12px !important;
            page-break-after: avoid;
            break-after: avoid;
            color: #000 !important;
            border-left: 4px solid #667eea !important;
            padding-left: 8px !important;
          }

          h3, h4 {
            page-break-after: avoid;
            break-after: avoid;
            color: #000 !important;
          }

          p {
            color: #000 !important;
          }

          /* Liens en texte visible */
          a[href]:after {
            content: none !important;
          }

          /* Fond blanc par défaut */
          * {
            background: white !important;
            color: #000 !important;
          }

          /* Garder les couleurs importantes */
          .bg-green-500, .bg-blue-500, .bg-yellow-500, .bg-red-500 {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            color: white !important;
          }

          /* Score global avec fond bleu */
          .border-t-4.border-blue-600 {
            background: #eff6ff !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            border-top: 4px solid #667eea !important;
          }

          /* Score display */
          .text-6xl {
            color: #667eea !important;
            font-size: 48px !important;
          }

          .text-2xl {
            color: #667eea !important;
          }

          /* Interprétation avec fond jaune */
          .bg-yellow-50 {
            background: #fef3c7 !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          .border-yellow-500 {
            border-color: #f59e0b !important;
          }

          /* Note critique avec fond vert */
          .bg-green-50 {
            background: #d1fae5 !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          .border-green-500 {
            border-color: #10b981 !important;
          }

          /* Box bleu */
          .bg-blue-50 {
            background: #dbeafe !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          .border-blue-500 {
            border-color: #3b82f6 !important;
          }

          /* Modules */
          .rounded-xl, .rounded-lg {
            border: 1px solid #e5e7eb !important;
            margin-bottom: 12px !important;
          }

          /* Améliorer les barres de progression */
          .bg-gray-200 {
            background: #e5e7eb !important;
            border: 1px solid #d1d5db !important;
          }

          /* Gris texte lisible */
          .text-gray-600, .text-gray-500, .text-gray-700 {
            color: #4b5563 !important;
          }

          /* Titres de sections */
          .font-bold {
            font-weight: 700 !important;
            color: #000 !important;
          }

          /* Espacements réduits pour PDF */
          .mb-8 {
            margin-bottom: 16px !important;
          }

          .mb-12 {
            margin-bottom: 20px !important;
          }

          .space-y-6 > * + * {
            margin-top: 12px !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 print:bg-white transition-colors">
        <div className="max-w-4xl mx-auto px-4 py-12 print:px-6 print:py-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('completedOn')} {new Date(session!.completedAt!).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              version === 'complète'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {tCommon('version')} {version === 'complète' ? tCommon('full') : tCommon('short')}
            </span>
          </div>
        </div>

        {/* Score Global */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 text-center border-t-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('globalScore')}</h2>
          <div className="mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(testScore.percentage)}`}>
              {testScore.percentage.toFixed(1)}%
            </div>
            <div className={`text-2xl font-semibold mb-2 ${getScoreColor(testScore.percentage)}`}>
              {t('rationality')} {getScoreLabel(testScore.percentage)}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-300">
              {testScore.totalEarned.toFixed(1)} / {testScore.totalPossible.toFixed(1)} {t('points')}
            </div>
          </div>
          {/* Percentile - toujours afficher l'estimé */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 inline-block">
            <p className="text-gray-700 dark:text-gray-300">
              {t('percentile')} : <strong className="text-blue-600 dark:text-blue-400">{testScore.percentile}e</strong>
              <br />
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ({t('theoreticalDistribution')})
              </span>
            </p>
          </div>

          {/* Lien de sauvegarde / partage */}
          {resultToken && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t('savedResults')}
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-3">
                {t('shareDescription')}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/${locale}/resultats/${resultToken}`);
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2000);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-md"
                >
                  <Share2 className="w-5 h-5" />
                  {linkCopied ? t('linkCopied') : t('copyLink')}
                </button>
              </div>
            </div>
          )}

          {/* Statistiques globales */}
          {globalStats && globalStats.count > 10 && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">📊 {t('globalStatsVersion')} {version})</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-600 dark:text-gray-300">{t('testsCompleted')} :</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-1">{globalStats.count}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">{t('averageScore')} :</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-1">{globalStats.average.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">{t('median')} :</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-1">{globalStats.median.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">{t('bestScore')} :</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-1">{globalStats.max.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* CART Comparison */}
          {(() => {
            // Choose appropriate CART norms based on test version
            const cartNorms = version === 'complète' ? CART_FULL_FORM_NORMS : CART_SHORT_FORM_NORMS;
            const cartPercentile = calculateCARTPercentile(
              testScore.totalEarned,
              testScore.totalPossible,
              cartNorms
            );
            const interpretation = getPercentileInterpretation(cartPercentile, locale as 'en' | 'fr');

            return (
              <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-4 text-left">
                <div className="flex items-start gap-3 mb-3">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                      {locale === 'fr' ? '🎓 Comparaison avec la recherche officielle CART' : '🎓 Comparison with Official CART Research'}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                      {locale === 'fr'
                        ? `Basé sur l'étude ${cartNorms.study} (N=${cartNorms.sampleSize}, ${cartNorms.sampleDescription})`
                        : `Based on study ${cartNorms.study} (N=${cartNorms.sampleSize}, ${cartNorms.sampleDescription})`
                      }
                    </p>
                    <div className="bg-white dark:bg-gray-800 rounded p-3 mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          {locale === 'fr' ? 'Votre percentile CART :' : 'Your CART percentile:'}
                        </span>
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {cartPercentile}e
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 italic">
                        {interpretation}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white dark:bg-gray-800 rounded p-2">
                        <div className="text-gray-600 dark:text-gray-400">
                          {locale === 'fr' ? 'Moyenne CART' : 'CART Mean'}
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {((cartNorms.mean / cartNorms.totalPoints) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded p-2">
                        <div className="text-gray-600 dark:text-gray-400">
                          {locale === 'fr' ? 'Votre score' : 'Your score'}
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {testScore.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
                      {locale === 'fr'
                        ? '* Comparaison approximative basée sur les normes publiées du test CART. Les différences de format et de contenu peuvent affecter la comparabilité directe.'
                        : '* Approximate comparison based on published CART test norms. Differences in format and content may affect direct comparability.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Interprétation Réaliste */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-600 rounded-r-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t('interpretation')}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-justify mb-3">
                {testScore.interpretation}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm text-justify italic">
                <strong>{t('criticalNote')}</strong> {t('criticalNoteText')}
              </p>
            </div>
          </div>
        </div>

        {/* Histoire du CART */}
        <AccordionItem title={t('cartHistory.title')} defaultOpen={false}>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                {t('cartHistory.fortyYears')}
              </h4>
              <p className="text-justify mb-3">
                {t('cartHistory.fortyYearsP1')}
              </p>
              <p className="text-justify mb-3">
                {t('cartHistory.fortyYearsP2')}
              </p>
              <p className="text-justify">
                {t('cartHistory.fortyYearsP3')}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t('cartHistory.theProblem')}</h4>
              <p className="text-justify mb-3">
                {t('cartHistory.theProblemP1')}
              </p>
              <p className="text-justify">
                {t('cartHistory.theProblemP2')}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Award className="w-5 h-5" />
                {t('cartHistory.birthOfCart')}
              </h4>
              <p className="text-justify mb-3">
                {t('cartHistory.birthOfCartP1')}
              </p>
              <p className="text-justify mb-3">
                {t('cartHistory.birthOfCartP2')}
              </p>
              <p className="text-justify text-sm bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 p-3 rounded">
                {t('cartHistory.birthOfCartP3')}
              </p>
            </div>
          </div>
        </AccordionItem>

        {/* Graphiques (VERTICAUX) */}
        <div className="space-y-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('radarChart')}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadarChartComponent moduleScores={testScore.modules} locale={locale} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('barChart')}</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent moduleScores={testScore.modules} locale={locale} />
            </CardContent>
          </Card>
        </div>

        {/* Détail par Module avec Jauges */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border-t-4 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('moduleDetails')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('moduleDetailsDescription')}
          </p>

          <div className="space-y-3">
            {testScore.modules
              .filter(m => m.possible > 0)
              .sort((a, b) => b.percentage - a.percentage)
              .map((moduleScore) => {
                const rawModuleName = moduleScore.moduleName.split(' (')[0];
                // Translate module name to current locale for display
                const displayName = translateModuleName(rawModuleName, locale as 'en' | 'fr');
                // Get description using translated name (which matches keys in moduleDescriptions)
                const desc = moduleDescriptions[displayName];

                return (
                  <AccordionItem
                    key={moduleScore.moduleId}
                    title={displayName}
                    scorePercentage={moduleScore.percentage}
                  >
                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                      <strong>{moduleScore.earned.toFixed(1)}</strong> / {moduleScore.possible.toFixed(1)} points
                    </div>

                    {desc ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                            🎯 {t('whatIsMeasured')}
                          </h4>
                          <div className="text-justify">{desc.what}</div>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                            💡 {t('whyImportant')}
                          </h4>
                          <div className="text-justify">{desc.why}</div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                            📌 {t('classicExample')}
                          </h4>
                          <div className="text-sm text-justify">{desc.example}</div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 dark:border-yellow-600">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                            📈 {t('canImprove')}
                          </h4>
                          <div className="text-sm text-justify">{desc.canImprove}</div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        {t('descriptionInProgress')}
                      </p>
                    )}
                  </AccordionItem>
                );
              })}
          </div>
        </div>

        {/* Approche de Kahneman : Outils Externes */}
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-600 rounded-r-xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-xl">
            {t('pragmaticSolution.title')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-justify">
            {t('pragmaticSolution.intro')}
          </p>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span>{t('pragmaticSolution.checklist')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span>{t('pragmaticSolution.consultation')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span>{t('pragmaticSolution.slowdown')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span>{t('pragmaticSolution.premortem')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span>{t('pragmaticSolution.journal')}</span>
            </li>
          </ul>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 italic">
            {t('pragmaticSolution.example')}
          </p>
        </div>

        {/* Ressources */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('resources.title')}
          </h2>

          <AccordionItem title={t('resources.essentialReading')}>
            <ul className="space-y-3">
              <li>
                <a href="https://www.goodreads.com/book/show/11468377" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  {t('resources.thinkingFastSlow')}
                </a> - Daniel Kahneman<br />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('resources.thinkingFastSlowDesc')}</span>
              </li>
              <li>
                <a href="https://mitpress.mit.edu/9780262034845/" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  {t('resources.rationalityQuotient')}
                </a> - Stanovich, West & Toplak<br />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('resources.rationalityQuotientDesc')}</span>
              </li>
              <li>
                <a href="https://www.goodreads.com/book/show/23995360" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  {t('resources.superforecasting')}
                </a> - Philip Tetlock<br />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('resources.superforecastingDesc')}</span>
              </li>
              <li>
                <a href="https://www.goodreads.com/book/show/42041926" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  {t('resources.scoutMindset')}
                </a> - Julia Galef<br />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('resources.scoutMindsetDesc')}</span>
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title={t('resources.calibrationPractice')}>
            <ul className="space-y-2">
              <li>
                <a href="https://www.metaculus.com" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  {t('resources.metaculus')}
                </a> - {t('resources.metaculusDesc')}
              </li>
              <li>
                <a href="https://www.lesswrong.com" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  {t('resources.lesswrong')}
                </a> - {t('resources.lesswrongDesc')}
              </li>
            </ul>
          </AccordionItem>
        </div>

        {/* Sources scientifiques */}
        <AccordionItem title={t('scientificSources.title')}>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t('scientificSources.mainFoundations')}</h4>
              <ul className="space-y-2">
                <li>
                  <strong>Stanovich, K. E., West, R. F., & Toplak, M. E. (2016).</strong><br />
                  <em>{t('scientificSources.stanovich2016')}</em>
                </li>
                <li>
                  <strong>Kahneman, D., & Tversky, A. (1974).</strong><br />
                  <em>{t('scientificSources.kahneman1974')}</em>
                </li>
                <li>
                  <strong>Frederick, S. (2005).</strong><br />
                  <em>{t('scientificSources.frederick2005')}</em>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t('scientificSources.onImprovement')}</h4>
              <ul className="space-y-2">
                <li>
                  <strong>Morewedge et al. (2015).</strong><br />
                  <em>{t('scientificSources.morewedge2015')}</em><br />
                  <span className="text-gray-600 dark:text-gray-400">{t('scientificSources.morewedge2015Desc')}</span>
                </li>
                <li>
                  <strong>Kahneman, D. (2011).</strong><br />
                  <em>{t('scientificSources.kahneman2011')}</em><br />
                  <span className="text-gray-600 dark:text-gray-400 italic">{t('scientificSources.kahneman2011Quote')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t('scientificSources.testLimitations')}</h4>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>{t('scientificSources.limitation1')}</li>
                <li>{t('scientificSources.limitation2')}</li>
                <li>{t('scientificSources.limitation3')}</li>
                <li>{t('scientificSources.limitation4')}</li>
              </ul>
            </div>
          </div>
        </AccordionItem>

        {/* State of Research */}
        <AccordionItem title={t('stateOfResearch.title')} defaultOpen={false}>
          <div className="space-y-6">
            <p className="text-gray-700 dark:text-gray-300 italic text-justify">
              {t('stateOfResearch.intro')}
            </p>

            {/* What We Know */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✅</span>
                {t('stateOfResearch.whatWeKnow')}
              </h4>
              <div className="space-y-3 pl-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.finding1')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.finding1Text')}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.finding2')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.finding2Text')}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.finding3')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.finding3Text')}</p>
                </div>
              </div>
            </div>

            {/* What We Don't Know */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-yellow-600 dark:text-yellow-400">❓</span>
                {t('stateOfResearch.whatWeDontKnow')}
              </h4>
              <div className="space-y-3 pl-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.question1')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.question1Text')}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.question2')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.question2Text')}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.question3')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.question3Text')}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.question4')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.question4Text')}</p>
                </div>
              </div>
            </div>

            {/* Active Controversies */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-red-600 dark:text-red-400">⚡</span>
                {t('stateOfResearch.activeControversies')}
              </h4>
              <div className="space-y-3 pl-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.controversy1')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.controversy1Text')}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.controversy2')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.controversy2Text')}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                  <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.controversy3')}</strong>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.controversy3Text')}</p>
                </div>
              </div>
            </div>

            {/* Bottom Line */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-600 p-4 rounded">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">{t('stateOfResearch.honestBottomLine')}</h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <li>{t('stateOfResearch.bottomLine1')}</li>
                <li>{t('stateOfResearch.bottomLine2')}</li>
                <li>{t('stateOfResearch.bottomLine3')}</li>
                <li>{t('stateOfResearch.bottomLine4')}</li>
                <li>{t('stateOfResearch.bottomLine5')}</li>
              </ul>
            </div>

            {/* Recent Work */}
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <strong className="text-gray-900 dark:text-white">{t('stateOfResearch.recentWork')}</strong>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{t('stateOfResearch.recentWorkText')}</p>
            </div>
          </div>
        </AccordionItem>

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center mb-8 print:hidden">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('nextSteps')}</h2>

          {/* Recevoir par email */}
          <div className="mb-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {t('sendEmail')}
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('email')}
                className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail || !email}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {sendingEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {t('sending')}
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    {t('send')}
                  </>
                )}
              </button>
            </div>
            {emailSent && (
              <p className="text-green-600 text-sm mt-2">{t('emailSent')}</p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
            >
              {t('downloadPDF')}
            </button>
            <Link href={`/${locale}/test?reset=true${version === 'complète' ? '&version=full' : ''}`}>
              <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                {t('retakeTest')}
              </button>
            </Link>
            <Link href={`/${locale}`}>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors">
                {t('backHome')}
              </button>
            </Link>
          </div>

          {/* Social Share */}
          {resultToken && (
            <div className="flex flex-col items-center gap-3 print:hidden">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{locale === 'fr' ? 'Partager vos résultats' : 'Share your results'}</h3>
              <SocialShare
                url={`${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/resultats/${resultToken}`}
                title={locale === 'fr'
                  ? `J'ai obtenu ${testScore?.percentage.toFixed(1)}% au test de rationalité !`
                  : `I scored ${testScore?.percentage.toFixed(1)}% on the rationality test!`}
                description={locale === 'fr'
                  ? 'Testez votre pensée critique et identifiez vos biais cognitifs'
                  : 'Test your critical thinking and identify your cognitive biases'}
                locale={locale}
              />
            </div>
          )}

          <div className="mt-6 text-center">
            <a
              href={`mailto:rom.deleglise@orange.fr?subject=${locale === 'fr' ? 'Feedback sur le Test de Rationalité' : 'Feedback on Rationality Test'}&body=${locale === 'fr' ? 'Bonjour,%0D%0A%0D%0AJe vous contacte pour partager mon feedback sur le test de rationalité :%0D%0A%0D%0A' : 'Hello,%0D%0A%0D%0AI am contacting you to share my feedback on the rationality test:%0D%0A%0D%0A'}`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              {t('sendFeedback')}
            </a>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            {t('retestAdvice')}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400 print:hidden">
          <p>
            {t('footer.openSourceProject')}
          </p>
          <p className="mt-1">
            {t('footer.basedOnResearch')}
          </p>
        </div>
      </div>
    </div>
    </>
  );
}