'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function ClayIcon(props: {
  size?: number;
  colorPrimary?: string;
  colorLight?: string;
  colorDark?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const size = props.size ?? 30;
  const colorPrimary = props.colorPrimary ?? '#0d66e9';
  const colorLight = props.colorLight ?? '#38bdf8';
  const colorDark = props.colorDark ?? '#1d58ac';
  const borderRadius = Math.round(size * 0.28);

  return (
    <div
      onClick={props.onClick}
      className={cn(
        'relative inline-flex items-center justify-center select-none transition-transform duration-200 active:scale-95 cursor-pointer shrink-0',
        props.className,
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${borderRadius}px`,
        background: `linear-gradient(145deg, ${colorLight}, ${colorPrimary} 45%, ${colorDark})`,
        boxShadow: `
          inset ${Math.max(1, Math.round(size * 0.04))}px ${Math.max(1, Math.round(size * 0.04))}px ${Math.max(2, Math.round(size * 0.08))}px rgba(255, 255, 255, 0.65),
          inset -${Math.max(1, Math.round(size * 0.05))}px -${Math.max(1, Math.round(size * 0.05))}px ${Math.max(3, Math.round(size * 0.12))}px rgba(0, 0, 0, 0.45)
        `,
      }}
    >
      <div className="flex items-center justify-center text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.3)] pointer-events-none">
        {props.children}
      </div>
    </div>
  );
}
