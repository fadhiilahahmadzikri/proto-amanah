import { X } from 'lucide-react';
import React from 'react';
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
  const clipId = React.useId().replace(/:/g, '-');

  const ticketPath =
    'M 0 24 A 24 24 0 0 1 24 0 L 316 0 A 24 24 0 0 1 340 24 L 340 104 A 10 10 0 0 0 340 124 L 340 148 A 24 24 0 0 1 316 172 L 24 172 A 24 24 0 0 1 0 148 L 0 124 A 10 10 0 0 0 0 104 Z';

  return (
    <div
      className={cn(
        'relative w-full h-[172px] select-none transition-colors duration-300 drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)]',
        props.className,
      )}
      style={props.style}
    >
      {/* SVG Ticket Silhouette, 3D Wave Textures & Perforated Divider */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 340 172"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Card Boundary ClipPath */}
          <clipPath id={clipId}>
            <path d={ticketPath} />
          </clipPath>

          {/* Light Theme White-on-White Wave Gradients */}
          <linearGradient id={`${clipId}-wave-1-light`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id={`${clipId}-wave-2-light`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#f8fafc" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id={`${clipId}-stroke-light`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.2" />
          </linearGradient>

          {/* Dark Theme Obsidian Gradients */}
          <linearGradient id={`${clipId}-wave-1-dark`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id={`${clipId}-wave-2-dark`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* Card Background Fill & Border Contour (Curving smoothly through "C" notches) */}
        <path
          d={ticketPath}
          fill={isDark ? 'rgba(23, 23, 23, 0.95)' : 'rgba(255, 255, 255, 0.98)'}
          stroke={isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(226, 232, 240, 0.9)'}
          strokeWidth="1.2"
        />

        {/* Clipped Wave Petal Textures & Perforated Connector Line */}
        <g clipPath={`url(#${clipId})`}>
          {/* Primary Sweeping Petal Wave */}
          <path
            d="M-30,190 C60,110 130,50 350,15 L350,190 Z"
            fill={isDark ? `url(#${clipId}-wave-1-dark)` : `url(#${clipId}-wave-1-light)`}
            stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : `url(#${clipId}-stroke-light)`}
            strokeWidth="1.2"
          />

          {/* Intersecting Secondary Translucent Wave */}
          <path
            d="M40,-20 C140,40 210,120 370,95 L370,-20 Z"
            fill={isDark ? `url(#${clipId}-wave-2-dark)` : `url(#${clipId}-wave-2-light)`}
            stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : `url(#${clipId}-stroke-light)`}
            strokeWidth="1.2"
          />

          {/* Wall-to-Wall Perforated Connector Line between the "C" Notches */}
          <line
            x1="10"
            y1="114"
            x2="330"
            y2="114"
            stroke={isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(203, 213, 225, 0.95)'}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </g>
      </svg>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-4.5">
        {/* Top Header: Schedule Title, Date & Dismiss Icon */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span
              className={cn(
                'text-[14px] font-bold tracking-tight',
                isDark ? 'text-white' : 'text-[#1e293b]',
              )}
            >
              {props.schedule.title}
            </span>
            <span
              className={cn(
                'text-[11px] font-medium mt-0.5',
                isDark ? 'text-slate-400' : 'text-[#64748b]',
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
                  : 'text-slate-400 hover:text-slate-700',
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
              'text-[26px] font-extrabold tracking-tight leading-none drop-shadow-xs',
              isDark ? 'text-white' : 'text-[#0f172a]',
            )}
          >
            {props.schedule.time}
          </span>
          <StatusBadge
            variant={props.schedule.badgeVariant}
            text={props.schedule.badge}
            theme={props.theme}
          />
        </div>

        {/* Footer: Poli & Room info + Slot info */}
        <div className="flex justify-between items-end pt-1">
          <div className="flex flex-col gap-0.5">
            <span
              className={cn(
                'font-bold text-[13px]',
                isDark ? 'text-white' : 'text-[#1e293b]',
              )}
            >
              {props.schedule.poli}
            </span>
            <span
              className={cn(
                'text-[11px] font-medium',
                isDark ? 'text-slate-400' : 'text-[#64748b]',
              )}
            >
              {props.schedule.room}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 text-right">
            <span
              className={cn(
                'font-bold text-[13px] tabular-nums',
                isDark ? 'text-white' : 'text-[#1e293b]',
              )}
            >
              {props.schedule.slotCount}
            </span>
            <span
              className={cn(
                'text-[11px] font-medium',
                isDark ? 'text-slate-400' : 'text-[#64748b]',
              )}
            >
              {props.schedule.slotText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
