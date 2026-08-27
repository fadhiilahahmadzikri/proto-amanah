'use client';

import { gsap } from 'gsap';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  X,
} from 'lucide-react';
import React from 'react';
import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import { cn } from '@/lib/utils';

type AttendanceStatus = 'hadir' | 'telat' | 'missed' | 'cuti';

type AttendanceRecord = {
  id: string | number;
  date: string;
  dayNumber: number;
  time: string;
  title: string;
  location: string;
  status: AttendanceStatus;
  isLatest?: boolean;
  reason?: string;
  lateDuration?: string;
};

const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 101,
    date: '25 Ags 2026',
    dayNumber: 25,
    time: '07:30 WIB',
    title: 'Check-in',
    location: 'Poli Penyakit Dalam - Ruang 204',
    status: 'hadir',
    isLatest: true,
  },
  {
    id: 102,
    date: '24 Ags 2026',
    dayNumber: 24,
    time: '08:18 WIB',
    title: 'Terlambat',
    location: 'Poli Spesialis Anak',
    status: 'telat',
    lateDuration: 'Terlambat 18 Menit',
    isLatest: false,
  },
  {
    id: 103,
    date: '23 Ags 2026',
    dayNumber: 23,
    time: '20:00 WIB',
    title: 'Missed',
    location: 'Gedung B - IGD Utama',
    status: 'missed',
    isLatest: false,
  },
  {
    id: 104,
    date: '22 Ags 2026',
    dayNumber: 22,
    time: '08:00 WIB',
    title: 'Cuti',
    location: 'Izin Resmi RS (Approved)',
    status: 'cuti',
    reason: 'Simposium Kedokteran Spesialis Penyakit Dalam Tahunan di Jakarta.',
    isLatest: false,
  },
  {
    id: 105,
    date: '20 Ags 2026',
    dayNumber: 20,
    time: '07:45 WIB',
    title: 'Check-in',
    location: 'Bangsal Cempaka Lt. 3',
    status: 'hadir',
    isLatest: false,
  },
  {
    id: 106,
    date: '19 Ags 2026',
    dayNumber: 19,
    time: '08:10 WIB',
    title: 'Terlambat',
    location: 'Klinik Eksekutif Suite 01',
    status: 'telat',
    lateDuration: 'Terlambat 10 Menit',
    isLatest: false,
  },
  {
    id: 107,
    date: '18 Ags 2026',
    dayNumber: 18,
    time: '08:00 WIB',
    title: 'Cuti',
    location: 'Disetujui HRD Medis',
    status: 'cuti',
    reason: 'Cuti Tahunan Dokter Terjadwal Semester 2.',
    isLatest: false,
  },
];

const UNIT_OPTIONS = [
  { label: 'Semua Unit', value: 'all' },
  { label: 'Poli Penyakit Dalam', value: 'Penyakit Dalam' },
  { label: 'Poli Anak', value: 'Anak' },
  { label: 'IGD', value: 'IGD' },
  { label: 'Bangsal Cempaka', value: 'Cempaka' },
  { label: 'Klinik Eksekutif', value: 'Eksekutif' },
];

const STATUS_OPTIONS: { label: string; value: 'all' | AttendanceStatus }[] = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Hadir', value: 'hadir' },
  { label: 'Telat', value: 'telat' },
  { label: 'Missed', value: 'missed' },
  { label: 'Cuti', value: 'cuti' },
];

const TimelineIcons = {
  Info: (props: { className?: string }) => (
    <svg className={cn('w-3.5 h-3.5', props.className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Download: (props: { className?: string }) => (
    <svg className={cn('w-3.5 h-3.5', props.className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  CheckIn: (props: { className?: string }) => (
    <svg className={cn('w-3.5 h-3.5', props.className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  ),
  Late: (props: { className?: string }) => (
    <svg className={cn('w-3.5 h-3.5', props.className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Missed: (props: { className?: string }) => (
    <svg className={cn('w-3.5 h-3.5', props.className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  Cuti: (props: { className?: string }) => (
    <svg className={cn('w-3.5 h-3.5', props.className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

export function PresenceHistoryScreen(props: {
  theme?: 'dark' | 'light';
  onBack?: () => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [showInfoModal, setShowInfoModal] = React.useState(false);
  const [showLeaveModal, setShowLeaveModal] = React.useState(false);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [selectedLeaveRecord, setSelectedLeaveRecord] = React.useState<AttendanceRecord | null>(null);

  // Filter States
  const [statusFilter, setStatusFilter] = React.useState<'all' | AttendanceStatus>('all');
  const [unitFilter, setUnitFilter] = React.useState<string>('all');
  const [selectedDayFilter, setSelectedDayFilter] = React.useState<number | null>(null);

  // Draft filter states inside Drawer
  const [draftStatus, setDraftStatus] = React.useState<'all' | AttendanceStatus>('all');
  const [draftUnit, setDraftUnit] = React.useState<string>('all');
  const [draftDay, setDraftDay] = React.useState<number | null>(null);

  const hasActiveFilters = statusFilter !== 'all' || unitFilter !== 'all' || selectedDayFilter !== null;

  // Filter Drawer GSAP & Gesture Refs
  const filterDrawerRef = React.useRef<HTMLDivElement>(null);
  const filterContentRef = React.useRef<HTMLDivElement>(null);
  const filterStartYRef = React.useRef(0);
  const filterCurrentDragYRef = React.useRef(0);
  const filterIsDraggingRef = React.useRef(false);
  const filterIsClosingRef = React.useRef(false);

  // Leave Drawer GSAP & Gesture Refs
  const leaveDrawerRef = React.useRef<HTMLDivElement>(null);
  const leaveContentRef = React.useRef<HTMLDivElement>(null);
  const leaveStartYRef = React.useRef(0);
  const leaveCurrentDragYRef = React.useRef(0);
  const leaveIsDraggingRef = React.useRef(false);
  const leaveIsClosingRef = React.useRef(false);

  // Info Drawer GSAP & Gesture Refs
  const infoDrawerRef = React.useRef<HTMLDivElement>(null);
  const infoContentRef = React.useRef<HTMLDivElement>(null);
  const infoStartYRef = React.useRef(0);
  const infoCurrentDragYRef = React.useRef(0);
  const infoIsDraggingRef = React.useRef(false);
  const infoIsClosingRef = React.useRef(false);

  // Open Filter Drawer smoothly
  const handleOpenFilterModal = () => {
    setDraftStatus(statusFilter);
    setDraftUnit(unitFilter);
    setDraftDay(selectedDayFilter);
    setShowFilterModal(true);
  };

  // Filter Drawer Entrance Animation (strictly tied to showFilterModal open event)
  React.useEffect(() => {
    if (showFilterModal && filterDrawerRef.current) {
      gsap.fromTo(
        filterDrawerRef.current,
        { y: '100%', opacity: 0.95 },
        { y: '0%', opacity: 1, duration: 0.32, ease: 'power3.out' },
      );
    }
  }, [showFilterModal]);

  const triggerCloseFilterDrawer = React.useCallback(() => {
    if (filterIsClosingRef.current || !filterDrawerRef.current) {
      setShowFilterModal(false);
      return;
    }
    filterIsClosingRef.current = true;

    gsap.to(filterDrawerRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.28,
      ease: 'power3.in',
      onComplete: () => {
        setShowFilterModal(false);
        filterIsClosingRef.current = false;
      },
    });
  }, []);

  const handleFilterPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target instanceof HTMLElement ? e.target : null;
    if (target?.closest('input, textarea, select, button, a')) {
      return;
    }
    filterStartYRef.current = e.clientY;
    filterCurrentDragYRef.current = 0;
    if (!filterContentRef.current || filterContentRef.current.scrollTop <= 0) {
      filterIsDraggingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handleFilterPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!filterIsDraggingRef.current || !filterDrawerRef.current) return;
    const deltaY = e.clientY - filterStartYRef.current;
    if (deltaY > 0) {
      filterCurrentDragYRef.current = deltaY;
      gsap.set(filterDrawerRef.current, { y: deltaY });
    }
  };

  const handleFilterPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!filterIsDraggingRef.current || !filterDrawerRef.current) return;
    filterIsDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    if (filterCurrentDragYRef.current > 70) {
      triggerCloseFilterDrawer();
    } else {
      gsap.to(filterDrawerRef.current, { y: 0, duration: 0.35, ease: 'elastic.out(1, 0.75)' });
    }
  };

  const applyFilters = () => {
    setStatusFilter(draftStatus);
    setUnitFilter(draftUnit);
    setSelectedDayFilter(draftDay);
    triggerCloseFilterDrawer();
  };

  const resetFilters = () => {
    setDraftStatus('all');
    setDraftUnit('all');
    setDraftDay(null);
    setStatusFilter('all');
    setUnitFilter('all');
    setSelectedDayFilter(null);
  };

  // Leave Drawer Entrance Animation
  React.useEffect(() => {
    if (showLeaveModal && leaveDrawerRef.current) {
      gsap.fromTo(
        leaveDrawerRef.current,
        { y: '100%', opacity: 0.95 },
        { y: '0%', opacity: 1, duration: 0.32, ease: 'power3.out' },
      );
    }
  }, [showLeaveModal]);

  const triggerCloseLeaveDrawer = React.useCallback(() => {
    if (leaveIsClosingRef.current || !leaveDrawerRef.current) {
      setShowLeaveModal(false);
      return;
    }
    leaveIsClosingRef.current = true;

    gsap.to(leaveDrawerRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.28,
      ease: 'power3.in',
      onComplete: () => {
        setShowLeaveModal(false);
        leaveIsClosingRef.current = false;
      },
    });
  }, []);

  const handleLeavePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target instanceof HTMLElement ? e.target : null;
    if (target?.closest('input, textarea, select, button, a')) {
      return;
    }
    leaveStartYRef.current = e.clientY;
    leaveCurrentDragYRef.current = 0;
    if (!leaveContentRef.current || leaveContentRef.current.scrollTop <= 0) {
      leaveIsDraggingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handleLeavePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!leaveIsDraggingRef.current || !leaveDrawerRef.current) return;
    const deltaY = e.clientY - leaveStartYRef.current;
    if (deltaY > 0) {
      leaveCurrentDragYRef.current = deltaY;
      gsap.set(leaveDrawerRef.current, { y: deltaY });
    }
  };

  const handleLeavePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!leaveIsDraggingRef.current || !leaveDrawerRef.current) return;
    leaveIsDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    if (leaveCurrentDragYRef.current > 70) {
      triggerCloseLeaveDrawer();
    } else {
      gsap.to(leaveDrawerRef.current, { y: 0, duration: 0.35, ease: 'elastic.out(1, 0.75)' });
    }
  };

  // Info Drawer Entrance Animation
  React.useEffect(() => {
    if (showInfoModal && infoDrawerRef.current) {
      gsap.fromTo(
        infoDrawerRef.current,
        { y: '100%', opacity: 0.95 },
        { y: '0%', opacity: 1, duration: 0.32, ease: 'power3.out' },
      );
    }
  }, [showInfoModal]);

  const triggerCloseInfoDrawer = React.useCallback(() => {
    if (infoIsClosingRef.current || !infoDrawerRef.current) {
      setShowInfoModal(false);
      return;
    }
    infoIsClosingRef.current = true;

    gsap.to(infoDrawerRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.28,
      ease: 'power3.in',
      onComplete: () => {
        setShowInfoModal(false);
        infoIsClosingRef.current = false;
      },
    });
  }, []);

  const handleInfoPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target instanceof HTMLElement ? e.target : null;
    if (target?.closest('input, textarea, select, button, a')) {
      return;
    }
    infoStartYRef.current = e.clientY;
    infoCurrentDragYRef.current = 0;
    if (!infoContentRef.current || infoContentRef.current.scrollTop <= 0) {
      infoIsDraggingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handleInfoPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!infoIsDraggingRef.current || !infoDrawerRef.current) return;
    const deltaY = e.clientY - infoStartYRef.current;
    if (deltaY > 0) {
      infoCurrentDragYRef.current = deltaY;
      gsap.set(infoDrawerRef.current, { y: deltaY });
    }
  };

  const handleInfoPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!infoIsDraggingRef.current || !infoDrawerRef.current) return;
    infoIsDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    if (infoCurrentDragYRef.current > 70) {
      triggerCloseInfoDrawer();
    } else {
      gsap.to(infoDrawerRef.current, { y: 0, duration: 0.35, ease: 'elastic.out(1, 0.75)' });
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 1200);
  };

  // Filtered dataset
  const filteredRecords = React.useMemo(() => {
    return ATTENDANCE_RECORDS.filter((rec) => {
      if (statusFilter !== 'all' && rec.status !== statusFilter) return false;
      if (unitFilter !== 'all' && !rec.location.toLowerCase().includes(unitFilter.toLowerCase())) return false;
      if (selectedDayFilter !== null && rec.dayNumber !== selectedDayFilter) return false;
      return true;
    });
  }, [statusFilter, unitFilter, selectedDayFilter]);

  // Calendar Grid Days for August 2026 (Starts on Saturday = index 5 for Monday-start)
  const augustDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const leadingOffset = 5;

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden select-none flex flex-col',
        isDark ? 'bg-[#0a0e1a] text-white' : 'bg-[#f8faff] text-slate-900',
        props.className,
      )}
    >
      {/* 1. Master Overlay Glassmorphic Screen Header */}
      <ScreenHeader
        title="Riwayat Presensi"
        onBack={props.onBack}
        theme={props.theme}
      />

      {/* 2. Full-Height Content Viewport */}
      {filteredRecords.length === 0 ? (
        /* Isolated Empty State: Pure and clean full-height container without timeline elements */
        <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center text-center px-6 pt-4 pb-28">
          <div className={cn('w-16 h-16 rounded-3xl flex items-center justify-center mb-4 border transition-colors', isDark ? 'bg-white/5 border-white/10 text-neutral-400' : 'bg-slate-100 border-slate-200 text-slate-500')}>
            <Filter className="w-8 h-8 opacity-60" />
          </div>
          <h3 className={cn('text-base font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
            Tidak ada data presensi
          </h3>
          <p className={cn('text-xs mt-1.5 mb-6 max-w-[260px] leading-relaxed', isDark ? 'text-neutral-400' : 'text-slate-500')}>
            Tidak ditemukan riwayat presensi yang sesuai dengan filter yang diterapkan.
          </p>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenFilterModal}
              className={cn(
                'px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95',
                isDark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 shadow-2xs',
              )}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Ubah Filter</span>
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className={cn(
                'px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5',
                isDark
                  ? 'bg-white text-slate-950 hover:bg-neutral-100'
                  : 'bg-slate-900 text-white hover:bg-slate-800',
              )}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        </div>
      ) : (
        /* Normal Full Timeline Viewport */
        <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden no-scrollbar px-5 pt-3 pb-36 sm:pb-40 flex flex-col gap-5">
          {/* Header Row: Timeline Title + Info Button + Compact Icon-Based Action Buttons (Filter & Download) */}
          <div className="flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2">
              <h2 className={cn('text-lg font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                Timeline
              </h2>
              <button
                type="button"
                aria-label="Informasi Perhitungan Presensi"
                onClick={() => setShowInfoModal(true)}
                className={cn(
                  'flex items-center justify-center w-5 h-5 rounded-full transition-colors cursor-pointer active:scale-90',
                  isDark ? 'bg-white/10 text-neutral-400 hover:text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-600',
                )}
              >
                <TimelineIcons.Info className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Compact Icon-Based Action Toolbar */}
            <div className="flex items-center gap-2">
              {/* Filter Action Icon Button */}
              <button
                type="button"
                aria-label="Filter Riwayat Presensi"
                title="Filter Presensi"
                onClick={handleOpenFilterModal}
                className={cn(
                  'relative flex items-center justify-center w-8 h-8 rounded-xl border transition-all cursor-pointer active:scale-95 shrink-0',
                  hasActiveFilters
                    ? isDark
                      ? 'border-cyan-400/50 bg-cyan-950/30 text-cyan-300'
                      : 'border-cyan-500 bg-cyan-50 text-cyan-700 shadow-2xs'
                    : isDark
                      ? 'border-white/10 text-neutral-300 hover:bg-white/10 bg-white/5'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs',
                )}
              >
                <Filter className="w-4 h-4" />
                {hasActiveFilters && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#0a0e1a]" />
                )}
              </button>

              {/* Download PDF Action Icon Button */}
              <button
                type="button"
                aria-label="Download Laporan PDF"
                title="Download PDF"
                onClick={handleDownload}
                disabled={isDownloading}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-xl border transition-all cursor-pointer disabled:opacity-60 active:scale-95 shrink-0',
                  isDark
                    ? 'border-white/10 text-neutral-300 hover:bg-white/10 bg-white/5'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs',
                )}
              >
                <TimelineIcons.Download className={isDark ? 'text-neutral-300' : 'text-slate-600'} />
              </button>
            </div>
          </div>

          {/* Active Filter Chips Banner */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded-xl border border-white/5 bg-white/5 dark:bg-white/5 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
                <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>Filter:</span>
                {statusFilter !== 'all' && (
                  <span className={cn('px-2 py-0.5 rounded-md font-semibold capitalize', isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-900')}>
                    {statusFilter}
                  </span>
                )}
                {unitFilter !== 'all' && (
                  <span className={cn('px-2 py-0.5 rounded-md font-semibold', isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-900')}>
                    {unitFilter}
                  </span>
                )}
                {selectedDayFilter !== null && (
                  <span className={cn('px-2 py-0.5 rounded-md font-semibold', isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-900')}>
                    Tgl {selectedDayFilter} Ags
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className={cn('text-[11px] font-bold underline pl-2 cursor-pointer shrink-0', isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700')}
              >
                Reset
              </button>
            </div>
          )}

          {/* Distribution Section (Bar + Date Ticks) */}
          <div className="flex flex-col shrink-0 select-none">
            <div
              className={cn(
                'w-full h-2.5 rounded-full flex gap-1 p-[2px] mb-2',
                isDark ? 'bg-white/10' : 'bg-slate-100',
              )}
            >
              <div className="bg-emerald-500 h-full rounded-full w-[60%]" title="Hadir (60% - 18 Hari)" />
              <div className="bg-amber-400 h-full rounded-full w-[15%]" title="Telat (15% - 4 Hari)" />
              <div className="bg-rose-500 h-full rounded-full w-[10%]" title="Missed (10% - 2 Hari)" />
              <div className="bg-indigo-500 h-full rounded-full w-[15%]" title="Cuti (15% - 3 Hari)" />
            </div>

            <div
              className={cn(
                'flex justify-between text-[11px] font-semibold tracking-tight',
                isDark ? 'text-neutral-400' : 'text-slate-400',
              )}
            >
              <span>01 Ags</span>
              <span>08 Ags</span>
              <span>15 Ags</span>
              <span>22 Ags</span>
              <span>31 Ags</span>
            </div>
          </div>

          {/* Metrics & Legends Row */}
          <div className="flex items-end justify-between shrink-0 select-none pt-1">
            <div className="flex flex-col gap-1">
              <span className={cn('text-[11px] font-medium', isDark ? 'text-neutral-400' : 'text-slate-400')}>
                Total jam kerja <span className={isDark ? 'text-neutral-600' : 'text-slate-300'}>·</span> Bulan ini
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className={cn('text-[22px] font-bold leading-none tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                  168 hr
                </span>
                <span className={cn('text-[12px] font-medium', isDark ? 'text-cyan-400' : 'text-slate-400')}>
                  (21 hari)
                </span>
              </div>
            </div>

            <div className={cn('flex items-center gap-2.5 text-[11px] font-medium pb-0.5 flex-wrap justify-end', isDark ? 'text-neutral-400' : 'text-slate-500')}>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Hadir</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Telat</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Missed</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Cuti</span>
              </div>
            </div>
          </div>

          {/* Attendance Records Vertical Timeline List */}
          <div className="flex flex-col pt-1">
            {filteredRecords.map((item, index) => {
              const isLast = index === filteredRecords.length - 1;

              let iconBoxStyle = isDark ? 'border-white/15 bg-white/5' : 'border-slate-300 bg-slate-50';
              let titleStyle = isDark ? 'text-neutral-200 font-medium' : 'text-slate-700 font-medium';
              let iconComponent = <TimelineIcons.CheckIn className={isDark ? 'text-neutral-400' : 'text-slate-400'} />;
              let lineStyle = isDark ? 'border-l border-dashed border-white/15' : 'border-l border-dashed border-slate-300';

              if (item.isLatest) {
                if (item.status === 'hadir') {
                  iconBoxStyle = isDark
                    ? 'border-emerald-500 bg-emerald-950/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'border-emerald-600 bg-emerald-50/70 shadow-[0_0_0_2px_rgba(5,150,105,0.12)]';
                  titleStyle = isDark ? 'text-emerald-400 font-semibold' : 'text-emerald-700 font-semibold';
                  iconComponent = <TimelineIcons.CheckIn className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />;
                  lineStyle = 'w-[1.5px] bg-emerald-500';
                } else if (item.status === 'telat') {
                  iconBoxStyle = isDark
                    ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                    : 'border-amber-500 bg-amber-50/70 shadow-[0_0_0_2px_rgba(245,158,11,0.12)]';
                  titleStyle = isDark ? 'text-amber-400 font-semibold' : 'text-amber-600 font-semibold';
                  iconComponent = <TimelineIcons.Late className={isDark ? 'text-amber-400' : 'text-amber-600'} />;
                  lineStyle = 'w-[1.5px] bg-amber-400';
                } else if (item.status === 'missed') {
                  iconBoxStyle = isDark
                    ? 'border-rose-500 bg-rose-950/40 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                    : 'border-rose-500 bg-rose-50/70 shadow-[0_0_0_2px_rgba(244,63,94,0.12)]';
                  titleStyle = isDark ? 'text-rose-400 font-semibold' : 'text-rose-600 font-semibold';
                  iconComponent = <TimelineIcons.Missed className={isDark ? 'text-rose-400' : 'text-rose-600'} />;
                  lineStyle = 'w-[1.5px] bg-rose-500';
                } else if (item.status === 'cuti') {
                  iconBoxStyle = isDark
                    ? 'border-indigo-400 bg-indigo-950/40 shadow-[0_0_12px_rgba(129,140,248,0.25)]'
                    : 'border-indigo-500 bg-indigo-50/70 shadow-[0_0_0_2px_rgba(99,102,241,0.12)]';
                  titleStyle = isDark ? 'text-indigo-400 font-semibold' : 'text-indigo-600 font-semibold';
                  iconComponent = <TimelineIcons.Cuti className={isDark ? 'text-indigo-300' : 'text-indigo-600'} />;
                  lineStyle = 'w-[1.5px] bg-indigo-500';
                }
              } else {
                if (item.status === 'telat') {
                  iconComponent = <TimelineIcons.Late className={isDark ? 'text-neutral-400' : 'text-slate-400'} />;
                } else if (item.status === 'missed') {
                  iconComponent = <TimelineIcons.Missed className={isDark ? 'text-neutral-400' : 'text-slate-400'} />;
                } else if (item.status === 'cuti') {
                  iconComponent = <TimelineIcons.Cuti className={isDark ? 'text-neutral-400' : 'text-slate-400'} />;
                } else {
                  iconComponent = <TimelineIcons.CheckIn className={isDark ? 'text-neutral-400' : 'text-slate-400'} />;
                }
              }

              return (
                <div key={item.id} className="relative flex items-start">
                  <div className="relative flex flex-col items-center mr-3 shrink-0">
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all',
                        isDark ? 'bg-[#0f172a]' : 'bg-white',
                        iconBoxStyle,
                      )}
                    >
                      {iconComponent}
                    </div>

                    {!isLast && <div className={cn('h-11 my-0.5', lineStyle)} />}
                  </div>

                  <div className="flex items-start justify-between w-full pt-1 pb-4 min-w-0">
                    <div className="w-[85px] shrink-0">
                      <div className={cn('text-[13px] font-bold leading-tight', isDark ? 'text-white' : 'text-slate-800')}>
                        {item.date}
                      </div>
                      <div className={cn('text-[11px] font-medium mt-0.5', isDark ? 'text-neutral-400' : 'text-slate-400')}>
                        {item.time}
                      </div>
                    </div>

                    <div className="flex-1 text-right pl-2 min-w-0">
                      <div className={cn('text-[13px] leading-tight font-semibold', titleStyle)}>
                        {item.title}
                      </div>
                      <div className={cn('text-[11px] mt-0.5 leading-tight', isDark ? 'text-neutral-400' : 'text-slate-400')}>
                        {item.location}
                      </div>

                      {item.status === 'cuti' && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLeaveRecord(item);
                            setShowLeaveModal(true);
                          }}
                          className={cn(
                            'text-[11px] font-bold underline underline-offset-2 transition-colors cursor-pointer hover:opacity-80 inline-block mt-1',
                            isDark ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-700',
                          )}
                        >
                          Lihat Alasan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Filter Master Drawer (Shadcn UI style calendar & discrete selectors) */}
      {showFilterModal && (
        <>
          <div
            onClick={triggerCloseFilterDrawer}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          <div
            ref={filterDrawerRef}
            onPointerDown={handleFilterPointerDown}
            onPointerMove={handleFilterPointerMove}
            onPointerUp={handleFilterPointerUp}
            onPointerCancel={handleFilterPointerUp}
            className={cn(
              'absolute inset-x-0 bottom-0 z-50 flex min-h-[460px] max-h-[90%] w-full flex-col justify-between overflow-hidden rounded-t-[32px] sm:rounded-t-[36px] shadow-[0_-12px_45px_rgba(0,0,0,0.25)] border-t will-change-transform select-text touch-pan-y backdrop-blur-2xl',
              isDark
                ? 'bg-[#0a0e1a] border-white/10 text-white shadow-black/80'
                : 'bg-white border-neutral-100 text-slate-900 shadow-[0_-12px_45px_rgba(0,0,0,0.25)]',
            )}
          >
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Interactive Drag Handle */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Tarik ke bawah untuk menutup"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerCloseFilterDrawer();
                }}
                className="flex w-full cursor-grab active:cursor-grabbing flex-col items-center justify-center pt-3 pb-1 shrink-0 touch-none select-none hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors"
              >
                <div className={cn('h-1 w-9 rounded-full transition-colors duration-150', isDark ? 'bg-white/20' : 'bg-slate-300')} />
              </div>

              {/* Master Header with thin hairline border */}
              <div className={cn('relative z-20 flex items-center justify-between px-6 pt-1 pb-2.5 shrink-0 border-b', isDark ? 'border-white/5' : 'border-slate-100')}>
                <div>
                  <h3 className={cn('text-sm font-semibold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                    Filter Presensi
                  </h3>
                  <p className={cn('text-[11px] font-normal mt-0.5', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Sesuaikan status, unit, atau tanggal
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className={cn(
                      'text-[11px] font-medium transition-colors cursor-pointer px-2 py-1 rounded-lg',
                      isDark ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
                    )}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    aria-label="Tutup Filter"
                    onClick={triggerCloseFilterDrawer}
                    className={cn(
                      'p-1.5 -mr-2 rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0',
                      isDark ? 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:text-slate-900',
                    )}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Detail Content Body */}
              <div ref={filterContentRef} className="flex w-full flex-1 flex-col px-6 pt-3.5 pb-3 overflow-y-auto no-scrollbar select-text gap-5">
                {/* 1. Status Filter Pills */}
                <div className="flex flex-col gap-2">
                  <span className={cn('text-xs font-semibold tracking-tight', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Status Presensi
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {STATUS_OPTIONS.map((opt) => {
                      const isSelected = draftStatus === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setDraftStatus(opt.value)}
                          className={cn(
                            'px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border',
                            isSelected
                              ? isDark
                                ? 'bg-white text-slate-950 border-white font-semibold shadow-xs'
                                : 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                              : isDark
                                ? 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100',
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Unit Penugasan Filter Pills */}
                <div className="flex flex-col gap-2">
                  <span className={cn('text-xs font-semibold tracking-tight', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Unit Penugasan
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {UNIT_OPTIONS.map((opt) => {
                      const isSelected = draftUnit === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setDraftUnit(opt.value)}
                          className={cn(
                            'px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border',
                            isSelected
                              ? isDark
                                ? 'bg-white text-slate-950 border-white font-semibold shadow-xs'
                                : 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                              : isDark
                                ? 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100',
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Shadcn UI Inspired Calendar Grid (Agustus 2026) */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className={cn('text-xs font-semibold tracking-tight', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                      Pilih Tanggal
                    </span>
                    <div className="flex items-center gap-1">
                      <span className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-slate-900')}>
                        Agustus 2026
                      </span>
                      <div className="flex items-center gap-0.5 ml-2">
                        <button type="button" aria-label="Bulan sebelumnya" className={cn('p-1 rounded-md opacity-40 cursor-not-allowed', isDark ? 'text-white' : 'text-slate-900')}>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" aria-label="Bulan selanjutnya" className={cn('p-1 rounded-md opacity-40 cursor-not-allowed', isDark ? 'text-white' : 'text-slate-900')}>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Calendar Grid Box */}
                  <div
                    className={cn(
                      'p-3 rounded-2xl border flex flex-col gap-2',
                      isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200',
                    )}
                  >
                    {/* Day Names Header: Sen Sel Rab Kam Jum Sab Min */}
                    <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-neutral-400">
                      <span>Sen</span>
                      <span>Sel</span>
                      <span>Rab</span>
                      <span>Kam</span>
                      <span>Jum</span>
                      <span>Sab</span>
                      <span>Min</span>
                    </div>

                    {/* Day Cells Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {Array.from({ length: leadingOffset }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="h-7 w-7 mx-auto" />
                      ))}

                      {augustDays.map((day) => {
                        const isSelected = draftDay === day;
                        const hasEvent = ATTENDANCE_RECORDS.some((r) => r.dayNumber === day);

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => setDraftDay(draftDay === day ? null : day)}
                            className={cn(
                              'relative h-7 w-7 mx-auto rounded-lg flex items-center justify-center font-medium transition-all cursor-pointer',
                              isSelected
                                ? isDark
                                  ? 'bg-white text-slate-950 font-bold shadow-xs'
                                  : 'bg-slate-900 text-white font-bold shadow-xs'
                                : isDark
                                  ? 'text-neutral-200 hover:bg-white/10'
                                  : 'text-slate-700 hover:bg-slate-200',
                            )}
                          >
                            <span>{day}</span>
                            {hasEvent && !isSelected && (
                              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button: Terapkan Filter */}
            <div className="px-6 pb-28 sm:pb-32 pt-2 shrink-0 border-t border-white/5 dark:border-white/5 border-slate-100 flex items-center gap-2.5">
              <button
                type="button"
                onClick={resetFilters}
                className={cn(
                  'w-1/3 py-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer active:scale-98 text-center',
                  isDark
                    ? 'border-white/10 text-neutral-300 hover:bg-white/5'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100',
                )}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={applyFilters}
                className={cn(
                  'w-2/3 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98 text-center',
                  isDark
                    ? 'bg-white text-slate-950 border-white hover:bg-neutral-100'
                    : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800',
                )}
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </>
      )}

      {/* 4. Leave Reason Master Drawer (Inheriting Native Master Drawer Architecture & Style) */}
      {showLeaveModal && selectedLeaveRecord && (
        <>
          <div
            onClick={triggerCloseLeaveDrawer}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          <div
            ref={leaveDrawerRef}
            onPointerDown={handleLeavePointerDown}
            onPointerMove={handleLeavePointerMove}
            onPointerUp={handleLeavePointerUp}
            onPointerCancel={handleLeavePointerUp}
            className={cn(
              'absolute inset-x-0 bottom-0 z-50 flex min-h-[340px] max-h-[85%] w-full flex-col justify-between overflow-hidden rounded-t-[32px] sm:rounded-t-[36px] shadow-[0_-12px_45px_rgba(0,0,0,0.25)] border-t will-change-transform select-text touch-pan-y backdrop-blur-2xl',
              isDark
                ? 'bg-[#0a0e1a] border-white/10 text-white shadow-black/80'
                : 'bg-white border-neutral-100 text-slate-900 shadow-[0_-12px_45px_rgba(0,0,0,0.25)]',
            )}
          >
            <div>
              {/* Interactive Drag Handle */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Tarik ke bawah untuk menutup"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerCloseLeaveDrawer();
                }}
                className="flex w-full cursor-grab active:cursor-grabbing flex-col items-center justify-center pt-3 pb-1 shrink-0 touch-none select-none hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors"
              >
                <div className={cn('h-1 w-9 rounded-full transition-colors duration-150', isDark ? 'bg-white/20' : 'bg-slate-300')} />
              </div>

              {/* Master Header with thin hairline border */}
              <div className={cn('relative z-20 flex items-center justify-between px-6 pt-1 pb-2.5 shrink-0 border-b', isDark ? 'border-white/5' : 'border-slate-100')}>
                <div>
                  <h3 className={cn('text-sm font-semibold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                    Alasan Cuti Dokter
                  </h3>
                  <p className={cn('text-[11px] font-normal mt-0.5', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    {selectedLeaveRecord.date} • {selectedLeaveRecord.time}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Tutup Detail Cuti"
                  onClick={triggerCloseLeaveDrawer}
                  className={cn(
                    'p-1.5 -mr-2 rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0',
                    isDark ? 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:text-slate-900',
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Detail Content Body: Keterangan Alasan with Status Disetujui on the opposite side */}
              <div ref={leaveContentRef} className="flex w-full flex-col px-6 pt-4 pb-4 overflow-y-auto no-scrollbar select-text gap-2.5">
                <div className="flex items-center justify-between">
                  <span className={cn('text-xs font-semibold tracking-tight', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Keterangan Alasan
                  </span>
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1.5',
                      isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-700',
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    <span>Disetujui</span>
                  </span>
                </div>
                <p className={cn('text-sm font-medium leading-relaxed', isDark ? 'text-neutral-200' : 'text-slate-800')}>
                  {selectedLeaveRecord.reason || 'Izin cuti resmi terjadwal yang telah disetujui manajemen RS Amanah.'}
                </p>
              </div>
            </div>

            {/* Action Button: Tutup */}
            <div className="px-6 pb-28 sm:pb-32 pt-2 shrink-0">
              <button
                type="button"
                onClick={triggerCloseLeaveDrawer}
                className={cn(
                  'w-full py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98',
                  isDark
                    ? 'border-white/10 text-neutral-200 hover:bg-white/10 bg-white/5'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs',
                )}
              >
                Tutup
              </button>
            </div>
          </div>
        </>
      )}

      {/* 5. Info Master Drawer */}
      {showInfoModal && (
        <>
          <div
            onClick={triggerCloseInfoDrawer}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          <div
            ref={infoDrawerRef}
            onPointerDown={handleInfoPointerDown}
            onPointerMove={handleInfoPointerMove}
            onPointerUp={handleInfoPointerUp}
            onPointerCancel={handleInfoPointerUp}
            className={cn(
              'absolute inset-x-0 bottom-0 z-50 flex min-h-[380px] max-h-[88%] w-full flex-col justify-between overflow-hidden rounded-t-[32px] sm:rounded-t-[36px] shadow-[0_-12px_45px_rgba(0,0,0,0.25)] border-t will-change-transform select-text touch-pan-y backdrop-blur-2xl',
              isDark
                ? 'bg-[#0a0e1a] border-white/10 text-white shadow-black/80'
                : 'bg-white border-neutral-100 text-slate-900 shadow-[0_-12px_45px_rgba(0,0,0,0.25)]',
            )}
          >
            <div>
              {/* Interactive Drag Handle */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Tarik ke bawah untuk menutup"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerCloseInfoDrawer();
                }}
                className="flex w-full cursor-grab active:cursor-grabbing flex-col items-center justify-center pt-3 pb-1 shrink-0 touch-none select-none hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors"
              >
                <div className={cn('h-1 w-9 rounded-full transition-colors duration-150', isDark ? 'bg-white/20' : 'bg-slate-300')} />
              </div>

              {/* Master Header with thin hairline border */}
              <div className={cn('relative z-20 flex items-center justify-between px-6 pt-1 pb-2.5 shrink-0 border-b', isDark ? 'border-white/5' : 'border-slate-100')}>
                <h3 className={cn('text-sm font-semibold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                  Keterangan Timeline Presensi
                </h3>
                <button
                  type="button"
                  aria-label="Tutup Keterangan"
                  onClick={triggerCloseInfoDrawer}
                  className={cn(
                    'p-1.5 -mr-2 rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0',
                    isDark ? 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:text-slate-900',
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Detail Content Body */}
              <div ref={infoContentRef} className="flex w-full flex-col px-6 pt-3 pb-4 overflow-y-auto no-scrollbar select-text gap-4">
                <p className={cn('text-xs leading-relaxed', isDark ? 'text-neutral-300' : 'text-slate-600')}>
                  Data timeline presensi diakumulasikan secara otomatis setiap bulan berdasarkan shift dan jadwal yang terdaftar di sistem RS Amanah:
                </p>

                {/* Status List Divide-y */}
                <div
                  className={cn(
                    'divide-y text-xs',
                    isDark ? 'divide-white/5 text-neutral-200' : 'divide-slate-100 text-slate-900',
                  )}
                >
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>Hadir</span>
                    </div>
                    <span className={cn('font-medium text-right', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                      Tepat waktu sesuai shift
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                      <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>Telat</span>
                    </div>
                    <span className={cn('font-medium text-right', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                      Melewati toleransi shift
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                      <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>Missed</span>
                    </div>
                    <span className={cn('font-medium text-right', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                      Tidak tercatat check-in
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                      <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>Cuti</span>
                    </div>
                    <span className={cn('font-medium text-right', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                      Izin atau cuti resmi HRD
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button: Tutup */}
            <div className="px-6 pb-28 sm:pb-32 pt-2 shrink-0">
              <button
                type="button"
                onClick={triggerCloseInfoDrawer}
                className={cn(
                  'w-full py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98',
                  isDark
                    ? 'border-white/10 text-neutral-200 hover:bg-white/10 bg-white/5'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs',
                )}
              >
                Tutup Informasi
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
