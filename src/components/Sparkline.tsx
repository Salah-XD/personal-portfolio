import { useEffect, useRef, useState } from 'react';

interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
}

export default function Sparkline({ values, width = 64, height = 16, className = '' }: SparklineProps) {
  const ref = useRef<SVGPolylineElement | null>(null);
  const [length, setLength] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const total = ref.current.getTotalLength();
    setLength(total);
    if (reduce) {
      setDrawn(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setDrawn(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [values.length]);

  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);
  const points = values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const dashStyle =
    length != null
      ? {
          strokeDasharray: length,
          strokeDashoffset: drawn ? 0 : length,
        }
      : undefined;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`text-slate-500 dark:text-emerald-400 ${className}`}
      aria-hidden="true"
    >
      <polyline
        ref={ref}
        className="sparkline-line"
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={dashStyle}
      />
    </svg>
  );
}
