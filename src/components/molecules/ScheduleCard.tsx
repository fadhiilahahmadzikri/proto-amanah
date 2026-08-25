import { X } from 'lucide-react';
import type React from 'react';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { cn } from '@/lib/utils';
import type { DoctorSchedule } from '@/types/portal.types';

export function ScheduleCard(props: {
  schedule: DoctorSchedule;
  onDismiss?: () => void;
  theme?: 'dark' | 'light';
  className?: string;
  style?: React.CSSProperties;
}) {
  const isDark = props.theme === 'dark';

  return (
    <div
      className={cn(
        'w-full rounded-[24px] p-5 border select-none transition-colors duration-300',
        isDark
          ? 'bg-neutral-900/90 border-white/15 text-white shadow-2xl shadow-black/50 backdrop-blur-xl'
          : 'bg-white border-slate-100 text-slate-900 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.08)]',
        props.className,
      )}
      style={props.style}
    >
      {/* Top Header: Schedule Title, Date & Dismiss Icon */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span
            className={cn(
              'text-[14px] font-bold tracking-tight',
              isDark ? 'text-white' : 'text-slate-800',
            )}
          >
            {props.schedule.title}
          </span>
          <span
            className={cn(
              'text-[11px] font-medium mt-0.5',
              isDark ? 'text-neutral-400' : 'text-slate-500',
            )}
          >
            {props.schedule.date}
          </span>
        </div>
        {props.onDismiss && (
          <button
            type="button"
            aria-label="Tutup jadwal"
            onClick={(e) => {
              e.stopPropagation();
              props.onDismiss?.();
            }}
            className={cn(
              'p-1 -mr-1 transition-transform active:scale-90 cursor-pointer focus:outline-none',
              isDark
                ? 'text-neutral-400 hover:text-white'
                : 'text-slate-400 hover:text-slate-600',
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Center: Time & Badge */}
      <div className="flex justify-between items-center mb-4">
        <span
          className={cn(
            'text-[26px] font-extrabold tracking-tight leading-none',
            isDark ? 'text-white' : 'text-slate-900',
          )}
        >
          {props.schedule.time}
        </span>
        <StatusBadge
          variant={props.schedule.badgeVariant}
          text={props.schedule.badge}
        />
      </div>

      {/* Footer: Poli & Room info + Slot info */}
      <div
        className={cn(
          'flex justify-between items-end pt-1 border-t',
          isDark ? 'border-white/10' : 'border-slate-50',
        )}
      >
        <div className="flex flex-col gap-0.5">
          <span
            className={cn(
              'font-bold text-[13px]',
              isDark ? 'text-white' : 'text-slate-800',
            )}
          >
            {props.schedule.poli}
          </span>
          <span
            className={cn(
              'text-[11px] font-medium',
              isDark ? 'text-neutral-400' : 'text-slate-500',
            )}
          >
            {props.schedule.room}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 text-right">
          <span
            className={cn(
              'font-bold text-[13px] tabular-nums',
              isDark ? 'text-white' : 'text-slate-800',
            )}
          >
            {props.schedule.slotCount}
          </span>
          <span
            className={cn(
              'text-[11px] font-medium',
              isDark ? 'text-neutral-400' : 'text-slate-500',
            )}
          >
            {props.schedule.slotText}
          </span>
        </div>
      </div>
    </div>
  );
}
