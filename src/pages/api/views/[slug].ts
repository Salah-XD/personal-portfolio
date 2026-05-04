import type { APIContext } from 'astro';
import { redis, isRedisConfigured } from '../../../lib/redis';

export const prerender = false;

const KEY = (slug: string) => `views:${slug}`;
const COOKIE = (slug: string) => `viewed-${encodeURIComponent(slug)}`;

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

export async function GET({ params }: APIContext) {
  const slug = params.slug ?? '';
  if (!slug) return jsonResponse({ count: 0 }, { status: 400 });
  if (!isRedisConfigured || !redis) return jsonResponse({ count: 0, configured: false });
  const count = (await redis.get<number>(KEY(slug))) ?? 0;
  return jsonResponse({ count, configured: true });
}

export async function POST({ params, request, cookies }: APIContext) {
  const slug = params.slug ?? '';
  if (!slug) return jsonResponse({ count: 0 }, { status: 400 });
  if (!isRedisConfigured || !redis) {
    return jsonResponse({ count: 0, configured: false }, { status: 503 });
  }

  const cookieName = COOKIE(slug);
  const recent = cookies.get(cookieName)?.value === '1';
  if (recent) {
    const count = (await redis.get<number>(KEY(slug))) ?? 0;
    return jsonResponse({ count, counted: false, configured: true });
  }

  const count = await redis.incr(KEY(slug));
  cookies.set(cookieName, '1', {
    httpOnly: false,
    sameSite: 'lax',
    secure: new URL(request.url).protocol === 'https:',
    path: '/',
    maxAge: 60 * 30,
  });
  return jsonResponse({ count, counted: true, configured: true });
}
