// Parse `?cmd=...` URL params and dispatch site actions.

import { setTheme } from './theme';

type Handlers = {
  scrollTo?: (id: string) => void;
  openSearch?: (prefill?: string) => void;
  openHelp?: () => void;
  setCrt?: (on: boolean) => void;
};

const knownCommands = new Set([
  'whoami',
  'ls',
  'ls projects',
  'ls blog',
  'cd',
  'cd /',
  'theme dark',
  'theme light',
  'crt on',
  'crt off',
  'subscribe',
  'help',
  '?',
]);

export function runUrlCommand(handlers: Handlers = {}) {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('cmd');
  if (!raw) return;

  const cmd = raw.trim().toLowerCase();
  params.delete('cmd');
  const next = params.toString();
  const url = window.location.pathname + (next ? `?${next}` : '') + window.location.hash;
  window.history.replaceState({}, '', url);

  const handle = () => {
    switch (cmd) {
      case 'whoami':
        handlers.scrollTo?.('about');
        return;
      case 'ls':
      case 'ls projects':
        handlers.scrollTo?.('projects');
        return;
      case 'ls blog':
        window.location.href = '/blog';
        return;
      case 'cd':
      case 'cd /':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      case 'theme dark':
        setTheme('dark');
        return;
      case 'theme light':
        setTheme('light');
        return;
      case 'crt on':
        handlers.setCrt?.(true);
        return;
      case 'crt off':
        handlers.setCrt?.(false);
        return;
      case 'subscribe':
        handlers.scrollTo?.('newsletter');
        return;
      case 'help':
      case '?':
        handlers.openHelp?.();
        return;
      default:
        if (!knownCommands.has(cmd)) {
          handlers.openSearch?.(raw);
        }
    }
  };

  // Defer one tick so islands have mounted.
  setTimeout(handle, 50);
}
