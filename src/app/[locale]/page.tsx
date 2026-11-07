import { Header, Footer } from '@/components/SiteLayout';
import { Hero } from '@/sections/Hero';
import { Features } from '@/sections/Features';
import { RequestFlow } from '@/sections/RequestFlow';
import { Providers } from '@/sections/Providers';
import { Documentation } from '@/sections/Documentation';
import { GettingStarted } from '@/sections/GettingStarted';
import { SharedGeneration } from '@/sections/SharedGeneration';
import { Streaming } from '@/sections/Streaming';
import { Tools } from '@/sections/Tools';
import { FAQ } from '@/sections/FAQ';
import { getLandingStructuredData, serializeJsonLd } from '@/lib/seo';
import { getDictionary } from '@/data/i18n';
import { isLocale } from '@/lib/locale';
import { notFound } from 'next/navigation';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = await getDictionary(locale);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(getLandingStructuredData(locale, copy)),
        }}
      />
      <a className="skip-link" href="#top">
        {copy.nav.skip}
      </a>
      <Header locale={locale} copy={copy.nav} themeLabels={copy.theme} />
      <main id="top" tabIndex={-1}>
        <Hero copy={copy.hero} copyLabels={copy.copy} />
        <GettingStarted copy={copy.start} />
        <Features copy={copy.features} />
        <SharedGeneration copy={copy.generation} />
        <Tools copy={copy.tools} />
        <RequestFlow copy={copy.flow} />
        <Providers copy={copy.providers} />
        <Streaming copy={copy.streaming} />
        <Documentation copy={copy.documentation} />
        <FAQ copy={copy.faq} />
      </main>
      <Footer copy={copy.nav} />
    </>
  );
}
