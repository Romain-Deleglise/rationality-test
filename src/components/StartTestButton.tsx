'use client';

import Link from 'next/link';
import { track } from '@vercel/analytics';
import { useTranslations } from 'next-intl';

export function StartTestButton({
  version,
  locale,
}: {
  version: 'express' | 'full';
  locale: string;
}) {
  const t = useTranslations('home');

  const handleClick = () => {
    track('test_started', { version, locale });
  };

  const href = version === 'express'
    ? `/${locale}/test?reset=true`
    : `/${locale}/test?reset=true&version=full`;

  const className = version === 'express'
    ? "block w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-500 dark:to-cyan-500 dark:hover:from-blue-600 dark:hover:to-cyan-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
    : "block w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 dark:from-indigo-500 dark:to-violet-500 dark:hover:from-indigo-600 dark:hover:to-violet-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]";

  const label = version === 'express'
    ? t('chooseVersion.express.start')
    : t('chooseVersion.full.start');

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
    >
      {label}
    </Link>
  );
}
