import { useEffect, useRef, useState } from 'react';
import { Command, Search, X } from 'lucide-react';

interface PagefindResult {
  id: string;
  data: () => Promise<{
    url: string;
    excerpt: string;
    meta: { title?: string };
    sub_results?: Array<{ title: string; url: string; excerpt: string }>;
  }>;
}

interface PagefindAPI {
  search: (q: string) => Promise<{ results: PagefindResult[] }>;
}

declare global {
  interface Window {
    __pagefind?: PagefindAPI;
  }
}

async function loadPagefind(): Promise<PagefindAPI | null> {
  if (typeof window === 'undefined') return null;
  if (window.__pagefind) return window.__pagefind;
  try {
    const path = '/pagefind/pagefind.js';
    // Build the import call as a Function so Vite cannot statically resolve it.
    const dynamicImport = new Function('p', 'return import(p)') as (p: string) => Promise<{
      default?: PagefindAPI;
      search?: PagefindAPI['search'];
    }>;
    const mod = await dynamicImport(path);
    const api = (mod.default ?? mod) as PagefindAPI;
    window.__pagefind = api;
    return api;
  } catch {
    return null;
  }
}

interface ResolvedResult {
  id: string;
  url: string;
  title: string;
  excerpt: string;
}

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ResolvedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q) {
      setResults([]);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const api = await loadPagefind();
      if (!api) {
        if (!cancelled) {
          setError('Search index not available yet (run a build first).');
          setResults([]);
          setLoading(false);
        }
        return;
      }
      try {
        const res = await api.search(q);
        const resolved = await Promise.all(
          res.results.slice(0, 8).map(async (r) => {
            const data = await r.data();
            return {
              id: r.id,
              url: data.url,
              title: data.meta?.title ?? data.url,
              excerpt: data.excerpt,
            } satisfies ResolvedResult;
          })
        );
        if (!cancelled) {
          setResults(resolved);
          setError(null);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Search failed.');
          setResults([]);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query, open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search posts"
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-emerald-400 hover:border-slate-300 dark:hover:border-slate-600 transition-colors font-mono text-xs"
      >
        <Search className="w-4 h-4" />
        <span>Search</span>
        <kbd className="ml-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px]">
          ⌘K
        </kbd>
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search posts"
        className="sm:hidden p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
      >
        <Search className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 pt-[10vh]"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <Command className="w-4 h-4 text-slate-500 dark:text-emerald-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search posts..."
                className="flex-1 bg-transparent outline-none font-mono text-sm placeholder:text-slate-400"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {loading && (
                <div className="p-4 font-mono text-sm text-slate-500 dark:text-slate-400">searching…</div>
              )}
              {error && !loading && (
                <div className="p-4 font-mono text-sm text-rose-500">{error}</div>
              )}
              {!loading && !error && query.trim() && results.length === 0 && (
                <div className="p-4 font-mono text-sm text-slate-500 dark:text-slate-400">
                  no matches for "{query}"
                </div>
              )}
              {!loading && !error && !query.trim() && (
                <div className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p>type to search blog posts.</p>
                  <p>↑↓ to navigate · ↵ to open · esc to close</p>
                </div>
              )}
              {results.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  className="block px-4 py-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="font-mono text-sm text-slate-900 dark:text-slate-100 mb-1">
                    {r.title}
                  </div>
                  <div
                    className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: r.excerpt }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
