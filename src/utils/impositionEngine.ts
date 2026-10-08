import { PageItem } from '../types/document';
import { ImpositionSettings } from '../types/studio';
import { mmToPixels } from './paperGeometry';

export interface ImposedSheet {
  sheetIndex: number;
  label: string;
  sourcePages: {
    page: PageItem;
    xPct: number;
    yPct: number;
    widthPct: number;
    heightPct: number;
    creepOffsetX?: number;
  }[];
  cutLines?: { x1Pct: number; y1Pct: number; x2Pct: number; y2Pct: number }[];
  spineFoldX?: number; // X percentage where center fold/staple sits
  posterTileCoord?: string; // e.g., 'R1-C1'
  glueTabMm?: number;
}

/**
 * Generate Imposed Sheets based on imposition configuration
 */
export function generateImposition(
  pages: PageItem[],
  settings: ImpositionSettings,
  paperWidthMm: number,
  paperHeightMm: number
): ImposedSheet[] {
  if (pages.length === 0) return [];

  switch (settings.mode) {
    case 'nup':
      return generateNUpSheets(pages, settings.nupCount, settings.cellGapMm, settings.showCutLines, paperWidthMm, paperHeightMm);
    case 'booklet':
      return generateBookletSheets(pages, settings.spineGutterMm, settings.paperGsm, settings.showFoldMarks);
    case 'poster':
      return generatePosterSheets(pages[0], settings.posterCols, settings.posterRows, settings.glueTabMm, settings.cutCrosshairs, settings.coordinateStamps);
    case 'id_photo':
      return generateIdPhotoSheets(pages[0], settings.idCutCount);
    case 'single':
    default:
      return pages.map((page, idx) => ({
        sheetIndex: idx + 1,
        label: `Page ${idx + 1}`,
        sourcePages: [{
          page,
          xPct: 0,
          yPct: 0,
          widthPct: 100,
          heightPct: 100
        }]
      }));
  }
}

/**
 * N-Up Imposition (1, 2, 4, 6, 8, 9, 16)
 */
function generateNUpSheets(
  pages: PageItem[],
  nupCount: 1 | 2 | 4 | 6 | 8 | 9 | 16,
  cellGapMm: number,
  showCutLines: boolean,
  paperWidthMm: number,
  paperHeightMm: number
): ImposedSheet[] {
  const gridConfigs: Record<number, { cols: number; rows: number }> = {
    1: { cols: 1, rows: 1 },
    2: { cols: 2, rows: 1 },
    4: { cols: 2, rows: 2 },
    6: { cols: 3, rows: 2 },
    8: { cols: 4, rows: 2 },
    9: { cols: 3, rows: 3 },
    16: { cols: 4, rows: 4 },
  };

  const { cols, rows } = gridConfigs[nupCount] || { cols: 1, rows: 1 };
  const pagesPerSheet = cols * rows;
  const numSheets = Math.ceil(pages.length / pagesPerSheet);
  const sheets: ImposedSheet[] = [];

  const gapXPct = (cellGapMm / paperWidthMm) * 100;
  const gapYPct = (cellGapMm / paperHeightMm) * 100;
  const cellWidthPct = (100 - gapXPct * (cols + 1)) / cols;
  const cellHeightPct = (100 - gapYPct * (rows + 1)) / rows;

  for (let s = 0; s < numSheets; s++) {
    const sheetPages: ImposedSheet['sourcePages'] = [];
    const cutLines: ImposedSheet['cutLines'] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const pageIdx = s * pagesPerSheet + (r * cols + c);
        if (pageIdx < pages.length) {
          const x = gapXPct + c * (cellWidthPct + gapXPct);
          const y = gapYPct + r * (cellHeightPct + gapYPct);
          sheetPages.push({
            page: pages[pageIdx],
            xPct: x,
            yPct: y,
            widthPct: cellWidthPct,
            heightPct: cellHeightPct
          });
        }
      }
    }

    if (showCutLines) {
      for (let c = 1; c < cols; c++) {
        const lineX = (c / cols) * 100;
        cutLines.push({ x1Pct: lineX, y1Pct: 0, x2Pct: lineX, y2Pct: 100 });
      }
      for (let r = 1; r < rows; r++) {
        const lineY = (r / rows) * 100;
        cutLines.push({ x1Pct: 0, y1Pct: lineY, x2Pct: 100, y2Pct: lineY });
      }
    }

    sheets.push({
      sheetIndex: s + 1,
      label: `Sheet ${s + 1} (${nupCount}-Up)`,
      sourcePages: sheetPages,
      cutLines
    });
  }

  return sheets;
}

/**
 * Pro Booklet Maker (Saddle Stitch with Creep Compensation)
 */
function generateBookletSheets(
  pages: PageItem[],
  spineGutterMm: number,
  paperGsm: number,
  showFoldMarks: boolean
): ImposedSheet[] {
  // Pad to multiple of 4
  const paddedPages = [...pages];
  while (paddedPages.length % 4 !== 0) {
    paddedPages.push({
      id: `blank-pad-${paddedPages.length}`,
      pageNumber: paddedPages.length + 1,
      sourceFileName: 'Blank Pad',
      sourceFileType: 'Blank',
      widthPt: pages[0]?.widthPt || 595,
      heightPt: pages[0]?.heightPt || 842,
      rotation: 0,
      isCustomBlank: true
    });
  }

  const total = paddedPages.length;
  const numSheets = total / 4;
  const sheets: ImposedSheet[] = [];

  // Sheet thickness approximation in mm based on GSM (e.g. 80gsm ~ 0.1mm)
  const sheetThicknessMm = (paperGsm / 800);

  for (let s = 0; s < numSheets; s++) {
    // Creep compensation: outer sheets need shingling offset compared to inner sheets
    const creepMm = (numSheets - s - 1) * sheetThicknessMm;
    const creepOffsetPct = (creepMm / 210) * 100; // Normalized to A4 half width

    // Front of sheet: Left = Page (total - 2s), Right = Page (2s + 1)
    const pFrontLeft = paddedPages[total - 2 * s - 1];
    const pFrontRight = paddedPages[2 * s];

    sheets.push({
      sheetIndex: s * 2 + 1,
      label: `Booklet Sheet ${s + 1} (Front: p.${pFrontLeft.pageNumber} & p.${pFrontRight.pageNumber})`,
      spineFoldX: 50,
      sourcePages: [
        {
          page: pFrontLeft,
          xPct: 0,
          yPct: 0,
          widthPct: 50,
          heightPct: 100,
          creepOffsetX: -creepOffsetPct
        },
        {
          page: pFrontRight,
          xPct: 50,
          yPct: 0,
          widthPct: 50,
          heightPct: 100,
          creepOffsetX: creepOffsetPct
        }
      ]
    });

    // Back of sheet: Left = Page (2s + 2), Right = Page (total - 2s - 1)
    const pBackLeft = paddedPages[2 * s + 1];
    const pBackRight = paddedPages[total - 2 * s - 2];

    sheets.push({
      sheetIndex: s * 2 + 2,
      label: `Booklet Sheet ${s + 1} (Back: p.${pBackLeft.pageNumber} & p.${pBackRight.pageNumber})`,
      spineFoldX: 50,
      sourcePages: [
        {
          page: pBackLeft,
          xPct: 0,
          yPct: 0,
          widthPct: 50,
          heightPct: 100,
          creepOffsetX: creepOffsetPct
        },
        {
          page: pBackRight,
          xPct: 50,
          yPct: 0,
          widthPct: 50,
          heightPct: 100,
          creepOffsetX: -creepOffsetPct
        }
      ]
    });
  }

  return sheets;
}

/**
 * Poster / Tiling Slicer
 */
function generatePosterSheets(
  page: PageItem,
  cols: number,
  rows: number,
  glueTabMm: number,
  cutCrosshairs: boolean,
  coordinateStamps: boolean
): ImposedSheet[] {
  if (!page) return [];
  const sheets: ImposedSheet[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const coord = `R${r + 1}-C${c + 1}`;
      sheets.push({
        sheetIndex: r * cols + c + 1,
        label: `Poster Tile ${coord} of ${rows * cols}`,
        posterTileCoord: coord,
        glueTabMm,
        sourcePages: [{
          page,
          xPct: -c * 100,
          yPct: -r * 100,
          widthPct: cols * 100,
          heightPct: rows * 100
        }]
      });
    }
  }

  return sheets;
}

/**
 * ID Photo Multiplier (6, 8, 12 cuts on 4x6" template)
 */
function generateIdPhotoSheets(
  page: PageItem,
  cuts: 6 | 8 | 12
): ImposedSheet[] {
  if (!page) return [];

  const cutConfigs: Record<number, { cols: number; rows: number }> = {
    6: { cols: 3, rows: 2 },
    8: { cols: 4, rows: 2 },
    12: { cols: 4, rows: 3 },
  };

  const { cols, rows } = cutConfigs[cuts] || { cols: 3, rows: 2 };
  const sourcePages: ImposedSheet['sourcePages'] = [];
  const cutLines: ImposedSheet['cutLines'] = [];

  const wPct = 90 / cols;
  const hPct = 90 / rows;
  const startXPct = 5;
  const startYPct = 5;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      sourcePages.push({
        page,
        xPct: startXPct + c * wPct + 1,
        yPct: startYPct + r * hPct + 1,
        widthPct: wPct - 2,
        heightPct: hPct - 2
      });
    }
  }

  // Add cut guide lines
  for (let c = 1; c < cols; c++) {
    const x = startXPct + c * wPct;
    cutLines.push({ x1Pct: x, y1Pct: 0, x2Pct: x, y2Pct: 100 });
  }
  for (let r = 1; r < rows; r++) {
    const y = startYPct + r * hPct;
    cutLines.push({ x1Pct: 0, y1Pct: y, x2Pct: 100, y2Pct: y });
  }

  return [{
    sheetIndex: 1,
    label: `ID Photo Template (${cuts} Passport/ID Cuts on 4x6")`,
    sourcePages,
    cutLines
  }];
}
