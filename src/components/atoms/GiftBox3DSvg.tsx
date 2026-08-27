import { cn } from '@/lib/utils';

export function GiftBox3DSvg(props: {
  isOpen?: boolean;
  className?: string;
  size?: number;
}) {
  const { isOpen = false, className } = props;
  const size = props.size ?? 80;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn('shrink-0 select-none pointer-events-none overflow-visible', className)}
      aria-label="3D Gift Box"
    >
      <defs>
        {/* Soft shadow blur */}
        <filter id="giftShadowBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>

        {/* Box Face Lighting Gradients */}
        <linearGradient id="giftTopFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCE068" />
          <stop offset="100%" stopColor="#E4A018" />
        </linearGradient>
        <linearGradient id="giftLeftFace" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E17A05" />
          <stop offset="100%" stopColor="#8A4000" />
        </linearGradient>
        <linearGradient id="giftRightFace" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFB111" />
          <stop offset="100%" stopColor="#C37200" />
        </linearGradient>

        {/* Ribbon Lighting Gradients */}
        <linearGradient id="giftRibbonTop1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF5C22" />
          <stop offset="100%" stopColor="#D9261C" />
        </linearGradient>
        <linearGradient id="giftRibbonTop2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FA473C" />
          <stop offset="100%" stopColor="#D9261C" />
        </linearGradient>
        <linearGradient id="giftRibbonLeft" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E13009" />
          <stop offset="100%" stopColor="#701200" />
        </linearGradient>
        <linearGradient id="giftRibbonRight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF4F15" />
          <stop offset="100%" stopColor="#A02000" />
        </linearGradient>

        {/* Bow Shading */}
        <linearGradient id="giftBowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF7545" />
          <stop offset="100%" stopColor="#E13009" />
        </linearGradient>

        {/* Interior Cavity Wall Gradients when opened */}
        <linearGradient id="giftInsideLeftWall" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4D1D00" />
          <stop offset="100%" stopColor="#240A00" />
        </linearGradient>
        <linearGradient id="giftInsideRightWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7A3400" />
          <stop offset="100%" stopColor="#3B1400" />
        </linearGradient>

        {/* Radiant Burst Glow when opened */}
        <radialGradient id="giftBurstGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF4B8" stopOpacity="1" />
          <stop offset="45%" stopColor="#FFB300" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FF5500" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft Drop Shadow under the box */}
      <ellipse cx="52" cy="74" rx="20" ry="7" fill="#000000" filter="url(#giftShadowBlur)" opacity="0.25" />
      <ellipse cx="51" cy="73.5" rx="15" ry="5" fill="#000000" filter="url(#giftShadowBlur)" opacity="0.35" />

      {/* 1. Deep 3D Extruded Box Cavity (Revealed with depth when box is opened) */}
      <g className={cn('transition-opacity duration-500', isOpen ? 'opacity-100' : 'opacity-0')}>
        {/* Back Interior Walls */}
        <polygon points="50,28 31,37.5 31,51.5 50,42" fill="#331200" />
        <polygon points="50,28 69,37.5 69,51.5 50,42" fill="#471C00" />

        {/* Deep Interior Floor */}
        <polygon points="50,42 69,51.5 50,61 31,51.5" fill="#1F0800" />

        {/* Front-Facing Interior Walls (Extruded Depth) */}
        <polygon points="31,37.5 50,47 50,61 31,51.5" fill="url(#giftInsideLeftWall)" />
        <polygon points="50,47 69,37.5 69,51.5 50,61" fill="url(#giftInsideRightWall)" />

        {/* Top Rim Lip Thickness (Extruded wall edge thickness) */}
        <polygon points="28.35,37.5 50,50 50,47 31,37.5" fill="#FFC83B" />
        <polygon points="50,50 71.65,37.5 69,37.5 50,47" fill="#FFA510" />
        <polygon points="28.35,37.5 50,25 50,28 31,37.5" fill="#E68A05" />
        <polygon points="50,25 71.65,37.5 69,37.5 50,28" fill="#FFB726" />

        {/* Radiant Glowing Treasure Aura pouring out from the depth */}
        <ellipse cx="50" cy="44" rx="18" ry="11" fill="url(#giftBurstGlow)" className="animate-pulse" />
      </g>

      {/* 2. Box Outer Base Body (Left & Right Faces) */}
      <g id="box-base">
        {/* Left Face (Darker) */}
        <polygon points="50,50 28.35,37.5 28.35,62.5 50,75" fill="url(#giftLeftFace)" />
        {/* Right Face (Brighter) */}
        <polygon points="50,50 71.65,37.5 71.65,62.5 50,75" fill="url(#giftRightFace)" />

        {/* Inner 'Y' Edge Highlights */}
        <line x1="28.35" y1="37.5" x2="50" y2="50" stroke="#FCE068" strokeWidth="0.75" opacity="0.8" />
        <line x1="50" y1="50" x2="71.65" y2="37.5" stroke="#FFE98A" strokeWidth="0.75" opacity="1.0" />
        <line x1="50" y1="50" x2="50" y2="75" stroke="#FFD045" strokeWidth="0.75" opacity="0.9" />

        {/* Outer Edge Highlights */}
        <line x1="28.35" y1="37.5" x2="28.35" y2="62.5" stroke="#A84C00" strokeWidth="0.5" opacity="0.6" />
        <line x1="71.65" y1="37.5" x2="71.65" y2="62.5" stroke="#FFE18A" strokeWidth="0.5" opacity="0.6" />

        {/* Left Vertical Ribbon */}
        <polygon points="34.175,40.86 44.175,46.64 44.175,71.64 34.175,65.86" fill="url(#giftRibbonLeft)" />
        <line x1="34.175" y1="40.86" x2="34.175" y2="65.86" stroke="#FF6B3D" strokeWidth="0.5" />
        <line x1="44.175" y1="46.64" x2="44.175" y2="71.64" stroke="#4A0B00" strokeWidth="0.5" />

        {/* Right Vertical Ribbon */}
        <polygon points="55.825,46.64 65.825,40.86 65.825,65.86 55.825,71.64" fill="url(#giftRibbonRight)" />
        <line x1="55.825" y1="46.64" x2="55.825" y2="71.64" stroke="#FF855C" strokeWidth="0.5" />
        <line x1="65.825" y1="40.86" x2="65.825" y2="65.86" stroke="#701200" strokeWidth="0.5" />
      </g>

      {/* 3. Box Top Lid & Bow (Animated Lid Opening on isOpen) */}
      <g
        id="box-lid"
        className="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform"
        style={{
          transform: isOpen ? 'translate(-8px, -24px) rotate(-16deg)' : 'translate(0px, 0px) rotate(0deg)',
          transformOrigin: '50px 35px',
        }}
      >
        {/* Top Face (Brightest) */}
        <polygon points="50,50 71.65,37.5 50,25 28.35,37.5" fill="url(#giftTopFace)" />

        {/* Top Outer Edge Highlights */}
        <line x1="28.35" y1="37.5" x2="50" y2="25" stroke="#FFF3B3" strokeWidth="0.5" opacity="0.8" />
        <line x1="50" y1="25" x2="71.65" y2="37.5" stroke="#FFF3B3" strokeWidth="0.5" opacity="0.8" />
        <line x1="28.35" y1="37.5" x2="50" y2="50" stroke="#FCE068" strokeWidth="0.75" opacity="0.8" />
        <line x1="50" y1="50" x2="71.65" y2="37.5" stroke="#FFE98A" strokeWidth="0.75" opacity="1.0" />

        {/* Top Ribbon Band 1 */}
        <polygon points="34.175,40.86 55.825,28.36 65.825,34.14 44.175,46.64" fill="url(#giftRibbonTop1)" />
        <line x1="34.175" y1="40.86" x2="55.825" y2="28.36" stroke="#FF855C" strokeWidth="0.5" />
        <line x1="44.175" y1="46.64" x2="65.825" y2="34.14" stroke="#B31A10" strokeWidth="0.5" />

        {/* Top Ribbon Band 2 */}
        <polygon points="55.825,46.64 34.175,34.14 44.175,28.36 65.825,40.86" fill="url(#giftRibbonTop2)" />
        <line x1="65.825" y1="40.86" x2="44.175" y2="28.36" stroke="#FFA385" strokeWidth="0.5" />
        <line x1="55.825" y1="46.64" x2="34.175" y2="34.14" stroke="#B31A10" strokeWidth="0.5" />

        {/* Left Loop */}
        <path d="M 47,37.5 C 43,34.5 36,35.5 38,38 C 40,39.5 44,38.5 46.5,37.8 Z" fill="#7A0E05" />
        <path d="M 48,37.5 C 42,32 32,34 36,39.5 C 39,41.5 45,39.5 48,38 Z" fill="url(#giftBowGrad)" fillOpacity="0.95" />
        <path d="M 48,37.5 C 42,32 32,34 36,39.5 C 39,41.5 45,39.5 48,38 Z" fill="none" stroke="#FFA385" strokeWidth="0.4" />

        {/* Right Loop */}
        <path d="M 53,37.5 C 57,34.5 64,35.5 62,38 C 60,39.5 56,38.5 53.5,37.8 Z" fill="#99140C" />
        <path d="M 52,37.5 C 58,32 68,34 64,39.5 C 61,41.5 55,39.5 52,38 Z" fill="url(#giftBowGrad)" fillOpacity="0.95" />
        <path d="M 52,37.5 C 58,32 68,34 64,39.5 C 61,41.5 55,39.5 52,38 Z" fill="none" stroke="#FFC2B3" strokeWidth="0.4" />

        {/* Center Knot */}
        <ellipse cx="50" cy="38.5" rx="5.5" ry="4.5" fill="#99140C" />
        <ellipse cx="50" cy="37.5" rx="5" ry="4" fill="url(#giftBowGrad)" />
        <ellipse cx="49" cy="36.5" rx="2" ry="1.5" fill="#FFC2B3" opacity="0.8" />
      </g>
    </svg>
  );
}
