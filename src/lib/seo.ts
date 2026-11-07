import type { Metadata } from 'next';
import { project } from '@/data/project';
import { en, type Dictionary } from '@/data/i18n/en';
import { localeUrl, type Locale } from '@/lib/locale';

export const siteTitle = en.seo.title;
export const siteDescription = en.seo.description;
export const languageAlternates = {
  en: localeUrl('en'),
  ru: localeUrl('ru'),
  'x-default': localeUrl('en'),
};

// Production hosts can opt out before release; previews and development stay unindexed.
export const indexable =
  process.env.NODE_ENV === 'production' &&
  process.env.VERCEL_ENV !== 'preview' &&
  process.env.SITE_INDEXABLE !== 'false';

export function getSiteMetadata(locale: Locale, copy: Dictionary): Metadata {
  const url = localeUrl(locale);
  return {
    metadataBase: new URL(project.landing),
    title: copy.seo.title,
    description: copy.seo.description,
    applicationName: 'aiollm',
    category: 'developer tools',
    openGraph: {
      type: 'website',
      url,
      siteName: 'aiollm',
      title: copy.seo.title,
      description: copy.seo.description,
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      alternateLocale: [locale === 'ru' ? 'en_US' : 'ru_RU'],
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: copy.seo.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.seo.title,
      description: copy.seo.description,
      images: [
        {
          url: '/opengraph-image',
          alt: copy.seo.title,
        },
      ],
    },
    robots: { index: indexable, follow: true },
    alternates: { canonical: url, languages: languageAlternates },
  };
}

export function getLandingStructuredData(locale: Locale, copy: Dictionary) {
  const url = localeUrl(locale);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${project.landing}#website`,
        url: project.landing,
        name: 'aiollm',
        inLanguage: ['en', 'ru'],
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: copy.seo.title,
        description: copy.seo.description,
        inLanguage: locale,
        isPartOf: { '@id': `${project.landing}#website` },
        about: { '@id': `${project.landing}#software` },
        hasPart: { '@id': `${url}#faq` },
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': `${project.landing}#software`,
        name: 'aiollm',
        description: copy.seo.description,
        url: project.landing,
        codeRepository: project.repository,
        version: project.version,
        programmingLanguage: 'Python',
        runtimePlatform: `Python ${project.python}`,
        license: `${project.repository}/blob/master/LICENSE`,
        subjectOf: {
          '@type': 'WebPage',
          url: project.docs,
          name: copy.nav.documentation,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        isPartOf: { '@id': `${url}#webpage` },
        inLanguage: locale,
        mainEntity: copy.faq.items.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };
}

/** JSON inside a script must not be able to close the surrounding HTML tag. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
