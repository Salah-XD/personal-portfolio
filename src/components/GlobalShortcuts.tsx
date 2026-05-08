import { useEffect } from 'react';
import { toggleTheme } from '../lib/theme';
import { isMuted, setMuted, play } from '../lib/sfx';

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
}

export default function GlobalShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isEditable(e.target)) return;
      const k = e.key.toLowerCase();
      if (k === 't') {
        e.preventDefault();
        play('click');
        toggleTheme();
      } else if (k === 'm') {
        e.preventDefault();
        const next = !isMuted();
        setMuted(next);
        if (!next) play('click');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return null;
}
