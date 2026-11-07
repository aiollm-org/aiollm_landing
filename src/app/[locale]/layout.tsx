import type { Viewport } from 'next';
import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { MotionProvider } from '@/components/MotionProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { parseTheme, themeCookieName } from '@/lib/theme';
import { getSiteMetadata } from '@/lib/seo';
import { getDictionary } from '@/data/i18n';
import { isLocale } from '@/lib/locale';
import { notFound } from 'next/navigation';
import { WebVitals } from '@/components/WebVitals';
import '@fontsource-variable/sora';
import '@fontsource-variable/ibm-plex-sans';
import '@fontsource-variable/jetbrains-mono';
import '../../styles.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return getSiteMetadata(locale, await getDictionary(locale));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const theme = parseTheme((await cookies()).get(themeCookieName)?.value);
  return (
    <html lang={locale} data-theme={theme}>
      <body>
        <WebVitals />
        <ThemeProvider initialTheme={theme}>
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
