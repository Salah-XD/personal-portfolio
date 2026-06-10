import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const EVENT = 'themechange';

export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function setTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
  window.dispatchEvent(new CustomEvent<Theme>(EVENT, { detail: theme }));
}

export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

export function useTheme(): [Theme, (t: Theme) => void, () => void] {
  // Start from 'dark' (what SSR always renders) so the first client render
  // matches the server — otherwise light-mode visitors hit a hydration
  // mismatch. The effect reconciles with the real DOM theme right after mount.
  const [theme, setLocal] = useState<Theme>('dark');

  useEffect(() => {
    setLocal(getTheme());

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<Theme>).detail;
      setLocal(detail ?? getTheme());
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setLocal(getTheme());
    };

    window.addEventListener(EVENT, onChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return [theme, setTheme, toggleTheme];
}
