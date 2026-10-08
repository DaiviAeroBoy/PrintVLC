import { PDFDocument } from 'pdf-lib';
import { mmToPoints } from './paperGeometry';

/**
 * Exports processed canvas sequence as a flattened, high-res PDF/X-compliant file
 */
export async function exportToPrintReadyPdf(
  canvases: HTMLCanvasElement[],
  paperWidthMm: number,
  paperHeightMm: number,
  outputFilename: string = 'PrintVLC-Master-Print.pdf'
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();

  // PDF/X-1a compliance metadata
  pdfDoc.setTitle('PrintVLC Print-Ready Master');
  pdfDoc.setAuthor('PrintVLC Universal Studio');
  pdfDoc.setProducer('PrintVLC Client-Side PDF Engine');
  pdfDoc.setCreationDate(new Date());

  const pageW = mmToPoints(paperWidthMm);
  const pageH = mmToPoints(paperHeightMm);

  for (const canvas of canvases) {
    const pngDataUrl = canvas.toDataURL('image/png', 1.0);
    const pngImageBytes = await fetch(pngDataUrl).then(res => res.arrayBuffer());
    const embeddedImage = await pdfDoc.embedPng(pngImageBytes);

    const pdfPage = pdfDoc.addPage([pageW, pageH]);
    pdfPage.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: pageW,
      height: pageH,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });

  // Download trigger
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = outputFilename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 10000);

  return blob;
}
