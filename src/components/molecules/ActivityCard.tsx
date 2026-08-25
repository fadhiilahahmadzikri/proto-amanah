import { Stethoscope, Users } from 'lucide-react';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { cn } from '@/lib/utils';
import type { ActivityMetric } from '@/types/portal.types';

export function ActivityCard(props: {
  item: ActivityMetric;
  onClick?: () => void;
  className?: string;
}) {
  const isBlue = props.item.glowVariant === 'blue';

  return (
    <div
      onClick={props.onClick}
      className={cn(
        'flex-1 relative overflow-hidden bg-white rounded-[24px] p-4 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.04)] border border-slate-100 group cursor-pointer hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-all duration-200 select-none',
        props.className,
      )}
    >
      {/* Corner Ambient Gradient Glow */}
      <div
        className={cn(
          'absolute -right-6 w-28 h-28 rounded-full blur-[20px] group-hover:scale-125 transition-transform duration-700 pointer-events-none',
          isBlue
            ? '-top-6 bg-gradient-to-br from-[#0A44FF]/20 to-[#00D4FF]/10'
            : '-bottom-6 bg-gradient-to-tl from-[#00D4FF]/10 to-[#38c474]/20',
        )}
      />

      <div className="relative z-10 flex flex-col justify-between h-full gap-4">
        {/* Top Icon & Badge */}
        <div className="flex justify-between items-start">
          <div
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
              isBlue ? 'bg-blue-50 text-[#0A44FF]' : 'bg-emerald-50 text-emerald-500',
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
          />
        </div>

        {/* Counter Metric */}
        <div className="flex flex-col mt-1">
          <span className="text-slate-500 text-[11px] font-semibold mb-1">
            {props.item.title}
          </span>
          <div className="flex items-end gap-1.5">
            <span className="font-black text-slate-800 text-[32px] leading-none tracking-tighter tabular-nums">
              {props.item.count}
            </span>
            <span className="text-slate-400 text-[11px] font-medium pb-0.5">
              {props.item.unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
