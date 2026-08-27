'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';

export type PixelTextureProps = {
  /**
   * Color mode for generating the pixel palette:
   * - 'theme': Computes mathematically with primary/secondary colors
   * - 'primary': Direct primary theme color shades
   * - 'monochrome': Clean slate / neutral white shades
   * - 'custom': Uses custom colors array passed in `customColors`
   */
  colorMode?: 'theme' | 'primary' | 'monochrome' | 'custom';

  /**
   * Custom colors if colorMode === 'custom'
   */
  customColors?: string[];

  /**
   * Primary color override (defaults to '#0a44ff' or cyan-400)
   */
  primaryColor?: string;

  /**
   * Secondary accent color override
   */
  secondaryColor?: string;

  /**
   * Overall opacity of the pixel texture
   * Default: 0.35
   */
  opacity?: number;

  /**
   * Masking variant for the texture:
   * - 'bottom-left': Diagonal/radial corner fade focused at the bottom-left
   * - 'curved-convex': Organic arch dome curve
   * - 'curved-concave': Inward valley curve
   * - 'curved-bottom': Convex arch fading towards bottom
   * - 'curved-top': Convex arch fading towards top
   * - 'fade-bottom': Linear gradient fade to bottom
   * - 'fade-top': Linear gradient fade to top
   * - 'none': Full unmasked
   */
  maskVariant?:
    | 'bottom-left'
    | 'triangle-bottom-left'
    | 'curved-convex'
    | 'curved-concave'
    | 'curved-bottom'
    | 'curved-top'
    | 'fade-bottom'
    | 'fade-top'
    | 'none';

  /**
   * Invert the masking gradient
   */
  invertMask?: boolean;

  /**
   * Custom CSS mask-image override
   */
  maskGradient?: string;

  /**
   * Enable an organic curved white / card-surface background plate behind the content
   */
  curvedWhiteMask?: boolean;

  /**
   * Pixel cell size in pixels (default: 4.5)
   */
  pixelSize?: number;

  /**
   * Grid gap size in pixels (default: 1.5)
   */
  gap?: number;

  /**
   * Density / vibrance of pixel distribution
   */
  density?: 'subtle' | 'medium' | 'dense';

  /**
   * Blend mode for the texture layer
   */
  blendMode?: React.CSSProperties['mixBlendMode'];

  /**
   * Custom height (e.g. '100%', '160px', 240)
   */
  height?: number | string;

  /**
   * Custom width (e.g. '100%')
   */
  width?: number | string;

  /**
   * Position mode (e.g. 'absolute' or 'relative')
   */
  position?: 'absolute' | 'relative';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Inline style object
   */
  style?: React.CSSProperties;
};

export function PixelTexture(props: PixelTextureProps) {
  const patternId = useId().replace(/:/g, '-');

  const colorMode = props.colorMode ?? 'theme';
  const primaryColor = props.primaryColor ?? '#0a44ff';
  const secondaryColor = props.secondaryColor ?? '#00d4ff';
  const opacity = props.opacity ?? 0.35;
  const maskVariant = props.maskVariant ?? 'curved-convex';
  const invertMask = props.invertMask ?? false;
  const pixelSize = props.pixelSize ?? 4.5;
  const gap = props.gap ?? 1.5;
  const density = props.density ?? 'medium';
  const blendMode = props.blendMode ?? 'normal';
  const height = props.height ?? '100%';
  const width = props.width ?? '100%';
  const position = props.position ?? 'absolute';

  // Seeded deterministic hash for organic, non-uniform pixel distribution
  const seededHash = (x: number, y: number, seed: number) => {
    const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
    return n - Math.floor(n);
  };

  // Compute a large 24x20 organic pixel matrix to eliminate repeating visual patterns
  const cols = 24;
  const rows = 20;
  const step = pixelSize + gap;
  const patternW = cols * step;
  const patternH = rows * step;

  const cells: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    fill: string;
    fillOpacity: number;
  }> = [];

  const dropoutThreshold = density === 'dense' ? 0.22 : density === 'subtle' ? 0.48 : 0.35;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // 1. Organic dropout: randomly skip cells to create natural pixel scatter & breaks
      const dropoutVal = seededHash(r, c, 11);
      if (dropoutVal < dropoutThreshold) {
        continue;
      }

      // 2. Randomized organic opacity
      const opacRand = seededHash(r, c, 23);
      const cellOpacity = Math.min(1, Math.max(0.12, 0.18 + opacRand * 0.82));

      // 3. Subtle micro-size jitter for natural depth
      const sizeRand = seededHash(r, c, 37);
      const currentSize = sizeRand < 0.22 ? pixelSize * 0.75 : sizeRand > 0.85 ? pixelSize * 1.15 : pixelSize;
      const offset = (pixelSize - currentSize) / 2;

      // 4. Organic color distribution
      let fill = 'currentColor';
      const colorRand = seededHash(r, c, 47);

      if (colorMode === 'theme') {
        if (colorRand < 0.35) {
          fill = `color-mix(in oklab, ${primaryColor} 80%, white)`;
        } else if (colorRand < 0.65) {
          fill = `color-mix(in oklab, ${secondaryColor} 60%, white)`;
        } else if (colorRand < 0.85) {
          fill = `color-mix(in oklab, ${primaryColor} 30%, white)`;
        } else {
          fill = '#ffffff';
        }
      } else if (colorMode === 'primary') {
        fill = primaryColor;
      } else if (colorMode === 'monochrome') {
        if (colorRand < 0.4) {
          fill = '#cbd5e1';
        } else if (colorRand < 0.75) {
          fill = '#94a3b8';
        } else {
          fill = '#ffffff';
        }
      } else if (colorMode === 'custom' && props.customColors && props.customColors.length > 0) {
        const colorIdx = Math.floor(colorRand * props.customColors.length);
        fill = props.customColors[colorIdx] ?? primaryColor;
      }

      cells.push({
        x: c * step + offset,
        y: r * step + offset,
        w: currentSize,
        h: currentSize,
        fill,
        fillOpacity: cellOpacity,
      });
    }
  }

  // Determine CSS mask gradient
  let maskStyle: React.CSSProperties = {};
  if (props.maskGradient) {
    maskStyle = {
      maskImage: props.maskGradient,
      WebkitMaskImage: props.maskGradient,
    };
  } else if (maskVariant !== 'none') {
    let gradientStr = '';

    if (maskVariant === 'bottom-left' || maskVariant === 'triangle-bottom-left') {
      // Ultra-soft multi-stop feathering mask that seamlessly dissolves pixels into background with zero harsh lines
      gradientStr = invertMask
        ? 'radial-gradient(130% 95% at 0% 100%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 15%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,1) 90%)'
        : 'radial-gradient(130% 95% at 0% 100%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 15%, rgba(0,0,0,0.45) 32%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.06) 68%, rgba(0,0,0,0) 85%)';
    } else if (maskVariant === 'curved-convex' || maskVariant === 'curved-bottom') {
      gradientStr = invertMask
        ? 'radial-gradient(88% 62% at 50% 102%, rgba(0,0,0,1) 28%, rgba(0,0,0,0.55) 62%, rgba(0,0,0,0) 95%)'
        : 'radial-gradient(88% 62% at 50% -2%, rgba(0,0,0,1) 28%, rgba(0,0,0,0.55) 62%, rgba(0,0,0,0) 95%)';
    } else if (maskVariant === 'curved-concave' || maskVariant === 'curved-top') {
      gradientStr = invertMask
        ? 'radial-gradient(90% 65% at 50% -2%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,1) 100%)'
        : 'radial-gradient(90% 65% at 50% 102%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,1) 100%)';
    } else if (maskVariant === 'fade-bottom') {
      gradientStr = invertMask
        ? 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,1) 100%)'
        : 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0) 100%)';
    } else if (maskVariant === 'fade-top') {
      gradientStr = invertMask
        ? 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,1) 100%)'
        : 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0) 100%)';
    }

    if (gradientStr) {
      maskStyle = {
        maskImage: gradientStr,
        WebkitMaskImage: gradientStr,
      };
    }
  }

  return (
    <div
      style={{
        position,
        height,
        width,
        opacity,
        mixBlendMode: blendMode,
        ...maskStyle,
        ...props.style,
      }}
      className={cn(
        'top-0 left-0 right-0 pointer-events-none select-none overflow-hidden z-0',
        position === 'absolute' && 'inset-0',
        props.className,
      )}
      aria-hidden="true"
    >
      <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
            width={patternW}
            height={patternH}
            patternUnits="userSpaceOnUse"
          >
            {cells.map((cell, idx) => (
              <rect
                key={idx}
                x={cell.x}
                y={cell.y}
                width={cell.w}
                height={cell.h}
                rx={1}
                fill={cell.fill}
                fillOpacity={cell.fillOpacity}
              />
            ))}
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {/* Optional Organic Curved White Mask Plate */}
      {props.curvedWhiteMask && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(150% 120% at 50% -20%, transparent 55%, var(--card) 85%, var(--card) 100%)',
          }}
        />
      )}
    </div>
  );
}
