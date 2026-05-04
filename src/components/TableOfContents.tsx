import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { List, X } from 'lucide-react';

export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface Props {
  headings: Heading[];
}

export default function TableOfContents({ headings }: Props) {
  const filtered = headings.filter((h) => h.depth >= 2 && h.depth <= 3);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    if (filtered.length === 0) return;
    const elements = filtered
      .map((h) => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filtered]);

  if (filtered.length === 0) return null;

  const list = (
    <ul className="space-y-1.5 font-mono text-sm">
      {filtered.map((h) => {
        const active = activeId === h.slug;
        return (
          <li key={h.slug} className={h.depth === 3 ? 'pl-4' : ''}>
            <a
              href={`#${h.slug}`}
              onClick={() => setOpenMobile(false)}
              className={`block py-1 transition-colors ${
                active
                  ? 'text-slate-900 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300'
              }`}
            >
              {h.text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Desktop sticky sidebar */}
      <aside
        data-lenis-prevent
        className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-thin overscroll-contain"
      >
        <p className="font-mono text-xs uppercase tracking-wider mb-3 text-slate-500 dark:text-emerald-400">
          ./toc
        </p>
        {list}
      </aside>

      {/* Mobile floating button */}
      <button
        type="button"
        aria-label="Open table of contents"
        onClick={() => setOpenMobile(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-emerald-400"
      >
        <List className="w-5 h-5" />
      </button>

      {openMobile && typeof document !== 'undefined' && createPortal(
        <div
          data-lenis-prevent
          className="lg:hidden fixed inset-0 z-50 bg-slate-200/60 dark:bg-black/60 backdrop-blur-lg"
          onClick={() => setOpenMobile(false)}
        >
          <div
            data-lenis-prevent
            className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto scrollbar-thin overscroll-contain rounded-t-2xl border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-emerald-400">
                ./toc
              </p>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpenMobile(false)}
                className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {list}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
