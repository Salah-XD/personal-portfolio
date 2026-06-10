// Web Audio synth-based SFX engine. No audio files; pure oscillator tones.
// On by default; muted only when the user explicitly mutes. Hard-disabled under prefers-reduced-motion.

import { useEffect, useState } from 'react';

type Sound = 'beep' | 'chord' | 'click' | 'ding' | 'glitch';

const STORAGE_KEY = 'sfx-muted';
const EVENT = 'sfxchange';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let lastGlitch = 0;

function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function ensureContext() {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = 0.18;
  master.connect(ctx.destination);
  return ctx;
}

function tone(freq: number, durationMs: number, type: OscillatorType = 'sine', vol = 1) {
  const c = ensureContext();
  if (!c || !master) return;
  if (c.state === 'suspended') c.resume().catch(() => {});
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const now = c.currentTime;
  const dur = durationMs / 1000;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(vol, now + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g).connect(master);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

function sweep(from: number, to: number, durationMs: number, type: OscillatorType = 'sawtooth') {
  const c = ensureContext();
  if (!c || !master) return;
  if (c.state === 'suspended') c.resume().catch(() => {});
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  const now = c.currentTime;
  const dur = durationMs / 1000;
  osc.frequency.setValueAtTime(from, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), now + dur);
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.6, now + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g).connect(master);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

export function isMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEY) === '1';
}

export function setMuted(muted: boolean) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function play(name: Sound) {
  if (typeof window === 'undefined') return;
  if (reducedMotion()) return;
  if (isMuted()) return;
  switch (name) {
    case 'beep':
      tone(880, 60, 'square');
      break;
    case 'chord':
      tone(261.63, 280, 'sine');
      tone(329.63, 280, 'sine');
      tone(392.0, 280, 'sine');
      break;
    case 'click':
      tone(1200, 12, 'sine', 0.7);
      break;
    case 'ding':
      tone(1568, 180, 'triangle');
      break;
    case 'glitch': {
      const now = Date.now();
      if (now - lastGlitch < 800) return;
      lastGlitch = now;
      sweep(200, 80, 90, 'sawtooth');
      break;
    }
  }
}

export function useSfx() {
  const [muted, setLocal] = useState<boolean>(() => (typeof window === 'undefined' ? false : isMuted()));

  useEffect(() => {
    const sync = () => setLocal(isMuted());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) sync();
    });
    return () => {
      window.removeEventListener(EVENT, sync);
    };
  }, []);

  return {
    muted,
    toggle: () => {
      const next = !isMuted();
      setMuted(next);
      if (!next) play('click');
    },
    play,
  };
}
