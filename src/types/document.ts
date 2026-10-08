export interface PageItem {
  id: string;
  pageNumber: number;
  sourceFileName: string;
  sourceFileType: string;
  widthPt: number;  // 72 pt per inch standard
  heightPt: number;
  rotation: number; // 0, 90, 180, 270
  canvasPreviewUrl?: string; // High-res preview data URL
  renderedBlob?: Blob;
  originalData?: ArrayBuffer | string;
  isCustomBlank?: boolean;
}

export interface DocumentItem {
  id: string;
  name: string;
  sizeBytes: number;
  type: string;
  uploadedAt: number;
  pages: PageItem[];
}

export type UnitType = 'mm' | 'in' | 'pt';

export interface PhysicalMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
  isLinked: boolean;
}

export interface CustomPaperSize {
  name: string;
  widthMm: number;
  heightMm: number;
}
