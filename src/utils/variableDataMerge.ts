import * as XLSX from 'xlsx';
import { VariableDataRecord } from '../types/studio';

/**
 * Parse CSV / XLSX file for Variable Data Merge
 */
export async function parseVariableDataFile(file: File): Promise<VariableDataRecord[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const records = XLSX.utils.sheet_to_json<VariableDataRecord>(sheet);
  return records;
}

/**
 * Draw Code-128 Barcode on Canvas
 */
export function drawBarcode128(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number
) {
  ctx.save();
  ctx.fillStyle = '#000000';

  // Seeded pseudo barcode pattern from text
  const bars = 45;
  const barW = width / bars;
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let i = 0; i < bars; i++) {
    const isSolid = ((hash ^ (i * 997)) & 1) === 1 || i < 3 || i > bars - 4;
    if (isSolid) {
      ctx.fillRect(x + i * barW, y, barW * 0.9, height);
    }
  }

  // Draw human-readable text below
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, x + width / 2, y + height + 12);
  ctx.restore();
}

/**
 * Draw QR Code Emulator on Canvas
 */
export function drawQRCode(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number
) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = '#000000';
  ctx.strokeRect(x, y, size, size);

  ctx.fillStyle = '#000000';
  const grid = 21; // standard version 1 QR grid 21x21
  const cell = size / grid;

  // 3 Finder patterns at corners
  const drawFinder = (fx: number, fy: number) => {
    ctx.fillRect(x + fx * cell, y + fy * cell, 7 * cell, 7 * cell);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + (fx + 1) * cell, y + (fy + 1) * cell, 5 * cell, 5 * cell);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + (fx + 2) * cell, y + (fy + 2) * cell, 3 * cell, 3 * cell);
  };

  drawFinder(0, 0);
  drawFinder(grid - 7, 0);
  drawFinder(0, grid - 7);

  // Data cells populated by text hash
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }

  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const inFinder1 = r < 8 && c < 8;
      const inFinder2 = r < 8 && c >= grid - 8;
      const inFinder3 = r >= grid - 8 && c < 8;
      if (!inFinder1 && !inFinder2 && !inFinder3) {
        if (((hash ^ (r * 31 + c * 17)) & 3) === 0) {
          ctx.fillRect(x + c * cell, y + r * cell, cell, cell);
        }
      }
    }
  }

  ctx.restore();
}

/**
 * Interpolate dynamic fields like {{Name}}, {{ID}} into template
 */
export function mergeTemplateTags(template: string, record: VariableDataRecord): string {
  let result = template;
  for (const [key, value] of Object.entries(record)) {
    const regex = new RegExp(`{{${key}}}`, 'gi');
    result = result.replace(regex, value);
  }
  return result;
}
