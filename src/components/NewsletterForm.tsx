import { useState } from 'react';
import { Mail } from 'lucide-react';
import { play } from '../lib/sfx';

interface Props {
  source?: string;
  variant?: 'inline' | 'card';
  title?: string;
  description?: string;
}

type Status = 'idle' | 'sending' | 'ok' | 'error';

export default function NewsletterForm({
  source = 'site',
  variant = 'inline',
  title = 'Get new posts in your inbox',
  description = 'Tech, design, and building products. No spam, unsubscribe anytime.',
}: Props) {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === 'sending') return;
    setStatus('sending');
    setMessage('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source, website }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; configured?: boolean; alreadySubscribed?: boolean };
      if (data.ok) {
        setStatus('ok');
        setMessage(data.alreadySubscribed ? "You're already subscribed — thanks!" : "You're in. Talk soon.");
        setEmail('');
        play('ding');
      } else if (data.configured === false) {
        setStatus('error');
        setMessage('Newsletter is not yet configured on the server.');
      } else {
        setStatus('error');
        setMessage(data.error ?? 'Subscription failed.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error.');
    }
  };

  const wrapperClass =
    variant === 'card'
      ? 'p-6 border rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'
      : '';

  return (
    <div data-newsletter-form className={wrapperClass}>
      {variant === 'card' && (
        <>
          <div className="font-mono text-sm mb-2 text-slate-600 dark:text-emerald-400">
            salahxd@dev:~$ ./subscribe --email
          </div>
          <h3 className="font-mono text-lg sm:text-xl mb-2">{title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{description}</p>
        </>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <label className="sr-only" htmlFor={`newsletter-email-${source}`}>Email</label>
        {/* Honeypot — hidden from humans (and screen readers via aria-hidden), bots fill it and get silently dropped server-side. */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
          <label htmlFor={`newsletter-website-${source}`}>Website (leave empty)</label>
          <input
            id={`newsletter-website-${source}`}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none" />
          <input
            id={`newsletter-email-${source}`}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-slate-400 dark:focus:border-emerald-500 font-mono text-sm transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="px-4 py-2.5 rounded-lg font-mono text-sm transition-colors bg-slate-800 text-white hover:bg-slate-900 dark:bg-emerald-500 dark:text-slate-900 dark:hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'subscribing…' : 'subscribe'}
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 font-mono text-xs ${
            status === 'ok' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
