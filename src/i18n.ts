import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Locale is always provided by next-intl middleware
  const currentLocale = locale || 'fr';

  return {
    locale: currentLocale,
    messages: (await import(`../messages/${currentLocale}.json`)).default
  };
});
