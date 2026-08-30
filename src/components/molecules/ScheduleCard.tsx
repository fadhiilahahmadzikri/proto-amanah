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

  // Inset by 1px so strokeWidth=1.2 is 100% visible and never clipped
  const ticketPath =
    'M 1 25 A 24 24 0 0 1 25 1 L 315 1 A 24 24 0 0 1 339 25 L 339 103 A 11 11 0 0 0 339 125 L 339 147 A 24 24 0 0 1 315 171 L 25 171 A 24 24 0 0 1 1 147 L 1 125 A 11 11 0 0 0 1 103 Z';

  return (
    <div
      className={cn(
        'relative w-full h-[172px] select-none transition-all duration-300 drop-shadow-[0_12px_28px_rgba(0,0,0,0.06)] group',
        isDark && 'drop-shadow-[0_14px_32px_rgba(0,0,0,0.4)]',
        props.className,
      )}
      style={props.style}
    >
      {/* SVG Ticket Silhouette, 3D Crystal Texture & Seamless Liquid Glass Gradient */}
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

          {/* Seamless Liquid Glass Gradient Mask (Light White vs Dark Obsidian) */}
          <linearGradient id={`${clipId}-liquid-glass`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              stopColor={isDark ? '#060b18' : '#ffffff'}
              stopOpacity={isDark ? 0.96 : 0.95}
            />
            <stop
              offset="45%"
              stopColor={isDark ? '#060b18' : '#ffffff'}
              stopOpacity={isDark ? 0.92 : 0.90}
            />
            <stop
              offset="64%"
              stopColor={isDark ? '#0b1329' : '#ffffff'}
              stopOpacity={isDark ? 0.60 : 0.45}
            />
            <stop
              offset="82%"
              stopColor={isDark ? '#0b1329' : '#ffffff'}
              stopOpacity={isDark ? 0.15 : 0.10}
            />
            <stop
              offset="100%"
              stopColor={isDark ? '#0b1329' : '#ffffff'}
              stopOpacity={0.0}
            />
          </linearGradient>

          {/* Top-to-Bottom Glass Specular Sheen */}
          <linearGradient id={`${clipId}-glass-sheen`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor="#ffffff"
              stopOpacity={isDark ? 0.12 : 0.4}
            />
            <stop
              offset="35%"
              stopColor={isDark ? '#38bdf8' : '#ffffff'}
              stopOpacity={isDark ? 0.04 : 0.15}
            />
            <stop
              offset="100%"
              stopColor={isDark ? '#000000' : '#ffffff'}
              stopOpacity={0.0}
            />
          </linearGradient>
        </defs>

        {/* Base Solid Card Fill */}
        <path
          d={ticketPath}
          fill={isDark ? '#060b18' : '#ffffff'}
          stroke={isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(226, 232, 240, 0.95)'}
          strokeWidth="1.2"
        />

        {/* Clipped 3D Crystal & Liquid Glass Overlays */}
        <g clipPath={`url(#${clipId})`}>
          {/* 3D Geometric Crystal Architecture Image Texture (Light vs Dark) */}
          <image
            href={isDark ? '/assets/images/schedule-card-bg-dark.png' : '/assets/images/schedule-card-bg.png'}
            x="0"
            y="0"
            width="340"
            height="172"
            preserveAspectRatio="xMidYMid slice"
          />

          {/* Seamless Liquid Glass Gradient Mask */}
          <rect
            x="0"
            y="0"
            width="340"
            height="172"
            fill={`url(#${clipId}-liquid-glass)`}
          />

          {/* Top Specular Glass Sheen */}
          <rect
            x="0"
            y="0"
            width="340"
            height="172"
            fill={`url(#${clipId}-glass-sheen)`}
          />

          {/* Wall-to-Wall Perforated Connector Line between the "C" Notches */}
          <line
            x1="10"
            y1="114"
            x2="330"
            y2="114"
            stroke={isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(203, 213, 225, 0.9)'}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </g>
      </svg>

      {/* Foreground Content with Contextual Palette Typography */}
      <div className="relative z-10 flex flex-col justify-between h-full p-4.5">
        {/* Top Header: Schedule Title, Date & Minimalist Dismiss Icon */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span
              className={cn(
                'text-[15.5px] font-black tracking-tight leading-tight',
                isDark ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]' : 'text-[#03045e]',
              )}
            >
              {props.schedule.title}
            </span>
            <span
              className={cn(
                'text-[11.5px] font-medium mt-0.5',
                isDark ? 'text-slate-300' : 'text-[#64748b]',
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
                'p-1.5 -mr-1 rounded-full transition-all active:scale-90 cursor-pointer focus:outline-none shadow-2xs',
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white backdrop-blur-md'
                  : 'bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-[#03045e]',
              )}
            >
              <X className="h-3.5 w-3.5 stroke-[2.2]" />
            </button>
          )}
        </div>

        {/* Center: Compact Primary Time & Status Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={cn(
              'text-[19.5px] sm:text-[20.5px] font-black tracking-tight leading-none',
              isDark ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-[#023e8a]',
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

        {/* Footer: Simplified & Clean Single-Tier Breakdown */}
        <div className="flex items-end justify-between pt-1">
          {/* Poli & Room info */}
          <div className="flex flex-col min-w-0 max-w-[58%]">
            <span
              className={cn(
                'font-extrabold text-[12.5px] truncate leading-tight',
                isDark ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]' : 'text-[#03045e]',
              )}
            >
              {props.schedule.poli}
            </span>
            <span
              className={cn(
                'text-[11px] font-medium leading-tight mt-0.5',
                isDark ? 'text-slate-300' : 'text-[#64748b]',
              )}
            >
              {props.schedule.room}
            </span>
          </div>

          {/* Clean Integrated Booking Pill in Liquid Glass Pill Style */}
          <div
            className={cn(
              'px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight shadow-2xs shrink-0 flex items-center gap-1',
              isDark
                ? 'bg-white/10 border border-white/20 text-cyan-300 backdrop-blur-md'
                : 'bg-sky-50 border border-sky-100 text-[#023e8a]',
            )}
          >
            <span>{props.schedule.slotCount} {props.schedule.slotText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
