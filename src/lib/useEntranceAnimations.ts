import { useEffect, type RefObject } from 'react';
import { gsap, ScrollTrigger } from './gsap';

export function useEntranceAnimations(scopeRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const scope = scopeRef.current;
    if (!scope) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const animate = (selector: string, vars: gsap.TweenVars, stagger?: number) => {
        const targets = gsap.utils.toArray<HTMLElement>(selector);
        if (!targets.length) return;
        targets.forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 24,
            duration: 0.6,
            ease: 'power2.out',
            ...vars,
            scrollTrigger: {
              trigger: el,
              start: 'top 95%',
              toggleActions: 'play none none none',
            },
            ...(stagger ? { stagger } : {}),
          });
        });
      };

      animate('[data-anim="hero"]', { duration: 0.8, y: 12 });
      animate('[data-anim="card"]', {});
      animate('[data-anim="project"]', { y: 16, duration: 0.4 });
      animate('[data-anim="skill"]', {});
      animate('[data-anim="blog-card"]', {});

      const metrics = gsap.utils.toArray<HTMLElement>('[data-anim="metric"]');
      metrics.forEach((el, idx) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: 'power2.out',
          delay: idx * 0.08,
          scrollTrigger: { trigger: el, start: 'top 90%' },
        });

        const valueEl = el.querySelector<HTMLElement>('[data-count]');
        if (valueEl) {
          const target = Number(valueEl.dataset.count);
          if (Number.isFinite(target)) {
            const counter = { v: 0 };
            gsap.to(counter, {
              v: target,
              duration: 1.2,
              ease: 'power1.out',
              snap: { v: 1 },
              onUpdate: () => {
                valueEl.textContent = String(counter.v);
              },
              scrollTrigger: { trigger: el, start: 'top 90%' },
            });
          }
        }
      });
    }, scope);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
