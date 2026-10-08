import { MM_TO_PT, INCH_TO_MM } from '../constants/paperSizes';
import { PhysicalMargins } from '../types/document';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function mmToPoints(mm: number): number {
  return mm * MM_TO_PT;
}

export function pointsToMm(pt: number): number {
  return pt / MM_TO_PT;
}

export function inchesToPoints(inches: number): number {
  return inches * 72;
}

export function mmToPixels(mm: number, dpi: number = 96): number {
  return (mm / INCH_TO_MM) * dpi;
}

export function pixelsToMm(px: number, dpi: number = 96): number {
  return (px / dpi) * INCH_TO_MM;
}

export function getPrintableArea(
  paperWidthMm: number,
  paperHeightMm: number,
  margins: PhysicalMargins
): BoundingBox {
  const left = margins.left;
  const top = margins.top;
  const width = Math.max(0, paperWidthMm - margins.left - margins.right);
  const height = Math.max(0, paperHeightMm - margins.top - margins.bottom);

  return { x: left, y: top, width, height };
}

export function snapValue(val: number, snapGridStep: number, threshold: number = 2): number {
  const nearest = Math.round(val / snapGridStep) * snapGridStep;
  if (Math.abs(val - nearest) <= threshold) {
    return nearest;
  }
  return val;
}

export function drawRuler(
  ctx: CanvasRenderingContext2D,
  orientation: 'horizontal' | 'vertical',
  lengthMm: number,
  scale: number,
  offsetPx: number,
  unit: 'mm' | 'in' = 'mm'
) {
  ctx.save();
  ctx.strokeStyle = '#4a4a58';
  ctx.fillStyle = '#9ca3af';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.lineWidth = 1;

  const totalLengthPx = mmToPixels(lengthMm) * scale;

  if (orientation === 'horizontal') {
    ctx.beginPath();
    ctx.moveTo(offsetPx, 19.5);
    ctx.lineTo(offsetPx + totalLengthPx, 19.5);
    ctx.stroke();

    const stepMm = unit === 'mm' ? 10 : 25.4; // 1cm or 1inch
    const subStepMm = unit === 'mm' ? 2 : 6.35; // 2mm or 1/4 inch

    for (let mm = 0; mm <= lengthMm; mm += subStepMm) {
      const isMajor = Math.abs(mm % stepMm) < 0.1;
      const x = offsetPx + mmToPixels(mm) * scale;
      const tickH = isMajor ? 12 : 5;

      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, 20 - tickH);
      ctx.stroke();

      if (isMajor && mm > 0 && mm < lengthMm) {
        const label = unit === 'mm' ? `${Math.round(mm)}` : `${(mm / 25.4).toFixed(0)}"`;
        ctx.fillText(label, x + 2, 10);
      }
    }
  } else {
    ctx.beginPath();
    ctx.moveTo(19.5, offsetPx);
    ctx.lineTo(19.5, offsetPx + totalLengthPx);
    ctx.stroke();

    const stepMm = unit === 'mm' ? 10 : 25.4;
    const subStepMm = unit === 'mm' ? 2 : 6.35;

    for (let mm = 0; mm <= lengthMm; mm += subStepMm) {
      const isMajor = Math.abs(mm % stepMm) < 0.1;
      const y = offsetPx + mmToPixels(mm) * scale;
      const tickW = isMajor ? 12 : 5;

      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(20 - tickW, y);
      ctx.stroke();

      if (isMajor && mm > 0 && mm < lengthMm) {
        const label = unit === 'mm' ? `${Math.round(mm)}` : `${(mm / 25.4).toFixed(0)}"`;
        ctx.save();
        ctx.translate(10, y - 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(label, 0, 0);
        ctx.restore();
      }
    }
  }

  ctx.restore();
}
