import React, { useRef, useEffect, useState } from 'react';
import { PageItem, PhysicalMargins } from '../../types/document';
import { 
  BorderSettings, 
  CleanupSettings, 
  CoverageCalculation, 
  DeskewSettings, 
  HeaderFooterSettings, 
  ImpositionSettings, 
  InkIntelligenceSettings, 
  RedactionBox, 
  ScaleMode, 
  WatermarkSettings 
} from '../../types/studio';
import { drawRuler, mmToPixels } from '../../utils/paperGeometry';
import { applyDocumentFilters } from '../../utils/imageFilters';
import { applyInkIntelligenceFilters } from '../../utils/inkIntelligence';
import { 
  applyPermanentRedactions, 
  drawHeaderFooter, 
  drawWatermark 
} from '../../utils/watermarkRedaction';

interface StudioCanvasProps {
  activePage?: PageItem;
  pageIndex: number;
  totalPages: number;
  paperWidthMm: number;
  paperHeightMm: number;
  margins: PhysicalMargins;
  scaleMode: ScaleMode;
  scalePercent: number;
  borderSettings: BorderSettings;
  imposition: ImpositionSettings;
  deskew: DeskewSettings;
  cleanup: CleanupSettings;
  watermark: WatermarkSettings;
  headerFooter: HeaderFooterSettings;
  inkIntel: InkIntelligenceSettings;
  redactions: RedactionBox[];
  onAddRedaction: (box: RedactionBox) => void;
  activeTool: 'select' | 'redact' | 'highlight' | 'rectangle';
  zoomLevel: number;
  isPreviewMode: boolean;
  onCoverageCalculated: (coverage: CoverageCalculation) => void;
  onCanvasRendered: (canvas: HTMLCanvasElement) => void;
}

export const StudioCanvas: React.FC<StudioCanvasProps> = ({
  activePage,
  pageIndex,
  totalPages,
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
  redactions,
  onAddRedaction,
  activeTool,
  zoomLevel,
  isPreviewMode,
  onCoverageCalculated,
  onCanvasRendered,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topRulerRef = useRef<HTMLCanvasElement>(null);
  const leftRulerRef = useRef<HTMLCanvasElement>(null);

  // Redaction drawing interaction state
  const [isDrawingRedaction, setIsDrawingRedaction] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentDragBox, setCurrentDragBox] = useState<{ xPct: number; yPct: number; widthPct: number; heightPct: number } | null>(null);

  // Render Rulers
  useEffect(() => {
    const scale = zoomLevel / 100;
    if (topRulerRef.current) {
      const topCtx = topRulerRef.current.getContext('2d');
      if (topCtx) {
        topCtx.clearRect(0, 0, topRulerRef.current.width, topRulerRef.current.height);
        drawRuler(topCtx, 'horizontal', paperWidthMm, scale, 0, 'mm');
      }
    }
    if (leftRulerRef.current) {
      const leftCtx = leftRulerRef.current.getContext('2d');
      if (leftCtx) {
        leftCtx.clearRect(0, 0, leftRulerRef.current.width, leftRulerRef.current.height);
        drawRuler(leftCtx, 'vertical', paperHeightMm, scale, 0, 'mm');
      }
    }
  }, [paperWidthMm, paperHeightMm, zoomLevel]);

  // Main High-DPI Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Render at crisp 150 DPI for WYSIWYG accuracy
    const dpi = 150;
    const canvasW = Math.round(mmToPixels(paperWidthMm, dpi));
    const canvasH = Math.round(mmToPixels(paperHeightMm, dpi));
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d')!;

    // 1. Draw Paper Sheet Background (Pure White)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // 2. Render Page Content Image
    const renderContent = (img?: HTMLImageElement | HTMLCanvasElement) => {
      if (img) {
        // Create an intermediate buffer to apply geometry & restoration filters
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width || canvasW;
        tempCanvas.height = img.height || canvasH;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.drawImage(img, 0, 0);

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

        // Draw Content
        ctx.save();
        if (activePage?.rotation) {
          ctx.translate(destX + destW / 2, destY + destH / 2);
          ctx.rotate((activePage.rotation * Math.PI) / 180);
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
      drawHeaderFooter(ctx, canvasW, canvasH, headerFooter, pageIndex + 1, totalPages, activePage?.sourceFileName || 'Document');

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
      onCoverageCalculated(coverage);
      onCanvasRendered(canvas);
    };

    if (activePage?.canvasPreviewUrl) {
      const img = new Image();
      img.onload = () => renderContent(img);
      img.src = activePage.canvasPreviewUrl;
    } else {
      renderContent();
    }
  }, [
    activePage,
    pageIndex,
    totalPages,
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
  ]);

  // Handle Mouse Redaction Box Drawing
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== 'redact') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawingRedaction(true);
    setDrawStart({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawingRedaction || !drawStart || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const xPct = (Math.min(drawStart.x, currentX) / rect.width) * 100;
    const yPct = (Math.min(drawStart.y, currentY) / rect.height) * 100;
    const widthPct = (Math.abs(currentX - drawStart.x) / rect.width) * 100;
    const heightPct = (Math.abs(currentY - drawStart.y) / rect.height) * 100;

    setCurrentDragBox({ xPct, yPct, widthPct, heightPct });
  };

  const handleMouseUp = () => {
    if (isDrawingRedaction && currentDragBox && currentDragBox.widthPct > 1 && currentDragBox.heightPct > 1) {
      onAddRedaction({
        id: `redact-${Date.now()}`,
        pageIndex,
        ...currentDragBox
      });
    }
    setIsDrawingRedaction(false);
    setDrawStart(null);
    setCurrentDragBox(null);
  };

  const scale = zoomLevel / 100;
  const displayW = mmToPixels(paperWidthMm, 96) * scale;
  const displayH = mmToPixels(paperHeightMm, 96) * scale;

  // Margin overlays in CSS percentages
  const marginXPct = (margins.left / paperWidthMm) * 100;
  const marginYPct = (margins.top / paperHeightMm) * 100;
  const marginWPct = ((paperWidthMm - margins.left - margins.right) / paperWidthMm) * 100;
  const marginHPct = ((paperHeightMm - margins.top - margins.bottom) / paperHeightMm) * 100;

  return (
    <div 
      ref={containerRef}
      className="relative flex-1 overflow-auto bg-[#121214] canvas-grid-pattern flex flex-col items-center justify-start p-8 select-none"
    >
      {/* Horizontal Top Ruler */}
      {!isPreviewMode && (
        <div className="sticky top-0 z-20 flex w-full justify-center mb-2 pointer-events-none">
          <canvas
            ref={topRulerRef}
            width={displayW}
            height={20}
            className="bg-[#181820]/90 border-b border-[#2d2d3a] shadow-sm backdrop-blur"
          />
        </div>
      )}

      {/* Main Canvas Paper Container with Shadow and Hardware Margins */}
      <div className="relative flex justify-center">
        {/* Vertical Left Ruler */}
        {!isPreviewMode && (
          <div className="sticky left-0 z-20 mr-2 pointer-events-none">
            <canvas
              ref={leftRulerRef}
              width={20}
              height={displayH}
              className="bg-[#181820]/90 border-r border-[#2d2d3a] shadow-sm backdrop-blur"
            />
          </div>
        )}

        {/* Paper Surface */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ width: displayW, height: displayH }}
          className={`relative bg-white shadow-2xl transition-shadow ${
            activeTool === 'redact' ? 'cursor-crosshair' : 'cursor-default'
          }`}
        >
          {/* Main High-DPI Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain pointer-events-none"
          />

          {/* Red Dashed Non-Printable Hardware Margin Boundary Overlay */}
          {!isPreviewMode && (
            <div
              style={{
                left: `${marginXPct}%`,
                top: `${marginYPct}%`,
                width: `${marginWPct}%`,
                height: `${marginHPct}%`,
              }}
              className="absolute pointer-events-none border border-dashed border-red-500/60 transition-all"
            >
              <span className="absolute -top-3.5 left-1 text-[9px] font-mono text-red-500 bg-black/60 px-1 rounded">
                HARDWARE PRINTABLE AREA
              </span>
            </div>
          )}

          {/* Active Redaction Drag Box Visualizer */}
          {currentDragBox && (
            <div
              style={{
                left: `${currentDragBox.xPct}%`,
                top: `${currentDragBox.yPct}%`,
                width: `${currentDragBox.widthPct}%`,
                height: `${currentDragBox.heightPct}%`,
              }}
              className="absolute bg-black border-2 border-red-500 pointer-events-none"
            />
          )}

          {/* Existing Redactions Overlay Visualizer */}
          {redactions
            .filter(r => r.pageIndex === pageIndex)
            .map(r => (
              <div
                key={r.id}
                style={{
                  left: `${r.xPct}%`,
                  top: `${r.yPct}%`,
                  width: `${r.widthPct}%`,
                  height: `${r.heightPct}%`,
                }}
                className="absolute bg-black pointer-events-none group"
              >
                <span className="text-[8px] font-mono text-red-400 opacity-60 absolute top-0.5 left-1">
                  CENSORED
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
