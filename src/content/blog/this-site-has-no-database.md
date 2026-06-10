---
title: "This site has a CMS, comments, and view counts. I don't run a database."
date: "2026-06-06"
excerpt: "A blog with a full CMS, real comments, and live view counters — and not one piece of infrastructure I have to operate. Here's where the state actually lives."
readTime: "7 min read"
tags: ["Astro", "Architecture", "Serverless", "JAMstack"]
category: "Engineering"
author: "Mohd Salahudeen"
authorBio: "Founder, software engineer & founder of QSat"
---

Someone poked around this site — the blog, the admin panel at `/keystatic`, the little like button, the view counter ticking up on each post — and asked me what I was running for a backend.

The honest answer is: nothing I run.

There's no server I deploy. No database I provisioned. No migration I've ever written, no connection pool to tune, no 3am page when the disk fills up. The whole thing builds to static files and sits on a CDN. And yet every piece of state you can touch on this site is saved somewhere durable.

I didn't make the state go away. I scattered it across services that each already own their slice of it perfectly — and let them do the operating.

## The CMS is just git

The blog runs on [Keystatic](https://keystatic.com/). When I open `/keystatic` in production and hit save, it doesn't write to a database. It opens a commit against this repo through a GitHub App:

```ts
// keystatic.config.ts
storage: import.meta.env.DEV
  ? { kind: 'local' }
  : { kind: 'github', repo: 'Salah-XD/personal-portfolio' },
```

In dev it writes Markdoc files to my local filesystem. In production it commits them straight to GitHub. The post you're reading is a `.md` file in `src/content/blog/`. My `/now` page and my `/uses` page are JSON files in the same repo, edited through the same admin UI.

So my "content database" is the git history. Publishing is a commit. Editing is a commit. Rolling back a typo is `git revert`. Vercel sees the push and rebuilds. There is genuinely nothing else — the version control I was going to use anyway *is* the storage layer, and it gives me diffs, blame, and backups for free.

The one thing to know: writes are slow in the way a deploy is slow. Saving a post kicks off a rebuild, so "publish" takes a minute, not a millisecond. For a blog, that's not a cost. It's the whole point.

## The comments are GitHub Discussions wearing a costume

The comment box at the bottom of each post is [Giscus](https://giscus.app/), which is a thin, lovely shell over **GitHub Discussions**. Each post maps to a Discussion thread in the repo. When you comment, you're posting to GitHub, signed in as your GitHub account.

That means my "comments table" is a Discussions tab I never look at, my spam protection is GitHub's, and my auth is OAuth I didn't build. If the env vars aren't wired, the component just renders a dashed placeholder instead of breaking:

```astro
{giscusReady ? (
  <Comments ... />
) : (
  <p>Comments will appear here once Giscus is configured.</p>
)}
```

Zero moderation infrastructure. Zero accounts to store. The trade-off is real and I'm fine with it: you need a GitHub account to comment, so my audience — developers — can, and everyone else can't. For this blog, that filter is a feature.

## Okay, here's the part where I'm lying a little

If you've read this far you've earned the caveat: there *is* one piece of genuinely mutable, server-side state. Likes and views.

You can't count a view at build time — it happens when a human shows up. So those two features hit [Upstash Redis](https://upstash.com/) through the only two routes on the whole site that aren't static:

```ts
export const prerender = false; // this route becomes a Vercel Function

const count = await redis.incr(`likes:${slug}`);
```

That's the entire data model. Two integer keys per post — `likes:slug` and `views:slug` — and the operation is `INCR`. No schema, no ORM, no tables. Deduping is a cookie, not a database query: a 30-minute cookie for views, a one-year cookie for likes.

And the whole Redis layer is optional. If the keys aren't set, it falls through instead of crashing:

```ts
// lib/redis.ts
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

let _redis: Redis | null = null;
if (url && token) _redis = new Redis({ url, token });

export const redis = _redis;
export const isRedisConfigured = _redis !== null;
```

So yes — pedantically, "no backend" is false. There are two serverless functions and a managed key-value store. But Upstash speaks HTTP and bills per request, so there's no connection to hold open and nothing idling between visitors. I provisioned it by clicking a button. I have never operated it. That's a very different thing from "running a database."

## Everything else happens before anyone visits

The rest of what looks dynamic is just work done at build time:

- **Search** is [Pagefind](https://pagefind.app/) — it indexes the built HTML after the build and ships a static index the browser queries. No search server.
- **The OG image** on every post is rendered with satori + resvg during the build. No screenshot service.
- **RSS and the sitemap** are generated files.

When a request comes in, almost none of this runs. It already ran, once, on my machine and on Vercel's.

## The trade-offs I actually signed up for

This isn't free. I traded away things, on purpose:

- **No instant writes.** Publishing is a deploy. Fine for a blog, fatal for a chat app.
- **No joins, no queries.** I can `INCR` a counter. I cannot ask "which posts did users who liked X also read." If I needed that, Redis wouldn't be the answer.
- **Vendor surface area.** Instead of one database I run, I depend on git/GitHub, Upstash, and Buttondown for the newsletter. The bet is that each of them operates their slice better than I'd operate all of it — and that if any one disappears, I'm only swapping out one small, well-isolated piece.

## When I'd throw this whole approach out

The moment this site needs user accounts, per-user data, anything transactional, or a write that has to be visible in the same second — I'd reach for an actual database without hesitation. This architecture works *because* a personal blog is read-heavy, write-rare, and has exactly one author.

But that describes most content sites. And for those, the most maintainable backend is the one you never have to think about again after you set it up. Mine's been running on a rebuild and an `INCR` ever since.
