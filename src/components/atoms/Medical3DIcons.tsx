import { cn } from '@/lib/utils';

export type Medical3DIconName =
  | 'shield'
  | 'heart'
  | 'briefcase'
  | 'dna'
  | 'pill-bottle'
  | 'syringe'
  | 'atom'
  | 'clipboard'
  | 'dropper';

/**
 * Shared SVG Defs for 3D Medical Icons
 * Defines all high-fidelity gradients, 3D drop-shadow filters, and glossy specular overlays.
 */
export function Medical3DSVGDefs() {
  return (
    <svg
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        {/* High-quality dual drop shadow for 3D pop */}
        <filter id="shadow-3d" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="12"
            floodColor="#4ba0ff"
            floodOpacity="0.3"
            result="shadow1"
          />
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="4"
            floodColor="#1e3a8a"
            floodOpacity="0.1"
            result="shadow2"
          />
          <feMerge>
            <feMergeNode in="shadow1" />
            <feMergeNode in="shadow2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Base Main Blue Gradient (Front faces) */}
        <linearGradient id="grad-blue-main" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b6dbff" />
          <stop offset="40%" stopColor="#6eb5ff" />
          <stop offset="100%" stopColor="#3a96ff" />
        </linearGradient>

        <radialGradient id="grad-blue-radial" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#93ccff" />
          <stop offset="80%" stopColor="#4aa1ff" />
          <stop offset="100%" stopColor="#227eff" />
        </radialGradient>

        {/* Dark Blue Gradient (Extrusions / Shadows) */}
        <linearGradient id="grad-blue-dark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#50a4ff" />
          <stop offset="100%" stopColor="#146ae6" />
        </linearGradient>

        {/* Light Cyan Gradient (Crosses / Highlights) */}
        <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d6edff" />
        </linearGradient>

        <linearGradient id="grad-cyan-dark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d6edff" />
          <stop offset="100%" stopColor="#80c2ff" />
        </linearGradient>

        {/* Glass Gradient */}
        <linearGradient id="grad-glass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#9dcaff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
        </linearGradient>

        {/* Glossy Highlight (Specular) */}
        <linearGradient id="grad-gloss" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1.0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
        </linearGradient>

        {/* Metallic/Grey Gradient for components */}
        <linearGradient id="grad-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#c6d8eb" />
          <stop offset="100%" stopColor="#8ba7c4" />
        </linearGradient>

        <clipPath id="board-clip">
          <rect x="20" y="10" width="60" height="75" rx="8" />
        </clipPath>

        <clipPath id="box-clip">
          <rect x="10" y="20" width="80" height="60" rx="12" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** 1. 3D Shield Icon */
export function Shield3DIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('w-full h-full overflow-visible drop-shadow-[0_15px_15px_rgba(37,99,235,0.15)]', props.className)}
      filter="url(#shadow-3d)"
    >
      <path
        d="M 50,15 Q 85,20 90,25 Q 95,60 50,95 Q 5,60 10,25 Q 15,20 50,15 Z"
        fill="url(#grad-blue-dark)"
        transform="translate(0, 6)"
      />
      <path
        d="M 50,10 Q 85,15 90,20 Q 95,55 50,90 Q 5,55 10,20 Q 15,15 50,10 Z"
        fill="url(#grad-blue-main)"
      />
      <path
        d="M 50,15 Q 81,19.5 85,24 Q 89.5,53 50,83 Q 10.5,53 15,24 Q 19,19.5 50,15 Z"
        fill="none"
        stroke="url(#grad-cyan)"
        strokeWidth="2"
        opacity="0.6"
      />
      <path
        d="M 50,10 Q 70,12.8 75,16.4 Q 80,40 50,65 Q 20,40 25,16.4 Q 30,12.8 50,10 Z"
        fill="url(#grad-gloss)"
        opacity="0.4"
      />
      <path
        d="M 40,35 L 60,35 A 2 2 0 0 1 62,37 L 62,40 L 65,40 A 2 2 0 0 1 67,42 L 67,52 A 2 2 0 0 1 65,54 L 62,54 L 62,57 A 2 2 0 0 1 60,59 L 40,59 A 2 2 0 0 1 38,57 L 38,54 L 35,54 A 2 2 0 0 1 33,52 L 33,42 A 2 2 0 0 1 35,40 L 38,40 L 38,37 A 2 2 0 0 1 40,35 Z"
        fill="url(#grad-cyan-dark)"
        transform="translate(0, 3)"
      />
      <path
        d="M 42,32 h 16 a 3 3 0 0 1 3,3 v 6 h 6 a 3 3 0 0 1 3,3 v 16 a 3 3 0 0 1 -3,3 h -6 v 6 a 3 3 0 0 1 -3,3 h -16 a 3 3 0 0 1 -3,-3 v -6 h -6 a 3 3 0 0 1 -3,-3 v -16 a 3 3 0 0 1 3,-3 h 6 v -6 a 3 3 0 0 1 3,-3 z"
        fill="url(#grad-cyan)"
      />
      <path
        d="M 42,32 h 16 a 3 3 0 0 1 3,3 v 6 h -22 v -6 a 3 3 0 0 1 3,-3 z"
        fill="#ffffff"
        opacity="0.7"
      />
    </svg>
  );
}

/** 2. 3D Heart Icon */
export function Heart3DIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('w-full h-full overflow-visible drop-shadow-[0_15px_15px_rgba(37,99,235,0.15)]', props.className)}
      filter="url(#shadow-3d)"
    >
      <path
        d="M 50,30 C 50,30 45,10 25,10 C 5,10 5,35 5,45 C 5,65 50,95 50,95 C 50,95 95,65 95,45 C 95,35 95,10 75,10 C 55,10 50,30 50,30 Z"
        fill="url(#grad-blue-dark)"
        transform="translate(0, 6)"
      />
      <path
        d="M 50,25 C 50,25 45,5 25,5 C 5,5 5,30 5,40 C 5,60 50,90 50,90 C 50,90 95,60 95,40 C 95,30 95,5 75,5 C 55,5 50,25 50,25 Z"
        fill="url(#grad-blue-radial)"
      />
      <path
        d="M 50,28 C 47,12 28,11 25,11 C 11,11 11,31 11,40 C 11,57 50,83 50,83 C 50,83 89,57 89,40 C 89,31 89,11 75,11 C 72,11 53,12 50,28 Z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <path
        d="M 25,5 C 10,5 5,18 5,30 C 5,45 20,60 40,75 C 30,55 35,25 50,25 C 45,15 35,5 25,5 Z"
        fill="url(#grad-gloss)"
        opacity="0.6"
      />
      <path
        d="M 20,50 L 35,50 L 45,30 L 55,70 L 65,50 L 80,50"
        fill="none"
        stroke="url(#grad-blue-dark)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0,2)"
      />
      <path
        d="M 20,50 L 35,50 L 45,30 L 55,70 L 65,50 L 80,50"
        fill="none"
        stroke="#e0f2fe"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 3. 3D Medical Briefcase Icon */
export function Briefcase3DIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('w-full h-full overflow-visible drop-shadow-[0_15px_15px_rgba(37,99,235,0.15)]', props.className)}
      filter="url(#shadow-3d)"
    >
      <path
        d="M 35,20 C 35,10 65,10 65,20"
        fill="none"
        stroke="url(#grad-blue-dark)"
        strokeWidth="8"
        strokeLinecap="round"
        transform="translate(0,3)"
      />
      <path
        d="M 35,20 C 35,10 65,10 65,20"
        fill="none"
        stroke="#93c5fd"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <rect
        x="10"
        y="25"
        width="80"
        height="60"
        rx="12"
        fill="url(#grad-blue-dark)"
        transform="translate(0,8)"
      />
      <rect
        x="10"
        y="20"
        width="80"
        height="60"
        rx="12"
        fill="url(#grad-blue-main)"
      />
      <rect
        x="12"
        y="22"
        width="76"
        height="56"
        rx="10"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <path
        d="M 10,32 Q 50,38 90,32 L 90,20 L 10,20 Z"
        fill="url(#grad-gloss)"
        opacity="0.3"
        clipPath="url(#box-clip)"
      />
      <rect
        x="33"
        y="38"
        width="34"
        height="34"
        rx="8"
        fill="url(#grad-blue-dark)"
      />
      <rect
        x="33"
        y="35"
        width="34"
        height="34"
        rx="8"
        fill="#e0f2fe"
      />
      <path
        d="M 45,42 h 10 v 6 h 6 v 10 h -6 v 6 h -10 v -6 h -6 v -10 h 6 z"
        fill="url(#grad-blue-main)"
      />
      <path
        d="M 45,42 h 10 v 6 h 6 v 3 h -16 z"
        fill="#1e3a8a"
        opacity="0.2"
      />
    </svg>
  );
}

/** 4. 3D DNA Helix Icon */
export function Dna3DIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('w-full h-full overflow-visible drop-shadow-[0_15px_15px_rgba(37,99,235,0.15)]', props.className)}
      filter="url(#shadow-3d)"
    >
      <path
        d="M 30,10 C 70,30 70,50 30,70"
        fill="none"
        stroke="url(#grad-blue-dark)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 30,30 C 70,50 70,70 30,90"
        fill="none"
        stroke="url(#grad-blue-dark)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <line x1="45" y1="25" x2="60" y2="35" stroke="url(#grad-blue-dark)" strokeWidth="5" strokeLinecap="round" />
      <line x1="40" y1="50" x2="65" y2="50" stroke="url(#grad-blue-dark)" strokeWidth="5" strokeLinecap="round" />
      <line x1="45" y1="75" x2="60" y2="65" stroke="url(#grad-blue-dark)" strokeWidth="5" strokeLinecap="round" />

      <path
        d="M 70,10 C 30,30 30,50 70,70"
        fill="none"
        stroke="url(#grad-blue-main)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M 70,30 C 30,50 30,70 70,90"
        fill="none"
        stroke="url(#grad-blue-main)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      <path
        d="M 70,10 C 30,30 30,50 70,70"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
        transform="translate(-1.5, -1.5)"
      />
      <path
        d="M 70,30 C 30,50 30,70 70,90"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
        transform="translate(-1.5, -1.5)"
      />

      <line x1="40" y1="22" x2="55" y2="32" stroke="#e0f2fe" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="35" y1="50" x2="60" y2="50" stroke="#e0f2fe" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="40" y1="78" x2="55" y2="68" stroke="#e0f2fe" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

/** 5. 3D Pill Bottle Icon */
export function PillBottle3DIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('w-full h-full overflow-visible drop-shadow-[0_15px_15px_rgba(37,99,235,0.15)]', props.className)}
      filter="url(#shadow-3d)"
    >
      <g transform="translate(0, 10)">
        <rect x="35" y="55" width="12" height="25" rx="6" fill="url(#grad-blue-dark)" transform="rotate(30 41 67)" />
        <rect x="35" y="55" width="12" height="12.5" rx="6" fill="url(#grad-cyan)" transform="rotate(30 41 67)" />
        <rect x="55" y="60" width="12" height="25" rx="6" fill="url(#grad-blue-dark)" transform="rotate(-20 61 72)" />
        <rect x="55" y="60" width="12" height="12.5" rx="6" fill="url(#grad-cyan)" transform="rotate(-20 61 72)" />
        <rect x="45" y="45" width="12" height="25" rx="6" fill="url(#grad-blue-main)" transform="rotate(75 51 57)" />
      </g>

      <path d="M 25,35 L 75,35 L 75,80 C 75,90 25,90 25,80 Z" fill="url(#grad-glass)" stroke="url(#grad-cyan)" strokeWidth="1.5" />
      <rect x="32" y="40" width="6" height="42" rx="3" fill="#ffffff" opacity="0.6" />
      <rect x="42" y="40" width="2" height="42" rx="1" fill="#ffffff" opacity="0.4" />
      <rect x="65" y="42" width="4" height="38" rx="2" fill="#ffffff" opacity="0.3" />

      <path d="M 22,25 L 78,25 L 78,35 C 78,40 22,40 22,35 Z" fill="url(#grad-blue-dark)" />
      <path d="M 22,15 L 78,15 L 78,30 C 78,35 22,35 22,30 Z" fill="url(#grad-blue-main)" />
      <ellipse cx="50" cy="15" rx="28" ry="7" fill="url(#grad-cyan)" />
      <ellipse cx="50" cy="15" rx="25" ry="5" fill="#ffffff" opacity="0.4" />
      <path d="M 25,18 L 25,28" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/** 6. 3D Syringe Icon */
export function Syringe3DIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('w-full h-full overflow-visible drop-shadow-[0_15px_15px_rgba(37,99,235,0.15)]', props.className)}
      filter="url(#shadow-3d)"
      transform="rotate(-45)"
    >
      <rect x="45" y="5" width="10" height="25" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
      <rect x="35" y="2" width="30" height="6" rx="3" fill="url(#grad-metal)" />
      <rect x="42" y="26" width="16" height="8" rx="2" fill="#1e293b" />

      <rect x="38" y="25" width="24" height="45" rx="4" fill="#f8fafc" />
      <path d="M 40,40 L 60,40 L 60,66 C 60,68 40,68 40,66 Z" fill="url(#grad-blue-main)" />
      <ellipse cx="50" cy="40" rx="10" ry="3" fill="#60a5fa" />

      <rect x="38" y="25" width="24" height="45" rx="4" fill="url(#grad-glass)" stroke="url(#grad-cyan)" strokeWidth="1" />
      <rect x="28" y="25" width="44" height="6" rx="3" fill="url(#grad-glass)" stroke="url(#grad-cyan)" strokeWidth="1" />

      <line x1="40" y1="45" x2="48" y2="45" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="40" y1="52" x2="45" y2="52" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="40" y1="59" x2="48" y2="59" stroke="#94a3b8" strokeWidth="1.5" />

      <rect x="42" y="30" width="4" height="35" rx="2" fill="#ffffff" opacity="0.7" />

      <path d="M 43,70 L 57,70 L 54,78 L 46,78 Z" fill="url(#grad-blue-main)" />
      <rect x="49" y="78" width="2" height="20" fill="url(#grad-metal)" />
      <path d="M 50,105 C 48,102 47,100 50,98 C 53,100 52,102 50,105 Z" fill="url(#grad-cyan)" />
    </svg>
  );
}

/** 7. 3D Atom Icon */
export function Atom3DIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('w-full h-full overflow-visible drop-shadow-[0_15px_15px_rgba(37,99,235,0.15)]', props.className)}
      filter="url(#shadow-3d)"
    >
      <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke="url(#grad-blue-dark)" strokeWidth="6" transform="rotate(0 50 50)" />
      <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke="url(#grad-cyan)" strokeWidth="2" transform="rotate(0 50 50)" />

      <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke="url(#grad-blue-dark)" strokeWidth="6" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke="url(#grad-cyan)" strokeWidth="2" transform="rotate(60 50 50)" />

      <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke="url(#grad-blue-dark)" strokeWidth="6" transform="rotate(120 50 50)" />
      <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke="url(#grad-cyan)" strokeWidth="2" transform="rotate(120 50 50)" />

      <circle cx="50" cy="50" r="16" fill="url(#grad-blue-dark)" transform="translate(0, 3)" />
      <circle cx="50" cy="50" r="16" fill="url(#grad-blue-radial)" />
      <ellipse cx="45" cy="42" rx="7" ry="4" fill="#ffffff" opacity="0.6" transform="rotate(-30 45 42)" />

      <circle cx="10" cy="50" r="6" fill="url(#grad-cyan-dark)" transform="translate(0,2)" />
      <circle cx="10" cy="50" r="6" fill="url(#grad-cyan)" />
      <ellipse cx="8" cy="48" rx="2.5" ry="1.5" fill="#ffffff" opacity="0.8" transform="rotate(-30 8 48)" />

      <circle cx="70" cy="15" r="6" fill="url(#grad-cyan-dark)" transform="translate(0,2)" />
      <circle cx="70" cy="15" r="6" fill="url(#grad-cyan)" />
      <ellipse cx="68" cy="13" rx="2.5" ry="1.5" fill="#ffffff" opacity="0.8" transform="rotate(-30 68 13)" />

      <circle cx="70" cy="85" r="6" fill="url(#grad-cyan-dark)" transform="translate(0,2)" />
      <circle cx="70" cy="85" r="6" fill="url(#grad-cyan)" />
      <ellipse cx="68" cy="83" rx="2.5" ry="1.5" fill="#ffffff" opacity="0.8" transform="rotate(-30 68 83)" />
    </svg>
  );
}

/** 8. 3D Clipboard Icon */
export function Clipboard3DIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('w-full h-full overflow-visible drop-shadow-[0_15px_15px_rgba(37,99,235,0.15)]', props.className)}
      filter="url(#shadow-3d)"
    >
      <rect x="20" y="15" width="60" height="75" rx="8" fill="url(#grad-blue-dark)" transform="translate(0, 6)" />
      <rect x="20" y="10" width="60" height="75" rx="8" fill="url(#grad-blue-main)" />

      <rect x="28" y="22" width="44" height="55" rx="2" fill="#94a3b8" />
      <rect x="28" y="20" width="44" height="55" rx="2" fill="#f8fafc" />

      <path d="M 32,45 L 42,45 L 47,35 L 53,60 L 58,45 L 68,45" fill="none" stroke="url(#grad-blue-main)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      <rect x="35" y="5" width="30" height="15" rx="4" fill="url(#grad-metal)" transform="translate(0,2)" />
      <rect x="35" y="3" width="30" height="15" rx="4" fill="#e2e8f0" />
      <rect x="40" y="6" width="20" height="4" rx="2" fill="#cbd5e1" />
      <circle cx="50" cy="3" r="5" fill="none" stroke="url(#grad-metal)" strokeWidth="2.5" />

      <path d="M 20,20 Q 50,15 80,20 L 80,10 L 20,10 Z" fill="url(#grad-gloss)" opacity="0.3" clipPath="url(#board-clip)" />
    </svg>
  );
}

/** 9. 3D Dropper Icon */
export function Dropper3DIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('w-full h-full overflow-visible drop-shadow-[0_15px_15px_rgba(37,99,235,0.15)]', props.className)}
      filter="url(#shadow-3d)"
      transform="rotate(30) translate(10,-10)"
    >
      <path d="M 35,30 C 35,5 65,5 65,30 L 60,40 L 40,40 Z" fill="url(#grad-blue-dark)" transform="translate(0, 3)" />
      <path d="M 35,27 C 35,2 65,2 65,27 L 60,37 L 40,37 Z" fill="url(#grad-blue-main)" />
      <line x1="42" y1="12" x2="58" y2="12" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="20" x2="60" y2="20" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="28" x2="60" y2="28" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />

      <ellipse cx="43" cy="18" rx="4" ry="12" fill="#ffffff" opacity="0.4" transform="rotate(-10 43 18)" />

      <rect x="38" y="37" width="24" height="6" rx="2" fill="url(#grad-cyan)" />
      <rect x="38" y="37" width="24" height="6" rx="2" fill="url(#grad-cyan-dark)" transform="translate(0, 2)" opacity="0.5" />

      <path d="M 42,43 L 58,43 L 53,80 C 53,85 47,85 47,80 Z" fill="#cbd5e1" />
      <path d="M 44,55 L 56,55 L 52,78 C 51,82 49,82 48,78 Z" fill="url(#grad-blue-main)" />

      <path d="M 42,43 L 58,43 L 53,80 C 53,85 47,85 47,80 Z" fill="url(#grad-glass)" stroke="#e0f2fe" strokeWidth="1.5" />
      <path d="M 44,45 L 50,45 L 48,75 L 46,75 Z" fill="#ffffff" opacity="0.6" />

      <path d="M 50,105 C 45,100 46,95 50,90 C 54,95 55,100 50,105 Z" fill="url(#grad-cyan-dark)" transform="translate(0,3)" />
      <path d="M 50,102 C 45,97 46,92 50,87 C 54,92 55,97 50,102 Z" fill="url(#grad-cyan)" />
      <circle cx="48" cy="98" r="1.5" fill="#ffffff" />
    </svg>
  );
}

/**
 * Master Medical 3D Icon Component
 */
export function Medical3DIcon(props: {
  name: Medical3DIconName;
  className?: string;
}) {
  switch (props.name) {
    case 'shield':
      return <Shield3DIcon className={props.className} />;
    case 'heart':
      return <Heart3DIcon className={props.className} />;
    case 'briefcase':
      return <Briefcase3DIcon className={props.className} />;
    case 'dna':
      return <Dna3DIcon className={props.className} />;
    case 'pill-bottle':
      return <PillBottle3DIcon className={props.className} />;
    case 'syringe':
      return <Syringe3DIcon className={props.className} />;
    case 'atom':
      return <Atom3DIcon className={props.className} />;
    case 'clipboard':
      return <Clipboard3DIcon className={props.className} />;
    case 'dropper':
      return <Dropper3DIcon className={props.className} />;
    default:
      return <Briefcase3DIcon className={props.className} />;
  }
}
