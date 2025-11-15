import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });

  return {
    title: t('title'),
    description: t('intellectualPropertyText'),
  };
}

export default function LegalPage() {
  const t = useTranslations('legal');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('lastUpdated')}
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              📜 {t('intellectualProperty')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('intellectualPropertyText')}
            </p>
          </section>

          {/* Disclaimer */}
          <section className="border-l-4 border-yellow-400 pl-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              ⚠️ {t('disclaimer')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              {t('disclaimerText')}
            </p>
          </section>

          {/* Usage */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              🎯 {t('usage')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t('usageText')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>{t('usageList.item1')}</li>
              <li>{t('usageList.item2')}</li>
              <li>{t('usageList.item3')}</li>
              <li>{t('usageList.item4')}</li>
            </ul>
          </section>

          {/* Methodology */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              🔬 {t('methodology')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t('methodologyText')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>{t('methodologyList.item1')}</li>
              <li>{t('methodologyList.item2')}</li>
              <li>{t('methodologyList.item3')}</li>
            </ul>
          </section>

          {/* Differences from CART */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              🔄 {t('differences')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t('differencesText')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>{t('differencesList.item1')}</li>
              <li>{t('differencesList.item2')}</li>
              <li>{t('differencesList.item3')}</li>
              <li>{t('differencesList.item4')}</li>
            </ul>
          </section>

          {/* License */}
          <section className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              ⚖️ {t('license')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t('licenseText')}
            </p>
            <a
              href="https://github.com/Romain-Deleglise/rationality-test"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              {t('licenseLink')} →
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {t('mitLicense')}
            </p>
          </section>

          {/* Data Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              🔒 {t('dataPrivacy')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t('dataPrivacyText')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mb-3">
              <li>{t('dataPrivacyList.item1')}</li>
              <li>{t('dataPrivacyList.item2')}</li>
              <li>{t('dataPrivacyList.item3')}</li>
            </ul>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              {t('dataPrivacyNote')}
            </p>
          </section>

          {/* No Warranty */}
          <section className="border-l-4 border-red-400 pl-4 bg-red-50 dark:bg-red-900/20 p-4 rounded">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              ⚠️ {t('noWarranty')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('noWarrantyText')}
            </p>
          </section>

          {/* Scientific References */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              📚 {t('scientificReferences')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t('scientificReferencesText')}
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• {t('references.ref1')}</li>
              <li>• {t('references.ref2')}</li>
              <li>• {t('references.ref3')}</li>
              <li>• {t('references.ref4')}</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              📧 {t('contact')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {t('contactText')}
            </p>
            <a
              href="https://github.com/Romain-Deleglise/rationality-test/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('githubIssues')} →
            </a>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← {t('title') === 'Legal Notice' ? 'Back to homepage' : 'Retour à l\'accueil'}
          </Link>
        </div>
      </div>
    </div>
  );
}
