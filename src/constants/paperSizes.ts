export interface PaperSizeSpec {
  id: string;
  name: string;
  category: 'ISO A' | 'US ANSI' | 'Photo' | 'Card' | 'Custom';
  widthMm: number;
  heightMm: number;
  widthPt: number; // 72 pt per inch
  heightPt: number;
}

export const MM_TO_PT = 72 / 25.4;
export const INCH_TO_MM = 25.4;
export const INCH_TO_PT = 72;

export const STANDARD_PAPER_SIZES: PaperSizeSpec[] = [
  // ISO A Series
  { id: 'a4', name: 'A4 (210 × 297 mm)', category: 'ISO A', widthMm: 210, heightMm: 297, widthPt: 210 * MM_TO_PT, heightPt: 297 * MM_TO_PT },
  { id: 'a3', name: 'A3 (297 × 420 mm)', category: 'ISO A', widthMm: 297, heightMm: 420, widthPt: 297 * MM_TO_PT, heightPt: 420 * MM_TO_PT },
  { id: 'a5', name: 'A5 (148 × 210 mm)', category: 'ISO A', widthMm: 148, heightMm: 210, widthPt: 148 * MM_TO_PT, heightPt: 210 * MM_TO_PT },
  { id: 'a6', name: 'A6 (105 × 148 mm)', category: 'ISO A', widthMm: 105, heightMm: 148, widthPt: 105 * MM_TO_PT, heightPt: 148 * MM_TO_PT },
  { id: 'a2', name: 'A2 (420 × 594 mm)', category: 'ISO A', widthMm: 420, heightMm: 594, widthPt: 420 * MM_TO_PT, heightPt: 594 * MM_TO_PT },
  { id: 'a1', name: 'A1 (594 × 841 mm)', category: 'ISO A', widthMm: 594, heightMm: 841, widthPt: 594 * MM_TO_PT, heightPt: 841 * MM_TO_PT },
  { id: 'a0', name: 'A0 (841 × 1189 mm)', category: 'ISO A', widthMm: 841, heightMm: 1189, widthPt: 841 * MM_TO_PT, heightPt: 1189 * MM_TO_PT },

  // US ANSI / Traditional
  { id: 'letter', name: 'US Letter (8.5 × 11 in)', category: 'US ANSI', widthMm: 215.9, heightMm: 279.4, widthPt: 8.5 * 72, heightPt: 11 * 72 },
  { id: 'legal', name: 'US Legal (8.5 × 14 in)', category: 'US ANSI', widthMm: 215.9, heightMm: 355.6, widthPt: 8.5 * 72, heightPt: 14 * 72 },
  { id: 'tabloid', name: 'US Tabloid (11 × 17 in)', category: 'US ANSI', widthMm: 279.4, heightMm: 431.8, widthPt: 11 * 72, heightPt: 17 * 72 },
  { id: 'ledger', name: 'US Ledger (17 × 11 in)', category: 'US ANSI', widthMm: 431.8, heightMm: 279.4, widthPt: 17 * 72, heightPt: 11 * 72 },

  // Photo
  { id: 'photo-4x6', name: 'Photo 4 × 6 in (10 × 15 cm)', category: 'Photo', widthMm: 101.6, heightMm: 152.4, widthPt: 4 * 72, heightPt: 6 * 72 },
  { id: 'photo-5x7', name: 'Photo 5 × 7 in (13 × 18 cm)', category: 'Photo', widthMm: 127.0, heightMm: 177.8, widthPt: 5 * 72, heightPt: 7 * 72 },
  { id: 'photo-8x10', name: 'Photo 8 × 10 in (20 × 25 cm)', category: 'Photo', widthMm: 203.2, heightMm: 254.0, widthPt: 8 * 72, heightPt: 10 * 72 },

  // Cards
  { id: 'index-3x5', name: 'Index Card 3 × 5 in', category: 'Card', widthMm: 76.2, heightMm: 127.0, widthPt: 3 * 72, heightPt: 5 * 72 },
  { id: 'index-4x6', name: 'Index Card 4 × 6 in', category: 'Card', widthMm: 101.6, heightMm: 152.4, widthPt: 4 * 72, heightPt: 6 * 72 },
  { id: 'index-5x8', name: 'Index Card 5 × 8 in', category: 'Card', widthMm: 127.0, heightMm: 203.2, widthPt: 5 * 72, heightPt: 8 * 72 },
];

export const MARGIN_PRESETS = [
  { id: 'zero', name: 'Zero Margin / Borderless', top: 0, bottom: 0, left: 0, right: 0 },
  { id: 'minimal', name: 'Minimal (6 mm / 0.24 in)', top: 6, bottom: 6, left: 6, right: 6 },
  { id: 'standard', name: 'Standard Office (20 mm / 0.79 in)', top: 20, bottom: 20, left: 20, right: 20 },
  { id: 'book_gutter', name: 'Book Binding Gutter (Left 25 mm, Others 15 mm)', top: 15, bottom: 15, left: 25, right: 15 },
];
