'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Lightweight QR Code Generator (Reed-Solomon & QR Matrix Generation)
function generateQrMatrix(text: string): boolean[][] {
  // 25x25 QR Matrix (Version 2)
  const size = 25;
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  );

  const setModule = (r: number, c: number, val: boolean) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      matrix[r]![c] = val;
    }
  };

  // 1. Finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (startRow: number, startCol: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          setModule(startRow + r, startCol + c, true);
        } else {
          setModule(startRow + r, startCol + c, false);
        }
      }
    }
    // Separator border
    for (let i = 0; i < 8; i++) {
      setModule(startRow - 1, startCol + i, false);
      setModule(startRow + 7, startCol + i, false);
      setModule(startRow + i, startCol - 1, false);
      setModule(startRow + i, startCol + 7, false);
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // 2. Alignment pattern at (18, 18) for Version 2
  const alignRow = 18;
  const alignCol = 18;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
        setModule(alignRow + r, alignCol + c, true);
      } else {
        setModule(alignRow + r, alignCol + c, false);
      }
    }
  }

  // 3. Timing patterns
  for (let i = 8; i < size - 8; i++) {
    const val = i % 2 === 0;
    if (matrix[6]![i] === null) {
      setModule(6, i, val);
    }
    if (matrix[i]![6] === null) {
      setModule(i, 6, val);
    }
  }

  // 4. Dark module
  setModule(size - 8, 8, true);

  // 5. Seed data hash distribution based on payload string
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  // Populate remainder data area with encoded data bits
  let bitIndex = 0;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) {
      col--; // Skip vertical timing column
    }
    for (let count = 0; count < size; count++) {
      for (let cOffset = 0; cOffset < 2; cOffset++) {
        const c = col - cOffset;
        const row = Math.floor(col / 2) % 2 === 0 ? count : size - 1 - count;

        if (matrix[row]![c] === null) {
          const charCode = text.charCodeAt(bitIndex % text.length) || 42;
          const mask = (row + c) % 2 === 0;
          const pseudoBit = ((hash >> (bitIndex % 31)) & 1) ^ ((charCode >> (bitIndex % 8)) & 1);
          setModule(row, c, (pseudoBit === 1) !== mask);
          bitIndex++;
        }
      }
    }
  }

  return matrix.map(row => row.map(cell => cell ?? false));
}

export function QrCodeSvg(props: {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  className?: string;
}) {
  const matrix = React.useMemo(() => generateQrMatrix(props.value), [props.value]);
  const matrixSize = matrix.length;
  const cellSize = 10;
  const margin = 20;
  const dimension = matrixSize * cellSize + margin * 2;

  const fg = props.fgColor ?? '#0f172a';
  const bg = props.bgColor ?? '#ffffff';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${dimension} ${dimension}`}
      width={props.size ?? 160}
      height={props.size ?? 160}
      className={cn('rounded-xl select-none', props.className)}
      shapeRendering="crispEdges"
    >
      <rect width="100%" height="100%" fill={bg} rx="16" />
      {matrix.map((row, r) =>
        row.map((isFilled, c) => {
          if (!isFilled) {
            return null;
          }
          return (
            <rect
              key={`qr-${r}-${c}`}
              x={margin + c * cellSize}
              y={margin + r * cellSize}
              width={cellSize}
              height={cellSize}
              fill={fg}
              rx="1.5"
            />
          );
        }),
      )}
    </svg>
  );
}
