import { StationerySettings, StationeryType } from '../types/studio';
import { mmToPixels } from './paperGeometry';
import { PageItem } from '../types/document';
import { storageService } from './storage';

/**
 * Generates high-res stationery canvases for one-click printing
 */
export function generateStationeryPage(
  settings: StationerySettings,
  paperWidthMm: number,
  paperHeightMm: number
): PageItem {
  const canvas = document.createElement('canvas');
  // 150 DPI for crisp line rendering
  canvas.width = Math.round(mmToPixels(paperWidthMm, 150));
  canvas.height = Math.round(mmToPixels(paperHeightMm, 150));
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const stepPx = mmToPixels(settings.gridSpacingMm || 5, 150);
  const marginPx = mmToPixels(15, 150);

  switch (settings.type) {
    case 'graph':
      drawGraphGrid(ctx, canvas.width, canvas.height, stepPx, settings.lineColor || '#94a3b8');
      break;
    case 'isometric':
      drawIsometricGrid(ctx, canvas.width, canvas.height, stepPx, settings.lineColor || '#94a3b8');
      break;
    case 'dot':
      drawDotGrid(ctx, canvas.width, canvas.height, stepPx, settings.lineColor || '#64748b');
      break;
    case 'millimeter':
      drawMillimeterGrid(ctx, canvas.width, canvas.height, settings.lineColor || '#f97316');
      break;
    case 'ruled':
      drawRuledPaper(ctx, canvas.width, canvas.height, stepPx, marginPx, settings.lineColor || '#93c5fd', settings.accentColor || '#ef4444');
      break;
    case 'music':
      drawMusicStaves(ctx, canvas.width, canvas.height, marginPx, settings.lineColor || '#0f172a');
      break;
    case 'planner':
      drawWeeklyPlanner(ctx, canvas.width, canvas.height, marginPx, settings.lineColor || '#334155');
      break;
    case 'calendar':
      drawMonthlyCalendar(ctx, canvas.width, canvas.height, marginPx, settings.lineColor || '#1e293b');
      break;
    default:
      break;
  }

  const previewUrl = canvas.toDataURL('image/png');
  storageService.registerEphemeralBlob(previewUrl);

  return {
    id: `stationery-${settings.type}-${Date.now()}`,
    pageNumber: 1,
    sourceFileName: `${settings.type.toUpperCase()} Template`,
    sourceFileType: 'Stationery',
    widthPt: (paperWidthMm / 25.4) * 72,
    heightPt: (paperHeightMm / 25.4) * 72,
    rotation: 0,
    canvasPreviewUrl: previewUrl
  };
}

function drawGraphGrid(ctx: CanvasRenderingContext2D, w: number, h: number, step: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;

  for (let x = 0; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

function drawIsometricGrid(ctx: CanvasRenderingContext2D, w: number, h: number, step: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  const sin60 = Math.sin(Math.PI / 3);
  const cos60 = Math.cos(Math.PI / 3);
  const rowH = step * sin60;

  for (let y = 0; y < h; y += rowH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Slanted lines +60 and -60 deg
  for (let x = -h; x < w + h; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + h * cos60, h);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - h * cos60, h);
    ctx.stroke();
  }
}

function drawDotGrid(ctx: CanvasRenderingContext2D, w: number, h: number, step: number, color: string) {
  ctx.fillStyle = color;
  for (let x = step; x < w; x += step) {
    for (let y = step; y < h; y += step) {
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawMillimeterGrid(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const mmPx = mmToPixels(1, 150);
  const cmPx = mmToPixels(10, 150);

  // 1mm light lines
  ctx.strokeStyle = '#ffedd5';
  ctx.lineWidth = 0.3;
  for (let x = 0; x < w; x += mmPx) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += mmPx) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // 10mm accent lines
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.9;
  for (let x = 0; x < w; x += cmPx) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += cmPx) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

function drawRuledPaper(ctx: CanvasRenderingContext2D, w: number, h: number, step: number, marginPx: number, lineCol: string, marginCol: string) {
  // Horizontal lines
  ctx.strokeStyle = lineCol;
  ctx.lineWidth = 1;
  const startY = marginPx * 1.5;
  for (let y = startY; y < h - marginPx; y += step * 1.6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Vertical red margin rule
  ctx.strokeStyle = marginCol;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(marginPx * 1.5, 0);
  ctx.lineTo(marginPx * 1.5, h);
  ctx.stroke();
}

function drawMusicStaves(ctx: CanvasRenderingContext2D, w: number, h: number, marginPx: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  const staffGap = 8;
  const systemGap = 70;
  const leftX = marginPx;
  const rightX = w - marginPx;

  let y = marginPx * 1.5;
  while (y + staffGap * 4 < h - marginPx) {
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(leftX, y + i * staffGap);
      ctx.lineTo(rightX, y + i * staffGap);
      ctx.stroke();
    }
    // Bar lines on ends
    ctx.beginPath();
    ctx.moveTo(leftX, y);
    ctx.lineTo(leftX, y + staffGap * 4);
    ctx.moveTo(rightX, y);
    ctx.lineTo(rightX, y + staffGap * 4);
    ctx.stroke();

    y += staffGap * 4 + systemGap;
  }
}

function drawWeeklyPlanner(ctx: CanvasRenderingContext2D, w: number, h: number, marginPx: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 28px -apple-system, sans-serif';
  ctx.fillText('WEEKLY PLANNER', marginPx, marginPx);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday / Sunday'];
  const colW = (w - marginPx * 2) / 3;
  const rowH = (h - marginPx * 2 - 80) / 2;

  for (let i = 0; i < 6; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = marginPx + col * colW;
    const y = marginPx + 60 + row * rowH;

    ctx.strokeRect(x, y, colW - 10, rowH - 10);
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 16px -apple-system, sans-serif';
    ctx.fillText(days[i], x + 12, y + 28);
  }
}

function drawMonthlyCalendar(ctx: CanvasRenderingContext2D, w: number, h: number, marginPx: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 28px -apple-system, sans-serif';
  ctx.fillText('MONTHLY OVERVIEW', marginPx, marginPx);

  const cols = 7;
  const rows = 5;
  const cellW = (w - marginPx * 2) / cols;
  const cellH = (h - marginPx * 2 - 80) / rows;
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  for (let c = 0; c < cols; c++) {
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(dayNames[c], marginPx + c * cellW + 10, marginPx + 50);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = marginPx + c * cellW;
      const y = marginPx + 65 + r * cellH;
      ctx.strokeRect(x, y, cellW, cellH);
    }
  }
}
