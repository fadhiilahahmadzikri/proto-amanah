import { cn } from '@/lib/utils';

/**
 * 3D Paramedic Toolbox Vector Master Component
 * Features realistic isometric lighting, movable lid with 3D opening physics,
 * deep interior clinical cavity, and medical cross badge.
 *
 * @param props.isOpen - Whether the toolbox lid is flipped open
 * @param props.size - Dimension of the SVG icon (default: 80)
 * @param props.className - Optional Tailwind CSS utility classes
 * @param props.onClick - Optional interactive click handler
 */
export function ParamedicToolbox3DSvg(props: {
  isOpen?: boolean;
  size?: number;
  className?: string;
  onClick?: () => void;
}) {
  const { isOpen = false, className, onClick } = props;
  const size = props.size ?? 80;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn('shrink-0 select-none overflow-visible', onClick ? 'cursor-pointer' : 'pointer-events-none', className)}
      onClick={onClick}
      aria-label="3D Paramedic Toolbox"
    >
      <defs>
        {/* Soft shadow blur */}
        <filter id="toolboxShadowBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>

        {/* Box Face Lighting Gradients */}
        {/* Top is brightest, illuminated from above */}
        <linearGradient id="toolboxTopFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E8E8E8" />
        </linearGradient>
        {/* Left is heavily shaded */}
        <linearGradient id="toolboxLeftFace" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B3B3B3" />
          <stop offset="100%" stopColor="#808080" />
        </linearGradient>
        {/* Right is moderately lit */}
        <linearGradient id="toolboxRightFace" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D9D9D9" />
          <stop offset="100%" stopColor="#A6A6A6" />
        </linearGradient>

        {/* Metallic Latches */}
        <linearGradient id="toolboxSilverLatch" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#999999" />
        </linearGradient>
        <linearGradient id="toolboxSilverLatchDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CCCCCC" />
          <stop offset="100%" stopColor="#777777" />
        </linearGradient>

        {/* Interior Cavity Wall Gradients when opened */}
        <linearGradient id="toolboxInsideLeftWall" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2A303C" />
          <stop offset="100%" stopColor="#141822" />
        </linearGradient>
        <linearGradient id="toolboxInsideRightWall" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1F2937" />
        </linearGradient>

        {/* Radiant Medical Energy Burst Glow when opened */}
        <radialGradient id="toolboxMedicalGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="1" />
          <stop offset="45%" stopColor="#0EA5E9" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. Ambient Drop Shadow under the toolbox */}
      <ellipse cx="52" cy="74" rx="20" ry="7" fill="#000000" filter="url(#toolboxShadowBlur)" opacity="0.16" />
      <ellipse cx="51" cy="73.5" rx="15" ry="5" fill="#000000" filter="url(#toolboxShadowBlur)" opacity="0.25" />

      {/* 2. Deep 3D Extruded Interior Cavity (Revealed with depth when toolbox lid is opened) */}
      <g className={cn('transition-opacity duration-500', isOpen ? 'opacity-100' : 'opacity-0')}>
        {/* Back Interior Walls */}
        <polygon points="50,38 31,45.5 31,58 50,50" fill="#111827" />
        <polygon points="50,38 69,45.5 69,58 50,50" fill="#1F2937" />

        {/* Deep Interior Floor */}
        <polygon points="50,50 69,58 50,66 31,58" fill="#0F172A" />

        {/* Front-Facing Interior Walls */}
        <polygon points="31,45.5 50,58 50,66 31,58" fill="url(#toolboxInsideLeftWall)" />
        <polygon points="50,58 69,45.5 69,58 50,66" fill="url(#toolboxInsideRightWall)" />

        {/* Rim Lip Thickness (Extruded wall edge thickness) */}
        <polygon points="28.35,45.5 50,58 50,55 31,45.5" fill="#E2E8F0" />
        <polygon points="50,58 71.65,45.5 69,45.5 50,55" fill="#CBD5E1" />

        {/* Radiant Medical Aura pouring out from cavity */}
        <ellipse cx="50" cy="52" rx="16" ry="9" fill="url(#toolboxMedicalGlow)" className="animate-pulse" />
      </g>

      {/* 3. Lower Base Body (Fixed Bottom Half) */}
      <g id="toolbox-base">
        {/* Left Lower Face (Darker) */}
        <polygon points="50,58 28.35,45.5 28.35,62.5 50,75" fill="url(#toolboxLeftFace)" />
        {/* Right Lower Face (Brighter) */}
        <polygon points="50,58 71.65,45.5 71.65,62.5 50,75" fill="url(#toolboxRightFace)" />

        {/* Bottom Outer Edge Highlights and Shadows */}
        <line x1="50" y1="58" x2="50" y2="75" stroke="#E6E6E6" strokeWidth="0.75" opacity="0.9" />
        <line x1="28.35" y1="45.5" x2="28.35" y2="62.5" stroke="#666666" strokeWidth="0.5" opacity="0.6" />
        <line x1="71.65" y1="45.5" x2="71.65" y2="62.5" stroke="#CCCCCC" strokeWidth="0.5" opacity="0.6" />

        {/* Seam line highlights on base */}
        <line x1="28.35" y1="46" x2="50" y2="58.5" stroke="#FFFFFF" strokeWidth="0.3" opacity="0.6" />
        <line x1="50" y1="58.5" x2="71.65" y2="46" stroke="#FFFFFF" strokeWidth="0.3" opacity="0.7" />

        {/* Red Medical Cross on Left Lower Face (Isometric transformed) */}
        <g transform="matrix(0.866, 0.5, 0, 1, 39.175, 60.25)">
          {/* Cross Drop Shadow / Bevel */}
          <path
            d="M -1.5 -5 L 1.5 -5 L 1.5 -1.5 L 5 -1.5 L 5 1.5 L 1.5 1.5 L 1.5 5 L -1.5 5 L -1.5 1.5 L -5 1.5 L -5 -1.5 L -1.5 -1.5 Z"
            fill="#990000"
            transform="translate(0, 0.75)"
            opacity="0.8"
          />
          {/* Main Red Medical Cross */}
          <path
            d="M -1.5 -5 L 1.5 -5 L 1.5 -1.5 L 5 -1.5 L 5 1.5 L 1.5 1.5 L 1.5 5 L -1.5 5 L -1.5 1.5 L -5 1.5 L -5 -1.5 L -1.5 -1.5 Z"
            fill="#E60000"
          />
        </g>

        {/* Lower Latches (Base Parts) */}
        {/* Latch 1 (Base) */}
        <g transform="matrix(0.866, -0.5, 0, 1, 55, 55.115)">
          <path d="M -1.5 0 L 1.5 0 L 1.5 3.5 L -1.5 3.5 Z" fill="#444444" transform="translate(0, 0.5)" opacity="0.6" />
          <path d="M -1.5 0 L 1.5 0 L 1.5 3.5 L -1.5 3.5 Z" fill="url(#toolboxSilverLatchDark)" />
          <line x1="-1.5" y1="0" x2="1.5" y2="0" stroke="#222222" strokeWidth="0.5" />
        </g>

        {/* Latch 2 (Base) */}
        <g transform="matrix(0.866, -0.5, 0, 1, 65, 49.345)">
          <path d="M -1.5 0 L 1.5 0 L 1.5 3.5 L -1.5 3.5 Z" fill="#444444" transform="translate(0, 0.5)" opacity="0.6" />
          <path d="M -1.5 0 L 1.5 0 L 1.5 3.5 L -1.5 3.5 Z" fill="url(#toolboxSilverLatchDark)" />
          <line x1="-1.5" y1="0" x2="1.5" y2="0" stroke="#222222" strokeWidth="0.5" />
        </g>
      </g>

      {/* 4. Upper Lid (Opens / Rotates up on isOpen) */}
      <g
        id="toolbox-lid"
        className="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform"
        style={{
          transform: isOpen ? 'translate(-10px, -24px) rotate(-18deg)' : 'translate(0px, 0px) rotate(0deg)',
          transformOrigin: '50px 35px',
        }}
      >
        {/* Left Upper Face */}
        <polygon points="50,50 28.35,37.5 28.35,45.5 50,58" fill="url(#toolboxLeftFace)" />
        {/* Right Upper Face */}
        <polygon points="50,50 71.65,37.5 71.65,45.5 50,58" fill="url(#toolboxRightFace)" />
        {/* Top Face (Brightest) */}
        <polygon points="50,50 71.65,37.5 50,25 28.35,37.5" fill="url(#toolboxTopFace)" />

        {/* Inner 'Y' Edge Highlights */}
        <line x1="28.35" y1="37.5" x2="50" y2="50" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.9" />
        <line x1="50" y1="50" x2="71.65" y2="37.5" stroke="#FFFFFF" strokeWidth="0.75" opacity="1.0" />
        <line x1="50" y1="50" x2="50" y2="58" stroke="#E6E6E6" strokeWidth="0.75" opacity="0.9" />

        {/* Outer Edge Highlights */}
        <line x1="28.35" y1="37.5" x2="50" y2="25" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.9" />
        <line x1="50" y1="25" x2="71.65" y2="37.5" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.9" />
        <line x1="28.35" y1="37.5" x2="28.35" y2="45.5" stroke="#666666" strokeWidth="0.5" opacity="0.6" />
        <line x1="71.65" y1="37.5" x2="71.65" y2="45.5" stroke="#CCCCCC" strokeWidth="0.5" opacity="0.6" />

        {/* Dark Seam Separation Lines on Lid Rim */}
        <line x1="28.35" y1="45.5" x2="50" y2="58" stroke="#666666" strokeWidth="0.75" opacity="0.8" />
        <line x1="50" y1="58" x2="71.65" y2="45.5" stroke="#808080" strokeWidth="0.75" opacity="0.9" />

        {/* Upper Latches (Lid Clamps) */}
        {/* Latch 1 (Upper) */}
        <g transform="matrix(0.866, -0.5, 0, 1, 55, 55.115)">
          <path d="M -1.5 -3.5 L 1.5 -3.5 L 1.5 0 L -1.5 0 Z" fill="#444444" transform="translate(0, 0.5)" opacity="0.6" />
          <path d="M -1.5 -3.5 L 1.5 -3.5 L 1.5 0 L -1.5 0 Z" fill="url(#toolboxSilverLatch)" />
          <path d="M -0.8 -1.5 L 0.8 -1.5 L 0.8 0 L -0.8 0 Z" fill="#555555" />
          <line x1="-1" y1="-3" x2="-1" y2="0" stroke="#FFFFFF" strokeWidth="0.25" opacity="0.8" />
        </g>

        {/* Latch 2 (Upper) */}
        <g transform="matrix(0.866, -0.5, 0, 1, 65, 49.345)">
          <path d="M -1.5 -3.5 L 1.5 -3.5 L 1.5 0 L -1.5 0 Z" fill="#444444" transform="translate(0, 0.5)" opacity="0.6" />
          <path d="M -1.5 -3.5 L 1.5 -3.5 L 1.5 0 L -1.5 0 Z" fill="url(#toolboxSilverLatch)" />
          <path d="M -0.8 -1.5 L 0.8 -1.5 L 0.8 0 L -0.8 0 Z" fill="#555555" />
          <line x1="-1" y1="-3" x2="-1" y2="0" stroke="#FFFFFF" strokeWidth="0.25" opacity="0.8" />
        </g>

        {/* Handle Shadow cast on the top face */}
        <path d="M 45 35.5 L 55 41.5" stroke="rgba(100, 100, 100, 0.4)" strokeWidth="3" strokeLinecap="round" />

        {/* Handle Base Mounts */}
        <ellipse cx="44.8" cy="34.5" rx="1.5" ry="0.75" fill="#1A1A1A" />
        <ellipse cx="55.2" cy="40.5" rx="1.5" ry="0.75" fill="#1A1A1A" />

        {/* Main structural thick bar of the handle */}
        <path
          d="M 44.8 34.5 L 44.8 25 L 55.2 31 L 55.2 40.5"
          fill="none"
          stroke="#333333"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Handle tube highlight to give it realistic 3D volume and shine */}
        <path
          d="M 44.4 34.3 L 44.4 24.6 L 54.8 30.6 L 54.8 40.3"
          fill="none"
          stroke="#777777"
          strokeWidth="0.75"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M 44.1 34.1 L 44.1 24.3 L 54.5 30.3 L 54.5 40.1"
          fill="none"
          stroke="#999999"
          strokeWidth="0.25"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
