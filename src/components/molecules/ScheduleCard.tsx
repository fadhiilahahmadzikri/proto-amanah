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
        'relative w-full rounded-[24px] p-5 border select-none transition-colors duration-300 overflow-hidden',
        isDark
          ? 'bg-neutral-900/95 border-white/15 text-white shadow-2xl shadow-black/50 backdrop-blur-xl'
          : 'bg-white/95 border-slate-100/90 text-slate-800 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] backdrop-blur-md',
        props.className,
      )}
      style={props.style}
    >
      {/* 3D Flowing Wave Petal Texture Overlay (Subtle, elegant White-Gray dimensional curves) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px] z-0">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 340 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Light Theme White-on-White Gradients */}
            <linearGradient id="wave-grad-1-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="wave-grad-2-light" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#f8fafc" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="wave-grad-3-light" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="stroke-grad-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.2" />
            </linearGradient>

            {/* Dark Theme Metallic Obsidian Gradients */}
            <linearGradient id="wave-grad-1-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="wave-grad-2-dark" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="stroke-grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Primary Sweeping Petal Wave */}
          <path
            d="M-30,190 C60,110 130,50 350,15 L350,190 Z"
            fill={isDark ? 'url(#wave-grad-1-dark)' : 'url(#wave-grad-1-light)'}
            stroke={isDark ? 'url(#stroke-grad-dark)' : 'url(#stroke-grad-light)'}
            strokeWidth="1.2"
          />

          {/* Intersecting Secondary Translucent Wave */}
          <path
            d="M40,-20 C140,40 210,120 370,95 L370,-20 Z"
            fill={isDark ? 'url(#wave-grad-2-dark)' : 'url(#wave-grad-2-light)'}
            stroke={isDark ? 'url(#stroke-grad-dark)' : 'url(#stroke-grad-light)'}
            strokeWidth="1.2"
          />

          {/* Third Delicate Ripple Curve */}
          <path
            d="M120,190 C180,130 250,90 360,130 L360,190 Z"
            fill={isDark ? 'url(#wave-grad-1-dark)' : 'url(#wave-grad-3-light)'}
            stroke={isDark ? 'url(#stroke-grad-dark)' : 'url(#stroke-grad-light)'}
            strokeWidth="0.8"
          />
        </svg>

        {/* Specular Sheen Layer */}
        <div
          className={cn(
            'absolute inset-0 pointer-events-none',
            isDark
              ? 'bg-gradient-to-tr from-white/5 via-transparent to-cyan-500/5'
              : 'bg-gradient-to-tr from-white/50 via-transparent to-slate-100/30',
          )}
        />
      </div>

      {/* Foreground Content with Harmonious Hierarchy */}
      <div className="relative z-10">
        {/* Top Header: Schedule Title, Date & Dismiss Icon */}
        <div className="flex justify-between items-start mb-3.5">
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
        <div className="flex justify-between items-center mb-3.5">
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
          />
        </div>

        {/* Footer: Poli & Room info + Slot info */}
        <div
          className={cn(
            'flex justify-between items-end pt-2 border-t',
            isDark ? 'border-white/10' : 'border-slate-200/60',
          )}
        >
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
