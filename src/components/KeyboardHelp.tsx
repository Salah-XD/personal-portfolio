import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { play } from '../lib/sfx';

const shortcuts: Array<{ keys: string; desc: string }> = [
  { keys: '⌘K / Ctrl+K', desc: 'Open command palette' },
  { keys: '?', desc: 'Show this help' },
  { keys: 'T', desc: 'Toggle theme' },
  { keys: 'M', desc: 'Mute / unmute SFX' },
  { keys: 'G then H', desc: 'Go home' },
  { keys: 'G then B', desc: 'Go to blog' },
  { keys: '⬆⬆⬇⬇⬅➡⬅➡BA', desc: 'Konami easter egg' },
  { keys: '?cmd=ls', desc: 'URL command params (try ?cmd=help)' },
];

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
}

export default function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        return;
      }
      if (e.key === '?' && !isEditable(e.target) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen((p) => {
          if (!p) play('click');
          return !p;
        });
      }
    };

    const onOpenEvent = () => {
      setOpen(true);
      play('click');
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('keyboard-help-open', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyboard-help-open', onOpenEvent);
    };
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 font-mono"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-600 dark:text-emerald-400">salahxd@dev:~$ man shortcuts</span>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <ul className="space-y-2 text-sm">
          {shortcuts.map((s) => (
            <li key={s.keys} className="flex items-center justify-between gap-4">
              <span className="text-slate-700 dark:text-slate-200">{s.desc}</span>
              <kbd className="px-2 py-0.5 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                {s.keys}
              </kbd>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Press Esc to close</p>
      </div>
    </div>
  );
}
