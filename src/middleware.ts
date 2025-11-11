import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Liste des locales supportées
  locales: ['fr', 'en'],

  // Locale par défaut
  defaultLocale: 'fr',

  // Détection automatique de la langue basée sur Accept-Language
  localeDetection: true,
});

export const config = {
  // Matcher pour toutes les routes sauf les fichiers statiques et API
  matcher: ['/', '/(fr|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
