import type { APIContext } from 'astro';

export const prerender = false;

const BUTTONDOWN_ENDPOINT = 'https://api.buttondown.com/v1/subscribers';

interface Body {
  email?: string;
  source?: string;
}

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

export async function POST({ request }: APIContext) {
  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return jsonResponse({ ok: false, configured: false, error: 'Newsletter not configured.' }, { status: 503 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }
  const email = (body.email ?? '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ ok: false, error: 'Please provide a valid email.' }, { status: 400 });
  }

  try {
    const res = await fetch(BUTTONDOWN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        tags: body.source ? [body.source] : [],
      }),
    });
    if (res.ok) {
      return jsonResponse({ ok: true });
    }
    if (res.status === 400) {
      const detail = (await res.json().catch(() => null)) as { detail?: string } | null;
      const msg = detail?.detail ?? 'Subscription failed.';
      // Buttondown returns 400 for "already subscribed" — treat as success.
      if (/already/i.test(msg)) return jsonResponse({ ok: true, alreadySubscribed: true });
      return jsonResponse({ ok: false, error: msg }, { status: 400 });
    }
    return jsonResponse({ ok: false, error: `Subscription failed (${res.status}).` }, { status: 502 });
  } catch (e) {
    return jsonResponse({ ok: false, error: 'Subscription request failed.' }, { status: 502 });
  }
}
