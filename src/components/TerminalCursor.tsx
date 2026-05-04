import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [role="link"], [data-cursor], summary, label[for]';
const TEXT_INPUT_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, [contenteditable="true"]';

type Variant = 'default' | 'link' | 'text';

export default function TerminalCursor() {
  const blockRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const noHover = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (reduceMotion || noHover) return;

    const block = blockRef.current;
    const ring = ringRef.current;
    if (!block || !ring) return;

    document.documentElement.classList.add('has-custom-cursor');

    // Center transform applied per-frame; just position via CSS variables
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.18, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.18, ease: 'power3' });
    const blockX = gsap.quickTo(block, 'x', { duration: 0, ease: 'none' });
    const blockY = gsap.quickTo(block, 'y', { duration: 0, ease: 'none' });

    let idleTimer = 0;
    const setIdle = (idle: boolean) => {
      block.classList.toggle('cursor-idle', idle);
    };

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      blockX(x);
      blockY(y);
      ringX(x);
      ringY(y);

      setIdle(false);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setIdle(true), 500);
    };

    const setVariant = (v: Variant) => {
      block.dataset.variant = v;
      ring.dataset.variant = v;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !target.closest) return;
      if (target.closest(TEXT_INPUT_SELECTOR)) {
        setVariant('text');
        return;
      }
      if (target.closest(INTERACTIVE_SELECTOR)) {
        setVariant('link');
        return;
      }
      setVariant('default');
    };

    const onDown = () => {
      ring.classList.add('cursor-press');
    };
    const onUp = () => {
      ring.classList.remove('cursor-press');
    };

    const onLeave = () => {
      block.classList.add('cursor-hidden');
      ring.classList.add('cursor-hidden');
    };
    const onEnter = () => {
      block.classList.remove('cursor-hidden');
      ring.classList.remove('cursor-hidden');
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      window.clearTimeout(idleTimer);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="terminal-cursor-ring" aria-hidden="true" />
      <div ref={blockRef} className="terminal-cursor-block" aria-hidden="true" />
    </>
  );
}
