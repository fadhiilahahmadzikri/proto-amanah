import React from 'react';
import { cn } from '@/lib/utils';

export type ConfettiCanvasHandle = {
  fire: () => void;
};

export const ConfettiCanvas = React.forwardRef<
  ConfettiCanvasHandle,
  { className?: string }
>(function ConfettiCanvas(props, ref) {
  const internalCanvasRef = React.useRef<HTMLCanvasElement>(null);

  const fire = React.useCallback(() => {
    const canvas = internalCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth ?? window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight ?? window.innerHeight;

    const particles = Array.from({ length: 100 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2 - 100,
      r: Math.random() * 6 + 2,
      dx: Math.random() * 10 - 5,
      dy: Math.random() * -10 - 5,
      color: ['#ff9900', '#ff0000', '#00ff00', '#0000ff', '#ff00ff'][
        Math.floor(Math.random() * 5)
      ],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngle: 0,
      tiltAngleInc: Math.random() * 0.07 + 0.05,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle) * 2;
        p.dy += 0.1;
        p.x += p.dx;
        p.y += p.dy;

        if (p.y <= canvas.height) active = true;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color ?? '#ff9900';
        ctx.moveTo(p.x + p.tilt + p.r, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();
      });

      if (active) {
        requestAnimationFrame(render);
      }
    };

    render();
  }, []);

  React.useImperativeHandle(ref, () => ({
    fire,
  }));

  return (
    <canvas
      ref={internalCanvasRef}
      className={cn('pointer-events-none absolute inset-0 z-50', props.className)}
    />
  );
});
