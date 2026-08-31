import type React from 'react';
import { Spinner } from '@/components/atoms/Spinner';
import { cn } from '@/lib/utils';

export function Button(props: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'soft' | 'outline' | 'ghost' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg';
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
    'relative inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed select-none active:scale-[0.985] cursor-pointer';

  const variantClasses = {
    primary:
      'btn-crisp-blue dark:btn-crisp-blue-dark font-bold active:scale-[0.985] disabled:opacity-50',
    soft:
      'btn-crisp-soft dark:btn-crisp-soft-dark font-bold active:scale-[0.985] disabled:opacity-50',
    secondary:
      'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-200/80 dark:hover:bg-white/15 border border-slate-200/60 dark:border-white/10 shadow-2xs',
    outline:
      'btn-crisp-outline dark:btn-crisp-outline-dark font-bold active:scale-[0.985]',
    ghost:
      'btn-crisp-ghost dark:btn-crisp-ghost-dark font-semibold',
    glass:
      'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 active:bg-white/40 focus-visible:ring-white/50 shadow-md',
  };

  const sizeClasses = {
    xs: 'h-8 px-3 text-[11px] rounded-xl gap-1.5',
    sm: 'h-10 px-4 text-xs rounded-xl gap-2',
    md: 'h-12 px-6 text-sm rounded-2xl gap-2.5',
    lg: 'h-14 px-8 text-base rounded-2xl gap-3',
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
