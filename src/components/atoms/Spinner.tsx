import { cn } from '@/lib/utils';

export function Spinner(props: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-5 w-5 border-2',
    lg: 'h-6 w-6 border-3',
  };

  const selectedSize = props.size ? sizeClasses[props.size] : sizeClasses.md;

  return (
    <div
      role="status"
      aria-label="Memuat..."
      className={cn(
        'animate-spin rounded-full border-current border-t-transparent',
        selectedSize,
        props.className,
      )}
    >
      <span className="sr-only">Memuat...</span>
    </div>
  );
}
