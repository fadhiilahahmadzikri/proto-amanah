import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BadgeVariant } from '@/types/portal.types';

export function StatusBadge(props: {
  variant: BadgeVariant;
  text: string;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const isDark = props.theme === 'dark';

  if (props.variant === 'live') {
    return (
      <div
        className={cn(
          'px-2.5 py-1 rounded-md flex items-center gap-1.5 shrink-0 select-none transition-colors',
          isDark
            ? 'bg-red-950/70 text-red-400'
            : 'bg-red-50 text-red-500',
          props.className,
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
        <span className="text-[10px] font-bold tracking-tight">{props.text}</span>
      </div>
    );
  }

  if (props.variant === 'trend') {
    return (
      <div
        className={cn(
          'px-2.5 py-1 rounded-md flex items-center gap-1 shrink-0 select-none transition-colors',
          isDark
            ? 'bg-blue-950/70 text-cyan-400 border border-cyan-500/20'
            : 'bg-blue-50 text-[#0A44FF] border border-blue-100',
          props.className,
        )}
      >
        <TrendingUp className="h-2.5 w-2.5 stroke-[3] shrink-0" />
        <span className="text-[10px] font-bold tracking-tight">{props.text}</span>
      </div>
    );
  }

  if (props.variant === 'primary') {
    return (
      <span
        className={cn(
          'text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-sm shrink-0 select-none transition-colors',
          isDark ? 'bg-blue-600 shadow-blue-900/30' : 'bg-[#0A44FF]',
          props.className,
        )}
      >
        {props.text}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-sm shrink-0 select-none transition-colors',
        isDark ? 'bg-sky-600 shadow-sky-950/30' : 'bg-sky-500',
        props.className,
      )}
    >
      {props.text}
    </span>
  );
}
