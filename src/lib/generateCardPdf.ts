import type { DoctorCardProfile } from '@/components/atoms/DoctorIdCard3D';

/**
 * Draws Bauhaus geometric shapes
 */
function drawBauhausShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  type: number,
  primaryColor: string,
  secondaryColor?: string,
) {
  ctx.save();
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

/**
 * Draws linear 1D barcode on canvas (Always pure white background, black bars, zero stroke)
 */
function drawLinearBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  barcodeValue: string,
) {
  ctx.save();
  // Container box: Always clean pure white, NO stroke
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(x - 24, y - 20, width + 48, height + 70, 20);
  ctx.fill();

  // Dark black bars
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
  ctx.font = 'bold 30px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(barcodeValue, x + width / 2, y + height + 36);

  ctx.restore();
}

/**
 * Builds a pure PDF 1.4 Landscape binary blob from a JPEG image
 */
function createLandscapePdfBlob(
  jpegBytes: Uint8Array,
  imgWidth: number,
  imgHeight: number,
  pageWidth: number = 842, // A4 Landscape width in pt
  pageHeight: number = 595, // A4 Landscape height in pt
): Blob {
  const imgAspect = imgWidth / imgHeight;
  let drawW = pageWidth - 48;
  let drawH = drawW / imgAspect;
  if (drawH > pageHeight - 48) {
    drawH = pageHeight - 48;
    drawW = drawH * imgAspect;
  }
  const drawX = (pageWidth - drawW) / 2;
  const drawY = (pageHeight - drawH) / 2;

  const contentStream = `q ${drawW.toFixed(2)} 0 0 ${drawH.toFixed(2)} ${drawX.toFixed(2)} ${drawY.toFixed(2)} cm /Im1 Do Q`;

  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];

  const header = enc.encode('%PDF-1.4\n%âãÏÓ\n');
  parts.push(header);

  const offsets: number[] = [0];
  let currentOffset = header.length;

  function addObject(content: Uint8Array | string) {
    const bytes = typeof content === 'string' ? enc.encode(content) : content;
    offsets.push(currentOffset);
    parts.push(bytes);
    currentOffset += bytes.length;
  }

  // 1. Catalog
  addObject('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // 2. Pages
  addObject('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

  // 3. Page (Landscape A4)
  addObject(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);

  // 4. Image Stream
  const imgHeader = enc.encode(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgWidth} /Height ${imgHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`,
  );
  const imgFooter = enc.encode('\nendstream\nendobj\n');
  const imgTotal = new Uint8Array(imgHeader.length + jpegBytes.length + imgFooter.length);
  imgTotal.set(imgHeader, 0);
  imgTotal.set(jpegBytes, imgHeader.length);
  imgTotal.set(imgFooter, imgHeader.length + jpegBytes.length);
  addObject(imgTotal);

  // 5. Content Stream
  const csHeader = enc.encode(`5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`);
  addObject(csHeader);

  // XRef
  const startXref = currentOffset;
  let xref = `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) {
    xref += `${offsets[i]!.toString().padStart(10, '0')} 00000 n \n`;
  }
  xref += `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;
  parts.push(enc.encode(xref));

  return new Blob(parts as any, { type: 'application/pdf' });
}

/**
 * Generates and triggers download of the 1:1 ID Card in Landscape PDF format
 */
export async function downloadDoctorIdCardPdf(
  profile: DoctorCardProfile,
  theme: 'light' | 'dark' = 'light',
): Promise<void> {
  const isDark = theme === 'dark';

  // High-Resolution 3508 x 2480 Canvas (A4 300 DPI Landscape Sheet)
  const canvas = document.createElement('canvas');
  canvas.width = 3508;
  canvas.height = 2480;
  const ctx = canvas.getContext('2d')!;

  const fontSans = '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  // 1. Clean Background Sheet with subtle branding
  ctx.fillStyle = isDark ? '#040b13' : '#f8faff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Sheet Header
  (ctx as any).letterSpacing = '-1px';
  ctx.fillStyle = isDark ? '#67e8f9' : '#0d66e9';
  ctx.font = `bold 56px ${fontSans}`;
  ctx.textAlign = 'left';
  ctx.fillText('RS AMANAH SEHAT', 180, 160);

  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.font = `600 36px ${fontSans}`;
  ctx.fillText('HEALTHCARE IDENTITY VERIFICATION — DOKUMEN RESMI IDENTITAS MEDIS', 180, 220);

  ctx.textAlign = 'right';
  ctx.font = 'bold 36px monospace';
  ctx.fillText(`SIP: ${profile.sip}`, canvas.width - 180, 160);
  ctx.font = `500 30px ${fontSans}`;
  ctx.fillText(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), canvas.width - 180, 210);

  // Divider
  ctx.strokeStyle = isDark ? 'rgba(0, 212, 255, 0.25)' : 'rgba(10, 68, 255, 0.15)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(180, 260);
  ctx.lineTo(canvas.width - 180, 260);
  ctx.stroke();

  // Load avatar image
  const avatarImg: HTMLImageElement = await new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = profile.avatarUrl;
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);
  });

  // Card dimensions on Sheet (Standard 1:1 portrait cards placed side-by-side)
  const cardW = 1400;
  const cardH = 2000;
  const cardY = 340;
  const frontX = 260;
  const backX = canvas.width - cardW - 260;

  // Function to render a single card side
  const renderCardSide = (startX: number, isBack: boolean) => {
    ctx.save();
    // Card Shadow & Container
    ctx.shadowColor = isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(10, 68, 255, 0.08)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 16;
    ctx.fillStyle = isDark ? '#08141e' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(startX, cardY, cardW, cardH, 44);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(startX, cardY, cardW, cardH, 44);
    ctx.clip();

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
    const activePalette = isDark ? darkPalette : lightPalette;

    if (!isBack) {
      // FRONT FACE
      // Logo
      ctx.fillStyle = isDark ? '#a3e635' : '#00d4ff';
      ctx.beginPath();
      ctx.roundRect(startX + 100, cardY + 100, 52, 52, 14);
      ctx.fill();
      ctx.fillStyle = isDark ? '#00d4ff' : '#0d66e9';
      ctx.fillRect(startX + 118, cardY + 112, 16, 28);
      ctx.fillRect(startX + 112, cardY + 118, 28, 16);

      (ctx as any).letterSpacing = '-2px';
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.font = `bold 54px ${fontSans}`;
      ctx.textAlign = 'left';
      ctx.fillText('Amanah', startX + 170, cardY + 142);

      // Grid
      const gridCols = 4;
      const gridRows = 4;
      const gap = 12;
      const bW = (cardW - 200 - (gridCols - 1) * gap) / gridCols;
      const bH = (1200 - (gridRows - 1) * gap) / gridRows;

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const bx = startX + 100 + c * (bW + gap);
          const by = cardY + 200 + r * (bH + gap);
          const pair = activePalette[(r * gridCols + c) % activePalette.length]!;
          drawBauhausShape(ctx, bx, by, bW, bH, (r * 3 + c * 2) % 6, pair.fg, pair.bg);
        }
      }

      // Avatar
      if (avatarImg && avatarImg.complete && avatarImg.naturalWidth > 0) {
        ctx.save();
        const bottomPanelY = cardY + 1480;
        const imgAspect = avatarImg.naturalWidth / avatarImg.naturalHeight;
        const drawH = 1450;
        const drawW = drawH * imgAspect;
        const drawX = startX + cardW / 2 - drawW / 2;
        const drawY = bottomPanelY - drawH + 180;
        ctx.drawImage(avatarImg, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      // Bottom Container
      const bottomY = cardY + 1480;
      ctx.fillStyle = isDark ? '#0c1b29' : '#ffffff';
      ctx.fillRect(startX, bottomY, cardW, cardH - 1480);

      ctx.strokeStyle = isDark ? 'rgba(0, 212, 255, 0.25)' : 'rgba(10, 68, 255, 0.15)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX + 100, bottomY);
      ctx.lineTo(startX + cardW - 100, bottomY);
      ctx.stroke();

      (ctx as any).letterSpacing = '-3px';
      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.font = `bold 72px ${fontSans}`;
      ctx.fillText(profile.name, startX + 100, bottomY + 120);

      (ctx as any).letterSpacing = '-1px';
      ctx.fillStyle = '#64748b';
      ctx.font = `600 40px ${fontSans}`;
      ctx.fillText(profile.role, startX + 100, bottomY + 195);

      (ctx as any).letterSpacing = '-1px';
      ctx.fillStyle = '#94a3b8';
      ctx.font = `bold 28px ${fontSans}`;
      ctx.textAlign = 'right';
      ctx.fillText('NOMOR SIP / ID', startX + cardW - 100, bottomY + 105);

      ctx.fillStyle = '#64748b';
      ctx.font = `bold 36px "Plus Jakarta Sans", monospace`;
      ctx.fillText(profile.sip, startX + cardW - 100, bottomY + 165);

      ctx.fillStyle = isDark ? '#2dd4bf' : '#0d66e9';
      ctx.font = `700 32px ${fontSans}`;
      ctx.fillText('RS AMANAH SEHAT', startX + cardW - 100, bottomY + 225);
    } else {
      // BACK FACE
      const gridCols = 4;
      const gridRows = 4;
      const gap = 12;
      const bW = (cardW - 200 - (gridCols - 1) * gap) / gridCols;
      const bH = (1200 - (gridRows - 1) * gap) / gridRows;

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const bx = startX + 100 + c * (bW + gap);
          const by = cardY + 100 + r * (bH + gap);
          const pair = activePalette[(r * gridCols + c) % activePalette.length]!;
          drawBauhausShape(ctx, bx, by, bW, bH, (r * 3 + c * 2) % 6, pair.fg, pair.bg);
        }
      }

      // Barcode
      drawLinearBarcode(
        ctx,
        startX + 150,
        cardY + 1400,
        cardW - 300,
        120,
        `*DOC-${profile.sip.replace(/[^a-zA-Z0-9]/g, '') || '50344212026'}*`,
      );

      // Back Branding
      const backCenterX = startX + cardW / 2;
      ctx.fillStyle = isDark ? '#a3e635' : '#00d4ff';
      ctx.beginPath();
      ctx.roundRect(backCenterX - 140, cardY + 1720, 56, 56, 16);
      ctx.fill();
      ctx.fillStyle = isDark ? '#00d4ff' : '#0d66e9';
      ctx.fillRect(backCenterX - 124, cardY + 1734, 24, 28);
      ctx.fillRect(backCenterX - 130, cardY + 1738, 36, 20);

      (ctx as any).letterSpacing = '-2px';
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.font = `bold 64px ${fontSans}`;
      ctx.textAlign = 'left';
      ctx.fillText('Amanah', backCenterX - 60, cardY + 1768);

      (ctx as any).letterSpacing = '-1px';
      ctx.fillStyle = '#94a3b8';
      ctx.font = `700 28px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.fillText('HEALTHCARE IDENTITY SYSTEM', backCenterX, cardY + 1840);
    }
    ctx.restore();
  };

  // Render both Front and Back sides
  renderCardSide(frontX, false);
  renderCardSide(backX, true);

  // Labels underneath the cards
  (ctx as any).letterSpacing = '-1px';
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.font = `bold 36px ${fontSans}`;
  ctx.textAlign = 'center';
  ctx.fillText('SISI DEPAN (FRONT)', frontX + cardW / 2, cardY + cardH + 70);
  ctx.fillText('SISI BELAKANG (BACK)', backX + cardW / 2, cardY + cardH + 70);

  // Convert to JPEG Uint8Array
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const base64 = dataUrl.split(',')[1]!;
  const binaryString = atob(base64);
  const jpegBytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    jpegBytes[i] = binaryString.charCodeAt(i);
  }

  // Create standard A4 Landscape PDF Blob
  const pdfBlob = createLandscapePdfBlob(jpegBytes, canvas.width, canvas.height);
  const blobUrl = URL.createObjectURL(pdfBlob);

  // Trigger download
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = `ID-Card-${profile.name.replace(/[^a-zA-Z0-9]/g, '_')}-Landscape.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
}
