'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLocale = (params?.locale as string) || 'en';

  const switchLocale = (newLocale: 'fr' | 'en') => {
    if (newLocale === currentLocale) return;

    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1">
        <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400 ml-2" />
        <button className="px-3 py-1.5 rounded text-sm font-medium text-gray-600 dark:text-gray-400">
          FR
        </button>
        <button className="px-3 py-1.5 rounded text-sm font-medium text-gray-600 dark:text-gray-400">
          EN
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1">
      <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400 ml-2" />
      <button
        onClick={() => switchLocale('fr')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          currentLocale === 'fr'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
        aria-label="Switch to French"
      >
        FR
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          currentLocale === 'en'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
