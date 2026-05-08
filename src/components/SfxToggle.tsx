import { Volume2, VolumeX } from 'lucide-react';
import { useSfx } from '../lib/sfx';

export default function SfxToggle() {
  const { muted, toggle } = useSfx();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? 'Enable sound effects' : 'Mute sound effects'}
      title={muted ? 'sfx off' : 'sfx on'}
      className="p-2 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
    >
      {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  );
}
