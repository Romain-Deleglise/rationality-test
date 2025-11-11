// Middleware i18n temporairement désactivé
// Sera réactivé une fois l'app restructurée avec [locale]

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pass through all requests for now
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*'
};

/*
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localeDetection: true,
});

export const config = {
  matcher: ['/', '/(fr|en)/:path*']
};
*/
