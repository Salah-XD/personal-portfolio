import { useEffect, useState } from 'react';

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const quotes = [
  '~/.secret: "stay curious, ship often, be kind."',
  '~/.secret: "the best code is the code you delete."',
  '~/.secret: "make it work. make it right. make it fast. in that order."',
  '~/.secret: "writing about it is half the work."',
  '~/.secret: "you found the easter egg. type sudo in ⌘K too."',
];

export const SECRET_EVENT = 'salahxd:secret';

export function triggerSecret() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(SECRET_EVENT));
}

export default function Konami() {
  const [show, setShow] = useState(false);
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    let idx = 0;
    let timer = 0;

    const fire = () => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      setShow(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setShow(false), 4500);
    };

    const onKey = (e: KeyboardEvent) => {
      const expected = SEQUENCE[idx];
      const key = e.key;
      if (key === expected || key.toLowerCase() === expected.toLowerCase()) {
        idx++;
        if (idx === SEQUENCE.length) {
          idx = 0;
          fire();
        }
      } else if (key.startsWith('Arrow') || /^[a-z]$/i.test(key)) {
        // Reset only on meaningful keys; ignore Shift/Alt/Meta etc.
        idx = 0;
      }
    };

    const onSecret = () => fire();

    window.addEventListener('keydown', onKey);
    window.addEventListener(SECRET_EVENT, onSecret);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(SECRET_EVENT, onSecret);
      window.clearTimeout(timer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] px-5 py-3 rounded-lg border border-emerald-500/50 bg-slate-900/95 text-emerald-300 font-mono text-sm shadow-2xl backdrop-blur animate-fade-up max-w-[90vw]"
    >
      {quote}
    </div>
  );
}
