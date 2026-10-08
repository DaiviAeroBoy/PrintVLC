import { HeaderFooterSettings, MarkupItem, RedactionBox, WatermarkSettings } from '../types/studio';

/**
 * Apply Watermark to canvas
 */
export function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: WatermarkSettings
) {
  if (!settings.enabled || (!settings.text && !settings.customImageDataUrl)) return;

  ctx.save();
  ctx.globalAlpha = Math.max(0.05, Math.min(1, settings.opacity / 100));

  if (settings.customImageDataUrl) {
    const img = new Image();
    img.src = settings.customImageDataUrl;
    if (img.complete && img.naturalWidth > 0) {
      const maxW = width * 0.6;
      const scale = maxW / img.naturalWidth;
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
    }
  } else if (settings.text) {
    ctx.translate(width / 2, height / 2);
    if (settings.isDiagonal) {
      ctx.rotate(-Math.PI / 4);
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${settings.fontSizePt * 1.5}px -apple-system, sans-serif`;
    ctx.fillStyle = settings.color || '#94a3b8';
    ctx.fillText(settings.text, 0, 0);
  }

  ctx.restore();
}

/**
 * Replace macros in header/footer templates
 */
export function resolveMacros(
  template: string,
  pageNumber: number,
  totalPages: number,
  fileName: string
): string {
  if (!template) return '';
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return template
    .replace(/\[PageNumber\]/g, String(pageNumber))
    .replace(/\[TotalPages\]/g, String(totalPages))
    .replace(/\[Filename\]/g, fileName)
    .replace(/\[CurrentDate\]/g, dateStr)
    .replace(/\[PrintTimestamp\]/g, `${dateStr} ${timeStr}`);
}

/**
 * Apply Header & Footer Stamps
 */
export function drawHeaderFooter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: HeaderFooterSettings,
  pageNumber: number,
  totalPages: number,
  fileName: string
) {
  if (!settings.enabled) return;

  ctx.save();
  ctx.fillStyle = settings.fontColor || '#475569';
  ctx.font = `${settings.fontSizePt || 10}px "JetBrains Mono", monospace`;

  const marginX = 40;
  const topY = 30;
  const bottomY = height - 25;

  // Top Left, Center, Right
  if (settings.topLeft) {
    ctx.textAlign = 'left';
    ctx.fillText(resolveMacros(settings.topLeft, pageNumber, totalPages, fileName), marginX, topY);
  }
  if (settings.topCenter) {
    ctx.textAlign = 'center';
    ctx.fillText(resolveMacros(settings.topCenter, pageNumber, totalPages, fileName), width / 2, topY);
  }
  if (settings.topRight) {
    ctx.textAlign = 'right';
    ctx.fillText(resolveMacros(settings.topRight, pageNumber, totalPages, fileName), width - marginX, topY);
  }

  // Bottom Left, Center, Right
  if (settings.bottomLeft) {
    ctx.textAlign = 'left';
    ctx.fillText(resolveMacros(settings.bottomLeft, pageNumber, totalPages, fileName), marginX, bottomY);
  }
  if (settings.bottomCenter) {
    ctx.textAlign = 'center';
    ctx.fillText(resolveMacros(settings.bottomCenter, pageNumber, totalPages, fileName), width / 2, bottomY);
  }
  if (settings.bottomRight) {
    ctx.textAlign = 'right';
    ctx.fillText(resolveMacros(settings.bottomRight, pageNumber, totalPages, fileName), width - marginX, bottomY);
  }

  ctx.restore();
}

/**
 * True Redaction Tool
 * Irreversibly zeroes out underlying pixels on export/print
 */
export function applyPermanentRedactions(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  redactions: RedactionBox[],
  pageIndex: number
) {
  const pageRedactions = redactions.filter(r => r.pageIndex === pageIndex);
  if (pageRedactions.length === 0) return;

  ctx.save();
  ctx.fillStyle = '#000000';

  for (const box of pageRedactions) {
    const rx = (box.xPct / 100) * width;
    const ry = (box.yPct / 100) * height;
    const rw = (box.widthPct / 100) * width;
    const rh = (box.heightPct / 100) * height;

    // Irreversible black box overwrite
    ctx.fillRect(rx, ry, rw, rh);
  }

  ctx.restore();
}

/**
 * Draw interactive annotations & markup
 */
export function drawMarkups(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  markups: MarkupItem[],
  pageIndex: number
) {
  const pageMarkups = markups.filter(m => m.pageIndex === pageIndex);
  if (pageMarkups.length === 0) return;

  ctx.save();

  for (const m of pageMarkups) {
    if (m.points.length < 2 && m.type !== 'note') continue;

    ctx.strokeStyle = m.color;
    ctx.fillStyle = m.color;
    ctx.lineWidth = m.type === 'highlight' ? 18 : 3;

    if (m.type === 'highlight') {
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(m.points[0].x * width, m.points[0].y * height);
      for (let i = 1; i < m.points.length; i++) {
        ctx.lineTo(m.points[i].x * width, m.points[i].y * height);
      }
      ctx.stroke();
    } else if (m.type === 'line') {
      ctx.globalAlpha = 1.0;
      ctx.beginPath();
      ctx.moveTo(m.points[0].x * width, m.points[0].y * height);
      ctx.lineTo(m.points[m.points.length - 1].x * width, m.points[m.points.length - 1].y * height);
      ctx.stroke();
    } else if (m.type === 'rectangle') {
      ctx.globalAlpha = 1.0;
      const p1 = m.points[0];
      const p2 = m.points[m.points.length - 1];
      const rx = Math.min(p1.x, p2.x) * width;
      const ry = Math.min(p1.y, p2.y) * height;
      const rw = Math.abs(p2.x - p1.x) * width;
      const rh = Math.abs(p2.y - p1.y) * height;
      ctx.strokeRect(rx, ry, rw, rh);
    } else if (m.type === 'note' && m.noteText) {
      ctx.globalAlpha = 1.0;
      const p = m.points[0];
      const px = p.x * width;
      const py = p.y * height;
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1;
      ctx.fillRect(px, py, 160, 60);
      ctx.strokeRect(px, py, 160, 60);
      ctx.fillStyle = '#713f12';
      ctx.font = '11px -apple-system, sans-serif';
      ctx.fillText(m.noteText.slice(0, 30), px + 8, py + 25);
    }
  }

  ctx.restore();
}
