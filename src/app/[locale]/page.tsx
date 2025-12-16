import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ChevronDown, BookOpen, Clock, BarChart3, CheckCircle } from 'lucide-react';
import { AccordionItem } from '@/components/AccordionItem';
import { StartTestButton } from '@/components/StartTestButton';

export default function Home({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = useTranslations('home');

  // Wikipedia base URL based on locale
  const wikipediaUrl = locale === 'fr' ? 'https://fr.wikipedia.org' : 'https://en.wikipedia.org';

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/30 transition-colors">
      {/* Simplified background elements - removed blur-3xl */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 dark:from-blue-600/5 dark:to-purple-600/5 rounded-full opacity-50"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-indigo-400/10 to-cyan-400/10 dark:from-indigo-600/5 dark:to-cyan-600/5 rounded-full opacity-50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Header - Hero Section */}
        <div className="text-center mb-16 sm:mb-20 animate-fade-in-up">
          <div className="relative inline-block mb-8 px-4" style={{ paddingBottom: '2rem' }}>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight"
              style={{
                lineHeight: '1.5',
                paddingBottom: '1rem',
              }}
            >
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                {t('title')}
              </span>
            </h1>

            {/* Simplified glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-indigo-400/10 blur-2xl -z-10 opacity-60" />
          </div>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            {t('subtitle')}
          </p>

          {/* Key Features with Icons - Simplified */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10">
            <div className="group relative flex items-center gap-3 bg-white/70 dark:bg-gray-800/70 px-6 py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/50 hover:-translate-y-1">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t('duration')}</span>
            </div>
            <div className="group relative flex items-center gap-3 bg-white/70 dark:bg-gray-800/70 px-6 py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/50 hover:-translate-y-1">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t('detailedFeedback')}</span>
            </div>
            <div className="group relative flex items-center gap-3 bg-white/70 dark:bg-gray-800/70 px-6 py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/50 hover:-translate-y-1">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t('scientificallyValidated')}</span>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <CheckCircle className="w-4 h-4" />
              {t('features.free')}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <CheckCircle className="w-4 h-4" />
              {t('features.openSource')}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <CheckCircle className="w-4 h-4" />
              {t('features.anonymous')}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <CheckCircle className="w-4 h-4" />
              {t('features.publicInterest')}
            </span>
          </div>

          <div className="mt-6">
            <a
              href="https://github.com/Romain-Deleglise/rationality-test"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white rounded-full hover:shadow-lg transition-all duration-300 text-sm font-semibold group hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="group-hover:underline">{t('viewSource')}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Intro Card - Simplified */}
        <div className="relative bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl p-8 sm:p-10 mb-12 border border-white/50 dark:border-gray-700/50 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-600/10 dark:to-purple-600/10 rounded-full -z-0"></div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              {t('whatIsRationality.title')}
            </h2>
            <div className="space-y-4 text-sm sm:text-base">
              <p
                className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify"
                dangerouslySetInnerHTML={{ __html: t('whatIsRationality.intro') }}
              />
              <p
                className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify"
                dangerouslySetInnerHTML={{ __html: t('whatIsRationality.improvable') }}
              />
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                {t('whatIsRationality.testDescription')}{' '}
                <a href={locale === 'fr' ? 'https://fr.wikipedia.org/wiki/Biais_cognitif' : 'https://en.wikipedia.org/wiki/Cognitive_bias'} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 transition-colors font-medium">
                  {t('whatIsRationality.cognitiveBiases')}
                </a>
                {t('whatIsRationality.andUpdating')}
              </p>
            </div>
          </div>
        </div>

        {/* What is tested */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-8">
            {t('whatIsTested.title')}
          </h2>

          <AccordionItem title={t('whatIsTested.probabilistic.title')}>
            <p className="mb-3">
              {t('whatIsTested.probabilistic.description')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>{t('whatIsTested.probabilistic.baseRateNeglect')}</strong> : {t('whatIsTested.probabilistic.baseRateDesc')}</li>
              <li><strong>{t('whatIsTested.probabilistic.gamblersFallacy')}</strong> : {t('whatIsTested.probabilistic.gamblersDesc')}</li>
              <li><strong>{t('whatIsTested.probabilistic.conjunctionFallacy')}</strong> : {t('whatIsTested.probabilistic.conjunctionDesc')} (

                <a href="https://en.wikipedia.org/wiki/Conjunction_fallacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
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
                <a href={locale === 'fr' ? 'https://fr.wikipedia.org/wiki/Réfutabilité' : 'https://en.wikipedia.org/wiki/Falsifiability'} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
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
              <a href="https://en.wikipedia.org/wiki/Cognitive_reflection_test" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                {t('whatIsTested.reflection.crt')}
              </a>.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <strong>{t('whatIsTested.reflection.exampleTitle')}</strong> {t('whatIsTested.reflection.exampleQuestion')}<br/>
              <span className="text-red-600 dark:text-red-400">{t('whatIsTested.reflection.intuitiveAnswer')}</span><br/>
              <span className="text-green-600 dark:text-green-400">{t('whatIsTested.reflection.correctAnswer')}</span>
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
        <div className="relative bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-purple-50/80 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/30 rounded-3xl p-8 sm:p-10 mb-12 border border-blue-200/50 dark:border-blue-800/50 shadow-xl overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/20 dark:bg-blue-600/10 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/20 dark:bg-purple-600/10 rounded-full"></div>

          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              {t('foundations.title')}
            </h3>
            <div className="space-y-4 text-sm sm:text-base">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                {t('foundations.cart')}{' '}
                <a href="https://mitpress.mit.edu/9780262034845/the-rationality-quotient/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 transition-colors font-semibold">
                  {t('foundations.cartFull')}
                </a>{' '}
                {t('foundations.developedBy')}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                {t('foundations.researchBased')}{' '}
                <a href={`${wikipediaUrl}/wiki/Daniel_Kahneman`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 transition-colors font-semibold">
                  {t('foundations.kahneman')}
                </a>{' '}
                {t('foundations.nobel')}
              </p>

              {/* Key References Section */}
              <div className="mt-6 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {t('foundations.keyReferences')}
                </h4>
                <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <li>{t('foundations.ref1')}</li>
                  <li>{t('foundations.ref2')}</li>
                  <li>{t('foundations.ref3')}</li>
                  <li>{t('foundations.ref4')}</li>
                </ul>
              </div>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 italic text-justify bg-white/40 dark:bg-gray-900/40 p-4 rounded-xl border-l-4 border-blue-500">
                {t('foundations.disclaimer')}
              </p>
            </div>
          </div>
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
            <a href={`${wikipediaUrl}/wiki/${locale === 'fr' ? 'Règlement_général_sur_la_protection_des_données' : 'General_Data_Protection_Regulation'}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              {t('privacy.gdpr')}
            </a>.
          </p>
        </AccordionItem>

        {/* Choose version */}
        <div className="relative bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-2xl p-8 sm:p-12 overflow-hidden border border-white/50 dark:border-gray-700/50">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 dark:from-blue-600/10 dark:via-indigo-600/10 dark:to-purple-600/10 rounded-full"></div>

          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-center mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {t('chooseVersion.title')}
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mt-10 items-stretch">
              {/* Short version */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-600/20 dark:to-cyan-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-white/90 dark:bg-gray-900/90 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-5 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  <div className="text-center mb-5">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl mb-3 shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">{t('chooseVersion.express.title')}</h3>
                    <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-1">{t('chooseVersion.express.duration')}</p>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('chooseVersion.express.modules')}</p>
                  </div>
                  <ul className="space-y-2 mb-6 flex-grow">
                    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">{t('chooseVersion.express.feature1')}</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">{t('chooseVersion.express.feature2')}</span>
                    </li>
                  </ul>
                  <StartTestButton version="express" locale={locale} />
                </div>
              </div>

              {/* Full version */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 dark:from-indigo-600/20 dark:to-violet-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-white/90 dark:bg-gray-900/90 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-5 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Badge Recommandé */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {t('chooseVersion.full.recommended')}
                  </div>
                  <div className="text-center mb-5">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl mb-3 shadow-lg">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">{t('chooseVersion.full.title')}</h3>
                    <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent mb-1">{t('chooseVersion.full.duration')}</p>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('chooseVersion.full.modules')}</p>
                  </div>
                  <ul className="space-y-2 mb-6 flex-grow">
                    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">{t('chooseVersion.full.feature1')}</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">{t('chooseVersion.full.feature2')}</span>
                    </li>
                  </ul>
                  <StartTestButton version="full" locale={locale} />
                </div>
              </div>
            </div>

            <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-8 bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl">
              {t('chooseVersion.tip')} <strong className="text-gray-900 dark:text-gray-100">{t('chooseVersion.tipText')}</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 sm:mt-20 pb-8">
          <div className="bg-white/40 dark:bg-gray-800/40 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3">
              {t('footer')}
            </p>
            <Link
              href="/legal"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors group"
            >
              <span className="group-hover:underline">{locale === 'fr' ? 'Mentions légales' : 'Legal Notice'}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
