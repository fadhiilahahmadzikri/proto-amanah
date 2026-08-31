import { cn } from '@/lib/utils';

/**
 * AuroraBackground - Dynamic Aurora Ambient Glow master component.
 * Provides rich, theme-responsive sapphire/cyan/blue lighting ambience with soft linear mask.
 *
 * @param props.theme - 'dark' or 'light'
 * @param props.intensity - 'normal' (default, for full screen) or 'soft' (for modals/cards)
 * @param props.className - Additional CSS classes
 */
export function AuroraBackground(props: {
  theme?: 'dark' | 'light';
  intensity?: 'normal' | 'soft';
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const isSoft = props.intensity === 'soft';

  return (
    <div
      className={cn(
        'absolute top-0 inset-x-0 w-full pointer-events-none overflow-hidden select-none z-0',
        props.className ?? 'h-[400px]',
      )}
      style={{
        maskImage: 'linear-gradient(to bottom, black 25%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 25%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      {isDark ? (
        <>
          {/* Deep Cosmic Sapphire Glow */}
          <div
            className={cn(
              'absolute -top-[15%] -left-[20%] w-[140%] bg-[#07247a] rounded-full filter blur-[100px] transition-all duration-700',
              isSoft ? 'h-[200px] opacity-60' : 'h-[290px] opacity-90',
            )}
          />
          {/* Electric Cyan/Teal Glow */}
          <div
            className={cn(
              'absolute top-[5%] -right-[20%] w-[100%] bg-[#0088cc] rounded-full filter blur-[90px] transition-all duration-700',
              isSoft ? 'h-[140px] opacity-45' : 'h-[200px] opacity-70',
            )}
          />
        </>
      ) : (
        <>
          {/* Vibrant Apple/Amanah Blue Base */}
          <div
            className={cn(
              'absolute -top-[10%] -left-[20%] w-[140%] bg-[#0d66e9] rounded-full filter blur-[100px] transition-all duration-700',
              isSoft ? 'h-[180px] opacity-50' : 'h-[270px] opacity-90',
            )}
          />
          {/* Radiant Cyan Glow */}
          <div
            className={cn(
              'absolute top-[5%] -right-[20%] w-[100%] bg-[#00D4FF] rounded-full filter blur-[90px] transition-all duration-700',
              isSoft ? 'h-[130px] opacity-45' : 'h-[190px] opacity-80',
            )}
          />
        </>
      )}
    </div>
  );
}
