import { CleanupSettings, DeskewSettings } from '../types/studio';

/**
 * Applies all geometric, deskew, and restoration filters to a canvas
 */
export function applyDocumentFilters(
  sourceCanvas: HTMLCanvasElement,
  deskew: DeskewSettings,
  cleanup: CleanupSettings
): HTMLCanvasElement {
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = sourceCanvas.width;
  outputCanvas.height = sourceCanvas.height;
  const ctx = outputCanvas.getContext('2d')!;

  // 1. Perspective Warp or Rotation
  const totalAngleDeg = (deskew.manualAngle || 0) + (deskew.autoDeskewAngle || 0);

  ctx.save();
  if (totalAngleDeg !== 0) {
    ctx.translate(outputCanvas.width / 2, outputCanvas.height / 2);
    ctx.rotate((totalAngleDeg * Math.PI) / 180);
    ctx.drawImage(sourceCanvas, -sourceCanvas.width / 2, -sourceCanvas.height / 2);
  } else {
    ctx.drawImage(sourceCanvas, 0, 0);
  }
  ctx.restore();

  // 2. Pixel-level Manipulation Filters
  const imgData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
  const data = imgData.data;
  const width = outputCanvas.width;
  const height = outputCanvas.height;

  // Detect predominant paper background color (sample corners)
  const bgR = (data[0] + data[(width - 1) * 4] + data[(height - 1) * width * 4]) / 3 || 255;
  const bgG = (data[1] + data[(width - 1) * 4 + 1] + data[(height - 1) * width * 4 + 1]) / 3 || 255;
  const bgB = (data[2] + data[(width - 1) * 4 + 2] + data[(height - 1) * width * 4 + 2]) / 3 || 255;

  const whiteThreshold = 255 - (cleanup.normalizePaperWhiteThreshold * 1.2);
  const ghostThreshold = 200 - (cleanup.suppressGhostTextThreshold * 0.8);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114);

      // A. Normalize Yellowed / Grayed Scanned Background to Pure #FFFFFF
      if (cleanup.normalizePaperWhiteThreshold > 0 && brightness > whiteThreshold) {
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        continue;
      }

      // B. Reverse-side Ghost Text Suppression (Bleed-through suppression)
      // Ghost text is faint gray/brownish with brightness between ghostThreshold and 240
      if (cleanup.suppressGhostTextThreshold > 0 && brightness > ghostThreshold && brightness < 245) {
        // Suppress faint reverse-side shadows into background
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        continue;
      }

      // C. Hole-punch & Staple mark removal (detect dark spots near margins)
      if (cleanup.removeHolePunches || cleanup.removeStaples) {
        const isMarginZone = (x < width * 0.08 || x > width * 0.92 || y < height * 0.08 || y > height * 0.92);
        if (isMarginZone && brightness < 60) {
          // If within margin and very dark, replace with paper white
          data[idx] = 255;
          data[idx + 1] = 255;
          data[idx + 2] = 255;
          continue;
        }
      }

      // D. Thumb Holding Marks & Book Spine Gutter Shadow Eraser
      if (cleanup.removeThumbMarks || cleanup.removeSpineGutterShadows) {
        // Gutter shadow is typically a gradient darkness along left/right edge or center
        const isGutterZone = x < width * 0.05 || (x > width * 0.48 && x < width * 0.52);
        if (isGutterZone && brightness > 80 && brightness < 210) {
          // Flatten spine shadow to white
          data[idx] = 255;
          data[idx + 1] = 255;
          data[idx + 2] = 255;
          continue;
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // 3. Auto-crop dark scanner lid borders if requested
  if (deskew.autoCropEnabled) {
    const croppedCanvas = document.createElement('canvas');
    const insetX = Math.floor(width * 0.02);
    const insetY = Math.floor(height * 0.02);
    croppedCanvas.width = width - insetX * 2;
    croppedCanvas.height = height - insetY * 2;
    const cropCtx = croppedCanvas.getContext('2d')!;
    cropCtx.drawImage(outputCanvas, insetX, insetY, croppedCanvas.width, croppedCanvas.height, 0, 0, croppedCanvas.width, croppedCanvas.height);
    return croppedCanvas;
  }

  return outputCanvas;
}

/**
 * Fast Auto-Deskew angle estimator
 * Calculates the dominant skew angle using edge baseline sampling
 */
export function estimateDeskewAngle(canvas: HTMLCanvasElement): number {
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;

  const w = Math.min(canvas.width, 400);
  const h = Math.min(canvas.height, 500);

  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = w;
  thumbCanvas.height = h;
  const thumbCtx = thumbCanvas.getContext('2d')!;
  thumbCtx.drawImage(canvas, 0, 0, w, h);

  const imgData = thumbCtx.getImageData(0, 0, w, h);
  const d = imgData.data;

  // Sample horizontal gradient differences across slight angle steps
  let bestScore = 0;
  let detectedAngle = 0;

  for (let angle = -8; angle <= 8; angle += 0.5) {
    const rad = (angle * Math.PI) / 180;
    const sin = Math.sin(rad);
    let variance = 0;

    for (let y = 50; y < h - 50; y += 4) {
      let rowSum = 0;
      for (let x = 50; x < w - 50; x += 4) {
        const sampleY = Math.round(y + (x - w / 2) * sin);
        if (sampleY >= 0 && sampleY < h) {
          const idx = (sampleY * w + x) * 4;
          const lum = d[idx] * 0.299 + d[idx + 1] * 0.587 + d[idx + 2] * 0.114;
          rowSum += (255 - lum);
        }
      }
      variance += rowSum * rowSum;
    }

    if (variance > bestScore) {
      bestScore = variance;
      detectedAngle = angle;
    }
  }

  return detectedAngle;
}
