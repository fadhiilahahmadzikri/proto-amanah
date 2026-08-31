import { gsap } from 'gsap';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { PatientDetailDrawer } from '@/components/molecules/PatientDetailDrawer';
import { QueueCardMaster } from '@/components/atoms/QueueCardMaster';
import { cn } from '@/lib/utils';
import { renderGenieFrame } from '@/lib/genie-renderer';
import type { QueueDockCardData } from '@/types/queue-dock.types';

export function QueueActivationOverlay(props: {
  isActivating?: boolean;
  showSuccess: boolean;
  isGenieSettled: boolean;
  activeCard?: QueueDockCardData;
  cardRef?: React.Ref<HTMLDivElement>;
  onClose: () => void;
  onRedraw?: () => void;
  onActionClick?: () => void;
  onRevealApex?: () => void;
  onGenieSettled?: () => void;
  initialDetailOpen?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const [showDetail, setShowDetail] = React.useState(Boolean(props.initialDetailOpen));
  const [isEmergenceComplete, setIsEmergenceComplete] = React.useState(props.isGenieSettled);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const isDark = (props.theme ?? 'dark') === 'dark';

  React.useEffect(() => {
    if (props.isGenieSettled) {
      setIsEmergenceComplete(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const width = 375;
    const height = 812;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Render offscreen card cover
    const offscreen = document.createElement('canvas');
    const cardW = 270;
    const cardH = 375;
    offscreen.width = cardW * dpr;
    offscreen.height = cardH * dpr;
    const oCtx = offscreen.getContext('2d');
    if (oCtx) {
      oCtx.scale(dpr, dpr);
      oCtx.fillStyle = isDark ? '#121624' : '#ffffff';
      if ('roundRect' in oCtx && typeof (oCtx as any).roundRect === 'function') {
        (oCtx as any).roundRect(0, 0, cardW, cardH, 22);
      } else {
        oCtx.rect(0, 0, cardW, cardH);
      }
      oCtx.fill();
      oCtx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(13, 102, 233, 0.3)';
      oCtx.lineWidth = 1.5;
      oCtx.stroke();

      // Card Cover Emblem & Queue Number
      oCtx.fillStyle = isDark ? '#38bdf8' : '#0d66e9';
      oCtx.font = 'bold 28px sans-serif';
      oCtx.textAlign = 'center';
      oCtx.fillText(props.activeCard?.queueNumber || '#02', cardW / 2, 70);

      // Watermark circle
      oCtx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(13, 102, 233, 0.1)';
      oCtx.beginPath();
      oCtx.arc(cardW / 2, 190, 65, 0, Math.PI * 2);
      oCtx.fill();
    }

    const dockPoint = { x: width / 2, y: height - 60 };
    const windowPoint = { x: (width - cardW) / 2, y: 110 };

    let startTime: number | null = null;
    let animId: number;
    const duration = 580;

    const animateEmergence = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(1, elapsed / duration);

      ctx.clearRect(0, 0, width, height);

      renderGenieFrame(
        ctx,
        offscreen,
        width,
        height,
        progress,
        'open',
        dockPoint,
        windowPoint,
        cardW,
        cardH,
        'bottom',
        dpr,
      );

      if (progress < 1) {
        animId = requestAnimationFrame(animateEmergence);
      } else {
        setIsEmergenceComplete(true);
        props.onGenieSettled?.();
      }
    };

    animId = requestAnimationFrame(animateEmergence);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [props.showSuccess, props.isGenieSettled, props.activeCard, isDark]);

  if (!props.showSuccess) {
    return null;
  }

  const handleCollectClick = () => {
    const cardEl = (props.cardRef && typeof props.cardRef !== 'function' ? props.cardRef.current : null) as HTMLElement | null;
    if (!cardEl) {
      props.onActionClick?.();
      return;
    }

    // Ultra-graceful & elegant 3D Card Retreat choreography (slow & cinematic)
    const tl = gsap.timeline({
      onComplete: () => {
        props.onActionClick?.();
      },
    });

    // 1. Initial gentle floating lift with subtle scale
    tl.to(cardEl, {
      y: -22,
      scale: 1.04,
      rotateX: -4,
      duration: 0.35,
      ease: 'power2.out',
    })
    // 2. Slow, graceful 3D Y-rotation and smooth descent into the queue records
    .to(cardEl, {
      rotateY: 360,
      rotateX: 0,
      scale: 0.42,
      y: 190,
      opacity: 0,
      duration: 1.05,
      ease: 'power2.inOut',
    });
  };

  return (
    <div
      className={cn(
        'absolute inset-0 z-40 flex flex-col px-5 pt-3 pb-6 backdrop-blur-md transition-opacity duration-500 select-none',
        isDark ? 'bg-[#0a0e1a]/95 text-white' : 'bg-[#f8faff]/95 text-slate-900',
        props.showSuccess ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        props.className,
      )}
    >
      {/* Interactive Mathematical Genie Emergence Canvas */}
      {!isEmergenceComplete && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          style={{ width: '100%', height: '100%' }}
        />
      )}

      {/* Top Header - Unified standard styling with optical centering */}
      <header
        className={cn(
          'relative z-10 flex w-full items-center justify-between transition-all duration-500 shrink-0 pt-2',
          isEmergenceComplete ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none',
        )}
      >
        <button
          type="button"
          aria-label="Kembali"
          className={cn(
            'p-1.5 -ml-1.5 rounded-full transition-all cursor-pointer active:scale-90 flex items-center justify-center',
            isDark
              ? 'text-neutral-200 hover:text-white hover:bg-white/10'
              : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100',
          )}
          onClick={props.onClose}
        >
          <ArrowLeft className="h-6 w-6 stroke-[2]" />
        </button>

        <span
          className={cn(
            'text-base font-bold tracking-tight text-center truncate',
            isDark ? 'text-white' : 'text-[#14103B]',
          )}
        >
          Antrean terpilih
        </span>

        <div className="w-9 h-9" />
      </header>

      {/* Activated Hero Card */}
      <div className="mt-2 flex flex-col flex-1 items-center justify-center">
        <div
          ref={props.cardRef}
          className={cn(
            'w-full max-w-[320px] flex justify-center shrink-0 will-change-transform',
            isEmergenceComplete ? 'opacity-100' : 'opacity-0',
          )}
        >
          {props.activeCard && (
            <QueueCardMaster
              card={props.activeCard}
              isRevealed={true}
              isSpinReady={isEmergenceComplete}
              badgeText="ANTREAN AKTIF"
              theme={props.theme}
              onRevealApex={props.onRevealApex}
              onCardClick={() => setShowDetail(true)}
            />
          )}
        </div>

        {/* Action Buttons: Panggil Pasien & Pilih Antrean Lain */}
        <div
          className={cn(
            'mb-6 mt-auto w-full flex flex-col gap-2.5 transition-all duration-500 delay-150',
            isEmergenceComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none',
          )}
        >
          {/* Primary Action: Panggil & Proses Pasien */}
          <button
            type="button"
            onClick={handleCollectClick}
            className={cn(
              'w-full rounded-2xl py-3.5 text-sm font-bold active:scale-98 transition-all cursor-pointer text-center',
              'btn-crisp-blue',
              isDark && 'btn-crisp-blue-dark',
            )}
          >
            Panggil &amp; Proses Pasien
          </button>

          {/* Secondary Action: Pilih Antrean Lain */}
          <button
            type="button"
            onClick={props.onRedraw ?? props.onClose}
            className={cn(
              'w-full rounded-2xl py-3 text-xs font-semibold active:scale-98 transition-all cursor-pointer text-center',
              isDark
                ? 'border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 bg-transparent'
                : 'border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100/90 bg-white/90 shadow-2xs',
            )}
          >
            Pilih Antrean Lain
          </button>
        </div>
      </div>

      {/* Patient Detail Master Drawer */}
      <PatientDetailDrawer
        isOpen={showDetail}
        patient={props.activeCard ?? null}
        onClose={() => setShowDetail(false)}
        theme={props.theme}
      />
    </div>
  );
}
