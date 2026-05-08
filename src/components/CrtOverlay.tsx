import { useEffect, useState } from 'react';

const STORAGE_KEY = 'crt-on';
const EVENT = 'crtchange';

export function isCrtOn(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEY) === '1';
}

export function setCrt(on: boolean) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
  window.dispatchEvent(new CustomEvent(EVENT));
}

export default function CrtOverlay() {
  const [on, setLocal] = useState(false);

  useEffect(() => {
    setLocal(isCrtOn());
    const sync = () => setLocal(isCrtOn());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) sync();
    });
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  if (!on) return null;
  return <div aria-hidden="true" className="crt-overlay" />;
}
