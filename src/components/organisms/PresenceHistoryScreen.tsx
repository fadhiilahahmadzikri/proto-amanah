'use client';

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  QrCode,
} from 'lucide-react';
import React from 'react';
import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import { cn } from '@/lib/utils';

type PresenceStatus = 'on-time' | 'late' | 'leave' | 'holiday';

type PresenceRecord = {
  id: string;
  date: string;
  dayName: string;
  status: PresenceStatus;
  statusLabel: string;
  checkInTime?: string;
  checkOutTime?: string;
  shiftSchedule?: string;
  location?: string;
  method?: string;
  duration?: string;
  note?: string;
};

const MOCK_PRESENCE_RECORDS: PresenceRecord[] = [
  {
    id: 'pr-1',
    date: '26 Agu 2026',
    dayName: 'Rabu',
    status: 'on-time',
    statusLabel: 'Tepat Waktu',
    checkInTime: '07:28 WIB',
    checkOutTime: '17:05 WIB',
    shiftSchedule: '08:00 - 17:00 WIB',
    location: 'Poli Anak • Room 102',
    method: 'QR Code RS Amanah',
    duration: '9j 37m',
  },
  {
    id: 'pr-2',
    date: '25 Agu 2026',
    dayName: 'Selasa',
    status: 'on-time',
    statusLabel: 'Tepat Waktu',
    checkInTime: '07:35 WIB',
    checkOutTime: '16:45 WIB',
    shiftSchedule: '08:00 - 16:30 WIB',
    location: 'Poli Anak • Room 102',
    method: 'QR Code RS Amanah',
    duration: '9j 10m',
  },
  {
    id: 'pr-3',
    date: '24 Agu 2026',
    dayName: 'Senin',
    status: 'late',
    statusLabel: 'Terlambat (4 mnt)',
    checkInTime: '08:04 WIB',
    checkOutTime: '17:15 WIB',
    shiftSchedule: '08:00 - 17:00 WIB',
    location: 'Poli Anak • Room 102',
    method: 'QR Code RS Amanah',
    duration: '9j 11m',
  },
  {
    id: 'pr-4',
    date: '22 Agu 2026',
    dayName: 'Sabtu',
    status: 'on-time',
    statusLabel: 'Tepat Waktu',
    checkInTime: '07:42 WIB',
    checkOutTime: '14:10 WIB',
    shiftSchedule: '08:00 - 14:00 WIB',
    location: 'Klinik Eksekutif • Suite 01',
    method: 'QR Code RS Amanah',
    duration: '6j 28m',
  },
  {
    id: 'pr-5',
    date: '21 Agu 2026',
    dayName: 'Jumat',
    status: 'on-time',
    statusLabel: 'Tepat Waktu',
    checkInTime: '07:25 WIB',
    checkOutTime: '17:30 WIB',
    shiftSchedule: '08:00 - 17:00 WIB',
    location: 'Poli Anak • Room 102',
    method: 'QR Code RS Amanah',
    duration: '10j 05m',
  },
  {
    id: 'pr-6',
    date: '20 Agu 2026',
    dayName: 'Kamis',
    status: 'leave',
    statusLabel: 'Cuti Tahunan',
    location: 'Disetujui HRD Medis',
    note: 'Cuti Tahunan Dokter Terjadwal',
  },
  {
    id: 'pr-7',
    date: '19 Agu 2026',
    dayName: 'Rabu',
    status: 'on-time',
    statusLabel: 'Tepat Waktu',
    checkInTime: '07:30 WIB',
    checkOutTime: '16:50 WIB',
    shiftSchedule: '08:00 - 16:30 WIB',
    location: 'Poli Anak • Room 102',
    method: 'QR Code RS Amanah',
    duration: '9j 20m',
  },
  {
    id: 'pr-8',
    date: '18 Agu 2026',
    dayName: 'Selasa',
    status: 'on-time',
    statusLabel: 'Tepat Waktu',
    checkInTime: '07:38 WIB',
    checkOutTime: '17:00 WIB',
    shiftSchedule: '08:00 - 17:00 WIB',
    location: 'Poli Anak • Room 102',
    method: 'Presensi Manual PIN',
    duration: '9j 22m',
  },
];

export function PresenceHistoryScreen(props: {
  theme?: 'dark' | 'light';
  onBack?: () => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const [selectedFilter, setSelectedFilter] = React.useState<'all' | 'on-time' | 'late' | 'leave'>('all');
  const [selectedMonth] = React.useState('Agustus 2026');

  const filterOptions = [
    { id: 'all' as const, label: 'Semua', count: MOCK_PRESENCE_RECORDS.length },
    {
      id: 'on-time' as const,
      label: 'Tepat Waktu',
      count: MOCK_PRESENCE_RECORDS.filter(r => r.status === 'on-time').length,
    },
    {
      id: 'late' as const,
      label: 'Terlambat',
      count: MOCK_PRESENCE_RECORDS.filter(r => r.status === 'late').length,
    },
    {
      id: 'leave' as const,
      label: 'Cuti / Izin',
      count: MOCK_PRESENCE_RECORDS.filter(r => r.status === 'leave').length,
    },
  ];

  const filteredRecords = selectedFilter === 'all'
    ? MOCK_PRESENCE_RECORDS
    : MOCK_PRESENCE_RECORDS.filter(r => r.status === selectedFilter);

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden select-text',
        isDark ? 'bg-[#0a0e1a] text-white' : 'bg-[#f8faff] text-slate-900',
        props.className,
      )}
    >
      {/* 1. Master Overlay Glassmorphic Screen Header (No borders) */}
      <ScreenHeader
        title="Riwayat Presensi"
        onBack={props.onBack}
        theme={props.theme}
        rightAction={(
          <div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold select-none cursor-pointer',
              isDark
                ? 'bg-white/5 border-white/15 text-cyan-400 hover:bg-white/10'
                : 'bg-white border-slate-200 text-blue-600 hover:bg-slate-50 shadow-xs',
            )}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>{selectedMonth}</span>
            <ChevronDown className="h-3 w-3 opacity-70" />
          </div>
        )}
      />

      {/* 2. Full-Height Scrollable Content Viewport (Slides under glass header) */}
      <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar px-5 pt-20 pb-28 flex flex-col gap-4">
        {/* 2. Attendance Summary Statistics (3 Stat Cards) */}
        <div className="grid grid-cols-3 gap-2.5 shrink-0">
          {/* Stat 1: Total Kehadiran */}
          <div
            className={cn(
              'p-3 rounded-2xl border flex flex-col justify-between relative overflow-hidden',
              isDark
                ? 'bg-gradient-to-br from-blue-950/40 to-cyan-950/20 border-cyan-500/20 text-white'
                : 'bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-200/80 text-slate-900 shadow-xs',
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={cn('text-[10px] font-bold uppercase tracking-wider', isDark ? 'text-cyan-300' : 'text-blue-600')}>
                Kehadiran
              </span>
              <CheckCircle2 className={cn('h-3.5 w-3.5', isDark ? 'text-cyan-400' : 'text-blue-600')} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight">98%</span>
              <span className={cn('block text-[10px] mt-0.5', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                24/25 Hari
              </span>
            </div>
          </div>

          {/* Stat 2: Tepat Waktu */}
          <div
            className={cn(
              'p-3 rounded-2xl border flex flex-col justify-between relative overflow-hidden',
              isDark
                ? 'bg-gradient-to-br from-emerald-950/40 to-teal-950/20 border-emerald-500/20 text-white'
                : 'bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-200/80 text-slate-900 shadow-xs',
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={cn('text-[10px] font-bold uppercase tracking-wider', isDark ? 'text-emerald-300' : 'text-emerald-700')}>
                On-Time
              </span>
              <Clock className={cn('h-3.5 w-3.5', isDark ? 'text-emerald-400' : 'text-emerald-600')} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight">22</span>
              <span className={cn('block text-[10px] mt-0.5', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                Tepat Waktu
              </span>
            </div>
          </div>

          {/* Stat 3: Cuti / Izin */}
          <div
            className={cn(
              'p-3 rounded-2xl border flex flex-col justify-between relative overflow-hidden',
              isDark
                ? 'bg-gradient-to-br from-amber-950/40 to-orange-950/20 border-amber-500/20 text-white'
                : 'bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200/80 text-slate-900 shadow-xs',
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={cn('text-[10px] font-bold uppercase tracking-wider', isDark ? 'text-amber-300' : 'text-amber-700')}>
                Cuti / Izin
              </span>
              <Calendar className={cn('h-3.5 w-3.5', isDark ? 'text-amber-400' : 'text-amber-600')} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight">1</span>
              <span className={cn('block text-[10px] mt-0.5', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                1 Sisa Cuti
              </span>
            </div>
          </div>
        </div>

        {/* 3. Category Filter Tabs */}
        <div className="w-full overflow-x-auto no-scrollbar py-0.5 shrink-0">
          <div className="flex gap-2 min-w-max px-0.5 items-center">
            {filterOptions.map((opt) => {
              const isActive = selectedFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedFilter(opt.id)}
                  className={cn(
                    'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5',
                    isActive
                      ? isDark
                        ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/25'
                        : 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                      : isDark
                        ? 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/10'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-2xs',
                  )}
                >
                  <span>{opt.label}</span>
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.2 rounded-full font-extrabold',
                      isActive
                        ? isDark
                          ? 'bg-neutral-950/30 text-neutral-950'
                          : 'bg-white/25 text-white'
                        : isDark
                          ? 'bg-white/10 text-neutral-400'
                          : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    {opt.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Presence Records List */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center px-1">
            <h3 className={cn('text-xs font-bold tracking-tight', isDark ? 'text-slate-400' : 'text-slate-600')}>
              Daftar Catatan Kehadiran ({filteredRecords.length})
            </h3>
            <span className={cn('text-[11px]', isDark ? 'text-neutral-500' : 'text-slate-400')}>
              Sinkronisasi Otomatis
            </span>
          </div>

          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => {
              const isOnTime = record.status === 'on-time';
              const isLate = record.status === 'late';
              const isLeave = record.status === 'leave';

              return (
                <div
                  key={record.id}
                  className={cn(
                    'p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-3',
                    isDark
                      ? 'bg-white/5 border-white/10 hover:border-white/20 text-white'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-sm',
                  )}
                >
                  {/* Top Bar: Date & Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          'p-2 rounded-xl shrink-0 transition-colors',
                          isDark ? 'bg-blue-950/60 text-cyan-400' : 'bg-blue-50 text-blue-600',
                        )}
                      >
                        {isOnTime && <CheckCircle2 className="h-4 w-4" />}
                        {isLate && <AlertCircle className="h-4 w-4 text-amber-500" />}
                        {isLeave && <Calendar className="h-4 w-4 text-indigo-400" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs">
                            {record.dayName}, {record.date}
                          </span>
                        </div>
                        <span className={cn('text-[11px] block', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                          {record.location}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0',
                        isOnTime && (isDark ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'),
                        isLate && (isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'),
                        isLeave && (isDark ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'),
                      )}
                    >
                      {record.statusLabel}
                    </div>
                  </div>

                  {/* Presence Details (Check-in, Check-out, Method) */}
                  {!isLeave ? (
                    <div
                      className={cn(
                        'p-2.5 rounded-xl flex items-center justify-between text-xs',
                        isDark ? 'bg-black/30 border border-white/5' : 'bg-slate-50 border border-slate-100',
                      )}
                    >
                      {/* Check-In */}
                      <div className="flex flex-col">
                        <span className={cn('text-[10px] font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                          Masuk
                        </span>
                        <span className={cn('font-bold text-xs mt-0.5', isDark ? 'text-cyan-300' : 'text-blue-600')}>
                          {record.checkInTime}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className={cn('h-6 w-px', isDark ? 'bg-white/10' : 'bg-slate-200')} />

                      {/* Check-Out */}
                      <div className="flex flex-col">
                        <span className={cn('text-[10px] font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                          Pulang
                        </span>
                        <span className="font-bold text-xs mt-0.5">
                          {record.checkOutTime}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className={cn('h-6 w-px', isDark ? 'bg-white/10' : 'bg-slate-200')} />

                      {/* Duration */}
                      <div className="flex flex-col text-right">
                        <span className={cn('text-[10px] font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                          Durasi
                        </span>
                        <span className={cn('font-bold text-xs mt-0.5', isDark ? 'text-emerald-400' : 'text-emerald-700')}>
                          {record.duration}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'p-2.5 rounded-xl text-xs font-medium',
                        isDark ? 'bg-black/30 border border-white/5 text-neutral-300' : 'bg-slate-50 border border-slate-100 text-slate-600',
                      )}
                    >
                      {record.note}
                    </div>
                  )}

                  {/* Verification Tag */}
                  {record.method && (
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={cn('flex items-center gap-1', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                        <QrCode className="h-3 w-3" />
                        <span>{record.method}</span>
                      </span>
                      <span className={cn('font-semibold', isDark ? 'text-cyan-400/80' : 'text-blue-600/80')}>
                        Terverifikasi
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div
              className={cn(
                'flex flex-col items-center justify-center p-8 rounded-2xl border text-center my-2',
                isDark ? 'bg-white/5 border-white/10 text-neutral-300' : 'bg-white border-slate-200 text-slate-600',
              )}
            >
              <Calendar className={cn('h-8 w-8 mb-2', isDark ? 'text-neutral-500' : 'text-slate-400')} />
              <p className="text-xs font-bold">Tidak ada riwayat presensi</p>
              <p className={cn('text-[11px] mt-0.5', isDark ? 'text-neutral-500' : 'text-slate-400')}>
                Belum ada data untuk kategori filter ini.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
