// Your original "salah" block-ASCII — rendered as SVG, not a <pre>.
//
// Why SVG: the block glyphs (█ U+2588, ░ U+2591) aren't in the Google-Fonts
// JetBrains Mono subset, so browsers substitute a different font *just* for them —
// different metrics than the surrounding spaces, which makes the columns drift and
// the rows stripe (the "broken" look). Turning each run into an SVG <rect> removes
// the font dependency: it tiles pixel-perfectly and inherits text color.
//
// The art below is exactly as supplied. ░ renders as a lighter shade, █ as solid.
// Non-block characters (the leading `--`, spaces) are ignored, and empty margins
// are trimmed, so the wordmark renders untouched and flush.
const banner = String.raw`
--                          ░██            ░██
--                          ░██            ░██
--     ░███████   ░██████   ░██  ░██████   ░████████
--    ░██              ░██  ░██       ░██  ░██    ░██
--     ░███████   ░███████  ░██  ░███████  ░██    ░██
--           ░██ ░██   ░██  ░██ ░██   ░██  ░██    ░██
--     ░███████   ░█████░██ ░██  ░█████░██ ░██    ░██
--
--
--                                                    `;

const CW = 6; // cell width  (≈ monospace advance)
const CH = 10; // cell height (taller than wide, like a terminal cell)
const SHADE_OPACITY = 0.5; // how light ░ renders vs solid █

const rows = banner.replace(/^\n/, '').replace(/\n+$/, '').split('\n');

type Cell = { x: number; y: number; w: number; shade: boolean };

// Run-length encode each row by cell type (░ vs █) into rects. Rects are exactly
// CH tall at row*CH, so vertically-adjacent runs touch with no seam.
const raw: Cell[] = [];
rows.forEach((line, r) => {
  let c = 0;
  while (c < line.length) {
    const ch = line[c];
    if (ch === '█' || ch === '░') {
      const shade = ch === '░';
      const start = c;
      while (c < line.length && line[c] === ch) c++;
      raw.push({ x: start * CW, y: r * CH, w: (c - start) * CW, shade });
    } else {
      c++;
    }
  }
});

// Trim empty left/top margins (incl. the leading `--`) so the wordmark sits flush.
const minX = Math.min(...raw.map((c) => c.x));
const minY = Math.min(...raw.map((c) => c.y));
const width = Math.max(...raw.map((c) => c.x + c.w)) - minX;
const height = Math.max(...raw.map((c) => c.y)) + CH - minY;
const cells = raw.map((c) => ({ ...c, x: c.x - minX, y: c.y - minY }));

export default function AsciiBanner() {
  return (
    <svg
      data-anim="hero-banner"
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      className="hidden sm:block w-auto h-14 md:h-20 lg:h-24 text-slate-700 dark:text-emerald-400 select-none mb-6"
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      {cells.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={c.w} height={CH} opacity={c.shade ? SHADE_OPACITY : 1} />
      ))}
    </svg>
  );
}
