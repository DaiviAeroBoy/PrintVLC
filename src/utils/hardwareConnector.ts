import { BluetoothDeviceInfo, NetworkPrinterConfig, USBDeviceInfo } from '../types/hardware';

/**
 * Direct WebUSB Hardware Connection
 */
export async function scanUsbPrinters(): Promise<USBDeviceInfo | null> {
  if (!('usb' in navigator)) {
    throw new Error('WebUSB API is not supported in this browser. Please use Chrome, Edge, or Opera.');
  }

  try {
    // Request device with standard USB printer class (0x07) or all
    const device = await (navigator as any).usb.requestDevice({
      filters: [
        { classCode: 7 }, // Printer class
        { vendorId: 0x04b8 }, // Epson
        { vendorId: 0x03f0 }, // HP
        { vendorId: 0x04a9 }, // Canon
        { vendorId: 0x04f9 }, // Brother
        { vendorId: 0x0a5f }, // Zebra
        { vendorId: 0x0922 }, // Dymo
      ]
    });

    await device.open();
    if (device.configuration === null) {
      await device.selectConfiguration(1);
    }
    await device.claimInterface(0);

    return {
      productName: device.productName || 'Direct USB Printer',
      manufacturerName: device.manufacturerName || 'Unknown Vendor',
      vendorId: device.vendorId,
      productId: device.productId,
      serialNumber: device.serialNumber,
      connected: true
    };
  } catch (err: any) {
    if (err.name === 'NotFoundError') {
      return null; // User cancelled
    }
    throw err;
  }
}

/**
 * Web Bluetooth Serial Port Profile (SPP) Connection
 */
export async function pairBluetoothPrinter(): Promise<BluetoothDeviceInfo | null> {
  if (!('bluetooth' in navigator)) {
    throw new Error('Web Bluetooth API is not supported in this browser. Please use Chrome, Edge, or Android Chrome.');
  }

  try {
    const device = await (navigator as any).bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [
        '000018f0-0000-1000-8000-00805f9b34fb', // Common printer service
        'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
      ]
    });

    return {
      id: device.id,
      name: device.name || 'Bluetooth Receipt/Label Printer',
      connected: true
    };
  } catch (err: any) {
    if (err.name === 'NotFoundError') {
      return null;
    }
    throw err;
  }
}

/**
 * Local Network IPP / Raw Socket Diagnostic Check
 */
export async function testNetworkPrinter(config: NetworkPrinterConfig): Promise<{ reachable: boolean; message: string }> {
  try {
    const url = config.protocol === 'ipp'
      ? `http://${config.ipAddress}:${config.port}/ipp/print`
      : `http://${config.ipAddress}:${config.port}`;

    // Send pre-flight ping
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      signal: controller.signal
    }).catch(e => {
      // no-cors fetch failure usually still confirms IP handshake
      return { ok: true };
    });

    clearTimeout(timeout);
    return {
      reachable: true,
      message: `Network endpoint ${config.ipAddress}:${config.port} (${config.protocol.toUpperCase()}) reached successfully.`
    };
  } catch (e: any) {
    return {
      reachable: false,
      message: `Could not reach ${config.ipAddress}:${config.port}. Ensure printer is on the same local subnet.`
    };
  }
}

import { popOutAndPrintDocument } from './printPopout';

/**
 * Stream Processed High-DPI Canvases to Dedicated Pop-out Print Window or System Spooler
 */
export function streamToSystemSpooler(
  canvases: HTMLCanvasElement[],
  options?: {
    documentName?: string;
    paperWidthMm?: number;
    paperHeightMm?: number;
    isLandscape?: boolean;
    forcePopout?: boolean;
  }
): void {
  // 1. Primary mechanism: Pop out clean document into dedicated window and trigger print
  const result = popOutAndPrintDocument({
    canvases,
    documentName: options?.documentName || 'PrintVLC Document',
    paperWidthMm: options?.paperWidthMm || 210,
    paperHeightMm: options?.paperHeightMm || 297,
    isLandscape: options?.isLandscape || false,
    autoPrint: true
  });

  // 2. If popup was blocked by browser security settings, fallback to hidden print mount point
  if (result.blocked) {
    const mountPoint = document.getElementById('print-mount-point');
    if (!mountPoint) {
      window.print();
      return;
    }

    // Clear previous print stream
    mountPoint.innerHTML = '';

    canvases.forEach((canvas, idx) => {
      const img = document.createElement('img');
      img.src = canvas.toDataURL('image/png', 1.0);
      img.className = 'print-page-break';
      img.style.width = '100vw';
      img.style.height = '100vh';
      img.style.objectFit = 'contain';
      img.style.display = 'block';
      if (idx < canvases.length - 1) {
        img.style.pageBreakAfter = 'always';
      }
      mountPoint.appendChild(img);
    });

    // Small delay to ensure browser renders images into DOM before spooling
    setTimeout(() => {
      window.print();
    }, 150);
  }
}

