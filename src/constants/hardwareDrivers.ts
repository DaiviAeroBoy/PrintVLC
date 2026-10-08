import { OfficialDriverLink } from '../types/hardware';

export const PRINTER_BRANDS = [
  'HP',
  'Canon',
  'Epson',
  'Brother',
  'Zebra',
  'Pantum',
  'Ricoh',
  'Samsung',
  'Dymo',
  'Kyocera',
  'Konica Minolta',
  'Xerox'
];

export const OFFICIAL_DRIVER_PORTALS: OfficialDriverLink[] = [
  {
    brand: 'All',
    name: 'OpenPrinting Database',
    url: 'https://www.openprinting.org/printers',
    description: 'Universal Linux/UNIX & Cups Driver Database'
  },
  {
    brand: 'HP',
    name: 'HP Support Hub',
    url: 'https://support.hp.com/us-en/drivers/printers',
    description: 'Official HP LaserJet, DeskJet, OfficeJet & DesignJet software'
  },
  {
    brand: 'Canon',
    name: 'Canon Global Support',
    url: 'https://global.canon/en/support/',
    description: 'Official Canon PIXMA, imageRUNNER, imageCLASS drivers'
  },
  {
    brand: 'Epson',
    name: 'Epson Setup & Support',
    url: 'https://epson.com/Support/sl/s',
    description: 'Official Epson EcoTank, WorkForce, Expression drivers'
  },
  {
    brand: 'Brother',
    name: 'Brother Solutions Center',
    url: 'https://support.brother.com/g/b/countrytop.aspx',
    description: 'Official Brother HL, MFC, DCP printer drivers & firmware'
  },
  {
    brand: 'Zebra',
    name: 'Zebra Printer Downloads',
    url: 'https://www.zebra.com/us/en/support-downloads/printers.html',
    description: 'Zebra ZPL, EPL, thermal label & barcode printer drivers'
  }
];

export function detectClientOS(): string {
  if (typeof window === 'undefined') return 'Windows 11/10';
  const ua = navigator.userAgent;
  if (/Windows NT 10.0|Windows NT 11.0/i.test(ua)) return 'Windows 11/10';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  return 'Windows 11/10';
}

export function generateDriverSearchUrl(brand: string, model: string, os: string): string {
  const query = `${encodeURIComponent(brand)} ${encodeURIComponent(model)} official driver download ${encodeURIComponent(os)}`;
  return `https://www.google.com/search?q=${query}`;
}
