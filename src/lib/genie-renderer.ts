import { toCanvas } from 'html-to-image';

export type GenieDirection = 'open' | 'minimize';
export type DockPosition = 'top' | 'bottom';

export interface Point {
  x: number;
  y: number;
}

const DUR = 600;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eioC = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eIn2 = (t: number) => t * t;
const eOut2 = (t: number) => 1 - (1 - t) * (1 - t);

export function renderGenieFrame(
  ctx: CanvasRenderingContext2D,
  offscreenCanvas: HTMLCanvasElement,
  canvasWidth: number,
  canvasHeight: number,
  rawT: number,
  direction: GenieDirection,
  dockPoint: Point,
  windowPoint: Point,
  windowWidth: number,
  windowHeight: number,
  dockPosition: DockPosition,
  dpr: number,
) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (let y = 0; y < windowHeight; y++) {
    const r = y / windowHeight;
    const prox = dockPosition === 'bottom' ? r : 1 - r;

    const rowXStart = direction === 'minimize' ? (1 - prox) * 0.65 : prox * 0.65;
    const xP = clamp((rawT - rowXStart) / (1 - rowXStart), 0, 1);
    const xE = eioC(xP);

    const rowYStart = direction === 'minimize' ? (1 - prox) * 0.2 : prox * 0.2;
    const yP = clamp((rawT - rowYStart) / (1 - rowYStart), 0, 1);
    const yE = eIn2(yP);

    let left: number;
    let right: number;
    let destY: number;

    if (direction === 'minimize') {
      left = lerp(windowPoint.x, dockPoint.x, xE);
      right = lerp(windowPoint.x + windowWidth, dockPoint.x, xE);
      destY = lerp(windowPoint.y + y, dockPoint.y, yE);
    } else {
      left = lerp(dockPoint.x, windowPoint.x, xE);
      right = lerp(dockPoint.x, windowPoint.x + windowWidth, xE);
      destY = lerp(dockPoint.y, windowPoint.y + y, yE);
    }

    const rowW = right - left;
    if (rowW < 0.8) continue;

    ctx.drawImage(
      offscreenCanvas,
      0,
      y * dpr,
      windowWidth * dpr,
      dpr,
      left,
      destY,
      rowW,
      1,
    );
  }

  // Draw radiant glow burst at the dock point
  const glowRaw = direction === 'minimize' ? rawT : 1 - rawT;
  if (glowRaw > 0.7) {
    const a = eOut2((glowRaw - 0.7) / 0.3) * 0.45;
    const g = ctx.createRadialGradient(
      dockPoint.x,
      dockPoint.y,
      0,
      dockPoint.x,
      dockPoint.y,
      80,
    );
    g.addColorStop(0, `rgba(255, 153, 0, ${a})`);
    g.addColorStop(0.4, `rgba(234, 88, 12, ${a * 0.65})`);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }
}

let cachedSnapshot: HTMLCanvasElement | null = null;
let activeCanvas: HTMLCanvasElement | null = null;

export async function runGenieAnimation(
  direction: GenieDirection,
  popoverElement: HTMLElement,
  getTargetRect: () => DOMRect,
  dockPosition: DockPosition = 'bottom',
): Promise<void> {
  const popRect = popoverElement.getBoundingClientRect();
  const windowWidth = popRect.width;
  const windowHeight = popRect.height;

  // Capture fresh snapshot on open using html-to-image
  if (direction === 'open') {
    cachedSnapshot = null;
  }

  if (direction === 'open' || !cachedSnapshot) {
    try {
      popoverElement.style.transition = 'none';
      popoverElement.style.opacity = '0';
      popoverElement.style.visibility = 'visible';
      popoverElement.style.pointerEvents = 'none';

      void popoverElement.offsetHeight;

      cachedSnapshot = await toCanvas(popoverElement, {
        pixelRatio: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2),
        width: windowWidth,
        height: windowHeight,
        cacheBust: false,
        style: {
          opacity: '1',
          transform: 'none',
          top: '0',
          left: '0',
          bottom: 'auto',
          right: 'auto',
          margin: '0',
        },
      });
    } catch (err) {
      console.error('Failed to capture genie snapshot:', err);
      if (direction === 'open') {
        popoverElement.style.opacity = '1';
        popoverElement.style.pointerEvents = 'auto';
      }
      return;
    }
  }

  if (!cachedSnapshot) return;

  const windowPoint: Point = {
    x: popRect.left,
    y: popRect.top,
  };

  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  if (!activeCanvas) {
    activeCanvas = document.createElement('canvas');
    activeCanvas.style.position = 'fixed';
    activeCanvas.style.top = '0';
    activeCanvas.style.left = '0';
    activeCanvas.style.pointerEvents = 'none';
    activeCanvas.style.zIndex = '2147483647';
    document.body.appendChild(activeCanvas);
  }

  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
  activeCanvas.width = canvasWidth * dpr;
  activeCanvas.height = canvasHeight * dpr;
  activeCanvas.style.width = `${canvasWidth}px`;
  activeCanvas.style.height = `${canvasHeight}px`;

  const ctx = activeCanvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  const context = ctx;

  return new Promise<void>((resolve) => {
    let start: number | null = null;
    let firstFrameDrawn = false;

    function frame(ts: number) {
      if (!start) start = ts;
      const rawT = clamp((ts - start) / DUR, 0, 1);

      const btnRect = getTargetRect();
      const dockPoint: Point = {
        x: btnRect.left + btnRect.width / 2,
        y: btnRect.top + btnRect.height / 2,
      };

      renderGenieFrame(
        context,
        cachedSnapshot!,
        canvasWidth,
        canvasHeight,
        rawT,
        direction,
        dockPoint,
        windowPoint,
        windowWidth,
        windowHeight,
        dockPosition,
        dpr,
      );

      if (!firstFrameDrawn) {
        firstFrameDrawn = true;
        if (direction === 'minimize') {
          popoverElement.style.opacity = '0';
          popoverElement.style.pointerEvents = 'none';
        }
      }

      if (rawT < 1) {
        requestAnimationFrame(frame);
      } else {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        if (activeCanvas && activeCanvas.parentNode) {
          activeCanvas.parentNode.removeChild(activeCanvas);
          activeCanvas = null;
        }

        if (direction === 'open') {
          popoverElement.style.opacity = '1';
          popoverElement.style.visibility = 'visible';
          popoverElement.style.pointerEvents = 'auto';
        }

        resolve();
      }
    }

    requestAnimationFrame(frame);
  });
}
