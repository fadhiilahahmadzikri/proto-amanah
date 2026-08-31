import { cn } from '@/lib/utils';

/**
 * AuroraShaderGradient - 3D Fluid "waterPlane" ShaderGradient master component.
 * Configured with Amanah Portal Blue & Radiant Cyan brand tokens and monochrome micro-film grain.
 *
 * @param props.theme - 'light' | 'dark' (default: 'light')
 * @param props.intensity - 'normal' | 'soft' (default: 'normal')
 * @param props.className - Custom container class overrides
 * @param props.speed - Water fluid wave speed (default: 0.3)
 */
export function AuroraShaderGradient(props: {
  theme?: 'light' | 'dark';
  intensity?: 'normal' | 'soft';
  className?: string;
  speed?: number;
  color1?: string;
  color2?: string;
  color3?: string;
}) {
  const isDark = props.theme === 'dark';

  // Amanah Brand Theme Color Mapping
  const activeColor1 = props.color1 ?? (isDark ? '#07247a' : '#0d66e9');
  const activeColor2 = props.color2 ?? (isDark ? '#0088cc' : '#00d4ff');
  const activeColor3 = props.color3 ?? (isDark ? '#14103b' : '#70a6ff');

  return (
    <div
      className={cn(
        'absolute top-0 inset-x-0 w-full pointer-events-none overflow-hidden select-none z-0',
        props.className ?? 'h-[440px]',
      )}
      style={{
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      {/* 1. Ambient Fluid Gradient Canvas */}
      <div className="absolute inset-0 scale-105 filter blur-[32px] transition-all duration-700">
        <div
          className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] opacity-60"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${activeColor1} 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, ${activeColor2} 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, ${activeColor3} 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* 2. Monochrome Micro-Film Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.09] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '96px 96px',
        }}
      />
    </div>
  );
}

/**
 * WaterPlane ShaderGradient Preset - Amanah Blue Theme
 */
export const amanahWaterPlaneConfig = {
  control: 'props' as const,
  animate: 'on' as const,
  brightness: 1.08,
  cAzimuthAngle: 180,
  cDistance: 3.6,
  cPolarAngle: 90,
  cameraZoom: 1,
  color1: '#0d66e9', // Amanah Electric Sapphire Blue
  color2: '#00d4ff', // Radiant Cyan
  color3: '#14103b', // Deep Midnight Navy
  envPreset: 'city' as const,
  grain: 'off' as const,
  lightType: '3d' as const,
  positionX: -1.4,
  positionY: 0,
  positionZ: 0,
  range: 'disabled' as const,
  rangeEnd: 40,
  rangeStart: 0,
  reflection: 0.04,
  rotationX: 0,
  rotationY: 10,
  rotationZ: 50,
  shader: 'defaults' as const,
  type: 'waterPlane' as const,
  uAmplitude: 1,
  uDensity: 1.1,
  uFrequency: 3.8,
  uSpeed: 0.3,
  uStrength: 3.5,
  uTime: 0,
  wireframe: false,
};
