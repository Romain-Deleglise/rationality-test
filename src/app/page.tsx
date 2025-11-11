'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, BookOpen, Clock, BarChart3, CheckCircle } from 'lucide-react';

const AccordionItem = ({ title, children, defaultOpen = false }: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-left text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white text-gray-700 leading-relaxed text-justify">
          {children}
        </div>
      )}
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Test de Rationalité
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Évaluez votre pensée rationnelle et identifiez vos biais cognitifs
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>18-50 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <span>Feedback détaillé</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>Scientifiquement validé</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span>✓ Entièrement gratuit</span>
            <span>✓ Open source</span>
            <span>✓ Anonyme</span>
            <span>✓ Dans l'intérêt général</span>
          </div>
          <div className="mt-4">
            <a 
              href="https://github.com/Romain-Deleglise/rationality-test" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              → Voir le code source sur GitHub
            </a>
          </div>
        </div>

        {/* Intro Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Qu'est-ce que la rationalité ?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4 text-justify">
            La rationalité, c'est la capacité à former des croyances qui reflètent fidèlement la réalité 
            (<strong>rationalité épistémique</strong>) et à prendre des décisions qui maximisent vos objectifs 
            (<strong>rationalité instrumentale</strong>). Contrairement à l'intelligence mesurée par les tests de QI, 
            la rationalité peut être développée et améliorée avec de la pratique.
          </p>
          <p className="text-gray-700 leading-relaxed text-justify">
            Ce test évalue plusieurs dimensions clés de la pensée rationnelle : le raisonnement probabiliste, 
            le raisonnement scientifique, la résistance aux{' '}
            <a href="https://fr.wikipedia.org/wiki/Biais_cognitif" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              biais cognitifs
            </a>, et la capacité à mettre à jour vos croyances face à de nouvelles preuves.
          </p>
        </div>

        {/* What is tested */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ce que ce test mesure</h2>
          
          <AccordionItem title="🎲 Raisonnement probabiliste">
            <p className="mb-3">
              Votre capacité à raisonner correctement avec les probabilités et à éviter les erreurs classiques comme :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Négligence des taux de base</strong> : Sous-estimer l'importance des statistiques générales</li>
              <li><strong>L'erreur du parieur</strong> : Croire que les événements passés influencent les probabilités futures dans des situations aléatoires</li>
              <li><strong>L'erreur de conjonction</strong> : Penser que deux événements ensemble sont plus probables qu'un seul (
                
                <a href="https://en.wikipedia.org/wiki/Conjunction_fallacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  problème de Linda
                </a>)
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title="🔬 Raisonnement scientifique">
            <p className="mb-3">
              Votre capacité à tester des hypothèses de manière rigoureuse :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Falsification</strong> : Chercher des preuves qui pourraient réfuter une hypothèse (
                <a href="https://fr.wikipedia.org/wiki/Falsifiabilit%C3%A9" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  critère de Popper
                </a>)
              </li>
              <li><strong>Corrélation vs causation</strong> : Comprendre qu'une corrélation n'implique pas nécessairement une cause</li>
              <li><strong>Groupe contrôle</strong> : Reconnaître l'importance des comparaisons appropriées</li>
            </ul>
          </AccordionItem>

          <AccordionItem title="🧠 Réflexion vs Intuition">
            <p className="mb-3">
              Votre capacité à surmonter les réponses intuitives immédiates (mais souvent incorrectes) pour engager 
              une réflexion analytique plus approfondie. Basé sur le{' '}
              <a href="https://en.wikipedia.org/wiki/Cognitive_reflection_test" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Cognitive Reflection Test
              </a>.
            </p>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <strong>Exemple :</strong> "Une batte et une balle coûtent 1,10€ au total. La batte coûte 1€ de plus que la balle. 
              Combien coûte la balle ?"<br/>
              <span className="text-red-600">Réponse intuitive : 0,10€</span><br/>
              <span className="text-green-600">Réponse correcte : 0,05€</span>
            </p>
          </AccordionItem>

          <AccordionItem title="⚖️ Biais de raisonnement">
            <p className="mb-3">
              Votre résistance à plusieurs biais cognitifs importants :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Biais de croyance</strong> : Laisser vos croyances préalables influencer votre évaluation de la logique</li>
              <li><strong>Effets de cadrage</strong> : Changer d'avis selon comment l'information est présentée</li>
              <li><strong>Ancrage</strong> : Être trop influencé par la première information reçue</li>
            </ul>
          </AccordionItem>

          <AccordionItem title="🔮 Pensée rationnelle vs irrationnelle">
            <p className="mb-3">
              Votre capacité à rejeter les croyances infondées et à adopter une pensée scientifique rigoureuse.
            </p>
          </AccordionItem>
        </div>

        {/* Foundations */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Fondements scientifiques
          </h3>
          <p className="text-gray-700 leading-relaxed mb-3 text-justify">
            Ce test est inspiré du{' '}
            <a href="https://mitpress.mit.edu/9780262034845/the-rationality-quotient/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              <strong>CART (Comprehensive Assessment of Rational Thinking)</strong>
            </a>{' '}
            développé par les professeurs Keith E. Stanovich, Richard F. West et Maggie E. Toplak, 
            publié par MIT Press en 2016.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3 text-justify">
            Le CART s'appuie sur plus de 40 ans de recherche en psychologie cognitive sur les biais et 
            heuristiques, notamment les travaux pionniers de{' '}
            <a href="https://fr.wikipedia.org/wiki/Daniel_Kahneman" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Daniel Kahneman
            </a>{' '}
            (Prix Nobel d'Économie 2002) et Amos Tversky.
          </p>
          <p className="text-sm text-gray-600 italic text-justify">
            Note : Ce test est une adaptation éducative libre et gratuite. Il utilise des questions 
            du domaine public et des variantes originales inspirées de la littérature scientifique.
          </p>
        </div>

        {/* Privacy */}
        <AccordionItem title="🔒 Confidentialité et utilisation des données">
          <p className="mb-3">
            Vos réponses sont <strong>anonymes par défaut</strong>. Nous collectons uniquement :
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li>Vos réponses au test (pour calculer votre score)</li>
            <li>Des statistiques agrégées (pour améliorer le test)</li>
          </ul>
          <p>
            Aucune donnée personnelle identifiable n'est collectée. 
            Conforme au{' '}
            <a href="https://fr.wikipedia.org/wiki/R%C3%A8glement_g%C3%A9n%C3%A9ral_sur_la_protection_des_donn%C3%A9es" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              RGPD
            </a>.
          </p>
        </AccordionItem>

        {/* Choose version */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Choisissez votre version
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Short version */}
            <div className="group border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Version Express</h3>
                <p className="text-3xl font-bold text-blue-600 mb-1">~18 min</p>
                <p className="text-sm text-gray-600">6 modules essentiels</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Aperçu rapide de vos biais</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Feedback personnalisé</span>
                </li>
              </ul>
              <Link
                href="/test?reset=true"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 text-center transform group-hover:scale-105"
              >
                Commencer →
              </Link>
            </div>

            {/* Full version */}
            <div className="group border-2 border-blue-500 rounded-xl p-6 hover:border-blue-600 hover:shadow-2xl transition-all duration-300 cursor-pointer relative transform hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                RECOMMANDÉ
              </div>
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Version Complète</h3>
                <p className="text-3xl font-bold text-blue-600 mb-1">~50 min</p>
                <p className="text-sm text-gray-600">11 modules approfondis</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Évaluation approfondie</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Analyse détaillée + graphiques</span>
                </li>
              </ul>
              <Link
                href="/test?reset=true&version=full"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 text-center transform group-hover:scale-105 shadow-lg"
              >
                Commencer →
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            💡 <strong>Astuce :</strong> Choisissez un moment calme où vous êtes reposé
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