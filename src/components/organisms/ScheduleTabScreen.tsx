'use client';

import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import React from 'react';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import portalData from '@/data/portal/portal-data.json';
import { cn } from '@/lib/utils';
import type { DoctorSchedule } from '@/types/portal.types';

export function ScheduleTabScreen(props: {
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const [selectedDay, setSelectedDay] = React.useState(1);
  const schedules = portalData.schedules as DoctorSchedule[];

  const days = [
    { day: 'Sen', date: '20' },
    { day: 'Sel', date: '21' },
    { day: 'Rab', date: '22' },
    { day: 'Kam', date: '23' },
    { day: 'Jum', date: '24' },
    { day: 'Sab', date: '25' },
  ];

  // Inset by 1px so strokeWidth=1.5 is never clipped
  const ticketPath =
    'M 1 21 A 20 20 0 0 1 21 1 L 319 1 A 20 20 0 0 1 339 21 L 339 69 A 10 10 0 0 0 339 89 L 339 127 A 20 20 0 0 1 319 147 L 21 147 A 20 20 0 0 1 1 127 L 1 89 A 10 10 0 0 0 1 69 Z';

  return (
    <div className={cn('flex flex-col gap-5 pt-2 pb-28 select-text', props.className)}>
      {/* Title Header */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2
            className={cn(
              'text-xl font-bold tracking-tight',
              isDark ? 'text-white' : 'text-slate-900',
            )}
          >
            Jadwal Praktek
          </h2>
          <p
            className={cn(
              'text-xs mt-0.5',
              isDark ? 'text-neutral-400' : 'text-slate-500',
            )}
          >
            Mei 2026
          </p>
        </div>
        <div
          className={cn(
            'p-2 rounded-xl border backdrop-blur-md',
            isDark
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-blue-50 border-blue-100 text-blue-600',
          )}
        >
          <Calendar className="h-4 w-4" />
        </div>
      </div>

      {/* Date Pill Selector */}
      <div className="flex justify-between gap-1.5 px-0.5">
        {days.map((d, idx) => {
          const isSelected = selectedDay === idx;
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => setSelectedDay(idx)}
              className={cn(
                'flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl flex-1 transition-all cursor-pointer select-none',
                isSelected
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25 scale-105'
                  : isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white/80 font-medium backdrop-blur-md border border-white/15'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium border border-slate-200/60',
              )}
            >
              <span className="text-[10px] font-medium tracking-wide">{d.day}</span>
              <span className="text-sm font-black mt-0.5 tabular-nums">{d.date}</span>
            </button>
          );
        })}
      </div>

      {/* Schedule Items List */}
      <div className="flex flex-col gap-3.5 mt-1">
        <h3
          className={cn(
            'text-xs font-semibold tracking-tight px-1',
            isDark ? 'text-slate-400' : 'text-slate-600',
          )}
        >
          Sesi praktek tersedia
        </h3>

        {schedules.map((sch) => {
          const cardClipId = `sch-clip-${sch.id}`;

          return (
            <div
              key={sch.id}
              className="relative w-full h-[148px] select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
            >
              {/* True SVG Ticket Silhouette with 100% Unclipped Stroke */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 340 148"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <clipPath id={cardClipId}>
                    <path d={ticketPath} />
                  </clipPath>
                </defs>

                {/* Card Background Fill & Crisp Border Contour */}
                <path
                  d={ticketPath}
                  fill={isDark ? 'rgba(23, 23, 23, 0.95)' : '#ffffff'}
                  stroke={isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(203, 213, 225, 0.9)'}
                  strokeWidth="1.2"
                />

                {/* Wall-to-Wall Perforated Connector Line between the "C" Notches */}
                <g clipPath={`url(#${cardClipId})`}>
                  <line
                    x1="10"
                    y1="79"
                    x2="330"
                    y2="79"
                    stroke={isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(203, 213, 225, 0.95)'}
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </g>
              </svg>

              {/* Foreground Content */}
              <div className="relative z-10 flex flex-col justify-between h-full p-4">
                {/* Top Section */}
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className={cn(
                        'text-sm font-bold block',
                        isDark ? 'text-white' : 'text-slate-800',
                      )}
                    >
                      {sch.title}
                    </span>
                    <span
                      className={cn(
                        'text-[11px] font-medium',
                        isDark ? 'text-neutral-400' : 'text-slate-500',
                      )}
                    >
                      {sch.date}
                    </span>
                  </div>
                  <StatusBadge
                    variant={sch.badgeVariant}
                    text={sch.badge}
                    theme={props.theme}
                  />
                </div>

                {/* Bottom Section */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div
                      className={cn(
                        'flex items-center gap-1.5 font-semibold',
                        isDark ? 'text-cyan-400' : 'text-blue-600',
                      )}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span>{sch.time}</span>
                    </div>
                    <div
                      className={cn(
                        'flex items-center gap-1 text-[11px]',
                        isDark ? 'text-neutral-400' : 'text-slate-500',
                      )}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{sch.poli} • {sch.room}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-100 dark:border-white/5">
                    <div
                      className={cn(
                        'flex items-center gap-1 font-semibold',
                        isDark ? 'text-emerald-400' : 'text-emerald-600',
                      )}
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>{sch.slotCount} Pasien</span>
                    </div>
                    <button
                      type="button"
                      className={cn(
                        'text-[10px] font-bold hover:underline cursor-pointer',
                        isDark ? 'text-cyan-400' : 'text-blue-600',
                      )}
                    >
                      Kelola antrean →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
