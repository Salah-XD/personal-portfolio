import { useEffect, useState } from 'react';
import { play } from '../lib/sfx';

const STORAGE_KEY = 'salahxd:booted';

const lines = [
  '> booting salah@portfolio v2.0...',
  '> mounting filesystem ......... ok',
  '> loading projects ............ ok',
  '> loading blog index .......... ok',
  '> compiling syntax themes ..... ok',
  '> ready.',
];

export default function BootSequence() {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let booted = false;
    try {
      booted = sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {}
    if (booted || reduce) return;
    setShow(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {}
  }, []);

  useEffect(() => {
    if (!show) return;
    if (count >= lines.length) {
      play('chord');
      const t = window.setTimeout(() => setShow(false), 350);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setCount((c) => c + 1), 180);
    return () => window.clearTimeout(t);
  }, [show, count]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 text-emerald-400 font-mono text-sm flex items-center justify-center px-6">
      <div className="w-full max-w-xl space-y-1">
        {lines.slice(0, count).map((l, i) => (
          <div key={i} className="opacity-90">
            {l}
          </div>
        ))}
        {count < lines.length && (
          <div className="text-slate-500">
            <span className="animate-pulse">_</span>
          </div>
        )}
      </div>
    </div>
  );
}
