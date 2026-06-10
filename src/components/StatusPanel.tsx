import { ArrowRight } from 'lucide-react';

interface StatusPanelProps {
  mood: string;
  focus: string;
  learning: string;
  daysAgo: number;
}

function relativeDays(d: number): string {
  if (d <= 0) return 'today';
  if (d === 1) return 'yesterday';
  return `${d} days ago`;
}

export default function StatusPanel({ mood, focus, learning, daysAgo }: StatusPanelProps) {
  const stale = daysAgo > 30;
  const rows: Array<{ key: string; value: string; accent?: boolean }> = [
    { key: 'mood', value: mood, accent: true },
    { key: 'focus', value: focus },
    { key: 'learning', value: learning },
    { key: 'touched', value: relativeDays(daysAgo) },
  ];

  return (
    <div
      data-anim="card"
      className="p-6 border rounded-lg font-mono border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30"
    >
      <div className="text-sm mb-4 text-slate-600 dark:text-emerald-400">
        salahxd@dev:~$ cat ~/.status
      </div>
      <ul className="space-y-2 text-sm sm:text-base">
        {rows.map(({ key, value, accent }) => (
          <li key={key} className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-slate-500 dark:text-slate-400 w-20 shrink-0">{key}:</span>
            <span
              className={
                accent
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : key === 'touched' && stale
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-slate-700 dark:text-slate-200'
              }
            >
              {value}
              {key === 'touched' && stale && ' — stale'}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          live data from <code className="text-slate-600 dark:text-emerald-400">/now</code>
        </span>
        <a
          href="/now"
          className="flex items-center gap-2 text-sm text-slate-700 dark:text-emerald-400 hover:text-slate-900 dark:hover:text-emerald-300 transition-colors"
        >
          <span>more</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
