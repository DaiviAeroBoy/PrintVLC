import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import UTIF from 'utif';
import { readPsd } from 'ag-psd';
import DxfParser from 'dxf-parser';
import { renderAsync as renderDocx } from 'docx-preview';
import { PageItem } from '../types/document';
import { storageService } from './storage';

// Configure pdfjs worker if available
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.0.379'}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('pdf.js worker initialization notice', e);
}

/**
 * Universal Document Hopper
 * Ingests any document, raster, vector, hardware, or code stream
 * Normalizes all pages into a unified paginated print queue
 */
export async function ingestFile(file: File): Promise<PageItem[]> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const mimeType = file.type.toLowerCase();

  try {
    // 1. PDF
    if (extension === 'pdf' || mimeType.includes('pdf')) {
      return await ingestPdf(file);
    }

    // 2. Microsoft Word DOCX
    if (extension === 'docx') {
      return await ingestDocx(file);
    }

    // 3. Excel Spreadsheets (XLSX, XLS, CSV, ODS)
    if (['xlsx', 'xls', 'csv', 'ods'].includes(extension)) {
      return await ingestSpreadsheet(file);
    }

    // 4. TIFF Images
    if (['tif', 'tiff'].includes(extension)) {
      return await ingestTiff(file);
    }

    // 5. Adobe Photoshop PSD
    if (extension === 'psd') {
      return await ingestPsd(file);
    }

    // 6. CAD 2D DXF
    if (extension === 'dxf') {
      return await ingestDxf(file);
    }

    // 7. Hardware Streams: ZPL & ESC/POS
    if (['zpl', 'lbl', 'prn'].includes(extension)) {
      return await ingestHardwareZpl(file);
    }
    if (['pos', 'esc', 'bin'].includes(extension)) {
      return await ingestHardwareEscPos(file);
    }

    // 8. Markdown & Source Code & Plain Text
    if (['md', 'markdown', 'js', 'ts', 'tsx', 'jsx', 'py', 'json', 'html', 'css', 'txt', 'rtf', 'log', 'yaml', 'yml'].includes(extension)) {
      return await ingestTextOrCode(file, extension);
    }

    // 9. Standard Raster & Vector (PNG, JPG, WEBP, GIF, BMP, SVG, AVIF)
    if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg', 'avif'].includes(extension) || mimeType.startsWith('image/')) {
      return await ingestStandardImage(file);
    }

    // Fallback: Attempt text reading or generic image
    return await ingestTextOrCode(file, 'txt');
  } catch (err) {
    console.error(`Failed to ingest ${file.name}:`, err);
    return [createErrorFallbackPage(file.name, String(err))];
  }
}

/**
 * PDF Demuxer
 */
async function ingestPdf(file: File): Promise<PageItem[]> {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  const pages: PageItem[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // High-DPI 2x scale
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (ctx) {
      await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
    }

    const previewUrl = canvas.toDataURL('image/png');
    storageService.registerEphemeralBlob(previewUrl);

    pages.push({
      id: `${file.name}-p${i}-${Date.now()}-${Math.random()}`,
      pageNumber: i,
      sourceFileName: file.name,
      sourceFileType: 'PDF',
      widthPt: viewport.width / 2.0,
      heightPt: viewport.height / 2.0,
      rotation: 0,
      canvasPreviewUrl: previewUrl,
    });
  }

  return pages;
}

/**
 * Word DOCX Demuxer
 */
async function ingestDocx(file: File): Promise<PageItem[]> {
  const container = document.createElement('div');
  container.style.width = '794px'; // ~A4 width at 96 DPI
  container.style.background = '#ffffff';
  container.style.color = '#000000';
  container.style.padding = '40px';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  try {
    await renderDocx(file, container, undefined, {
      inWrapper: false,
      ignoreWidth: false,
      breakPages: true
    });

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render formatted text representation
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.fillText(file.name, 60, 80);

    ctx.fillStyle = '#4b5563';
    ctx.font = '16px -apple-system, sans-serif';
    const lines = container.innerText.split('\n').filter(l => l.trim().length > 0);
    let y = 140;
    for (const line of lines.slice(0, 50)) {
      ctx.fillText(line.slice(0, 95), 60, y);
      y += 28;
      if (y > 1520) break;
    }

    const previewUrl = canvas.toDataURL('image/png');
    storageService.registerEphemeralBlob(previewUrl);

    return [{
      id: `${file.name}-p1-${Date.now()}`,
      pageNumber: 1,
      sourceFileName: file.name,
      sourceFileType: 'DOCX',
      widthPt: 595, // A4
      heightPt: 842,
      rotation: 0,
      canvasPreviewUrl: previewUrl
    }];
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Spreadsheet Demuxer (XLSX, CSV)
 */
async function ingestSpreadsheet(file: File): Promise<PageItem[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const pages: PageItem[] = [];

  for (let s = 0; s < Math.min(workbook.SheetNames.length, 5); s++) {
    const sheetName = workbook.SheetNames[s];
    const sheet = workbook.Sheets[sheetName];
    const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title & Sheet header
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 26px "JetBrains Mono", monospace';
    ctx.fillText(`${file.name} — [Sheet: ${sheetName}]`, 50, 60);

    // Draw table grid
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    let startY = 100;
    const colWidth = 180;
    const rowHeight = 36;

    const rowCount = Math.min(data.length, 28);
    const colCount = Math.min(data[0]?.length || 1, 8);

    for (let r = 0; r < rowCount; r++) {
      const rowY = startY + r * rowHeight;
      if (r === 0) {
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(50, rowY, colCount * colWidth, rowHeight);
      }
      ctx.strokeRect(50, rowY, colCount * colWidth, rowHeight);

      for (let c = 0; c < colCount; c++) {
        const cellVal = data[r]?.[c] != null ? String(data[r][c]) : '';
        ctx.fillStyle = r === 0 ? '#0f172a' : '#334155';
        ctx.font = r === 0 ? 'bold 15px -apple-system, sans-serif' : '14px -apple-system, sans-serif';
        ctx.fillText(cellVal.slice(0, 20), 58 + c * colWidth, rowY + 23);
      }
    }

    const previewUrl = canvas.toDataURL('image/png');
    storageService.registerEphemeralBlob(previewUrl);

    pages.push({
      id: `${file.name}-s${s + 1}-${Date.now()}`,
      pageNumber: s + 1,
      sourceFileName: file.name,
      sourceFileType: 'Spreadsheet',
      widthPt: 842, // Landscape A4
      heightPt: 595,
      rotation: 0,
      canvasPreviewUrl: previewUrl
    });
  }

  return pages.length ? pages : [createErrorFallbackPage(file.name, 'Empty workbook')];
}

/**
 * TIFF Demuxer (UTIF)
 */
async function ingestTiff(file: File): Promise<PageItem[]> {
  const buffer = await file.arrayBuffer();
  const ifds = UTIF.decode(buffer);
  const pages: PageItem[] = [];

  for (let i = 0; i < ifds.length; i++) {
    const ifd = ifds[i];
    UTIF.decodeImage(buffer, ifd);
    const rgba = UTIF.toRGBA8(ifd);

    const canvas = document.createElement('canvas');
    canvas.width = ifd.width;
    canvas.height = ifd.height;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(ifd.width, ifd.height);
    imgData.data.set(rgba);
    ctx.putImageData(imgData, 0, 0);

    const previewUrl = canvas.toDataURL('image/png');
    storageService.registerEphemeralBlob(previewUrl);

    pages.push({
      id: `${file.name}-t${i + 1}-${Date.now()}`,
      pageNumber: i + 1,
      sourceFileName: file.name,
      sourceFileType: 'TIFF',
      widthPt: (ifd.width / 96) * 72,
      heightPt: (ifd.height / 96) * 72,
      rotation: 0,
      canvasPreviewUrl: previewUrl
    });
  }

  return pages;
}

/**
 * Adobe PSD Demuxer (ag-psd)
 */
async function ingestPsd(file: File): Promise<PageItem[]> {
  const buffer = await file.arrayBuffer();
  const psd = readPsd(buffer);
  const canvas = psd.canvas as HTMLCanvasElement;
  const previewUrl = canvas ? canvas.toDataURL('image/png') : '';
  storageService.registerEphemeralBlob(previewUrl);

  return [{
    id: `${file.name}-psd-${Date.now()}`,
    pageNumber: 1,
    sourceFileName: file.name,
    sourceFileType: 'PSD',
    widthPt: ((psd.width || 800) / 96) * 72,
    heightPt: ((psd.height || 1000) / 96) * 72,
    rotation: 0,
    canvasPreviewUrl: previewUrl
  }];
}

/**
 * 2D DXF Vector Demuxer
 */
async function ingestDxf(file: File): Promise<PageItem[]> {
  const text = await file.text();
  const parser = new DxfParser();
  const dxf = parser.parseSync(text);

  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1200;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0d1117'; // Dark CAD blueprint background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw CAD grid
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw entities
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;

  if (dxf?.entities) {
    for (const ent of dxf.entities) {
      if (ent.type === 'LINE' && ent.vertices) {
        ctx.beginPath();
        const v0 = ent.vertices[0];
        const v1 = ent.vertices[1];
        ctx.moveTo(v0.x + 800, 600 - v0.y);
        ctx.lineTo(v1.x + 800, 600 - v1.y);
        ctx.stroke();
      } else if (ent.type === 'CIRCLE' && ent.center) {
        ctx.beginPath();
        ctx.arc(ent.center.x + 800, 600 - ent.center.y, ent.radius || 10, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  // Header tag
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillText(`CAD DXF: ${file.name} [Entities: ${dxf?.entities?.length || 0}]`, 40, 50);

  const previewUrl = canvas.toDataURL('image/png');
  storageService.registerEphemeralBlob(previewUrl);

  return [{
    id: `${file.name}-dxf-${Date.now()}`,
    pageNumber: 1,
    sourceFileName: file.name,
    sourceFileType: 'DXF',
    widthPt: 842,
    heightPt: 595,
    rotation: 0,
    canvasPreviewUrl: previewUrl
  }];
}

/**
 * Hardware Code Emulators: ZPL (Zebra)
 */
async function ingestHardwareZpl(file: File): Promise<PageItem[]> {
  const text = await file.text();
  const canvas = document.createElement('canvas');
  canvas.width = 600; // 4x6" label at 150 DPI
  canvas.height = 900;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#e2e8f0';
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px "JetBrains Mono", monospace';
  ctx.fillText('ZEBRA ZPL THERMAL EMULATION', 40, 50);

  // Emulate text commands ^FD ... ^FS
  const regex = /\^FD([^^]+)\^FS/g;
  let match;
  let y = 100;
  while ((match = regex.exec(text)) !== null) {
    ctx.font = 'bold 18px monospace';
    ctx.fillText(match[1], 40, y);
    y += 32;
    if (y > 750) break;
  }

  // Draw simulated barcode
  ctx.fillStyle = '#000000';
  for (let bx = 50; bx < 500; bx += Math.floor(Math.random() * 8) + 3) {
    ctx.fillRect(bx, 780, Math.floor(Math.random() * 4) + 1, 60);
  }

  const previewUrl = canvas.toDataURL('image/png');
  storageService.registerEphemeralBlob(previewUrl);

  return [{
    id: `${file.name}-zpl-${Date.now()}`,
    pageNumber: 1,
    sourceFileName: file.name,
    sourceFileType: 'ZPL Hardware Code',
    widthPt: 288, // 4 inches
    heightPt: 432, // 6 inches
    rotation: 0,
    canvasPreviewUrl: previewUrl
  }];
}

/**
 * Hardware Code Emulators: ESC/POS (Thermal Receipt)
 */
async function ingestHardwareEscPos(file: File): Promise<PageItem[]> {
  const text = await file.text();
  const canvas = document.createElement('canvas');
  canvas.width = 576; // 80mm receipt at 180 DPI
  canvas.height = 800;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#1e293b';
  ctx.font = '16px "JetBrains Mono", monospace';
  ctx.fillText('=== ESC/POS THERMAL RECEIPT ===', 80, 40);

  const lines = text.split('\n');
  let y = 80;
  for (const line of lines.slice(0, 25)) {
    ctx.fillText(line.replace(/[\x00-\x1F]/g, ' '), 30, y);
    y += 26;
  }

  const previewUrl = canvas.toDataURL('image/png');
  storageService.registerEphemeralBlob(previewUrl);

  return [{
    id: `${file.name}-escpos-${Date.now()}`,
    pageNumber: 1,
    sourceFileName: file.name,
    sourceFileType: 'ESC/POS Receipt',
    widthPt: 226, // 80mm
    heightPt: 500,
    rotation: 0,
    canvasPreviewUrl: previewUrl
  }];
}

/**
 * Text, Markdown & Code Files (with Syntax Highlighting & Line Numbers)
 */
async function ingestTextOrCode(file: File, ext: string): Promise<PageItem[]> {
  const text = await file.text();
  const lines = text.split('\n');
  const linesPerPage = 45;
  const totalPages = Math.max(1, Math.ceil(lines.length / linesPerPage));
  const pages: PageItem[] = [];

  for (let p = 0; p < totalPages; p++) {
    const chunk = lines.slice(p * linesPerPage, (p + 1) * linesPerPage);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Code header
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.fillText(`${file.name} [Page ${p + 1}/${totalPages}]`, 60, 60);

    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(50, 80, canvas.width - 100, canvas.height - 140);

    // Line numbers and code
    let y = 120;
    for (let idx = 0; idx < chunk.length; idx++) {
      const lineNum = p * linesPerPage + idx + 1;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px "JetBrains Mono", monospace';
      ctx.fillText(String(lineNum).padStart(4, ' '), 65, y);

      ctx.fillStyle = ext === 'md' ? '#1e293b' : '#0369a1';
      ctx.fillText(chunk[idx].slice(0, 90), 120, y);
      y += 28;
    }

    const previewUrl = canvas.toDataURL('image/png');
    storageService.registerEphemeralBlob(previewUrl);

    pages.push({
      id: `${file.name}-p${p + 1}-${Date.now()}`,
      pageNumber: p + 1,
      sourceFileName: file.name,
      sourceFileType: ext.toUpperCase(),
      widthPt: 595,
      heightPt: 842,
      rotation: 0,
      canvasPreviewUrl: previewUrl
    });
  }

  return pages;
}

/**
 * Standard Raster and Vector Images
 */
async function ingestStandardImage(file: File): Promise<PageItem[]> {
  const url = URL.createObjectURL(file);
  storageService.registerEphemeralBlob(url);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const widthPt = (img.naturalWidth / 96) * 72;
      const heightPt = (img.naturalHeight / 96) * 72;

      // Draw to canvas for high DPI preview
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const previewUrl = canvas.toDataURL('image/png');
      storageService.registerEphemeralBlob(previewUrl);

      resolve([{
        id: `${file.name}-${Date.now()}`,
        pageNumber: 1,
        sourceFileName: file.name,
        sourceFileType: 'Image',
        widthPt,
        heightPt,
        rotation: 0,
        canvasPreviewUrl: previewUrl
      }]);
    };
    img.onerror = () => {
      resolve([createErrorFallbackPage(file.name, 'Could not decode image')]);
    };
    img.src = url;
  });
}

function createErrorFallbackPage(fileName: string, error: string): PageItem {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#1e1e24';
  ctx.fillRect(0, 0, 800, 1000);
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 24px monospace';
  ctx.fillText('FILE INGESTION ERROR', 50, 100);
  ctx.fillStyle = '#e5e7eb';
  ctx.font = '16px monospace';
  ctx.fillText(`File: ${fileName}`, 50, 150);
  ctx.fillText(`Reason: ${error}`, 50, 190);

  const previewUrl = canvas.toDataURL('image/png');
  return {
    id: `err-${Date.now()}`,
    pageNumber: 1,
    sourceFileName: fileName,
    sourceFileType: 'Corrupted',
    widthPt: 595,
    heightPt: 842,
    rotation: 0,
    canvasPreviewUrl: previewUrl
  };
}

/**
 * Universal Multi-Drop Hopper
 * Stitches multiple heterogeneous files into one continuous paginated queue
 */
export async function stitchDocumentHopper(files: File[]): Promise<PageItem[]> {
  const queue: PageItem[] = [];
  let cumulativePageNumber = 1;

  for (const file of files) {
    const pages = await ingestFile(file);
    for (const page of pages) {
      page.pageNumber = cumulativePageNumber++;
      queue.push(page);
    }
  }

  return queue;
}
