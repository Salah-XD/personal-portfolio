import type { APIContext } from 'astro';
import { redis, isRedisConfigured } from '../../../lib/redis';

export const prerender = false;

const ALLOWED = new Set(['home', 'about']);
const KEY = (scope: string) => `visits:${scope}`;
const COOKIE = (scope: string) => `visited-${scope}`;

function json(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

export async function GET({ params }: APIContext) {
  const scope = params.scope ?? '';
  if (!ALLOWED.has(scope)) return json({ count: 0 }, { status: 400 });
  if (!isRedisConfigured || !redis) return json({ count: 0, configured: false });
  const count = (await redis.get<number>(KEY(scope))) ?? 0;
  return json({ count, configured: true });
}

export async function POST({ params, request, cookies }: APIContext) {
  const scope = params.scope ?? '';
  if (!ALLOWED.has(scope)) return json({ count: 0 }, { status: 400 });
  if (!isRedisConfigured || !redis) {
    return json({ count: 0, configured: false }, { status: 503 });
  }

  const cookieName = COOKIE(scope);
  if (cookies.get(cookieName)?.value === '1') {
    const count = (await redis.get<number>(KEY(scope))) ?? 0;
    return json({ count, alreadyCounted: true, configured: true });
  }

  const count = await redis.incr(KEY(scope));
  cookies.set(cookieName, '1', {
    httpOnly: false,
    sameSite: 'lax',
    secure: new URL(request.url).protocol === 'https:',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
  return json({ count, alreadyCounted: false, configured: true });
}
