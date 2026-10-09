import { PageItem, PhysicalMargins } from '../types/document';
import { 
  BorderSettings, 
  CleanupSettings, 
  CoverageCalculation, 
  DeskewSettings, 
  HeaderFooterSettings, 
  InkIntelligenceSettings, 
  RedactionBox, 
  ScaleMode, 
  WatermarkSettings 
} from '../types/studio';
import { mmToPixels } from './paperGeometry';
import { applyDocumentFilters } from './imageFilters';
import { applyInkIntelligenceFilters } from './inkIntelligence';
import { 
  applyPermanentRedactions, 
  drawHeaderFooter, 
  drawWatermark 
} from './watermarkRedaction';

export interface StudioRenderOptions {
  paperWidthMm: number;
  paperHeightMm: number;
  margins: PhysicalMargins;
  scaleMode: ScaleMode;
  scalePercent: number;
  borderSettings: BorderSettings;
  deskew: DeskewSettings;
  cleanup: CleanupSettings;
  watermark: WatermarkSettings;
  headerFooter: HeaderFooterSettings;
  inkIntel: InkIntelligenceSettings;
  redactions: RedactionBox[];
}

/**
 * Renders a single PageItem with all studio settings applied to a high-DPI HTMLCanvasElement.
 */
export async function renderStudioPageToCanvas(
  page: PageItem | undefined,
  pageIndex: number,
  totalPages: number,
  options: StudioRenderOptions,
  dpi: number = 150
): Promise<{ canvas: HTMLCanvasElement; coverage: CoverageCalculation }> {
  const {
    paperWidthMm,
    paperHeightMm,
    margins,
    scaleMode,
    scalePercent,
    borderSettings,
    deskew,
    cleanup,
    watermark,
    headerFooter,
    inkIntel,
    redactions
  } = options;

  const canvas = document.createElement('canvas');
  const canvasW = Math.round(mmToPixels(paperWidthMm, dpi));
  const canvasH = Math.round(mmToPixels(paperHeightMm, dpi));
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d')!;

  // 1. Draw Paper Sheet Background (Pure White)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Helper to load image if preview URL exists
  let sourceImg: HTMLImageElement | null = null;
  if (page?.canvasPreviewUrl) {
    sourceImg = await new Promise<HTMLImageElement | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = page.canvasPreviewUrl!;
    });
  }

  // 2. Render Page Content Image
  if (sourceImg) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sourceImg.width || canvasW;
    tempCanvas.height = sourceImg.height || canvasH;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.drawImage(sourceImg, 0, 0);

    // Apply Deskew & Document Cleanup
    const cleanedCanvas = applyDocumentFilters(tempCanvas, deskew, cleanup);

    // Calculate Scale & Positioning
    const marginPxL = mmToPixels(margins.left, dpi);
    const marginPxR = mmToPixels(margins.right, dpi);
    const marginPxT = mmToPixels(margins.top, dpi);
    const marginPxB = mmToPixels(margins.bottom, dpi);

    const printableW = Math.max(10, canvasW - marginPxL - marginPxR);
    const printableH = Math.max(10, canvasH - marginPxT - marginPxB);

    let destW = printableW;
    let destH = printableH;
    let destX = marginPxL;
    let destY = marginPxT;

    if (scaleMode === 'fit') {
      const imgAspect = cleanedCanvas.width / cleanedCanvas.height;
      const targetAspect = printableW / printableH;
      if (imgAspect > targetAspect) {
        destW = printableW;
        destH = printableW / imgAspect;
        destY = marginPxT + (printableH - destH) / 2;
      } else {
        destH = printableH;
        destW = printableH * imgAspect;
        destX = marginPxL + (printableW - destW) / 2;
      }
    } else if (scaleMode === 'fill') {
      destW = canvasW;
      destH = canvasH;
      destX = 0;
      destY = 0;
    } else if (scaleMode === 'custom') {
      const factor = scalePercent / 100;
      destW = printableW * factor;
      destH = printableH * factor;
      destX = marginPxL + (printableW - destW) / 2;
      destY = marginPxT + (printableH - destH) / 2;
    }

    // Watermark: Behind Content
    if (watermark.layer === 'behind') {
      drawWatermark(ctx, canvasW, canvasH, watermark);
    }

    // Draw Content with rotation
    ctx.save();
    if (page?.rotation) {
      ctx.translate(destX + destW / 2, destY + destH / 2);
      ctx.rotate((page.rotation * Math.PI) / 180);
      ctx.drawImage(cleanedCanvas, -destW / 2, -destH / 2, destW, destH);
    } else {
      ctx.drawImage(cleanedCanvas, destX, destY, destW, destH);
    }
    ctx.restore();
  }

  // Watermark: Over Content
  if (watermark.layer === 'over') {
    drawWatermark(ctx, canvasW, canvasH, watermark);
  }

  // 3. Header & Footer Macro Stamper
  drawHeaderFooter(
    ctx, 
    canvasW, 
    canvasH, 
    headerFooter, 
    pageIndex + 1, 
    totalPages, 
    page?.sourceFileName || 'Document'
  );

  // 4. Framed Page Border
  if (borderSettings.enabled) {
    ctx.save();
    ctx.strokeStyle = borderSettings.color || '#000000';
    ctx.lineWidth = mmToPixels(borderSettings.thicknessMm, dpi);
    const bInset = mmToPixels(margins.left || 10, dpi);
    if (borderSettings.style === 'dashed') {
      ctx.setLineDash([12, 6]);
    }
    ctx.strokeRect(bInset, bInset, canvasW - bInset * 2, canvasH - bInset * 2);
    ctx.restore();
  }

  // 5. True Redactions (Overwrites pixels)
  applyPermanentRedactions(ctx, canvasW, canvasH, redactions, pageIndex);

  // 6. Ink Intelligence & CMYK Prepress
  const { canvas: prepressCanvas, coverage } = applyInkIntelligenceFilters(canvas, inkIntel);
  ctx.drawImage(prepressCanvas, 0, 0);

  return { canvas, coverage };
}

/**
 * Renders all pages in the queue into high-DPI HTMLCanvasElements sequentially or in parallel.
 */
export async function renderAllStudioPages(
  pages: PageItem[],
  options: StudioRenderOptions,
  dpi: number = 150,
  onProgress?: (current: number, total: number) => void
): Promise<HTMLCanvasElement[]> {
  const renderedCanvases: HTMLCanvasElement[] = [];

  for (let i = 0; i < pages.length; i++) {
    const { canvas } = await renderStudioPageToCanvas(
      pages[i],
      i,
      pages.length,
      options,
      dpi
    );
    renderedCanvases.push(canvas);
    if (onProgress) {
      onProgress(i + 1, pages.length);
    }
  }

  return renderedCanvases;
}
