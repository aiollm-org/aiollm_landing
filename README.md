# aiollm landing page

The landing page for [aiollm](https://github.com/GrehBan/aiollm), built with Next.js App Router, React, TypeScript, Tailwind CSS, Motion, and shadcn/ui.

## Development

Requires Node.js 22.12+ and npm. CI uses Node.js 24.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). The App Router entry points are `src/app/[locale]/layout.tsx` and `src/app/[locale]/page.tsx`. All ten sections, including the hero copy, are Server Components. Small client boundaries provide Motion, code tabs, the theme menu, and clipboard behavior. The layout reads a theme cookie, so Next.js renders the page on each request with the saved appearance already applied.

- `src/sections/`: the ten landing-page sections, including installation, shared generation, tools, checked streaming, and FAQ content.
- `src/components/`: branding, navigation, code display, theme state, decorative hero layers, and interactions.
- `src/components/ui/`: shadcn/ui Button, Tabs, and DropdownMenu from the official registry, styled for this page. Radix primitives supply keyboard and ARIA behavior.
- `src/data/examples.ts`: displayed Python snippets and install command.
- `src/data/project.ts`: reviewed release metadata, source links, provider field mappings, and FAQ copy.
- `src/data/i18n/`: typed English and Russian dictionaries, loaded on the server.
- `src/styles.css`: Tailwind theme tokens and specialized component visuals.
- `src/assets/images/`: supplied logos and decorative SVG; `src/app/icon.png` is the favicon.

Tailwind utilities own layout and spacing. Motion staggers the hero entrance and animates the code window and active tab indicator. Stronger blue/violet gradients move continuously across the hero, with a drifting lattice and shifting headline gradient; controls and cards have hover transitions. Native FAQ disclosures animate their height and opacity through `::details-content`, including closing, while preserving server-rendered answers and controls without JavaScript. Older browsers retain native disclosure behavior. All movement stops with `prefers-reduced-motion: reduce`, including an entrance already in progress. If your OS disables animations, the hero intentionally remains still.

The header appearance menu offers System, Dark, and Light. System follows the operating system through CSS media queries. Python panels have separate light and dark backgrounds, text, comment, and syntax palettes. Explicit choices override the system and persist for a year in the `aiollm-theme` cookie. The server and initial client render use the same validated value, avoiding a theme flash or hydration mismatch without suppressing warnings. A missing or invalid cookie falls back to System.

Fonts are bundled from Fontsource packages as CSS assets, with no generated font classes on the root element or Google Fonts requests during builds. Entrance effects begin after hydration. Commands and Python examples wrap instead of scrolling horizontally; the provider mapping becomes labeled cards on narrow screens.

## Validation

```sh
npx playwright install chromium
npm run check
```

The gate checks Prettier, Next.js ESLint rules, the production build, strict TypeScript, and Playwright tests. Tests cover desktop/mobile layouts, themes, reduced motion, server-rendered HTML, hydration, syntax highlighting, keyboard menus/tabs, FAQ controls, images, and clipboard success/failures. Appearance tests cover 320px, 768px, and 1440px layouts, saved theme cookies, invalid preferences, and moving/stopped backgrounds. Third-party requests are blocked during the main browser tests. The gate also tests development hydration with saved themes, both animation preferences, reloads, and rendering without JavaScript.

Next.js 16.4.5 generates unused imports in `.next/dev/types/validator.ts`; that generated file is excluded from standalone TypeScript checks. Source files retain strict unused checks, and `next build` validates route exports through the production validator. Revisit the exclusion when Next.js fixes its development generator.

```sh
npm run format
npm run lint
npm run typecheck
npm run test:dev
npm run build
npm start
```

`npm run test:dev` starts or reuses the development app on port 3000. It also requests the rendered server layout's source map through the absolute-filename endpoint used by browser DevTools, checking for a valid JSON map rather than only HTTP success. This endpoint check does not reproduce Firefox DevTools itself. `npm test` launches the already-built production app on port 4173; build first. `npm run preview` is an alias for the production server. Optionally set `PLAYWRIGHT_CHANNEL=msedge` to test with an installed Edge browser.

## shadcn/ui

`components.json` configures TypeScript, Server Components, the `@/` import alias, and the shared CSS file. Add components with:

```sh
npx shadcn@latest add <component>
```

Components are owned source code, so review generated changes and keep their theme tokens consistent with the page. `src/lib/utils.ts` provides class merging. Only add components the page uses.

## Production

Run `npm run build` followed by `npm start`, or deploy through a Next.js-compatible host. The production output is `.next/`; no Vite runtime or configuration remains. The current configuration uses the Next.js server, including image optimization, rather than a static-file export.

The Python snippets are displayed text and do not call provider APIs. Never embed provider API keys in client components or public configuration.

## Domains and SEO

`src/data/project.ts` owns the planned production URLs: [aiollm.dev](https://aiollm.dev/) for this landing page and [docs.aiollm.dev](https://docs.aiollm.dev/) for documentation. Local development stays on localhost; registration, DNS, and documentation hosting are separate deployment tasks. Documentation paths retain their existing guide/reference structure.

`src/lib/seo.ts` supplies localized Metadata API titles, descriptions, Open Graph/Twitter metadata, and escaped JSON-LD for the website, page, source code, and visible FAQ. `src/components/SocialImage.tsx` generates the shared brand card at `/opengraph-image`. Each language has its own canonical URL and reciprocal English/Russian/`x-default` hreflang links. Themes and tracking parameters share the language's canonical URL.

`/sitemap.xml` lists both landing routes with matching language alternates. Documentation needs its own metadata and sitemap on its separate host. `/robots.txt` allows production crawling and advertises the canonical sitemap. Development and Vercel previews disallow crawling and emit `noindex`; set `SITE_INDEXABLE=false` **before building** for other staging hosts or before launch. Rebuild without that setting when production should be indexed.

All headings, prose, links, FAQ answers, and the initial Python example are in server HTML. Native FAQ controls work without JavaScript. Python highlighting runs on the server and passes rendered samples into the interactive tabs. Motion starts after hydration; server markup has no hidden entrance state. Tests inspect the real DOM with JavaScript disabled, canonical/hreflang/JSON-LD, crawler routes, and the advertised social-image response, alongside the hydration and appearance checks.

## Languages

English lives at `/`; Russian lives at `/ru` ([local Russian page](http://localhost:3000/ru)). The header's EN/RU links work with JavaScript disabled. The URL determines the language, including on reload, and switching preserves the shared theme cookie. English remains the default; browser language does not redirect visitors automatically.

`next.config.ts` internally rewrites `/` to the English `[locale]` route and permanently redirects the `/en` alias back to `/`, preserving existing public URLs. Unsupported locales return 404. The root layout writes the correct `html lang` on the server.

Maintain both dictionaries in `src/data/i18n/`; Russian must satisfy the English dictionary's TypeScript shape. Pass only needed labels into client controls. Translation strings can wrap inline API names in backticks; `InlineCode` renders them as escaped React text/code. Keep code identifiers, install commands, and upstream documentation paths intact. Documentation links still lead to the upstream English documentation. IBM Plex Sans supplies bundled Cyrillic glyphs for Russian headings and prose.

`tests/i18n.spec.ts` covers translated server HTML, metadata/schema, both-way keyboard language switching, saved themes, clipboard messages, code captions, 320–1440px layouts, aliases, and unsupported locales.

## Core Web Vitals

`src/components/WebVitals.tsx` uses Next.js `useReportWebVitals` to report **LCP**, **INP**, and **CLS**. Open the browser console during development and filter for `[aiollm:web-vital]`. Metrics finalize on interaction or when the page becomes hidden, so click a control and switch tabs to see all three. LCP/INP values use milliseconds; CLS is unitless.

Every environment emits an `aiollm:web-vital` window event with `name`, `value`, `rating`, `delta`, `id`, and `navigationType`. A future analytics adapter can listen for this event. The page currently sends no analytics requests and stores no metrics; raw performance entries, element data, and navigation URLs are excluded from summaries.

Aim for LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1 at the 75th percentile of real visits ([Web Vitals guidance](https://web.dev/articles/vitals)). Local Playwright measurements validate reporting and expose samples as test attachments; they do not establish field scores or a production percentile. Server-rendered content, bundled fonts, sized images, server-side highlighting, and transform-based animation support these goals. Recheck on production mobile hardware and real traffic after launch.

## Dependency maintenance

A scoped npm override upgrades typescript-eslint's `minimatch` dependency to 11.0.1+ for [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249). Revisit it when upstream adopts a patched range; run the full gate and `npm audit` after dependency changes.

Setup references: [Next.js](https://nextjs.org/docs/app/getting-started/installation), [Tailwind for Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs), [Motion](https://motion.dev/docs/react-installation), and [shadcn/ui](https://ui.shadcn.com/docs/installation/next).

## Content sources

Reviewed on 2026-11-07 against aiollm **0.10.0**. Content is a maintained snapshot, not fetched from upstream at runtime.

- [README](https://github.com/GrehBan/aiollm#readme), [package metadata](https://github.com/GrehBan/aiollm/blob/master/src/aiollm/__meta__.py), and [release notes](https://grehban.github.io/aiollm/changelog/) establish the version, Python requirement, source installation, and pre-alpha status.
- [Shared generation](https://grehban.github.io/aiollm/guide/generation/) and [field mapping](https://grehban.github.io/aiollm/unification/) establish conversations, effort, structured output, reasoning summaries, and provider-specific limits. Structured output is JSON text, not a locally parsed Pydantic response.
- [Tools](https://grehban.github.io/aiollm/guide/tools/) establishes function tools, tool loops, and streamed tool calls; the 0.10.0 release notes establish the generated provider types.
- [Streaming](https://grehban.github.io/aiollm/guide/streaming/), [errors](https://grehban.github.io/aiollm/guide/errors/), and [uploads](https://grehban.github.io/aiollm/guide/uploads/) establish terminal checks, bounded retries, and one-shot source behavior.
- [Provider clients](https://grehban.github.io/aiollm/guide/providers/), [extending](https://grehban.github.io/aiollm/guide/extending/), and [design](https://grehban.github.io/aiollm/guide/design/) establish scope, session ownership, extension points, and limitations.

Refresh the README, package version, release notes, and relevant implementation together: older guide examples can predate a release. Update `project.ts` and the behavior tests together. Python examples are display snippets checked for syntax; browser tests do not execute provider calls or verify live models.
