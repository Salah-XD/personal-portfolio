# salahxd.dev — personal portfolio & blog

My personal site: a terminal-themed portfolio and blog built with **Astro 5**, with a full CMS, comments, likes, and view counters — and no database I operate. The architecture is the subject of the [first blog post](https://salahxd.dev/blog/this-site-has-no-database).

**Live:** [salahxd.dev](https://salahxd.dev)

This repo is open source. Fork it, learn from it, build your own — see [License](#license).

## Stack

| Piece | What's used |
| --- | --- |
| Framework | [Astro 5](https://astro.build) (static output) + two React islands |
| Styling | Tailwind CSS v3 + `@tailwindcss/typography` |
| CMS | [Keystatic](https://keystatic.com) — admin at `/keystatic`, commits content to this repo via the GitHub App |
| Comments | [Giscus](https://giscus.app) (GitHub Discussions) |
| Likes & views | [Upstash Redis](https://upstash.com) via two Vercel Functions (the only non-static routes) |
| Newsletter | [Buttondown](https://buttondown.com) |
| Search | [Pagefind](https://pagefind.app) — static index built post-build |
| OG images | satori + resvg, rendered at build time |
| Motion | Lenis + GSAP, gated behind `prefers-reduced-motion` |
| Hosting | Vercel (`@astrojs/vercel`) |


## Getting started

```bash
git clone https://github.com/Salah-XD/personal-portfolio.git
cd personal-portfolio
npm install        # .npmrc sets legacy-peer-deps — keep it
npm run dev        # http://localhost:4321, Keystatic admin at /keystatic
```

Other commands:

```bash
npm run build      # static site → dist/
npm run preview    # serve the built output
npm run astro -- check   # type-check
```

## Environment variables

There are **no secrets in this repo** — everything sensitive lives in environment variables. Copy [`.env.example`](.env.example) to `.env` and fill in what you need. Every feature degrades gracefully: if a group of vars is missing, that feature renders a "not configured" placeholder and the rest of the site still builds and runs.

| Group | Variables | Powers |
| --- | --- | --- |
| Upstash Redis | `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Likes + view counters |
| Giscus | `PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY`, `PUBLIC_GISCUS_CATEGORY_ID` | Comments |
| Buttondown | `BUTTONDOWN_API_KEY` | Newsletter signup |
| Keystatic | `KEYSTATIC_SECRET` | Admin OAuth in production |

The `PUBLIC_`-prefixed Giscus values are intentionally public — they're read in the browser.

## Project structure

```
src/
  components/      React islands (Portfolio, BlogList, post widgets)
  content/blog/    Posts (Markdown/Markdoc, managed by Keystatic)
  layouts/         Layout.astro (theme script, SEO, JSON-LD)
  lib/             redis.ts, theme.ts, gsap helpers
  pages/
    api/           likes/views (Vercel Functions), subscribe
    blog/          index + [slug]
    og/            build-time OG image generation
keystatic.config.ts   CMS schema (must stay in sync with src/content.config.ts)
```

Two things worth knowing before editing:

- **The blog has two parallel schemas** — `keystatic.config.ts` (CMS UI) and `src/content.config.ts` (build-time Zod validation). Add or rename fields in **both**.
- **Astro 5 uses `post.id` as the slug**, not `post.slug`. The blog pages normalize on `id`.

More architecture detail is in [CLAUDE.md](CLAUDE.md).

## Forking this for your own site

1. Replace the content in `src/config/portfolio.ts`, `src/content/blog/`, and `src/content/` JSON singletons (now/uses pages).
2. Update `keystatic.config.ts` → `storage.repo` to point at *your* repo.
3. Generate your own Giscus config (requires Discussions enabled on your repo).
4. Provision Upstash + Buttondown if you want counters and the newsletter, or skip them — the site works without.

## License

[MIT](LICENSE) — do whatever you like with the code. The blog posts, images, and other written content are © Mohd Salahudeen; please don't republish those as your own.
