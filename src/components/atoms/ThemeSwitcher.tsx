'use client';

import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeSwitcher(props: {
  theme: 'dark' | 'light';
  onToggle: () => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';

  return (
    <button
      type="button"
      onClick={props.onToggle}
      aria-label={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
      className={cn(
        'group relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all duration-300 backdrop-blur-2xl active:scale-90 cursor-pointer select-none',
        isDark
          ? 'bg-neutral-900/80 hover:bg-neutral-800 text-amber-300 border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
          : 'bg-white/80 hover:bg-white text-neutral-800 border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
        props.className,
      )}
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      {/* Liquid Glass Ambient Sheen */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-60" />

      {/* Sun Icon (shows in dark mode) */}
      <Sun
        className={cn(
          'h-5 w-5 transition-all duration-500 ease-out transform',
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-0 opacity-0 absolute',
        )}
      />

      {/* Moon Icon (shows in light mode) */}
      <Moon
        className={cn(
          'h-5 w-5 transition-all duration-500 ease-out transform',
          !isDark
            ? 'rotate-0 scale-100 opacity-100 text-indigo-600'
            : '-rotate-90 scale-0 opacity-0 absolute',
        )}
      />
    </button>
  );
}
