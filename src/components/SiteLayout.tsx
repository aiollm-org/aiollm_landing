import type { Dictionary } from '@/data/i18n/en';
import type { Locale } from '@/lib/locale';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo, GitHubIcon } from './Brand';
import { project } from '@/data/project';
import { ThemeSwitcher } from './ThemeSwitcher';

export function Header({
  locale,
  copy,
  themeLabels,
}: {
  locale: Locale;
  copy: Dictionary['nav'];
  themeLabels: Dictionary['theme'];
}) {
  return (
    <header className="nav">
      <div className="wrap">
        <a
          className="brand flex shrink-0 items-center gap-2.5"
          href="#top"
          aria-label={copy.home}
        >
          <Logo />
        </a>
        <span className="pill">v{project.version}</span>
        <nav className="nav-links" aria-label={copy.main}>
          <a className="hide-sm" href="#getting-started">
            {copy.start}
          </a>
          <a className="hide-sm" href={`${project.docs}reference/`}>
            {copy.reference}
          </a>
          <a className="hide-sm" href={`${project.docs}changelog/`}>
            {copy.changelog}
          </a>
          <a className="nav-docs" href={project.docs}>
            {copy.docs}
          </a>
          <a
            className="gh inline-flex items-center gap-1.5"
            href="https://github.com/aiollm-org/aiollm"
            aria-label={copy.github}
          >
            <GitHubIcon />
            <span className="hide-sm">GitHub</span>
          </a>
          <LanguageSwitcher locale={locale} label={copy.language} />
          <ThemeSwitcher labels={themeLabels} />
        </nav>
      </div>
    </header>
  );
}

export function Footer({ copy }: { copy: Dictionary['nav'] }) {
  return (
    <footer>
      <div className="wrap">
        <a
          className="brand flex shrink-0 items-center gap-2.5"
          href="#top"
          aria-label={copy.back}
        >
          <Logo />
        </a>
        <nav aria-label={copy.footer}>
          <a href={project.docs}>{copy.documentation}</a>
          <a href={`${project.docs}reference/`}>{copy.apiReference}</a>
          <a href={`${project.docs}changelog/`}>{copy.changelog}</a>
          <a href={`${project.docs}contributing/`}>{copy.contributing}</a>
          <a href="https://github.com/aiollm-org/aiollm">GitHub</a>
        </nav>
        <small>
          aiollm {project.version} · {copy.license}
        </small>
      </div>
    </footer>
  );
}
