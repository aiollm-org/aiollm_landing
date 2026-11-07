# Repository Guidelines

## Project Structure & Module Organization

This is the aiollm landing page, using Next.js App Router, React, TypeScript, Tailwind CSS, Motion, and shadcn/ui. The Python toolkit lives separately.

- `src/app/[locale]/` owns localized root layouts and page composition; `src/app/` also contains SEO routes and favicon.
- `src/sections/` contains the landing-page sections, rendered as Server Components unless interaction requires a client boundary.
- `src/components/` contains branding, navigation, highlighting, theme state, tabs, clipboard behavior, and motion effects.
- `src/components/ui/` contains owned shadcn/ui Button, Tabs, and DropdownMenu. `components.json` configures generation.
- `src/data/` stores Python examples, reviewed release metadata, source links, and FAQ copy.
- `src/data/i18n/` holds typed English/Russian dictionaries. Keep both complete; pass only needed labels to client controls.
- `src/styles.css` defines Tailwind tokens and specialized visuals; `src/assets/images/` holds logos and the SVG lattice.
- `tests/landing.spec.ts` exercises the production app. `.github/workflows/check.yml` runs the quality gate.

## Build, Test, and Development Commands

Use Node.js 22.12+ and npm; CI uses Node.js 24.

- `npm ci`: install the locked dependencies.
- `npm run dev`: start Next.js at localhost:3000.
- `npm run build`: build the application into `.next/`; the layout reads theme cookies at request time.
- `npm start`: serve the production build.
- `npx playwright install chromium`: install the test browser.
- `npm test`: test the existing production build; build first.
- `npm run test:dev`: check development hydration on port 3000.
- `npm run check`: check formatting, lint, build, types, and production/development behavior.
- `npm run format`: apply Prettier.

## Coding Style & Naming Conventions

Use two spaces, single quotes, PascalCase component files, camelCase variables, and kebab-case CSS hooks. Enforce strict TypeScript, Prettier, and Next.js ESLint rules.

Use Tailwind utilities and theme tokens. Default to Server Components; isolate state, browser APIs, and Motion in small client boundaries. Keep server content visible before hydration. Reuse shadcn/ui primitives and `@/` imports. Preserve keyboard navigation, themes, and reduced motion. Avoid CDN scripts and exposed API keys.

Production URLs live in `src/data/project.ts`: `aiollm.dev` for the landing page and `docs.aiollm.dev` for docs. Keep canonical, hreflang, JSON-LD, sitemap, and links consistent. Only advertise real routes/languages. Use `SITE_INDEXABLE=false` at build time for staging; see README.

English uses `/`, Russian `/ru`; `/en` redirects to `/`. Locale comes from the route. Preserve translated server HTML, `html lang`, native language links, technical identifiers, and upstream documentation paths.

## Testing Guidelines

Add behavior-focused `*.spec.ts` tests under `tests/`. Cover responsive layouts, saved/System themes, reduced motion, hydration, keyboard menus/tabs, clipboard failures, images, and layout bounds. Commands and code must wrap rather than scroll horizontally. Production tests block third-party requests; fonts are bundled CSS assets. Check copy against upstream sources listed in README. No coverage threshold is configured.

## Commit & Pull Request Guidelines

No commit convention is established. Use imperative subjects such as `Migrate code tabs to shadcn`. Describe behavior, link relevant issues, report checks, and attach screenshots for visual changes. Exclude `.next/`, generated reports, and `node_modules/`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
