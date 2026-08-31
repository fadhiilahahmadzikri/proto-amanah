'use client';

import { gsap } from 'gsap';
import { Clock, X } from 'lucide-react';
import React from 'react';
import { AuroraBackground } from '@/components/atoms/AuroraBackground';
import { QueueBadge } from '@/components/atoms/QueueBadge';
import { cn } from '@/lib/utils';
import type { BookedPatient, DoctorSchedule } from '@/types/portal.types';
import type { QueueDockCardData } from '@/types/queue-dock.types';

export type PatientDetailDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  patient: BookedPatient | QueueDockCardData | null;
  schedule?: DoctorSchedule | null;
  theme?: 'dark' | 'light';
  className?: string;
};

export function PatientDetailDrawer(props: PatientDetailDrawerProps) {
  const isDark = props.theme === 'dark';
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const startYRef = React.useRef(0);
  const currentDragYRef = React.useRef(0);
  const isDraggingRef = React.useRef(false);
  const isClosingRef = React.useRef(false);

  // Entrance Animation
  React.useEffect(() => {
    if (props.isOpen && drawerRef.current) {
      isClosingRef.current = false;
      gsap.fromTo(
        drawerRef.current,
        { y: '100%', opacity: 0.95 },
        { y: '0%', opacity: 1, duration: 0.32, ease: 'power3.out' },
      );
    }
  }, [props.isOpen]);

  const triggerClose = () => {
    if (isClosingRef.current || !drawerRef.current) {
      props.onClose();
      return;
    }
    isClosingRef.current = true;

    gsap.to(drawerRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.28,
      ease: 'power3.in',
      onComplete: () => {
        props.onClose();
        isClosingRef.current = false;
      },
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target instanceof HTMLElement ? e.target : null;
    if (target?.closest('input, textarea, select, button, a')) {
      return;
    }
    startYRef.current = e.clientY;
    currentDragYRef.current = 0;
    if (!contentRef.current || contentRef.current.scrollTop <= 0) {
      isDraggingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !drawerRef.current) return;
    const deltaY = e.clientY - startYRef.current;
    if (deltaY > 0) {
      currentDragYRef.current = deltaY;
      gsap.set(drawerRef.current, { y: deltaY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !drawerRef.current) return;
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    if (currentDragYRef.current > 75) {
      triggerClose();
    } else {
      gsap.to(drawerRef.current, { y: 0, duration: 0.35, ease: 'elastic.out(1, 0.75)' });
    }
  };

  if (!props.isOpen || !props.patient) {
    return null;
  }

  // Normalize patient data fields
  const p = props.patient as (BookedPatient & Partial<QueueDockCardData>);
  const patientName = p.patientName || p.brand || 'Pasien';
  const avatarUrl = p.avatarUrl || p.doctorImage || '/assets/images/doctors/woman-docter-3.png';
  const queueNumber = p.queueNumber || '#01';
  const patientRm = p.patientRm || `RM-2026-${queueNumber.replace('#', '00')}`;
  const patientAge = p.patientAge || (typeof p.age === 'number' ? `${p.age} Thn` : '32 Thn');
  const patientComplaint = p.patientComplaint || p.complaint || p.desc || 'Pemeriksaan kesehatan rutin.';
  const timeSlot = p.timeSlot || '08:30 WIB';
  const badgeText = p.badge || p.status || p.priority || 'Aktif';
  const badgeVariant = p.badgeVariant || (p.priority === 'Prioritas' ? 'warning' : 'success');
  const guardian = p.patientGuardian;
  const sessionInfo = props.schedule?.title ? `${props.schedule.title} (${props.schedule.poli})` : (p.poly ? `Sesi ${p.poly}` : undefined);
  const roomInfo = props.schedule?.room || p.room || 'Ruang Periksa 101';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={triggerClose}
        className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer Container */}
      <div
        ref={drawerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          'absolute inset-x-0 bottom-0 z-60 flex max-h-[92%] min-h-[540px] w-full flex-col overflow-hidden rounded-t-[32px] sm:rounded-t-[36px] shadow-[0_-12px_45px_rgba(0,0,0,0.25)] border-t will-change-transform select-text touch-pan-y backdrop-blur-2xl',
          isDark
            ? 'bg-[#0a0e1a] border-white/10 text-white shadow-black/80'
            : 'bg-white border-neutral-100 text-slate-900 shadow-[0_-12px_45px_rgba(0,0,0,0.25)]',
          props.className,
        )}
      >
        {/* Dynamic Aurora Ambient Glow */}
        <AuroraBackground
          theme={props.theme}
          intensity="soft"
          className="h-[320px]"
        />

        {/* Interactive Drag Handle */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Tarik ke bawah untuk menutup"
          onClick={(e) => {
            e.stopPropagation();
            triggerClose();
          }}
          className={cn(
            'flex w-full cursor-grab active:cursor-grabbing flex-col items-center justify-center pt-3.5 pb-1 shrink-0 touch-none select-none transition-colors',
            isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-50/50',
          )}
        >
          <div className={cn('h-1.25 w-11 rounded-full transition-colors duration-150', isDark ? 'bg-white/25 hover:bg-white/40 active:bg-white/50' : 'bg-neutral-300 hover:bg-neutral-400 active:bg-neutral-500')} />
        </div>

        {/* Master Header - Sentence case: Detail rekam pasien */}
        <div className="relative z-20 flex items-center justify-between px-6 pt-0.5 pb-2.5 shrink-0 border-b border-inherit">
          <h3 className={cn('text-base font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
            Detail rekam pasien
          </h3>
          <button
            type="button"
            aria-label="Tutup detail pasien"
            onClick={triggerClose}
            className={cn(
              'p-1.5 -mr-2 rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0',
              isDark ? 'bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20' : 'bg-neutral-100/80 text-neutral-600 hover:text-neutral-900 hover:bg-slate-200',
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Detail Patient Body */}
        <div ref={contentRef} className="flex w-full flex-1 flex-col px-6 pt-3 pb-4 overflow-y-auto no-scrollbar select-text gap-4">
          {/* Profile Card Header with Trailing Queue Badge on Avatar */}
          <div className="flex flex-col items-center text-center gap-2 pt-1 pb-1">
            <div className="relative inline-flex">
              <img
                src={avatarUrl}
                alt={patientName}
                className="h-20 w-20 rounded-full object-cover shadow-lg ring-3 ring-blue-500/20"
              />
              <QueueBadge
                queueNumber={queueNumber}
                size={40}
                theme={isDark ? 'dark' : 'light'}
                className="absolute -bottom-2 -right-2.5 z-10"
              />
            </div>

            {/* Name & Subtitle with Status Pill */}
            <div className="flex flex-col items-center gap-1">
              <h4 className={cn('text-lg font-black tracking-tight leading-tight', isDark ? 'text-white' : 'text-slate-950')}>
                {patientName}
              </h4>

              <div className={cn('flex items-center justify-center gap-2 text-xs font-medium whitespace-nowrap mt-0.5', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                <span className="shrink-0">{patientRm}</span>
                <span className={cn('w-px h-3 shrink-0', isDark ? 'bg-white/20' : 'bg-slate-300')} />
                <span className="shrink-0">Usia {patientAge}</span>
                <span className={cn('w-px h-3 shrink-0', isDark ? 'bg-white/20' : 'bg-slate-300')} />
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0',
                    badgeVariant === 'success'
                      ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                      : isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-blue-50 text-[#0d66e9]',
                  )}
                >
                  {badgeText}
                </span>
              </div>
            </div>
          </div>

          {/* Patient Specification Table */}
          <div
            className={cn(
              'divide-y text-xs',
              isDark ? 'divide-white/10 text-neutral-200' : 'divide-slate-100 text-slate-900',
            )}
          >
            {/* Waktu / Jam Booking */}
            <div className="flex items-center justify-between py-3">
              <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                Waktu / jam booking
              </span>
              <span className={cn('font-bold flex items-center gap-1.5', isDark ? 'text-white' : 'text-slate-950')}>
                <Clock className="w-3.5 h-3.5 opacity-70" />
                {timeSlot}
              </span>
            </div>

            {/* Sesi Praktik */}
            {sessionInfo && (
              <div className="flex items-center justify-between py-3">
                <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                  Sesi praktik
                </span>
                <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>
                  {sessionInfo}
                </span>
              </div>
            )}

            {/* Ruang Praktik */}
            {roomInfo && (
              <div className="flex items-center justify-between py-3">
                <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                  Ruang praktik
                </span>
                <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>
                  {roomInfo}
                </span>
              </div>
            )}

            {/* Pendamping */}
            {guardian && (
              <div className="flex items-center justify-between py-3">
                <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                  Nama pendamping
                </span>
                <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>
                  {guardian}
                </span>
              </div>
            )}

            {/* Keluhan Medis */}
            <div className="flex flex-col gap-1.5 py-3">
              <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                Keluhan &amp; catatan medis pasien
              </span>
              <p className={cn('font-semibold text-xs leading-relaxed p-3 rounded-xl border', isDark ? 'bg-white/5 border-white/10 text-neutral-200' : 'bg-slate-50 border-slate-200 text-slate-800')}>
                {patientComplaint}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: Tutup */}
        <div className="px-6 pb-28 sm:pb-32 pt-2 shrink-0">
          <button
            type="button"
            onClick={triggerClose}
            className={cn(
              'w-full py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98',
              isDark
                ? 'border-white/15 text-neutral-300 hover:bg-white/10 bg-white/5'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs',
            )}
          >
            Tutup detail pasien
          </button>
        </div>
      </div>
    </>
  );
}
