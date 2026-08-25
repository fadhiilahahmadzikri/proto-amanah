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

  const ticketPath =
    'M 0 20 A 20 20 0 0 1 20 0 L 320 0 A 20 20 0 0 1 340 20 L 340 70 A 9 9 0 0 0 340 88 L 340 128 A 20 20 0 0 1 320 148 L 20 148 A 20 20 0 0 1 0 128 L 0 88 A 9 9 0 0 0 0 70 Z';

  return (
    <div className={cn('flex flex-col gap-5 pt-2 pb-28 select-text', props.className)}>
      {/* Title Header */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Jadwal Praktek
          </h2>
          <p className="text-xs text-white/80 mt-0.5">
            Mei 2026 • Rumah Sakit Amanah
          </p>
        </div>
        <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
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
                  ? 'bg-white text-blue-600 font-bold shadow-md shadow-black/10 scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white/80 font-medium backdrop-blur-md border border-white/15',
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
            'text-xs font-bold tracking-tight px-1',
            isDark ? 'text-neutral-400' : 'text-slate-600',
          )}
        >
          Sesi praktek tersedia
        </h3>

        {schedules.map((sch) => {
          const cardClipId = `sch-clip-${sch.id}`;

          return (
            <div
              key={sch.id}
              className="relative w-full h-[148px] select-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
            >
              {/* True SVG Ticket Silhouette with C Cutout Notches */}
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

                {/* Card Background Fill & Border Contour */}
                <path
                  d={ticketPath}
                  fill={isDark ? 'rgba(23, 23, 23, 0.92)' : 'rgba(255, 255, 255, 0.98)'}
                  stroke={isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(226, 232, 240, 0.9)'}
                  strokeWidth="1.2"
                />

                {/* Wall-to-Wall Perforated Connector Line between the "C" Notches */}
                <g clipPath={`url(#${cardClipId})`}>
                  <line
                    x1="9"
                    y1="79"
                    x2="331"
                    y2="79"
                    stroke={isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(203, 213, 225, 0.9)'}
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
