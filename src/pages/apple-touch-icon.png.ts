import { Resvg } from '@resvg/resvg-js';

// 180×180 PNG icon (Apple touch icon + PNG favicon fallback for Bing/older clients).
// Same terminal-prompt mark as /favicon.svg, rendered to raster at build time.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <rect width="180" height="180" rx="40" fill="#0f172a"/>
  <path d="M52 56 L86 90 L52 124" fill="none" stroke="#34d399" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M96 124 H132" fill="none" stroke="#34d399" stroke-width="16" stroke-linecap="round"/>
</svg>`;

export async function GET() {
  const png = new Resvg(svg).render().asPng();
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
