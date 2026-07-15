import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';

const fontBold = readFileSync(join(process.cwd(), 'public/fonts/JetBrainsMono-Bold.ttf'));
const fontRegular = readFileSync(join(process.cwd(), 'public/fonts/JetBrainsMono-Regular.ttf'));

export async function GET() {
  const markup = html(`
    <div style="display:flex;flex-direction:column;width:1200px;height:630px;background:#0f172a;color:#f1f5f9;padding:80px;font-family:JetBrains Mono;justify-content:center;align-items:flex-start;border:8px solid #10b981;">
      <div style="font-size:32px;color:#34d399;margin-bottom:32px;">salahxd@dev:~$ whoami</div>
      <div style="font-size:84px;line-height:1.05;font-weight:700;color:#f8fafc;letter-spacing:-2px;">Mohd Salahudeen</div>
      <div style="font-size:36px;line-height:1.3;color:#cbd5e1;margin-top:24px;">software engineer · founder of QSat and ShineUp</div>
      <div style="display:flex;align-items:center;gap:14px;color:#34d399;font-size:26px;margin-top:48px;">
        <span>$</span>
        <span style="color:#cbd5e1;">cat status.txt</span>
      </div>
      <div style="font-size:28px;color:#f8fafc;margin-top:8px;">I write the code and run the companies.</div>
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
