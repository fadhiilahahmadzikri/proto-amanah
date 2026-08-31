'use client';

import { gsap } from 'gsap';
import {
  ArrowLeft,
  Camera,
  CameraOff,
  CheckCircle2,
  ChevronDown,
  Copy,
  Download,
  Flashlight,
  HelpCircle,
  Image as ImageIcon,
  KeyRound,
  LayoutGrid,
  QrCode,
  RotateCcw,
  Sparkles,
  UploadCloud,
} from 'lucide-react';
import React from 'react';
import { QrCodeSvg } from '@/components/atoms/QrCodeSvg';
import { OtpInput } from '@/components/molecules/OtpInput';
import { useDoctorStore } from '@/features/doctor/hooks/use-doctor-store';
import { useModalStore } from '@/features/portal/hooks/use-modal-store';
import { cn } from '@/lib/utils';

export function QrScannerTabScreen(props: {
  theme?: 'dark' | 'light';
  onBack?: () => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const { profile: doctorProfile } = useDoctorStore();
  const { openModal, closeModal } = useModalStore();
  const [isFlashOn, setIsFlashOn] = React.useState(false);
  const [isScanned, setIsScanned] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(true);
  const [drawerView, setDrawerView] = React.useState<'menu' | 'manual-pin' | 'my-qr' | 'upload-qr'>('menu');
  const [manualPin, setManualPin] = React.useState('');
  const [pinError, setPinError] = React.useState<string | null>(null);
  const [copiedFeedback, setCopiedFeedback] = React.useState(false);
  const [cameraStatus, setCameraStatus] = React.useState<
    'idle' | 'requesting' | 'active' | 'denied' | 'unsupported'
  >('idle');

  // Sync active sub-drawers with modal store
  React.useEffect(() => {
    if (isDrawerOpen && drawerView !== 'menu') {
      openModal();
      return () => {
        closeModal();
      };
    }
    return undefined;
  }, [isDrawerOpen, drawerView, openModal, closeModal]);

  // Video Element & MediaStream Refs
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const mediaStreamRef = React.useRef<MediaStream | null>(null);

  // GSAP Master Drawer Gesture Refs
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const startYRef = React.useRef(0);
  const currentDragYRef = React.useRef(0);
  const isDraggingRef = React.useRef(false);
  const isClosingRef = React.useRef(false);

  // Request Live Device Camera Stream
  const requestCamera = React.useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraStatus('unsupported');
      return;
    }

    try {
      setCameraStatus('requesting');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error);
        };
      }
      setCameraStatus('active');
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraStatus('denied');
    }
  }, []);

  // Request Camera on Mount, cleanup tracks on Unmount
  React.useEffect(() => {
    requestCamera();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [requestCamera]);

  // Flashlight / Hardware Torch Toggle
  const toggleFlash = async () => {
    const nextState = !isFlashOn;
    setIsFlashOn(nextState);

    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      const capabilities = (videoTrack?.getCapabilities?.() ?? {}) as { torch?: boolean };
      if (capabilities.torch) {
        try {
          await (videoTrack as any).applyConstraints({
            advanced: [{ torch: nextState }],
          });
        } catch (e) {
          console.warn('Torch constraint not applied:', e);
        }
      }
    }
  };

  // GSAP Entrance Animation when Drawer Opens
  React.useEffect(() => {
    if (isDrawerOpen && drawerRef.current) {
      gsap.fromTo(
        drawerRef.current,
        { y: '100%', opacity: 0.9 },
        { y: '0%', opacity: 1, duration: 0.4, ease: 'power3.out' },
      );
    }
  }, [isDrawerOpen]);

  // Master Drawer Close Action with GSAP Physics
  const triggerCloseDrawer = React.useCallback(() => {
    if (isClosingRef.current || !drawerRef.current) {
      return;
    }
    isClosingRef.current = true;

    gsap.to(drawerRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.32,
      ease: 'power3.inOut',
      onComplete: () => {
        setIsDrawerOpen(false);
        isClosingRef.current = false;
        if (drawerRef.current) {
          gsap.set(drawerRef.current, { y: 0 });
        }
      },
    });
  }, []);

  // Pointer Down (Mouse/Touch Drag Initiation)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, a, input')) {
      return;
    }
    startYRef.current = e.clientY;
    currentDragYRef.current = 0;
    isDraggingRef.current = true;
  };

  // Pointer Move (Real-time GSAP drag tracking)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || isClosingRef.current || !drawerRef.current) {
      return;
    }
    const deltaY = e.clientY - startYRef.current;

    // Only allow downward drag
    if (deltaY > 0) {
      currentDragYRef.current = deltaY;
      gsap.set(drawerRef.current, { y: deltaY });
    }
  };

  // Pointer Up (Release & Spring Physics)
  const handlePointerUp = () => {
    if (!isDraggingRef.current || isClosingRef.current || !drawerRef.current) {
      return;
    }
    isDraggingRef.current = false;

    // Past 50px threshold -> close smoothly
    if (currentDragYRef.current > 50) {
      triggerCloseDrawer();
    } else {
      // Elastic spring bounce back to position
      gsap.to(drawerRef.current, {
        y: 0,
        duration: 0.42,
        ease: 'elastic.out(1, 0.75)',
      });
    }
    currentDragYRef.current = 0;
  };

  const handleSimulateScan = () => {
    setIsScanned(true);
  };

  const handleReset = () => {
    setIsScanned(false);
  };

  const handleVerifyManualPin = (pin: string) => {
    if (pin.length < 6) {
      setPinError('Masukkan 6 digit kode presensi.');
      return;
    }
    setPinError(null);
    setManualPin('');
    setDrawerView('menu');
    setIsScanned(true);
  };

  const handleCopyQr = () => {
    navigator.clipboard?.writeText('84920');
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

  return (
    <div
      className={cn(
        'relative h-full w-full flex flex-col justify-between overflow-hidden select-none transition-colors duration-300',
        isDark ? 'bg-neutral-950 text-white' : 'bg-slate-900 text-slate-900',
        props.className,
      )}
    >
      {/* 1. Live User Camera Viewport Background */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        {/* Live Video Feed Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
            cameraStatus === 'active' ? 'opacity-100' : 'opacity-0',
          )}
        />

        {/* Fallback Camera Background / Placeholder */}
        {cameraStatus !== 'active' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-neutral-950/90 backdrop-blur-md">
            {cameraStatus === 'requesting' && (
              <div className="flex flex-col items-center gap-3 text-white/80 animate-pulse">
                <Camera className="h-12 w-12 text-cyan-400" />
                <span className="text-xs font-semibold">Meminta Izin Akses Kamera...</span>
                <span className="text-[10px] text-white/50 max-w-[220px]">
                  Izinkan akses kamera pada browser Anda untuk memindai QR Code presensi.
                </span>
              </div>
            )}

            {cameraStatus === 'denied' && (
              <div className="flex flex-col items-center gap-3 text-white/80">
                <div className="p-3 rounded-full bg-rose-500/20 text-rose-400">
                  <CameraOff className="h-8 w-8" />
                </div>
                <span className="text-xs font-bold text-white">Akses Kamera Belum Diizinkan</span>
                <p className="text-[11px] text-white/60 max-w-[240px]">
                  Aktifkan izin kamera di pengaturan browser atau klik tombol di bawah untuk mencoba kembali.
                </p>
                <button
                  type="button"
                  onClick={requestCamera}
                  className={cn(
                    'mt-2 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer',
                    'btn-crisp-blue',
                    isDark && 'btn-crisp-blue-dark',
                  )}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Minta Izin Kamera</span>
                </button>
              </div>
            )}

            {cameraStatus === 'unsupported' && (
              <div className="flex flex-col items-center gap-2 text-white/70">
                <CameraOff className="h-8 w-8 text-amber-400" />
                <span className="text-xs font-semibold">Kamera Tidak Tersedia</span>
                <span className="text-[10px] text-white/50">Menggunakan mode simulasi presensi.</span>
              </div>
            )}
          </div>
        )}

        {/* Ambient Dark Vignette overlay on top of video */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/75 pointer-events-none z-10" />

        {/* Holographic Scanner Reticle Box Frame (Center Viewport Framing) */}
        {!isScanned && (
          <div className="absolute inset-0 z-15 flex flex-col items-center justify-center pointer-events-none pb-28">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              {/* Top-Left Corner Bracket */}
              <div
                className={cn(
                  'absolute -top-1 -left-1 w-8 h-8 border-t-3 border-l-3 rounded-tl-xl transition-colors duration-300',
                  isDark ? 'border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.6)]' : 'border-[#0d66e9] shadow-[0_0_12px_rgba(13,102,233,0.5)]',
                )}
              />
              {/* Top-Right Corner Bracket */}
              <div
                className={cn(
                  'absolute -top-1 -right-1 w-8 h-8 border-t-3 border-r-3 rounded-tr-xl transition-colors duration-300',
                  isDark ? 'border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.6)]' : 'border-[#0d66e9] shadow-[0_0_12px_rgba(13,102,233,0.5)]',
                )}
              />
              {/* Bottom-Left Corner Bracket */}
              <div
                className={cn(
                  'absolute -bottom-1 -left-1 w-8 h-8 border-b-3 border-l-3 rounded-bl-xl transition-colors duration-300',
                  isDark ? 'border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.6)]' : 'border-[#0d66e9] shadow-[0_0_12px_rgba(13,102,233,0.5)]',
                )}
              />
              {/* Bottom-Right Corner Bracket */}
              <div
                className={cn(
                  'absolute -bottom-1 -right-1 w-8 h-8 border-b-3 border-r-3 rounded-br-xl transition-colors duration-300',
                  isDark ? 'border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.6)]' : 'border-[#0d66e9] shadow-[0_0_12px_rgba(13,102,233,0.5)]',
                )}
              />

              {/* Centered Reticle Crosshair Pulse */}
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <div className={cn('w-4 h-[1.5px]', isDark ? 'bg-cyan-400' : 'bg-blue-400')} />
                <div className={cn('h-4 w-[1.5px] absolute', isDark ? 'bg-cyan-400' : 'bg-blue-400')} />
              </div>
            </div>

            {/* Prompt Helper Pill */}
            <div
              className={cn(
                'mt-5 px-3.5 py-1.5 rounded-full border backdrop-blur-md text-[11px] font-bold shadow-md transition-colors',
                isDark
                  ? 'bg-neutral-900/85 border-white/15 text-neutral-200 shadow-black/50'
                  : 'bg-white/90 border-slate-200/80 text-slate-800 shadow-slate-900/10',
              )}
            >
              <span>Arahkan kamera ke QR Code</span>
            </div>
          </div>
        )}

        {/* Retro Scanner Laser Sweep Pass */}
        {!isScanned && (
          <div className="absolute left-0 right-0 w-full pointer-events-none z-20 animate-retro-laser flex flex-col mix-blend-screen">
            {/* Retro Horizontal Silhouette Mask Trail */}
            <div
              className="w-full h-24 flex flex-col justify-end"
              style={{
                background: isDark
                  ? 'linear-gradient(to bottom, transparent 0%, rgba(56, 189, 248, 0.02) 35%, rgba(56, 189, 248, 0.12) 80%, rgba(56, 189, 248, 0.28) 100%)'
                  : 'linear-gradient(to bottom, transparent 0%, rgba(13, 102, 233, 0.02) 35%, rgba(13, 102, 233, 0.12) 80%, rgba(13, 102, 233, 0.28) 100%)',
                maskImage:
                  'repeating-linear-gradient(0deg, black 0px, black 1px, transparent 1px, transparent 3.5px)',
                WebkitMaskImage:
                  'repeating-linear-gradient(0deg, black 0px, black 1px, transparent 1px, transparent 3.5px)',
              }}
            />

            {/* Subdued Soft Master Scan Line */}
            <div
              className={cn('w-full h-[1.5px]', isDark ? 'bg-cyan-400/80' : 'bg-[#0d66e9]')}
              style={{
                boxShadow: isDark
                  ? '0 0 6px rgba(56, 189, 248, 0.6), 0 0 12px rgba(2, 132, 199, 0.35)'
                  : '0 0 6px rgba(13, 102, 233, 0.6), 0 0 12px rgba(13, 102, 233, 0.35)',
              }}
            />
          </div>
        )}

        {/* Flashlight Simulation Layer */}
        {isFlashOn && (
          <div className="absolute inset-0 bg-amber-100/20 pointer-events-none z-25 transition-opacity duration-300" />
        )}
      </div>

      {/* 2. Top Navigation Bar (Theme-Aware Floating Controls) */}
      <div className="relative z-30 flex items-center justify-between px-4 pt-3 pb-2">
        {/* Circular Back Button ( ← ) */}
        <button
          type="button"
          aria-label="Kembali"
          onClick={props.onBack}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-xl shadow-lg transition-all cursor-pointer active:scale-95',
            isDark
              ? 'bg-neutral-900/70 border-white/20 text-white hover:bg-neutral-800'
              : 'bg-white/80 border-slate-200/80 text-slate-800 hover:bg-white',
          )}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Top Right Circular Buttons: ( ? ) ( 🖼️ ) ( ⚡ ) */}
        <div className="flex items-center gap-2.5">
          {/* Help Button */}
          <button
            type="button"
            aria-label="Bantuan Presensi"
            onClick={() => alert('Arahkan kamera smartphone ke QR Code di meja poli atau resepsionis RS Amanah.')}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-xl shadow-lg transition-all cursor-pointer active:scale-95',
              isDark
                ? 'bg-neutral-900/70 border-white/20 text-white hover:bg-neutral-800'
                : 'bg-white/80 border-slate-200/80 text-slate-800 hover:bg-white',
            )}
          >
            <HelpCircle className="h-4.5 w-4.5" />
          </button>

          {/* Gallery / Upload QR Button */}
          <button
            type="button"
            aria-label="Pilih QR dari Galeri"
            onClick={() => {
              setIsDrawerOpen(true);
              setDrawerView('upload-qr');
            }}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-xl shadow-lg transition-all cursor-pointer active:scale-95',
              isDark
                ? 'bg-neutral-900/70 border-white/20 text-white hover:bg-neutral-800'
                : 'bg-white/80 border-slate-200/80 text-slate-800 hover:bg-white',
            )}
          >
            <ImageIcon className="h-4.5 w-4.5" />
          </button>

          {/* Flashlight Button */}
          <button
            type="button"
            aria-label="Senter Flash"
            onClick={toggleFlash}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-xl shadow-lg transition-all cursor-pointer active:scale-95',
              isFlashOn
                ? 'bg-amber-400 border-amber-300 text-neutral-950 shadow-amber-400/40'
                : isDark
                  ? 'bg-neutral-900/70 border-white/20 text-white hover:bg-neutral-800'
                  : 'bg-white/80 border-slate-200/80 text-slate-800 hover:bg-white',
            )}
          >
            <Flashlight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Spacer for clean, unobstructed camera perspective */}
      <div className="flex-1" />

      {/* 3. Floating Bottom Trigger (When Drawer is Closed/Swiped Down) */}
      {!isDrawerOpen && (
        <div className="relative z-20 flex justify-center pb-28 px-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <button
            type="button"
            onClick={() => {
              setDrawerView('menu');
              setIsDrawerOpen(true);
            }}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-full border backdrop-blur-xl shadow-xl transition-all cursor-pointer active:scale-95',
              isDark
                ? 'bg-neutral-900/90 border-white/20 text-white hover:bg-neutral-800'
                : 'bg-white/95 border-slate-200 text-slate-800 hover:bg-white shadow-slate-900/10',
            )}
          >
            <LayoutGrid className={cn('h-4 w-4', isDark ? 'text-cyan-400' : 'text-[#0d66e9]')} />
            <span className="text-xs font-bold">Buka Menu Presensi</span>
          </button>
        </div>
      )}

      {/* 4. Master Drawer Base Component (GSAP-powered Swipeable Bottom Sheet) */}
      {isDrawerOpen && (
        <div
          ref={drawerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={cn(
            'relative z-30 w-full rounded-t-[32px] border-t p-4 pb-32 sm:pb-36 shadow-2xl transition-colors duration-300 select-text touch-pan-y backdrop-blur-2xl will-change-transform',
            isDark
              ? 'bg-[#0f1422]/98 border-white/10 text-white shadow-black/80'
              : 'bg-white/98 border-slate-200/90 text-slate-900 shadow-2xl',
          )}
        >
          {/* Interactive Drag Handle (Drag down or click to dismiss) */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Tarik ke bawah untuk menutup"
            onClick={triggerCloseDrawer}
            className="flex w-full cursor-grab active:cursor-grabbing flex-col items-center justify-center pt-1 pb-3 shrink-0 touch-none select-none group"
          >
            <div
              className={cn(
                'h-1.25 w-12 rounded-full transition-colors duration-150',
                isDark ? 'bg-white/30 group-hover:bg-white/50' : 'bg-slate-300 group-hover:bg-slate-400',
              )}
            />
          </div>

          {/* VIEW 1: Main Menu Cards (Tampilkan QR • Presensi Manual • Upload QR) */}
          {drawerView === 'menu' && (
            <div className="animate-in fade-in duration-200">
              {/* Blue Info Strip Banner with Minimize Action */}
              <div
                className={cn(
                  'flex items-center justify-between p-2.5 pl-3.5 rounded-2xl text-white text-xs font-semibold mb-3 shadow-md',
                  isDark
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-700 shadow-cyan-600/20'
                    : 'bg-gradient-to-r from-[#0d66e9] to-[#0055ff] shadow-blue-500/25',
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <Sparkles className={cn('h-4 w-4 shrink-0', isDark ? 'text-cyan-200' : 'text-cyan-300')} />
                  <span className="text-[11px] truncate">Praktek Poli Anak dimulai 08:00 WIB</span>
                </div>
                <button
                  type="button"
                  onClick={triggerCloseDrawer}
                  title="Tutup Menu"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-black/25 text-white hover:bg-black/40 transition-colors shrink-0 ml-2 cursor-pointer"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* 3 Action Cards Grid */}
              <div className="grid grid-cols-3 gap-2">
                {/* Card 1: Tampilkan QR */}
                <button
                  type="button"
                  onClick={() => setDrawerView('my-qr')}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer shadow-xs active:scale-95',
                    isDark
                      ? 'bg-white/5 border-white/10 hover:border-cyan-400/50 hover:bg-white/10 text-white'
                      : 'bg-slate-50/80 border-slate-200/80 hover:border-blue-300 hover:bg-white text-slate-900',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
                      isDark ? 'bg-cyan-500/15 text-cyan-400' : 'bg-blue-50 text-[#0d66e9]',
                    )}
                  >
                    <QrCode className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold text-center leading-tight">
                    Tampilkan QR
                  </span>
                </button>

                {/* Card 2: Presensi Manual */}
                <button
                  type="button"
                  onClick={() => {
                    setPinError(null);
                    setManualPin('');
                    setDrawerView('manual-pin');
                  }}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer shadow-xs active:scale-95',
                    isDark
                      ? 'bg-white/5 border-white/10 hover:border-cyan-400/50 hover:bg-white/10 text-white'
                      : 'bg-slate-50/80 border-slate-200/80 hover:border-blue-300 hover:bg-white text-slate-900',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
                      isDark ? 'bg-cyan-500/15 text-cyan-400' : 'bg-blue-50 text-[#0d66e9]',
                    )}
                  >
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold text-center leading-tight">
                    Manual
                  </span>
                </button>

                {/* Card 3: Upload QR */}
                <button
                  type="button"
                  onClick={() => {
                    setDrawerView('upload-qr');
                  }}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer shadow-xs active:scale-95',
                    isDark
                      ? 'bg-white/5 border-white/10 hover:border-cyan-400/50 hover:bg-white/10 text-white'
                      : 'bg-slate-50/80 border-slate-200/80 hover:border-blue-300 hover:bg-white text-slate-900',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
                      isDark ? 'bg-cyan-500/15 text-cyan-400' : 'bg-blue-50 text-[#0d66e9]',
                    )}
                  >
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold text-center leading-tight">
                    Upload QR
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: Drawer Base Inline View for 6-Grid Non-Label PIN Input */}
          {drawerView === 'manual-pin' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-200 flex flex-col items-center text-center">
              {/* Header Navigation Bar inside Drawer Base */}
              <div className="w-full flex items-center justify-between pb-2 mb-3">
                <button
                  type="button"
                  onClick={() => setDrawerView('menu')}
                  className={cn(
                    'flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer py-1 -ml-0.5',
                    isDark
                      ? 'text-cyan-400 hover:text-cyan-300'
                      : 'text-[#0d66e9] hover:text-blue-700',
                  )}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  aria-label="Tutup drawer"
                  onClick={triggerCloseDrawer}
                  className={cn(
                    'p-1.5 rounded-full transition-colors cursor-pointer',
                    isDark ? 'text-neutral-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100',
                  )}
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>

              {/* 6-Grid Code Input (Pure Non-Label) */}
              <div className="mb-5 w-full flex justify-center">
                <OtpInput
                  value={manualPin}
                  length={6}
                  theme={props.theme}
                  onChange={(val) => {
                    setManualPin(val);
                    setPinError(null);
                  }}
                  onComplete={handleVerifyManualPin}
                  error={pinError ?? undefined}
                />
              </div>

              {/* Harmonized Verification Button */}
              <button
                type="button"
                onClick={() => handleVerifyManualPin(manualPin)}
                className={cn(
                  'w-full py-3 px-4 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer active:scale-98',
                  'btn-crisp-blue',
                  isDark && 'btn-crisp-blue-dark',
                )}
              >
                Verifikasi Presensi
              </button>
            </div>
          )}

          {/* VIEW 3: Drawer Base Inline View for Doctor QR Generator & 5-Digit Code */}
          {drawerView === 'my-qr' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-200 flex flex-col items-center text-center">
              {/* Header Bar inside Drawer Base */}
              <div className="w-full flex items-center justify-between pb-2 mb-2">
                <button
                  type="button"
                  onClick={() => setDrawerView('menu')}
                  className={cn(
                    'flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer py-1 -ml-0.5',
                    isDark
                      ? 'text-cyan-400 hover:text-cyan-300'
                      : 'text-[#0d66e9] hover:text-blue-700',
                  )}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Kembali</span>
                </button>

                {/* Pure Icon-Based Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Salin Kode"
                    title="Salin Kode Presensi"
                    onClick={handleCopyQr}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-lg border transition-all cursor-pointer',
                      isDark
                        ? 'border-white/15 bg-white/5 text-neutral-300 hover:text-white'
                        : 'border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900',
                    )}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    aria-label="Unduh QR"
                    title="Unduh QR"
                    onClick={() => alert('QR Code berhasil diunduh ke galeri.')}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-lg border transition-all cursor-pointer',
                      isDark
                        ? 'border-white/15 bg-white/5 text-neutral-300 hover:text-white'
                        : 'border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900',
                    )}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={triggerCloseDrawer}
                    className={cn(
                      'p-1 rounded-full transition-colors cursor-pointer ml-1',
                      isDark ? 'text-neutral-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100',
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic Vector SVG QR Code Generator */}
              <div className="p-3 rounded-2xl bg-white shadow-md border border-slate-100 inline-block mb-3">
                <QrCodeSvg
                  value="AMANAH:DOC-2026-0819:POLI-ANAK:20260521:84920"
                  size={152}
                  fgColor="#0a0e1a"
                  bgColor="#ffffff"
                />
              </div>

              {/* Large Prominent 5-Digit Code */}
              <div className="w-full flex flex-col items-center">
                <div
                  className={cn(
                    'inline-flex items-center justify-center px-6 py-2 rounded-2xl border shadow-xs transition-colors',
                    isDark
                      ? 'bg-cyan-500/10 border-cyan-500/25'
                      : 'bg-blue-50 border-blue-200/80',
                  )}
                >
                  <span
                    className={cn(
                      'font-mono text-2xl sm:text-3xl font-black tracking-[0.25em]',
                      isDark ? 'text-cyan-400' : 'text-[#0d66e9]',
                    )}
                  >
                    84920
                  </span>
                </div>
              </div>

              {copiedFeedback && (
                <span className="mt-2 text-[10px] font-semibold text-emerald-500 animate-in fade-in">
                  Kode 84920 berhasil disalin
                </span>
              )}
            </div>
          )}

          {/* VIEW 4: Drawer Base Inline View for Upload QR (Dashed Dropzone) */}
          {drawerView === 'upload-qr' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-200 flex flex-col items-center text-center w-full">
              {/* Header Bar inside Drawer Base */}
              <div className="w-full flex items-center justify-between pb-2 mb-3">
                <button
                  type="button"
                  onClick={() => setDrawerView('menu')}
                  className={cn(
                    'flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer py-1 -ml-0.5',
                    isDark
                      ? 'text-cyan-400 hover:text-cyan-300'
                      : 'text-[#0d66e9] hover:text-blue-700',
                  )}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  aria-label="Tutup drawer"
                  onClick={triggerCloseDrawer}
                  className={cn(
                    'p-1.5 rounded-full transition-colors cursor-pointer',
                    isDark ? 'text-neutral-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100',
                  )}
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>

              {/* Dashed Dropzone Upload Target Field */}
              <label
                className={cn(
                  'w-full flex flex-col items-center justify-center p-7 rounded-3xl border-2 border-dashed transition-all cursor-pointer group select-none',
                  isDark
                    ? 'border-white/20 bg-white/[0.02] hover:border-cyan-400/60 hover:bg-white/[0.05]'
                    : 'border-blue-200/80 bg-blue-50/20 hover:border-blue-400 hover:bg-blue-50/50',
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={() => {
                    setDrawerView('menu');
                    handleSimulateScan();
                  }}
                />
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl mb-2.5 transition-transform group-hover:scale-105',
                    isDark ? 'bg-cyan-500/15 text-cyan-400' : 'bg-blue-50 text-[#0d66e9]',
                  )}
                >
                  <UploadCloud className="h-6 w-6" />
                </div>
                <span className={cn('text-xs font-bold block mb-1', isDark ? 'text-white' : 'text-slate-800')}>
                  Pilih file QR atau seret ke sini
                </span>
                <span className={cn('text-[10px] block', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                  Format PNG, JPG, JPEG (Maks. 5MB)
                </span>
              </label>
            </div>
          )}
        </div>
      )}

      {/* 5. Success Feedback Card on Scan */}
      {isScanned && (
        <div
          className={cn(
            'absolute inset-x-3 bottom-24 z-40 p-4 rounded-2xl border backdrop-blur-2xl shadow-2xl animate-in slide-in-from-bottom-6 duration-300',
            isDark
              ? 'bg-emerald-950/95 border-emerald-500/60 text-white'
              : 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-emerald-900/10',
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 shadow-md">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold block">
                  Presensi Masuk Berhasil
                </span>
                <span
                  className={cn(
                    'text-[11px] block mt-0.5 font-medium',
                    isDark ? 'text-emerald-300/90' : 'text-emerald-800',
                  )}
                >
                  {doctorProfile.name} • {doctorProfile.role}
                </span>
                <span
                  className={cn(
                    'text-[10px] block mt-0.5',
                    isDark ? 'text-white/70' : 'text-slate-500',
                  )}
                >
                  21 Mei 2026, 07:28 WIB • Room 102
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

