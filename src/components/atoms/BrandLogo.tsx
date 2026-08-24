import { cn } from '@/lib/utils';

export function BrandLogo(props: {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}) {
  const isLight = props.variant === 'light';

  const sizeClasses = {
    sm: 'text-xl tracking-tight',
    md: 'text-2xl tracking-tight',
    lg: 'text-3xl tracking-tight',
  };

  const selectedSize = props.size ? sizeClasses[props.size] : sizeClasses.md;

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center font-serif font-semibold',
        selectedSize,
        isLight ? 'text-white' : 'text-neutral-950',
        props.className,
      )}
    >
      <span className="flex items-center gap-0.5">
        <span className="font-sans font-bold tracking-tight">L</span>
        <span className="relative font-serif font-bold text-blue-600 italic">
          ó<span className="absolute -top-1 right-0 font-sans text-[10px] text-blue-500">´</span>
        </span>
        <span className="font-sans font-bold tracking-tight">vi</span>
      </span>
    </div>
  );
}
