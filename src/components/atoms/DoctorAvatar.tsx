'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function DoctorAvatar(props: {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  const size = props.size ?? 52;
  const [hasError, setHasError] = React.useState(false);
  const fallbackSrc = '/assets/images/woman-signin-hero.png';
  const displaySrc = !hasError && props.src ? props.src : fallbackSrc;

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-white/20 border-2 border-white/40 shadow-sm shrink-0 backdrop-blur-md',
        props.className,
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <img
        src={displaySrc}
        alt={props.alt}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover object-top"
        loading="eager"
      />
    </div>
  );
}
