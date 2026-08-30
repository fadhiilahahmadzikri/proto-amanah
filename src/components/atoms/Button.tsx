import type React from 'react';
import { Spinner } from '@/components/atoms/Spinner';
import { cn } from '@/lib/utils';

export function Button(props: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}) {
  const baseClasses =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed select-none active:scale-[0.985] cursor-pointer';

  const variantClasses = {
    primary:
      'btn-crisp-blue dark:btn-crisp-blue-dark font-bold active:scale-[0.985] disabled:opacity-50',
    secondary:
      'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 focus-visible:ring-neutral-400 disabled:bg-neutral-100 disabled:text-neutral-400',
    outline:
      'border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:ring-neutral-400 disabled:border-neutral-200 disabled:text-neutral-400 shadow-2xs',
    ghost:
      'bg-transparent text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/60 active:bg-neutral-100 focus-visible:ring-neutral-400 disabled:text-neutral-400 disabled:hover:bg-transparent',
    glass:
      'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 active:bg-white/40 focus-visible:ring-white/50 shadow-md',
  };

  const sizeClasses = {
    sm: 'h-10 px-4 text-xs rounded-full gap-2',
    md: 'h-12 px-6 text-sm rounded-full gap-2.5',
    lg: 'h-14 px-8 text-base rounded-full gap-3',
  };

  const selectedVariant = props.variant
    ? variantClasses[props.variant]
    : variantClasses.primary;
  const selectedSize = props.size
    ? sizeClasses[props.size]
    : sizeClasses.md;

  return (
    <button
      type={props.type ?? 'button'}
      form={props.form}
      disabled={props.disabled ?? props.isLoading}
      onClick={props.onClick}
      className={cn(
        baseClasses,
        selectedVariant,
        selectedSize,
        props.fullWidth ? 'w-full' : '',
        props.disabled || props.isLoading ? 'opacity-80' : '',
        props.className,
      )}
    >
      {props.isLoading ? (
        <span className="flex items-center gap-2">
          <Spinner size="sm" />
          <span>{props.children}</span>
        </span>
      ) : (
        <>
          {props.startIcon && (
            <span className="shrink-0 flex items-center justify-center">
              {props.startIcon}
            </span>
          )}
          <span>{props.children}</span>
          {props.endIcon && (
            <span className="shrink-0 flex items-center justify-center">
              {props.endIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
}
