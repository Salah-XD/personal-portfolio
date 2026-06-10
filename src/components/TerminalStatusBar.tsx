import { useEffect, useState } from 'react';

interface TerminalStatusBarProps {
  buildTime: string;
  commitSha: string;
  scope?: 'home' | 'about';
}

function formatStamp(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function TerminalStatusBar({ buildTime, commitSha, scope = 'home' }: TerminalStatusBarProps) {
  // Seed from the (stable) build time so the server-rendered HTML and the
  // first client render agree; the interval below ticks it to live time after
  // mount. suppressHydrationWarning on the output span covers the unavoidable
  // server/client timezone-format difference on that first paint.
  const [now, setNow] = useState<Date>(() => new Date(buildTime));
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await fetch(`/api/visits/${scope}`, { method: 'POST' });
        const res = await fetch(`/api/visits/${scope}`);
        if (!res.ok) return;
        const data = (await res.json()) as { count?: number; configured?: boolean };
        if (!cancelled && data.configured && typeof data.count === 'number') {
          setVisits(data.count);
        }
      } catch {
        /* network error — degrade silently */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [scope]);

  // Uptime counts from the site's launch, not the last build — so it grows
  // steadily instead of resetting to 0 on every deploy.
  const launch = new Date('2026-06-06T00:00:00Z');
  const uptimeDays = Math.max(0, Math.floor((now.getTime() - launch.getTime()) / 86_400_000));

  return (
    <div className="font-mono text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
      <span className="tabular-nums" suppressHydrationWarning>[{formatStamp(now)}]</span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
        <span>online</span>
      </span>
      <span>build #{commitSha}</span>
      <span suppressHydrationWarning>{uptimeDays}d uptime</span>
      {visits != null && <span className="tabular-nums">· {visits.toLocaleString()} visits</span>}
    </div>
  );
}
