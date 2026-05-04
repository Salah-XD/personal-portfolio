import type { APIContext } from 'astro';
import { redis, isRedisConfigured } from '../../../lib/redis';

export const prerender = false;

const KEY = (slug: string) => `likes:${slug}`;
const COOKIE = (slug: string) => `liked-${encodeURIComponent(slug)}`;

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
  const already = cookies.get(cookieName)?.value === '1';
  if (already) {
    const count = (await redis.get<number>(KEY(slug))) ?? 0;
    return jsonResponse({ count, alreadyLiked: true, configured: true });
  }

  const count = await redis.incr(KEY(slug));
  cookies.set(cookieName, '1', {
    httpOnly: false,
    sameSite: 'lax',
    secure: new URL(request.url).protocol === 'https:',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return jsonResponse({ count, alreadyLiked: false, configured: true });
}
