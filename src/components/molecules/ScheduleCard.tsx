import { X } from 'lucide-react';
import type React from 'react';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { cn } from '@/lib/utils';
import type { DoctorSchedule } from '@/types/portal.types';

export function ScheduleCard(props: {
  schedule: DoctorSchedule;
  onDismiss?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        'w-full rounded-[24px] p-5 bg-white border border-slate-100 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.08)] select-none',
        props.className,
      )}
      style={props.style}
    >
      {/* Top Header: Schedule Title, Date & Dismiss Icon */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-[14px] font-bold text-slate-800 tracking-tight">
            {props.schedule.title}
          </span>
          <span className="text-[11px] font-medium text-slate-500 mt-0.5">
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
            className="text-slate-400 hover:text-slate-600 active:scale-90 p-1 -mr-1 transition-transform cursor-pointer focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Center: Time & Badge */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[26px] font-extrabold tracking-tight text-slate-900 leading-none">
          {props.schedule.time}
        </span>
        <StatusBadge
          variant={props.schedule.badgeVariant}
          text={props.schedule.badge}
        />
      </div>

      {/* Footer: Poli & Room info + Slot info */}
      <div className="flex justify-between items-end pt-1 border-t border-slate-50">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-[13px] text-slate-800">
            {props.schedule.poli}
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {props.schedule.room}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 text-right">
          <span className="font-bold text-[13px] text-slate-800 tabular-nums">
            {props.schedule.slotCount}
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {props.schedule.slotText}
          </span>
        </div>
      </div>
    </div>
  );
}
