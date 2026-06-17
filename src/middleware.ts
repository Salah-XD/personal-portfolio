import { defineMiddleware } from 'astro:middleware';

// Keystatic builds the GitHub OAuth `redirect_uri` from the incoming request's
// origin (`new URL(context.request.url).origin`). On proxy-based hosts — Vercel,
// Netlify, Cloudflare Pages, Fly.io, Render, etc. — the serverless function sees
// the request host as `localhost`, so Keystatic generates
// `redirect_uri=https://localhost/api/keystatic/github/oauth/callback`, which
// GitHub rejects with "The redirect_uri is not associated with this application."
//
// The real public host/protocol arrive on the `x-forwarded-*` headers. Rewrite
// the request URL from them before Keystatic's handler reads it. Keystatic reads
// `context.request` (not `context.url`), and a Request's URL is immutable, so we
// swap in a clone pointed at the corrected origin. Both `request` and `url` are
// plain, writable fields on the APIContext that the endpoint handler receives, so
// the assignment propagates through. Scoped to Keystatic's GitHub routes, and a
// no-op in local dev where the forwarded headers are absent.
//
// Temporary workaround for https://github.com/Thinkmill/keystatic/issues/1022 —
// remove once Keystatic respects forwarded headers upstream.
export const onRequest = defineMiddleware((context, next) => {
  if (context.url.pathname.startsWith('/api/keystatic/github/')) {
    const forwardedHost = context.request.headers.get('x-forwarded-host');
    const forwardedProto = context.request.headers.get('x-forwarded-proto');

    if (forwardedHost) {
      const correctedUrl = new URL(context.url);
      correctedUrl.host = forwardedHost;
      if (forwardedProto) correctedUrl.protocol = forwardedProto;

      context.request = new Request(correctedUrl, context.request);
      context.url = correctedUrl;
    }
  }

  return next();
});
