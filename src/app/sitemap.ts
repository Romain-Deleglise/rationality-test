import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://rationality-test.com';
  const locales = ['en', 'fr'];
  const currentDate = new Date();

  // Generate entries for each locale
  const routes = ['', '/test', '/resultats'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach(route => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: currentDate,
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            fr: `${baseUrl}/fr${route}`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}
