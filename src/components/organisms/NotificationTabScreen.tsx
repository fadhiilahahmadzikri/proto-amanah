'use client';

import { Activity, Bell, CheckCheck, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NotificationTabScreen(props: {
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const isDark = props.theme === 'dark';

  const notifications = [
    {
      id: 'notif_1',
      title: 'Antrean Pasien Baru',
      desc: 'Pasien an. Kevin Sanjaya (08:15) telah check-in di Poli Anak.',
      time: '10 menit yang lalu',
      type: 'queue',
      isUnread: true,
    },
    {
      id: 'notif_2',
      title: 'Hasil Lab Tersedia',
      desc: 'Hasil tes darah lengkap pasien Ny. Ratna Dewi siap ditinjau.',
      time: '35 menit yang lalu',
      type: 'lab',
      isUnread: true,
    },
    {
      id: 'notif_3',
      title: 'Pengingat Jadwal Siang',
      desc: 'Sesi praktek Poli Umum dimulai pukul 13:00 WIB di Room 105.',
      time: '2 jam yang lalu',
      type: 'schedule',
      isUnread: false,
    },
  ];

  return (
    <div className={cn('flex flex-col gap-4 pt-2 pb-28 select-text', props.className)}>
      {/* Title Header */}
      <div className="flex justify-between items-center px-1 mb-1">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Pusat Notifikasi
          </h2>
          <p className="text-xs text-white/80 mt-0.5">
            2 notifikasi baru belum dibaca
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-[11px] font-bold text-white/90 bg-white/10 hover:bg-white/20 border border-white/20 py-1.5 px-3 rounded-full backdrop-blur-md transition-colors cursor-pointer"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          <span>Tandai Baca</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-3">
        {notifications.map((item) => {
          return (
            <div
              key={item.id}
              className={cn(
                'flex items-start gap-3.5 p-4 rounded-[22px] border transition-all cursor-pointer select-none',
                item.isUnread
                  ? isDark
                    ? 'bg-neutral-900/90 border-blue-500/40 text-white shadow-lg'
                    : 'bg-white border-blue-200/80 text-slate-900 shadow-sm ring-1 ring-blue-500/10'
                  : isDark
                    ? 'bg-neutral-900/50 border-white/5 text-neutral-300'
                    : 'bg-white/80 border-slate-100 text-slate-700',
              )}
            >
              <div
                className={cn(
                  'h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5',
                  isDark
                    ? item.type === 'queue'
                      ? 'bg-blue-950/60 text-cyan-400'
                      : item.type === 'lab'
                        ? 'bg-emerald-950/60 text-emerald-400'
                        : 'bg-amber-950/60 text-amber-400'
                    : item.type === 'queue'
                      ? 'bg-blue-50 text-blue-600'
                      : item.type === 'lab'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600',
                )}
              >
                {item.type === 'queue' ? (
                  <Activity className="h-5 w-5" />
                ) : item.type === 'lab' ? (
                  <FileText className="h-5 w-5" />
                ) : (
                  <Bell className="h-5 w-5" />
                )}
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{item.title}</span>
                  <span className="text-[10px] text-neutral-400 tabular-nums">
                    {item.time}
                  </span>
                </div>
                <p
                  className={cn(
                    'text-[11px] mt-1 leading-relaxed',
                    isDark ? 'text-neutral-400' : 'text-neutral-500',
                  )}
                >
                  {item.desc}
                </p>
              </div>

              {item.isUnread && (
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
