'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookOpen, AlertCircle, TrendingUp, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MethodologyPage() {
  const t = useTranslations('methodology');
  const params = useParams();
  const locale = (params.locale as string) || 'fr';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>

        {/* CART Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            {t('cartSection.title')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-justify">
            {t('cartSection.description')}
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            {t('cartSection.purpose')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-justify">
            {t('cartSection.purposeText')}
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            {t('cartSection.components')}
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>{t('cartSection.component1')}</li>
            <li>{t('cartSection.component2')}</li>
            <li>{t('cartSection.component3')}</li>
            <li>{t('cartSection.component4')}</li>
          </ul>
        </div>

        {/* Validation Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            {t('validationSection.title')}
          </h2>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-3">
            {t('validationSection.psychometric')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-justify">
            {t('validationSection.psychometricText')}
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-3">
            {t('validationSection.independence')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-justify">
            {t('validationSection.independenceText')}
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-3">
            {t('validationSection.realWorld')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
            {t('validationSection.realWorldText')}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>{t('validationSection.outcome1')}</li>
            <li>{t('validationSection.outcome2')}</li>
            <li>{t('validationSection.outcome3')}</li>
            <li>{t('validationSection.outcome4')}</li>
          </ul>
        </div>

        {/* Adaptation Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('adaptationSection.title')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
            {t('adaptationSection.description')}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li>{t('adaptationSection.item1')}</li>
            <li>{t('adaptationSection.item2')}</li>
            <li>{t('adaptationSection.item3')}</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-3">
            {t('adaptationSection.differences')}
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>{t('adaptationSection.difference1')}</li>
            <li>{t('adaptationSection.difference2')}</li>
            <li>{t('adaptationSection.difference3')}</li>
            <li>{t('adaptationSection.difference4')}</li>
          </ul>
        </div>

        {/* Limitations Section */}
        <div className="bg-yellow-50 dark:bg-gray-800 border-2 border-yellow-400 dark:border-yellow-600 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            {t('limitationsSection.title')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 font-semibold mb-4">
            {t('limitationsSection.important')}
          </p>

          {['limitation1', 'limitation2', 'limitation3', 'limitation4', 'limitation5'].map((key, index) => (
            <div key={key} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {index + 1}. {t(`limitationsSection.${key}`)}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                {t(`limitationsSection.${key}Text`)}
              </p>
            </div>
          ))}
        </div>

        {/* Improvement Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            {t('improvementSection.title')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 font-semibold mb-4">
            {t('improvementSection.answer')}
          </p>

          {['method1', 'method2', 'method3'].map((key) => (
            <div key={key} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                ✓ {t(`improvementSection.${key}`)}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                {t(`improvementSection.${key}Text`)}
              </p>
            </div>
          ))}

          <div className="mt-6 bg-blue-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('improvementSection.realistic')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
              {t('improvementSection.realisticText')}
            </p>
          </div>
        </div>

        {/* References Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('referencesSection.title')}
          </h2>
          <ol className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-gray-300 text-sm">
            <li>{t('referencesSection.ref1')}</li>
            <li>{t('referencesSection.ref2')}</li>
            <li>{t('referencesSection.ref3')}</li>
            <li>{t('referencesSection.ref4')}</li>
            <li>{t('referencesSection.ref5')}</li>
          </ol>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={`/${locale}/test?reset=true`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg"
          >
            {locale === 'fr' ? 'Passer le test' : 'Take the Test'} →
          </Link>
        </div>
      </div>
    </div>
  );
}
