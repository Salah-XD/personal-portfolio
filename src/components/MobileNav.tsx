import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';

interface NavItem {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface MobileNavProps {
  items: NavItem[];
  prompt?: string;
}

export default function MobileNav({ items, prompt = 'salah@portfolio:~$' }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          data-lenis-prevent
          className="md:hidden fixed inset-0 z-[60] bg-slate-200/60 dark:bg-black/60 backdrop-blur-lg animate-fade-up"
          onClick={() => setOpen(false)}
        >
          <div
            data-lenis-prevent
            className="absolute right-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto scrollbar-thin overscroll-contain bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 p-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-mono text-sm text-slate-600 dark:text-emerald-400">{prompt}</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4 font-mono">
              {items.map((item) => {
                const className =
                  'text-left px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-emerald-400 transition-colors';
                if (item.href) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className={className}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  );
                }
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      item.onClick?.();
                      setOpen(false);
                    }}
                    className={className}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
