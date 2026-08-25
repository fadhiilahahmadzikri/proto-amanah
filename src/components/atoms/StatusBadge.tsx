import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BadgeVariant } from '@/types/portal.types';

export function StatusBadge(props: {
  variant: BadgeVariant;
  text: string;
  className?: string;
}) {
  if (props.variant === 'live') {
    return (
      <div
        className={cn(
          'bg-red-50 text-red-500 px-2 py-1 rounded-md flex items-center gap-1.5 border border-red-100 shrink-0 select-none',
          props.className,
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
        <span className="text-[9px] font-black tracking-wider uppercase">{props.text}</span>
      </div>
    );
  }

  if (props.variant === 'trend') {
    return (
      <div
        className={cn(
          'bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md flex items-center gap-1 border border-emerald-100 shrink-0 select-none',
          props.className,
        )}
      >
        <TrendingUp className="h-2.5 w-2.5 stroke-[3] shrink-0" />
        <span className="text-[9px] font-black tracking-wider">{props.text}</span>
      </div>
    );
  }

  if (props.variant === 'primary') {
    return (
      <span
        className={cn(
          'bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-sm shrink-0 select-none',
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
        'bg-[#38c474] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-sm shrink-0 select-none',
        props.className,
      )}
    >
      {props.text}
    </span>
  );
}
