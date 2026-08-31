'use client';

import { gsap } from 'gsap';
import {
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  X,
} from 'lucide-react';
import React from 'react';
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';

export interface MonthData {
  monthName: string;
  year: number;
  data: Array<{
    dayShort: string;
    label: string;
    patients: number;
    newPatients: number;
  }>;
}

const MONTHLY_RECORDS: MonthData[] = [
  {
    monthName: 'Mei',
    year: 2026,
    data: [
      { dayShort: '1 Mei', label: '1 Mei', patients: 82, newPatients: 26 },
      { dayShort: '6 Mei', label: '6 Mei', patients: 95, newPatients: 30 },
      { dayShort: '11 Mei', label: '11 Mei', patients: 104, newPatients: 32 },
      { dayShort: '16 Mei', label: '16 Mei', patients: 98, newPatients: 28 },
      { dayShort: '21 Mei', label: '21 Mei', patients: 112, newPatients: 36 },
      { dayShort: '26 Mei', label: '26 Mei', patients: 120, newPatients: 38 },
      { dayShort: '31 Mei', label: '31 Mei', patients: 128, newPatients: 42 },
    ],
  },
  {
    monthName: 'Juni',
    year: 2026,
    data: [
      { dayShort: '1 Jun', label: '1 Juni', patients: 85, newPatients: 25 },
      { dayShort: '6 Jun', label: '6 Juni', patients: 102, newPatients: 32 },
      { dayShort: '11 Jun', label: '11 Juni', patients: 110, newPatients: 34 },
      { dayShort: '16 Jun', label: '16 Juni', patients: 105, newPatients: 30 },
      { dayShort: '21 Jun', label: '21 Juni', patients: 122, newPatients: 38 },
      { dayShort: '26 Jun', label: '26 Juni', patients: 128, newPatients: 37 },
      { dayShort: '30 Jun', label: '30 Juni', patients: 135, newPatients: 40 },
    ],
  },
  {
    monthName: 'Juli',
    year: 2026,
    data: [
      { dayShort: '1 Jul', label: '1 Juli', patients: 90, newPatients: 28 },
      { dayShort: '6 Jul', label: '6 Juni', patients: 108, newPatients: 35 },
      { dayShort: '11 Jul', label: '11 Juli', patients: 115, newPatients: 36 },
      { dayShort: '16 Jul', label: '16 Juli', patients: 110, newPatients: 88 },
      { dayShort: '21 Jul', label: '21 Juli', patients: 126, newPatients: 40 },
      { dayShort: '26 Jul', label: '26 Juli', patients: 132, newPatients: 42 },
      { dayShort: '31 Jul', label: '31 Juli', patients: 138, newPatients: 45 },
    ],
  },
  {
    monthName: 'Agustus',
    year: 2026,
    data: [
      { dayShort: '1 Agu', label: '1 Agustus', patients: 88, newPatients: 27 },
      { dayShort: '3 Agu', label: '3 Agustus', patients: 112, newPatients: 34 },
      { dayShort: '5 Agu', label: '5 Agustus', patients: 118, newPatients: 36 },
      { dayShort: '7 Agu', label: '7 Agustus', patients: 105, newPatients: 32 },
      { dayShort: '9 Agu', label: '9 Agustus', patients: 114, newPatients: 35 },
      { dayShort: '11 Agu', label: '11 Agustus', patients: 109, newPatients: 33 },
      { dayShort: '12 Agu', label: '12 Agustus', patients: 140, newPatients: 43 },
    ],
  },
  {
    monthName: 'September',
    year: 2026,
    data: [
      { dayShort: '1 Sep', label: '1 September', patients: 92, newPatients: 29 },
      { dayShort: '6 Sep', label: '6 September', patients: 115, newPatients: 36 },
      { dayShort: '11 Sep', label: '11 September', patients: 120, newPatients: 38 },
      { dayShort: '16 Sep', label: '16 September', patients: 118, newPatients: 35 },
      { dayShort: '21 Sep', label: '21 September', patients: 130, newPatients: 42 },
      { dayShort: '26 Sep', label: '26 September', patients: 138, newPatients: 44 },
      { dayShort: '30 Sep', label: '30 September', patients: 146, newPatients: 46 },
    ],
  },
];

function AnimatedNumber(props: {
  target: number;
}) {
  const [displayVal, setDisplayVal] = React.useState('0');
  const countRef = React.useRef({ val: 0 });

  React.useEffect(() => {
    const obj = countRef.current;
    gsap.fromTo(
      obj,
      { val: 0 },
      {
        val: props.target,
        duration: 1.1,
        ease: 'power2.out',
        onUpdate: () => {
          setDisplayVal(Math.round(obj.val).toLocaleString());
        },
      },
    );
  }, [props.target]);

  return <span>{displayVal}</span>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload?: {
      dayShort: string;
      label: string;
      patients: number;
    };
    value?: number;
  }>;
  isDark?: boolean;
}

function AreaCustomTooltip(props: CustomTooltipProps) {
  if (props.active && props.payload && props.payload.length > 0) {
    const item = props.payload[0]?.payload;
    if (!item) return null;
    return (
      <div
        className={cn(
          'px-3 py-1.5 rounded-xl text-[11px] font-extrabold shadow-md border animate-in fade-in zoom-in-95 duration-150',
          props.isDark
            ? 'bg-[#0f1422]/98 text-white border-white/20 shadow-black/80'
            : 'bg-white text-slate-900 border-slate-200/90 shadow-slate-200',
        )}
      >
        <span>{item.label}</span> • <span className="text-[#0d66e9] dark:text-cyan-400 font-black">{item.patients} Pasien</span>
      </div>
    );
  }
  return null;
}

// Customized Round Beam Indicator Dot on the tip of the chart (Harmonious Blue/Cyan Glow)
interface TipDotProps {
  cx?: number;
  cy?: number;
  index?: number;
  dataLength?: number;
}

function CustomizedTipBeamDot(props: TipDotProps) {
  const { cx, cy, index, dataLength } = props;
  if (cx === undefined || cy === undefined || index === undefined || dataLength === undefined) {
    return null;
  }
  // Render beam glow only on the final/tip point of the curve
  if (index === dataLength - 1) {
    return (
      <g key={`tip-beam-${index}`}>
        {/* Layer 1: Pulsing Beam Radar Halo */}
        <circle
          cx={cx}
          cy={cy}
          r={11}
          fill="#38BDF8"
          opacity={0.45}
          className="animate-ping"
        />
        {/* Layer 2: Ambient Outer Glow */}
        <circle
          cx={cx}
          cy={cy}
          r={7}
          fill="#0d66e9"
          opacity={0.4}
        />
        {/* Layer 3: Solid Core Dot */}
        <circle
          cx={cx}
          cy={cy}
          r={4.5}
          fill="#0d66e9"
          stroke="#ffffff"
          strokeWidth={2}
          filter="url(#tipBeamGlowFilter)"
        />
      </g>
    );
  }
  return null;
}

export function ClinicAnalyticsSection(props: {
  theme?: 'dark' | 'light';
  onViewDetails?: () => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const [monthIndex, setMonthIndex] = React.useState(1); // Default: Juni (Index 1)
  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const currentRecord = MONTHLY_RECORDS[monthIndex] ?? MONTHLY_RECORDS[1]!;
  const series = currentRecord.data;

  // Dynamic calculations from dataset
  const totalPatients = series.reduce((sum, item) => sum + item.patients, 0);
  const totalNewPatients = series.reduce((sum, item) => sum + item.newPatients, 0);
  const totalReturningPatients = totalPatients - totalNewPatients;
  const averageVal = Math.round(totalPatients / series.length);

  const handlePrevMonth = () => {
    setMonthIndex((prev) => (prev > 0 ? prev - 1 : MONTHLY_RECORDS.length - 1));
  };

  const handleNextMonth = () => {
    setMonthIndex((prev) => (prev < MONTHLY_RECORDS.length - 1 ? prev + 1 : 0));
  };

  // Entrance animation for the chart card
  React.useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 18, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' },
      );
    }
  }, []);

  return (
    <div className={cn('flex flex-col gap-2.5 mb-4 select-none', props.className)}>
      {/* Section Header */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              'font-extrabold text-[15px] sm:text-[16px] tracking-tight transition-colors',
              isDark ? 'text-white' : 'text-[#1a1d2e]',
            )}
          >
            Tren kunjungan pasien
          </h3>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0d66e9]" />
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowDetailModal(true)}
          className={cn(
            'px-3 py-1 rounded-full text-[11px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer focus:outline-none select-none',
            isDark
              ? 'bg-white/10 text-neutral-300 hover:bg-white/15 backdrop-blur-md'
              : 'bg-white text-slate-700 hover:bg-gray-50 shadow-sm border border-slate-100',
          )}
        >
          <span>Rincian</span>
        </button>
      </div>

      {/* SINGLE EXPANDED PATIENT GROWTH CARD */}
      <div
        ref={cardRef}
        className={cn(
          'relative w-full rounded-[28px] sm:rounded-[32px] p-4.5 sm:p-6 transition-all duration-300 border flex flex-col justify-between shadow-sm overflow-hidden',
          isDark
            ? 'bg-[#0f1422]/95 border-white/10 text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)]'
            : 'bg-white border-slate-100 text-slate-900 shadow-[0_8px_28px_rgba(0,0,0,0.03)]',
        )}
      >
        {/* Top Row: Month Slider Navigation */}
        <div className="flex items-center justify-between w-full mb-3 pb-2.5 border-b border-slate-100 dark:border-white/5">
          <button
            type="button"
            aria-label="Bulan Sebelumnya"
            onClick={handlePrevMonth}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90',
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700',
            )}
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="flex flex-col items-center">
            <span
              className={cn(
                'text-[13px] sm:text-[14px] font-extrabold tracking-tight',
                isDark ? 'text-neutral-200' : 'text-slate-800',
              )}
            >
              {currentRecord.monthName} {currentRecord.year}
            </span>
          </div>

          <button
            type="button"
            aria-label="Bulan Berikutnya"
            onClick={handleNextMonth}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90',
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700',
            )}
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Hero Metric & Growth Badge with Rolling Number Animation */}
        <div className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-baseline gap-1.5">
            <span
              className={cn(
                'text-[32px] sm:text-[36px] font-black tracking-tight leading-none tabular-nums',
                isDark ? 'text-white' : 'text-slate-900',
              )}
            >
              <AnimatedNumber target={totalPatients} />
            </span>
            <span className="text-xs sm:text-[13px] font-bold text-slate-400 dark:text-neutral-400">
              Total Kunjungan
            </span>
          </div>

          <div
            className={cn(
              'flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border',
              isDark
                ? 'bg-blue-950/60 text-cyan-400 border-cyan-500/20'
                : 'bg-blue-50 text-[#0d66e9] border-blue-200/60',
            )}
          >
            <ArrowUp className="w-3 h-3 stroke-[3]" />
            <span>+12.5%</span>
          </div>
        </div>

        {/* Recharts Area Chart with Beam Glow Indicator at Tip */}
        <div className="relative w-full h-[140px] sm:h-[150px] my-2 select-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 14, right: 8, left: 6, bottom: 0 }}>
              <defs>
                <linearGradient id="clinicSmoothAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d66e9" stopOpacity={isDark ? 0.45 : 0.32} />
                  <stop offset="65%" stopColor="#38BDF8" stopOpacity={isDark ? 0.15 : 0.08} />
                  <stop offset="100%" stopColor="#0d66e9" stopOpacity={0.0} />
                </linearGradient>

                {/* SVG Beam Glow Drop Shadow Filter */}
                <filter id="tipBeamGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#0d66e9" floodOpacity="0.9" />
                </filter>
              </defs>

              <XAxis
                dataKey="dayShort"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fontWeight: 700,
                  fill: isDark ? '#94a3b8' : '#64748b',
                }}
              />

              <YAxis hide domain={['dataMin - 15', 'dataMax + 15']} />

              <ReferenceLine
                y={averageVal}
                stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'}
                strokeDasharray="4 4"
              />

              <Tooltip
                content={<AreaCustomTooltip isDark={isDark} />}
                cursor={{
                  stroke: '#0d66e9',
                  strokeWidth: 1.5,
                  strokeDasharray: '2 2',
                  strokeOpacity: 0.35,
                }}
              />

              <Area
                key={monthIndex}
                type="monotone"
                dataKey="patients"
                stroke="#0d66e9"
                strokeWidth={2.5}
                fill="url(#clinicSmoothAreaGrad)"
                dot={<CustomizedTipBeamDot dataLength={series.length} />}
                activeDot={{
                  r: 5.5,
                  fill: '#0d66e9',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Minimalist & Clear 2-Column Patient Breakdown (Kontrol vs Baru) */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-white/5 text-xs">
          {/* Card Left: Kontrol (Lama) */}
          <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100/80 dark:border-white/5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
              <span className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400 truncate">
                Kontrol
              </span>
            </div>
            <span className="font-black text-[13px] text-slate-900 dark:text-white tabular-nums">
              <AnimatedNumber target={totalReturningPatients} />
            </span>
          </div>

          {/* Card Right: Baru */}
          <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100/80 dark:border-white/5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
              <span className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400 truncate">
                Baru
              </span>
            </div>
            <span className="font-black text-[13px] text-[#0d66e9] dark:text-cyan-400 tabular-nums">
              <AnimatedNumber target={totalNewPatients} />
            </span>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER FOR CLINIC ANALYTICS */}
      {showDetailModal && (
        <>
          <div
            onClick={() => setShowDetailModal(false)}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          <div
            className={cn(
              'absolute inset-x-3 bottom-6 z-60 p-5 rounded-3xl shadow-2xl border transition-all animate-in slide-in-from-bottom-4 duration-300 select-none flex flex-col gap-3.5 backdrop-blur-2xl max-h-[85%]',
              isDark
                ? 'bg-[#0f1422]/98 border-white/15 text-white shadow-black/90'
                : 'bg-white/98 border-slate-200 text-slate-900 shadow-2xl',
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-[#0d66e9] flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black tracking-tight">
                    Rincian Kunjungan Poliklinik
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-neutral-400">
                    Bulan: {currentRecord.monthName} {currentRecord.year} • RS Amanah Sehat
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[55vh] pr-1 no-scrollbar text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-semibold block mb-0.5">
                    Pasien Kontrol (Lama)
                  </span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    {totalReturningPatients.toLocaleString()} Pasien
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-semibold block mb-0.5">
                    Pasien Baru
                  </span>
                  <span className="text-base font-extrabold text-[#0d66e9] dark:text-cyan-400">
                    {totalNewPatients.toLocaleString()} Pasien
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 leading-relaxed">
                <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-bold block mb-1">
                  Keterangan Analisis Layanan
                </span>
                <p className="text-slate-600 dark:text-neutral-300">
                  Total kunjungan poli anak RS Amanah Sehat pada bulan {currentRecord.monthName} {currentRecord.year} mencapai {totalPatients.toLocaleString()} pasien, didominasi oleh pasien kontrol rutin ({Math.round((totalReturningPatients / totalPatients) * 100)}%) dan pasien baru ({Math.round((totalNewPatients / totalPatients) * 100)}%).
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95',
                  isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-100 text-slate-800 hover:bg-slate-200',
                )}
              >
                Tutup
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
