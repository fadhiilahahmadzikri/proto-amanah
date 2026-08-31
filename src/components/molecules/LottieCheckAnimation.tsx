'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function LottieCheckAnimation(props: {
  className?: string;
  size?: number;
}) {
  const [animated, setAnimated] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const size = props.size ?? 110;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center select-none',
        props.className,
      )}
      style={{ width: size, height: size }}
    >
      {/* Subtle outer glow ring */}
      <div
        className={cn(
          'absolute inset-0 rounded-full bg-blue-500/10 blur-xl transition-all duration-1000 scale-90 opacity-0',
          animated ? 'scale-125 opacity-100' : '',
        )}
      />

      {/* Decorative floating burst particles */}
      <div
        className={cn(
          'absolute -top-1 right-2 h-2 w-2 rounded-full bg-blue-500 transition-all duration-700 delay-300 opacity-0 transform',
          animated ? 'scale-100 opacity-80 translate-y-[-6px]' : 'scale-0',
        )}
      />
      <div
        className={cn(
          'absolute bottom-1 -left-1 h-2 w-2 rounded-full bg-emerald-400 transition-all duration-700 delay-400 opacity-0 transform',
          animated ? 'scale-100 opacity-80 translate-x-[-6px]' : 'scale-0',
        )}
      />
      <div
        className={cn(
          'absolute top-4 -left-2 h-1.5 w-1.5 rounded-full bg-blue-400 transition-all duration-700 delay-500 opacity-0 transform',
          animated ? 'scale-100 opacity-70 translate-y-[-4px]' : 'scale-0',
        )}
      />
      <div
        className={cn(
          'absolute -bottom-1 right-4 h-1.5 w-1.5 rounded-full bg-indigo-500 transition-all duration-700 delay-500 opacity-0 transform',
          animated ? 'scale-100 opacity-70 translate-y-[4px]' : 'scale-0',
        )}
      />

      {/* SVG Animated Check Circle */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Soft Background Circle */}
        <circle
          cx="50"
          cy="50"
          r="44"
          className={cn(
            'fill-blue-50/80 transition-all duration-500 ease-out origin-center',
            animated ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
          )}
        />

        {/* Outline Circle Stroke */}
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke="#0d66e9"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="280"
          strokeDashoffset={animated ? '0' : '280'}
          className="transition-all duration-800 ease-out origin-center"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />

        {/* Checkmark Stroke */}
        <path
          d="M32 52L44 64L68 38"
          stroke="#1d58ac"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="60"
          strokeDashoffset={animated ? '0' : '60'}
          className="transition-all duration-600 delay-300 ease-out"
        />
      </svg>
    </div>
  );
}
