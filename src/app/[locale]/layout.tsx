import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const locales = ['en', 'fr'] as const;
type Locale = 'fr' | 'en';

const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://rationality-test.com';

// Dynamic metadata based on locale
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const metadata = {
    en: {
      title: 'Rationality Test | CART Adapted',
      description: 'Assess your critical thinking and identify your cognitive biases with this scientifically validated rationality test based on CART.',
      keywords: 'rationality test, cognitive biases, critical thinking, CART, cognitive reflection test, probabilistic reasoning',
    },
    fr: {
      title: 'Test de Rationalité | CART Adapté',
      description: 'Évaluez votre pensée critique et identifiez vos biais cognitifs avec ce test de rationalité scientifiquement validé basé sur le CART.',
      keywords: 'test de rationalité, biais cognitifs, pensée critique, CART, test de réflexion cognitive, raisonnement probabiliste',
    },
  };

  const currentMetadata = metadata[locale as keyof typeof metadata] || metadata.en;

  return {
    title: currentMetadata.title,
    description: currentMetadata.description,
    keywords: currentMetadata.keywords,
    icons: {
      icon: '/favicon.ico',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        fr: `${baseUrl}/fr`,
      },
    },
    openGraph: {
      title: currentMetadata.title,
      description: currentMetadata.description,
      url: `${baseUrl}/${locale}`,
      siteName: 'Rationality Test',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: currentMetadata.title,
      description: currentMetadata.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Fetch messages for the current locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {/* Language and theme controls - fixed bottom right */}
            <div className="fixed bottom-6 right-6 z-50 print:hidden flex gap-2 shadow-lg">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
