// Pointer-relative 3D tilt. Skipped on touch and reduced-motion.

interface TiltOptions {
  max?: number;
  resetMs?: number;
}

export function applyTilt(el: HTMLElement, opts: TiltOptions = {}) {
  if (typeof window === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (window.matchMedia('(hover: none)').matches) return () => {};

  const max = opts.max ?? 6;
  const resetMs = opts.resetMs ?? 200;
  const original = el.style.transition;
  el.style.transformStyle = 'preserve-3d';
  el.style.willChange = 'transform';

  const onMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * max * 2;
    const ry = (x - 0.5) * max * 2;
    el.style.transition = 'transform 60ms ease-out';
    el.style.transform = `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  };

  const onLeave = () => {
    el.style.transition = `transform ${resetMs}ms ease`;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  };

  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);

  return () => {
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
    el.style.transition = original;
    el.style.transform = '';
    el.style.willChange = '';
  };
}
