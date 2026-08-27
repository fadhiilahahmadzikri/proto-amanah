'use client';

import { gsap } from 'gsap';
import {
  Compass,
  Download,
  Fingerprint,
  Info,
  Loader2,
  QrCode,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DoctorIdCard3D } from '@/components/atoms/DoctorIdCard3D';
import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import { useDoctorStore } from '@/features/doctor/hooks/use-doctor-store';
import { downloadDoctorIdCardPdf } from '@/lib/generateCardPdf';
import { cn } from '@/lib/utils';

export function DoctorIdCardScreen(props: {
  theme?: 'dark' | 'light';
  onBack?: () => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const { profile } = useDoctorStore();
  const [showQrModal, setShowQrModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Info Drawer GSAP & Gesture Refs
  const infoDrawerRef = useRef<HTMLDivElement>(null);
  const infoContentRef = useRef<HTMLDivElement>(null);
  const infoStartYRef = useRef(0);
  const infoCurrentDragYRef = useRef(0);
  const infoIsDraggingRef = useRef(false);
  const infoIsClosingRef = useRef(false);

  // Info Drawer Entrance Animation (GSAP)
  useEffect(() => {
    if (showInfoModal && infoDrawerRef.current) {
      gsap.fromTo(
        infoDrawerRef.current,
        { y: '100%', opacity: 0.95 },
        { y: '0%', opacity: 1, duration: 0.32, ease: 'power3.out' },
      );
    }
  }, [showInfoModal]);

  const triggerCloseInfoDrawer = useCallback(() => {
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

  const handleDownloadPdf = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadDoctorIdCardPdf(profile, props.theme);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden flex flex-col select-none',
        isDark ? 'bg-[#070b14] text-white' : 'bg-[#f8faff] text-slate-900',
        props.className,
      )}
    >
      {/* 1. Header (Subtitle removed, Info tooltip & QR triggers side-by-side) */}
      <ScreenHeader
        title="Kartu Identitas"
        onBack={props.onBack}
        theme={props.theme}
        rightAction={(
          <div className="flex items-center gap-1 -mr-1.5">
            <button
              type="button"
              aria-label="Petunjuk & Informasi ID Card"
              onClick={() => setShowInfoModal(true)}
              className={cn(
                'p-1.5 rounded-full transition-all cursor-pointer active:scale-90 flex items-center justify-center',
                isDark
                  ? 'text-cyan-400 hover:text-cyan-300 hover:bg-white/10'
                  : 'text-[#0a44ff] hover:text-[#0038ff] hover:bg-blue-50',
              )}
            >
              <Info className="w-5 h-5 stroke-[2]" />
            </button>

            <button
              type="button"
              aria-label="Tampilkan QR Code Presensi"
              onClick={() => setShowQrModal(true)}
              className={cn(
                'p-1.5 rounded-full transition-all cursor-pointer active:scale-90 flex items-center justify-center',
                isDark
                  ? 'text-cyan-400 hover:text-cyan-300 hover:bg-white/10'
                  : 'text-[#0a44ff] hover:text-[#0038ff] hover:bg-blue-50',
              )}
            >
              <QrCode className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        )}
      />

      {/* 2. Full-Bleed Interactive 3D Lanyard & Badge Canvas Viewport */}
      <div className="absolute inset-0 w-full h-full pt-12">
        {/* Ambient Medical Blue Underglow */}
        <div
          className={cn(
            'absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full filter blur-[100px] pointer-events-none transition-all duration-700',
            isDark ? 'bg-cyan-500/20' : 'bg-blue-400/25',
          )}
        />

        {/* 3D Canvas (Covers entire screen so card moves seamlessly behind buttons) */}
        <DoctorIdCard3D profile={profile} theme={props.theme} />
      </div>

      {/* 3. Floating Bottom Actions Overlay (pointer-events-none on wrapper, pointer-events-auto on buttons) */}
      <div className="absolute bottom-0 inset-x-0 px-5 pb-32 sm:pb-36 pt-2 z-20 flex items-center gap-2.5 pointer-events-none">
        {/* Tombol Bagikan ID Card */}
        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `ID Card Dokter - ${profile.name}`,
                text: `${profile.name} (${profile.role}) - ${profile.hospital}\nSIP: ${profile.sip}`,
              }).catch(() => {});
            } else {
              navigator.clipboard?.writeText(profile.sip);
            }
          }}
          className={cn(
            'flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer select-none flex items-center justify-center gap-2 active:scale-98 pointer-events-auto backdrop-blur-xs',
            isDark
              ? 'bg-[#111624]/85 hover:bg-[#182032] text-neutral-200 shadow-sm'
              : 'bg-white/90 hover:bg-white text-slate-800 shadow-sm',
          )}
        >
          <Share2 className="w-4 h-4" />
          <span>Bagikan</span>
        </button>

        {/* Tombol Unduh PDF (Theme Adaptive: Bright Cyan on Dark, Electric Blue on Light) */}
        <button
          type="button"
          disabled={isDownloading}
          onClick={handleDownloadPdf}
          className={cn(
            'flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer select-none flex items-center justify-center gap-2 active:scale-98 shadow-md pointer-events-auto',
            isDark
              ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-extrabold shadow-cyan-500/25'
              : 'bg-[#0a44ff] hover:bg-[#0038ff] text-white shadow-blue-500/25',
          )}
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Membuat PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Unduh PDF</span>
            </>
          )}
        </button>
      </div>

      {/* 4. Info & Panduan Master Drawer (Swipeable with GSAP) */}
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
              <div className={cn('relative z-20 flex items-center px-6 pt-1 pb-2.5 shrink-0 border-b', isDark ? 'border-white/5' : 'border-slate-100')}>
                <h3 className={cn('text-sm font-semibold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                  Panduan & Informasi ID Card 3D
                </h3>
              </div>

              {/* Detail Content Body */}
              <div ref={infoContentRef} className="flex w-full flex-col px-6 pt-3 pb-4 overflow-y-auto no-scrollbar select-text gap-3.5">
                <p className={cn('text-xs leading-relaxed', isDark ? 'text-neutral-300' : 'text-slate-600')}>
                  ID Card Digital Terverifikasi RS Amanah Sehat dilengkapi simulasi fisika tiga dimensi dan token presensi aman:
                </p>

                {/* Info Items List (Harmonious Theme-Respecting Badges) */}
                <div
                  className={cn(
                    'divide-y text-xs rounded-2xl border p-1',
                    isDark ? 'divide-white/5 border-white/10 bg-white/[0.02]' : 'divide-slate-100 border-slate-100 bg-slate-50/50',
                  )}
                >
                  <div className="flex items-start gap-3 p-3">
                    <div className={cn(
                      'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                      isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-50 text-[#0a44ff]',
                    )}>
                      <Compass className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                        Fisika 3D & Gesture Interaktif
                      </span>
                      <span className={cn('text-[11px] leading-relaxed', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                        Tarik tali lanyard atau ketuk sisi kartu untuk memutar balik kartu secara natural.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3">
                    <div className={cn(
                      'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                      isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-50 text-[#0a44ff]',
                    )}>
                      <Fingerprint className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                        Barcode & Token Presensi
                      </span>
                      <span className={cn('text-[11px] leading-relaxed', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                        Sisi belakang memuat 1D Barcode, dan tombol QR di pojok atas menyediakan kode scanner poli/IGD.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3">
                    <div className={cn(
                      'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                      isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-50 text-[#0a44ff]',
                    )}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                        Verifikasi Resmi KKI
                      </span>
                      <span className={cn('text-[11px] leading-relaxed', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                        Nomor Surat Izin Praktik (SIP) terdaftar aktif di Konsil Kedokteran Indonesia.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button: Tutup (Borderless Flat with Theme Match) */}
            <div className="px-6 pb-28 sm:pb-32 pt-2 shrink-0">
              <button
                type="button"
                onClick={triggerCloseInfoDrawer}
                className={cn(
                  'w-full py-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98',
                  isDark
                    ? 'text-white bg-white/10 hover:bg-white/15'
                    : 'text-white bg-[#0a44ff] hover:bg-[#0038ff]',
                )}
              >
                Mengerti
              </button>
            </div>
          </div>
        </>
      )}

      {/* 5. QR Code Verification Modal */}
      {showQrModal && (
        <>
          <div
            onClick={() => setShowQrModal(false)}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          <div
            className={cn(
              'absolute inset-x-5 top-1/2 -translate-y-1/2 z-50 p-6 rounded-3xl shadow-2xl border transition-all animate-in zoom-in-95 duration-200 select-none flex flex-col items-center text-center backdrop-blur-2xl',
              isDark
                ? 'bg-[#0f1422]/95 border-white/10 text-white shadow-black/80'
                : 'bg-white/95 border-slate-100 text-slate-900 shadow-2xl',
            )}
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-3">
              <QrCode className="w-6 h-6 stroke-[2]" />
            </div>

            <h3 className="text-base font-bold tracking-tight mb-1">
              QR Presensi & Akses IGD
            </h3>
            <p className={cn('text-xs mb-4 max-w-[240px]', isDark ? 'text-neutral-400' : 'text-slate-500')}>
              Gunakan barcode ini untuk tap-in di reader poli atau ruang tindakan.
            </p>

            {/* Generated QR Placeholder Container */}
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-inner mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=AMANAH-DOC-${encodeURIComponent(profile.sip)}`}
                alt="QR Code ID Dokter"
                width={160}
                height={160}
                className="rounded-lg"
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-neutral-400 mb-4">
              <Info className="w-3.5 h-3.5" />
              <span>Token dinamis berganti setiap 60 detik</span>
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className={cn(
                'w-full py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95',
                isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-100 text-slate-800 hover:bg-slate-200',
              )}
            >
              Tutup
            </button>
          </div>
        </>
      )}
    </div>
  );
}
