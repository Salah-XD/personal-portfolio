import { useRef, type ReactNode } from 'react';
import { play } from '../lib/sfx';

interface GlitchTextProps {
  children: ReactNode;
  text?: string;
  className?: string;
}

export default function GlitchText({ children, text, className = '' }: GlitchTextProps) {
  const lastFire = useRef(0);
  const label = text ?? (typeof children === 'string' ? children : undefined);

  const onEnter = () => {
    const now = Date.now();
    if (now - lastFire.current < 800) return;
    lastFire.current = now;
    play('glitch');
  };

  return (
    <span
      onMouseEnter={onEnter}
      className={`glitch-text relative inline-block ${className}`}
      data-text={label}
    >
      {children}
    </span>
  );
}
