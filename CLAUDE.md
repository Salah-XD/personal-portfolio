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

Note that `keystatic.config.ts` also accepts `.mdoc` (Markdoc) via `fields.markdoc`, but `content.config.ts` only globs `*.md`. Markdoc files (e.g. `src/content/blog/test.mdoc`) will not be picked up by the Astro collection without adding the pattern and Markdoc integration.

### Routing

- `src/pages/index.astro` → mounts `<Portfolio client:load />`.
- `src/pages/blog/index.astro` → reads `getCollection('blog')` at build time, maps it into `BlogList`'s expected shape, and mounts `<BlogList client:load />`.
- `src/pages/blog/[slug].astro` → `getStaticPaths()` over the blog collection. **Astro 5 uses `post.id` as the slug**, not `post.slug` — both files explicitly normalize on `id`. Don't reintroduce `post.slug` references.
- Keystatic's admin UI is wired in via the `keystatic()` integration in `astro.config.mjs`; routes live under `/keystatic` automatically.

### React islands

`src/components/Portfolio.tsx` and `src/components/BlogList.tsx` are the only interactive components. Both manage their own dark-mode state locally (no shared theme provider), and the site visually defaults to dark — `Layout.astro` does not yet have an FOUC-prevention script (there is a placeholder comment for one).

### Styling

Tailwind v3 is wired through `@astrojs/tailwind` with `@tailwindcss/typography` for `prose` styles in rendered blog posts. `tailwind.config.js` is the source of truth; `src/index.css` is imported once from `Layout.astro`. `package.json` also lists `@tailwindcss/vite` v4 as a leftover — the build does not use it; if you touch Tailwind config, stay on v3 conventions.

### TypeScript

Root `tsconfig.json` extends `astro/tsconfigs/strict` with `jsx: "react-jsx"`. The `tsconfig.app.json` / `tsconfig.node.json` files are vestigial from the Vite scaffold and are not referenced by the Astro build — don't add new path aliases there expecting them to take effect.

## Deployment

Deployed to Vercel via `@astrojs/vercel` (static output). The `.vercel/` directory holds the link to the project. Production builds happen on Vercel's side via `npm run build`; no custom `vercel.json`/`vercel.ts` is present — keep build settings in `astro.config.mjs`.
