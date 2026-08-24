import type React from 'react';
import { cn } from '@/lib/utils';

export function IconButton(props: {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onPointerDown?: (event: React.PointerEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  className?: string;
  variant?: 'ghost' | 'filled' | 'outline';
  disabled?: boolean;
}) {
  const variantClasses = {
    ghost:
      'bg-transparent text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 active:bg-neutral-200',
    filled: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300',
    outline:
      'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100',
  };

  const selectedVariant = props.variant ? variantClasses[props.variant] : variantClasses.ghost;

  return (
    <button
      type="button"
      aria-label={props.ariaLabel}
      onClick={props.onClick}
      onPointerDown={props.onPointerDown}
      disabled={props.disabled}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95',
        selectedVariant,
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}
