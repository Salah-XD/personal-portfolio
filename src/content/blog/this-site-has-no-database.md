---
title: "This Site Has No Database, But It Has a CMS, Comments, Likes, and Views"
date: "2026-06-06"
excerpt: "No server, no database, nothing for me to babysit — yet the likes save, the views count, and the comments are real. Here's where all of it actually goes."
readTime: "7 min read"
tags: ["Astro", "Architecture", "Serverless", "JAMstack"]
category: "Engineering"
author: "Mohd Salahudeen"
authorBio: "Founder, software engineer & founder of QSat"
---

The title isn't a trick. This site has a full CMS with an admin panel at `/keystatic`, real comments under every post, a like button that remembers you, and view counters that tick up. And there is no database behind any of it — at least, none that I run.

No server I deploy, no database I provisioned. I've never written a migration for this site, never tuned a connection pool, and there's no disk that can fill up at 3am and page me.

That last part was the whole design goal. I'm building a startup, and whatever attention I have left over is not going toward babysitting infrastructure for a personal blog. So I gave myself one rule when building this: if a feature needs me to *operate* something, it doesn't ship.

What surprised me is how little I had to give up. The whole thing builds to static files and sits on a CDN — but every piece of state you can touch here still gets saved somewhere durable. The state didn't disappear. I just stopped owning the places where it lands.

This is not a genius-architecture post. Most of it is me being lazy in a useful direction. But it works well enough that people ask about it, so here's how each piece fits together.

## The CMS is just git

The blog runs on [Keystatic](https://keystatic.com/). When I open `/keystatic` in production and hit save, it doesn't write to a database. It makes a commit to this repo through a GitHub App:

```ts
// keystatic.config.ts
storage: import.meta.env.DEV
  ? { kind: 'local' }
  : { kind: 'github', repo: 'Salah-XD/personal-portfolio' },
```

In dev it writes files to my local disk. In production it commits straight to GitHub. The post you're reading is a `.md` file in `src/content/blog/`. My `/now` and `/uses` pages are JSON files in the same repo, edited through the same admin UI.

So my "content database" is the git history. Publishing is a commit. Fixing a typo is a commit. Undoing a bad edit is `git revert`. Vercel sees the push and rebuilds. I get diffs, blame, and backups for free, from the version control I was going to use anyway.

The catch: writes are slow in the way a deploy is slow. Hitting save kicks off a rebuild, so "publish" takes about a minute. For a blog, I genuinely don't care. If that minute bothered me, this whole setup would be the wrong choice.

## The comments are GitHub Discussions in a trench coat

The comment box at the bottom of each post is [Giscus](https://giscus.app/), a thin shell over GitHub Discussions. Each post maps to a Discussion thread in the repo. When you comment, you're posting to GitHub, signed in as yourself.

So my "comments table" is a Discussions tab, my spam protection is GitHub's, and my auth is OAuth somebody else built. If the env vars aren't wired up, the component renders a placeholder instead of breaking:

```astro
{giscusReady ? (
  <Comments ... />
) : (
  <p>Comments will appear here once Giscus is configured.</p>
)}
```

There's a real downside here and I want to be upfront about it: you need a GitHub account to comment. For a blog where the readers are mostly developers, that filter costs me almost nothing and kills spam dead. If I were writing for a general audience, it would be a terrible choice.

## Okay, confession: the like button does touch a server

The likes and views from the title are the one kind of state on this site I couldn't fake at build time — a view happens when a person shows up, and there's no way around counting it live. So those two features hit [Upstash Redis](https://upstash.com/) through the only two routes on the site that aren't static:

```ts
export const prerender = false; // this route becomes a Vercel Function

const count = await redis.incr(`likes:${slug}`);
```

That's the entire data model. Two integer keys per post — `likes:slug` and `views:slug` — and the only operation is `INCR`. No schema, no ORM, no tables. Deduping is a cookie, not a query: 30 minutes for views, a year for likes. Someone clearing their cookies can like a post twice. I can live with that.

And the Redis layer is optional. If the keys aren't set, it degrades instead of crashing:

```ts
// lib/redis.ts
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

let _redis: Redis | null = null;
if (url && token) _redis = new Redis({ url, token });

export const redis = _redis;
export const isRedisConfigured = _redis !== null;
```

So yes — strictly speaking, "no backend" is false. There are two serverless functions and a managed key-value store. But Upstash speaks plain HTTP and bills per request, so there's nothing to keep alive between visitors. I provisioned it by clicking a button on a marketplace page. I have never operated it. That feels meaningfully different from "running a database," even if a pedant would disagree.

## Everything else happens before anyone visits

The rest of what looks dynamic is work done once, at build time:

- **Search** is [Pagefind](https://pagefind.app/) — it indexes the built HTML and ships a static index the browser queries. No search server.
- **The OG image** on every post is rendered with satori + resvg during the build. No screenshot service.
- **RSS and the sitemap** are just generated files.

When a request comes in, almost none of this code runs. It already ran, once, on my machine and on Vercel's build servers.

## What this actually costs me

None of this is free, it's just paid in a different currency:

- **No instant writes.** Publishing is a deploy. Fine for a blog, useless for anything interactive.
- **No queries.** I can increment a counter. I can't ask "which posts did people who liked X also read." If I ever want that, Redis with two keys per post isn't the answer.
- **More vendors, not fewer.** Instead of one database I run, I depend on GitHub, Upstash, Vercel, and Buttondown for the newsletter. My bet is that each of them runs their slice better than I'd run all of it — and if one of them dies or gets unbearable, I'm swapping one small piece, not migrating a monolith.

## When I'd throw this whole thing out

The moment this site needs user accounts, per-user data, anything transactional, or writes that have to show up in the same second — I'd set up a real database and not feel bad about it. This setup works *because* a personal blog is read-heavy, write-rare, and has exactly one author. Those are narrow conditions.

But they describe most personal sites and content sites. And for those, the best backend is the one you stop thinking about after the first week. Mine has been a rebuild and an `INCR` ever since, and I haven't thought about it once.
