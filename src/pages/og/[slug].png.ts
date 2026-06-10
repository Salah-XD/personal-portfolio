import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const fontBold = readFileSync(join(process.cwd(), 'public/fonts/JetBrainsMono-Bold.ttf'));
const fontRegular = readFileSync(join(process.cwd(), 'public/fonts/JetBrainsMono-Regular.ttf'));

export async function GET({ props }: APIContext) {
  const { post } = props as {
    post: Awaited<ReturnType<typeof getCollection>>[number];
  };
  const tags = (post.data.tags || []).slice(0, 4);

  const markup = html(`
    <div style="display:flex;flex-direction:column;width:1200px;height:630px;background:#0f172a;color:#f1f5f9;padding:64px;font-family:JetBrains Mono;justify-content:space-between;border:8px solid #10b981;">
      <div style="display:flex;align-items:center;gap:16px;color:#34d399;font-size:28px;">
        <span>salahxd@dev:~/blog$ cat ${escape(post.id)}.md</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:24px;">
        <div style="font-size:64px;line-height:1.15;color:#f8fafc;font-weight:700;letter-spacing:-1px;">${escape(post.data.title)}</div>
        ${
          post.data.excerpt
            ? `<div style="font-size:26px;line-height:1.4;color:#cbd5e1;">${escape(truncate(post.data.excerpt, 140))}</div>`
            : ''
        }
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;gap:16px;color:#34d399;font-size:24px;">
          <span>${escape(post.data.author)}</span>
          <span style="color:#475569;">·</span>
          <span>${escape(post.data.date)}</span>
        </div>
        <div style="display:flex;gap:12px;">
          ${tags
            .map(
              (t) =>
                `<div style="padding:8px 16px;background:#1e293b;color:#34d399;border-radius:6px;font-size:22px;border:1px solid #334155;">#${escape(t)}</div>`
            )
            .join('')}
        </div>
      </div>
    </div>
  `);

  const svg = await satori(markup as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'JetBrains Mono', data: fontRegular, weight: 400, style: 'normal' },
      { name: 'JetBrains Mono', data: fontBold, weight: 700, style: 'normal' },
    ],
  });

  const png = new Resvg(svg).render().asPng();
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + '…';
}
