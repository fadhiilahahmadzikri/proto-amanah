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
              <span className="text-[10px] uppercase tracking-wider">{d.day}</span>
              <span className="text-sm font-black mt-0.5 tabular-nums">{d.date}</span>
            </button>
          );
        })}
      </div>

      {/* Schedule Items List */}
      <div className="flex flex-col gap-3.5 mt-1">
        <h3
          className={cn(
            'text-xs font-bold uppercase tracking-wider px-1',
            isDark ? 'text-neutral-400' : 'text-slate-600',
          )}
        >
          Sesi Praktek Tersedia
        </h3>

        {schedules.map((sch) => (
          <div
            key={sch.id}
            className={cn(
              'rounded-[22px] p-4.5 border transition-all select-none',
              isDark
                ? 'bg-neutral-900/80 border-white/10 text-white shadow-lg'
                : 'bg-white border-slate-100 text-slate-900 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.05)]',
            )}
          >
            <div className="flex justify-between items-start mb-3">
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
                    'text-[11px]',
                    isDark ? 'text-neutral-400' : 'text-slate-500',
                  )}
                >
                  {sch.date}
                </span>
              </div>
              <StatusBadge
                variant={sch.badgeVariant}
                text={sch.badge}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-dashed border-neutral-200/50 dark:border-white/10">
              <div className="flex items-center gap-1.5 text-blue-500 font-semibold">
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

            <div className="flex items-center justify-between mt-2.5 pt-2 text-[11px]">
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Users className="h-3.5 w-3.5" />
                <span>{sch.slotCount} Pasien</span>
              </div>
              <button
                type="button"
                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Kelola Antrean →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
