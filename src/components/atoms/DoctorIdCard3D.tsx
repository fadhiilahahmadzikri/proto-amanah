'use client';

import {
  Environment,
  Lightformer,
  useGLTF,
} from '@react-three/drei';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  type RapierRigidBody,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}

const CARD_GLB_PATH = '/assets/3d/card.glb';

if (typeof window !== 'undefined') {
  try {
    useGLTF.preload(CARD_GLB_PATH);
  } catch {
    // Ignore preload failure in constrained environments
  }
}

const segmentProps = {
  type: 'dynamic',
  canSleep: true,
  colliders: false,
  angularDamping: 0.8,
  linearDamping: 1.0,
} as const;

export type DoctorCardProfile = {
  name: string;
  role: string;
  sip: string;
  hospital: string;
  avatarUrl: string;
  idNumber?: string;
  department?: string;
};

export function getAssetUrl(relativePath: string): string {
  const clean = relativePath.replace(/^\.?\//, '');
  return `/${clean}`;
}

function drawBauhausBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  type: number,
  primaryColor: string,
  secondaryColor?: string,
  opacity: number = 1.0,
) {
  ctx.save();
  ctx.globalAlpha = opacity;

  if (secondaryColor) {
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(x, y, w, h);
  }

  ctx.fillStyle = primaryColor;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const r = w / 2;

  ctx.beginPath();
  switch (type % 6) {
    case 0:
      ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 1:
      ctx.arc(cx, cy + r * 0.2, r * 0.88, Math.PI, 0);
      ctx.fill();
      break;
    case 2:
      ctx.moveTo(x, y);
      ctx.arc(x, y, w * 0.95, 0, Math.PI / 2);
      ctx.lineTo(x, y);
      ctx.fill();
      break;
    case 3:
      ctx.moveTo(cx, y + 6);
      ctx.lineTo(x + w - 6, cy);
      ctx.lineTo(cx, y + h - 6);
      ctx.lineTo(x + 6, cy);
      ctx.closePath();
      ctx.fill();
      break;
    case 4:
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
      ctx.fill();
      break;
    case 5:
    default:
      ctx.arc(cx, cy, r * 0.92, Math.PI, 0);
      ctx.lineTo(cx + r * 0.45, cy);
      ctx.arc(cx, cy, r * 0.45, 0, Math.PI, true);
      ctx.closePath();
      ctx.fill();
      break;
  }

  ctx.restore();
}

function drawThemeGrid(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  totalW: number,
  totalH: number,
  theme: 'light' | 'dark',
  cols: number = 4,
  rows: number = 5,
  opacity: number = 1.0,
) {
  const lightPalette = [
    { fg: '#002b9e', bg: '#eef4ff' },
    { fg: '#0d66e9', bg: '#dbeafe' },
    { fg: '#07247a', bg: '#eef4ff' },
    { fg: '#00d4ff', bg: '#002b9e' },
    { fg: '#0d66e9', bg: '#ffffff' },
    { fg: '#002b9e', bg: '#dbeafe' },
  ];

  const darkPalette = [
    { fg: '#00d4ff', bg: '#062837' },
    { fg: '#a3e635', bg: '#083344' },
    { fg: '#14b8a6', bg: '#04202c' },
    { fg: '#22d3ee', bg: '#0d3846' },
    { fg: '#84cc16', bg: '#021824' },
    { fg: '#67e8f9', bg: '#0f4050' },
  ];

  const activePalette = theme === 'dark' ? darkPalette : lightPalette;
  const gap = 16;
  const blockW = (totalW - (cols - 1) * gap) / cols;
  const blockH = (totalH - (rows - 1) * gap) / rows;

  let index = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const bx = startX + c * (blockW + gap);
      const by = startY + r * (blockH + gap);
      const type = (r * 3 + c * 2 + (r % 2)) % 6;
      const pair = activePalette[(r * cols + c + index) % activePalette.length]!;

      drawBauhausBlock(ctx, bx, by, blockW, blockH, type, pair.fg, pair.bg, opacity);
      index++;
    }
  }
}

function drawLinearBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  barcodeValue: string,
) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(x - 30, y - 24, width + 60, height + 84, 24);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  let currentX = x;
  const totalUnits = 140;
  const unitWidth = width / totalUnits;

  let seed = 1337;
  for (let i = 0; i < barcodeValue.length; i++) {
    seed = (seed * 31 + barcodeValue.charCodeAt(i)) % 10000;
  }

  ctx.fillRect(currentX, y, unitWidth * 2, height); currentX += unitWidth * 3;
  ctx.fillRect(currentX, y, unitWidth * 2, height); currentX += unitWidth * 3;

  while (currentX < x + width - unitWidth * 12) {
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    const barWidth = rnd > 0.65 ? unitWidth * 3.5 : (rnd > 0.35 ? unitWidth * 2 : unitWidth);
    const spaceWidth = (1 - rnd) > 0.65 ? unitWidth * 3 : unitWidth * 1.5;

    ctx.fillRect(currentX, y, barWidth, height);
    currentX += barWidth + spaceWidth;
  }

  ctx.fillRect(x + width - unitWidth * 8, y, unitWidth * 2, height);
  ctx.fillRect(x + width - unitWidth * 3, y, unitWidth * 2, height);

  (ctx as any).letterSpacing = '-1px';
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(barcodeValue, x + width / 2, y + height + 42);

  ctx.restore();
}

function createDoctorCardCanvasTexture(
  profile: DoctorCardProfile,
  avatarImg: HTMLImageElement | null,
  theme: 'light' | 'dark' = 'light',
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 4096;
  canvas.height = 4096;
  const ctx = canvas.getContext('2d')!;

  const isDark = theme === 'dark';

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.fillStyle = isDark ? '#07121b' : '#ffffff';
  ctx.fillRect(0, 0, 4096, 4096);

  const frontW = 2048;
  const frontH = 3072;
  const bottomPanelY = 2360;

  ctx.fillStyle = isDark ? '#08141e' : '#f8faff';
  ctx.fillRect(0, 0, frontW, frontH);

  const frontGlow = ctx.createRadialGradient(
    frontW * 0.75,
    frontH * 0.25,
    50,
    frontW * 0.5,
    frontH * 0.4,
    1400,
  );
  if (isDark) {
    frontGlow.addColorStop(0, 'rgba(0, 212, 255, 0.15)');
    frontGlow.addColorStop(0.6, 'rgba(163, 230, 53, 0.08)');
    frontGlow.addColorStop(1, 'rgba(8, 20, 30, 0)');
  } else {
    frontGlow.addColorStop(0, 'rgba(0, 43, 158, 0.14)');
    frontGlow.addColorStop(0.6, 'rgba(10, 68, 255, 0.08)');
    frontGlow.addColorStop(1, 'rgba(248, 250, 255, 0)');
  }
  ctx.fillStyle = frontGlow;
  ctx.fillRect(0, 0, frontW, frontH);

  const fontSans = '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  ctx.fillStyle = isDark ? '#a3e635' : '#00d4ff';
  ctx.beginPath();
  ctx.roundRect(180, 200, 72, 72, 20);
  ctx.fill();
  ctx.fillStyle = isDark ? '#00d4ff' : '#0d66e9';
  ctx.fillRect(204, 216, 24, 40);
  ctx.fillRect(196, 224, 40, 24);

  (ctx as any).letterSpacing = '-2px';
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.font = `bold 72px ${fontSans}`;
  ctx.textAlign = 'left';
  ctx.fillText('Amanah', 276, 256);

  drawThemeGrid(ctx, 180, 360, 1688, 1960, theme, 4, 5, isDark ? 0.65 : 0.58);

  if (avatarImg && avatarImg.complete && avatarImg.naturalWidth > 0) {
    ctx.save();
    const imgAspect = avatarImg.naturalWidth / avatarImg.naturalHeight;
    const drawH = 2380;
    const drawW = drawH * imgAspect;
    const drawX = 1024 - drawW / 2;
    const drawY = bottomPanelY - drawH + 260;

    ctx.drawImage(avatarImg, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  ctx.fillStyle = isDark ? '#0c1b29' : '#ffffff';
  ctx.fillRect(0, bottomPanelY, frontW, frontH - bottomPanelY);

  ctx.strokeStyle = isDark ? 'rgba(0, 212, 255, 0.25)' : 'rgba(10, 68, 255, 0.15)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(180, bottomPanelY);
  ctx.lineTo(1868, bottomPanelY);
  ctx.stroke();

  (ctx as any).letterSpacing = '-3px';
  ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
  const nameFontSize = profile.name.length > 25 ? 74 : (profile.name.length > 18 ? 86 : 102);
  ctx.font = `bold ${nameFontSize}px ${fontSans}`;
  ctx.textAlign = 'left';
  ctx.fillText(profile.name, 180, bottomPanelY + 165);

  (ctx as any).letterSpacing = '-2px';
  ctx.fillStyle = '#64748b';
  ctx.font = `600 58px ${fontSans}`;
  ctx.fillText(profile.role, 180, bottomPanelY + 265);

  (ctx as any).letterSpacing = '-1px';
  ctx.fillStyle = '#94a3b8';
  ctx.font = `bold 40px ${fontSans}`;
  ctx.textAlign = 'right';
  ctx.fillText('NOMOR SIP / ID', 1868, bottomPanelY + 145);

  (ctx as any).letterSpacing = '-2px';
  ctx.fillStyle = '#64748b';
  ctx.font = `bold 52px "Plus Jakarta Sans", monospace`;
  ctx.fillText(profile.sip || '503/442.1/SIP-D/2026', 1868, bottomPanelY + 225);

  (ctx as any).letterSpacing = '-1px';
  ctx.fillStyle = isDark ? '#2dd4bf' : '#0d66e9';
  ctx.font = `700 46px ${fontSans}`;
  ctx.fillText('RS AMANAH SEHAT', 1868, bottomPanelY + 310);

  const backStartX = 2048;
  const backCenterX = 3072;

  ctx.fillStyle = isDark ? '#08141e' : '#f8faff';
  ctx.fillRect(backStartX, 0, frontW, frontH);

  drawThemeGrid(ctx, backStartX + 180, 180, 1688, 1750, theme, 4, 4, 1.0);

  drawLinearBarcode(
    ctx,
    backStartX + 260,
    2080,
    1528,
    170,
    `*DOC-${profile.sip.replace(/[^a-zA-Z0-9]/g, '') || '50344212026'}*`,
  );

  ctx.fillStyle = isDark ? '#a3e635' : '#00d4ff';
  ctx.beginPath();
  ctx.roundRect(backCenterX - 220, 2580, 76, 76, 22);
  ctx.fill();
  ctx.fillStyle = isDark ? '#00d4ff' : '#0d66e9';
  ctx.fillRect(backCenterX - 198, 2600, 32, 36);
  ctx.fillRect(backCenterX - 206, 2604, 48, 28);

  (ctx as any).letterSpacing = '-2px';
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.font = `bold 84px ${fontSans}`;
  ctx.textAlign = 'left';
  ctx.fillText('Amanah', backCenterX - 110, 2642);

  (ctx as any).letterSpacing = '-1px';
  ctx.fillStyle = '#94a3b8';
  ctx.font = `700 36px ${fontSans}`;
  ctx.textAlign = 'center';
  ctx.fillText('HEALTHCARE IDENTITY SYSTEM', backCenterX, 2735);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.flipY = false;
  texture.needsUpdate = true;
  return texture;
}

function createLanyardCanvasTexture(theme: 'light' | 'dark' = 'light'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const isDark = theme === 'dark';
  ctx.fillStyle = isDark ? '#050c14' : '#091b36';
  ctx.fillRect(0, 0, 1024, 256);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let x = 0; x < 1024; x += 6) {
    for (let y = 0; y < 256; y += 6) {
      if ((x + y) % 12 === 0) {
        ctx.fillRect(x, y, 3, 3);
      }
    }
  }

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(0, 22);
  ctx.lineTo(1024, 22);
  ctx.moveTo(0, 234);
  ctx.lineTo(1024, 234);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#00d4ff';
  ctx.beginPath();
  ctx.roundRect(70, 88, 80, 80, 20);
  ctx.fill();
  ctx.fillStyle = isDark ? '#050c14' : '#091b36';
  ctx.fillRect(98, 104, 24, 48);
  ctx.fillRect(86, 116, 48, 24);

  (ctx as any).letterSpacing = '5px';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('RS AMANAH SEHAT', 180, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(-3, 1);
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

function BandMesh(props: {
  profile: DoctorCardProfile;
  theme?: 'light' | 'dark';
  maxSpeed?: number;
  minSpeed?: number;
}) {
  const maxSpeed = props.maxSpeed ?? 50;
  const minSpeed = props.minSpeed ?? 10;
  const theme = props.theme ?? 'light';

  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);

  const card = useRef<RapierRigidBody>(null!);
  const cardMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const vec = useRef(new THREE.Vector3()).current;
  const ang = useRef(new THREE.Vector3()).current;
  const rot = useRef(new THREE.Vector3()).current;
  const dir = useRef(new THREE.Vector3()).current;
  const cardQuat = useRef(new THREE.Quaternion()).current;
  const cardNormal = useRef(new THREE.Vector3()).current;

  const isDragging = useRef(false);
  const dragOffset = useRef<THREE.Vector3 | null>(null);
  const pointerDownPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [hovered, hover] = useState(false);

  const { nodes, materials } = useGLTF(CARD_GLB_PATH) as any;

  const lanyardTexture = useMemo(() => {
    return createLanyardCanvasTexture(theme);
  }, [theme]);

  const [avatarImage, setAvatarImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = props.profile.avatarUrl;
    img.onload = () => setAvatarImage(img);
  }, [props.profile.avatarUrl]);

  const doctorCardTexture = useMemo(() => {
    return createDoctorCardCanvasTexture(props.profile, avatarImage, theme);
  }, [props.profile, avatarImage, theme]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );

  useEffect(() => {
    const handleGlobalRelease = () => {
      if (isDragging.current) {
        isDragging.current = false;
        dragOffset.current = null;
        [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      }
    };

    window.addEventListener('pointerup', handleGlobalRelease, { passive: true });
    window.addEventListener('pointercancel', handleGlobalRelease, { passive: true });
    window.addEventListener('touchend', handleGlobalRelease, { passive: true });
    window.addEventListener('touchcancel', handleGlobalRelease, { passive: true });

    return () => {
      window.removeEventListener('pointerup', handleGlobalRelease);
      window.removeEventListener('pointercancel', handleGlobalRelease);
      window.removeEventListener('touchend', handleGlobalRelease);
      window.removeEventListener('touchcancel', handleGlobalRelease);
    };
  }, []);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.74]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.74]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.74]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 2.02, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useFrame((state, delta) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !band.current || !card.current) {
      return;
    }

    if (isDragging.current && dragOffset.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      
      const targetX = vec.x - dragOffset.current.x;
      const targetY = vec.y - dragOffset.current.y;
      const targetZ = vec.z - dragOffset.current.z;

      card.current.setTranslation({ x: targetX, y: targetY, z: targetZ }, true);
      card.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    if (fixed.current) {
      const [j1Lerped, j2Lerped] = [j1, j2].map((ref) => {
        if (ref.current) {
          const lerped = new THREE.Vector3().copy(ref.current.translation());
          const clampedDistance = Math.max(0.1, Math.min(1, lerped.distanceTo(ref.current.translation())));
          return lerped.lerp(
            ref.current.translation(),
            delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
          );
        }
        return new THREE.Vector3();
      });

      if (curve.points.length >= 4) {
        curve.points[0]?.copy(j3.current.translation());
        curve.points[1]?.copy(j2Lerped ?? j2.current.translation());
        curve.points[2]?.copy(j1Lerped ?? j1.current.translation());
        curve.points[3]?.copy(fixed.current.translation());
        band.current.geometry.setPoints(curve.getPoints(32));
      }

      if (!isDragging.current) {
        ang.copy(card.current.angvel());
        rot.copy(card.current.rotation());
        
        card.current.setAngvel(
          { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
          false
        );
      }

      if (cardMaterialRef.current) {
        const rawQuat = card.current.rotation();
        cardQuat.set(rawQuat.x, rawQuat.y, rawQuat.z, rawQuat.w);
        cardNormal.set(0, 0, 1).applyQuaternion(cardQuat);

        const facingRatio = Math.min(1, Math.max(0, Math.abs(cardNormal.z)));
        const facingPower = Math.pow(facingRatio, 3);
        const dynamicClearcoat = THREE.MathUtils.lerp(0.92, 0.04, facingPower);
        const dynamicRoughness = THREE.MathUtils.lerp(0.2, 0.4, facingPower);

        cardMaterialRef.current.clearcoat = dynamicClearcoat;
        cardMaterialRef.current.clearcoatRoughness = THREE.MathUtils.lerp(0.08, 0.25, facingRatio);
        cardMaterialRef.current.roughness = dynamicRoughness;
      }
    }
  });

  curve.curveType = 'chordal';
  lanyardTexture.wrapS = lanyardTexture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4.92, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.36, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody position={[0.72, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody position={[1.08, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.08]} />
        </RigidBody>

        <RigidBody
          position={[1.44, 0, 0]}
          ref={card}
          {...segmentProps}
          type="dynamic"
        >
          <CuboidCollider args={[1.14, 1.6, 0.015]} />
          <group
            scale={3.2}
            position={[0, -1.78, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerDown={(e) => {
              e.stopPropagation();
              const domEl = (e.nativeEvent?.target as HTMLElement) || document.body;
              try {
                domEl.setPointerCapture?.(e.pointerId);
              } catch {}

              pointerDownPos.current = { x: e.clientX, y: e.clientY };

              if (card.current) {
                isDragging.current = true;
                dragOffset.current = new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()));
                [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
              }
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              const domEl = (e.nativeEvent?.target as HTMLElement) || document.body;
              try {
                domEl.releasePointerCapture?.(e.pointerId);
              } catch {}

              const distMoved = Math.hypot(
                e.clientX - pointerDownPos.current.x,
                e.clientY - pointerDownPos.current.y,
              );

              isDragging.current = false;
              dragOffset.current = null;

              if (distMoved < 15 && card.current) {
                const cardPos = card.current.translation();
                const spinDirection = e.point.x < cardPos.x ? 1 : -1;
                
                [fixed, j1, j2, j3, card].forEach((ref) => ref.current?.wakeUp());
                card.current.setAngvel({ x: 0, y: spinDirection * 8, z: 0 }, true);
              }
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                ref={cardMaterialRef}
                map={doctorCardTexture}
                map-anisotropy={16}
                clearcoat={0.08}
                clearcoatRoughness={0.15}
                roughness={0.35}
                metalness={0.05}
                toneMapped={false}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.2}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={new THREE.Vector2(2, 1)}
          useMap={1}
          map={lanyardTexture}
          repeat={new THREE.Vector2(-3, 1)}
          lineWidth={1.2}
        />
      </mesh>
    </>
  );
}

class ThreeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: any) {
    console.warn('[DoctorIdCard3D] WebGL/Asset load notice:', error);
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center">
            <span className="text-xs font-semibold opacity-60">
              Memuat visualisasi 3D ID Card...
            </span>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export function DoctorIdCard3D(props: {
  profile?: Partial<DoctorCardProfile>;
  theme?: 'light' | 'dark';
  className?: string;
}) {
  const profile: DoctorCardProfile = {
    name: props.profile?.name ?? 'dr. Amelia Cantika',
    role: props.profile?.role ?? 'Dokter Spesialis Anak',
    sip: props.profile?.sip ?? '503/442.1/SIP-D/2026',
    hospital: 'RS AMANAH SEHAT',
    avatarUrl: props.profile?.avatarUrl ?? getAssetUrl('assets/images/doctors/woman-doctor-4.png'),
  };

  return (
    <ThreeErrorBoundary>
      <div className="relative w-full h-full select-none cursor-grab active:cursor-grabbing" data-interactive="true">
        <Canvas
          dpr={[2, 3.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          camera={{ position: [0, 0.05, 11.8], fov: 27.5 }}
          style={{ backgroundColor: 'transparent' }}
        >
          <ambientLight intensity={1.8} />
          <directionalLight position={[0, 6, 8]} intensity={1.2} />
          <directionalLight position={[-6, -3, 4]} intensity={0.6} />
          <Physics
            debug={false}
            interpolate
            gravity={[0, -40, 0]}
            timeStep={1 / 60}
          >
            <BandMesh profile={profile} theme={props.theme} />
          </Physics>
          <Environment blur={0.8}>
            <Lightformer intensity={2} color="white" position={[-5, 4, 3]} rotation={[0, Math.PI / 4, 0]} scale={[20, 2, 1]} />
            <Lightformer intensity={2} color="white" position={[5, 4, 3]} rotation={[0, -Math.PI / 4, 0]} scale={[20, 2, 1]} />
            <Lightformer intensity={1.5} color="white" position={[0, -5, 2]} rotation={[Math.PI / 4, 0, 0]} scale={[20, 2, 1]} />
          </Environment>
        </Canvas>
      </div>
    </ThreeErrorBoundary>
  );
}
