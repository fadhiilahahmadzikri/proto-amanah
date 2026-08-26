import { cn } from '@/lib/utils';

/**
 * 3D Glass Rosette Ribbon Medal Badge for Patient Queue Number.
 * Matches the game/app award medallion visual style with glass orb, scalloped rosette, ribbon tails, and center queue number.
 *
 * @param props.queueNumber - The queue identifier (e.g. "01", "#01")
 * @param props.size - Pixel size width (defaults to 36)
 * @param props.className - Additional CSS class names
 * @param props.onClick - Optional click handler
 */
export function QueueBadge(props: {
  queueNumber: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}) {
  const size = props.size ?? 42;
  const rawNumber = props.queueNumber.replace(/^#/, '');
  const displayValue = rawNumber.length > 0 ? (rawNumber.length === 1 ? `0${rawNumber}` : rawNumber) : '01';

  return (
    <div
      onClick={props.onClick}
      className={cn(
        'relative inline-flex items-center justify-center select-none transition-transform duration-200 active:scale-95 shrink-0 pointer-events-auto',
        props.onClick && 'cursor-pointer',
        props.className,
      )}
      style={{
        width: `${size}px`,
        height: `${Math.round(size * 1.18)}px`,
      }}
      title={`Antrean #${displayValue}`}
    >
      <svg
        viewBox="0 0 48 56"
        className="w-full h-full drop-shadow-[0_2.5px_5px_rgba(0,0,0,0.32)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Outer Glass Orb Radial Gradient */}
          <radialGradient id="qb-outer-glass" cx="35%" cy="30%" r="70%" fx="35%" fy="30%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="45%" stopColor="#2563EB" />
            <stop offset="85%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#172554" />
          </radialGradient>

          {/* Ribbon Tails Gradient */}
          <linearGradient id="qb-ribbon-grad" x1="14" y1="20" x2="34" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          {/* Ribbon Center Stripe Gradient */}
          <linearGradient id="qb-ribbon-stripe" x1="20" y1="20" x2="28" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E0F2FE" />
          </linearGradient>

          {/* Rosette Flower Seal Gradient */}
          <radialGradient id="qb-rosette-seal" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F0F9FF" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </radialGradient>

          {/* Center Inset Gradient */}
          <linearGradient id="qb-inset-grad" x1="16" y1="12" x2="32" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F0F9FF" />
          </linearGradient>

          {/* Specular Top Glass Arc Highlight */}
          <linearGradient id="qb-highlight" x1="12" y1="5" x2="36" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Hanging Ribbon Tails (Layer behind glass medal) */}
        <g filter="drop-shadow(0 2px 2px rgba(0,0,0,0.22))">
          {/* Main Ribbon Body with V-Notch */}
          <path
            d="M 13.5 22 L 12.5 50 L 24 43.5 L 35.5 50 L 34.5 22 Z"
            fill="url(#qb-ribbon-grad)"
          />
          {/* Center Light Stripe on Ribbon */}
          <path
            d="M 19.5 22 L 19.5 46.2 L 24 43.5 L 28.5 46.2 L 28.5 22 Z"
            fill="url(#qb-ribbon-stripe)"
          />
        </g>

        {/* 2. Outer Glossy Glass Rosette Circle Orb */}
        <circle
          cx="24"
          cy="21.5"
          r="19"
          fill="url(#qb-outer-glass)"
          stroke="#93C5FD"
          strokeWidth="1.2"
        />

        {/* Specular Highlight Arc */}
        <path
          d="M 9.5 16 A 16.5 16.5 0 0 1 38.5 16"
          stroke="url(#qb-highlight)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* 3. Symmetrical 10-Petal Scalloped Rosette Medal Seal */}
        <path
          d="
            M 27.65 10.28
            A 3.8 3.8 0 0 1 33.55 14.56
            A 3.8 3.8 0 0 1 35.8 21.5
            A 3.8 3.8 0 0 1 33.55 28.44
            A 3.8 3.8 0 0 1 27.65 32.72
            A 3.8 3.8 0 0 1 20.35 32.72
            A 3.8 3.8 0 0 1 14.45 28.44
            A 3.8 3.8 0 0 1 12.2 21.5
            A 3.8 3.8 0 0 1 14.45 14.56
            A 3.8 3.8 0 0 1 20.35 10.28
            A 3.8 3.8 0 0 1 27.65 10.28
            Z
          "
          fill="url(#qb-rosette-seal)"
          stroke="#38BDF8"
          strokeWidth="0.8"
          filter="drop-shadow(0 1.5px 2px rgba(0,0,0,0.25))"
        />

        {/* Inner Rosette Circular Inset */}
        <circle
          cx="24"
          cy="21.5"
          r="10.5"
          fill="url(#qb-inset-grad)"
          stroke="#93C5FD"
          strokeWidth="0.75"
        />

        {/* 4. Center Queue Number */}
        <text
          x="24"
          y="26"
          textAnchor="middle"
          fontSize={displayValue.length > 2 ? '11' : '13'}
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          fill="#1D4ED8"
          className="select-none tracking-tight font-black"
        >
          {displayValue}
        </text>
      </svg>
    </div>
  );
}
