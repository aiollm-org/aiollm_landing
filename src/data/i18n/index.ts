import 'server-only';
import type { Locale } from '@/lib/locale';

export async function getDictionary(locale: Locale) {
  return locale === 'ru'
    ? (await import('./ru')).ru
    : (await import('./en')).en;
}
