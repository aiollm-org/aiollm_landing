import type { MetadataRoute } from 'next';
import { locales, localeUrl } from '@/lib/locale';
import { languageAlternates } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: localeUrl(locale),
    alternates: { languages: languageAlternates },
  }));
}
