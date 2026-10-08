export type ScaleMode = 'fit' | 'fill' | 'custom' | 'exact_mm';

export interface BorderSettings {
  enabled: boolean;
  style: 'solid' | 'dashed' | 'double';
  thicknessMm: number;
  color: string;
}

export interface ImpositionSettings {
  mode: 'single' | 'nup' | 'booklet' | 'poster' | 'id_photo';
  nupCount: 1 | 2 | 4 | 6 | 8 | 9 | 16;
  cellGapMm: number;
  showCutLines: boolean;
  
  // Booklet settings
  bookletSignatureSize: number;
  spineGutterMm: number;
  paperGsm: number; // for creep compensation
  showFoldMarks: boolean;
  
  // Poster tiling settings
  posterCols: number;
  posterRows: number;
  glueTabMm: number;
  cutCrosshairs: boolean;
  coordinateStamps: boolean;
  
  // ID photo multiplier
  idCutCount: 6 | 8 | 12;
}

export interface DeskewSettings {
  autoDeskewAngle: number;
  manualAngle: number; // -45 to +45
  perspectivePins: {
    topLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
  } | null;
  autoCropEnabled: boolean;
  cropBounds?: { x: number; y: number; width: number; height: number };
}

export interface CleanupSettings {
  removeHolePunches: boolean;
  removeStaples: boolean;
  removeThumbMarks: boolean;
  removeSpineGutterShadows: boolean;
  suppressGhostTextThreshold: number; // 0 to 100
  normalizePaperWhiteThreshold: number; // 0 to 100
}

export interface WatermarkSettings {
  enabled: boolean;
  text: string;
  isDiagonal: boolean;
  opacity: number; // 5 to 100
  layer: 'behind' | 'over';
  fontSizePt: number;
  color: string;
  customImageDataUrl?: string;
}

export interface HeaderFooterSettings {
  enabled: boolean;
  topLeft: string;
  topCenter: string;
  topRight: string;
  bottomLeft: string;
  bottomCenter: string;
  bottomRight: string;
  fontSizePt: number;
  fontColor: string;
}

export interface RedactionBox {
  id: string;
  pageIndex: number;
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
}

export interface MarkupItem {
  id: string;
  pageIndex: number;
  type: 'highlight' | 'line' | 'rectangle' | 'arrow' | 'note';
  color: string;
  points: { x: number; y: number }[];
  noteText?: string;
}

export interface InkIntelligenceSettings {
  pureKChannelLock: boolean;
  ecoTonerSaver: boolean;
  ecoTonerSavingsPct: number; // e.g. 20%
  darkModeNeutralizer: boolean;
  cmykSoftProof: 'none' | 'matte' | 'glossy' | 'uncoated';
  orphanPageSquisherActive: boolean;
  diagnosticPattern: 'none' | 'cmyk_purge' | 'duplex_alignment';
}

export interface CoverageCalculation {
  cyanPct: number;
  magentaPct: number;
  yellowPct: number;
  blackPct: number;
  totalCoveragePct: number;
  estimatedCostPerSheet: number;
}

export type StationeryType = 'none' | 'graph' | 'isometric' | 'dot' | 'millimeter' | 'ruled' | 'music' | 'planner' | 'calendar';

export interface StationerySettings {
  type: StationeryType;
  gridSpacingMm: number;
  lineColor: string;
  accentColor: string;
}

export interface VariableDataRecord {
  [key: string]: string;
}

export interface VariableDataMergeSettings {
  enabled: boolean;
  records: VariableDataRecord[];
  activeRecordIndex: number;
  barcodeField?: string;
  qrField?: string;
}
