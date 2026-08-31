import { Stethoscope, Users } from 'lucide-react';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { cn } from '@/lib/utils';
import type { ActivityMetric } from '@/types/portal.types';

export function ActivityCard(props: {
  item: ActivityMetric;
  onClick?: () => void;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const isBlue = props.item.glowVariant === 'blue';

  return (
    <div
      onClick={props.onClick}
      className={cn(
        'flex-1 relative overflow-hidden rounded-[24px] p-4 group cursor-pointer active:scale-[0.98] transition-all duration-300 select-none',
        isDark
          ? 'bg-neutral-900/90 text-white shadow-2xl shadow-black/50 backdrop-blur-xl'
          : 'bg-white text-slate-900 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.08)]',
        props.className,
      )}
    >
      {/* Corner Ambient Gradient Glow */}
      <div
        className={cn(
          'absolute -right-6 w-28 h-28 rounded-full blur-[20px] group-hover:scale-125 transition-transform duration-700 pointer-events-none',
          isBlue
            ? '-top-6 bg-gradient-to-br from-[#0d66e9]/20 to-[#00D4FF]/10'
            : '-bottom-6 bg-gradient-to-tl from-[#0d66e9]/20 to-[#38BDF8]/15',
        )}
      />

      <div className="relative z-10 flex flex-col justify-between h-full gap-4">
        {/* Top Icon & Badge */}
        <div className="flex justify-between items-start">
          <div
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors',
              isDark
                ? isBlue
                  ? 'bg-blue-950/70 text-cyan-400'
                  : 'bg-indigo-950/70 text-sky-400'
                : isBlue
                  ? 'bg-blue-50 text-[#0d66e9]'
                  : 'bg-sky-50 text-[#0284C7]',
            )}
          >
            {props.item.icon === 'users' ? (
              <Users className="h-4 w-4 stroke-[2.4]" />
            ) : (
              <Stethoscope className="h-4 w-4 stroke-[2.4]" />
            )}
          </div>

          <StatusBadge
            variant={props.item.badgeType}
            text={props.item.badgeText}
            theme={props.theme}
          />
        </div>

        {/* Counter Metric */}
        <div className="flex flex-col mt-1">
          <span
            className={cn(
              'text-[11px] font-semibold mb-1',
              isDark ? 'text-neutral-400' : 'text-slate-500',
            )}
          >
            {props.item.title}
          </span>
          <div className="flex items-end gap-1.5">
            <span
              className={cn(
                'font-black text-[32px] leading-none tracking-tighter tabular-nums',
                isDark ? 'text-white' : 'text-slate-800',
              )}
            >
              {props.item.count}
            </span>
            <span
              className={cn(
                'text-[11px] font-medium pb-0.5',
                isDark ? 'text-neutral-400' : 'text-slate-400',
              )}
            >
              {props.item.unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
