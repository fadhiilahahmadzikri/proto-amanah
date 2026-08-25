import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ConfigButton(props: {
  onClick: () => void;
  isOpen?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const isDark = props.theme === 'dark';

  return (
    <button
      type="button"
      aria-label="Buka Pengaturan Prototype & Kredensial"
      onClick={props.onClick}
      className={cn(
        'group relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 active:scale-95 cursor-pointer focus:outline-none select-none',
        'border shadow-lg backdrop-blur-xl',
        isDark
          ? 'bg-neutral-900/80 border-white/20 text-white/90 hover:bg-neutral-800 hover:text-white shadow-black/40 ring-1 ring-white/10'
          : 'bg-white/80 border-white/60 text-neutral-800 hover:bg-white hover:text-neutral-950 shadow-neutral-900/10 ring-1 ring-black/5',
        props.isOpen && (isDark ? 'bg-neutral-800 ring-2 ring-blue-500/50' : 'bg-white ring-2 ring-blue-500/50'),
        props.className,
      )}
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      {/* Specular sheen */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/25 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

      <SlidersHorizontal className="h-4 w-4 stroke-[2.2] transition-transform duration-300 group-hover:rotate-180" />
    </button>
  );
}
