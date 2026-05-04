import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Command, FileText, Github, Linkedin, Mail, Search, Sparkles, Sun, Moon, X } from 'lucide-react';
import { setTheme as setThemeRaw, getTheme } from '../lib/theme';
import { triggerSecret } from './Konami';

interface PagefindResult {
  id: string;
  data: () => Promise<{
    url: string;
    excerpt: string;
    meta: { title?: string };
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

interface PaletteItem {
  id: string;
  label: string;
  hint?: string;
  Icon?: typeof Search;
  run: () => void;
}

interface ResolvedSearchResult {
  id: string;
  url: string;
  title: string;
  excerpt: string;
}

function buildCommands(close: () => void): PaletteItem[] {
  const navigate = (path: string) => () => {
    window.location.href = path;
    close();
  };
  const open = (url: string) => () => {
    window.open(url, '_blank', 'noopener,noreferrer');
    close();
  };
  return [
    {
      id: 'cd-blog',
      label: 'cd /blog',
      hint: 'Open the blog index',
      Icon: ArrowRight,
      run: navigate('/blog'),
    },
    {
      id: 'cd-home',
      label: 'cd /',
      hint: 'Go to homepage',
      Icon: ArrowRight,
      run: navigate('/'),
    },
    {
      id: 'cd-about',
      label: 'cd /about',
      hint: 'Read the about page',
      Icon: FileText,
      run: navigate('/about'),
    },
    {
      id: 'theme-dark',
      label: 'theme dark',
      hint: 'Switch to dark mode',
      Icon: Moon,
      run: () => {
        setThemeRaw('dark');
        close();
      },
    },
    {
      id: 'theme-light',
      label: 'theme light',
      hint: 'Switch to light mode',
      Icon: Sun,
      run: () => {
        setThemeRaw('light');
        close();
      },
    },
    {
      id: 'theme-toggle',
      label: 'theme toggle',
      hint: 'Flip current theme',
      Icon: Sun,
      run: () => {
        setThemeRaw(getTheme() === 'dark' ? 'light' : 'dark');
        close();
      },
    },
    {
      id: 'subscribe',
      label: 'subscribe',
      hint: 'Get notified about new posts',
      Icon: Mail,
      run: () => {
        const el = document.querySelector<HTMLElement>('[data-newsletter-form]');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.querySelector<HTMLInputElement>('input[type="email"]')?.focus();
        } else {
          window.location.href = '/#newsletter';
        }
        close();
      },
    },
    {
      id: 'open-github',
      label: 'open github',
      hint: 'github.com/Salah-XD',
      Icon: Github,
      run: open('https://github.com/Salah-XD'),
    },
    {
      id: 'open-linkedin',
      label: 'open linkedin',
      hint: 'linkedin.com/in/thisis-salah',
      Icon: Linkedin,
      run: open('https://www.linkedin.com/in/thisis-salah/'),
    },
    {
      id: 'rss',
      label: 'cat /rss.xml',
      hint: 'Subscribe via RSS reader',
      Icon: FileText,
      run: navigate('/rss.xml'),
    },
    {
      id: 'sudo',
      label: 'sudo',
      hint: 'try it',
      Icon: Sparkles,
      run: () => {
        triggerSecret();
        close();
      },
    },
    {
      id: 'secret',
      label: ':secret',
      hint: 'reveal a hidden quote',
      Icon: Sparkles,
      run: () => {
        triggerSecret();
        close();
      },
    },
    {
      id: 'help',
      label: 'help',
      hint: 'Show available commands (you are here)',
      Icon: Command,
      run: () => {},
    },
  ];
}

function fuzzyScore(query: string, item: PaletteItem): number {
  const q = query.toLowerCase().trim();
  if (!q) return 1;
  const target = `${item.label} ${item.hint ?? ''}`.toLowerCase();
  if (target.includes(q)) return 2;
  let qi = 0;
  for (const ch of target) {
    if (ch === q[qi]) qi++;
    if (qi === q.length) return 1;
  }
  return 0;
}

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ResolvedSearchResult[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const close = () => {
    setOpen(false);
    setQuery('');
    setSearchResults([]);
    setActiveIdx(0);
  };

  const commands = useMemo(() => buildCommands(close), []);
  const trimmed = query.trim();

  const filteredCommands = useMemo(() => {
    if (!trimmed) return commands;
    return commands
      .map((c) => ({ c, s: fuzzyScore(trimmed, c) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.c);
  }, [trimmed, commands]);

  // Keyboard shortcut to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Focus + body lock
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

  // Pagefind search
  useEffect(() => {
    if (!open || !trimmed) {
      setSearchResults([]);
      return;
    }
    let cancelled = false;
    setSearching(true);
    (async () => {
      const api = await loadPagefind();
      if (!api) {
        if (!cancelled) {
          setSearching(false);
          setSearchResults([]);
        }
        return;
      }
      try {
        const res = await api.search(trimmed);
        const resolved = await Promise.all(
          res.results.slice(0, 6).map(async (r) => {
            const data = await r.data();
            return {
              id: r.id,
              url: data.url,
              title: data.meta?.title ?? data.url,
              excerpt: data.excerpt,
            } satisfies ResolvedSearchResult;
          })
        );
        if (!cancelled) {
          setSearchResults(resolved);
          setSearching(false);
        }
      } catch {
        if (!cancelled) {
          setSearchResults([]);
          setSearching(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [trimmed, open]);

  // Active index reset on query change
  useEffect(() => {
    setActiveIdx(0);
  }, [trimmed, open]);

  const totalItems = filteredCommands.length + searchResults.length;

  // Scroll active into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const runActive = () => {
    if (activeIdx < filteredCommands.length) {
      filteredCommands[activeIdx]?.run();
    } else {
      const r = searchResults[activeIdx - filteredCommands.length];
      if (r) {
        window.location.href = r.url;
        close();
      }
    }
  };

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => (totalItems === 0 ? 0 : (i + 1) % totalItems));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => (totalItems === 0 ? 0 : (i - 1 + totalItems) % totalItems));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      runActive();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
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
        aria-label="Open command palette"
        className="sm:hidden p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
      >
        <Search className="w-5 h-5" />
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[70] bg-slate-200/60 dark:bg-black/60 backdrop-blur-lg flex items-start justify-center p-4 pt-[10vh]"
          onClick={close}
        >
          <div
            data-lenis-prevent
            className="w-full max-w-xl rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <span className="font-mono text-sm text-slate-500 dark:text-emerald-400 select-none">
                $
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDownInput}
                placeholder="type a command or search posts..."
                className="flex-1 bg-transparent outline-none font-mono text-sm placeholder:text-slate-400"
              />
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              ref={listRef}
              data-lenis-prevent
              className="max-h-[60vh] overflow-y-auto scrollbar-thin overscroll-contain"
            >
              {filteredCommands.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    commands
                  </div>
                  {filteredCommands.map((c, i) => {
                    const Icon = c.Icon ?? ArrowRight;
                    const active = activeIdx === i;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        data-idx={i}
                        onMouseEnter={() => setActiveIdx(i)}
                        onClick={() => c.run()}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors font-mono text-sm ${
                          active
                            ? 'bg-slate-100 dark:bg-slate-800/80'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-slate-500 dark:text-emerald-400 shrink-0" />
                        <span className="text-slate-900 dark:text-slate-100">{c.label}</span>
                        {c.hint && (
                          <span className="ml-auto text-xs text-slate-400 dark:text-slate-500 truncate">
                            {c.hint}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {trimmed && (
                <div>
                  <div className="px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    posts {searching ? '· searching…' : ''}
                  </div>
                  {searchResults.length === 0 && !searching && (
                    <div className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                      no posts match "{trimmed}"
                    </div>
                  )}
                  {searchResults.map((r, i) => {
                    const idx = filteredCommands.length + i;
                    const active = activeIdx === idx;
                    return (
                      <a
                        key={r.id}
                        href={r.url}
                        data-idx={idx}
                        onMouseEnter={() => setActiveIdx(idx)}
                        className={`block px-4 py-3 border-t border-slate-100 dark:border-slate-800 transition-colors ${
                          active
                            ? 'bg-slate-100 dark:bg-slate-800/80'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="font-mono text-sm text-slate-900 dark:text-slate-100 mb-1 truncate">
                          {r.title}
                        </div>
                        <div
                          className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: r.excerpt }}
                        />
                      </a>
                    );
                  })}
                </div>
              )}

              {!trimmed && (
                <div className="px-4 py-3 font-mono text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <div>↑↓ navigate · ↵ run · esc close</div>
                  <div className="opacity-70">tip: try <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">sudo</code> · or the konami code (↑↑↓↓←→←→ba)</div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
