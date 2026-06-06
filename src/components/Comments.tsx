import { useEffect, useRef } from 'react';
import { useTheme } from '../lib/theme';

interface Props {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
}

const SITE_ORIGIN = 'https://salahxd.dev';

function resolveOrigin() {
  if (typeof window === 'undefined') return SITE_ORIGIN;
  const { protocol, host } = window.location;
  if (host.startsWith('localhost') || host.startsWith('127.')) return SITE_ORIGIN;
  return `${protocol}//${host}`;
}

export default function Comments({
  repo,
  repoId,
  category,
  categoryId,
  mapping = 'pathname',
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [theme] = useTheme();
  const giscusTheme = `${resolveOrigin()}/giscus-${theme}.css`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', mapping);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', giscusTheme);
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo, repoId, category, categoryId, mapping]);

  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (!iframe) return;
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: giscusTheme } } },
      'https://giscus.app'
    );
  }, [giscusTheme]);

  return (
    <section className="mt-16">
      <h2 className="font-mono text-xl mb-6 text-slate-700 dark:text-emerald-400">
        salah@portfolio:~/blog$ ./comments
      </h2>
      <div ref={containerRef} />
    </section>
  );
}
