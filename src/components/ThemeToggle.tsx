import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/theme';
import { play } from '../lib/sfx';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, , toggle] = useTheme();

  return (
    <button
      type="button"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => {
        play('click');
        toggle();
      }}
      className={`relative w-9 h-9 rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 overflow-hidden ${className}`}
    >
      <Sun
        className={`absolute inset-0 m-auto w-5 h-5 transition-all duration-300 ${
          theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
        }`}
      />
      <Moon
        className={`absolute inset-0 m-auto w-5 h-5 transition-all duration-300 ${
          theme === 'dark' ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
      />
    </button>
  );
}
