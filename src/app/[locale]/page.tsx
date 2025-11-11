'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('home');

  // Wikipedia base URL based on locale
  const wikipediaUrl = locale === 'fr' ? 'https://fr.wikipedia.org' : 'https://en.wikipedia.org';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{t('duration')}</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <span>{t('detailedFeedback')}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>{t('scientificallyValidated')}</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span>✓ {t('features.free')}</span>
            <span>✓ {t('features.openSource')}</span>
            <span>✓ {t('features.anonymous')}</span>
            <span>✓ {t('features.publicInterest')}</span>
          </div>
          <div className="mt-4">
            <a
              href="https://github.com/Romain-Deleglise/rationality-test"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              {t('viewSource')}
            </a>
          </div>
        </div>

        {/* Intro Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('whatIsRationality.title')}
          </h2>
          <p
            className="text-gray-700 leading-relaxed mb-4 text-justify"
            dangerouslySetInnerHTML={{ __html: t('whatIsRationality.intro') }}
          />
          <p
            className="text-gray-700 leading-relaxed mb-4 text-justify"
            dangerouslySetInnerHTML={{ __html: t('whatIsRationality.improvable') }}
          />
          <p className="text-gray-700 leading-relaxed text-justify">
            {t('whatIsRationality.testDescription')}{' '}
            <a href={`${wikipediaUrl}/wiki/Cognitive_bias`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t('whatIsRationality.cognitiveBiases')}
            </a>
            {t('whatIsRationality.andUpdating')}
          </p>
        </div>

        {/* What is tested */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('whatIsTested.title')}</h2>

          <AccordionItem title={t('whatIsTested.probabilistic.title')}>
            <p className="mb-3">
              {t('whatIsTested.probabilistic.description')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>{t('whatIsTested.probabilistic.baseRateNeglect')}</strong> : {t('whatIsTested.probabilistic.baseRateDesc')}</li>
              <li><strong>{t('whatIsTested.probabilistic.gamblersFallacy')}</strong> : {t('whatIsTested.probabilistic.gamblersDesc')}</li>
              <li><strong>{t('whatIsTested.probabilistic.conjunctionFallacy')}</strong> : {t('whatIsTested.probabilistic.conjunctionDesc')} (

                <a href="https://en.wikipedia.org/wiki/Conjunction_fallacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {t('whatIsTested.probabilistic.lindaProblem')}
                </a>)
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title={t('whatIsTested.scientific.title')}>
            <p className="mb-3">
              {t('whatIsTested.scientific.description')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>{t('whatIsTested.scientific.falsification')}</strong> : {t('whatIsTested.scientific.falsificationDesc')} (
                <a href={`${wikipediaUrl}/wiki/Falsifiability`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {t('whatIsTested.scientific.popperCriterion')}
                </a>)
              </li>
              <li><strong>{t('whatIsTested.scientific.correlation')}</strong> : {t('whatIsTested.scientific.correlationDesc')}</li>
              <li><strong>{t('whatIsTested.scientific.controlGroup')}</strong> : {t('whatIsTested.scientific.controlDesc')}</li>
            </ul>
          </AccordionItem>

          <AccordionItem title={t('whatIsTested.reflection.title')}>
            <p className="mb-3">
              {t('whatIsTested.reflection.description')}{' '}
              <a href="https://en.wikipedia.org/wiki/Cognitive_reflection_test" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {t('whatIsTested.reflection.crt')}
              </a>.
            </p>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <strong>{t('whatIsTested.reflection.exampleTitle')}</strong> {t('whatIsTested.reflection.exampleQuestion')}<br/>
              <span className="text-red-600">{t('whatIsTested.reflection.intuitiveAnswer')}</span><br/>
              <span className="text-green-600">{t('whatIsTested.reflection.correctAnswer')}</span>
            </p>
          </AccordionItem>

          <AccordionItem title={t('whatIsTested.biases.title')}>
            <p className="mb-3">
              {t('whatIsTested.biases.description')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>{t('whatIsTested.biases.beliefBias')}</strong> : {t('whatIsTested.biases.beliefDesc')}</li>
              <li><strong>{t('whatIsTested.biases.framingEffects')}</strong> : {t('whatIsTested.biases.framingDesc')}</li>
              <li><strong>{t('whatIsTested.biases.anchoring')}</strong> : {t('whatIsTested.biases.anchoringDesc')}</li>
            </ul>
          </AccordionItem>

          <AccordionItem title={t('whatIsTested.rational.title')}>
            <p className="mb-3">
              {t('whatIsTested.rational.description')}
            </p>
          </AccordionItem>
        </div>

        {/* Foundations */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {t('foundations.title')}
          </h3>
          <p className="text-gray-700 leading-relaxed mb-3 text-justify">
            {t('foundations.cart')}{' '}
            <a href="https://mitpress.mit.edu/9780262034845/the-rationality-quotient/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              <strong>{t('foundations.cartFull')}</strong>
            </a>{' '}
            {t('foundations.developedBy')}
          </p>
          <p className="text-gray-700 leading-relaxed mb-3 text-justify">
            {t('foundations.researchBased')}{' '}
            <a href={`${wikipediaUrl}/wiki/Daniel_Kahneman`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t('foundations.kahneman')}
            </a>{' '}
            {t('foundations.nobel')}
          </p>

          {/* Key References Section */}
          <div className="mt-4 mb-3">
            <h4 className="text-md font-semibold text-gray-800 mb-2">
              {t('foundations.keyReferences')}
            </h4>
            <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
              <li>{t('foundations.ref1')}</li>
              <li>{t('foundations.ref2')}</li>
              <li>{t('foundations.ref3')}</li>
              <li>{t('foundations.ref4')}</li>
            </ul>
          </div>

          <p className="text-sm text-gray-600 italic text-justify">
            {t('foundations.disclaimer')}
          </p>
        </div>

        {/* Privacy */}
        <AccordionItem title={t('privacy.title')}>
          <p className="mb-3">
            <span dangerouslySetInnerHTML={{ __html: t('privacy.anonymous') }} />
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li>{t('privacy.responses')}</li>
            <li>{t('privacy.stats')}</li>
          </ul>
          <p>
            {t('privacy.noPersonalData')}{' '}
            <a href={`${wikipediaUrl}/wiki/${locale === 'fr' ? 'Règlement_général_sur_la_protection_des_données' : 'General_Data_Protection_Regulation'}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t('privacy.gdpr')}
            </a>.
          </p>
        </AccordionItem>

        {/* Choose version */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('chooseVersion.title')}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Short version */}
            <div className="group border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('chooseVersion.express.title')}</h3>
                <p className="text-3xl font-bold text-blue-600 mb-1">{t('chooseVersion.express.duration')}</p>
                <p className="text-sm text-gray-600">{t('chooseVersion.express.modules')}</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t('chooseVersion.express.feature1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t('chooseVersion.express.feature2')}</span>
                </li>
              </ul>
              <Link
                href={`/${locale}/test?reset=true`}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 text-center transform group-hover:scale-105"
              >
                {t('chooseVersion.express.start')}
              </Link>
            </div>

            {/* Full version */}
            <div className="group border-2 border-blue-500 rounded-xl p-6 hover:border-blue-600 hover:shadow-2xl transition-all duration-300 cursor-pointer relative transform hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                {t('chooseVersion.full.recommended')}
              </div>
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('chooseVersion.full.title')}</h3>
                <p className="text-3xl font-bold text-blue-600 mb-1">{t('chooseVersion.full.duration')}</p>
                <p className="text-sm text-gray-600">{t('chooseVersion.full.modules')}</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t('chooseVersion.full.feature1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t('chooseVersion.full.feature2')}</span>
                </li>
              </ul>
              <Link
                href={`/${locale}/test?reset=true&version=full`}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 text-center transform group-hover:scale-105 shadow-lg"
              >
                {t('chooseVersion.full.start')}
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('chooseVersion.tip')} <strong>{t('chooseVersion.tipText')}</strong>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            {t('footer')}
          </p>
        </div>
      </div>
    </div>
  );
}
