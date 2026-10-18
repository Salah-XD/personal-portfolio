import { deflateSync } from 'node:zlib';

// mermaid.ink's "pako:" form: the Mermaid Live Editor state, zlib-deflated and base64url-encoded.
export function mermaidImageUrl(source) {
  const state = JSON.stringify({ code: source, mermaid: { theme: 'default' } });
  return `https://mermaid.ink/img/pako:${deflateSync(state, { level: 9 }).toString('base64url')}?type=png`;
}

const escapeAttr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Turn ```mermaid fences into a static image so importers that don't run JavaScript
// (Medium, feed readers) still get the diagram. The blog page swaps in a themed SVG
// rendered from data-mermaid.
export default function remarkMermaid() {
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type !== 'code' || child.lang !== 'mermaid') {
        walk(child);
        return child;
      }
      return {
        type: 'html',
        value:
          `<figure class="mermaid-diagram not-prose my-8" data-mermaid="${escapeAttr(child.value)}">` +
          `<img src="${mermaidImageUrl(child.value)}" alt="Diagram" loading="lazy" decoding="async" ` +
          `style="display:block;margin:0 auto;max-width:100%;height:auto">` +
          `</figure>`,
      };
    });
  };
  return (tree) => walk(tree);
}
