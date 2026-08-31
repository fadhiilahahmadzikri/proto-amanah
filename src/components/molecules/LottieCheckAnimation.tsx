'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * 3D Game-Style Emblem Shield & Ribbon Checkmark Badge for Password Success Screen.
 * Features faceted crystal gem core, 3D extruded rim bevels, specular glass glints,
 * multi-layered laurel wings, celebratory burst sparks, and an embossed 3D checkmark,
 * matching the exact color composition and design language of QueueBadge.
 */
export function LottieCheckAnimation(props: {
  className?: string;
  size?: number;
  theme?: 'dark' | 'light';
}) {
  const [animated, setAnimated] = React.useState(false);
  const isDark = props.theme === 'dark';
  const size = props.size ?? 120;
  const uid = React.useId().replace(/:/g, '-');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 80);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center select-none shrink-0 pointer-events-auto',
        props.className,
      )}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Volumetric Radial Glow Behind Emblem */}
      <div
        className={cn(
          'absolute inset-0 rounded-full blur-2xl transition-all duration-1000 scale-75 opacity-0 pointer-events-none',
          isDark ? 'bg-cyan-500/25' : 'bg-blue-600/20',
          animated && 'scale-125 opacity-100',
        )}
      />

      {/* Floating Sparkle Particles */}
      <div
        className={cn(
          'absolute -top-1 right-2 h-2.5 w-2.5 rounded-full transition-all duration-700 delay-200 opacity-0 transform pointer-events-none',
          isDark ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-blue-500 shadow-[0_0_8px_#3b82f6]',
          animated ? 'scale-100 opacity-90 -translate-y-2' : 'scale-0',
        )}
      />
      <div
        className={cn(
          'absolute bottom-2 -left-1 h-2 w-2 rounded-full transition-all duration-700 delay-300 opacity-0 transform pointer-events-none',
          isDark ? 'bg-sky-300 shadow-[0_0_6px_#38bdf8]' : 'bg-sky-400 shadow-[0_0_6px_#0284c7]',
          animated ? 'scale-100 opacity-90 -translate-x-2' : 'scale-0',
        )}
      />
      <div
        className={cn(
          'absolute top-3 -left-2.5 h-1.5 w-1.5 rounded-full bg-white transition-all duration-700 delay-400 opacity-0 transform pointer-events-none shadow-[0_0_6px_#ffffff]',
          animated ? 'scale-100 opacity-100 -translate-y-1' : 'scale-0',
        )}
      />
      <div
        className={cn(
          'absolute -bottom-1 right-4 h-2 w-2 rounded-full transition-all duration-700 delay-500 opacity-0 transform pointer-events-none',
          isDark ? 'bg-cyan-300 shadow-[0_0_6px_#67e8f9]' : 'bg-indigo-400 shadow-[0_0_6px_#6366f1]',
          animated ? 'scale-100 opacity-80 translate-y-2' : 'scale-0',
        )}
      />

      {/* 3D Game Shield Emblem SVG */}
      <svg
        viewBox="0 0 100 100"
        className={cn(
          'w-full h-full shrink-0 select-none transition-all duration-700 ease-out transform origin-center',
          animated ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-2',
        )}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 1. Ribbon Gradients (3D Fold: Left Highlight / Right Shaded) */}
          <linearGradient id={`ribbon-l-${uid}`} x1="34" y1="44" x2="50" y2="84" gradientUnits="userSpaceOnUse">
            <stop stopColor={isDark ? '#38bdf8' : '#0d66e9'} />
            <stop offset="1" stopColor={isDark ? '#0284c7' : '#1d58ac'} />
          </linearGradient>

          <linearGradient id={`ribbon-r-${uid}`} x1="50" y1="44" x2="66" y2="84" gradientUnits="userSpaceOnUse">
            <stop stopColor={isDark ? '#0284c7' : '#1d58ac'} />
            <stop offset="1" stopColor={isDark ? '#075985' : '#0e3a7a'} />
          </linearGradient>

          {/* 2. Crystal Wings Gradients & Cyan Platinum Accent Trim */}
          <linearGradient id={`accent-trim-${uid}`} x1="0" y1="0" x2="100" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor={isDark ? '#e0f2fe' : '#ffffff'} />
            <stop offset="0.3" stopColor={isDark ? '#38bdf8' : '#7dd3fc'} />
            <stop offset="0.7" stopColor={isDark ? '#0284c7' : '#38bdf8'} />
            <stop offset="1" stopColor={isDark ? '#0369a1' : '#0284c7'} />
          </linearGradient>

          <linearGradient id={`wing-top-l-${uid}`} x1="3" y1="8" x2="34" y2="23" gradientUnits="userSpaceOnUse">
            <stop stopColor={isDark ? '#e0f2fe' : '#ffffff'} />
            <stop offset="0.3" stopColor={isDark ? '#a5f3fc' : '#bfdbfe'} />
            <stop offset="0.7" stopColor={isDark ? '#38bdf8' : '#60a5fa'} />
            <stop offset="1" stopColor={isDark ? '#0284c7' : '#0d66e9'} />
          </linearGradient>

          <linearGradient id={`wing-top-r-${uid}`} x1="97" y1="8" x2="66" y2="23" gradientUnits="userSpaceOnUse">
            <stop stopColor={isDark ? '#e0f2fe' : '#ffffff'} />
            <stop offset="0.3" stopColor={isDark ? '#a5f3fc' : '#bfdbfe'} />
            <stop offset="0.7" stopColor={isDark ? '#38bdf8' : '#60a5fa'} />
            <stop offset="1" stopColor={isDark ? '#0284c7' : '#0d66e9'} />
          </linearGradient>

          <linearGradient id={`wing-mid-l-${uid}`} x1="10" y1="22" x2="24" y2="29" gradientUnits="userSpaceOnUse">
            <stop stopColor={isDark ? '#38bdf8' : '#0d66e9'} />
            <stop offset="1" stopColor={isDark ? '#0369a1' : '#1d58ac'} />
          </linearGradient>

          <linearGradient id={`wing-mid-r-${uid}`} x1="90" y1="22" x2="76" y2="29" gradientUnits="userSpaceOnUse">
            <stop stopColor={isDark ? '#38bdf8' : '#0d66e9'} />
            <stop offset="1" stopColor={isDark ? '#0369a1' : '#1d58ac'} />
          </linearGradient>

          <linearGradient id={`wing-bot-l-${uid}`} x1="13" y1="29" x2="24" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor={isDark ? '#0284c7' : '#1d58ac'} />
            <stop offset="1" stopColor={isDark ? '#082f49' : '#0e3a7a'} />
          </linearGradient>

          <linearGradient id={`wing-bot-r-${uid}`} x1="87" y1="29" x2="76" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor={isDark ? '#0284c7' : '#1d58ac'} />
            <stop offset="1" stopColor={isDark ? '#082f49' : '#0e3a7a'} />
          </linearGradient>

          {/* 3. Outer Hex Frame 3D Metallic / Crystal Gradient */}
          <linearGradient id={`hex-frame-${uid}`} x1="22" y1="6" x2="78" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor={isDark ? '#e0f2fe' : '#ffffff'} />
            <stop offset="0.15" stopColor={isDark ? '#38bdf8' : '#93c5fd'} />
            <stop offset="0.5" stopColor={isDark ? '#0284c7' : '#0d66e9'} />
            <stop offset="0.85" stopColor={isDark ? '#075985' : '#1d58ac'} />
            <stop offset="1" stopColor={isDark ? '#082f49' : '#0e3a7a'} />
          </linearGradient>

          {/* 4. Extruded 3D Bottom Lip Bevel Gradient */}
          <linearGradient id={`hex-bottom-bevel-${uid}`} x1="50" y1="54" x2="50" y2="74" gradientUnits="userSpaceOnUse">
            <stop stopColor={isDark ? '#0369a1' : '#1d58ac'} />
            <stop offset="1" stopColor={isDark ? '#082f49' : '#0f172a'} />
          </linearGradient>

          {/* 5. Inner Inset Chamfer Ring Gradient */}
          <linearGradient id={`hex-chamfer-${uid}`} x1="27" y1="11" x2="73" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor={isDark ? '#67e8f9' : '#bfdbfe'} />
            <stop offset="0.4" stopColor={isDark ? '#22d3ee' : '#60a5fa'} />
            <stop offset="1" stopColor={isDark ? '#0284c7' : '#1d58ac'} />
          </linearGradient>

          {/* 6. Crystal Gem Core: Left Facet (Light) & Right Facet (Shade) */}
          <linearGradient id={`gem-left-${uid}`} x1="32" y1="15" x2="50" y2="61" gradientUnits="userSpaceOnUse">
            <stop stopColor={isDark ? '#38bdf8' : '#38bdf8'} />
            <stop offset="0.5" stopColor={isDark ? '#0284c7' : '#0d66e9'} />
            <stop offset="1" stopColor={isDark ? '#0369a1' : '#1d58ac'} />
          </linearGradient>

          <linearGradient id={`gem-right-${uid}`} x1="50" y1="15" x2="68" y2="61" gradientUnits="userSpaceOnUse">
            <stop stopColor={isDark ? '#0284c7' : '#1d58ac'} />
            <stop offset="0.6" stopColor={isDark ? '#0369a1' : '#1d58ac'} />
            <stop offset="1" stopColor={isDark ? '#082f49' : '#0e3a7a'} />
          </linearGradient>

          {/* 7. Specular Gloss Curve */}
          <linearGradient id={`specular-gloss-${uid}`} x1="50" y1="15" x2="50" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="0.65" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* 8. 3D Embossed Checkmark Gradient */}
          <linearGradient id={`check-grad-${uid}`} x1="36" y1="24" x2="64" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="0.55" stopColor="#f0f9ff" />
            <stop offset="1" stopColor={isDark ? '#bae6fd' : '#dbeafe'} />
          </linearGradient>
        </defs>

        {/* ================= LAYER 1: 3D HANGING RIBBON ================= */}
        {/* Ribbon Left Half (Light Facet) */}
        <path
          d="M34 46H50V74L34 85V46Z"
          fill={`url(#ribbon-l-${uid})`}
        />
        {/* Ribbon Right Half (Shadow Facet) */}
        <path
          d="M50 46H66V85L50 74V46Z"
          fill={`url(#ribbon-r-${uid})`}
        />
        {/* Ribbon V-Notch 3D Bottom Lip Stroke */}
        <path
          d="M34 85L50 74L66 85"
          stroke={`url(#accent-trim-${uid})`}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Ribbon Center Vertical Crease */}
        <line
          x1="50"
          y1="46"
          x2="50"
          y2="74"
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="1"
        />
        {/* Under-Shield Ambient Contact Shadow */}
        <path
          d="M34 46H66V53L50 50L34 53V46Z"
          fill="rgba(0,0,0,0.35)"
        />

        {/* ================= LAYER 2: 3D CRYSTAL MECHA WINGS WITH THEME ACCENT TRIM ================= */}
        {/* Left Crystal Wing */}
        <g>
          {/* Main Wing Body / Base */}
          <path
            d="M34 16L3 8L10 22L17 38L24 38L24 23Z"
            fill={`url(#wing-top-l-${uid})`}
          />
          {/* Top Wing Blade Highlight Facet */}
          <path
            d="M34 16L3 8L18 17Z"
            fill="rgba(255, 255, 255, 0.45)"
          />
          {/* Mid Wing Tier Facet */}
          <path
            d="M10 22L13 29L24 29L24 23Z"
            fill={`url(#wing-mid-l-${uid})`}
          />
          {/* Bottom Wing Tier Facet */}
          <path
            d="M13 29L17 38L24 38L24 29Z"
            fill={`url(#wing-bot-l-${uid})`}
          />
          {/* Internal Facet Ridge Lines */}
          <line
            x1="10"
            y1="22"
            x2="24"
            y2="23"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="0.8"
          />
          <line
            x1="13"
            y1="29"
            x2="24"
            y2="29"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="0.8"
          />
          {/* Outer Theme Bezel Trim */}
          <path
            d="M34 16L3 8L10 22L17 38L24 38"
            stroke={`url(#accent-trim-${uid})`}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Right Crystal Wing */}
        <g>
          {/* Main Wing Body / Base */}
          <path
            d="M66 16L97 8L90 22L83 38L76 38L76 23Z"
            fill={`url(#wing-top-r-${uid})`}
          />
          {/* Top Wing Blade Highlight Facet */}
          <path
            d="M66 16L97 8L82 17Z"
            fill="rgba(255, 255, 255, 0.35)"
          />
          {/* Mid Wing Tier Facet */}
          <path
            d="M90 22L87 29L76 29L76 23Z"
            fill={`url(#wing-mid-r-${uid})`}
          />
          {/* Bottom Wing Tier Facet */}
          <path
            d="M87 29L83 38L76 38L76 29Z"
            fill={`url(#wing-bot-r-${uid})`}
          />
          {/* Internal Facet Ridge Lines */}
          <line
            x1="90"
            y1="22"
            x2="76"
            y2="23"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="0.8"
          />
          <line
            x1="87"
            y1="29"
            x2="76"
            y2="29"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="0.8"
          />
          {/* Outer Theme Bezel Trim */}
          <path
            d="M66 16L97 8L90 22L83 38L76 38"
            stroke={`url(#accent-trim-${uid})`}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* ================= LAYER 3: 3D EXTRUDED SHIELD BASE ================= */}
        {/* Bottom 3D Bevel Extrusion */}
        <path
          d="M22 54L50 70L78 54V58L50 74L22 58V54Z"
          fill={`url(#hex-bottom-bevel-${uid})`}
        />

        {/* ================= LAYER 4: 3D OUTER HEXAGON FRAME ================= */}
        <path
          d="M50 6L78 22V54L50 70L22 54V22L50 6Z"
          fill={`url(#hex-frame-${uid})`}
        />

        {/* 3D Frame Top-Left Highlight Edge */}
        <path
          d="M22 54V22L50 6L78 22"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3D Frame Bottom-Right Shade Edge */}
        <path
          d="M78 22V54L50 70L22 54"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ================= LAYER 5: 3D INSET CHAMFER RING ================= */}
        <path
          d="M50 11L73 24.5V51.5L50 65L27 51.5V24.5L50 11Z"
          fill={`url(#hex-chamfer-${uid})`}
        />

        {/* ================= LAYER 6: 3D CRYSTAL GEM CORE ================= */}
        {/* Left Core Facet (Light) */}
        <path
          d="M50 15V61L32 49.5V26.5L50 15Z"
          fill={`url(#gem-left-${uid})`}
        />
        {/* Right Core Facet (Shade) */}
        <path
          d="M50 15L68 26.5V49.5L50 61V15Z"
          fill={`url(#gem-right-${uid})`}
        />

        {/* Core Vertical Center Ridge */}
        <line
          x1="50"
          y1="15"
          x2="50"
          y2="61"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.8"
        />

        {/* ================= LAYER 7: SPECULAR GLASS GLOSS SHEEN ================= */}
        <path
          d="M32 26.5L50 15L68 26.5C68 26.5 58 37 32 31.5Z"
          fill={`url(#specular-gloss-${uid})`}
        />

        {/* Star Sparkle Glint on Top-Left Bevel Vertex */}
        <g transform="translate(32, 19)">
          <path
            d="M0 -3.5L0.8 -0.8L3.5 0L0.8 0.8L0 3.5L-0.8 0.8L-3.5 0L-0.8 -0.8Z"
            fill="#ffffff"
            opacity="0.9"
          />
        </g>

        {/* Second Sparkle Glint on Top-Right */}
        <g transform="translate(68, 22)">
          <path
            d="M0 -2.5L0.6 -0.6L2.5 0L0.6 0.6L0 2.5L-0.6 0.6L-2.5 0L-0.6 -0.6Z"
            fill="#ffffff"
            opacity="0.85"
          />
        </g>

        {/* ================= LAYER 8: 3D EMBOSSED GAME CHECKMARK ================= */}
        {/* 3D Extruded Depth Underlayer Shadow */}
        <path
          d="M37 39.5L46 48.5L64 30.5"
          stroke={isDark ? '#041f3d' : '#0f2b66'}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="select-none"
        />

        {/* Primary Front Face Checkmark with Smooth Draw-in Animation */}
        <path
          d="M37 37.5L46 46.5L64 28.5"
          stroke={`url(#check-grad-${uid})`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="50"
          strokeDashoffset={animated ? '0' : '50'}
          className="transition-all duration-600 delay-250 ease-out select-none"
        />

        {/* Crisp Top Specular Ridge Line for 3D Bevel Pop */}
        <path
          d="M37.5 37L46 45.5L63.5 28"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="50"
          strokeDashoffset={animated ? '0' : '50'}
          className="transition-all duration-600 delay-350 ease-out select-none"
        />
      </svg>
    </div>
  );
}
