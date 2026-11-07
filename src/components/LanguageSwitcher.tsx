import { localePath, type Locale } from '@/lib/locale';

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  return (
    <div className="language-switcher" role="group" aria-label={label}>
      {(['en', 'ru'] as const).map((language) => (
        <a
          key={language}
          href={localePath(language)}
          lang={language}
          hrefLang={language}
          aria-label={language === 'en' ? 'English' : 'Русский'}
          aria-current={locale === language ? 'page' : undefined}
        >
          {language.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
