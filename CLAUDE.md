# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` (alias `npm start`) — Astro dev server on http://localhost:4321. Keystatic admin is mounted at `/keystatic` and uses local-filesystem storage in dev.
- `npm run build` — produces a static site in `dist/` via the Vercel adapter.
- `npm run preview` — serves the built output locally.
- `npm run astro -- <cmd>` — pass-through to the Astro CLI (e.g. `astro check` for type-checking).
- No test runner or `lint` script is configured. ESLint can be invoked manually (`npx eslint .`) using the flat config in `eslint.config.js`, but it only covers `**/*.{ts,tsx}` and ignores `dist`.
- `.npmrc` sets `legacy-peer-deps=true`. Keep it; the React 18 / Astro 5 / Keystatic dependency graph relies on this to install.

## Architecture

This is an **Astro 5 static site** (output: `static`, adapter: `@astrojs/vercel`) with two React "islands" and a Keystatic-managed Markdown blog. Despite `package.json` being named `vite-react-typescript-starter` and the `src_backup/` directory still containing the original Vite scaffold, the live app is fully Astro — ignore `src_backup/` unless intentionally porting something back.

### Content pipeline (the part most easy to break)

The blog has **two parallel schemas that must stay in sync**:

1. **`keystatic.config.ts`** — drives the CMS UI. Storage is `{ kind: 'local' }` in dev and `{ kind: 'github', repo: 'Salah-XD/personal-portfolio' }` in prod, so authoring in production commits directly to GitHub via the Keystatic GitHub App.
2. **`src/content.config.ts`** — Astro content-collection schema (Zod) used at build time to read `src/content/blog/**/*.md`. Loaded via `glob({ pattern: "**/*.md", base: "./src/content/blog" })`.

When adding or renaming a field, edit **both** files. The Zod schema validates at build; mismatches surface as build failures rather than runtime errors.

Both schemas now glob `**/*.{md,mdoc}` and the `@astrojs/markdoc` integration is wired in. The Keystatic markdoc field has its image asset path configured to `public/images/blog/`. If you add new image-bearing posts via Keystatic in production, do a hard refresh on `/keystatic` first so the admin loads the latest config — otherwise images get dumped beside the `.mdoc` and break the build.

### Routing

- `src/pages/index.astro` → mounts `<Portfolio client:load />`.
- `src/pages/blog/index.astro` → reads `getCollection('blog')` at build time, maps it into `BlogList`'s expected shape, and mounts `<BlogList client:load />`.
- `src/pages/blog/[slug].astro` → `getStaticPaths()` over the blog collection. **Astro 5 uses `post.id` as the slug**, not `post.slug` — both files explicitly normalize on `id`. Don't reintroduce `post.slug` references.
- Keystatic's admin UI is wired in via the `keystatic()` integration in `astro.config.mjs`; routes live under `/keystatic` automatically.

### React islands

Top-level islands: `src/components/Portfolio.tsx` and `src/components/BlogList.tsx`. The blog post page (`src/pages/blog/[slug].astro`) hydrates several smaller islands: `ReadingProgress`, `TableOfContents`, `PostEngagement`, `Comments`, `SearchPalette`, `ThemeToggle`.

### Theming

Theme is `class="dark"` on `<html>`, set by an inline script in `src/layouts/Layout.astro` (FOUC-free). React state lives in `src/lib/theme.ts` (`useTheme()` hook). Both islands and the post page read the same source of truth, and the toggle persists in `localStorage` and broadcasts across tabs via a `themechange` event + `storage` listener. Components must use Tailwind `dark:` variants — do not reintroduce `isDark ?` ternaries.

### Motion

Lenis + GSAP are wired through `src/components/SmoothScroll.tsx` and `src/lib/gsap.ts`. Each island wraps its content in `<SmoothScroll>` (Lenis is per-island). `useEntranceAnimations` (in `src/lib/useEntranceAnimations.ts`) runs `gsap.context()` over `data-anim="…"` markers. All motion is gated behind `prefers-reduced-motion`. Do **not** combine GSAP ScrollTrigger with Astro's `<ClientRouter>` View Transitions — they conflict.

### API routes + serverless

`src/pages/api/likes/[slug].ts` and `src/pages/api/views/[slug].ts` use `export const prerender = false`. Astro 5 keeps `output: 'static'` and switches just those routes to Vercel Functions automatically — no global config flip. Both endpoints read Upstash Redis via `src/lib/redis.ts` and degrade gracefully (return `configured: false`) when env vars are missing.

### Required environment variables (production)

| Variable | Purpose | Source |
| -- | -- | -- |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Likes + view counters via Upstash Redis | Auto-set when you provision Upstash on Vercel Marketplace. `UPSTASH_REDIS_REST_*` aliases also work. |
| `PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY`, `PUBLIC_GISCUS_CATEGORY_ID` | Giscus comments | Generate via [giscus.app](https://giscus.app) after enabling Discussions on the repo. |
| `KEYSTATIC_SECRET` | Keystatic admin OAuth | 32+ chars. Already present. |

If any group is missing the dependent feature shows a placeholder card; the rest of the site still builds and runs.

### OG images + RSS + sitemap + search

- `src/pages/og/[slug].png.ts` (per-post) and `src/pages/og-default.png.ts` render terminal-themed OG cards via satori + resvg at build time. Both read TTF files from `public/fonts/` via `process.cwd()` — keep the fonts checked in.
- `src/pages/rss.xml.ts` produces the RSS feed (submit to daily.dev once the site has a few posts).
- `@astrojs/sitemap` writes `dist/client/sitemap-index.xml` automatically. Filter excludes `/keystatic` and `/og/`.
- `astro-pagefind` indexes the site after build (the `[data-pagefind-body]` attribute on the article scopes search to post content). The `SearchPalette` component dynamically imports `/pagefind/pagefind.js` via `new Function('p','return import(p)')` because Vite's static analysis would otherwise fail the build.

### Styling

Tailwind v3 is wired through `@astrojs/tailwind` with `@tailwindcss/typography` for `prose` styles in rendered blog posts. `tailwind.config.js` is the source of truth; `src/index.css` is imported once from `Layout.astro`. `package.json` also lists `@tailwindcss/vite` v4 as a leftover — the build does not use it; if you touch Tailwind config, stay on v3 conventions.

### TypeScript

Root `tsconfig.json` extends `astro/tsconfigs/strict` with `jsx: "react-jsx"`. The `tsconfig.app.json` / `tsconfig.node.json` files are vestigial from the Vite scaffold and are not referenced by the Astro build — don't add new path aliases there expecting them to take effect.

## Deployment

Deployed to Vercel via `@astrojs/vercel` (static output). The `.vercel/` directory holds the link to the project. Production builds happen on Vercel's side via `npm run build`; no custom `vercel.json`/`vercel.ts` is present — keep build settings in `astro.config.mjs`.
