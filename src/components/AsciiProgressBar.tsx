interface AsciiProgressBarProps {
  label: string;
  value: number;
  width?: number;
}

export default function AsciiProgressBar({ label, value, width = 20 }: AsciiProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const filledCount = Math.round((clamped / 100) * width);
  const emptyCount = width - filledCount;
  const filled = '█'.repeat(filledCount);
  const empty = '░'.repeat(emptyCount);
  const percent = String(Math.round(clamped)).padStart(3, ' ');

  return (
    <div className="flex items-center gap-3 font-mono text-xs sm:text-sm" data-anim="skill">
      <span className="shrink-0 w-32 sm:w-40 truncate">{label}</span>
      <span className="flex-1 min-w-0 whitespace-nowrap overflow-hidden">
        <span className="text-slate-500 dark:text-slate-400">[</span>
        <span className="text-slate-800 dark:text-emerald-400">{filled}</span>
        <span className="text-slate-300 dark:text-slate-700">{empty}</span>
        <span className="text-slate-500 dark:text-slate-400">]</span>
      </span>
      <span className="shrink-0 text-slate-600 dark:text-emerald-400 tabular-nums">{percent}%</span>
    </div>
  );
}
